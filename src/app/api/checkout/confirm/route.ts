import { NextRequest, NextResponse } from "next/server";
import { classifyCompletedCheckout } from "@/lib/entitlement";
import { isStripeId } from "@/lib/stripe-identifiers";
import { trustedSiteOrigin } from "@/lib/site-url";
import { enforceRateLimit } from "@/lib/rate-limit";
import { clientIp, safeSecurityLog } from "@/lib/security";
import { StoreUnavailableError } from "@/lib/redis";
import {
  BROWSER_BINDING_COOKIE,
  browserBindingCookieValue,
  browserBindingFromRequest,
  checkoutNonceHash,
  checkoutNoncePurchaseType,
  completeCheckoutNonce,
  sealStripeAccess,
  validCheckoutNonce,
} from "@/lib/stripe-browser-access";
import {
  ENTITLEMENT_COOKIE_OPTIONS,
  PAY_PER_USE_COOKIE_MAX_AGE,
  SUBSCRIPTION_COOKIE_MAX_AGE,
  SUBSCRIPTION_HINT_COOKIE_OPTIONS,
} from "@/lib/entitlement-cookies";

function redirect(path: string) {
  const response = NextResponse.redirect(`${trustedSiteOrigin()}${path}`);
  response.headers.set("Cache-Control", "no-store");
  return response;
}

function rateLimited() {
  return NextResponse.json(
    { error: "Too many checkout confirmations. Please wait and try again." },
    {
      status: 429,
      headers: { "Cache-Control": "no-store", "Retry-After": "60" },
    },
  );
}

function escapeHtmlAttribute(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function retryableConfirmation(
  sessionId: string,
  nonce: string,
  attempt: number,
) {
  const retryUrl = new URL("/api/checkout/confirm", trustedSiteOrigin());
  retryUrl.searchParams.set("session_id", sessionId);
  retryUrl.searchParams.set("nonce", nonce);
  retryUrl.searchParams.set("retry", String(attempt < 3 ? attempt + 1 : 0));
  const escapedRetryUrl = escapeHtmlAttribute(retryUrl.toString());
  const automaticRetry =
    attempt < 3
      ? `<meta http-equiv="refresh" content="15;url=${escapedRetryUrl}">`
      : "";
  const statusMessage =
    attempt < 3
      ? "We will try again automatically in 15 seconds."
      : "Automatic retries are paused. Use the button below to try again.";

  return new NextResponse(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${automaticRetry}<title>Confirming payment | Medical Bill Reader</title></head><body><main><h1>We are still confirming your payment</h1><p>We could not finish confirming access just now. This confirmation URL remains available, and this retry has not consumed an analysis.</p><p>${statusMessage}</p><p><a href="${escapedRetryUrl}">Try payment confirmation again</a></p><p>If this continues, keep your Stripe receipt and contact support. Do not email a medical bill.</p></main></body></html>`,
    {
      status: 503,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "text/html; charset=utf-8",
        "Retry-After": "15",
        "X-Robots-Tag": "noindex, nofollow",
      },
    },
  );
}

// Stripe redirects here after a successful Checkout. We ask Stripe what was
// actually purchased, then set the matching cookie before sending the user
// back to the homepage where the bill analyzer lives. No purchase record is
// stored anywhere except in Stripe.
export async function GET(request: NextRequest) {
  let retrySessionId: string | null = null;
  let retryNonce: string | null = null;
  let retryAttempt = 0;
  try {
    const sessionId = request.nextUrl.searchParams.get("session_id");
    const nonce = request.nextUrl.searchParams.get("nonce");
    const browserBinding = browserBindingFromRequest(request);
    if (
      !sessionId ||
      !isStripeId(sessionId, "cs_") ||
      !nonce ||
      !validCheckoutNonce(nonce) ||
      !browserBinding
    ) {
      return redirect("/pricing?payment=error");
    }
    retrySessionId = sessionId;
    retryNonce = nonce;
    const retryParam = request.nextUrl.searchParams.get("retry") || "0";
    retryAttempt = /^[0-3]$/.test(retryParam) ? Number(retryParam) : 0;

    if (
      !(await enforceRateLimit(
        "checkout-confirm-ip",
        clientIp(request.headers),
        10,
        60,
      ))
    ) {
      return rateLimited();
    }

    if (
      !(await enforceRateLimit(
        "checkout-confirm-browser",
        browserBinding,
        10,
        5 * 60,
      ))
    ) {
      return rateLimited();
    }

    // Read without completing first. Pending state lets Stripe be retried; a
    // completed state lets this same browser/session reissue a lost response.
    const purchaseType = await checkoutNoncePurchaseType(
      nonce,
      browserBinding,
      sessionId,
    );
    if (!purchaseType) return redirect("/pricing?payment=error");

    const result = await classifyCompletedCheckout(
      sessionId,
      checkoutNonceHash(nonce),
      purchaseType,
    );
    if (!result) return redirect("/pricing?payment=error");
    if (result.type === "unavailable") {
      return retryableConfirmation(sessionId, nonce, retryAttempt);
    }

    const response = redirect("/?payment=success");
    if (result.type === "per-use") {
      response.cookies.set(
        "mbr_pending_use",
        sealStripeAccess(
          "per-use",
          sessionId,
          browserBinding,
          PAY_PER_USE_COOKIE_MAX_AGE,
        ),
        {
          ...ENTITLEMENT_COOKIE_OPTIONS,
          maxAge: PAY_PER_USE_COOKIE_MAX_AGE,
        },
      );
    } else {
      response.cookies.set(
        "mbr_sub_id",
        sealStripeAccess(
          "subscription",
          result.subscriptionId,
          browserBinding,
          SUBSCRIPTION_COOKIE_MAX_AGE,
        ),
        {
          ...ENTITLEMENT_COOKIE_OPTIONS,
          maxAge: SUBSCRIPTION_COOKIE_MAX_AGE,
        },
      );
      // Non-httpOnly UX hint only. The analyze route independently opens and
      // verifies the browser-bound authorization token on every request.
      response.cookies.set("mbr_sub_active", "1", {
        ...SUBSCRIPTION_HINT_COOKIE_OPTIONS,
        maxAge: SUBSCRIPTION_COOKIE_MAX_AGE,
      });
    }

    // Renew the essential browser binding whenever paid access is issued. This
    // prevents an older binding from expiring before a new entitlement token.
    response.cookies.set(
      BROWSER_BINDING_COOKIE,
      browserBindingCookieValue(browserBinding),
      {
        ...ENTITLEMENT_COOKIE_OPTIONS,
        maxAge: SUBSCRIPTION_COOKIE_MAX_AGE,
      },
    );

    // Persist a same-browser, same-session completion marker rather than
    // deleting the nonce. A process crash or dropped connection after this
    // point can then replay and safely reissue the prepared cookies.
    const completed = await completeCheckoutNonce(
      nonce,
      browserBinding,
      sessionId,
      purchaseType,
    );
    if (!completed) {
      return redirect("/pricing?payment=error");
    }

    return response;
  } catch (error) {
    if (error instanceof StoreUnavailableError && retrySessionId && retryNonce) {
      safeSecurityLog("checkout_confirmation_store_unavailable");
      return retryableConfirmation(
        retrySessionId,
        retryNonce,
        retryAttempt,
      );
    }
    safeSecurityLog("checkout_confirmation_failed");
    return redirect("/pricing?payment=error");
  }
}
