import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  COMPARISON_CONSENT_STATEMENTS,
  COMPARISON_LIMITS,
  COMPARISON_PURCHASE_TYPE,
  COMPARISON_RELEASE_GATES,
  comparisonAvailability,
} from "@/config/comparison-readiness";

describe("disabled bill and EOB comparison foundation", () => {
  it("stays unavailable by default and even a flag cannot bypass incomplete gates", () => {
    expect(comparisonAvailability({})).toEqual({ available: false, reason: "feature_flag_disabled" });
    expect(comparisonAvailability({ ENABLE_BILL_EOB_COMPARISON: "true" })).toEqual({ available: false, reason: "release_gates_incomplete" });
    expect(Object.values(COMPARISON_RELEASE_GATES).every((value) => value === false)).toBe(true);
  });

  it("defines tested two-file, combined-byte, and page limits", () => {
    expect(COMPARISON_LIMITS.requiredDocumentSlots).toBe(2);
    expect(COMPARISON_LIMITS.combinedFileBytes).toBeLessThan(COMPARISON_LIMITS.perFileBytes * 2);
    expect(COMPARISON_LIMITS.maxCombinedPdfPages).toBeLessThan(COMPARISON_LIMITS.maxPagesPerPdf * 2);
    expect(COMPARISON_CONSENT_STATEMENTS).toHaveLength(5);
  });

  it("keeps the future credit category separate and exposes no upload control", () => {
    expect(COMPARISON_PURCHASE_TYPE).toBe("bill-eob-comparison");
    const page = readFileSync("src/app/bill-eob-comparison/page.tsx", "utf8");
    expect(page).toContain("Not available for purchase or upload");
    expect(page).not.toContain('type="file"');
    expect(page).not.toContain("/api/analyze");
  });
});
