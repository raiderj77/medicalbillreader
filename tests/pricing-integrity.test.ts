import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const pricing = readFileSync("src/components/PricingClient.tsx", "utf8");
const terms = readFileSync("src/app/terms/page.tsx", "utf8");
const llmsFull = readFileSync("public/llms-full.txt", "utf8");

describe("pricing evidence and checkout handoff", () => {
  it("does not make an unsupported popularity claim", () => {
    expect(pricing).not.toContain("Most Popular");
  });

  it("explains the Stripe return path for each paid option", () => {
    expect(pricing.match(/Secure checkout on Stripe\./g)).toHaveLength(1);
    expect(pricing).toContain(
      "return to the bill analyzer and have 24 hours in this browser to start",
    );
    expect(pricing).toContain("Existing subscriber? Manage billing");
    expect(pricing).not.toContain("Subscribe Now");
    expect(pricing).not.toContain("Best value");

  });

  it("distinguishes a cancelled checkout from a verification failure", () => {
    expect(pricing).toContain('paymentState === "cancelled"');
    expect(pricing).toContain("Checkout was canceled. No new access was enabled.");
    expect(pricing).toContain("We could not verify that checkout completed");
  });

  it("does not send purchase or analysis activity to third-party analytics", () => {
    expect(pricing).not.toContain("trackConversion");
    expect(pricing).not.toContain("gtag(");
  });

  it("uses delivery as the single-analysis refund clock everywhere", () => {
    for (const source of [pricing, terms, llmsFull]) {
      expect(source).toContain("within 24 hours of delivery");
    }
    expect(pricing).not.toContain("within 24 hours of purchase");
    expect(llmsFull).not.toContain("within 24 hours of purchase");
  });

  it("discloses the paid attempt limit and refund revocation honestly", () => {
    expect(terms).toContain("Last Reviewed: October 16, 2026");
    expect(pricing).toContain("at most three outbound analysis attempts");
    expect(pricing).toMatch(
      /Any refund on an unused\s+pay-per-bill purchase revokes its analysis credit\./,
    );
    expect(terms).toContain(
      "The first two incomplete outbound attempts leave the credit available",
    );
    expect(terms).toContain(
      "an incomplete third attempt exhausts the credit",
    );
    expect(terms).not.toContain(
      "the application is designed not to consume the paid credit",
    );
  });
});
