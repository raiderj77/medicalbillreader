import { describe, expect, it } from "vitest";
import {
  InvalidBillEobComparisonOutputError,
  parseBillEobComparisonEnvelope,
} from "@/lib/bill-eob-comparison-output";
import { isBillEobComparisonReport } from "@/lib/bill-eob-comparison-schema";
import {
  comparisonEnvelope,
  syntheticBillEobComparisonReport,
} from "./bill-eob-comparison-fixture";

const sourceContext = {
  billDocument: { sourceKind: "pdf" as const, pageCount: 2 },
  eobDocument: { sourceKind: "pdf" as const, pageCount: 2 },
};

describe("strict bill and EOB comparison output contract", () => {
  it("accepts the exact Phase 7 shape with two structured document reports", () => {
    const parsed = parseBillEobComparisonEnvelope(
      comparisonEnvelope(),
      sourceContext,
    );
    expect(isBillEobComparisonReport(parsed.report)).toBe(true);
    expect(parsed.report.billDocument.reportLimitations).toHaveLength(1);
    expect(parsed.report.eobDocument.reportLimitations).toHaveLength(1);
    expect(parsed.report.matchAssessment.appearsRelated).toBe("unclear");
    expect(parsed.model).toBe("claude-sonnet-4-6");
    expect(parsed.usage).toEqual({ inputTokens: 200, outputTokens: 100 });
  });

  it("rejects extra and missing comparison fields", () => {
    const extra = {
      ...syntheticBillEobComparisonReport(),
      recommendation: "Synthetic extra field",
    };
    expect(() =>
      parseBillEobComparisonEnvelope(
        comparisonEnvelope(extra as never),
        sourceContext,
      ),
    ).toThrow(InvalidBillEobComparisonOutputError);

    const missing = {
      ...syntheticBillEobComparisonReport(),
    } as Record<string, unknown>;
    delete missing.limitations;
    expect(() =>
      parseBillEobComparisonEnvelope(
        comparisonEnvelope(missing as never),
        sourceContext,
      ),
    ).toThrow(InvalidBillEobComparisonOutputError);
  });

  it("rejects extra or missing fields inside a nested single-document report", () => {
    const extraNested = {
      ...syntheticBillEobComparisonReport(),
      billDocument: {
        ...syntheticBillEobComparisonReport().billDocument,
        arbitrary: "Synthetic extra field",
      },
    };
    expect(() =>
      parseBillEobComparisonEnvelope(
        comparisonEnvelope(extraNested as never),
        sourceContext,
      ),
    ).toThrow(InvalidBillEobComparisonOutputError);
  });

  it("requires visible evidence for a yes or no match and a limitation for unclear", () => {
    const yesWithoutEvidence = {
      ...syntheticBillEobComparisonReport(),
      matchAssessment: {
        appearsRelated: "yes" as const,
        matchingEvidence: [],
        limitations: ["Only visible fields were considered."],
      },
    };
    expect(() =>
      parseBillEobComparisonEnvelope(
        comparisonEnvelope(yesWithoutEvidence),
        sourceContext,
      ),
    ).toThrow(InvalidBillEobComparisonOutputError);

    const unclearWithoutLimitation = {
      ...syntheticBillEobComparisonReport(),
      matchAssessment: {
        appearsRelated: "unclear" as const,
        matchingEvidence: [],
        limitations: [],
      },
    };
    expect(() =>
      parseBillEobComparisonEnvelope(
        comparisonEnvelope(unclearWithoutLimitation),
        sourceContext,
      ),
    ).toThrow(InvalidBillEobComparisonOutputError);
  });

  it("requires source evidence for every visible side and for a stated difference", () => {
    const missingBillEvidence = {
      ...syntheticBillEobComparisonReport(),
      visibleComparison: [
        {
          ...syntheticBillEobComparisonReport().visibleComparison[0],
          billEvidence: null,
        },
      ],
    };
    expect(() =>
      parseBillEobComparisonEnvelope(
        comparisonEnvelope(missingBillEvidence),
        sourceContext,
      ),
    ).toThrow(InvalidBillEobComparisonOutputError);

    const oneVisibleSide = {
      ...syntheticBillEobComparisonReport(),
      visibleComparison: [
        {
          ...syntheticBillEobComparisonReport().visibleComparison[0],
          eobValue: null,
          eobEvidence: null,
          difference: null,
        },
      ],
    };
    expect(
      parseBillEobComparisonEnvelope(
        comparisonEnvelope(oneVisibleSide),
        sourceContext,
      ).report.visibleComparison[0].eobValue,
    ).toBeNull();
  });

  it("canonicalizes unsupported evidence pages and removes identifying claim values", () => {
    const report = {
      ...syntheticBillEobComparisonReport(),
      matchAssessment: {
        appearsRelated: "yes" as const,
        matchingEvidence: [
          "Claim reference: SYNTHETIC-CLAIM-1000 appears on both documents.",
        ],
        limitations: ["Visible fields can be incomplete."],
      },
      visibleComparison: [
        {
          ...syntheticBillEobComparisonReport().visibleComparison[0],
          field: "Claim ID",
          billValue: "SYNTHETIC-CLAIM-1000",
          eobValue: "SYNTHETIC-CLAIM-1000",
          difference: null,
          billEvidence: { page: 5, visibleText: "Claim ID: SYNTHETIC-CLAIM-1000" },
          eobEvidence: { page: 1, visibleText: "Claim ID: SYNTHETIC-CLAIM-1000" },
        },
      ],
    };
    const parsed = parseBillEobComparisonEnvelope(
      comparisonEnvelope(report),
      sourceContext,
    ).report;
    const delivered = JSON.stringify(parsed);
    expect(delivered).not.toContain("SYNTHETIC-CLAIM-1000");
    expect(parsed.visibleComparison[0].billValue).toBe("[identifier redacted]");
    expect(parsed.visibleComparison[0].billEvidence?.page).toBeNull();
    expect(parsed.visibleComparison[0].eobEvidence?.page).toBe(1);
  });

  it.each([
    "## Arbitrary Markdown",
    "<script>alert(1)</script>",
    "[outside](https://example.test)",
    "This difference proves an error.",
  ])("rejects unsafe comparison prose: %s", (question) => {
    expect(() =>
      parseBillEobComparisonEnvelope(
        comparisonEnvelope({
          ...syntheticBillEobComparisonReport(),
          questions: [question],
        }),
        sourceContext,
      ),
    ).toThrow(InvalidBillEobComparisonOutputError);
  });
});
