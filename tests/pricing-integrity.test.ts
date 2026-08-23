import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const pricing = readFileSync("src/app/pricing/page.tsx", "utf8");
const terms = readFileSync("src/app/terms/page.tsx", "utf8");
const llmsFull = readFileSync("public/llms-full.txt", "utf8");

describe("pricing evidence and checkout handoff", () => {
  it("does not make an unsupported popularity claim", () => {
    expect(pricing).not.toContain("Most Popular");
  });

  it("offers only the fixed single-document checkout", () => {
    expect(pricing.match(/Secure checkout on Stripe\./g)).toHaveLength(1);
    expect(pricing).toContain('data-checkout-price-type="per-use"');
    expect(pricing).not.toContain('data-checkout-price-type="subscription"');
    expect(pricing).not.toContain('data-checkout-price-type="comparison"');
    expect(pricing).toContain("have 24 hours in this browser to start the one");
    expect(pricing).toContain("Keep the Stripe receipt if you change devices or clear");
  });

  it("shows the approved public options without selling or recommending monthly", () => {
    expect(pricing).toContain("Free");
    expect(pricing).toContain("Single document");
    expect(pricing).toContain("Bill and EOB comparison");
    expect(pricing).toContain("Coming later");
    expect(pricing).toContain("Manage or cancel an existing subscription");
    for (const source of [pricing, terms, llmsFull]) {
      expect(source).not.toContain("$49");
    }
    expect(pricing).not.toContain("Subscribe Now");
    expect(pricing).not.toContain("Best value");
    expect(pricing).not.toContain("44 analyses");
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

  it("does not publish the unsupported provider-training-default sentence", () => {
    for (const source of [terms, llmsFull]) {
      expect(source).not.toContain("not used for model training by default");
      expect(source).not.toContain("customer opts in or submits feedback");
    }
  });
});
