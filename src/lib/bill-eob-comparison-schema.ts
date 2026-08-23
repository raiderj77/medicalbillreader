import Ajv from "ajv";
import {
  BILL_ANALYSIS_JSON_SCHEMA,
  type BillAnalysisReport,
  type Evidence,
} from "./bill-analysis-schema";

export const BILL_EOB_COMPARISON_SCHEMA_VERSION = "2026-08-23.1";

export const MATCH_ASSESSMENTS = ["yes", "no", "unclear"] as const;

export type MatchAssessment = (typeof MATCH_ASSESSMENTS)[number];

export type VisibleDocumentComparison = Readonly<{
  field: string;
  billValue: string | null;
  eobValue: string | null;
  difference: string | null;
  billEvidence: Evidence | null;
  eobEvidence: Evidence | null;
  questionToVerify: string;
}>;

export type BillEobComparisonReport = Readonly<{
  billDocument: BillAnalysisReport;
  eobDocument: BillAnalysisReport;
  matchAssessment: Readonly<{
    appearsRelated: MatchAssessment;
    matchingEvidence: ReadonlyArray<string>;
    limitations: ReadonlyArray<string>;
  }>;
  visibleComparison: ReadonlyArray<VisibleDocumentComparison>;
  questions: ReadonlyArray<string>;
  limitations: ReadonlyArray<string>;
}>;

const nullableString = {
  anyOf: [{ type: "string" }, { type: "null" }],
} as const;

const nullableEvidence = {
  anyOf: [
    {
      type: "object",
      additionalProperties: false,
      properties: {
        page: {
          anyOf: [{ type: "integer" }, { type: "null" }],
        },
        visibleText: { type: "string" },
      },
      required: ["page", "visibleText"],
    },
    { type: "null" },
  ],
} as const;

/**
 * Strict Phase 7 provider-output shape. Operational bounds and relationships
 * between values and evidence are checked after AJV validation.
 */
export const BILL_EOB_COMPARISON_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    billDocument: BILL_ANALYSIS_JSON_SCHEMA,
    eobDocument: BILL_ANALYSIS_JSON_SCHEMA,
    matchAssessment: {
      type: "object",
      additionalProperties: false,
      properties: {
        appearsRelated: { type: "string", enum: MATCH_ASSESSMENTS },
        matchingEvidence: { type: "array", items: { type: "string" } },
        limitations: { type: "array", items: { type: "string" } },
      },
      required: ["appearsRelated", "matchingEvidence", "limitations"],
    },
    visibleComparison: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          field: { type: "string" },
          billValue: nullableString,
          eobValue: nullableString,
          difference: nullableString,
          billEvidence: nullableEvidence,
          eobEvidence: nullableEvidence,
          questionToVerify: { type: "string" },
        },
        required: [
          "field",
          "billValue",
          "eobValue",
          "difference",
          "billEvidence",
          "eobEvidence",
          "questionToVerify",
        ],
      },
    },
    questions: { type: "array", items: { type: "string" } },
    limitations: { type: "array", items: { type: "string" } },
  },
  required: [
    "billDocument",
    "eobDocument",
    "matchAssessment",
    "visibleComparison",
    "questions",
    "limitations",
  ],
} as const;

const ajv = new Ajv({ allErrors: false, strict: true });
const validateSchema = ajv.compile(BILL_EOB_COMPARISON_JSON_SCHEMA);

export function isBillEobComparisonReport(
  value: unknown,
): value is BillEobComparisonReport {
  return validateSchema(value) === true;
}
