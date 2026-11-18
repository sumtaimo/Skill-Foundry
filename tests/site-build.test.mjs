/**
 * Site build tests: pages for ready skills only, verified downloads, determinism.
 * @governed-by PO_ARCHITECT
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, existsSync, cpSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { buildSite } from '../src/site/build.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tmp = (p) => mkdtempSync(join(tmpdir(), `sf-${p}-`));
const sha = (f) => createHash('sha256').update(readFileSync(f)).digest('hex');
const registry = JSON.parse(readFileSync(join(ROOT, 'src/factory/registry.json'), 'utf8'));

function htmlFiles(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...htmlFiles(p));
    else if (p.endsWith('.html')) out.push(p);
  }
  return out.sort();
}

test('every ready skill has a page', async () => {
  const out = tmp('build');
  const res = await buildSite({ root: ROOT, out });
  assert.ok(Array.isArray(res.pages));
  for (const s of registry.filter((s) => s.status === 'ready')) {
    assert.ok(existsSync(join(out, 'skills', s.name, 'index.html')), s.name);
  }
  assert.ok(existsSync(join(out, 'index.html')));
});

test('draft skills get no page', async () => {
  const root = tmp('root');
  cpSync(join(ROOT, 'src'), join(root, 'src'), { recursive: true });
  const name = 'zz-draft-skill';
  cpSync(join(ROOT, 'src/skills/skill-smith'), join(root, 'src/skills', name), { recursive: true });
  const reg = [...registry, { name, version: '0.1.0', purpose: 'Draft test skill.', status: 'draft' }];
  writeFileSync(join(root, 'src/factory/registry.json'), JSON.stringify(reg, null, 2));
  const out = tmp('draft');
  await buildSite({ root, out });
  assert.equal(existsSync(join(out, 'skills', name)), false);
  for (const f of htmlFiles(out)) assert.ok(!readFileSync(f, 'utf8').includes(`skills/${name}/`), f);
  const sums = JSON.parse(readFileSync(join(out, 'downloads', 'checksums.json'), 'utf8'));
  assert.equal(Object.keys(sums).some((k) => k.startsWith(`${name}-`)), false, 'draft skill gets no download zip');
});

test('download links exist and data-sha256 matches checksums and file', async () => {
  const out = tmp('dl');
  await buildSite({ root: ROOT, out });
  const sums = JSON.parse(readFileSync(join(out, 'downloads/checksums.json'), 'utf8'));
  let seen = 0;
  for (const page of htmlFiles(out)) {
    const html = readFileSync(page, 'utf8');
    for (const m of html.matchAll(/href="([^"]*downloads\/([^"#?]+))"/g)) {
      const target = resolve(dirname(page), m[1]);
      assert.ok(existsSync(target), `${relative(out, page)} -> ${m[1]}`);
      const file = m[2];
      if (file === 'checksums.json') continue;
      assert.ok(sums[file], `checksum entry for ${file}`);
      assert.equal(sha(target), sums[file].sha256, file);
      seen++;
    }
    if (/^skills\/[^/]+\/index\.html$/.test(relative(out, page).replace(/\\/g, '/'))) {
      const vals = [...html.matchAll(/data-sha256="([0-9a-f]{64})"/g)].map((m) => m[1]);
      assert.ok(vals.length > 0, `data-sha256 on ${relative(out, page)}`);
      const known = Object.values(sums).map((v) => v.sha256);
      for (const v of vals) assert.ok(known.includes(v), v);
    }
    for (const m of html.matchAll(/data-sha256="([0-9a-f]{64})"[^>]*>/g)) {
      assert.ok(Object.values(sums).some((v) => v.sha256 === m[1]));
    }
  }
  assert.ok(seen > 0, 'at least one download link');
});

test('two builds are byte-identical', async () => {
  const a = tmp('a'), b = tmp('b');
  await buildSite({ root: ROOT, out: a });
  await buildSite({ root: ROOT, out: b });
  const fa = htmlFiles(a).map((f) => relative(a, f));
  const fb = htmlFiles(b).map((f) => relative(b, f));
  assert.deepEqual(fa, fb);
  for (const f of fa) assert.ok(readFileSync(join(a, f)).equals(readFileSync(join(b, f))), f);
});
