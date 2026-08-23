import type { BillEobComparisonReport } from "@/lib/bill-eob-comparison-schema";
import { syntheticBillAnalysisReport } from "./bill-analysis-fixture";

export function syntheticBillEobComparisonReport(): BillEobComparisonReport {
  return {
    billDocument: syntheticBillAnalysisReport(),
    eobDocument: syntheticBillAnalysisReport(),
    matchAssessment: {
      appearsRelated: "unclear",
      matchingEvidence: [],
      limitations: [
        "The synthetic documents do not show enough shared information to assess a relationship.",
      ],
    },
    visibleComparison: [
      {
        field: "Labeled amount",
        billValue: "$100.00",
        eobValue: "$80.00",
        difference: "$20.00",
        billEvidence: { page: 1, visibleText: "Labeled amount $100.00" },
        eobEvidence: { page: 1, visibleText: "Labeled amount $80.00" },
        questionToVerify:
          "What does each labeled amount represent on its source document?",
      },
    ],
    questions: ["Can the document issuers explain the visible difference?"],
    limitations: [
      "A visible difference is a question to verify, not proof of an error or an amount owed.",
    ],
  };
}

export function comparisonEnvelope(
  report: BillEobComparisonReport = syntheticBillEobComparisonReport(),
) {
  return {
    type: "message",
    model: "claude-sonnet-4-6",
    stop_reason: "end_turn",
    content: [{ type: "text", text: JSON.stringify(report) }],
    usage: { input_tokens: 200, output_tokens: 100 },
  };
}
