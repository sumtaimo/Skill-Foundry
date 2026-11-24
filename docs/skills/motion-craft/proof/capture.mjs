// Scroll each built page in a real browser and report what is visible. Starts one browser and closes it.
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { tmpdir } from 'node:os';
const SP = join(tmpdir(), 'motion-craft-proof'); // outside the repository on purpose: agents started inside it read its rules
mkdirSync(SP, { recursive: true });
const { chromium } = createRequire(import.meta.url)('playwright');
const browser = await chromium.launch();
const out = join(SP, 'shots');
mkdirSync(out, { recursive: true });

// Visible text runs, with the opacity of every ancestor and the clip of every overflow box applied.
const read = () => {
  const texts = [];
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = w.nextNode());) {
    if (!n.textContent.trim()) continue;
    const r = document.createRange();
    r.selectNodeContents(n);
    let { left, top, right, bottom } = r.getBoundingClientRect();
    const whole = (right - left) * (bottom - top);
    let alpha = 1;
    for (let e = n.parentElement; e; e = e.parentElement) {
      const s = getComputedStyle(e);
      if (s.display === 'none' || s.visibility === 'hidden') alpha = 0;
      alpha *= Number(s.opacity);
      if (e !== document.body && e !== document.documentElement && s.overflow !== 'visible') {
        const b = e.getBoundingClientRect();
        left = Math.max(left, b.left); top = Math.max(top, b.top); right = Math.min(right, b.right); bottom = Math.min(bottom, b.bottom);
      }
    }
    const seenW = Math.min(right, innerWidth) - Math.max(left, 0);
    const seenH = Math.min(bottom, innerHeight) - Math.max(top, 0);
    if (alpha > 0.1 && seenW > 1 && seenH > 1) texts.push({ t: n.textContent.trim().slice(0, 40), box: [left, top, right, bottom].map(Math.round), cut: whole > 0 && seenW * seenH < whole * 0.9 });
  }
  let overlaps = 0;
  texts.forEach((a, i) => texts.slice(i + 1).forEach((b) => {
    if (Math.min(a.box[2], b.box[2]) - Math.max(a.box[0], b.box[0]) > 4 && Math.min(a.box[3], b.box[3]) - Math.max(a.box[1], b.box[1]) > 4) overlaps++;
  }));
  return { texts, overlaps, sideways: document.documentElement.scrollWidth > document.documentElement.clientWidth, height: document.documentElement.scrollHeight, words: document.body.innerText.replace(/\s+/g, ' ').trim().slice(0, 160) };
};

const IDS = ['khmer', 'no-assets', 'rooms', 'editorial'];
const report = {};
for (const id of IDS) {
  const file = join(SP, 'built', id, 'index.html');
  if (!existsSync(file)) continue;
  for (const [vw, height] of [[1440, 900], [390, 844], [360, 640]]) {
    for (const mode of ['motion', 'reduce', 'no-js']) {
      const ctx = await browser.newContext({ viewport: { width: vw, height }, reducedMotion: mode === 'reduce' ? 'reduce' : 'no-preference', javaScriptEnabled: mode !== 'no-js' });
      const page = await ctx.newPage();
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
      await page.goto(pathToFileURL(file).href, { waitUntil: 'load' });
      await page.waitForTimeout(900);
      for (const pct of mode === 'motion' ? [0, 25, 33, 50, 67, 75, 100] : [0, 50, 100]) {
        if (mode !== 'no-js') await page.evaluate((p) => window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * p / 100), pct);
        else if (pct) continue;
        await page.waitForTimeout(mode === 'motion' ? 1200 : 300);
        const key = `${id} ${vw}x${height} ${mode} ${pct}`;
        await page.screenshot({ path: join(out, `${id}-${vw}-${mode}-${pct}.png`) });
        // page.evaluate still works with page scripts turned off.
        report[key] = { ...(await page.evaluate(read)), errors: [...errors] };
        const r = report[key];
        console.log(`${key}: texts=[${r.texts.map((t) => t.t + (t.cut ? '(CUT)' : '')).join(' | ')}] overlap=${r.overlaps} sideways=${r.sideways} errors=${r.errors.length}`);
      }
      await ctx.close();
    }
  }
}

// One contact sheet per page: rows are viewports, columns are scroll positions.
for (const id of IDS) {
  if (!existsSync(join(SP, 'built', id, 'index.html'))) continue;
  const cols = [0, 25, 50, 75, 100];
  const row = (w, width) => `<div style="display:flex;gap:6px;margin:6px">${cols.map((p) => `<figure style="margin:0"><img width="${width}" src="${id}-${w}-motion-${p}.png"><figcaption>${w}: ${p}%</figcaption></figure>`).join('')}</div>`;
  writeFileSync(join(out, `${id}.html`), `<meta charset="utf-8"><body style="font:12px sans-serif;background:#888">${row(1440, 330)}${row(360, 190)}</body>`);
  const page = await browser.newPage({ viewport: { width: 1710, height: 620 } });
  await page.goto(pathToFileURL(join(out, `${id}.html`)).href);
  await page.screenshot({ path: join(out, `${id}-sheet.png`), fullPage: true });
  await page.close();
}
writeFileSync(join(out, 'report.json'), JSON.stringify(report, null, 2));
await browser.close();
