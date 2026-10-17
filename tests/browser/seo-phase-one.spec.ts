import { readdirSync, readFileSync } from "node:fs";
import matter from "gray-matter";
import { expect, test } from "@playwright/test";

function guidesFromFiles() {
  return readdirSync("content/guides")
    .filter((filename) => filename.endsWith(".md"))
    .sort()
    .map((filename) => {
      const { data } = matter(
        readFileSync(`content/guides/${filename}`, "utf8"),
      );
      if (typeof data.slug !== "string" || typeof data.title !== "string") {
        throw new Error(`${filename}: missing slug or title`);
      }
      return { slug: data.slug, title: data.title };
    });
}

test("guide hub, routes, and sitemap discover every guide file", async ({ page }) => {
  const guides = guidesFromFiles();
  expect(guides.length).toBeGreaterThan(0);
  await page.goto("/guides");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Medical billing guides for 2026",
  );
  const hubHrefs = await page
    .locator('section[aria-labelledby="guide-list-heading"] a[href^="/guides/"]')
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
  expect(hubHrefs.sort()).toEqual(
    guides.map(({ slug }) => `/guides/${slug}`).sort(),
  );

  for (const guide of guides) {
    const response = await page.goto(`/guides/${guide.slug}`);
    expect(response?.status(), guide.slug).toBe(200);
    await expect(page.getByRole("heading", { level: 1 }), guide.slug).toHaveText(
      guide.title,
    );
  }

  const sitemapResponse = await page.request.get("/sitemap.xml");
  expect(sitemapResponse.status()).toBe(200);
  const sitemapXml = await sitemapResponse.text();
  for (const guide of guides) {
    expect(sitemapXml, guide.slug).toContain(
      `<loc>https://medicalbillreader.com/guides/${guide.slug}</loc>`,
    );
  }

  await page.goto("/glossary");
  await expect(page.locator('a[href^="/glossary/"]')).toHaveCount(12);
});

test("legacy editorial URLs redirect directly to the new canonical guides", async ({ page }) => {
  await page.goto("/blog/how-to-read-an-explanation-of-benefits-eob");
  await expect(page).toHaveURL(/\/guides\/how-to-read-an-eob$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Read an EOB",
  );
});

test("mobile analyzer CTA stays visible while the guide scrolls", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/guides/how-to-read-an-eob");

  const cta = page.getByRole("link", { name: "Explain my bill" });
  await expect(cta).toBeVisible();
  const before = await cta.boundingBox();
  expect(before).not.toBeNull();
  expect(before!.y + before!.height).toBeLessThanOrEqual(844);

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
  await expect(cta).toBeVisible();
  const after = await cta.boundingBox();
  expect(after).not.toBeNull();
  expect(Math.abs(after!.y - before!.y)).toBeLessThan(3);
});
