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
    const bad = r.problems.filter((x) => x.kind === 'console-error' || x.kind === 'horizontal-scroll');
    assert.deepEqual(bad, [], p);
  }
});

async function loadPw() {
  try { const mod = 'playwright'; const pw = await import(mod); return pw.chromium ?? pw.default?.chromium; } catch { return null; }
}

test('hero layout, qbar progress and no horizontal scroll', async (t) => {
  const chromium = await loadPw();
  if (!chromium) { t.skip(SKIP_REASON); return; }
  const out = mkdtempSync(join(tmpdir(), 'sf-visual2-'));
  await buildSite({ root: ROOT, out });
  const ready = JSON.parse(readFileSync(join(ROOT, 'src/factory/registry.json'), 'utf8')).filter((s) => s.status === 'ready');
  const browser = await chromium.launch();
  try {
    for (const width of [1440, 390]) {
      const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      const page = await ctx.newPage();
      await page.goto(pathToFileURL(join(out, 'index.html')).href, { waitUntil: 'load' });
      const r = await page.evaluate(() => {
        const a = document.querySelector('.hero .hero-prompt')?.getBoundingClientRect();
        const b = document.querySelector('.hero .hero-figure')?.getBoundingClientRect();
        const d = document.documentElement;
        return { a: a && { top: a.top, bottom: a.bottom, right: a.right }, b: b && { top: b.top, left: b.left }, scroll: d.scrollWidth > d.clientWidth };
      });
      assert.ok(r.a && r.b, 'hero-prompt and hero-figure present');
      if (width === 1440) assert.ok(r.b.left >= r.a.right - 1 && r.b.top < r.a.bottom, 'side by side at 1440');
      else assert.ok(r.b.top >= r.a.bottom - 1, 'stacked at 390');
      assert.equal(r.scroll, false, `horizontal scroll index ${width}`);

      await page.goto(pathToFileURL(join(out, 'skills', ready[0].name, 'index.html')).href, { waitUntil: 'load' });
      const w0 = await page.evaluate(() => document.querySelector('.qbar-progress')?.getBoundingClientRect().width ?? -1);
      assert.ok(w0 >= 0, 'qbar-progress present');
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight / 2));
      await page.waitForTimeout(200);
      const w1 = await page.evaluate(() => document.querySelector('.qbar-progress').getBoundingClientRect().width);
      assert.ok(w1 > w0, `qbar-progress grows (${w0} -> ${w1})`);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth), false);
      await ctx.close();
    }
  } finally {
    await browser.close();
  }
});

test('reduced motion: hero parts are static and visible', async (t) => {
  const chromium = await loadPw();
  if (!chromium) { t.skip(SKIP_REASON); return; }
  const out = mkdtempSync(join(tmpdir(), 'sf-visual3-'));
  await buildSite({ root: ROOT, out });
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(pathToFileURL(join(out, 'index.html')).href, { waitUntil: 'load' });
    const parts = await page.evaluate(() => [...document.querySelectorAll('.hero-part')].map((e) => {
      const cs = getComputedStyle(e);
      return { name: cs.animationName, opacity: cs.opacity };
    }));
    assert.ok(parts.length > 0, '.hero-part present');
    for (const p of parts) {
      assert.equal(p.name, 'none');
      assert.equal(Number(p.opacity), 1);
    }
    await ctx.close();
  } finally {
    await browser.close();
  }
});
