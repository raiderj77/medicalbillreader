import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  MODEL_PRICING,
  estimateModelCostUsd,
  isSingleAnalysisCostWithinCeiling,
} from "@/config/model-pricing";
import {
  ANALYZER_REVIEW_STATUS,
  METHODOLOGY_REVIEW_STATUS,
  REVIEW_STATUSES,
} from "@/config/review-status";
import {
  addAnonymousUsage,
  createEmptyDailyAggregate,
  DAILY_AGGREGATE_KEYS,
  isPrivacySafeDailyAggregate,
} from "@/lib/privacy-safe-aggregates";

describe("Truthmode review, pricing, aggregate, and feedback foundations", () => {
  it("defaults the analyzer and methodology to unattributed professional review pending", () => {
    for (const status of [ANALYZER_REVIEW_STATUS, METHODOLOGY_REVIEW_STATUS]) {
      expect(status.status).toBe(REVIEW_STATUSES.PROFESSIONAL_REVIEW_PENDING);
      expect(status.reviewerAttribution).toBeNull();
      expect(status.lastProfessionalReviewDate).toBeNull();
    }
  });

  it("uses a manually reviewed model-price snapshot", () => {
    expect(MODEL_PRICING["claude-sonnet-4-6"]).toMatchObject({
      inputUsdPerMillionTokens: 3,
      outputUsdPerMillionTokens: 15,
      maxSingleAnalysisCostUsd: 0.25,
      lastReviewedDate: "2026-08-23",
      ownerReviewRequiredForChanges: true,
    });
    expect(estimateModelCostUsd("claude-sonnet-4-6", 1_000_000, 1_000_000)).toBe(18);
    expect(estimateModelCostUsd("unknown", 1, 1)).toBeNull();
    expect(isSingleAnalysisCostWithinCeiling("claude-sonnet-4-6", 10_000, 2_000)).toBe(true);
    expect(isSingleAnalysisCostWithinCeiling("claude-sonnet-4-6", 100_000, 2_000)).toBe(false);
    expect(isSingleAnalysisCostWithinCeiling("unknown", 1, 1)).toBe(false);
  });

  it("allows only anonymous daily aggregate fields", () => {
    const aggregate = addAnonymousUsage(
      createEmptyDailyAggregate("2026-08-23", "claude-sonnet-4-6"),
      1_000,
      200,
    );
    expect(isPrivacySafeDailyAggregate(aggregate)).toBe(true);
    expect(Object.keys(aggregate).sort()).toEqual([...DAILY_AGGREGATE_KEYS].sort());
    expect(isPrivacySafeDailyAggregate({ ...aggregate, ip: "198.51.100.2" })).toBe(false);
    expect(isPrivacySafeDailyAggregate({ ...aggregate, filename: "bill.pdf" })).toBe(false);
    expect(isPrivacySafeDailyAggregate({ ...aggregate, timestamp: "2026-08-23T12:00:00Z" })).toBe(false);
  });

  it("keeps fixed feedback free of text fields, network calls, and persistence", () => {
    const source = readFileSync("src/components/FixedResultFeedback.tsx", "utf8");
    expect(source).toContain("Do not send bill details or health information through feedback.");
    for (const prohibited of ["textarea", "<input", "fetch(", "/api/", "localStorage", "sessionStorage", "document.cookie"] ) {
      expect(source, prohibited).not.toContain(prohibited);
    }
  });
});
