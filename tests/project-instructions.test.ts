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
    expect(claude).toContain("New monthly subscriptions are disabled");
    expect(claude).toContain("Stripe-hosted management or cancellation");
    expect(claude).toContain("Vercel production hosting");
    expect(claude).toContain("Jason Ramirez may remain publicly identified");
    expect(claude).not.toMatch(/free MVP|Stripe \(future|deploy pending|NOT yet deployed/i);
    expect(claude).not.toMatch(/\$9\.99|\$14\.99|unlimited/i);
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
});
