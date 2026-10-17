import { readdirSync, readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import matter from "gray-matter";
import { describe, expect, it } from "vitest";
import BlogIndexPage from "@/app/blog/page";
import sitemap from "@/app/sitemap";
import HomepageGuideCluster from "@/components/HomepageGuideCluster";
import RelatedGuides from "@/components/RelatedGuides";
import {
  getAllEditorialGuides,
  getRelatedEditorialGuides,
} from "@/lib/editorial-guides";

function guideHrefsFromFiles(): string[] {
  return readdirSync("content/guides")
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => {
      const { data } = matter(
        readFileSync(`content/guides/${filename}`, "utf8"),
      );
      if (typeof data.slug !== "string" || !data.slug.trim()) {
        throw new Error(`${filename}: missing guide slug`);
      }
      return `/guides/${data.slug.trim()}`;
    })
    .sort();
}

describe("editorial guide discovery", () => {
  it("discovers every guide file in the typed registry without duplicate routes", () => {
    const guides = getAllEditorialGuides();
    const expectedGuideHrefs = guideHrefsFromFiles();
    const discoveredGuideHrefs = guides
      .filter((guide) => guide.source === "guide")
      .map((guide) => guide.href)
      .sort();
    const sitemapPaths = new Set(
      sitemap().map((entry) => new URL(entry.url).pathname),
    );
    const blogIndex = renderToStaticMarkup(createElement(BlogIndexPage));

    expect(expectedGuideHrefs.length).toBeGreaterThan(0);
    expect(discoveredGuideHrefs).toEqual(expectedGuideHrefs);
    expect(new Set(guides.map((guide) => guide.href)).size).toBe(guides.length);
    for (const href of expectedGuideHrefs) {
      expect(sitemapPaths).toContain(href);
      expect(blogIndex).toContain(`href="${href}"`);
    }
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

  it("renders the dynamically selected related guides without self-links", () => {
    const guides = getAllEditorialGuides();
    const knownHrefs = new Set(guides.map((guide) => guide.href));

    for (const current of guides) {
      const expected = getRelatedEditorialGuides(current.slug);
      const html = renderToStaticMarkup(
        createElement(RelatedGuides, { currentSlug: current.slug }),
      );
      const renderedHrefs = [...html.matchAll(/href="([^"]+)"/g)].map(
        (match) => match[1],
      );

      expect(renderedHrefs, current.slug).toEqual(
        expected.map((guide) => guide.href),
      );
      expect(new Set(renderedHrefs).size, current.slug).toBe(renderedHrefs.length);
      expect(renderedHrefs, current.slug).not.toContain(current.href);
      for (const href of renderedHrefs) {
        expect(knownHrefs, `${current.slug}: unknown related guide ${href}`).toContain(href);
      }
    }
  });

  it("keeps Guides in primary navigation and the guide cluster on the homepage", () => {
    const homepage = readFileSync("src/app/page.tsx", "utf8");

    expect(homepage).toContain('href="/guides"');
    expect(homepage).toContain('href="/sample-medical-bill-report"');
    expect(homepage).toContain("See a synthetic sample report");
    expect(homepage).toContain("<HomepageGuideCluster />");
  });
});
