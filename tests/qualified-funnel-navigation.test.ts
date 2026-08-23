import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const readSource = (path: string) => readFileSync(path, "utf8");

describe("qualified funnel navigation", () => {
  it("presents the local worksheet before the sample and AI upload path", () => {
    const homepage = readSource("src/app/page.tsx");
    const orderedCopy = [
      "Medical Bill Reader gives U.S. consumers two informational tools",
      "Compare a Bill and EOB Privately",
      "See the report format before using the AI tool",
      "Explain a Redacted Document with AI",
      "Before you upload a bill or EOB",
      "What the AI report does",
      "Clear options",
      "Methodology and limits",
      "Further Reading",
      "Privacy and legal",
    ];

    let previousIndex = -1;
    for (const copy of orderedCopy) {
      const currentIndex = homepage.indexOf(copy);
      expect(currentIndex, copy).toBeGreaterThan(previousIndex);
      previousIndex = currentIndex;
    }
    expect(homepage).toContain("Jason Ramirez");
    expect(homepage).toContain("experienced web professional");
  });

  it("sends product-intent links directly to the existing analyzer", () => {
    const homepage = readSource("src/app/page.tsx");
    const analyzer = readSource("src/components/BillAnalyzer.tsx");
    const pricing = readSource("src/app/pricing/page.tsx");
    const markdownArticle = readSource("src/app/blog/[slug]/page.tsx");
    const disputeGuide = readSource(
      "src/app/blog/how-to-dispute-a-medical-bill/page.tsx",
    );
    const codes = readSource("src/app/codes-explained/page.tsx");

    expect(homepage).toContain('href="#analyzer"');
    expect(analyzer).toContain('id="analyzer"');
    expect(pricing).toContain('href="/#analyzer"');
    expect(markdownArticle).toContain('href="/#analyzer"');
    expect(markdownArticle).toContain("Try Medical Bill Reader Free");
    expect(disputeGuide).toContain('href="/#analyzer"');
    expect(disputeGuide).toContain("Medical Bill Reader");
    expect(codes).toContain('href="/#analyzer"');
    expect(codes).toContain("Analyze a bill");
  });

  it("returns verified checkout to entry-path-neutral analyzer guidance", () => {
    const confirmation = readSource("src/app/api/checkout/confirm/route.ts");
    const analyzer = readSource("src/components/BillAnalyzer.tsx");

    expect(confirmation).toContain('redirect("/?payment=success#analyzer")');
    expect(analyzer).toContain('router.replace("/#analyzer"');
    expect(analyzer).toContain("Continue in the bill analyzer");
    expect(analyzer).toContain("Any paid access is verified");
    expect(analyzer).toContain("If you selected a document before");
    expect(analyzer).not.toContain("Select the bill or EOB again");
  });

  it("keeps redaction guidance inside the deep-linked analyzer", () => {
    const analyzer = readSource("src/components/BillAnalyzer.tsx");

    expect(analyzer).toContain(
      'aria-describedby="upload-formats upload-redaction upload-privacy"',
    );
    expect(analyzer).toContain("Before choosing a file, remove names");
    expect(analyzer).toContain("other identifiers you do");
  });

  it("links checkout failures and refund requests to the support path", () => {
    const pricing = readSource("src/app/pricing/page.tsx");
    const confirmation = readSource("src/app/api/checkout/confirm/route.ts");

    expect(pricing.split('href="/contact"').length - 1).toBeGreaterThanOrEqual(3);
    expect(pricing).toContain("within 24 hours of delivery");
    expect(pricing).toContain("contact support");
    expect(confirmation).toContain('<a href="/contact">contact support</a>');
  });
});
