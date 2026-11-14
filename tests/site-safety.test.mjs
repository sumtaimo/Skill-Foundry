/**
 * Safety tests: SVG sanitising and sandboxed example iframes.
 * @governed-by PO_ARCHITECT
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, cpSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { sanitizeSvg } from '../src/site/lib/svg.mjs';
import { buildSite } from '../src/site/build.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('sanitizeSvg accepts safe svg', () => {
  const r = sanitizeSvg('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10"/></svg>');
  assert.equal(typeof r, 'string');
});

test('sanitizeSvg rejects unsafe svg', () => {
  const bad = [
    '<svg><script>alert(1)</script></svg>',
    '<svg><foreignObject><div/></foreignObject></svg>',
    '<svg onload="alert(1)"></svg>',
    '<svg><a href="http://evil.example/">x</a></svg>',
    '<svg><use xlink:href="//evil.example/x.svg#a"/></svg>',
  ];
  for (const s of bad) assert.throws(() => sanitizeSvg(s), Error, s);
});

function htmlFiles(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...htmlFiles(p));
    else if (p.endsWith('.html')) out.push(p);
  }
  return out;
}

test('example iframes are sandboxed with allow-scripts only', async () => {
  const root = mkdtempSync(join(tmpdir(), 'sf-safe-root-'));
  cpSync(join(ROOT, 'src'), join(root, 'src'), { recursive: true });
  const name = 'zz-example-skill';
  const dir = join(root, 'src/skills', name);
  cpSync(join(ROOT, 'src/skills/skill-smith'), dir, { recursive: true });
  mkdirSync(join(dir, 'preview'), { recursive: true });
  writeFileSync(join(dir, 'preview/example.html'), '<!doctype html><title>x</title><p>example</p>');
  const reg = JSON.parse(readFileSync(join(root, 'src/factory/registry.json'), 'utf8'));
  reg.push({ name, version: '0.1.0', purpose: 'Example test skill.', status: 'ready' });
  writeFileSync(join(root, 'src/factory/registry.json'), JSON.stringify(reg, null, 2));
  const out = mkdtempSync(join(tmpdir(), 'sf-safe-out-'));
  await buildSite({ root, out });
  let count = 0;
  for (const f of htmlFiles(out)) {
    for (const m of readFileSync(f, 'utf8').matchAll(/<iframe\b[^>]*>/gi)) {
      count++;
      const sb = m[0].match(/\ssandbox="([^"]*)"/i);
      assert.ok(sb, `sandbox missing: ${m[0]}`);
      assert.equal(sb[1], 'allow-scripts');
      assert.ok(!/allow-same-origin/i.test(m[0]));
    }
  }
  assert.ok(count > 0, 'expected an example iframe');
});
