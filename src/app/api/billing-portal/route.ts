import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { clientIp, safeSecurityLog } from "@/lib/security";
import { trustedSiteOrigin } from "@/lib/site-url";
import { enforceRateLimit } from "@/lib/rate-limit";
import {
  browserBindingFromRequest,
  openStripeAccess,
} from "@/lib/stripe-browser-access";

const NO_STORE = { "Cache-Control": "no-store" };

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NO_STORE });
}

export async function POST(request: NextRequest) {
  try {
    if (
      !(await enforceRateLimit(
        "billing-portal-ip",
        clientIp(request.headers),
        5,
        60,
      ))
    ) {
      return NextResponse.json(
        { error: "Too many subscription-management attempts." },
        {
          status: 429,
          headers: { ...NO_STORE, "Retry-After": "60" },
        },
      );
    }

    const browserBinding = browserBindingFromRequest(request);
    const subscriptionToken = request.cookies.get("mbr_sub_id")?.value;
    const subscriptionId =
      browserBinding && subscriptionToken && process.env.STRIPE_SECRET_KEY
        ? openStripeAccess(
            subscriptionToken,
            "subscription",
            browserBinding,
          )
        : null;
    if (!browserBinding || !subscriptionId) {
      return json({ error: "A verified subscription is required." }, 401);
    }

    const stripe = getStripe();
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    if (
      subscription.metadata?.mbr_entitlement !== "subscription" ||
      typeof subscription.customer !== "string"
    ) {
      return json({ error: "A verified subscription is required." }, 401);
    }

    const origin = trustedSiteOrigin();
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.customer,
      return_url: `${origin}/pricing`,
    });
    // Portal access is a management capability, not paid-access authority.
    // Never renew entitlement cookies from this route; Checkout confirmation
    // and a fully verified successful subscription analysis are the only
    // renewal paths.
    return json({ url: session.url });
  } catch {
    safeSecurityLog("billing_portal_creation_failed");
    return json(
      { error: "Subscription management is temporarily unavailable." },
      502,
    );
  }
}
