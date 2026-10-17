import { readdirSync, readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import matter from "gray-matter";
import { describe, expect, it } from "vitest";
import GuidePage, { generateStaticParams } from "@/app/guides/[slug]/page";
import GuidesPage from "@/app/guides/page";
import GlossaryTermPage from "@/app/glossary/[slug]/page";
import GlossaryPage from "@/app/glossary/page";
import sitemap from "@/app/sitemap";
import ArticleCTA from "@/components/ArticleCTA";
import FAQSection from "@/components/FAQSection";
import { GLOSSARY_TERMS } from "@/lib/glossary";
import { getAllGuides, renderGuideMarkdown } from "@/lib/guides";

function wordCount(value: string): number {
  return value.match(/[A-Za-z0-9$][A-Za-z0-9'’$-]*/g)?.length ?? 0;
}

const GUIDES_DIRECTORY = "content/guides";
const REQUIRED_GUIDE_FRONTMATTER = [
  "slug",
  "title",
  "description",
  "publishedAt",
  "reviewedAt",
  "keywords",
  "faqs",
] as const;

function guideFiles() {
  return readdirSync(GUIDES_DIRECTORY)
    .filter((filename) => filename.endsWith(".md"))
    .sort()
    .map((filename) => ({
      filename,
      ...matter(readFileSync(`${GUIDES_DIRECTORY}/${filename}`, "utf8")),
    }));
}

function requiredString(
  data: Record<string, unknown>,
  key: string,
  filename: string,
): string {
  const value = data[key];
  expect(typeof value, `${filename}: ${key} must be a string`).toBe("string");
  if (typeof value !== "string") throw new Error(`${filename}: invalid ${key}`);
  expect(value.trim().length, `${filename}: ${key} must not be empty`).toBeGreaterThan(0);
  return value.trim();
}

describe("SEO Phase 1 editorial foundations", () => {
  it("discovers and publishes every guide file through the route and sitemap", async () => {
    const files = guideFiles();
    const guides = getAllGuides();
    expect(files.length).toBeGreaterThan(0);
    const discoveredSlugs = files.map(({ filename, data }) => {
      for (const key of REQUIRED_GUIDE_FRONTMATTER) {
        expect(
          Object.prototype.hasOwnProperty.call(data, key),
          `${filename}: missing ${key}`,
        ).toBe(true);
      }

      const slug = requiredString(data, "slug", filename);
      const title = requiredString(data, "title", filename);
      const description = requiredString(data, "description", filename);
      const publishedAt = requiredString(data, "publishedAt", filename);
      const reviewedAt = requiredString(data, "reviewedAt", filename);
      const filenameSlug = filename
        .replace(/\.md$/, "")
        .replace(/^\d{4}-\d{2}-\d{2}-/, "");

      expect(slug, filename).toBe(filenameSlug);
      expect(slug, filename).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(title, filename).toContain("?");
      expect(title, filename).toContain("2026");
      expect(title.length, filename).toBeLessThan(60);
      expect(description.length, filename).toBeGreaterThanOrEqual(80);
      expect(publishedAt, filename).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(reviewedAt, filename).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(publishedAt)), filename).toBe(false);
      expect(Number.isNaN(Date.parse(reviewedAt)), filename).toBe(false);
      expect(Array.isArray(data.keywords), `${filename}: keywords must be an array`).toBe(true);
      expect((data.keywords as unknown[]).length, filename).toBeGreaterThan(0);
      for (const keyword of data.keywords as unknown[]) {
        expect(typeof keyword, `${filename}: keyword must be a string`).toBe("string");
        expect(String(keyword).trim().length, filename).toBeGreaterThan(0);
      }
      expect(Array.isArray(data.faqs), `${filename}: faqs must be an array`).toBe(true);
      expect((data.faqs as unknown[]).length, filename).toBeGreaterThanOrEqual(3);
      for (const faq of data.faqs as Array<Record<string, unknown>>) {
        expect(typeof faq?.question, `${filename}: FAQ question must be a string`).toBe("string");
        expect(String(faq?.question ?? "").trim().length, filename).toBeGreaterThan(0);
        expect(typeof faq?.answer, `${filename}: FAQ answer must be a string`).toBe("string");
        expect(String(faq?.answer ?? "").trim().length, filename).toBeGreaterThan(0);
      }

      return slug;
    });

    expect(new Set(discoveredSlugs).size).toBe(discoveredSlugs.length);
    expect(guides.map((guide) => guide.slug)).toEqual([...discoveredSlugs].sort());
    expect(generateStaticParams().map(({ slug }) => slug)).toEqual(
      [...discoveredSlugs].sort(),
    );

    const guideHub = renderToStaticMarkup(createElement(GuidesPage));
    const sitemapPaths = new Set(
      sitemap().map((entry) => new URL(entry.url).pathname),
    );

    for (const { filename, content, data } of files) {
      const slug = String(data.slug);
      const guide = guides.find((candidate) => candidate.slug === slug);
      if (!guide) throw new Error(`${filename}: guide loader omitted ${slug}`);
      const siblingLinks = content.match(/\]\(\/guides\//g) ?? [];

      expect(guide.title, guide.slug).toContain("?");
      expect(guide.title, guide.slug).toContain("2026");
      expect(guide.title.length, guide.slug).toBeLessThan(60);
      expect(guide.description.length, guide.slug).toBeGreaterThanOrEqual(80);
      expect(guide.faqs.length, guide.slug).toBeGreaterThanOrEqual(3);
      expect(wordCount(content), guide.slug).toBeGreaterThanOrEqual(1_200);
      expect(wordCount(content), guide.slug).toBeLessThanOrEqual(2_500);
      expect(content, guide.slug).not.toMatch(/^#\s/m);
      expect(content, guide.slug).toContain("## Sources");
      expect(content, guide.slug).toMatch(/synthetic|illustrative/i);
      expect(content, guide.slug).toContain("](/glossary)");
      expect(siblingLinks.length, guide.slug).toBeGreaterThanOrEqual(2);
      expect(content, guide.slug).not.toMatch(/20[–-]30%|30[–-]50%/);
      expect(content, guide.slug).not.toMatch(/scripts? that (?:actually )?work/i);
      expect(content, guide.slug).not.toMatch(
        /(?:is|have|has) (?:a )?federal right to (?:an|a) itemized bill/i,
      );

      expect(guideHub, guide.slug).toContain(`href="/guides/${guide.slug}"`);
      expect(sitemapPaths, guide.slug).toContain(`/guides/${guide.slug}`);
      const page = await GuidePage({
        params: Promise.resolve({ slug: guide.slug }),
      });
      const html = renderToStaticMarkup(page);
      expect(html, guide.slug).toContain("<h1");
      expect(html, guide.slug).toContain(
        `https://medicalbillreader.com/guides/${guide.slug}`,
      );
    }
  });

  it("keeps the No Surprises Act safeguards visible in the dispute guide", () => {
    const guide = readFileSync(
      "content/guides/how-to-dispute-a-medical-bill.md",
      "utf8",
    );

    expect(guide).toMatch(/January 1, 2022/);
    expect(guide).toContain("1-800-985-3059");
    expect(guide).toMatch(/ground ambulance/i);
    expect(guide).toMatch(/air[- ]ambulance/i);
  });

  it("auto-links the first unlinked glossary mention without changing headings or existing links", async () => {
    const html = await renderGuideMarkdown(`## EOB heading

An EOB can show an allowed amount and a deductible. A second EOB stays plain.

[Coinsurance already linked](/existing) can be followed by coinsurance in text.`);

    expect(html).toContain("<h2>EOB heading</h2>");
    expect(html.match(/href="\/glossary\/explanation-of-benefits"/g)).toHaveLength(1);
    expect(html.match(/href="\/glossary\/allowed-amount"/g)).toHaveLength(1);
    expect(html.match(/href="\/glossary\/deductible"/g)).toHaveLength(1);
    expect(html).toContain('href="/existing"');
    expect(html.match(/href="\/glossary\/coinsurance"/g)).toHaveLength(1);
  });

  it("uses one source of truth for visible FAQ copy and FAQ schema", () => {
    const items = [
      { question: "What is this?", answer: "A synthetic test answer." },
      { question: "What should I verify?", answer: "The official source." },
    ];
    const html = renderToStaticMarkup(createElement(FAQSection, { items }));

    for (const item of items) {
      expect(html.split(item.question)).toHaveLength(3);
      expect(html.split(item.answer)).toHaveLength(3);
    }
    expect(html).toContain('"@type":"FAQPage"');
  });

  it("keeps the acquisition CTA truthful and conditionally describes free access", () => {
    const html = renderToStaticMarkup(createElement(ArticleCTA));

    expect(html).toContain('href="/#analyzer"');
    expect(html).toContain("Explain my bill");
    expect(html).toContain("$4.99 one time");
    expect(html).toContain("limited free analysis is available");
    expect(html).toContain("cannot determine that a charge is wrong");
    expect(html).toContain("fixed inset-x-3");
    expect(html).not.toMatch(/explains every line|error scan/i);
  });

  it("defines exactly the requested 12 glossary concepts at useful depth", () => {
    expect(GLOSSARY_TERMS).toHaveLength(12);
    const concepts = new Set(
      GLOSSARY_TERMS.flatMap((term) => [term.term, ...term.aliases]).map((term) =>
        term.toLowerCase(),
      ),
    );
    for (const expected of [
      "eob",
      "allowed amount",
      "chargemaster",
      "deductible",
      "copay",
      "coinsurance",
      "out-of-pocket maximum",
      "prior authorization",
      "balance billing",
      "surprise billing",
      "good faith estimate",
      "itemized bill",
    ]) {
      expect(concepts).toContain(expected);
    }
    for (const term of GLOSSARY_TERMS) {
      expect(wordCount(term.definition), term.slug).toBeGreaterThanOrEqual(100);
      expect(wordCount(term.definition), term.slug).toBeLessThanOrEqual(200);
      expect(term.sources.length, term.slug).toBeGreaterThan(0);
      expect(`${term.term}: What Does It Mean? (2026)`.length, term.slug).toBeLessThan(60);
    }
  });

  it("renders hubs with inbound links to every generated resource", () => {
    const guideHub = renderToStaticMarkup(createElement(GuidesPage));
    const glossaryHub = renderToStaticMarkup(createElement(GlossaryPage));

    for (const guide of getAllGuides()) {
      expect(guideHub).toContain(`href="/guides/${guide.slug}"`);
    }
    for (const term of GLOSSARY_TERMS) {
      expect(glossaryHub).toContain(`href="/glossary/${term.slug}"`);
    }
    expect(guideHub).toContain('href="/#analyzer"');
    expect(guideHub).toContain('href="/glossary"');
    expect(glossaryHub).toContain('href="/#analyzer"');
    expect(glossaryHub).toContain('href="/guides/how-to-read-an-eob"');
    expect(glossaryHub).toContain('href="/guides/common-medical-bill-errors"');
  });

  it("gives every generated detail page a tool, glossary, and sibling path", async () => {
    for (const guide of getAllGuides()) {
      const page = await GuidePage({
        params: Promise.resolve({ slug: guide.slug }),
      });
      const html = renderToStaticMarkup(page);
      expect(html, guide.slug).toContain('href="/#analyzer"');
      expect(html, guide.slug).toContain('href="/glossary"');
      expect(html.match(/href="\/guides\//g)?.length ?? 0, guide.slug).toBeGreaterThanOrEqual(2);
    }

    for (const term of GLOSSARY_TERMS) {
      const page = await GlossaryTermPage({
        params: Promise.resolve({ slug: term.slug }),
      });
      const html = renderToStaticMarkup(page);
      expect(html, term.slug).toContain('href="/#analyzer"');
      expect(html, term.slug).toContain('href="/glossary"');
      expect(html.match(/href="\/guides\//g)?.length ?? 0, term.slug).toBeGreaterThanOrEqual(2);
    }
  });
});
