import { describe, expect, it } from "vitest";
import {
  InvalidBillAnalysisOutputError,
  parseBillAnalysisEnvelope,
} from "@/lib/bill-analysis-output";
import { anthropicReportEnvelope, syntheticBillAnalysisReport } from "./bill-analysis-fixture";

describe("structured bill analysis output", () => {
  it("accepts a strict report and parses bounded usage", () => {
    const parsed = parseBillAnalysisEnvelope(anthropicReportEnvelope(), {
      sourceKind: "image",
      pageCount: null,
    });
    expect(parsed.report).toEqual(syntheticBillAnalysisReport());
    expect(parsed.model).toBe("claude-sonnet-4-6");
    expect(parsed.usage).toEqual({ inputTokens: 100, outputTokens: 50 });
  });

  it("rejects extra properties, missing properties, and unsupported stop reasons", () => {
    const extra = { ...syntheticBillAnalysisReport(), arbitrary: "value" };
    expect(() =>
      parseBillAnalysisEnvelope(anthropicReportEnvelope(extra as never), {
        sourceKind: "image",
        pageCount: null,
      }),
    ).toThrow(InvalidBillAnalysisOutputError);

    const missing = { ...syntheticBillAnalysisReport() } as Record<string, unknown>;
    delete missing.reportLimitations;
    expect(() =>
      parseBillAnalysisEnvelope(anthropicReportEnvelope(missing as never), {
        sourceKind: "image",
        pageCount: null,
      }),
    ).toThrow(InvalidBillAnalysisOutputError);

    expect(() =>
      parseBillAnalysisEnvelope(
        { ...anthropicReportEnvelope(), stop_reason: "max_tokens" },
        { sourceKind: "image", pageCount: null },
      ),
    ).toThrow(InvalidBillAnalysisOutputError);
  });

  it("canonicalizes unsupported pages to null and preserves valid PDF pages", () => {
    const report = {
      ...syntheticBillAnalysisReport(),
      documentType: {
        type: "provider_bill" as const,
        evidenceQuality: "clear" as const,
        evidence: [{ page: 2, visibleText: "Provider statement" }],
      },
    };
    const image = parseBillAnalysisEnvelope(anthropicReportEnvelope(report), {
      sourceKind: "image",
      pageCount: null,
    });
    const pdf = parseBillAnalysisEnvelope(anthropicReportEnvelope(report), {
      sourceKind: "pdf",
      pageCount: 2,
    });
    expect(image.report.documentType.evidence[0].page).toBeNull();
    expect(pdf.report.documentType.evidence[0].page).toBe(2);

    const outside = parseBillAnalysisEnvelope(
      anthropicReportEnvelope({
        ...report,
        documentType: {
          ...report.documentType,
          evidence: [{ page: 3, visibleText: "Provider statement" }],
        },
      }),
      { sourceKind: "pdf", pageCount: 2 },
    );
    expect(outside.report.documentType.evidence[0].page).toBeNull();
  });

  it("suppresses high-confidence identifiers while preserving amounts, service dates, and codes", () => {
    const report = {
      ...syntheticBillAnalysisReport(),
      documentSummary:
        "Patient name: TEST PERSON. Email test.person@example.test. Phone 202-555-0100.",
      visibleFields: [
        {
          field: "Service date",
          value: "08/23/2026",
          category: "service_date" as const,
          page: null,
          visibleText: "Service date 08/23/2026",
          evidenceQuality: "clear" as const,
          explanation: "A service date is visibly labeled.",
          limitation: null,
        },
      ],
      amounts: [
        {
          label: "Provider charge",
          amount: "$12,345.67",
          page: null,
          visibleText: "Provider charge $12,345.67",
          evidenceQuality: "clear" as const,
        },
      ],
      visibleCodes: [
        {
          system: "CPT" as const,
          code: "12345",
          visibleDescription: null,
          page: null,
          visibleText: "CPT 12345",
          evidenceQuality: "clear" as const,
          rightsLimited: true,
        },
        {
          system: "NDC" as const,
          code: "12345-6789-01",
          visibleDescription: null,
          page: null,
          visibleText: "NDC 12345-6789-01",
          evidenceQuality: "clear" as const,
          rightsLimited: false,
        },
      ],
    };
    const parsed = parseBillAnalysisEnvelope(anthropicReportEnvelope(report), {
      sourceKind: "image",
      pageCount: null,
    });
    const delivered = JSON.stringify(parsed.report);
    expect(delivered).not.toContain("TEST PERSON");
    expect(delivered).not.toContain("test.person@example.test");
    expect(delivered).not.toContain("202-555-0100");
    expect(delivered).toContain("08/23/2026");
    expect(delivered).toContain("$12,345.67");
    expect(delivered).toContain("12345-6789-01");
  });

  it.each([
    "## Arbitrary Markdown",
    "<script>alert(1)</script>",
    "[model link](https://example.test)",
    "This charge is fraudulent.",
    "You should refuse payment.",
    "Confidence is 90%.",
    "90 percent confidence.",
  ])("rejects unsafe formatting or conclusions: %s", (documentSummary) => {
    expect(() =>
      parseBillAnalysisEnvelope(
        anthropicReportEnvelope({
          ...syntheticBillAnalysisReport(),
          documentSummary,
        }),
        { sourceKind: "image", pageCount: null },
      ),
    ).toThrow(InvalidBillAnalysisOutputError);
  });

  it.each([
    { system: "CPT" as const, code: "12345" },
    { system: "HCPCS" as const, code: "A0001" },
    { system: "other" as const, code: "SYN-1" },
  ])(
    "derives fail-closed rights handling for $system instead of trusting the model",
    ({ system, code }) => {
      const visibleDescription = "Synthetic descriptor that must not be reproduced";
      const report = {
        ...syntheticBillAnalysisReport(),
        visibleCodes: [
          {
            system,
            code,
            visibleDescription,
            page: null,
            visibleText: `${code} ${visibleDescription}`,
            evidenceQuality: "clear" as const,
            rightsLimited: false,
          },
        ],
      };
      const parsed = parseBillAnalysisEnvelope(anthropicReportEnvelope(report), {
        sourceKind: "image",
        pageCount: null,
      });

      expect(parsed.report.visibleCodes[0]).toMatchObject({
        system,
        code,
        visibleDescription: null,
        visibleText: code,
        rightsLimited: true,
      });
      expect(JSON.stringify(parsed.report)).not.toContain(visibleDescription);
    },
  );
});
