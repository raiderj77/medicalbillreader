import { NextRequest, NextResponse } from "next/server";
import { getStripe, PRICES, SUBSCRIPTION_MONTHLY_CAP } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe is not configured." },
        { status: 500 }
      );
    }

    const { priceType } = await request.json();

    const origin = request.headers.get("origin") || "http://localhost:3000";
    const successUrl = `${origin}/api/checkout/confirm?session_id={CHECKOUT_SESSION_ID}`;

    const stripe = getStripe();

    if (priceType === "per-use") {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: PRICES.perUse.currency,
              product_data: {
                name: "Medical Bill Analysis, Single Use",
                description:
                  "One-time medical bill or EOB analysis with a full plain-English report",
              },
              unit_amount: PRICES.perUse.amount,
            },
            quantity: 1,
          },
        ],
        success_url: successUrl,
        cancel_url: `${origin}/pricing?payment=cancelled`,
      });

      return NextResponse.json({ url: session.url });
    }

    if (priceType === "subscription") {
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [
          {
            price_data: {
              currency: PRICES.monthly.currency,
              product_data: {
                name: "Medical Bill Analysis, Monthly Plan",
                description: `Up to ${SUBSCRIPTION_MONTHLY_CAP} medical bill or EOB analyses per month with full plain-English reports`,
              },
              unit_amount: PRICES.monthly.amount,
              recurring: {
                interval: "month",
              },
            },
            quantity: 1,
          },
        ],
        success_url: successUrl,
        cancel_url: `${origin}/pricing?payment=cancelled`,
      });

      return NextResponse.json({ url: session.url });
    }

    return NextResponse.json(
      { error: "Invalid price type." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session." },
      { status: 500 }
    );
  }
}
