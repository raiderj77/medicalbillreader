import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const pricing = readFileSync("src/app/pricing/page.tsx", "utf8");
const pricingMetadata = readFileSync("src/app/pricing/layout.tsx", "utf8");
const terms = readFileSync("src/app/terms/page.tsx", "utf8");
const llmsFull = readFileSync("public/llms-full.txt", "utf8");
const llms = readFileSync("public/llms.txt", "utf8");
const brandVoice = readFileSync("context/brand-voice.md", "utf8");
const internalLinks = readFileSync("context/internal-links-map.md", "utf8");
const revenue = readFileSync("docs/revenue-verification.md", "utf8");

describe("pricing evidence and checkout handoff", () => {
  it("does not make an unsupported popularity claim", () => {
    expect(pricing).not.toContain("Most Popular");
  });

  it("explains the Stripe return path for the single paid option", () => {
    expect(pricing.match(/Secure checkout on Stripe\./g)).toHaveLength(1);
    expect(pricing).toContain(
      "return to the bill analyzer and have 24 hours in this browser to start the one analysis",
    );
  });

  it("does not sell new monthly subscriptions while preserving management", () => {
    for (const source of [pricing, pricingMetadata, terms, llms, llmsFull, brandVoice, internalLinks]) {
      expect(source).toMatch(/New monthly subscriptions (?:are )?(?:disabled|not (?:available|offered|sold)|unavailable)/i);
    }
    expect(pricing).toContain("Manage or cancel an existing subscription");
    expect(pricing).toMatch(/Existing\s+monthly subscriptions can be cancelled/);
    expect(pricing).not.toContain("Subscribe Now");
    expect(pricing).not.toContain('priceType: "subscription"');
    expect(pricing).not.toContain("Best value");
    expect(pricingMetadata).not.toContain("monthly Medical Bill Reader plan");
    expect(revenue).toContain("new checkout accepts only the server-configured one-time Stripe price");
    expect(revenue).toContain("monthly mapping remains available only for verifying real existing");
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
});
