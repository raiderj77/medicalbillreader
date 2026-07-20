import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { contentPathToUrl, pagePathToUrl, pathsToIndexNowUrls } from "../scripts/indexnow-urls.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("maps static pages and blog content to public URLs", () => {
  assert.equal(pagePathToUrl("src/app/page.tsx"), "https://medicalbillreader.com/");
  assert.equal(pagePathToUrl("src/app/pricing/page.tsx"), "https://medicalbillreader.com/pricing");
  assert.equal(contentPathToUrl("content/blog/check-your-bill.md"), "https://medicalbillreader.com/blog/check-your-bill");
});

test("excludes API routes and dynamic route templates", () => {
  assert.equal(pagePathToUrl("src/app/api/analyze/route.ts"), null);
  assert.equal(pagePathToUrl("src/app/blog/[slug]/page.tsx"), null);
  assert.equal(contentPathToUrl("src/lib/blog.ts"), null);
});

test("submits only affected public URLs plus the homepage", () => {
  assert.deepEqual(
    pathsToIndexNowUrls([
      "src/app/pricing/page.tsx",
      "content/blog/check-your-bill.md",
      "content/blog/check-your-bill.md",
    ]),
    [
      "https://medicalbillreader.com/",
      "https://medicalbillreader.com/pricing",
      "https://medicalbillreader.com/blog/check-your-bill",
      "https://medicalbillreader.com/blog",
    ],
  );
});

test("public IndexNow trigger stays absent and workflow fails closed", () => {
  assert.equal(fs.existsSync(path.join(root, "src/app/api/indexnow/route.ts")), false);
  const workflow = fs.readFileSync(path.join(root, ".github/workflows/indexnow.yml"), "utf8");
  assert.match(workflow, /scripts\/indexnow-urls\.mjs/);
  assert.match(workflow, /\[\[ "\$RESPONSE" == "200" \|\| "\$RESPONSE" == "202" \]\]/);
  assert.doesNotMatch(workflow, /exit 0/);
});
