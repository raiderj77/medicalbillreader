import {
  BILL_ANALYSIS_JSON_SCHEMA,
  isBillAnalysisReport,
  type BillAnalysisReport,
} from "./bill-analysis-schema";
import {
  assertSafeBillAnalysisText,
  scrubBillAnalysisReport,
} from "./bill-analysis-scrubber";
import {
  codeDescriptionRightsPermitRendering,
  getAnalysisCodeRights,
} from "../config/code-set-rights";

export const MAX_PROVIDER_RESPONSE_BYTES = 256 * 1024;

const LIMITS = Object.freeze({
  documentTypeEvidence: 4,
  visibleFields: 40,
  amounts: 30,
  visibleCodes: 30,
  itemsToVerify: 20,
  nextQuestions: 12,
  reportLimitations: 12,
  shortLabel: 120,
  code: 64,
  visibleText: 280,
  value: 360,
  prose: 900,
  summary: 1_200,
});

const AMOUNT = /^\(?-?\$?\d+(?:,\d{3})*(?:\.\d{1,2})?\)?$/;
const CODE = /^[A-Z0-9][A-Z0-9 ._/-]{0,63}$/i;

export type AnalysisSourceContext = Readonly<{
  sourceKind: "image" | "pdf";
  pageCount: number | null;
}>;

export type AnthropicUsage = Readonly<{
  inputTokens: number;
  outputTokens: number;
}>;

export type ParsedBillAnalysis = Readonly<{
  report: BillAnalysisReport;
  model: string;
  usage: AnthropicUsage | null;
}>;

export class InvalidBillAnalysisOutputError extends Error {
  constructor() {
    super("Invalid bill analysis output");
    this.name = "InvalidBillAnalysisOutputError";
  }
}

export class ProviderResponseTooLargeError extends Error {
  constructor() {
    super("Provider response is too large");
    this.name = "ProviderResponseTooLargeError";
  }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function assertBoundedString(value: string, maximum: number, allowEmpty = false): void {
  if (
    value.length > maximum ||
    (!allowEmpty && value.trim().length === 0) ||
    /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(value)
  ) {
    throw new InvalidBillAnalysisOutputError();
  }
}

function assertArrayMaximum<T>(value: ReadonlyArray<T>, maximum: number): void {
  if (value.length > maximum) throw new InvalidBillAnalysisOutputError();
}

function assertRuntimeContract(report: BillAnalysisReport): void {
  assertBoundedString(report.documentSummary, LIMITS.summary);
  assertArrayMaximum(report.documentType.evidence, LIMITS.documentTypeEvidence);
  assertArrayMaximum(report.visibleFields, LIMITS.visibleFields);
  assertArrayMaximum(report.amounts, LIMITS.amounts);
  assertArrayMaximum(report.visibleCodes, LIMITS.visibleCodes);
  assertArrayMaximum(report.itemsToVerify, LIMITS.itemsToVerify);
  assertArrayMaximum(report.nextQuestions, LIMITS.nextQuestions);
  assertArrayMaximum(report.reportLimitations, LIMITS.reportLimitations);

  if (
    report.documentType.type !== "unclear" &&
    report.documentType.evidence.length === 0
  ) {
    throw new InvalidBillAnalysisOutputError();
  }

  for (const evidence of report.documentType.evidence) {
    assertBoundedString(evidence.visibleText, LIMITS.visibleText);
  }
  for (const field of report.visibleFields) {
    assertBoundedString(field.field, LIMITS.shortLabel);
    assertBoundedString(field.value, LIMITS.value);
    assertBoundedString(field.visibleText, LIMITS.visibleText);
    assertBoundedString(field.explanation, LIMITS.prose);
    if (field.limitation !== null)
      assertBoundedString(field.limitation, LIMITS.prose);
  }
  for (const amount of report.amounts) {
    assertBoundedString(amount.label, LIMITS.shortLabel);
    assertBoundedString(amount.amount, LIMITS.shortLabel);
    assertBoundedString(amount.visibleText, LIMITS.visibleText);
    if (!AMOUNT.test(amount.amount.trim()))
      throw new InvalidBillAnalysisOutputError();
  }
  for (const code of report.visibleCodes) {
    assertBoundedString(code.code, LIMITS.code);
    assertBoundedString(code.visibleText, LIMITS.visibleText);
    if (code.visibleDescription !== null)
      assertBoundedString(code.visibleDescription, LIMITS.visibleText);
    if (!CODE.test(code.code.trim())) throw new InvalidBillAnalysisOutputError();
  }
  for (const item of report.itemsToVerify) {
    assertBoundedString(item.question, LIMITS.prose);
    assertBoundedString(item.reason, LIMITS.prose);
    assertBoundedString(item.limitation, LIMITS.prose);
    if (item.visibleText !== null)
      assertBoundedString(item.visibleText, LIMITS.visibleText);
  }
  for (const question of report.nextQuestions)
    assertBoundedString(question, LIMITS.prose);
  for (const limitation of report.reportLimitations)
    assertBoundedString(limitation, LIMITS.prose);

  if (report.reportLimitations.length === 0)
    throw new InvalidBillAnalysisOutputError();
}

function supportedPage(page: number | null, context: AnalysisSourceContext): number | null {
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

function canonicalizePages(
  report: BillAnalysisReport,
  context: AnalysisSourceContext,
): BillAnalysisReport {
  return {
    ...report,
    documentType: {
      ...report.documentType,
      evidence: report.documentType.evidence.map((evidence) => ({
        ...evidence,
        page: supportedPage(evidence.page, context),
      })),
    },
    visibleFields: report.visibleFields.map((field) => ({
      ...field,
      page: supportedPage(field.page, context),
    })),
    amounts: report.amounts.map((amount) => ({
      ...amount,
      page: supportedPage(amount.page, context),
    })),
    visibleCodes: report.visibleCodes.map((code) => ({
      ...code,
      page: supportedPage(code.page, context),
    })),
    itemsToVerify: report.itemsToVerify.map((item) => ({
      ...item,
      page: supportedPage(item.page, context),
    })),
  };
}

function enforceCodeSetRights(report: BillAnalysisReport): BillAnalysisReport {
  return {
    ...report,
    visibleCodes: report.visibleCodes.map((code) => {
      const rights = getAnalysisCodeRights(code.system);
      const descriptionAllowed = codeDescriptionRightsPermitRendering(rights);

      if (descriptionAllowed) {
        return {
          ...code,
          rightsLimited: false,
        };
      }

      return {
        ...code,
        visibleDescription: null,
        // Model-supplied evidence can contain a descriptor. Preserve only the
        // separately validated source code while rights remain unverified.
        visibleText: code.code,
        rightsLimited: true,
      };
    }),
  };
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

export function parseBillAnalysisEnvelope(
  value: unknown,
  context: AnalysisSourceContext,
): ParsedBillAnalysis {
  const envelope = asRecord(value);
  if (!envelope || envelope.stop_reason !== "end_turn")
    throw new InvalidBillAnalysisOutputError();

  const content = envelope.content;
  if (!Array.isArray(content) || content.length !== 1)
    throw new InvalidBillAnalysisOutputError();
  const block = asRecord(content[0]);
  if (!block || block.type !== "text" || typeof block.text !== "string")
    throw new InvalidBillAnalysisOutputError();

  let parsed: unknown;
  try {
    parsed = JSON.parse(block.text);
  } catch {
    throw new InvalidBillAnalysisOutputError();
  }
  if (!isBillAnalysisReport(parsed)) throw new InvalidBillAnalysisOutputError();

  let report: BillAnalysisReport;
  try {
    assertRuntimeContract(parsed);
    report = enforceCodeSetRights(
      scrubBillAnalysisReport(canonicalizePages(parsed, context)),
    );
    if (!isBillAnalysisReport(report)) throw new InvalidBillAnalysisOutputError();
    assertRuntimeContract(report);
    assertSafeBillAnalysisText(report);
  } catch (error) {
    if (error instanceof InvalidBillAnalysisOutputError) throw error;
    throw new InvalidBillAnalysisOutputError();
  }

  return {
    report,
    model: typeof envelope.model === "string" ? envelope.model.slice(0, 120) : "unknown",
    usage: parseUsage(envelope.usage),
  };
}

export async function readBoundedProviderJson(
  response: Response,
  maximumBytes = MAX_PROVIDER_RESPONSE_BYTES,
): Promise<unknown> {
  const declared = Number(response.headers.get("content-length") || 0);
  if (Number.isFinite(declared) && declared > maximumBytes)
    throw new ProviderResponseTooLargeError();
  if (!response.body) throw new InvalidBillAnalysisOutputError();

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maximumBytes) {
      await reader.cancel();
      throw new ProviderResponseTooLargeError();
    }
    chunks.push(value);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new InvalidBillAnalysisOutputError();
  }
}

export { BILL_ANALYSIS_JSON_SCHEMA };
