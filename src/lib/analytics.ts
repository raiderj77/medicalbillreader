export type ConversionEvent =
  | "upload_started"
  | "upload_completed"
  | "checkout_started"
  | "checkout_cancelled"
  | "purchase_completed"
  | "analysis_delivered"
  | "payment_failed";

type SafeParameters = {
  file_type?: string;
  plan?: "per-use" | "subscription";
};

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
  if (parameters.plan) safe.plan = parameters.plan;
  if (parameters.file_type) safe.file_type = parameters.file_type.slice(0, 40);
  window.gtag("event", event, safe);
}
