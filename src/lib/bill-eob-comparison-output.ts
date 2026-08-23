import {
  parseBillAnalysisEnvelope,
  type AnalysisSourceContext,
  type AnthropicUsage,
} from "./bill-analysis-output";
import { scrubLikelyIdentifiers } from "./bill-analysis-scrubber";
import {
  isBillEobComparisonReport,
  type BillEobComparisonReport,
  type VisibleDocumentComparison,
} from "./bill-eob-comparison-schema";

const LIMITS = Object.freeze({
  matchingEvidence: 12,
  matchLimitations: 12,
  visibleComparison: 30,
  questions: 12,
  limitations: 12,
  label: 120,
  value: 360,
  evidence: 280,
  prose: 900,
});

const UNSAFE_FORMATTING = [
  /<[a-z!/][^>]*>/i,
  /```|~~~/,
  /`[^`]+`/,
  /!\[[^\]]*\]\([^)]+\)/,
  /\[[^\]]+\]\([^)]+\)/,
  /(^|\n)\s{0,3}#{1,6}\s/,
  /(^|\n)\s*[-*+]\s+/,
  /\*\*[^*]+\*\*/,
] as const;

const LINK_DESTINATION = /\b(?:https?:\/\/|mailto:|tel:|javascript:|www\.)\S+/i;
const UNSUPPORTED_CONCLUSIONS = [
  /\b(?:proves?|confirms?|demonstrates?)\s+(?:an?\s+)?(?:error|fraud|illegality|upcoding|unbundling)\b/i,
  /\b(?:is|are|was|were)\s+(?:fraudulent|illegal|unlawful|upcoded|unbundled|overpriced|unfair)\b/i,
  /\byou\s+(?:do\s+not\s+|don't\s+)?(?:legally\s+)?owe\b/i,
  /\b(?:must|should|need to)\s+(?:pay|refuse|delay|ignore)\b/i,
  /\b\d{1,3}(?:\.\d+)?\s*%\s+(?:confiden|accurat|probab)/i,
] as const;

const IDENTIFIER_FIELD =
  /\b(?:patient|member|subscriber|account|claim|birth|address|phone|email|social security|ssn|barcode)\b/i;
const CLAIM_REFERENCE =
  /\b(claim\s+reference)\s*[:#-]?\s*[A-Z0-9][A-Z0-9._/-]{3,63}\b/gi;
const REDACTED = "[identifier redacted]";

export type BillEobComparisonSourceContext = Readonly<{
  billDocument: AnalysisSourceContext;
  eobDocument: AnalysisSourceContext;
}>;

export type ParsedBillEobComparison = Readonly<{
  report: BillEobComparisonReport;
  model: string;
  usage: AnthropicUsage | null;
}>;

export class InvalidBillEobComparisonOutputError extends Error {
  constructor() {
    super("Invalid bill and EOB comparison output");
    this.name = "InvalidBillEobComparisonOutputError";
  }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function assertArrayMaximum<T>(
  values: ReadonlyArray<T>,
  maximum: number,
): void {
  if (values.length > maximum)
    throw new InvalidBillEobComparisonOutputError();
}

function assertBoundedString(value: string, maximum: number): void {
  if (
    value.length > maximum ||
    value.trim().length === 0 ||
    /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(value)
  ) {
    throw new InvalidBillEobComparisonOutputError();
  }
}

function assertSafeString(value: string): void {
  if (
    LINK_DESTINATION.test(value) ||
    UNSAFE_FORMATTING.some((pattern) => pattern.test(value)) ||
    UNSUPPORTED_CONCLUSIONS.some((pattern) => pattern.test(value))
  ) {
    throw new InvalidBillEobComparisonOutputError();
  }
}

function assertEvidence(
  evidence: VisibleDocumentComparison["billEvidence"],
): void {
  if (evidence === null) return;
  assertBoundedString(evidence.visibleText, LIMITS.evidence);
  assertSafeString(evidence.visibleText);
}

function assertRuntimeContract(report: BillEobComparisonReport): void {
  assertArrayMaximum(
    report.matchAssessment.matchingEvidence,
    LIMITS.matchingEvidence,
  );
  assertArrayMaximum(
    report.matchAssessment.limitations,
    LIMITS.matchLimitations,
  );
  assertArrayMaximum(report.visibleComparison, LIMITS.visibleComparison);
  assertArrayMaximum(report.questions, LIMITS.questions);
  assertArrayMaximum(report.limitations, LIMITS.limitations);

  if (
    report.matchAssessment.appearsRelated !== "unclear" &&
    report.matchAssessment.matchingEvidence.length === 0
  ) {
    throw new InvalidBillEobComparisonOutputError();
  }
  if (
    report.matchAssessment.appearsRelated === "unclear" &&
    report.matchAssessment.limitations.length === 0
  ) {
    throw new InvalidBillEobComparisonOutputError();
  }
  if (report.questions.length === 0 || report.limitations.length === 0)
    throw new InvalidBillEobComparisonOutputError();

  for (const value of report.matchAssessment.matchingEvidence) {
    assertBoundedString(value, LIMITS.prose);
    assertSafeString(value);
  }
  for (const value of report.matchAssessment.limitations) {
    assertBoundedString(value, LIMITS.prose);
    assertSafeString(value);
  }
  for (const comparison of report.visibleComparison) {
    assertBoundedString(comparison.field, LIMITS.label);
    assertBoundedString(comparison.questionToVerify, LIMITS.prose);
    assertSafeString(comparison.field);
    assertSafeString(comparison.questionToVerify);

    if (comparison.billValue === null && comparison.eobValue === null)
      throw new InvalidBillEobComparisonOutputError();
    if ((comparison.billValue === null) !== (comparison.billEvidence === null))
      throw new InvalidBillEobComparisonOutputError();
    if ((comparison.eobValue === null) !== (comparison.eobEvidence === null))
      throw new InvalidBillEobComparisonOutputError();
    if (
      comparison.difference !== null &&
      (comparison.billEvidence === null || comparison.eobEvidence === null)
    ) {
      throw new InvalidBillEobComparisonOutputError();
    }

    for (const value of [
      comparison.billValue,
      comparison.eobValue,
      comparison.difference,
    ]) {
      if (value !== null) {
        assertBoundedString(value, LIMITS.value);
        assertSafeString(value);
      }
    }
    assertEvidence(comparison.billEvidence);
    assertEvidence(comparison.eobEvidence);
  }
  for (const value of report.questions) {
    assertBoundedString(value, LIMITS.prose);
    assertSafeString(value);
  }
  for (const value of report.limitations) {
    assertBoundedString(value, LIMITS.prose);
    assertSafeString(value);
  }
}

function scrubComparisonString(value: string): string {
  return scrubLikelyIdentifiers(value).replace(
    CLAIM_REFERENCE,
    (_match, label: string) => `${label}: ${REDACTED}`,
  );
}

function scrubNullable(value: string | null): string | null {
  return value === null ? null : scrubComparisonString(value);
}

function supportedPage(
  page: number | null,
  context: AnalysisSourceContext,
): number | null {
  if (
    context.sourceKind !== "pdf" ||
    context.pageCount === null ||
    page === null ||
    !Number.isInteger(page) ||
    page < 1 ||
    page > context.pageCount
  ) {
    return null;
  }
  return page;
}

function scrubComparison(
  report: BillEobComparisonReport,
  billDocument: BillEobComparisonReport["billDocument"],
  eobDocument: BillEobComparisonReport["eobDocument"],
  context: BillEobComparisonSourceContext,
): BillEobComparisonReport {
  return {
    billDocument,
    eobDocument,
    matchAssessment: {
      appearsRelated: report.matchAssessment.appearsRelated,
      matchingEvidence:
        report.matchAssessment.matchingEvidence.map(scrubComparisonString),
      limitations: report.matchAssessment.limitations.map(scrubComparisonString),
    },
    visibleComparison: report.visibleComparison.map((comparison) => {
      const identifierField = IDENTIFIER_FIELD.test(comparison.field);
      return {
        field: scrubComparisonString(comparison.field),
        billValue:
          identifierField && comparison.billValue !== null
            ? REDACTED
            : scrubNullable(comparison.billValue),
        eobValue:
          identifierField && comparison.eobValue !== null
            ? REDACTED
            : scrubNullable(comparison.eobValue),
        difference: scrubNullable(comparison.difference),
        billEvidence:
          comparison.billEvidence === null
            ? null
            : {
                page: supportedPage(
                  comparison.billEvidence.page,
                  context.billDocument,
                ),
                visibleText: scrubComparisonString(
                  comparison.billEvidence.visibleText,
                ),
              },
        eobEvidence:
          comparison.eobEvidence === null
            ? null
            : {
                page: supportedPage(
                  comparison.eobEvidence.page,
                  context.eobDocument,
                ),
                visibleText: scrubComparisonString(
                  comparison.eobEvidence.visibleText,
                ),
              },
        questionToVerify: scrubComparisonString(comparison.questionToVerify),
      };
    }),
    questions: report.questions.map(scrubComparisonString),
    limitations: report.limitations.map(scrubComparisonString),
  };
}

function validateNestedReport(
  report: BillEobComparisonReport["billDocument"],
  context: AnalysisSourceContext,
): BillEobComparisonReport["billDocument"] {
  return parseBillAnalysisEnvelope(
    {
      stop_reason: "end_turn",
      content: [{ type: "text", text: JSON.stringify(report) }],
    },
    context,
  ).report;
}

export function validateBillEobComparisonReport(
  value: unknown,
  context: BillEobComparisonSourceContext,
): BillEobComparisonReport {
  if (!isBillEobComparisonReport(value))
    throw new InvalidBillEobComparisonOutputError();

  try {
    assertRuntimeContract(value);
    const report = scrubComparison(
      value,
      validateNestedReport(value.billDocument, context.billDocument),
      validateNestedReport(value.eobDocument, context.eobDocument),
      context,
    );
    if (!isBillEobComparisonReport(report))
      throw new InvalidBillEobComparisonOutputError();
    assertRuntimeContract(report);
    return report;
  } catch (error) {
    if (error instanceof InvalidBillEobComparisonOutputError) throw error;
    throw new InvalidBillEobComparisonOutputError();
  }
}

function parseUsage(value: unknown): AnthropicUsage | null {
  const usage = asRecord(value);
  const inputTokens = usage?.input_tokens;
  const outputTokens = usage?.output_tokens;
  if (
    typeof inputTokens !== "number" ||
    !Number.isSafeInteger(inputTokens) ||
    inputTokens < 0 ||
    typeof outputTokens !== "number" ||
    !Number.isSafeInteger(outputTokens) ||
    outputTokens < 0
  ) {
    return null;
  }
  return { inputTokens, outputTokens };
}

export function parseBillEobComparisonEnvelope(
  value: unknown,
  context: BillEobComparisonSourceContext,
): ParsedBillEobComparison {
  const envelope = asRecord(value);
  if (!envelope || envelope.stop_reason !== "end_turn")
    throw new InvalidBillEobComparisonOutputError();
  if (!Array.isArray(envelope.content) || envelope.content.length !== 1)
    throw new InvalidBillEobComparisonOutputError();
  const block = asRecord(envelope.content[0]);
  if (!block || block.type !== "text" || typeof block.text !== "string")
    throw new InvalidBillEobComparisonOutputError();

  let parsed: unknown;
  try {
    parsed = JSON.parse(block.text);
  } catch {
    throw new InvalidBillEobComparisonOutputError();
  }

  return {
    report: validateBillEobComparisonReport(parsed, context),
    model:
      typeof envelope.model === "string"
        ? envelope.model.slice(0, 120)
        : "unknown",
    usage: parseUsage(envelope.usage),
  };
}
