import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("security headers", () => {
  it("keeps the application and hosting policies strict and aligned", () => {
    const nextConfig = readFileSync(
      join(process.cwd(), "next.config.ts"),
      "utf8",
    );
    const vercelConfig = readFileSync(
      join(process.cwd(), "vercel.json"),
      "utf8",
    );

    for (const policy of [nextConfig, vercelConfig]) {
      expect(policy).toContain("frame-ancestors 'none'");
      expect(policy).toContain("object-src 'none'");
      expect(policy).toContain("form-action 'self'");
      expect(policy).not.toContain("'unsafe-eval'");
      expect(policy).not.toContain("script-src 'self' 'unsafe-inline' https: http:");
    }
    expect(nextConfig).toContain('value: "DENY"');
    expect(vercelConfig).toContain('"value": "DENY"');
    expect(nextConfig).toContain('value: "same-origin"');
    expect(vercelConfig).toContain('"value": "same-origin"');
  });
});
