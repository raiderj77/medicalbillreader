import Ajv from "ajv";

export const BILL_ANALYSIS_SCHEMA_VERSION = "2026-08-23.1";

export const DOCUMENT_TYPES = [
  "provider_bill",
  "itemized_bill",
  "eob",
  "other",
  "unclear",
] as const;

export const EVIDENCE_QUALITIES = ["clear", "partial", "unclear"] as const;

export const FIELD_CATEGORIES = [
  "provider",
  "service_date",
  "charge",
  "adjustment",
  "payment",
  "responsibility",
  "code",
  "other",
] as const;

export const CODE_SYSTEMS = [
  "CPT",
  "HCPCS",
  "ICD-10-CM",
  "NDC",
  "DRG",
  "revenue",
  "modifier",
  "other",
  "unclear",
] as const;

export const VERIFICATION_ITEM_TYPES = [
  "possible_exact_duplicate",
  "visible_amount_mismatch",
  "unfamiliar_service",
  "unclear_field",
  "missing_information",
  "arithmetic_question",
  "other",
] as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[number];
export type EvidenceQuality = (typeof EVIDENCE_QUALITIES)[number];
export type FieldCategory = (typeof FIELD_CATEGORIES)[number];
export type CodeSystem = (typeof CODE_SYSTEMS)[number];
export type VerificationItemType = (typeof VERIFICATION_ITEM_TYPES)[number];

export type Evidence = Readonly<{
  page: number | null;
  visibleText: string;
}>;

export type BillAnalysisReport = Readonly<{
  documentType: Readonly<{
    type: DocumentType;
    evidenceQuality: EvidenceQuality;
    evidence: ReadonlyArray<Evidence>;
  }>;
  documentSummary: string;
  visibleFields: ReadonlyArray<
    Readonly<{
      field: string;
      value: string;
      category: FieldCategory;
      page: number | null;
      visibleText: string;
      evidenceQuality: EvidenceQuality;
      explanation: string;
      limitation: string | null;
    }>
  >;
  amounts: ReadonlyArray<
    Readonly<{
      label: string;
      amount: string;
      page: number | null;
      visibleText: string;
      evidenceQuality: EvidenceQuality;
    }>
  >;
  visibleCodes: ReadonlyArray<
    Readonly<{
      system: CodeSystem;
      code: string;
      visibleDescription: string | null;
      page: number | null;
      visibleText: string;
      evidenceQuality: EvidenceQuality;
      rightsLimited: boolean;
    }>
  >;
  itemsToVerify: ReadonlyArray<
    Readonly<{
      type: VerificationItemType;
      question: string;
      reason: string;
      page: number | null;
      visibleText: string | null;
      limitation: string;
    }>
  >;
  nextQuestions: ReadonlyArray<string>;
  reportLimitations: ReadonlyArray<string>;
}>;

const nullableInteger = {
  anyOf: [{ type: "integer" }, { type: "null" }],
} as const;
const nullableString = {
  anyOf: [{ type: "string" }, { type: "null" }],
} as const;

/**
 * This schema is intentionally limited to constraints supported by Anthropic's
 * GA structured-output grammar. Application-specific length, count, evidence,
 * and safety constraints are enforced again after parsing.
 */
export const BILL_ANALYSIS_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    documentType: {
      type: "object",
      additionalProperties: false,
      properties: {
        type: { type: "string", enum: DOCUMENT_TYPES },
        evidenceQuality: { type: "string", enum: EVIDENCE_QUALITIES },
        evidence: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              page: nullableInteger,
              visibleText: { type: "string" },
            },
            required: ["page", "visibleText"],
          },
        },
      },
      required: ["type", "evidenceQuality", "evidence"],
    },
    documentSummary: { type: "string" },
    visibleFields: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          field: { type: "string" },
          value: { type: "string" },
          category: { type: "string", enum: FIELD_CATEGORIES },
          page: nullableInteger,
          visibleText: { type: "string" },
          evidenceQuality: { type: "string", enum: EVIDENCE_QUALITIES },
          explanation: { type: "string" },
          limitation: nullableString,
        },
        required: [
          "field",
          "value",
          "category",
          "page",
          "visibleText",
          "evidenceQuality",
          "explanation",
          "limitation",
        ],
      },
    },
    amounts: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          label: { type: "string" },
          amount: { type: "string" },
          page: nullableInteger,
          visibleText: { type: "string" },
          evidenceQuality: { type: "string", enum: EVIDENCE_QUALITIES },
        },
        required: ["label", "amount", "page", "visibleText", "evidenceQuality"],
      },
    },
    visibleCodes: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          system: { type: "string", enum: CODE_SYSTEMS },
          code: { type: "string" },
          visibleDescription: nullableString,
          page: nullableInteger,
          visibleText: { type: "string" },
          evidenceQuality: { type: "string", enum: EVIDENCE_QUALITIES },
          rightsLimited: { type: "boolean" },
        },
        required: [
          "system",
          "code",
          "visibleDescription",
          "page",
          "visibleText",
          "evidenceQuality",
          "rightsLimited",
        ],
      },
    },
    itemsToVerify: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          type: { type: "string", enum: VERIFICATION_ITEM_TYPES },
          question: { type: "string" },
          reason: { type: "string" },
          page: nullableInteger,
          visibleText: nullableString,
          limitation: { type: "string" },
        },
        required: ["type", "question", "reason", "page", "visibleText", "limitation"],
      },
    },
    nextQuestions: { type: "array", items: { type: "string" } },
    reportLimitations: { type: "array", items: { type: "string" } },
  },
  required: [
    "documentType",
    "documentSummary",
    "visibleFields",
    "amounts",
    "visibleCodes",
    "itemsToVerify",
    "nextQuestions",
    "reportLimitations",
  ],
} as const;

const ajv = new Ajv({ allErrors: false, strict: true });
const validateSchema = ajv.compile(BILL_ANALYSIS_JSON_SCHEMA);

export function isBillAnalysisReport(value: unknown): value is BillAnalysisReport {
  return validateSchema(value) === true;
}
