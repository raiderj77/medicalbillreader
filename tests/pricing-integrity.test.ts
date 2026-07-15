import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const pricing = readFileSync("src/app/pricing/page.tsx", "utf8");

describe("pricing evidence and checkout handoff", () => {
  it("does not make an unsupported popularity claim", () => {
    expect(pricing).not.toContain("Most Popular");
  });

  it("explains the Stripe return path for each paid option", () => {
    expect(pricing.match(/Secure checkout on Stripe\./g)).toHaveLength(2);
    expect(pricing).toContain("return to the bill analyzer to upload one bill or EOB");
    expect(pricing).toContain("return to the bill analyzer with monthly access enabled");
  });

  it("measures a return from cancelled checkout separately from payment failure", () => {
    expect(pricing).toContain('paymentState === "cancelled"');
    expect(pricing).toContain('trackConversion("checkout_cancelled")');
  });
});
