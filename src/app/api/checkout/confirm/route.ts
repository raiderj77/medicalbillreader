import { NextRequest, NextResponse } from "next/server";
import { classifyCompletedCheckout } from "@/lib/entitlement";

// Stripe redirects here after a successful Checkout. We ask Stripe what was
// actually purchased, then set the matching cookie before sending the user
// back to the homepage where the bill analyzer lives. No purchase record is
// stored anywhere except in Stripe.
export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");
  const origin = request.nextUrl.origin;

  if (!sessionId) {
    return NextResponse.redirect(`${origin}/pricing?payment=error`);
  }

  const result = await classifyCompletedCheckout(sessionId);

  if (!result) {
    return NextResponse.redirect(`${origin}/pricing?payment=error`);
  }

  const response = NextResponse.redirect(`${origin}/?payment=success`);

  if (result.type === "per-use") {
    response.cookies.set("mbr_pending_use", sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 2, // 2 hours to complete the analysis
      path: "/",
    });
  } else {
    response.cookies.set("mbr_sub_id", result.subscriptionId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 35, // ~monthly billing cycle plus grace
      path: "/",
    });
    // Non-httpOnly hint cookie so the client can skip the free-tier gate
    // for returning subscribers without needing to read the real cookie.
    response.cookies.set("mbr_sub_active", "1", {
      httpOnly: false,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 35,
      path: "/",
    });
  }

  return response;
}
