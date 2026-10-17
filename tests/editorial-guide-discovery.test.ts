import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import BlogIndexPage from "@/app/blog/page";
import sitemap from "@/app/sitemap";
import HomepageGuideCluster from "@/components/HomepageGuideCluster";
import RelatedGuides from "@/components/RelatedGuides";
import { getAllEditorialGuides } from "@/lib/editorial-guides";

describe("editorial guide discovery", () => {
  it("keeps Tier 1 and standalone guides in one typed registry", () => {
    const guides = getAllEditorialGuides();

    expect(guides.map((guide) => guide.slug)).toEqual([
      "common-medical-bill-errors",
      "good-faith-estimate-400-rule",
      "how-to-dispute-a-medical-bill",
      "how-to-negotiate-a-hospital-bill",
      "how-to-read-an-eob",
      "sample-medical-bill-report",
    ]);
    expect(guides.filter((guide) => guide.source === "guide")).toHaveLength(5);
    expect(guides.filter((guide) => guide.source === "standalone")).toHaveLength(1);
  });

  it("renders an inbound blog-index link for every editorial resource in the sitemap", () => {
    const html = renderToStaticMarkup(createElement(BlogIndexPage));
    const sitemapPaths = new Set(
      sitemap().map((entry) => new URL(entry.url).pathname),
    );
    const editorialPaths = getAllEditorialGuides().map(
      (guide) => guide.href,
    );

    for (const path of editorialPaths) {
      expect(sitemapPaths).toContain(path);
      expect(html).toContain(`href="${path}"`);
    }
    expect(html).toContain(`"numberOfItems":${editorialPaths.length}`);
    expect(html).toContain("October 16, 2026");
  });

  it("renders every guide in the contextual homepage cluster", () => {
    const html = renderToStaticMarkup(createElement(HomepageGuideCluster));

    for (const guide of getAllEditorialGuides()) {
      expect(html).toContain(`href="${guide.href}"`);
      expect(html).toContain(guide.title);
    }
    expect(html).toContain('href="/guides"');
  });

  it("renders other registry guides without linking the current guide", () => {
    const currentSlug = "how-to-read-an-eob";
    const html = renderToStaticMarkup(
      createElement(RelatedGuides, { currentSlug }),
    );

    expect(html).not.toContain(`href="/guides/${currentSlug}"`);
    expect(html).toContain('href="/guides/how-to-dispute-a-medical-bill"');
    expect(html).toContain('href="/guides/common-medical-bill-errors"');
  });

  it("keeps Guides in primary navigation and the guide cluster on the homepage", () => {
    const homepage = readFileSync("src/app/page.tsx", "utf8");

    expect(homepage).toContain('href="/guides"');
    expect(homepage).toContain('href="/sample-medical-bill-report"');
    expect(homepage).toContain("See a synthetic sample report");
    expect(homepage).toContain("<HomepageGuideCluster />");
  });
});
