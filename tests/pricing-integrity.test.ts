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

  it("removes new purchase actions and clearly explains the temporary pause", () => {
    for (const source of [
      pricing,
      pricingMetadata,
      terms,
      llms,
      llmsFull,
      brandVoice,
    ]) {
      expect(source).toMatch(/New paid checkout is temporarily unavailable/i);
    }
    expect(pricing).toMatch(/No payment\s+will be started from this page/);
    expect(pricing).toContain("Start Free");
    expect(pricing).toContain('badge: "Available now"');
    expect(pricing).toContain("$4.99");
    expect(pricing).not.toContain("/api/checkout");
    expect(pricing).not.toContain("handleCheckout");
    expect(pricing).not.toContain("Buy Single Analysis");
    expect(pricing).not.toContain("Subscribe Now");
    expect(pricing).not.toContain("Secure checkout on Stripe");
    expect(pricing).not.toContain("priceType");
  });

  it("preserves existing paid access, refunds, and subscription management", () => {
    expect(pricing).toContain("Manage or cancel an existing subscription");
    expect(pricing).toContain('/api/billing-portal');
    expect(pricing).toMatch(/previously verified paid access/i);
    expect(terms).toMatch(/Existing monthly subscriptions can be managed or cancelled/);
    expect(llmsFull).toMatch(/server-verified access/i);
    expect(internalLinks).toMatch(/prior-purchase refund terms/i);
    expect(pricing).not.toContain("Best value");
    expect(pricingMetadata).not.toContain("monthly Medical Bill Reader plan");
    expect(revenue).toContain("new checkout returns a cache-resistant `503`");
    expect(revenue).toContain("before rate limiting, browser binding, nonce creation");
    expect(revenue).toContain("previously created\nStripe Checkout Sessions or Payment Links");
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
