import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('pricing reflects the server purchase policy without exposing flags', async ({page, context}) => {
  await context.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
  await page.setViewportSize({width:390,height:844});
  await page.goto('/pricing');
  const enabled = process.env.ENABLE_SINGLE_ANALYSIS === 'true';
  await expect(page.getByRole('button', {name:'Buy Single Analysis',exact:true})).toHaveCount(enabled ? 1 : 0);
  await expect(page.getByText('Single analysis purchases are not available yet.', {exact:false})).toHaveCount(enabled ? 0 : 1);
  await expect(page.getByRole('button', {name:/^subscribe/i})).toHaveCount(0);
  await expect(page.getByRole('button', {name:/Existing subscriber/})).toBeVisible();
  expect(await page.content()).not.toMatch(/ENABLE_SINGLE_ANALYSIS|ENABLE_NEW_SUBSCRIPTIONS/);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
});
