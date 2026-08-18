import { NextRequest, NextResponse } from "next/server";
import { BILL_ANALYSIS_INSTRUCTIONS, buildBillAnalysisPrompt } from "@/lib/bill-analysis-prompt";
import { commitEntitlement, EntitlementTemporarilyUnavailableError, releaseEntitlement, reserveRequestEntitlement, type EntitlementReservation } from "@/lib/entitlement";
import { enforceRateLimit } from "@/lib/rate-limit";
import { StoreUnavailableError } from "@/lib/redis";
import { clientIp, safeSecurityLog } from "@/lib/security";
import { readLimitedJson, UploadValidationError, validateUpload } from "@/lib/upload-validation";
import { fetchWithTimeout, RequestTimeoutError } from "@/lib/fetch-with-timeout";
import {
  ENTITLEMENT_COOKIE_OPTIONS,
  SUBSCRIPTION_COOKIE_MAX_AGE,
  SUBSCRIPTION_HINT_COOKIE_OPTIONS,
} from "@/lib/entitlement-cookies";
import {
  BROWSER_BINDING_COOKIE,
  browserBindingCookieValue,
  sealStripeAccess,
} from "@/lib/stripe-browser-access";

export const maxDuration = 120;
export const runtime = "nodejs";

const ANTHROPIC_TIMEOUT_MS = 100_000;

function errorResponse(error: string, status: number) {
  return NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  let reservation: EntitlementReservation | null = null;
  try {
    if (!(await enforceRateLimit("analyze-ip", clientIp(request.headers), 10, 60))) return errorResponse("Too many analysis requests. Please wait and try again.", 429);

    reservation = await reserveRequestEntitlement(request);
    if (!reservation) return errorResponse("A valid analysis entitlement is required.", 401);

    if (!(await enforceRateLimit("analyze-entitlement", reservation.key, 3, 60))) {
      await releaseEntitlement(reservation);
      reservation = null;
      return errorResponse("This analysis entitlement is being used too quickly. Please wait and try again.", 429);
    }

    const upload = validateUpload(await readLimitedJson(request));
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("anthropic_not_configured");
    const fileContent = upload.mediaType === "application/pdf"
      ? { type: "document", source: { type: "base64", media_type: upload.mediaType, data: upload.data } }
      : { type: "image", source: { type: "base64", media_type: upload.mediaType, data: upload.data } };

    const aiResponse = await fetchWithTimeout("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 2000,
        temperature: 0,
        system: BILL_ANALYSIS_INSTRUCTIONS,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: buildBillAnalysisPrompt() },
              fileContent,
            ],
          },
        ],
      }),
    }, ANTHROPIC_TIMEOUT_MS);

    if (!aiResponse.ok) {
      const failure = (await aiResponse.json().catch(() => null)) as { error?: { type?: string } } | null;
      const category = failure?.error?.type?.replace(/[^a-z0-9_-]/gi, "").slice(0, 40) || "unknown";
      safeSecurityLog(`anthropic_request_failed_${aiResponse.status}_${category}`);
      await releaseEntitlement(reservation); reservation = null;
      return errorResponse("The analysis service could not process this file. Your paid credit was not used.", 502);
    }
    const data = (await aiResponse.json()) as { content?: Array<{ text?: string }> };
    const result = data.content?.[0]?.text;
    if (!result) {
      await releaseEntitlement(reservation); reservation = null;
      return errorResponse("The analysis service returned an incomplete response. Your paid credit was not used.", 502);
    }
    if (!(await commitEntitlement(reservation))) return errorResponse("The analysis could not be finalized safely. Please contact support.", 503);
    const kind = reservation.kind;
    const subscriptionId =
      kind === "subscription" ? reservation.externalId : undefined;
    const subscriptionBinding =
      kind === "subscription" ? reservation.browserBinding : undefined;
    reservation = null;
    const response = NextResponse.json({ result }, { headers: { "Cache-Control": "no-store" } });
    // Clear both consumed and stale pending-use cookies after any successful
    // analysis so an old checkout return cannot keep masking later access.
    if (kind === "paid" || request.cookies.get("mbr_pending_use"))
      response.cookies.set("mbr_pending_use", "", { maxAge: 0, path: "/" });
    if (subscriptionId && subscriptionBinding) {
      // Renew browser-bound access after every verified successful use. Stripe
      // status is still checked on every analysis, so cancellation is honored.
      response.cookies.set(
        "mbr_sub_id",
        sealStripeAccess(
          "subscription",
          subscriptionId,
          subscriptionBinding,
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
        browserBindingCookieValue(subscriptionBinding),
        {
          ...ENTITLEMENT_COOKIE_OPTIONS,
          maxAge: SUBSCRIPTION_COOKIE_MAX_AGE,
        },
      );
    } else if (request.cookies.get("mbr_sub_id")) {
      // Remove expired, legacy raw-ID, or otherwise invalid subscription hints
      // after another entitlement succeeds so future requests fall through.
      response.cookies.set("mbr_sub_id", "", { maxAge: 0, path: "/" });
      response.cookies.set("mbr_sub_active", "", { maxAge: 0, path: "/" });
    }
    return response;
  } catch (error) {
    if (reservation) { try { await releaseEntitlement(reservation); } catch { safeSecurityLog("entitlement_release_failed"); } }
    if (error instanceof UploadValidationError) return errorResponse(error.message, 400);
    if (error instanceof EntitlementTemporarilyUnavailableError) return errorResponse("Paid analysis access is temporarily unavailable. Your credit was not used. Please wait and try again.", 503);
    if (error instanceof StoreUnavailableError) return errorResponse("Analysis access is temporarily unavailable.", 503);
    if (error instanceof RequestTimeoutError) {
      safeSecurityLog("anthropic_request_timeout");
      return errorResponse("The analysis service took too long. Your paid credit was not used. Please wait two minutes and try again.", 504);
    }
    safeSecurityLog("analysis_route_failed");
    return errorResponse("The analysis could not be completed. Your paid credit was not used.", 500);
  }
}
