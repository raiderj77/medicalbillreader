import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import SampleMedicalBillReportPage, {
  metadata,
} from "@/app/sample-medical-bill-report/page";
import {
  alt as socialImageAlt,
  size as socialImageSize,
} from "@/app/sample-medical-bill-report/opengraph-image";
import { SAMPLE_MEDICAL_BILL_REPORT_GUIDE } from "@/lib/editorial-guides";

const PAGE_URL =
  "https://medicalbillreader.com/sample-medical-bill-report";
const pageSource = readFileSync(
  "src/app/sample-medical-bill-report/page.tsx",
  "utf8",
);
const renderedPage = renderToStaticMarkup(
  createElement(SampleMedicalBillReportPage),
);

describe("sample medical bill report acquisition page", () => {
  it("is indexable with page-specific canonical and social metadata", () => {
    expect(metadata.title).toBe(SAMPLE_MEDICAL_BILL_REPORT_GUIDE.title);
    expect(metadata.alternates).toMatchObject({ canonical: PAGE_URL });
    expect(metadata.robots).toMatchObject({
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-snippet": -1 },
    });
    expect(metadata.openGraph).toMatchObject({
      title: SAMPLE_MEDICAL_BILL_REPORT_GUIDE.title,
      url: PAGE_URL,
      type: "article",
      publishedTime: "2026-08-18",
      modifiedTime: "2026-08-18",
    });
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
    expect(socialImageSize).toEqual({ width: 1200, height: 630 });
    expect(socialImageAlt).toMatch(/Synthetic medical bill and EOB example/i);
  });

  it("keeps rendered Article and Breadcrumb schema aligned with the page", () => {
    expect(renderedPage).toContain(
      `>Sample Medical Bill Report: Bill and EOB Explained</h1>`,
    );
    expect(renderedPage).toContain('"@type":"Article"');
    expect(renderedPage).toContain(
      '"headline":"Sample Medical Bill Report: Bill and EOB Explained"',
    );
    expect(renderedPage).toContain('"@type":"BreadcrumbList"');
    expect(renderedPage).toContain(
      '"url":"https://medicalbillreader.com/sample-medical-bill-report/opengraph-image"',
    );
  });

  it("makes the fabricated status and no-upload path prominent", () => {
    expect(
      pageSource.match(
        /Synthetic example — not a real patient, provider, claim, or bill/g,
      ),
    ).toHaveLength(2);
    expect(pageSource).toContain("No upload is needed");
    expect(pageSource).toContain("Nothing here came from a customer or patient");
    expect(pageSource).toContain("SAMPLE-001 — non-billable demonstration ID");
    expect(pageSource).not.toMatch(/<form|<input|<iframe|<img/i);
    expect(pageSource).not.toMatch(
      /gtag|google-analytics|posthog|plausible|segment|mixpanel|dataLayer/i,
    );
    expect(pageSource).toContain('id="synthetic-sample"');
    expect(readFileSync("src/app/globals.css", "utf8")).toContain(
      "#synthetic-sample *",
    );
  });

  it("uses only generic, non-billable sample labels", () => {
    expect(pageSource).toContain("Synthetic person — no name");
    expect(pageSource).toContain("Synthetic provider — no name or address");
    expect(pageSource).toContain("Sample date — not a real date");
    expect(pageSource).toContain("Sample service — no clinical meaning");
    expect(pageSource).not.toMatch(/\b(?:CPT|HCPCS|ICD-10|NDC)\s*[A-Z0-9-]+/i);
  });

  it("reconciles the illustration without presenting a legal amount owed", () => {
    expect(pageSource).toContain(
      "$300 charge − $120 adjustment = $180 allowed amount",
    );
    expect(pageSource).toMatch(
      /\$180\s+allowed amount − \$120 plan payment = \$60 illustrated/,
    );
    expect(pageSource).toContain("not typical prices, coverage terms");
    expect(pageSource).toContain("not by itself proof of an error");
    expect(pageSource).toContain("cannot determine what");
  });

  it("explains bill and EOB fields with semantic comparison tables", () => {
    expect(pageSource).toContain("A request for payment");
    expect(pageSource).toContain("not a bill");
    expect(pageSource).toContain("Allowed amount");
    expect(pageSource).toContain("Plan paid");
    expect(pageSource).toContain("Illustrated responsibility");
    expect(pageSource.match(/<caption/g)?.length).toBeGreaterThanOrEqual(3);
    expect(pageSource).toContain('scope="col"');
    expect(pageSource).toContain('scope="row"');
    expect(pageSource).toContain("overflow-x-auto");
    expect(pageSource.match(/min-w-0 rounded-xl/g)).toHaveLength(2);
    expect(pageSource).toContain("<figure");
    expect(pageSource).toContain("<figcaption");
  });

  it("frames potential findings as questions to verify", () => {
    expect(pageSource).toContain("Questions to verify");
    expect(pageSource).toContain("Does the current provider statement");
    expect(pageSource).toContain("Does the bill reflect");
    expect(pageSource).toContain("Do any EOB remarks");
    expect(pageSource).toContain("is not by itself proof");
  });

  it("cites primary CMS guidance and links to the free analyzer", () => {
    expect(pageSource).toContain(
      "https://www.cms.gov/medical-bill-rights/help/guides/how-to-read-bill",
    );
    expect(pageSource).toContain(
      "https://www.cms.gov/medical-bill-rights/help/guides/explanation-of-benefits",
    );
    expect(pageSource).toContain(
      "https://www.cms.gov/medical-bill-rights/help/guides/bill-errors",
    );
    expect(pageSource).toContain('href="/#analyzer"');
    expect(pageSource).toContain('href="/consumer-health-data-privacy"');
    expect(pageSource).toContain("Start free analysis");
    expect(pageSource).toContain("<RelatedGuides");
  });

  it("states founder credentials and review limitations accurately", () => {
    expect(pageSource).toContain("web professional and product founder");
    expect(pageSource).toContain("not a clinician");
    expect(pageSource).toContain("certified medical coder");
    expect(pageSource).toContain(
      "No review by one of those professionals is claimed",
    );
  });
});
