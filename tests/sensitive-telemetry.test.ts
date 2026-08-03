import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("sensitive journey telemetry boundary", () => {
  it("keeps upload, analysis, and checkout activity out of analytics", () => {
    const analyzer = readFileSync("src/components/BillAnalyzer.tsx", "utf8");
    const pricing = readFileSync("src/app/pricing/page.tsx", "utf8");
    const sensitiveCode = `${analyzer}\n${pricing}`;

    expect(sensitiveCode).not.toContain("trackConversion");
    expect(sensitiveCode).not.toContain("window.gtag");
    expect(sensitiveCode).not.toContain("googletagmanager.com");
  });
});
