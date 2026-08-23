import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import DisputeMedicalBillPage from "@/app/blog/how-to-dispute-a-medical-bill/page";
import { DISPUTE_MEDICAL_BILL_GUIDE } from "@/lib/editorial-guides";

function source(path: string): string {
  return readFileSync(path, "utf8");
}

describe("public YMYL and policy copy", () => {
  it("keeps the About glossary qualified and removes unsupported origin claims", () => {
    const about = source("src/app/about/page.tsx");

    expect(about).toMatch(/A reported code does\s+not by itself prove/);
    expect(about).toContain("An EOB is not a provider bill");
    expect(about).toContain("plan&apos;s allowed");
    expect(about).not.toContain("determine how much your provider bills");
    expect(about).not.toContain("what you still owe");
    expect(about).not.toContain("built it after seeing");
    expect(about).not.toContain("transparent and accessible to everyone");
  });

  it("keeps NDC education at system level while exact-example rights are pending", () => {
    const codes = source("src/app/codes-explained/page.tsx");

    expect(codes).toContain("10-digit, three-segment number");
    expect(codes).toContain("does not publish an exact code example");
    expect(codes).toContain("reuse rights remain under review");
    expect(codes).not.toContain("0000-0000-00");
    expect(codes).not.toContain("HIPAA-standard 11-digit");
    expect(codes).toContain("Plan-calculated percentage cost sharing");
    expect(codes).not.toContain("NDC 0002-7510");
    expect(codes).not.toContain("codes tell the insurer what was done");
    expect(codes).not.toContain("most common mistakes to");
  });

  it("keeps the current federal external-review outage caveat visible", () => {
    const dispute = source(
      "src/app/blog/how-to-dispute-a-medical-bill/page.tsx",
    );
    const rendered = renderToStaticMarkup(
      createElement(DisputeMedicalBillPage),
    );

    expect(dispute).toContain("Last reviewed August 2, 2026");
    expect(DISPUTE_MEDICAL_BILL_GUIDE.lastReviewedAt).toBe("2026-08-02");
    expect(rendered).toContain(
      '"dateModified":"2026-08-02"',
    );
    expect(dispute).toContain("as of July 1, 2026");
    expect(dispute).toContain("HHS-administered Federal");
    expect(dispute).toContain("Alabama, Florida, Georgia");
    expect(dispute).toContain("Texas, Wisconsin");
    expect(dispute).toContain("territory other than Puerto Rico");
  });

  it("states an accessibility target without claiming certification", () => {
    const accessibility = source("src/app/accessibility/page.tsx");

    expect(accessibility).toContain("WCAG) 2.2 Level AA");
    expect(accessibility).toContain("development target");
    expect(accessibility).toContain("not a certification");
    expect(accessibility).toContain("focus moves to its titled result heading");
    expect(accessibility).not.toContain("ARIA live regions");
    expect(accessibility).not.toContain("Lighthouse, axe-core");
  });

  it("states that third-party analytics is disabled", () => {
    const files = [
      "src/app/privacy/page.tsx",
      "src/app/consumer-health-data-privacy/page.tsx",
      "src/app/accessibility/page.tsx",
      "public/llms-full.txt",
    ];

    for (const file of files) {
      const contents = source(file);
      expect(contents, file).toMatch(/third-party analytics is disabled/i);
    }

    const privacy = source("src/app/privacy/page.tsx");
    expect(privacy).not.toContain("Optional marketing-page analytics");
    expect(privacy).not.toContain("Privacy choices control");
  });

  it("states the intended U.S. audience without a global compliance claim", () => {
    for (const file of [
      "src/app/privacy/page.tsx",
      "src/app/terms/page.tsx",
    ]) {
      const contents = source(file);
      expect(contents, file).toContain("United States and U.S. territories");
      expect(contents, file).toContain("European Economic Area");
      expect(contents, file).toContain("United Kingdom");
      expect(contents, file).toContain("Switzerland");
    }
  });

  it("uses normalized title separators in the pages changed by this pass", () => {
    for (const file of [
      "src/app/about/page.tsx",
      "src/app/accessibility/page.tsx",
      "src/app/contact/page.tsx",
      "src/app/disclaimer/page.tsx",
      "src/app/terms/page.tsx",
    ]) {
      const contents = source(file);
      expect(contents, file).not.toContain(" ,  Medical Bill Reader");
    }
  });
});
