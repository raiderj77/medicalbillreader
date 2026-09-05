import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
// Owned, blank PNG: no bill, health data, person, identifier or model request.
const fixture = { name:'FICTIONAL-BLANK.png',mimeType:'image/png',buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=','base64') };
test.beforeEach(async ({context}) => {
  await context.route('**/*',route => {
    if(new URL(route.request().url()).origin==='http://127.0.0.1:4314')return route.continue();
    throw new Error('Unexpected remote request in synthetic browser test');
  });
});
test('mobile entry is accessible and choosing a file does not transmit it',async({page})=>{
  const uploads:string[]=[];
  page.on('request',request=>{if(request.method()!=='GET')uploads.push('unexpected transmission');});
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
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
test('unsupported files are rejected without transmission',async({page})=>{
  await page.goto('/');
  await page.getByLabel('Upload a medical bill').setInputFiles({name:'fictional.txt',mimeType:'text/plain',buffer:Buffer.from('FICTIONAL ONLY')});
  await expect(page.getByRole('alert').filter({hasText:'Choose a JPEG'})).toBeVisible();
});
test('denied preference storage does not break upload or theme controls',async({page})=>{
  await page.addInitScript(()=>{Storage.prototype.getItem=()=>{throw new DOMException('Denied','SecurityError');};Storage.prototype.setItem=()=>{throw new DOMException('Denied','SecurityError');};});
  const errors:string[]=[];page.on('pageerror',()=>errors.push('runtime error'));
  await page.goto('/');
  await page.getByRole('button',{name:'Switch to dark mode'}).click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.getByLabel('Upload a medical bill').setInputFiles(fixture);
  await expect(page.getByText(fixture.name,{exact:true})).toBeVisible();
  expect(errors).toEqual([]);
});

