import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const pageTemplates = [
  "src/app/methodology/page.tsx",
  "src/app/codes-explained/page.tsx",
  "src/app/blog/page.tsx",
  "src/app/blog/[slug]/page.tsx",
];

describe("global skip-link target", () => {
  it("points to the shared main-content target", () => {
    const layout = readFileSync("src/app/layout.tsx", "utf8");
    expect(layout).toContain('href="#main-content"');
  });

  it.each(pageTemplates)("%s exposes the main-content target", (page) => {
    const source = readFileSync(page, "utf8");
    expect(source).toMatch(/<main\s+id="main-content"/);
  });
});

describe("footer interaction targets", () => {
  it("keeps the standalone privacy opt-out link at least 44px tall", () => {
    const footer = readFileSync("src/components/Footer.tsx", "utf8");
    expect(footer).toMatch(/href="\/do-not-sell"[\s\S]{0,220}className="[^"]*min-h-11/);
  });
});
