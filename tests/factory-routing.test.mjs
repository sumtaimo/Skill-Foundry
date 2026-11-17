/**
 * Gate: every ready skill is chosen by a real agent for its own requests, and not for neighbours'.
 * Also covers the CHANGELOG lint check chk-changelog.
 * @governed-by PO_ARCHITECT
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, cpSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scoreRouting, routingPrompt } from '../src/factory/routing-evals.mjs';
import { lintSkill } from '../src/factory/lint-skills.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const registry = JSON.parse(readFileSync(path.join(ROOT, 'src', 'factory', 'registry.json'), 'utf8'));
const cases = JSON.parse(readFileSync(path.join(ROOT, 'src', 'factory', 'routing', 'cases.json'), 'utf8'));

test('routing: the recorded real agent picks the right skill or none for every case', () => {
  const s = scoreRouting();
  assert.equal(s.failed, 0, JSON.stringify(s.results.filter((r) => !r.ok)));
});

test('routing: every ready skill has at least one routing case and the set has none cases', () => {
  for (const r of registry.filter((x) => x.status === 'ready')) {
    assert.ok(cases.some((c) => c.expect === r.name), `no routing case for ${r.name}`);
  }
  assert.ok(cases.some((c) => c.expect === 'none'));
});

test('routing: a wrong answer fails', () => {
  const s = scoreRouting({ cases: [{ id: 'a', prompt: 'x', expect: 'copy-tight' }], live: { answers: { a: 'none' } } });
  assert.equal(s.failed, 1);
});

test('routingPrompt lists skills and numbered requests', () => {
  const p = routingPrompt([{ name: 's', description: 'd' }], [{ prompt: 'q' }]);
  assert.match(p, /- s: d/);
  assert.match(p, /1\. q/);
});

test('lint chk-changelog flags an undated heading', async () => {
  const dir = path.join(mkdtempSync(path.join(tmpdir(), 'cl-')), 'changelog-writer');
  cpSync(path.join(ROOT, 'src', 'skills', 'changelog-writer'), dir, { recursive: true });
  writeFileSync(path.join(dir, 'CHANGELOG.md'), '# Changelog\n\n## 1.0.0\n\n- x\n');
  const problems = await lintSkill(dir, { testsDir: path.join(ROOT, 'tests') });
  assert.ok(problems.some((p) => p.code === 'chk-changelog'));
});

test('routing: recording is not stale (agent saw the current description of every ready skill)', () => {
  const live = JSON.parse(readFileSync(path.join(ROOT, 'src', 'factory', 'routing', 'live.json'), 'utf8'));
  for (const r of registry.filter((x) => x.status === 'ready')) {
    const md = readFileSync(path.join(ROOT, 'src', 'skills', r.name, 'SKILL.md'), 'utf8');
    const desc = /^description:\s*(.*)$/m.exec(md)[1].trim();
    assert.equal(live.descriptions?.[r.name], desc, `routing recording is stale for ${r.name}: re-run routing with the current description`);
  }
});

test('parseRouting reads "<n>: <skill>" lines and readySkills lists the ready skills with their descriptions', async () => {
  const { parseRouting, readySkills, runRouting } = await import('../src/factory/routing-evals.mjs');
  const cases = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
  assert.deepEqual(parseRouting('1: copy-tight\n2. none\n 3: `skill-smith`\nnotes: ignored', cases), { a: 'copy-tight', b: 'none', c: 'skill-smith' });
  const ready = readySkills(ROOT);
  assert.ok(ready.some((s) => s.name === 'figure-craft' && s.description.length > 20));

  const dir = mkdtempSync(path.join(tmpdir(), 'route-'));
  writeFileSync(path.join(dir, 'cases.json'), JSON.stringify([{ id: 'a', prompt: 'x', expect: 'copy-tight' }]));
  writeFileSync(path.join(dir, 'live.json'), JSON.stringify({ answers: { a: 'copy-tight' } }));
  assert.throws(() => runRouting({ dir, spawn: () => ({ status: 0, stdout: "You've hit your 5-hour limit" }) }), /quota limit/);
  assert.throws(() => runRouting({ dir, spawn: () => ({ status: 0, stdout: 'unparseable error' }) }), /no "<n>: <skill>"/);
  assert.equal(JSON.parse(readFileSync(path.join(dir, 'live.json'), 'utf8')).answers.a, 'copy-tight');
  const saved = runRouting({ dir, spawn: () => ({ status: 0, stdout: '1: copy-tight' }) });
  assert.deepEqual(saved.answers, { a: 'copy-tight' });
});
