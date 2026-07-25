import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

export interface MarkdownPost {
  slug: string;
  title: string;
  date: string;
  modified: string;
  description: string;
  keywords: string[];
  excerpt: string;
}

export interface MarkdownPostWithContent extends MarkdownPost {
  htmlContent: string;
}

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const SAFE_BLOG_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function slugFromFilename(filename: string): string {
  return filename.replace(/\.md$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
}

function safeBlogSlug(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const slug = value.trim();
  return SAFE_BLOG_SLUG.test(slug) ? slug : null;
}

function slugForPost(filename: string, frontmatterSlug: unknown): string | null {
  const candidate =
    typeof frontmatterSlug === "string" && frontmatterSlug.trim()
      ? frontmatterSlug
      : slugFromFilename(filename);
  return safeBlogSlug(candidate);
}

function parseKeywords(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw === "string") return [raw];
  return [];
}

function getExcerpt(content: string, description: string): string {
  if (description) return description;
  const firstPara =
    content
      .split("\n")
      .find((line) => line.trim() && !line.trim().startsWith("#")) || "";
  return firstPara.replace(/[*_`[\]]/g, "").slice(0, 200);
}

function stripLeadingTitle(content: string): string {
  return content.replace(/^\s*#\s+[^\n]+\n+/, "");
}

export function getAllMarkdownPosts(): MarkdownPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));

  const seen = new Set<string>();
  const posts = files
    .map((filename) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
      const { data, content } = matter(raw);
      const slug = slugForPost(filename, data.slug);
      if (!slug) return null;
      return {
        slug,
        title: (data.title as string) || "",
        date: (data.date as string) || "",
        modified: (data.modified as string) || (data.date as string) || "",
        description: (data.description as string) || "",
        keywords: parseKeywords(data.keywords),
        excerpt: getExcerpt(content, (data.description as string) || ""),
      };
    })
    .filter((post): post is MarkdownPost => post !== null)
    .filter((p) => {
      if (!p.title || seen.has(p.slug)) return false;
      seen.add(p.slug);
      return true;
    });

  return posts.sort((a, b) => {
    const da = a.date ? new Date(a.date).getTime() : 0;
    const db = b.date ? new Date(b.date).getTime() : 0;
    return db - da;
  });
}

export async function getMarkdownPost(
  slug: string
): Promise<MarkdownPostWithContent | null> {
  if (!fs.existsSync(BLOG_DIR)) return null;
  const safeRequestedSlug = safeBlogSlug(slug);
  if (!safeRequestedSlug) return null;

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));

  let foundFile: string | undefined;
  for (const filename of files) {
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
    const { data } = matter(raw);
    const fileSlug = slugForPost(filename, data.slug);
    if (fileSlug === safeRequestedSlug) {
      foundFile = filename;
      break;
    }
  }

  if (!foundFile) return null;

  const raw = fs.readFileSync(path.join(BLOG_DIR, foundFile), "utf-8");
  const { data, content } = matter(raw);

  const htmlContent = await renderMarkdownContent(stripLeadingTitle(content));

  return {
    slug: safeRequestedSlug,
    title: (data.title as string) || "",
    date: (data.date as string) || "",
    modified: (data.modified as string) || (data.date as string) || "",
    description: (data.description as string) || "",
    keywords: parseKeywords(data.keywords),
    excerpt: getExcerpt(content, (data.description as string) || ""),
    htmlContent,
  };
}

export async function renderMarkdownContent(content: string): Promise<string> {
  const processed = await remark().use(remarkGfm).use(html).process(content);
  return processed.toString();
}
