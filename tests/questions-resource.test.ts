import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const page = readFileSync("src/app/questions-to-ask-about-medical-bill/page.tsx", "utf8");

describe("medical-bill questions resource", () => {
  it("uses current primary resources and links into the local worksheet", () => {
    expect(page).toContain("https://www.cms.gov/medical-bill-rights/help/guides/how-to-read-bill");
    expect(page).toContain("https://www.irs.gov/charities-non-profits/financial-assistance-policies-faps");
    expect(page).toContain('href="/bill-eob-comparison-worksheet"');
    expect(page).toContain("Source checked August 23, 2026");
  });

  it("does not promise a conclusion, savings, or outcome", () => {
    expect(page).toContain("not to decide that a charge is wrong");
    for (const prohibited of ["guaranteed savings", "we will dispute", "is illegal", "what you owe is", "most common error"] ) {
      expect(page.toLowerCase()).not.toContain(prohibited);
    }
  });
});
