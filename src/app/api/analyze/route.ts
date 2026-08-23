import { NextRequest, NextResponse } from "next/server";
import { getProductConfig } from "@/config/product";
import {
  MODEL_PRICING,
  isSingleAnalysisCostWithinCeiling,
} from "@/config/model-pricing";
import {
  BILL_ANALYSIS_INSTRUCTIONS,
  buildBillAnalysisPrompt,
} from "@/lib/bill-analysis-prompt";
import {
  BILL_ANALYSIS_JSON_SCHEMA,
  InvalidBillAnalysisOutputError,
  ProviderResponseTooLargeError,
  parseBillAnalysisEnvelope,
  readBoundedProviderJson,
} from "@/lib/bill-analysis-output";
import {
  commitEntitlement,
  EntitlementTemporarilyUnavailableError,
  releaseEntitlement,
  reserveRequestEntitlement,
  type EntitlementReservation,
} from "@/lib/entitlement";
import { enforceRateLimit } from "@/lib/rate-limit";
import { StoreUnavailableError } from "@/lib/redis";
import { clientIp, safeSecurityLog } from "@/lib/security";
import { recordPrivacySafeDailyEvent } from "@/lib/privacy-safe-aggregates";
import {
  readLimitedJson,
  UploadValidationError,
  validateUpload,
} from "@/lib/upload-validation";
import {
  SensitiveRequestError,
  validateSensitiveJsonRequest,
} from "@/lib/sensitive-request";
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
const NO_STORE = { "Cache-Control": "no-store" };

function errorResponse(
  error: string,
  status: number,
  headers?: Record<string, string>,
) {
  return NextResponse.json(
    { error },
    { status, headers: { ...NO_STORE, ...headers } },
  );
}

function providerFailureEvent(status: number): string {
  if (status === 429) return "anthropic_request_rate_limited";
  if (status === 401 || status === 403)
    return "anthropic_request_auth_failed";
  if (status >= 400 && status < 500)
    return "anthropic_request_rejected";
  if (status >= 500 && status < 600)
    return "anthropic_request_server_failed";
  return "anthropic_request_failed";
}

export function OPTIONS() {
  return new NextResponse(null, {
    status: 405,
    headers: { ...NO_STORE, Allow: "POST" },
  });
}

export async function POST(request: NextRequest) {
  let reservation: EntitlementReservation | null = null;
  try {
    // Reject cross-origin, forged-host, and non-JSON requests before any rate
    // limit, entitlement, upload, or provider state is touched.
    validateSensitiveJsonRequest(request);

    const product = getProductConfig();
    if (!product.features.singleAnalysis)
      return errorResponse("Single-document analysis is not available.", 503);
    const model = product.anthropicModel;
    if (!MODEL_PRICING[model])
      return errorResponse(
        "The configured analysis model has not passed pricing review.",
        503,
      );

    if (!(await enforceRateLimit("analyze-ip", clientIp(request.headers), 10, 60)))
      return errorResponse(
        "Too many analysis requests. Please wait and try again.",
        429,
      );

    reservation = await reserveRequestEntitlement(
      request,
      product.features.existingSubscriptionSupport,
    );
    if (!reservation)
      return errorResponse("A valid analysis entitlement is required.", 401);

    if (!(await enforceRateLimit("analyze-entitlement", reservation.key, 3, 60))) {
      await releaseEntitlement(reservation);
      reservation = null;
      return errorResponse(
        "This analysis entitlement is being used too quickly. Please wait and try again.",
        429,
      );
    }

    const upload = await validateUpload(await readLimitedJson(request));
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("anthropic_not_configured");

    const fileContent =
      upload.mediaType === "application/pdf"
        ? {
            type: "document",
            source: {
              type: "base64",
              media_type: upload.mediaType,
              data: upload.data,
            },
          }
        : {
            type: "image",
            source: {
              type: "base64",
              media_type: upload.mediaType,
              data: upload.data,
            },
          };
    const aiResponse = await fetchWithTimeout(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model,
          max_tokens: 2000,
          temperature: 0,
          system: BILL_ANALYSIS_INSTRUCTIONS,
          output_config: {
            format: {
              type: "json_schema",
              schema: BILL_ANALYSIS_JSON_SCHEMA,
            },
          },
          messages: [
            {
              role: "user",
              content: [
                fileContent,
                { type: "text", text: buildBillAnalysisPrompt() },
              ],
            },
          ],
        }),
      },
      ANTHROPIC_TIMEOUT_MS,
    );

    let providerPayload: unknown = null;
    try {
      providerPayload = await readBoundedProviderJson(aiResponse);
    } catch (error) {
      if (aiResponse.ok) throw error;
    }

    if (!aiResponse.ok) {
      // Provider payloads are untrusted and may echo document or account data.
      // Log only a fixed event selected from the HTTP status.
      safeSecurityLog(providerFailureEvent(aiResponse.status));
      await releaseEntitlement(reservation);
      reservation = null;
      if (aiResponse.status === 429)
        return errorResponse(
          "The analysis service is temporarily busy. Your paid credit was not used. Please wait and try again.",
          503,
          { "Retry-After": "60" },
        );
      return errorResponse(
        "The analysis service could not process this file. Your paid credit was not used.",
        502,
      );
    }

    const contentType = aiResponse.headers.get("content-type") || "";
    const providerMediaType = contentType.split(";", 1)[0]?.trim().toLowerCase();
    if (providerMediaType !== "application/json")
      throw new InvalidBillAnalysisOutputError();

    const parsed = parseBillAnalysisEnvelope(providerPayload, {
      sourceKind:
        upload.mediaType === "application/pdf" ? "pdf" : "image",
      pageCount: upload.pageCount,
    });

    if (
      parsed.model !== model ||
      !parsed.usage ||
      !isSingleAnalysisCostWithinCeiling(
        model,
        parsed.usage.inputTokens,
        parsed.usage.outputTokens,
      )
    ) {
      throw new InvalidBillAnalysisOutputError();
    }

    if (!(await commitEntitlement(reservation)))
      return errorResponse(
        "The analysis could not be finalized safely. Please contact support.",
        503,
      );

    const kind = reservation.kind;
    try {
      await recordPrivacySafeDailyEvent(
        product.features.privacySafeAggregates,
        model,
        {
          type: "single_document_success",
          credit: kind === "free" ? "free" : "paid",
          inputTokens: parsed.usage.inputTokens,
          outputTokens: parsed.usage.outputTokens,
        },
      );
    } catch {
      // Aggregate accounting is deliberately non-authoritative. Never attach
      // request context to this fixed event or withhold a safe report because a
      // separately approved anonymous aggregate store is unavailable.
      safeSecurityLog("privacy_safe_aggregate_update_failed");
    }
    const subscriptionId =
      kind === "subscription" ? reservation.externalId : undefined;
    const subscriptionBinding =
      kind === "subscription" ? reservation.browserBinding : undefined;
    reservation = null;

    const response = NextResponse.json(
      { report: parsed.report },
      { headers: NO_STORE },
    );
    if (kind === "paid" || request.cookies.get("mbr_pending_use"))
      response.cookies.set("mbr_pending_use", "", { maxAge: 0, path: "/" });
    if (subscriptionId && subscriptionBinding) {
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
    } else if (request.cookies.get("mbr_sub_active")) {
      response.cookies.set("mbr_sub_active", "", { maxAge: 0, path: "/" });
    }
    return response;
  } catch (error) {
    if (reservation) {
      try {
        await releaseEntitlement(reservation);
      } catch {
        safeSecurityLog("entitlement_release_failed");
      }
    }
    if (error instanceof SensitiveRequestError)
      return errorResponse(
        error.status === 415
          ? "The analysis request must use JSON."
          : "The analysis request origin was not accepted.",
        error.status,
      );
    if (error instanceof UploadValidationError)
      return errorResponse(error.message, 400);
    if (error instanceof EntitlementTemporarilyUnavailableError)
      return errorResponse(
        "Paid analysis access is temporarily unavailable. Your credit was not used. Please wait and try again.",
        503,
      );
    if (error instanceof StoreUnavailableError)
      return errorResponse("Analysis access is temporarily unavailable.", 503);
    if (error instanceof RequestTimeoutError) {
      safeSecurityLog("anthropic_request_timeout");
      return errorResponse(
        "The analysis service took too long. Your paid credit was not used. Please wait two minutes and try again.",
        504,
      );
    }
    if (
      error instanceof InvalidBillAnalysisOutputError ||
      error instanceof ProviderResponseTooLargeError
    ) {
      safeSecurityLog("anthropic_response_rejected");
      return errorResponse(
        "The analysis service returned an invalid response. Your paid credit was not used.",
        502,
      );
    }
    safeSecurityLog("analysis_route_failed");
    return errorResponse(
      "The analysis could not be completed. Your paid credit was not used.",
      500,
    );
  }
}
