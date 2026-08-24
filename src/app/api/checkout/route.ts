import { NextRequest, NextResponse } from "next/server";
import { getStripe, verifiedStripePriceId } from "@/lib/stripe";
import { clientIp, safeSecurityLog } from "@/lib/security";
import { enforceRateLimit } from "@/lib/rate-limit";
import { trustedSiteOrigin } from "@/lib/site-url";
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

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NO_STORE });
}

export async function POST(request: NextRequest) {
  let checkoutNonce: string | null = null;
  try {
    const declaredLength = Number(request.headers.get("content-length") || 0);
    if (declaredLength > MAX_CHECKOUT_BODY_BYTES) {
      return json({ error: "Checkout request is too large." }, 413);
    }

    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_CHECKOUT_BODY_BYTES) {
      return json({ error: "Checkout request is too large." }, 413);
    }

    let body: { priceType?: unknown };
    try {
      body = JSON.parse(rawBody) as { priceType?: unknown };
    } catch {
      return json({ error: "Invalid checkout request." }, 400);
    }
    const priceType = body?.priceType;
    if (priceType === "subscription") {
      return json({ error: "New monthly subscriptions are not available." }, 410);
    }
    if (priceType !== "per-use") {
      return json({ error: "Invalid price type." }, 400);
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

    checkoutNonce = await createCheckoutNonce(browserBinding, priceType);
    const nonceHash = checkoutNonceHash(checkoutNonce);
    const successUrl = `${origin}/api/checkout/confirm?nonce=${encodeURIComponent(checkoutNonce)}&session_id={CHECKOUT_SESSION_ID}`;

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
      cancel_url: `${origin}/pricing?payment=cancelled`,
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
  } catch {
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
