import { NextRequest, NextResponse } from "next/server";
import { getProductConfig } from "@/config/product";
import { COMPARISON_PURCHASE_TYPE } from "@/config/comparison-readiness";
import { getStripe, verifiedStripePriceId } from "@/lib/stripe";
import { clientIp, safeSecurityLog } from "@/lib/security";
import { enforceRateLimit } from "@/lib/rate-limit";
import { trustedSiteOrigin } from "@/lib/site-url";
import {
  SensitiveRequestError,
  validateSensitiveJsonRequest,
} from "@/lib/sensitive-request";
import {
  BROWSER_BINDING_COOKIE,
  browserBindingFromRequest,
  checkoutNonceHash,
  createBrowserBinding,
  createCheckoutNonce,
  discardCheckoutNonce,
} from "@/lib/stripe-browser-access";
import {
  ENTITLEMENT_COOKIE_OPTIONS,
  SUBSCRIPTION_COOKIE_MAX_AGE,
} from "@/lib/entitlement-cookies";

const NO_STORE = { "Cache-Control": "no-store" };
const MAX_CHECKOUT_BODY_BYTES = 1_024;

class CheckoutBodyTooLargeError extends Error {}

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NO_STORE });
}

async function readLimitedCheckoutBody(request: NextRequest): Promise<string> {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_CHECKOUT_BODY_BYTES) {
        try {
          await reader.cancel();
        } catch {
          // The size decision is authoritative even if stream cancellation
          // itself races with a disconnected request.
        }
        throw new CheckoutBodyTooLargeError();
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
  let checkoutNonce: string | null = null;
  try {
    validateSensitiveJsonRequest(request);

    const declaredHeader = request.headers.get("content-length");
    if (declaredHeader && !/^\d+$/.test(declaredHeader))
      return json({ error: "Invalid checkout request." }, 400);
    const declaredLength = Number(declaredHeader || 0);
    if (
      !Number.isSafeInteger(declaredLength) ||
      declaredLength > MAX_CHECKOUT_BODY_BYTES
    ) {
      return json({ error: "Checkout request is too large." }, 413);
    }

    let rawBody: string;
    try {
      rawBody = await readLimitedCheckoutBody(request);
    } catch (error) {
      if (error instanceof CheckoutBodyTooLargeError) {
        return json({ error: "Checkout request is too large." }, 413);
      }
      return json({ error: "Invalid checkout request." }, 400);
    }

    let parsedBody: unknown;
    try {
      parsedBody = JSON.parse(rawBody) as unknown;
    } catch {
      return json({ error: "Invalid checkout request." }, 400);
    }

    if (
      !parsedBody ||
      typeof parsedBody !== "object" ||
      Array.isArray(parsedBody) ||
      Object.keys(parsedBody).length !== 1 ||
      !("priceType" in parsedBody)
    ) {
      return json({ error: "Invalid checkout request." }, 400);
    }

    const priceType = (parsedBody as { priceType: unknown }).priceType;
    if (priceType === "subscription") {
      return json({ error: "New monthly subscriptions are not available." }, 410);
    }
    if (priceType === "comparison" || priceType === COMPARISON_PURCHASE_TYPE) {
      return json(
        { error: "Bill and EOB comparison checkout is not available yet." },
        409,
      );
    }
    if (priceType !== "per-use") {
      return json({ error: "Invalid price type." }, 400);
    }

    const config = getProductConfig();
    if (!config.features.singleAnalysis) {
      return json({ error: "Single-analysis checkout is not available." }, 503);
    }

    if (
      !(await enforceRateLimit(
        "checkout-ip",
        clientIp(request.headers),
        10,
        60,
      ))
    ) {
      return json(
        { error: "Too many checkout attempts. Please wait and try again." },
        429,
      );
    }
    if (!process.env.STRIPE_SECRET_KEY) {
      return json({ error: "Stripe is not configured." }, 500);
    }

    const origin = trustedSiteOrigin();
    const currentBinding = browserBindingFromRequest(request);
    const issuedBinding = currentBinding ? null : createBrowserBinding();
    const browserBinding = currentBinding || issuedBinding?.binding;
    if (!browserBinding) throw new Error("Browser binding unavailable");

    checkoutNonce = await createCheckoutNonce(browserBinding, "per-use");
    const nonceHash = checkoutNonceHash(checkoutNonce);
    const successUrl =
      origin +
      "/api/checkout/confirm?nonce=" +
      encodeURIComponent(checkoutNonce) +
      "&session_id={CHECKOUT_SESSION_ID}";

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: await verifiedStripePriceId("per-use"),
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: origin + "/pricing?payment=cancelled",
      metadata: {
        mbr_entitlement: "per_use",
        mbr_checkout_nonce: nonceHash,
      },
      payment_intent_data: { metadata: { mbr_entitlement: "per_use" } },
    });

    const response = json({ url: session.url });
    if (issuedBinding) {
      response.cookies.set(BROWSER_BINDING_COOKIE, issuedBinding.cookieValue, {
        ...ENTITLEMENT_COOKIE_OPTIONS,
        maxAge: SUBSCRIPTION_COOKIE_MAX_AGE,
      });
    }
    checkoutNonce = null;
    return response;
  } catch (error) {
    if (error instanceof SensitiveRequestError) {
      return json({ error: "Invalid checkout request." }, error.status);
    }
    if (checkoutNonce) {
      try {
        await discardCheckoutNonce(checkoutNonce);
      } catch {
        safeSecurityLog("checkout_nonce_cleanup_failed");
      }
    }
    safeSecurityLog("checkout_creation_failed");
    return json({ error: "Failed to create checkout session." }, 500);
  }
}
