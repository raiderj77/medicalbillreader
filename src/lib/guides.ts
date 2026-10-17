import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Root, RootContent } from "mdast";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";
import type { Plugin } from "unified";
import { GLOSSARY_TERMS } from "@/lib/glossary";

export type GuideFAQ = {
  question: string;
  answer: string;
};

export type GuideSummary = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  reviewedAt: string;
  keywords: string[];
  faqs: GuideFAQ[];
};

export type Guide = GuideSummary & {
  htmlContent: string;
};

const GUIDES_DIR = path.join(process.cwd(), "content", "guides");
const SAFE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function safeSlug(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const slug = value.trim();
  return SAFE_SLUG.test(slug) ? slug : null;
}

function slugFromFilename(filename: string): string {
  return filename.replace(/\.md$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
}

function parseKeywords(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

function parseFaqs(value: unknown): GuideFAQ[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const question = "question" in item ? String(item.question).trim() : "";
    const answer = "answer" in item ? String(item.answer).trim() : "";
    return question && answer ? [{ question, answer }] : [];
  });
}

function readSummary(filename: string): GuideSummary | null {
  const raw = fs.readFileSync(path.join(GUIDES_DIR, filename), "utf8");
  const { data } = matter(raw);
  const slug = safeSlug(data.slug || slugFromFilename(filename));
  const title = typeof data.title === "string" ? data.title.trim() : "";
  const description =
    typeof data.description === "string" ? data.description.trim() : "";

  if (!slug || !title || !description) return null;

  return {
    slug,
    title,
    description,
    publishedAt: String(data.publishedAt || ""),
    reviewedAt: String(data.reviewedAt || data.publishedAt || ""),
    keywords: parseKeywords(data.keywords),
    faqs: parseFaqs(data.faqs),
  };
}

export function getAllGuides(): GuideSummary[] {
  if (!fs.existsSync(GUIDES_DIR)) return [];

  const seen = new Set<string>();
  return fs
    .readdirSync(GUIDES_DIR)
    .filter((filename) => filename.endsWith(".md"))
    .map(readSummary)
    .filter((guide): guide is GuideSummary => guide !== null)
    .filter((guide) => {
      if (seen.has(guide.slug)) return false;
      seen.add(guide.slug);
      return true;
    })
    .sort((left, right) => left.slug.localeCompare(right.slug));
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const glossaryAliases = GLOSSARY_TERMS.flatMap((entry) =>
  [entry.term, ...entry.aliases].map((label) => ({
    label,
    normalized: label.toLowerCase(),
    slug: entry.slug,
  })),
).sort((left, right) => right.label.length - left.label.length);

const aliasPattern = new RegExp(
  `(?<![A-Za-z0-9])(${glossaryAliases.map(({ label }) => escapeRegExp(label)).join("|")})(?![A-Za-z0-9])`,
  "gi",
);

const glossaryAutolinkPlugin: Plugin<[], Root> = () => {
  return (tree) => {
    const linkedSlugs = new Set<string>();

    function transform(parent: Root | Extract<RootContent, { children: unknown }>, blocked = false) {
      if (!("children" in parent) || !Array.isArray(parent.children)) return;

      for (let index = 0; index < parent.children.length; index += 1) {
        const child = parent.children[index] as RootContent;
        const nextBlocked =
          blocked ||
          child.type === "link" ||
          child.type === "linkReference" ||
          child.type === "heading" ||
          child.type === "code" ||
          child.type === "inlineCode" ||
          child.type === "html";

        if (child.type === "text" && !nextBlocked) {
          const replacements: RootContent[] = [];
          let cursor = 0;
          aliasPattern.lastIndex = 0;

          for (const match of child.value.matchAll(aliasPattern)) {
            const start = match.index ?? 0;
            const matchedText = match[0];
            const alias = glossaryAliases.find(
              (candidate) => candidate.normalized === matchedText.toLowerCase(),
            );
            if (!alias || linkedSlugs.has(alias.slug)) continue;

            if (start > cursor) {
              replacements.push({
                type: "text",
                value: child.value.slice(cursor, start),
              });
            }
            replacements.push({
              type: "link",
              url: `/glossary/${alias.slug}`,
              children: [{ type: "text", value: matchedText }],
            });
            linkedSlugs.add(alias.slug);
            cursor = start + matchedText.length;
          }

          if (replacements.length > 0) {
            if (cursor < child.value.length) {
              replacements.push({
                type: "text",
                value: child.value.slice(cursor),
              });
            }
            parent.children.splice(index, 1, ...replacements);
            index += replacements.length - 1;
          }
          continue;
        }

        if (!nextBlocked && "children" in child) {
          transform(child as Extract<RootContent, { children: unknown }>, nextBlocked);
        }
      }
    }

    transform(tree);
  };
};

export async function renderGuideMarkdown(content: string): Promise<string> {
  const withoutTitle = content.replace(/^\s*#\s+[^\n]+\n+/, "");
  const processed = await remark()
    .use(remarkGfm)
    .use(glossaryAutolinkPlugin)
    .use(html)
    .process(withoutTitle);
  return processed.toString();
}

export async function getGuide(slug: string): Promise<Guide | null> {
  const requestedSlug = safeSlug(slug);
  if (!requestedSlug || !fs.existsSync(GUIDES_DIR)) return null;

  const filename = fs
    .readdirSync(GUIDES_DIR)
    .filter((candidate) => candidate.endsWith(".md"))
    .find((candidate) => {
      const summary = readSummary(candidate);
      return summary?.slug === requestedSlug;
    });
  if (!filename) return null;

  const raw = fs.readFileSync(path.join(GUIDES_DIR, filename), "utf8");
  const { content } = matter(raw);
  const summary = readSummary(filename);
  if (!summary) return null;

  return {
    ...summary,
    htmlContent: await renderGuideMarkdown(content),
  };
}
