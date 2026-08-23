import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function read(path: string): string {
  return readFileSync(join(process.cwd(), path), "utf8");
}

describe("current project instructions", () => {
  it("keeps product status, pricing, and attribution aligned with production", () => {
    const claude = read("CLAUDE.md");

    expect(claude).toContain("Single analysis: $4.99");
    expect(claude).toContain("Bill and EOB comparison: $9.99 planned price");
    expect(claude).toContain("New monthly subscriptions are disabled");
    expect(claude).toContain("server-verified access");
    expect(claude).toContain("Vercel production hosting");
    expect(claude).toContain("Jason Ramirez may remain publicly identified");
    expect(claude).not.toMatch(/free MVP|Stripe \(future|deploy pending|NOT yet deployed/i);
    expect(claude).not.toMatch(/\$49|\$14\.99|unlimited/i);
  });

  it("prevents thin code pages and unsupported price guidance", () => {
    const instructions = [
      read("context/brand-voice.md"),
      read("context/style-guide.md"),
      read("context/seo-guidelines.md"),
      read("context/competitor-analysis.md"),
    ].join("\n");

    expect(instructions).toContain("Do not mass-generate CPT");
    expect(instructions).toContain("Do not publish unsupported \"typical cost\"");
    expect(instructions).not.toContain("pSEO layer for CPT code lookups");
    expect(instructions).not.toContain("typical cost range)");
  });

  it("does not retain the obsolete credential rewrite script", () => {
    expect(
      existsSync(join(process.cwd(), "scripts/apply_ymyl_named_author.py")),
    ).toBe(false);
  });

  it("keeps revenue measurement and workflow gates privacy-safe", () => {
    const revenue = read("docs/revenue-verification.md");
    const workflow = read(".github/workflows/empire-check.yml");

    expect(revenue).toContain("Third-party analytics is disabled");
    expect(revenue).not.toContain("six allow-listed conversion events are wired");
    expect(workflow).not.toContain("for STEM in ads robots llms");
    expect(workflow).not.toContain("name + credential everywhere");
  });

  it("documents the disabled offers and aggregate-only validation gate", () => {
    const env = read(".env.example");
    const retirement = read("docs/subscription-retirement-runbook.md");
    const scoreboard = read(
      "docs/medicalbillreader-90-day-validation-scoreboard.md",
    );

    expect(env).toContain("STRIPE_PRICE_BILL_EOB_COMPARISON=");
    expect(env).toContain("ENABLE_NEW_SUBSCRIPTIONS=false");
    expect(env).toContain("ENABLE_BILL_EOB_COMPARISON=false");
    expect(env).toContain("ENABLE_EXISTING_SUBSCRIPTION_SUPPORT=true");
    expect(retirement).toContain("Do not restore or expose new subscription checkout");
    expect(retirement).toContain("A webhook is a signal, not the sole source of truth");
    expect(scoreboard).toContain(
      "The refunded $4.99 owner-verification payment is excluded",
    );
    expect(scoreboard.match(/\| UNKNOWN \|/g)?.length).toBeGreaterThanOrEqual(29);
    expect(scoreboard).not.toMatch(/customer_[A-Za-z0-9]|cus_[A-Za-z0-9]/);
  });
});
