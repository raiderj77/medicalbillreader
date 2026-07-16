import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const analyzer = readFileSync("src/components/BillAnalyzer.tsx", "utf8");
const globalStyles = readFileSync("src/app/globals.css", "utf8");

describe("analysis result printing", () => {
  it("offers the browser print dialog with an accurate label", () => {
    expect(analyzer).toContain('onClick={() => window.print()}');
    expect(analyzer).toContain("Print or Save PDF");
    expect(analyzer).not.toContain("Download PDF");
  });

  it("prints only the analysis while retaining its disclaimer", () => {
    expect(analyzer).toContain('id="printable-results"');
    expect(analyzer).toContain("Important Disclaimer");
    expect(analyzer).toContain('className="no-print mt-6');
    expect(globalStyles).toContain("body:has(#printable-results) *");
    expect(globalStyles).toContain("#printable-results *");
  });
});
