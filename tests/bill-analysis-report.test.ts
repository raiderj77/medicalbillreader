import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import BillAnalysisReport from "@/components/BillAnalysisReport";
import { billAnalysisToPlainText } from "@/lib/bill-analysis-plain-text";
import { syntheticBillAnalysisReport } from "./bill-analysis-fixture";

describe("deterministic bill analysis rendering", () => {
  it("renders the fixed seven sections without model-created links or HTML", () => {
    const report = {
      ...syntheticBillAnalysisReport(),
      documentSummary: "<img src=x onerror=alert(1)> [outside](https://example.test)",
      itemsToVerify: [],
    };
    const html = renderToStaticMarkup(
      createElement(BillAnalysisReport, { report }),
    );

    for (const heading of [
      "What this document appears to be",
      "Visible fields",
      "Amounts shown",
      "Codes visible",
      "Items to verify",
      "Questions and next steps",
      "Limitations",
    ]) {
      expect(html).toContain(heading);
    }
    expect(html).not.toContain("<img");
    expect(html).not.toContain("href=");
    expect(html).toContain("&lt;img src=x onerror=alert(1)&gt;");
    expect(html).toContain(
      "No specific item to verify was included in this report.",
    );
    expect(html).toContain("does not establish that the bill is correct");
  });

  it("creates deterministic plain-text copy with the same non-audit boundary", () => {
    const report = { ...syntheticBillAnalysisReport(), itemsToVerify: [] };
    const first = billAnalysisToPlainText(report);
    const second = billAnalysisToPlainText(report);
    expect(second).toBe(first);
    expect(first).toContain("What this document appears to be");
    expect(first).toContain("does not establish that the bill is correct");
    expect(first).not.toContain("http");
  });
});
