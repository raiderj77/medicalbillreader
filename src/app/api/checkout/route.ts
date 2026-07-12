import { NextRequest, NextResponse } from "next/server";
import {
  getStripe,
  stripePriceId,
  SUBSCRIPTION_MONTHLY_CAP,
} from "@/lib/stripe";
import { clientIp, safeSecurityLog } from "@/lib/security";
import { enforceRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    if (
      !(await enforceRateLimit(
        "checkout-ip",
        clientIp(request.headers),
        10,
        60,
      ))
    ) {
      return NextResponse.json(
        { error: "Too many checkout attempts. Please wait and try again." },
        { status: 429 },
      );
    }
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe is not configured." },
        { status: 500 },
      );
    }

    const { priceType } = (await request.json()) as { priceType?: string };

    const origin = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
    const successUrl = `${origin}/api/checkout/confirm?session_id={CHECKOUT_SESSION_ID}`;

    const stripe = getStripe();

    if (priceType === "per-use") {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
          {
            price: stripePriceId("per-use"),
            quantity: 1,
          },
        ],
        success_url: successUrl,
        cancel_url: `${origin}/pricing?payment=cancelled`,
        metadata: { mbr_entitlement: "per_use" },
        payment_intent_data: { metadata: { mbr_entitlement: "per_use" } },
      });

      return NextResponse.json({ url: session.url });
    }

    if (priceType === "subscription") {
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [
          {
            price: stripePriceId("subscription"),
            quantity: 1,
          },
        ],
        success_url: successUrl,
        cancel_url: `${origin}/pricing?payment=cancelled`,
        metadata: { mbr_entitlement: "subscription" },
        subscription_data: {
          metadata: {
            mbr_entitlement: "subscription",
            monthly_cap: String(SUBSCRIPTION_MONTHLY_CAP),
          },
        },
      });

      return NextResponse.json({ url: session.url });
    }

    return NextResponse.json({ error: "Invalid price type." }, { status: 400 });
  } catch {
    safeSecurityLog("checkout_creation_failed");
    return NextResponse.json(
      { error: "Failed to create checkout session." },
      { status: 500 },
    );
  }
}
