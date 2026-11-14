/**
 * Site link tests: internal refs resolve, no external scripts, colours only in tokens.
 * @governed-by PO_ARCHITECT
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { buildSite } from '../src/site/build.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function htmlFiles(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...htmlFiles(p));
    else if (p.endsWith('.html')) out.push(p);
  }
  return out.sort();
}

let outDir;
async function out() {
  if (!outDir) {
    outDir = mkdtempSync(join(tmpdir(), 'sf-links-'));
    await buildSite({ root: ROOT, out: outDir });
  }
  return outDir;
}

test('internal href and src resolve to files', async () => {
  const o = await out();
  for (const page of htmlFiles(o)) {
    const html = readFileSync(page, 'utf8');
    for (const m of html.matchAll(/\s(?:href|src)="([^"]*)"/g)) {
      const u = m[1];
      if (!u || /^(https?:|mailto:|#|\/\/|data:)/i.test(u)) continue;
      const clean = decodeURIComponent(u.split(/[?#]/)[0]);
      if (!clean) continue;
      let target = resolve(dirname(page), clean);
      if (clean.endsWith('/')) target = join(target, 'index.html');
      else if (existsSync(target) && statSync(target).isDirectory()) target = join(target, 'index.html');
      assert.ok(existsSync(target), `${relative(o, page)}: ${u}`);
    }
  }
});

test('no external script src', async () => {
  const o = await out();
  for (const page of htmlFiles(o)) {
    const html = readFileSync(page, 'utf8');
    assert.ok(!/<script[^>]*\ssrc=["']?(https?:|\/\/)/i.test(html), relative(o, page));
  }
});

test('site.css colours only inside token blocks', async () => {
  const o = await out();
  let css = readFileSync(join(o, 'assets/site.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  // strip a balanced block starting at index i ('{' position) and return end index
  const blockEnd = (s, i) => { let d = 0; for (let j = i; j < s.length; j++) { if (s[j] === '{') d++; else if (s[j] === '}' && --d === 0) return j + 1; } return s.length; };
  const strip = (re) => {
    let m;
    while ((m = re.exec(css))) {
      const open = css.indexOf('{', m.index);
      css = css.slice(0, m.index) + css.slice(blockEnd(css, open));
      re.lastIndex = 0;
    }
  };
  strip(/@media\s*\(\s*prefers-color-scheme:\s*dark\s*\)\s*\{\s*:root:not\(\[data-theme=["']?light["']?\]\)/g);
  strip(/(^|\})\s*:root\s*\{/g);
  strip(/\[data-theme=["']?dark["']?\]\s*\{/g);
  assert.ok(!/#[0-9a-f]{3,8}\b/i.test(css), 'hex colour outside tokens');
  assert.ok(!/\brgba?\(/i.test(css), 'rgb( outside tokens');
  assert.ok(!/\bhsla?\(/i.test(css), 'hsl( outside tokens');
});
