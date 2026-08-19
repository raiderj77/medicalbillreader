import { describe, expect, it } from "vitest";
import {
  getRedirectUrl,
  unstable_getResponseFromNextConfig,
} from "next/experimental/testing/server";
import nextConfig from "../next.config";

describe("legacy Search Console URL redirects", () => {
  it("consolidates the duplicate www hostname onto the canonical apex host", async () => {
    const response = await unstable_getResponseFromNextConfig({
      url: "https://www.medicalbillreader.com/blog/example?source=sample",
      nextConfig,
    });

    expect(response.status).toBe(308);
    expect(getRedirectUrl(response)).toBe(
      "https://medicalbillreader.com/blog/example?source=sample",
    );

    const canonicalResponse = await unstable_getResponseFromNextConfig({
      url: "https://medicalbillreader.com/blog/example?source=sample",
      nextConfig,
    });
    expect(canonicalResponse.status).toBe(200);
  });

  it("sends retired medical-billing articles to current reviewed resources", async () => {
    const redirects = await nextConfig.redirects?.();

    expect(redirects).toEqual(
      expect.arrayContaining([
        {
          source: "/blog/medical-bill-payment-plans",
          destination: "/blog",
          permanent: true,
        },
        {
          source: "/blog/medical-debt-collections-rights",
          destination: "/blog",
          permanent: true,
        },
        {
          source: "/blog/medical-bill-statute-of-limitations",
          destination: "/blog",
          permanent: true,
        },
        {
          source: "/blog/medical-bill-after-insurance",
          destination: "/blog/how-to-read-an-explanation-of-benefits-eob",
          permanent: true,
        },
        {
          source: "/blog/health-insurance-deductible-explained",
          destination: "/blog/how-to-read-an-explanation-of-benefits-eob",
          permanent: true,
        },
        {
          source: "/blog/how-to-read-medical-bill",
          destination: "/blog/how-to-read-an-explanation-of-benefits-eob",
          permanent: true,
        },
      ]),
    );
  });
});
