import { test, expect, type BrowserContext, type Request } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
// Owned, blank PNG: no bill, health data, person, identifier or model request.
const fixture = { name:'FICTIONAL-BLANK.png',mimeType:'image/png',buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=','base64') };
const origin = 'http://127.0.0.1:4314';
const remoteAttempts = new WeakMap<BrowserContext, string[]>();

function observeSensitiveTransport(context: BrowserContext) {
  const attempts: string[] = [];
  // Same-origin GETs can leak a filename or file contents into server logs.
  // Observe the whole context, including popups, and retain no request values.
  context.on('request', (request: Request) => {
    const url = new URL(request.url());
    if (url.origin !== origin || request.method() !== 'GET' || request.postData() ||
        !url.pathname.startsWith('/_next/static/') || url.search) {
      attempts.push('unexpected transport');
    }
  });
  context.on('page', page => page.on('websocket', () => attempts.push('unexpected websocket')));
  for (const page of context.pages()) page.on('websocket', () => attempts.push('unexpected websocket'));
  return attempts;
}

test.beforeEach(async ({context}) => {
  const attempts: string[] = [];
  remoteAttempts.set(context, attempts);
  await context.routeWebSocket('**/*', socket => {
    attempts.push('unexpected websocket');
    socket.close();
  });
  await context.route('**/*',route => {
    if(new URL(route.request().url()).origin===origin)return route.continue();
    attempts.push('unexpected remote request');
    return route.abort();
  });
});
test.afterEach(async ({context}) => expect(remoteAttempts.get(context)).toEqual([]));

test('privacy observer catches an injected same-origin GET',async({page,context})=>{
  // Fulfill locally: this owned marker never reaches a server or provider.
  await context.route('**/__privacy_canary__?*', route => route.fulfill({status:204}));
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const attempts=observeSensitiveTransport(context);
  await page.evaluate(async()=>{await fetch('/__privacy_canary__?fixture=owned');});
  expect(attempts).toEqual(['unexpected transport']);
});
test('mobile entry is accessible and choosing a file does not transmit it',async({page,context})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const uploads=observeSensitiveTransport(context);
  await page.getByLabel('Upload a medical bill').setInputFiles(fixture);
  await expect(page.getByText(fixture.name,{exact:true})).toBeVisible();
  await expect(page.getByRole('checkbox')).not.toBeChecked();
  await expect(page.getByRole('button',{name:/Explain My Bill/}).last()).toBeDisabled();
  const result=await new AxeBuilder({page}).include('#analyzer').withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
  expect(result.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}))).toEqual([]);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.getByRole('button',{name:'Remove',exact:true}).click();
  await expect(page.getByText(fixture.name,{exact:true})).toHaveCount(0);
  expect(await page.evaluate(()=>JSON.stringify({...localStorage,...sessionStorage}).includes('FICTIONAL'))).toBe(false);
  expect(uploads).toEqual([]);
});
test('unsupported files are rejected without transmission',async({page,context})=>{
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const uploads=observeSensitiveTransport(context);
  await page.getByLabel('Upload a medical bill').setInputFiles({name:'fictional.txt',mimeType:'text/plain',buffer:Buffer.from('FICTIONAL ONLY')});
  await expect(page.getByRole('alert').filter({hasText:'Choose a JPEG'})).toBeVisible();
  expect(uploads).toEqual([]);
});
test('denied preference storage does not break upload or theme controls',async({page})=>{
  await page.emulateMedia({colorScheme:'dark'});
  await page.addInitScript(()=>{Storage.prototype.getItem=()=>{throw new DOMException('Denied','SecurityError');};Storage.prototype.setItem=()=>{throw new DOMException('Denied','SecurityError');};});
  const errors:string[]=[];page.on('pageerror',()=>errors.push('runtime error'));
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.getByRole('button',{name:'Switch to light mode'}).click();
  await expect(page.locator('html')).toHaveClass(/light/);
  await page.getByLabel('Upload a medical bill').setInputFiles(fixture);
  await expect(page.getByText(fixture.name,{exact:true})).toBeVisible();
  expect(errors).toEqual([]);
});

