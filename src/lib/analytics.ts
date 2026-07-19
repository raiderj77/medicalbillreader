export type ConversionEvent =
  | "upload_started"
  | "upload_completed"
  | "analysis_started"
  | "analysis_failed"
  | "upgrade_prompt_viewed"
  | "checkout_started"
  | "checkout_cancelled"
  | "purchase_completed"
  | "analysis_delivered"
  | "payment_failed";

export type AnalysisAccessType = "free" | "per-use" | "subscription";
export type AnalysisFailureStage = "entitlement" | "analysis";
export type AnalysisFailureCategory =
  | "entitlement_required"
  | "invalid_file"
  | "rate_limited"
  | "service_unavailable"
  | "provider_rejected"
  | "provider_timeout"
  | "incomplete_response"
  | "network"
  | "unexpected";

type SafeParameters = {
  file_type?: string;
  plan?: "per-use" | "subscription";
  access_type?: AnalysisAccessType;
  failure_stage?: AnalysisFailureStage;
  failure_category?: AnalysisFailureCategory;
};

const SAFE_FILE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);
const SAFE_PLANS = new Set(["per-use", "subscription"]);
const SAFE_ACCESS_TYPES = new Set(["free", "per-use", "subscription"]);
const SAFE_FAILURE_STAGES = new Set(["entitlement", "analysis"]);
const SAFE_FAILURE_CATEGORIES = new Set([
  "entitlement_required",
  "invalid_file",
  "rate_limited",
  "service_unavailable",
  "provider_rejected",
  "provider_timeout",
  "incomplete_response",
  "network",
  "unexpected",
]);

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackConversion(
  event: ConversionEvent,
  parameters: SafeParameters = {},
) {
  if (typeof window === "undefined" || typeof window.gtag !== "function")
    return;
  const safe: SafeParameters = {};
  if (parameters.plan && SAFE_PLANS.has(parameters.plan))
    safe.plan = parameters.plan;
  if (parameters.file_type && SAFE_FILE_TYPES.has(parameters.file_type))
    safe.file_type = parameters.file_type;
  if (
    parameters.access_type &&
    SAFE_ACCESS_TYPES.has(parameters.access_type)
  )
    safe.access_type = parameters.access_type;
  if (
    parameters.failure_stage &&
    SAFE_FAILURE_STAGES.has(parameters.failure_stage)
  )
    safe.failure_stage = parameters.failure_stage;
  if (
    parameters.failure_category &&
    SAFE_FAILURE_CATEGORIES.has(parameters.failure_category)
  )
    safe.failure_category = parameters.failure_category;
  window.gtag("event", event, safe);
}

export function analysisFailureCategory(
  status: number,
): AnalysisFailureCategory {
  switch (status) {
    case 400:
      return "invalid_file";
    case 401:
      return "entitlement_required";
    case 429:
      return "rate_limited";
    case 502:
      return "provider_rejected";
    case 503:
      return "service_unavailable";
    case 504:
      return "provider_timeout";
    default:
      return "unexpected";
  }
}
