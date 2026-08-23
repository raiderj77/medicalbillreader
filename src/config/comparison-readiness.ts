import { getProductConfig } from "@/config/product";

export const COMPARISON_PURCHASE_TYPE = "bill-eob-comparison" as const;

export const COMPARISON_LIMITS = Object.freeze({
  supportedMediaTypes: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
  ] as const,
  perFileBytes: 10 * 1024 * 1024,
  combinedFileBytes: 18 * 1024 * 1024,
  maxPagesPerPdf: 12,
  maxCombinedPdfPages: 20,
  requiredDocumentSlots: 2,
});

export const COMPARISON_CONSENT_STATEMENTS = [
  "Both selected files will be sent through this application to Anthropic.",
  "I reviewed the Consumer Health Data Privacy Notice.",
  "I removed identifiers that are not needed for the requested comparison.",
  "This direct-to-consumer service is not represented as HIPAA covered.",
  "The report will not determine legal responsibility or what anyone owes.",
] as const;

/** These release gates require reviewed code or recorded owner approval. */
export const COMPARISON_RELEASE_GATES = Object.freeze({
  implementationComplete: false,
  syntheticEvaluationPassed: false,
  privacyApproved: false,
  professionalReviewComplete: false,
  stripePriceVerified: false,
});

export function comparisonAvailability(
  env: Readonly<Record<string, string | undefined>> = process.env,
): { available: boolean; reason: string } {
  try {
    const enabled = getProductConfig(env).features.billEobComparison;
    const gatesPassed = Object.values(COMPARISON_RELEASE_GATES).every(Boolean);
    if (!enabled) return { available: false, reason: "feature_flag_disabled" };
    if (!gatesPassed) return { available: false, reason: "release_gates_incomplete" };
    return { available: true, reason: "available" };
  } catch {
    return { available: false, reason: "configuration_invalid" };
  }
}
