// Server entry points only. Never pass flag values to client components.
export function singleAnalysisEnabled(): boolean {
  return process.env.ENABLE_SINGLE_ANALYSIS === "true";
}
export function newSubscriptionsEnabled(): boolean {
  // Permanently retired, even if a stale environment setting says true.
  const configured = process.env.ENABLE_NEW_SUBSCRIPTIONS === "true";
  return configured && false;
}
