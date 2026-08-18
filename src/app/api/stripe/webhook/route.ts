import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { safeSecurityLog } from "@/lib/security";

export const runtime = "nodejs";

const MAX_WEBHOOK_BODY_BYTES = 256 * 1024;

class WebhookBodyTooLargeError extends Error {}

function response(status = 200) {
  return NextResponse.json(
    { received: status === 200 },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

async function readLimitedWebhookBody(request: NextRequest): Promise<string> {
  const declaredLength = request.headers.get("content-length");
  if (declaredLength) {
    if (!/^\d+$/.test(declaredLength)) throw new Error("Invalid content length");
    const bytes = Number(declaredLength);
    if (!Number.isSafeInteger(bytes) || bytes > MAX_WEBHOOK_BODY_BYTES) {
      throw new WebhookBodyTooLargeError();
    }
  }

  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_WEBHOOK_BODY_BYTES) {
        await reader.cancel();
        throw new WebhookBodyTooLargeError();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  return Buffer.concat(chunks.map((chunk) => Buffer.from(chunk))).toString(
    "utf8",
  );
}

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!secret || !signature) return response(400);

  let rawBody: string;
  try {
    rawBody = await readLimitedWebhookBody(request);
  } catch (error) {
    if (error instanceof WebhookBodyTooLargeError) {
      safeSecurityLog("stripe_webhook_body_too_large");
      return response(413);
    }
    safeSecurityLog("stripe_webhook_body_invalid");
    return response(400);
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, secret);
  } catch {
    safeSecurityLog("stripe_webhook_signature_failed");
    return response(400);
  }

  // Paid access is derived from Stripe's current PaymentIntent and Charge
  // state when Checkout returns and again before each analysis. Refund events
  // therefore need no mutable local or Stripe metadata state, and duplicates
  // or out-of-order delivery cannot make entitlement state stale.
  safeSecurityLog(
    `stripe_webhook_${event.type.replace(/[^a-z0-9._-]/gi, "")}`,
  );
  return response();
}
