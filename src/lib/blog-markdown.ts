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

function slugFromFilename(filename: string): string {
  return filename.replace(/\.md$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
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
      const slug: string = (data.slug as string) || slugFromFilename(filename);
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

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));

  let foundFile: string | undefined;
  for (const filename of files) {
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
    const { data } = matter(raw);
    const fileSlug = (data.slug as string) || slugFromFilename(filename);
    if (fileSlug === slug) {
      foundFile = filename;
      break;
    }
  }

  if (!foundFile) return null;

  const raw = fs.readFileSync(path.join(BLOG_DIR, foundFile), "utf-8");
  const { data, content } = matter(raw);

  const processed = await remark()
    .use(remarkGfm)
    .use(html, { sanitize: false })
    .process(stripLeadingTitle(content));

  return {
    slug,
    title: (data.title as string) || "",
    date: (data.date as string) || "",
    modified: (data.modified as string) || (data.date as string) || "",
    description: (data.description as string) || "",
    keywords: parseKeywords(data.keywords),
    excerpt: getExcerpt(content, (data.description as string) || ""),
    htmlContent: processed.toString(),
  };
}
