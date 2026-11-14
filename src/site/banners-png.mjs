#!/usr/bin/env node
/**
 * Turn every built skills/<name>/banner.svg into banner.png (1280×640) for link previews, which need a PNG.
 *   node src/site/banners-png.mjs <site-dir>
 * Needs Playwright (a dev dependency); run in the Pages workflow after the site build.
 * @governed-by PO_ARCHITECT
 */
import { readdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const dir = resolve(process.argv[2] ?? 'dist/site');
const { chromium } = createRequire(import.meta.url)('playwright');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 640 }, colorScheme: 'light' });
let n = 0;
for (const name of readdirSync(join(dir, 'skills'))) {
  const svg = join(dir, 'skills', name, 'banner.svg');
  if (!existsSync(svg)) continue;
  await page.goto(pathToFileURL(svg).href);
  await page.screenshot({ path: join(dir, 'skills', name, 'banner.png') });
  n++;
}
await browser.close();
console.log(`banners: ${n} PNG written`);
