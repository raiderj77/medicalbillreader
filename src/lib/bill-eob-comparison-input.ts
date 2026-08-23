import { COMPARISON_LIMITS } from "@/config/comparison-readiness";
import type { ValidatedUpload } from "./upload-validation";

export const COMPARISON_DOCUMENT_SLOTS = [
  "billDocument",
  "eobDocument",
] as const;

export type BillComparisonUploadSlot = Readonly<{
  slot: "billDocument";
  declaredType: "provider_bill" | "not_sure";
  upload: ValidatedUpload;
}>;

export type EobComparisonUploadSlot = Readonly<{
  slot: "eobDocument";
  declaredType: "eob" | "not_sure";
  upload: ValidatedUpload;
}>;

export type BillEobComparisonInput = readonly [
  BillComparisonUploadSlot,
  EobComparisonUploadSlot,
];

export type ValidatedBillEobComparisonInput = Readonly<{
  documents: BillEobComparisonInput;
  decodedBytes: number;
  pageCount: number;
}>;

export class BillEobComparisonInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BillEobComparisonInputError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasOnlyKeys(
  value: Record<string, unknown>,
  expected: ReadonlyArray<string>,
): boolean {
  const keys = Object.keys(value);
  return (
    keys.length === expected.length &&
    keys.every((key) => expected.includes(key))
  );
}

function decodedBase64Length(value: string): number {
  if (
    value.length === 0 ||
    value.length % 4 !== 0 ||
    !/^[A-Za-z0-9+/]*={0,2}$/.test(value)
  ) {
    throw new BillEobComparisonInputError(
      "A validated document has malformed file metadata.",
    );
  }
  const padding = value.endsWith("==") ? 2 : value.endsWith("=") ? 1 : 0;
  const decodedBytes = (value.length / 4) * 3 - padding;
  if (!Number.isSafeInteger(decodedBytes) || decodedBytes < 1)
    throw new BillEobComparisonInputError(
      "A validated document has malformed file metadata.",
    );
  return decodedBytes;
}

function validateUploadMetadata(value: unknown): {
  upload: ValidatedUpload;
  decodedBytes: number;
  pageCount: number;
} {
  if (
    !isRecord(value) ||
    !hasOnlyKeys(value, ["mediaType", "data", "pageCount"]) ||
    typeof value.mediaType !== "string" ||
    !COMPARISON_LIMITS.supportedMediaTypes.includes(
      value.mediaType as (typeof COMPARISON_LIMITS.supportedMediaTypes)[number],
    ) ||
    typeof value.data !== "string"
  ) {
    throw new BillEobComparisonInputError(
      "A validated document has malformed file metadata.",
    );
  }

  const decodedBytes = decodedBase64Length(value.data);
  if (decodedBytes > COMPARISON_LIMITS.perFileBytes)
    throw new BillEobComparisonInputError(
      "Each comparison document must be 10 MB or smaller.",
    );

  let pageCount: number;
  if (value.mediaType === "application/pdf") {
    if (
      !Number.isSafeInteger(value.pageCount) ||
      (value.pageCount as number) < 1 ||
      (value.pageCount as number) > COMPARISON_LIMITS.maxPagesPerPdf
    ) {
      throw new BillEobComparisonInputError(
        "Each comparison document may contain at most 12 pages.",
      );
    }
    pageCount = value.pageCount as number;
  } else {
    if (value.pageCount !== null)
      throw new BillEobComparisonInputError(
        "A validated document has malformed page metadata.",
      );
    // A validated image represents one document page for the combined cap.
    pageCount = 1;
  }

  return {
    upload: value as ValidatedUpload,
    decodedBytes,
    pageCount,
  };
}

export function validateBillEobComparisonInput(
  value: unknown,
): ValidatedBillEobComparisonInput {
  if (!Array.isArray(value) || value.length !== 2)
    throw new BillEobComparisonInputError(
      "A comparison requires exactly two document slots.",
    );

  const [billCandidate, eobCandidate] = value;
  if (
    !isRecord(billCandidate) ||
    !isRecord(eobCandidate) ||
    !hasOnlyKeys(billCandidate, ["slot", "declaredType", "upload"]) ||
    !hasOnlyKeys(eobCandidate, ["slot", "declaredType", "upload"]) ||
    billCandidate.slot !== "billDocument" ||
    eobCandidate.slot !== "eobDocument" ||
    !["provider_bill", "not_sure"].includes(
      billCandidate.declaredType as string,
    ) ||
    !["eob", "not_sure"].includes(eobCandidate.declaredType as string)
  ) {
    throw new BillEobComparisonInputError(
      "The two comparison document slots are malformed or out of order.",
    );
  }

  const bill = validateUploadMetadata(billCandidate.upload);
  const eob = validateUploadMetadata(eobCandidate.upload);
  const decodedBytes = bill.decodedBytes + eob.decodedBytes;
  if (
    !Number.isSafeInteger(decodedBytes) ||
    decodedBytes > COMPARISON_LIMITS.combinedFileBytes
  ) {
    throw new BillEobComparisonInputError(
      "The two comparison documents exceed the 18 MB combined limit.",
    );
  }

  const pageCount = bill.pageCount + eob.pageCount;
  if (pageCount > COMPARISON_LIMITS.maxCombinedPdfPages)
    throw new BillEobComparisonInputError(
      "The two comparison documents exceed the 20-page combined limit.",
    );

  const documents: BillEobComparisonInput = [
    {
      slot: "billDocument",
      declaredType: billCandidate.declaredType as
        | "provider_bill"
        | "not_sure",
      upload: bill.upload,
    },
    {
      slot: "eobDocument",
      declaredType: eobCandidate.declaredType as "eob" | "not_sure",
      upload: eob.upload,
    },
  ];

  return { documents, decodedBytes, pageCount };
}
