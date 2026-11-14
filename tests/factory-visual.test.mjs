/**
 * Tests for src/factory/visual.mjs.
 * @governed-by PO_ARCHITECT
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { checkPage, SKIP_REASON } from '../src/factory/visual.mjs';

test('checkPage detects horizontal-scroll or skips', async (t) => {
  assert.equal(SKIP_REASON, 'playwright not installed');
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'visual-'));
  try {
    const ok = path.join(dir, 'ok.html');
    const wide = path.join(dir, 'wide.html');
    await fs.writeFile(ok, '<!doctype html><html><body><p>Hello</p></body></html>');
    await fs.writeFile(wide, '<!doctype html><html><body><div style="width:3000px;height:10px"></div></body></html>');
    const r = await checkPage(ok);
    if (r.skipped === SKIP_REASON) {
      assert.equal(r.ok, null);
      t.skip(SKIP_REASON);
      return;
    }
    assert.deepEqual(r.problems, []);
    assert.equal(r.ok, true);
    const w = await checkPage(wide);
    assert.equal(w.ok, false);
    assert.ok(w.problems.some((p) => p.kind === 'horizontal-scroll'));
  } finally { await fs.rm(dir, { recursive: true, force: true }); }
});
