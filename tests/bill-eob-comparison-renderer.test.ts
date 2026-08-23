import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import BillEobComparisonReport from "@/components/BillEobComparisonReport";
import { billEobComparisonToPlainText } from "@/lib/bill-eob-comparison-plain-text";
import { parseBillEobComparisonEnvelope } from "@/lib/bill-eob-comparison-output";
import {
  comparisonEnvelope,
  syntheticBillEobComparisonReport,
} from "./bill-eob-comparison-fixture";

const report = parseBillEobComparisonEnvelope(comparisonEnvelope(), {
  billDocument: { sourceKind: "pdf", pageCount: 2 },
  eobDocument: { sourceKind: "pdf", pageCount: 2 },
}).report;

describe("deterministic bill and EOB comparison rendering", () => {
  it("renders only fixed sections and text nodes, never model-created links or HTML", () => {
    const untrustedLooking = {
      ...syntheticBillEobComparisonReport(),
      questions: [
        "<img src=x onerror=alert(1)> [outside](https://example.test)",
      ],
    };
    const html = renderToStaticMarkup(
      createElement(BillEobComparisonReport, { report: untrustedLooking }),
    );

    for (const heading of [
      "Provider bill document",
      "EOB document",
      "Match assessment",
      "Visible comparison",
      "Questions",
      "Limitations",
    ]) {
      expect(html).toContain(heading);
    }
    expect(html).not.toContain("<img");
    expect(html).not.toContain("href=");
    expect(html).toContain("&lt;img src=x onerror=alert(1)&gt;");
  });

  it("creates stable literal plain text from the validated report", () => {
    const first = billEobComparisonToPlainText(report);
    const second = billEobComparisonToPlainText(report);
    expect(second).toBe(first);
    expect(first).toContain("Match assessment");
    expect(first).toContain("Question to verify");
    expect(first).toContain("not proof of an error");
    expect(first).not.toContain("http");
    expect(first).not.toContain("<script");
  });
});
