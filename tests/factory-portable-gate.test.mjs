/**
 * Gate: every ready skill that is not `scope: factory` needs a passing portable-check recording that matches the skill as it is now.
 * Skills listed under "portable-pending" in src/factory/migration.json are exempt until their owner session records one.
 * @governed-by PO_ARCHITECT
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, mkdtempSync, mkdirSync, writeFileSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkRecording, behaviourHash } from '../src/factory/portable-check.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const registry = JSON.parse(readFileSync(join(ROOT, 'src', 'factory', 'registry.json'), 'utf8'));
const migration = existsSync(join(ROOT, 'src', 'factory', 'migration.json')) ? JSON.parse(readFileSync(join(ROOT, 'src', 'factory', 'migration.json'), 'utf8')) : {};
const pending = migration['portable-pending']?.skills ?? [];
const locks = existsSync(join(ROOT, 'src', 'factory', 'locks.json')) ? JSON.parse(readFileSync(join(ROOT, 'src', 'factory', 'locks.json'), 'utf8')) : {};

for (const r of registry.filter((x) => x.status === 'ready')) {
  const dir = join(ROOT, 'src', 'skills', r.name);
  const factory = /^scope:\s*factory\s*$/m.test(readFileSync(join(dir, 'SKILL.md'), 'utf8'));
  if (factory) { test(`portable check: ${r.name} is scope factory; not applicable`, { skip: 'scope: factory' }, () => {}); continue; }
  if (pending.includes(r.name)) { test(`portable check: ${r.name} is pending (src/factory/migration.json)`, { skip: 'portable-pending' }, () => {}); continue; }
  if (locks[r.name]) { test(`portable check: ${r.name} is locked`, { skip: 'locked skill' }, () => {}); continue; }
  test(`portable check: ${r.name} has a passing recording that matches the skill`, () => {
    const c = checkRecording(dir);
    assert.deepEqual(c.problems, [], `${r.name}: ${c.problems.join('; ')}`);
  });
}

function skillCopy() {
  const d = mkdtempSync(join(tmpdir(), 'pg-'));
  const s = join(d, 'demo'); mkdirSync(join(s, 'evals'), { recursive: true });
  writeFileSync(join(s, 'SKILL.md'), '---\nname: demo\n---\n# demo\n');
  return s;
}
const good = (s) => ({ prompt: 'p', answer: 'a', exit: 0, usedSkill: true, leakedRepoRules: false, touchedRepo: [], skillSha: behaviourHash(s) });

test('checkRecording: missing, failing and stale recordings are reported', () => {
  const s = skillCopy();
  assert.match(checkRecording(s).problems[0], /no portable-check recording/);
  writeFileSync(join(s, 'evals', 'portable.json'), JSON.stringify(good(s)));
  assert.deepEqual(checkRecording(s), { ok: true, problems: [] });
  writeFileSync(join(s, 'evals', 'portable.json'), JSON.stringify({ ...good(s), usedSkill: false, leakedRepoRules: true, touchedRepo: ['Read'] }));
  assert.equal(checkRecording(s).problems.length, 3);
  writeFileSync(join(s, 'evals', 'portable.json'), JSON.stringify(good(s)));
  writeFileSync(join(s, 'SKILL.md'), '---\nname: demo\n---\n# changed\n');
  assert.match(checkRecording(s).problems.join(), /stale/);
});

test('behaviourHash ignores recordings, the changelog, previews and examples but not instructions', () => {
  const s = skillCopy();
  const h = behaviourHash(s);
  mkdirSync(join(s, 'evals', 'live'), { recursive: true }); mkdirSync(join(s, 'preview')); mkdirSync(join(s, 'examples'));
  writeFileSync(join(s, 'evals', 'live', 'a.json'), '{}'); writeFileSync(join(s, 'CHANGELOG.md'), 'x'); writeFileSync(join(s, 'preview', 'c.svg'), '<svg/>'); writeFileSync(join(s, 'examples', 'README.md'), 'x');
  assert.equal(behaviourHash(s), h);
  mkdirSync(join(s, 'layers')); writeFileSync(join(s, 'layers', '01.md'), '1. x');
  assert.notEqual(behaviourHash(s), h);
});
