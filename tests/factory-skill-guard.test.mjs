/**
 * Skill guard: one skill per session and locked skills stay untouched.
 * @governed-by PO_ARCHITECT
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkGuard, skillsTouched, loadLocks } from '../src/factory/skill-guard.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const locks = { 'figure-craft': { owner: 'other', reason: 'wip' } };

test('skillsTouched maps src and docs skill paths, ignores the template and other files', () => {
  assert.deepEqual(skillsTouched(['src/skills/a/SKILL.md', 'docs/skills/a/X.md', 'src/skills/_template/x', 'src/site/build.mjs']), ['a']);
});

test('one skill passes; two skills warn', () => {
  assert.equal(checkGuard(['src/skills/copy-tight/SKILL.md'], {}).ok, true);
  const r = checkGuard(['src/skills/copy-tight/SKILL.md', 'src/skills/skill-smith/SKILL.md'], {});
  assert.equal(r.ok, false);
  assert.match(r.problems[0], /one skill per session/);
});

test('a locked skill warns unless the owner unlocks it', () => {
  assert.equal(checkGuard(['src/skills/figure-craft/SKILL.md'], locks).ok, false);
  assert.equal(checkGuard(['src/skills/figure-craft/SKILL.md'], locks, { owner: 'figure-craft' }).ok, true);
});

test('site and factory changes are not skill changes', () => {
  assert.equal(checkGuard(['src/site/lib/render.mjs', 'src/factory/registry.json'], locks).ok, true);
});

test('locks.json is valid and every lock names an owner and reason', () => {
  for (const [name, l] of Object.entries(loadLocks(ROOT))) {
    assert.ok(l.owner && l.reason, `lock ${name} needs owner and reason`);
  }
});

test('live evals are not demanded from a locked skill (its owner records them)', () => {
  const src = readFileSync(path.join(ROOT, 'tests', 'factory-live-evals.test.mjs'), 'utf8');
  assert.match(src, /locks/);
});
