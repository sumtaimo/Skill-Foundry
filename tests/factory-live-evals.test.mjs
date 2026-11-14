/**
 * Gate: every ready skill must have a real-agent recording for each eval case, and all must pass.
 * A skill whose evals only pass on hand-written answers is not shippable.
 * @governed-by PO_ARCHITECT
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scoreLive, agentPrompt } from '../src/factory/live-evals.mjs';
import { loadLocks } from '../src/factory/skill-guard.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const registry = JSON.parse(readFileSync(path.join(ROOT, 'src', 'factory', 'registry.json'), 'utf8'));

const locks = loadLocks(ROOT);
for (const r of registry.filter((x) => x.status === 'ready')) {
  if (locks[r.name]) { test(`live evals: ${r.name} is locked (owner: ${locks[r.name].owner}); skipped here`, { skip: 'locked skill' }, () => {}); continue; }
  test(`live evals: ${r.name} passes on real agent recordings`, () => {
    const s = scoreLive(path.join(ROOT, 'src', 'skills', r.name));
    assert.deepEqual(s.missing, [], `missing live recordings: ${s.missing.join(', ')} (run: node src/factory/live-evals.mjs ${r.name} --run)`);
    assert.equal(s.failed, 0, JSON.stringify(s.results.filter((x) => !x.ok)));
  });
}

function fixture(recPrompt) {
  const dir = mkdtempSync(path.join(tmpdir(), 'live-'));
  mkdirSync(path.join(dir, 'evals', 'live'), { recursive: true });
  writeFileSync(path.join(dir, 'evals', 'cases.json'), JSON.stringify([{ id: 'a', prompt: 'p1', expect: [{ type: 'contains', value: 'ok' }] }]));
  if (recPrompt) writeFileSync(path.join(dir, 'evals', 'live', 'a.json'), JSON.stringify({ prompt: recPrompt, output: 'ok' }));
  return dir;
}

test('scoreLive fails a case with no recording', () => {
  const s = scoreLive(fixture(null));
  assert.deepEqual(s.missing, ['a']);
  assert.equal(s.failed, 1);
});

test('scoreLive fails a stale recording whose prompt no longer matches', () => {
  const s = scoreLive(fixture('old prompt'));
  assert.deepEqual(s.stale, ['a']);
  assert.equal(s.failed, 1);
});

test('scoreLive passes a fresh matching recording', () => {
  assert.equal(scoreLive(fixture('p1')).failed, 0);
});

test('agentPrompt gives the agent only the skill path and the request', () => {
  const p = agentPrompt('/x/skill', 'do it');
  assert.match(p, /\/x\/skill/);
  assert.match(p, /User request: do it/);
});
