import { test, expect } from '@playwright/test';

// Owned blank image and mocked responses only: no health data or provider calls.
const origin = 'http://127.0.0.1:4314';
const fixture = { name: 'FIRST-BLANK.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64') };

for (const outcome of ['success', 'failure'] as const) {
  test(`pending analysis preserves its selection through ${outcome}`, async ({ page, context }) => {
    await page.setViewportSize({ width: 320, height: 780 });
    // This readable hint is not an entitlement. The analyze response is local.
    await context.addCookies([{ name: 'mbr_sub_active', value: '1', url: origin }]);
    let release!: () => void;
    const pending = new Promise<void>(resolve => { release = resolve; });
    let requests = 0;
    const unexpected: string[] = [];
    await context.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.origin !== origin) {
        unexpected.push('external request');
        return route.abort();
      }
      if (url.pathname === '/api/analyze') {
        requests += 1;
        await pending;
        return route.fulfill({
          status: outcome === 'success' ? 200 : 503,
          contentType: 'application/json',
          body: JSON.stringify(outcome === 'success'
            ? { result: '## FIRST SYNTHETIC RESULT\nBlank image test only.' }
            : { error: 'Synthetic service unavailable. Your credit was not used.' }),
        });
      }
      if (url.pathname.startsWith('/api/')) {
        unexpected.push('unexpected API request');
        return route.abort();
      }
      return route.continue();
    });
    await page.goto('/');
    await page.getByLabel('Upload a medical bill').setInputFiles(fixture);
    await page.getByRole('checkbox').check();
    const submit = page.getByRole('button', { name: /Explain My Bill/ }).last();
    await expect(submit).toBeEnabled();
    // Two synchronous clicks exercise the gap before a disabled state renders.
    await submit.evaluate(button => { (button as HTMLButtonElement).click(); (button as HTMLButtonElement).click(); });
    await expect.poll(() => requests).toBeGreaterThan(0);
    const remove = page.getByRole('button', { name: 'Remove', exact: true });
    try {
      await expect.soft(remove).toBeDisabled();
      await remove.evaluate(button => (button as HTMLButtonElement).click());
      if (await page.getByLabel('Upload a medical bill').count()) {
        await page.getByLabel('Upload a medical bill').setInputFiles({ ...fixture, name: 'SECOND-BLANK.png' });
      }
      await expect.soft(page.getByText(fixture.name, { exact: true })).toBeVisible();
      await expect.soft(page.getByText('SECOND-BLANK.png', { exact: true })).toHaveCount(0);
      await expect.soft(page.getByRole('checkbox')).toBeDisabled();
      expect.soft(requests).toBe(1);
    } finally {
      release();
    }
    if (outcome === 'success') {
      await expect(page.getByRole('heading', { name: 'FIRST SYNTHETIC RESULT' })).toBeVisible();
      await page.getByRole('button', { name: /Analyze Another Bill/ }).click();
    } else {
      await expect(page.getByRole('alert').filter({ hasText: 'Synthetic service unavailable' })).toBeVisible();
      await expect(remove).toBeEnabled();
      await expect(page.getByRole('checkbox')).toBeEnabled();
      await remove.click();
    }
    await page.getByLabel('Upload a medical bill').setInputFiles({ ...fixture, name: 'SECOND-BLANK.png' });
    await expect(page.getByText('SECOND-BLANK.png', { exact: true })).toBeVisible();
    await expect(page.getByRole('checkbox')).not.toBeChecked();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(requests).toBe(1);
    expect(unexpected).toEqual([]);
  });
}
