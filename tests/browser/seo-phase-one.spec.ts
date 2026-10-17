import { expect, test } from "@playwright/test";

test("guide hub and generated resources are discoverable", async ({ page }) => {
  await page.goto("/guides");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Medical billing guides for 2026",
  );
  await expect(page.locator('a[href^="/guides/"]')).toHaveCount(5);

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
