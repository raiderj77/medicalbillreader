import { describe, expect, it } from "vitest";
import {
  anthropicModel,
  getProductConfig,
  parseBooleanFlag,
  productConfig,
} from "@/config/product";

describe("central product configuration", () => {
  it("uses the reviewed fail-closed Truthmode defaults", () => {
    expect(productConfig).toMatchObject({
      productionOrigin: "https://medicalbillreader.com",
      displayPrices: {
        singleAnalysis: "$4.99",
        billEobComparison: "$9.99",
      },
      freeAnalysis: {
        limit: 1,
        scope: "browser",
        period: "UTC calendar month",
      },
      features: {
        singleAnalysis: true,
        newSubscriptions: false,
        existingSubscriptionSupport: true,
        billEobComparison: false,
        localComparisonWorksheet: true,
        localImageRedaction: false,
        privacySafeAggregates: false,
        fixedResultFeedback: false,
      },
      anthropicModel: "claude-sonnet-4-6",
      reviewDates: {
        modelPricing: "2026-08-23",
        privacy: "2026-08-23",
        codeSetRights: "2026-08-23",
        methodology: "2026-08-23",
      },
    });
    expect(getProductConfig({})).toEqual(productConfig);
  });

  it("accepts only exact boolean values and rejects ambiguity", () => {
    expect(parseBooleanFlag("FLAG", "true", false)).toBe(true);
    expect(parseBooleanFlag("FLAG", "false", true)).toBe(false);
    expect(parseBooleanFlag("FLAG", undefined, true)).toBe(true);
    expect(() => parseBooleanFlag("FLAG", "TRUE", false)).toThrow(
      'FLAG must be exactly "true" or "false".',
    );
  });

  it("applies explicit flags without changing immutable defaults", () => {
    const configured = getProductConfig({
      ENABLE_SINGLE_ANALYSIS: "false",
      ENABLE_EXISTING_SUBSCRIPTION_SUPPORT: "false",
      ENABLE_LOCAL_COMPARISON_WORKSHEET: "false",
      ANTHROPIC_MODEL: "benchmark-approved-model",
    });

    expect(configured.features.singleAnalysis).toBe(false);
    expect(configured.features.newSubscriptions).toBe(false);
    expect(configured.features.existingSubscriptionSupport).toBe(false);
    expect(configured.anthropicModel).toBe("benchmark-approved-model");
    expect(productConfig.features.singleAnalysis).toBe(true);
  });

  it("keeps the deployed model when ANTHROPIC_MODEL is absent or blank", () => {
    expect(anthropicModel({})).toBe("claude-sonnet-4-6");
    expect(anthropicModel({ ANTHROPIC_MODEL: "  " })).toBe(
      "claude-sonnet-4-6",
    );
  });
});
