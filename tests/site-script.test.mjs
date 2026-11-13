/**
 * Regression tests: built site.js must parse, and checkSite must flag a broken script.
 * @governed-by PO_ARCHITECT
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { mkdtemp, readFile, writeFile, cp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildSite, checkSite } from '../src/site/build.mjs';

test('built assets/site.js compiles and checkSite rejects a syntax error', async () => {
  const out = await mkdtemp(join(tmpdir(), 'sf-site-'));
  const broken = await mkdtemp(join(tmpdir(), 'sf-site-broken-'));
  try {
    await buildSite({ out });
    const source = await readFile(join(out, 'assets', 'site.js'), 'utf8');
    assert.doesNotThrow(() => new vm.Script(source, { filename: 'site.js' }));

    await cp(out, broken, { recursive: true });
    await writeFile(join(broken, 'assets', 'site.js'), 'var x = /a|</b>/;\nfunction (\n', 'utf8');
    const res = await checkSite(broken);
    assert.equal(res.ok, false);
    assert.ok(res.problems.some((p) => String(p).includes('site.js syntax error')), JSON.stringify(res.problems));
  } finally {
    await rm(out, { recursive: true, force: true });
    await rm(broken, { recursive: true, force: true });
  }
});
