import { describe, expect, it } from "vitest";
import { metadata as disputeMetadata } from "@/app/blog/how-to-dispute-a-medical-bill/page";
import { metadata as editorialMetadata } from "@/app/editorial-policy/page";
import { metadata as pricingMetadata } from "@/app/pricing/layout";

describe("page-specific Open Graph metadata", () => {
  it.each([
    {
      metadata: pricingMetadata,
      title: "Pricing | Medical Bill Reader",
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
});
