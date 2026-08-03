import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { clientIp, safeSecurityLog } from "@/lib/security";
import { trustedSiteOrigin } from "@/lib/site-url";
import { enforceRateLimit } from "@/lib/rate-limit";
import {
  BROWSER_BINDING_COOKIE,
  browserBindingCookieValue,
  browserBindingFromRequest,
  openStripeAccess,
  sealStripeAccess,
} from "@/lib/stripe-browser-access";
import {
  ENTITLEMENT_COOKIE_OPTIONS,
  SUBSCRIPTION_COOKIE_MAX_AGE,
  SUBSCRIPTION_HINT_COOKIE_OPTIONS,
} from "@/lib/entitlement-cookies";

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
      return json({ error: "An active subscription is required." }, 401);
    }

    const stripe = getStripe();
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    if (
      subscription.metadata?.mbr_entitlement !== "subscription" ||
      typeof subscription.customer !== "string"
    ) {
      return json({ error: "An active subscription is required." }, 401);
    }

    const origin = trustedSiteOrigin();
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.customer,
      return_url: `${origin}/pricing`,
    });
    const response = json({ url: session.url });
    if (
      subscription.status === "active" ||
      subscription.status === "trialing"
    ) {
      response.cookies.set(
        "mbr_sub_id",
        sealStripeAccess(
          "subscription",
          subscriptionId,
          browserBinding,
          SUBSCRIPTION_COOKIE_MAX_AGE,
        ),
        {
          ...ENTITLEMENT_COOKIE_OPTIONS,
          maxAge: SUBSCRIPTION_COOKIE_MAX_AGE,
        },
      );
      response.cookies.set("mbr_sub_active", "1", {
        ...SUBSCRIPTION_HINT_COOKIE_OPTIONS,
        maxAge: SUBSCRIPTION_COOKIE_MAX_AGE,
      });
      response.cookies.set(
        BROWSER_BINDING_COOKIE,
        browserBindingCookieValue(browserBinding),
        {
          ...ENTITLEMENT_COOKIE_OPTIONS,
          maxAge: SUBSCRIPTION_COOKIE_MAX_AGE,
        },
      );
    }
    return response;
  } catch {
    safeSecurityLog("billing_portal_creation_failed");
    return json(
      { error: "Subscription management is temporarily unavailable." },
      502,
    );
  }
}
