import { describe, expect, it } from "vitest";
import {
  COMPARISON_CREDIT_DISCRIMINATOR,
  SINGLE_DOCUMENT_CREDIT_DISCRIMINATOR,
  oneTimeCreditAuthorizes,
} from "@/lib/comparison-credit";

describe("one-time credit domain separation", () => {
  it("never lets a single-document credit authorize comparison", () => {
    expect(
      oneTimeCreditAuthorizes(
        SINGLE_DOCUMENT_CREDIT_DISCRIMINATOR,
        "bill_eob_comparison",
      ),
    ).toBe(false);
    expect(
      oneTimeCreditAuthorizes(
        SINGLE_DOCUMENT_CREDIT_DISCRIMINATOR,
        "single_document_analysis",
      ),
    ).toBe(true);
  });

  it("never lets a comparison credit authorize single-document analysis", () => {
    expect(
      oneTimeCreditAuthorizes(
        COMPARISON_CREDIT_DISCRIMINATOR,
        "single_document_analysis",
      ),
    ).toBe(false);
    expect(
      oneTimeCreditAuthorizes(
        COMPARISON_CREDIT_DISCRIMINATOR,
        "bill_eob_comparison",
      ),
    ).toBe(true);
  });

  it("fails closed for unknown or missing discriminators", () => {
    expect(oneTimeCreditAuthorizes("comparison", "bill_eob_comparison")).toBe(
      false,
    );
    expect(oneTimeCreditAuthorizes(undefined, "single_document_analysis")).toBe(
      false,
    );
  });
});
