import type { BillAnalysisReport } from "./bill-analysis-schema";

const REDACTED = "[identifier redacted]";
const LINK_OMITTED = "[link omitted]";

const EMAIL = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const SSN = /\b\d{3}[- ]\d{2}[- ]\d{4}\b/g;
const PHONE = /(?:\+?1[ .-]?)?(?:\(\d{3}\)|\d{3})[ .-]\d{3}[ .-]\d{4}\b/g;
const DOB = /\b(date of birth|birth date|dob)\s*[:#-]?\s*(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}-\d{2}-\d{2}|[A-Z][a-z]+\s+\d{1,2},?\s+\d{4})\b/gi;
const LABELED_IDENTIFIER = /\b(member\s+id|subscriber\s+id|account\s+(?:number|no\.?|id)|claim\s+(?:number|no\.?|id)|barcode(?:\s+value)?)\s*[:#-]?\s*[A-Z0-9][A-Z0-9._/-]{3,63}\b/gi;
const LABELED_NAME = /\b(patient\s+name|member\s+name|subscriber\s+name)\s*[:#-]?\s*[A-Z][A-Z'.-]*(?:\s+[A-Z][A-Z'.-]*){0,3}\b/gi;
const STREET_ADDRESS = /\b\d{1,6}\s+(?:[A-Z0-9][A-Z0-9.'-]*\s+){1,5}(?:STREET|ST|AVENUE|AVE|ROAD|RD|BOULEVARD|BLVD|LANE|LN|DRIVE|DR|COURT|CT|CIRCLE|CIR|PARKWAY|PKWY|HIGHWAY|HWY)\b(?:\s+(?:APT|UNIT|SUITE|#)\s*[A-Z0-9-]+)?/gi;
const LONG_NUMERIC_IDENTIFIER = /(?<![$\d.,])\d{12,}(?![\d.,])/g;
// Keep Markdown delimiters out of the match so a model-supplied link remains
// detectable by the formatting guard after its destination is removed.
const URL = /\b(?:https?:\/\/|mailto:|tel:|javascript:|www\.)[^\s<>()\[\]]+/gi;

const IDENTIFIER_FIELD = /\b(?:patient|member|subscriber|account|claim|birth|address|phone|email|social security|ssn|barcode)\b/i;

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

const UNSUPPORTED_CONCLUSIONS = [
  /\b(?:is|are|was|were|appears?|seems?|likely|probably|definitely)\s+(?:fraudulent|illegal|unlawful|upcoded|unbundled|medically unnecessary|overpriced|unfair)\b/i,
  /\b(?:proves?|confirms?|demonstrates?)\s+(?:fraud|illegality|upcoding|unbundling|medical necessity)\b/i,
  /\byou\s+(?:do\s+not\s+|don't\s+)?(?:legally\s+)?owe\b/i,
  /\b(?:must|should|need to)\s+(?:pay|refuse|delay|ignore)\b/i,
  /\b(?:do not|don't)\s+pay\b/i,
  /\b\d{1,3}(?:\.\d+)?\s*(?:%|percent)\s+(?:confiden|accurat|probab)/i,
  /\b(?:confiden\w*|accurac\w*|probab\w*)\s*(?:is|of|:)?\s*\d{1,3}(?:\.\d+)?\s*(?:%|\bpercent\b)/i,
] as const;

function normalizeText(value: string): string {
  return value
    .normalize("NFKC")
    .replace(/[\u200B-\u200D\u2060\uFEFF]/g, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();
}

export function scrubLikelyIdentifiers(value: string): string {
  return normalizeText(value)
    .replace(URL, LINK_OMITTED)
    .replace(EMAIL, REDACTED)
    .replace(SSN, REDACTED)
    .replace(PHONE, REDACTED)
    .replace(DOB, (_match, label: string) => `${label}: ${REDACTED}`)
    .replace(LABELED_IDENTIFIER, (match) => {
      const separator = match.search(/[:#-]/);
      const label = separator >= 0 ? match.slice(0, separator).trim() : match.split(/\s+/).slice(0, -1).join(" ");
      return `${label || "Identifier"}: ${REDACTED}`;
    })
    .replace(LABELED_NAME, (match) => {
      const label = match.match(/^(patient\s+name|member\s+name|subscriber\s+name)/i)?.[0] || "Name";
      return `${label}: ${REDACTED}`;
    })
    .replace(STREET_ADDRESS, REDACTED)
    .replace(LONG_NUMERIC_IDENTIFIER, REDACTED);
}

function scrubNullable(value: string | null): string | null {
  return value === null ? null : scrubLikelyIdentifiers(value);
}

export function scrubBillAnalysisReport(report: BillAnalysisReport): BillAnalysisReport {
  return {
    documentType: {
      ...report.documentType,
      evidence: report.documentType.evidence.map((evidence) => ({
        ...evidence,
        visibleText: scrubLikelyIdentifiers(evidence.visibleText),
      })),
    },
    documentSummary: scrubLikelyIdentifiers(report.documentSummary),
    visibleFields: report.visibleFields.map((field) => ({
      ...field,
      field: scrubLikelyIdentifiers(field.field),
      value: IDENTIFIER_FIELD.test(field.field)
        ? REDACTED
        : scrubLikelyIdentifiers(field.value),
      visibleText: scrubLikelyIdentifiers(field.visibleText),
      explanation: scrubLikelyIdentifiers(field.explanation),
      limitation: scrubNullable(field.limitation),
    })),
    amounts: report.amounts.map((amount) => ({
      ...amount,
      label: scrubLikelyIdentifiers(amount.label),
      // Amount has a separate strict runtime grammar. Do not apply generic
      // identifier patterns that could damage a visibly supported dollar value.
      amount: normalizeText(amount.amount),
      visibleText: scrubLikelyIdentifiers(amount.visibleText),
    })),
    visibleCodes: report.visibleCodes.map((code) => ({
      ...code,
      // Code has a separate strict runtime grammar. In particular, an NDC or
      // other visible billing code must not be mistaken for a long identifier.
      code: normalizeText(code.code),
      visibleDescription: scrubNullable(code.visibleDescription),
      visibleText: scrubLikelyIdentifiers(code.visibleText),
    })),
    itemsToVerify: report.itemsToVerify.map((item) => ({
      ...item,
      question: scrubLikelyIdentifiers(item.question),
      reason: scrubLikelyIdentifiers(item.reason),
      visibleText: scrubNullable(item.visibleText),
      limitation: scrubLikelyIdentifiers(item.limitation),
    })),
    nextQuestions: report.nextQuestions.map(scrubLikelyIdentifiers),
    reportLimitations: report.reportLimitations.map(scrubLikelyIdentifiers),
  };
}

function reportStrings(report: BillAnalysisReport): string[] {
  return [
    report.documentSummary,
    ...report.documentType.evidence.map((item) => item.visibleText),
    ...report.visibleFields.flatMap((item) => [
      item.field,
      item.value,
      item.visibleText,
      item.explanation,
      item.limitation || "",
    ]),
    ...report.amounts.flatMap((item) => [item.label, item.amount, item.visibleText]),
    ...report.visibleCodes.flatMap((item) => [
      item.code,
      item.visibleDescription || "",
      item.visibleText,
    ]),
    ...report.itemsToVerify.flatMap((item) => [
      item.question,
      item.reason,
      item.visibleText || "",
      item.limitation,
    ]),
    ...report.nextQuestions,
    ...report.reportLimitations,
  ];
}

function matches(pattern: RegExp, value: string): boolean {
  pattern.lastIndex = 0;
  const result = pattern.test(value);
  pattern.lastIndex = 0;
  return result;
}

export class UnsafeBillAnalysisOutputError extends Error {
  constructor() {
    super("Unsafe bill analysis output");
    this.name = "UnsafeBillAnalysisOutputError";
  }
}

export function assertSafeBillAnalysisText(report: BillAnalysisReport): void {
  for (const value of reportStrings(report)) {
    if (
      matches(EMAIL, value) ||
      matches(SSN, value) ||
      matches(PHONE, value) ||
      matches(DOB, value) ||
      matches(LABELED_IDENTIFIER, value) ||
      matches(LABELED_NAME, value) ||
      matches(STREET_ADDRESS, value) ||
      matches(LONG_NUMERIC_IDENTIFIER, value) ||
      matches(URL, value) ||
      UNSAFE_FORMATTING.some((pattern) => pattern.test(value)) ||
      UNSUPPORTED_CONCLUSIONS.some((pattern) => pattern.test(value))
    ) {
      throw new UnsafeBillAnalysisOutputError();
    }
  }
}
