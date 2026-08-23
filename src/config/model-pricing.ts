export interface ModelPricingSnapshot {
  modelId: string;
  inputUsdPerMillionTokens: number;
  outputUsdPerMillionTokens: number;
  maxSingleAnalysisCostUsd: number;
  effectiveDate: string | null;
  source: string;
  lastReviewedDate: string;
  ownerReviewRequiredForChanges: true;
}

/**
 * Manually reviewed price snapshot. Never update this from a scraper or a
 * provider response; pricing changes require an owner-reviewed code change.
 */
export const MODEL_PRICING: Readonly<Record<string, ModelPricingSnapshot>> = {
  "claude-sonnet-4-6": {
    modelId: "claude-sonnet-4-6",
    inputUsdPerMillionTokens: 3,
    outputUsdPerMillionTokens: 15,
    // Internal fail-closed unit-economics ceiling. This is not a public price or
    // accuracy claim and changing it requires the same owner review as pricing.
    maxSingleAnalysisCostUsd: 0.25,
    // Anthropic's current table did not state a distinct effective date.
    effectiveDate: null,
    source: "https://platform.claude.com/docs/en/about-claude/pricing",
    lastReviewedDate: "2026-08-23",
    ownerReviewRequiredForChanges: true,
  },
};

export function estimateModelCostUsd(
  modelId: string,
  inputTokens: number,
  outputTokens: number,
): number | null {
  const price = MODEL_PRICING[modelId];
  if (
    !price ||
    !Number.isSafeInteger(inputTokens) ||
    !Number.isSafeInteger(outputTokens) ||
    inputTokens < 0 ||
    outputTokens < 0
  ) {
    return null;
  }
  return (
    (inputTokens * price.inputUsdPerMillionTokens +
      outputTokens * price.outputUsdPerMillionTokens) /
    1_000_000
  );
}

export function isSingleAnalysisCostWithinCeiling(
  modelId: string,
  inputTokens: number,
  outputTokens: number,
): boolean {
  const price = MODEL_PRICING[modelId];
  const estimated = estimateModelCostUsd(modelId, inputTokens, outputTokens);
  return Boolean(price && estimated !== null && estimated <= price.maxSingleAnalysisCostUsd);
}
