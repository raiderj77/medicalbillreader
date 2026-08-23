import type { BillAnalysisReport } from "@/lib/bill-analysis-schema";

export function syntheticBillAnalysisReport(): BillAnalysisReport {
  return {
    documentType: {
      type: "unclear",
      evidenceQuality: "unclear",
      evidence: [],
    },
    documentSummary: "The synthetic source does not clearly establish a document type.",
    visibleFields: [],
    amounts: [],
    visibleCodes: [],
    itemsToVerify: [],
    nextQuestions: ["Compare the report with the source document."],
    reportLimitations: [
      "This informational report is not a certified audit and does not determine legal responsibility.",
    ],
  };
}

export function anthropicReportEnvelope(
  report: BillAnalysisReport = syntheticBillAnalysisReport(),
) {
  return {
    type: "message",
    model: "claude-sonnet-4-6",
    stop_reason: "end_turn",
    content: [{ type: "text", text: JSON.stringify(report) }],
    usage: { input_tokens: 100, output_tokens: 50 },
  };
}
