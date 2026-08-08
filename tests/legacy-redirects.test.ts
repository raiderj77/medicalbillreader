import { describe, expect, it } from "vitest";
import nextConfig from "../next.config";

describe("legacy Search Console URL redirects", () => {
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
