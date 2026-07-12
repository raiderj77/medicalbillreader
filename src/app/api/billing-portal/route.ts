import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { safeSecurityLog } from "@/lib/security";

export async function POST(request: NextRequest) {
  const subscriptionId = request.cookies.get("mbr_sub_id")?.value;
  if (!subscriptionId || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "An active subscription is required." },
      { status: 401 },
    );
  }

  try {
    const stripe = getStripe();
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    if (
      subscription.metadata?.mbr_entitlement !== "subscription" ||
      typeof subscription.customer !== "string"
    ) {
      return NextResponse.json(
        { error: "An active subscription is required." },
        { status: 401 },
      );
    }

    const origin = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.customer,
      return_url: `${origin}/pricing`,
    });
    return NextResponse.json({ url: session.url });
  } catch {
    safeSecurityLog("billing_portal_creation_failed");
    return NextResponse.json(
      { error: "Subscription management is temporarily unavailable." },
      { status: 502 },
    );
  }
}
