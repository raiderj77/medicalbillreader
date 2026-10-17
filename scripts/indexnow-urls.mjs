import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const SITE_ORIGIN = "https://medicalbillreader.com";
const GUIDE_SLUGS = [
  "common-medical-bill-errors",
  "good-faith-estimate-400-rule",
  "how-to-dispute-a-medical-bill",
  "how-to-negotiate-a-hospital-bill",
  "how-to-read-an-eob",
];
const GLOSSARY_SLUGS = [
  "allowed-amount",
  "balance-billing",
  "chargemaster",
  "coinsurance",
  "copay",
  "deductible",
  "explanation-of-benefits",
  "good-faith-estimate",
  "itemized-bill",
  "out-of-pocket-maximum",
  "prior-authorization",
  "surprise-billing",
];

const publicUrls = (prefix, slugs) =>
  slugs.map((slug) => `${SITE_ORIGIN}/${prefix}/${slug}`);

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
  const match = normalized.match(/^content\/(blog|guides)\/([^/]+)\.mdx?$/);
  if (!match) return null;
  const section = match[1];
  const slug = path.posix
    .basename(match[2])
    .replace(/^\d{4}-\d{2}-\d{2}-/, "");
  return slug ? `${SITE_ORIGIN}/${section}/${slug}` : null;
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
    if (trimmed.startsWith("content/guides/") || trimmed.startsWith("src/app/guides/") || trimmed === "src/lib/guides.ts") {
      urls.add(`${SITE_ORIGIN}/guides`);
      publicUrls("guides", GUIDE_SLUGS).forEach((guideUrl) => urls.add(guideUrl));
    }
    if (trimmed.startsWith("src/app/glossary/") || trimmed === "src/lib/glossary.ts") {
      urls.add(`${SITE_ORIGIN}/glossary`);
      publicUrls("glossary", GLOSSARY_SLUGS).forEach((termUrl) => urls.add(termUrl));
    }
  }
  return [...urls];
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const changedFiles = fs.readFileSync(0, "utf8").split(/\r?\n/).filter(Boolean);
  process.stdout.write(JSON.stringify(pathsToIndexNowUrls(changedFiles)));
}
