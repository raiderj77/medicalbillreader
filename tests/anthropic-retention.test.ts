import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const sourceUrl =
  "https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data";
const immediateNotice = readFileSync(
  "src/components/BillAnalyzer.tsx",
  "utf8",
);
const fullNotices = [
  readFileSync("src/app/privacy/page.tsx", "utf8"),
  readFileSync("src/app/consumer-health-data-privacy/page.tsx", "utf8"),
];
const discoveryNotices = [
  readFileSync("public/llms.txt", "utf8"),
  readFileSync("public/llms-full.txt", "utf8"),
];

describe("Anthropic retention disclosure", () => {
  it("states the longer trust-and-safety exceptions at the consent point", () => {
    expect(immediateNotice).toContain(sourceUrl);
    expect(immediateNotice).toContain("up to two years");
    expect(immediateNotice).toContain("up to seven years");
    expect(immediateNotice).toContain("zero-data-retention agreement");
    expect(immediateNotice).toContain("Business Associate");
    expect(immediateNotice).not.toContain(
      "retention is up to 30 days unless account-specific terms differ",
    );
  });

  it("keeps the full and machine-readable notices equally explicit", () => {
    for (const notice of [...fullNotices, ...discoveryNotices]) {
      expect(notice).toContain("up to two years");
      expect(notice).toContain("up to seven years");
      expect(notice).toContain("zero-data-retention");
    }
    for (const notice of fullNotices) {
      expect(notice).toContain(sourceUrl);
      expect(notice).toContain("Business Associate Agreement");
    }
  });
});
