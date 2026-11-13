/**
 * Tests for src/factory/evals.mjs.
 * @governed-by PO_ARCHITECT
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { runEvals } from '../src/factory/evals.mjs';

test('runEvals scores contains, notContains, maxLines, fileExists', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'evals-'));
  try {
    await fs.mkdir(path.join(dir, 'evals'));
    const cases = [
      { id: 'good', prompt: 'good', expect: [
        { type: 'contains', value: 'hello' }, { type: 'notContains', value: 'bad' },
        { type: 'maxLines', value: 2 }, { type: 'fileExists', value: 'out.md' }] },
      { id: 'c', prompt: 'bad', expect: [{ type: 'contains', value: 'hello' }] },
      { id: 'n', prompt: 'bad', expect: [{ type: 'notContains', value: 'bad' }] },
      { id: 'm', prompt: 'bad', expect: [{ type: 'maxLines', value: 2 }] },
      { id: 'f', prompt: 'bad', expect: [{ type: 'fileExists', value: 'out.md' }] },
    ];
    await fs.writeFile(path.join(dir, 'evals', 'cases.json'), JSON.stringify(cases));
    const produce = (p) => p === 'good'
      ? { text: 'hello\nworld', files: ['out.md'] }
      : { text: 'bad\n1\n2', files: [] };
    const r = runEvals(dir, produce);
    assert.equal(r.passed, 1);
    assert.equal(r.failed, 4);
    const byId = Object.fromEntries(r.results.map((x) => [x.id, x]));
    assert.equal(byId.good.ok, true);
    assert.deepEqual(byId.good.failures, []);
    for (const id of ['c', 'n', 'm', 'f']) {
      assert.equal(byId[id].ok, false, id);
      assert.ok(byId[id].failures.length >= 1, id);
    }
  } finally { await fs.rm(dir, { recursive: true, force: true }); }
});
