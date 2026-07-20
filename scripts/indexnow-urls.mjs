import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const SITE_ORIGIN = "https://medicalbillreader.com";

export function pagePathToUrl(filePath) {
  const normalized = filePath.replaceAll("\\", "/");
  if (normalized === "src/app/page.tsx") return `${SITE_ORIGIN}/`;
  if (!normalized.startsWith("src/app/") || !normalized.endsWith("/page.tsx")) return null;

  const routeSegments = normalized
    .slice("src/app/".length, -"/page.tsx".length)
    .split("/")
    .filter((segment) => !(segment.startsWith("(") && segment.endsWith(")")));

  if (
    routeSegments.length === 0 ||
    routeSegments.some((segment) => segment.startsWith("[") || segment.startsWith("@") || segment.startsWith("_"))
  ) {
    return null;
  }
  return `${SITE_ORIGIN}/${routeSegments.join("/")}`;
}

export function contentPathToUrl(filePath) {
  const normalized = filePath.replaceAll("\\", "/");
  if (!normalized.startsWith("content/blog/") || !/\.mdx?$/.test(normalized)) return null;
  const slug = path.posix.basename(normalized).replace(/\.mdx?$/, "");
  return slug ? `${SITE_ORIGIN}/blog/${slug}` : null;
}

export function pathsToIndexNowUrls(filePaths) {
  const urls = new Set([`${SITE_ORIGIN}/`]);
  for (const filePath of filePaths) {
    const trimmed = filePath.trim();
    const url = pagePathToUrl(trimmed) || contentPathToUrl(trimmed);
    if (url) urls.add(url);
    if (trimmed.startsWith("content/blog/") || trimmed === "src/app/blog/page.tsx") {
      urls.add(`${SITE_ORIGIN}/blog`);
    }
  }
  return [...urls];
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const changedFiles = fs.readFileSync(0, "utf8").split(/\r?\n/).filter(Boolean);
  process.stdout.write(JSON.stringify(pathsToIndexNowUrls(changedFiles)));
}
