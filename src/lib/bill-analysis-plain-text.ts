import type { BillAnalysisReport } from "./bill-analysis-schema";

const DOCUMENT_TYPE_LABELS: Record<BillAnalysisReport["documentType"]["type"], string> = {
  provider_bill: "Provider bill",
  itemized_bill: "Itemized bill",
  eob: "Explanation of Benefits (EOB)",
  other: "Other document",
  unclear: "Unclear document type",
};

function pageLabel(page: number | null): string {
  return page === null ? "" : ` (page ${page})`;
}

function addSection(lines: string[], heading: string, values: string[]): void {
  lines.push(heading);
  lines.push(...(values.length ? values.map((value) => `- ${value}`) : ["- None shown."]));
  lines.push("");
}

export function billAnalysisToPlainText(report: BillAnalysisReport): string {
  const lines: string[] = [];
  addSection(lines, "What this document appears to be", [
    `${DOCUMENT_TYPE_LABELS[report.documentType.type]} (${report.documentType.evidenceQuality} evidence).`,
    report.documentSummary,
    ...report.documentType.evidence.map(
      (evidence) => `Visible evidence${pageLabel(evidence.page)}: ${evidence.visibleText}`,
    ),
  ]);

  addSection(
    lines,
    "Visible fields",
    report.visibleFields.map(
      (field) =>
        `${field.field}: ${field.value}${pageLabel(field.page)}. ${field.explanation}${
          field.limitation ? ` Limitation: ${field.limitation}` : ""
        }`,
    ),
  );
  addSection(
    lines,
    "Amounts shown",
    report.amounts.map(
      (amount) =>
        `${amount.label}: ${amount.amount}${pageLabel(amount.page)} (${amount.evidenceQuality} evidence).`,
    ),
  );
  addSection(
    lines,
    "Codes visible",
    report.visibleCodes.map(
      (code) =>
        `${code.system}: ${code.code}${pageLabel(code.page)}${
          code.visibleDescription ? `; visible description: ${code.visibleDescription}` : ""
        }. ${code.rightsLimited ? "Rights-limited; verify through an authorized source." : ""}`.trim(),
    ),
  );

  addSection(
    lines,
    "Items to verify",
    report.itemsToVerify.length
      ? report.itemsToVerify.map(
          (item) =>
            `${item.question}${pageLabel(item.page)} Reason: ${item.reason} Limitation: ${item.limitation}`,
        )
      : [
          "No specific item to verify was included in this report. That does not establish that the bill is correct; this is not a certified audit.",
        ],
  );
  addSection(
    lines,
    "Questions and next steps",
    report.nextQuestions.length
      ? [...report.nextQuestions]
      : ["Verify every important detail against the source document."],
  );
  addSection(lines, "Limitations", [...report.reportLimitations]);

  return lines.join("\n").trim();
}
