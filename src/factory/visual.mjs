/**
 * Optional visual check of an HTML page with playwright (if installed).
 * @governed-by PO_ARCHITECT
 */
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

export const SKIP_REASON = 'playwright not installed';

/**
 * @param {string} fileOrUrl
 * @param {{widths?:number[],themes?:string[],reducedMotion?:boolean}} [opts]
 */
export async function checkPage(fileOrUrl, { widths = [1440, 390], themes = ['light', 'dark'], reducedMotion = true } = {}) {
  if (typeof fileOrUrl !== 'string' || !fileOrUrl) throw new TypeError('checkPage: fileOrUrl required');
  let pw;
  try {
    const mod = 'playwright';
    pw = await import(mod);
  } catch {
    return { ok: null, skipped: SKIP_REASON };
  }
  const chromium = pw.chromium ?? pw.default?.chromium;
  const url = /^[a-z]+:\/\//i.test(fileOrUrl) ? fileOrUrl : pathToFileURL(resolve(fileOrUrl)).href;
  const problems = [];
  const browser = await chromium.launch();
  try {
    for (const width of widths) {
      for (const theme of themes) {
        const ctx = await browser.newContext({
          viewport: { width, height: 900 },
          colorScheme: theme,
          reducedMotion: reducedMotion ? 'reduce' : 'no-preference',
        });
        const page = await ctx.newPage();
        page.on('console', (m) => {
          if (m.type() === 'error') problems.push({ width, theme, kind: 'console-error', detail: m.text() });
        });
        page.on('pageerror', (e) => problems.push({ width, theme, kind: 'console-error', detail: String(e?.message ?? e) }));
        await page.goto(url, { waitUntil: 'load' });
        const res = await page.evaluate(() => {
          const d = document.documentElement;
          const scroll = d.scrollWidth > d.clientWidth ? `${d.scrollWidth} > ${d.clientWidth}` : null;
          const outside = [];
          for (const svg of document.querySelectorAll('svg')) {
            const vb = svg.viewBox && svg.viewBox.baseVal;
            if (!vb || !vb.width) continue;
            for (const t of svg.querySelectorAll('text')) {
              const b = t.getBBox();
              if (b.x < vb.x || b.y < vb.y || b.x + b.width > vb.x + vb.width || b.y + b.height > vb.y + vb.height) {
                outside.push((t.textContent || '').trim().slice(0, 60));
              }
            }
          }
          return { scroll, outside };
        });
        if (res.scroll) problems.push({ width, theme, kind: 'horizontal-scroll', detail: res.scroll });
        for (const t of res.outside) problems.push({ width, theme, kind: 'text-outside-svg', detail: t });
        await ctx.close();
      }
    }
  } finally {
    await browser.close();
  }
  return { ok: problems.length === 0, problems };
}
