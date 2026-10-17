import { describe, expect, it } from "vitest";
import { metadata as disputeMetadata } from "@/app/blog/how-to-dispute-a-medical-bill/page";
import { metadata as codesMetadata } from "@/app/codes-explained/page";
import { metadata as editorialMetadata } from "@/app/editorial-policy/page";
import { metadata as guideHubMetadata } from "@/app/guides/page";
import { metadata as glossaryMetadata } from "@/app/glossary/page";
import { metadata as homepageMetadata } from "@/app/page";
import { metadata as methodologyMetadata } from "@/app/methodology/page";
import { metadata as pricingMetadata } from "@/app/pricing/layout";
import { metadata as sampleMetadata } from "@/app/sample-medical-bill-report/page";

describe("page-specific Open Graph metadata", () => {
  it.each([
    {
      metadata: pricingMetadata,
      title: "What Does Medical Bill Reader Cost? (2026)",
      url: "https://medicalbillreader.com/pricing",
      type: "website",
    },
    {
      metadata: editorialMetadata,
      title: "Editorial Policy and Review Standards",
      url: "https://medicalbillreader.com/editorial-policy",
      type: "website",
    },
    {
      metadata: disputeMetadata,
      title: "How to Dispute a Medical Bill: Steps and Letter Template",
      url: "https://medicalbillreader.com/blog/how-to-dispute-a-medical-bill",
      type: "article",
    },
  ])("sets $url instead of inheriting homepage Open Graph fields", ({
    metadata,
    title,
    url,
    type,
  }) => {
    expect(metadata.openGraph).toMatchObject({ title, url, type });
  });

  it("uses specific question-and-year titles on acquisition pages", () => {
    for (const metadata of [
      homepageMetadata,
      codesMetadata,
      methodologyMetadata,
      pricingMetadata,
      sampleMetadata,
      guideHubMetadata,
      glossaryMetadata,
    ]) {
      expect(typeof metadata.title).toBe("string");
      const title = String(metadata.title);
      expect(title).toContain("?");
      expect(title).toContain("2026");
      expect(title.length).toBeLessThan(60);
      expect(String(metadata.description).length).toBeGreaterThanOrEqual(80);
    }
  });
});
