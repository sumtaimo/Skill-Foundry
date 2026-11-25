/**
 * Optional visual checks of built pages (skips without playwright).
 * @governed-by PO_ARCHITECT
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildSite } from '../src/site/build.mjs';
import { checkPage, SKIP_REASON } from '../src/factory/visual.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('index and a skill page render cleanly', async (t) => {
  const out = mkdtempSync(join(tmpdir(), 'sf-visual-'));
  await buildSite({ root: ROOT, out });
  const ready = JSON.parse(readFileSync(join(ROOT, 'src/factory/registry.json'), 'utf8')).filter((s) => s.status === 'ready');
  assert.ok(ready.length > 0);
  const pages = [join(out, 'index.html'), join(out, 'skills', ready[0].name, 'index.html')];
  for (const p of pages) {
    const r = await checkPage(p, { widths: [1440, 390], themes: ['light', 'dark'] });
    if (r.skipped === SKIP_REASON) {
      assert.equal(r.ok, null);
      t.skip(SKIP_REASON);
      return;
    }
    assert.deepEqual(r.problems, [], p);
  }
});

async function loadPw() {
  try { const mod = 'playwright'; const pw = await import(mod); return pw.chromium ?? pw.default?.chromium; } catch { return null; }
}

test('hero then real result, qbar progress, no horizontal scroll, every control 44px or more', async (t) => {
  const chromium = await loadPw();
  if (!chromium) { t.skip(SKIP_REASON); return; }
  const out = mkdtempSync(join(tmpdir(), 'sf-visual2-'));
  await buildSite({ root: ROOT, out });
  const ready = JSON.parse(readFileSync(join(ROOT, 'src/factory/registry.json'), 'utf8')).filter((s) => s.status === 'ready');
  const browser = await chromium.launch();
  const small = () => [...document.querySelectorAll('a, button, input, summary')].filter((e) => {
    const r = e.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden' && !e.closest('svg') && (r.height < 44 - 0.5 || r.width < 44 - 0.5) && e.getAttribute('class') !== 'skip';
  }).map((e) => `${e.tagName} ${(e.textContent || '').trim().slice(0, 20)} ${Math.round(e.getBoundingClientRect().width)}x${Math.round(e.getBoundingClientRect().height)}`);
  try {
    for (const width of [1440, 390]) {
      const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      const page = await ctx.newPage();
      await page.goto(pathToFileURL(join(out, 'index.html')).href, { waitUntil: 'load' });
      const r = await page.evaluate(() => {
        const h = document.querySelector('.hero').getBoundingClientRect();
        const res = document.querySelector('.real-result .cover-lg')?.getBoundingClientRect();
        const ask = document.querySelector('.real-result .proof-ask')?.getBoundingClientRect();
        const d = document.documentElement;
        return { heroBottom: h.bottom, res: res && { top: res.top, left: res.left, right: res.right, bottom: res.bottom }, ask: ask && { top: ask.top, left: ask.left }, scroll: d.scrollWidth > d.clientWidth, cta: [...document.querySelectorAll('.btn.primary')].length };
      });
      assert.ok(r.res && r.ask, 'real result and its request present');
      assert.ok(r.res.top >= r.heroBottom - 1, 'the real result sits under the hero');
      assert.ok(r.res.top < 900, 'the real result starts on the first screen');
      if (width === 1440) assert.ok(r.ask.left >= r.res.right - 1, 'request beside the result at 1440');
      else assert.ok(r.ask.top >= r.res.bottom - 1, 'request under the result at 390');
      assert.equal(r.scroll, false, `horizontal scroll index ${width}`);
      assert.equal(r.cta, 1, 'one primary action');
      assert.deepEqual(await page.evaluate(small), [], `targets under 44px on index at ${width}`);

      await page.goto(pathToFileURL(join(out, 'skills', ready[0].name, 'index.html')).href, { waitUntil: 'load' });
      const w0 = await page.evaluate(() => document.querySelector('.qbar-progress')?.getBoundingClientRect().width ?? -1);
      assert.ok(w0 >= 0, 'qbar-progress present');
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight / 2));
      await page.waitForTimeout(200);
      const w1 = await page.evaluate(() => document.querySelector('.qbar-progress').getBoundingClientRect().width);
      assert.ok(w1 > w0, `qbar-progress grows (${w0} -> ${w1})`);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth), false);
      assert.deepEqual(await page.evaluate(small), [], `targets under 44px on a skill page at ${width}`);
      await ctx.close();
    }
  } finally {
    await browser.close();
  }
});

test('no JavaScript: the visible text has no raw placeholder', async (t) => {
  const chromium = await loadPw();
  if (!chromium) { t.skip(SKIP_REASON); return; }
  const out = mkdtempSync(join(tmpdir(), 'sf-visual3-'));
  await buildSite({ root: ROOT, out });
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto(pathToFileURL(join(out, 'index.html')).href, { waitUntil: 'load' });
    const body = await page.evaluate(() => document.body.innerText);
    assert.doesNotMatch(body, /\{site\}|\{base\}/);
    await ctx.close();
  } finally {
    await browser.close();
  }
});

test('scroll reveal: scrolling through all skill cards reveals every card cleanly without stuck opacity', async (t) => {
  const chromium = await loadPw();
  if (!chromium) { t.skip(SKIP_REASON); return; }
  const out = mkdtempSync(join(tmpdir(), 'sf-visual4-'));
  await buildSite({ root: ROOT, out });
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(pathToFileURL(join(out, 'index.html')).href, { waitUntil: 'load' });
    const totalHeight = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y <= totalHeight; y += 600) {
      await page.evaluate((pos) => window.scrollTo(0, pos), y);
      await page.waitForTimeout(80);
    }
    await page.waitForTimeout(400);
    const stuck = await page.evaluate(() => [...document.querySelectorAll('.plate')].filter((el) => Number(getComputedStyle(el).opacity) < 0.99).map((el) => el.dataset.skill));
    assert.deepEqual(stuck, [], `cards stuck invisible after scroll: ${stuck.join(', ')}`);
    const copyTightSvg = await page.evaluate(() => document.querySelector('[data-skill="copy-tight"] .cover')?.textContent || '');
    assert.ok(!copyTightSvg.includes('What changed:'), `copy-tight cover showed heading instead of rewritten copy: ${copyTightSvg}`);
    // Verify svg-mechanism live interactive playground & tab switcher
    await page.goto(pathToFileURL(join(out, 'skills', 'svg-mechanism', 'index.html')).href, { waitUntil: 'load' });
    const src0 = await page.getAttribute('.pg-frame', 'src');
    assert.equal(src0, 'example.html', 'svg-mechanism opens primary webhook-pipeline playground');
    const khTab = page.locator('.pg-tab[data-pg-src="demos/khmer-payment-flow.html"]');
    await khTab.click();
    assert.equal(await page.getAttribute('.pg-frame', 'src'), 'demos/khmer-payment-flow.html', 'tab switches playground to Khmer demo');
    assert.equal(await page.getAttribute('.pg-open', 'href'), 'demos/khmer-payment-flow.html', 'open full screen link tracks active demo');
    await ctx.close();
  } finally {
    await browser.close();
  }
});
