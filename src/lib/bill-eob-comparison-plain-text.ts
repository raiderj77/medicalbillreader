import { billAnalysisToPlainText } from "./bill-analysis-plain-text";
import type { BillEobComparisonReport } from "./bill-eob-comparison-schema";

function pageLabel(page: number | null): string {
  return page === null ? "" : ` (page ${page})`;
}

function addSection(
  lines: string[],
  heading: string,
  values: ReadonlyArray<string>,
): void {
  lines.push(heading);
  if (values.length === 0) {
    lines.push("None shown.");
  } else {
    values.forEach((value, index) => lines.push(`Item ${index + 1}: ${value}`));
  }
  lines.push("");
}

/**
 * Produces literal plain text only. No Markdown, HTML, or link renderer is
 * involved; callers must supply the server-validated comparison report.
 */
export function billEobComparisonToPlainText(
  report: BillEobComparisonReport,
): string {
  const lines: string[] = [];

  addSection(lines, "Provider bill document", [
    billAnalysisToPlainText(report.billDocument),
  ]);
  addSection(lines, "EOB document", [
    billAnalysisToPlainText(report.eobDocument),
  ]);
  addSection(lines, "Match assessment", [
    `Appears related: ${report.matchAssessment.appearsRelated}.`,
    ...report.matchAssessment.matchingEvidence.map(
      (evidence) => `Visible matching evidence: ${evidence}`,
    ),
    ...report.matchAssessment.limitations.map(
      (limitation) => `Match limitation: ${limitation}`,
    ),
  ]);
  addSection(
    lines,
    "Visible comparison",
    report.visibleComparison.map((comparison) => {
      const billEvidence = comparison.billEvidence
        ? ` Bill evidence${pageLabel(comparison.billEvidence.page)}: ${comparison.billEvidence.visibleText}.`
        : " Bill evidence: not visibly supported.";
      const eobEvidence = comparison.eobEvidence
        ? ` EOB evidence${pageLabel(comparison.eobEvidence.page)}: ${comparison.eobEvidence.visibleText}.`
        : " EOB evidence: not visibly supported.";
      return `${comparison.field}. Bill: ${comparison.billValue ?? "not visible"}. EOB: ${comparison.eobValue ?? "not visible"}. Difference: ${comparison.difference ?? "not calculated"}.${billEvidence}${eobEvidence} Question to verify: ${comparison.questionToVerify}`;
    }),
  );
  addSection(lines, "Questions", report.questions);
  addSection(lines, "Limitations", report.limitations);

  return lines.join("\n").trim();
}
