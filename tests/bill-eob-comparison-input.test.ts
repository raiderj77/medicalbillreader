import { describe, expect, it } from "vitest";
import {
  BillEobComparisonInputError,
  validateBillEobComparisonInput,
} from "@/lib/bill-eob-comparison-input";

function base64ForDecodedBytes(byteLength: number): string {
  const completeTriplets = Math.floor(byteLength / 3);
  const remainder = byteLength % 3;
  return (
    "A".repeat(completeTriplets * 4) +
    (remainder === 1 ? "AA==" : remainder === 2 ? "AAA=" : "")
  );
}

function upload(
  decodedBytes = 1,
  mediaType: "image/png" | "application/pdf" = "image/png",
  pageCount: number | null = mediaType === "application/pdf" ? 1 : null,
) {
  return { mediaType, data: base64ForDecodedBytes(decodedBytes), pageCount };
}

function twoDocuments(
  billUpload = upload(),
  eobUpload = upload(),
) {
  return [
    { slot: "billDocument", declaredType: "not_sure", upload: billUpload },
    { slot: "eobDocument", declaredType: "not_sure", upload: eobUpload },
  ];
}

describe("pure two-document comparison input limits", () => {
  it("accepts exactly the named bill and EOB slots, including not-sure declarations", () => {
    const result = validateBillEobComparisonInput(twoDocuments());
    expect(result.documents).toHaveLength(2);
    expect(result.decodedBytes).toBe(2);
    expect(result.pageCount).toBe(2);
  });

  it("rejects a third document or a duplicated/out-of-order slot", () => {
    expect(() =>
      validateBillEobComparisonInput([
        ...twoDocuments(),
        { slot: "billDocument", declaredType: "not_sure", upload: upload() },
      ]),
    ).toThrow(BillEobComparisonInputError);

    expect(() =>
      validateBillEobComparisonInput(twoDocuments().reverse()),
    ).toThrow(BillEobComparisonInputError);
  });

  it("enforces 10 MiB per file and 18 MiB decoded combined", () => {
    const mebibyte = 1024 * 1024;
    expect(
      validateBillEobComparisonInput(
        twoDocuments(upload(9 * mebibyte), upload(9 * mebibyte)),
      ).decodedBytes,
    ).toBe(18 * mebibyte);

    expect(() =>
      validateBillEobComparisonInput(
        twoDocuments(upload(9 * mebibyte), upload(9 * mebibyte + 1)),
      ),
    ).toThrow(/18 MB combined/);

    expect(() =>
      validateBillEobComparisonInput(
        twoDocuments(upload(10 * mebibyte + 1), upload()),
      ),
    ).toThrow(/10 MB or smaller/);
  });

  it("enforces 12 pages per document and 20 pages combined without truncation", () => {
    expect(
      validateBillEobComparisonInput(
        twoDocuments(
          upload(1, "application/pdf", 10),
          upload(1, "application/pdf", 10),
        ),
      ).pageCount,
    ).toBe(20);

    expect(() =>
      validateBillEobComparisonInput(
        twoDocuments(
          upload(1, "application/pdf", 11),
          upload(1, "application/pdf", 10),
        ),
      ),
    ).toThrow(/20-page combined/);

    expect(() =>
      validateBillEobComparisonInput(
        twoDocuments(
          upload(1, "application/pdf", 13),
          upload(1, "application/pdf", 1),
        ),
      ),
    ).toThrow(/at most 12 pages/);
  });
});
