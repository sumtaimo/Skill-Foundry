/**
 * Tests for src/factory/portable-check.mjs (pure parts; the agent run itself costs tokens and is not run here).
 * @governed-by PO_ARCHITECT
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseStream, listProduced, portableCheck, REPO_MARKERS } from '../src/factory/portable-check.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ev = (o) => JSON.stringify(o);
const stream = [
  ev({ type: 'assistant', message: { content: [{ type: 'tool_use', name: 'Skill', input: { skill: 'copy-tight' } }] } }),
  ev({ type: 'assistant', message: { content: [{ type: 'tool_use', name: 'Read', input: { file_path: '/p/.claude/skills/copy-tight/layers/01-intent.md' } }] } }),
  ev({ type: 'result', result: 'Your cart is empty.', total_cost_usd: 0.004 }),
].join('\n');

test('parseStream finds the skill use, the answer and the cost', () => {
  const s = parseStream(stream, 'copy-tight');
  assert.equal(s.usedSkill, true);
  assert.equal(s.final, 'Your cart is empty.');
  assert.equal(s.cost, 0.004);
  assert.deepEqual(s.touchedRepo, []);
  assert.equal(parseStream(stream, 'figure-craft').usedSkill, false, 'a different skill was not used');
  assert.equal(parseStream('not json\n\n', 'x').final, '');
});

test('parseStream reports a tool that touched this repository', () => {
  const s = parseStream(ev({ type: 'assistant', message: { content: [{ type: 'tool_use', name: 'Read', input: { file_path: join(ROOT, 'CLAUDE.md') } }] } }), 'x');
  assert.deepEqual(s.touchedRepo, ['Read']);
});

test('repo markers catch answers that carry this repository rules', () => {
  assert.ok(REPO_MARKERS.test('Per lessons.md the version stays'));
  assert.ok(REPO_MARKERS.test('TAIMO asked for this'));
  assert.equal(REPO_MARKERS.test('Your cart is empty.'), false);
});

test('listProduced skips the installed .claude folder', () => {
  const d = mkdtempSync(join(tmpdir(), 'lp-'));
  mkdirSync(join(d, '.claude', 'skills', 'x'), { recursive: true });
  mkdirSync(join(d, 'out'));
  writeFileSync(join(d, '.claude', 'skills', 'x', 'SKILL.md'), 'x');
  writeFileSync(join(d, 'out', 'a.svg'), '<svg/>');
  assert.deepEqual(listProduced(d), ['out/a.svg']);
});

test('portableCheck refuses factory-scope skills, empty prompts and a project inside the repo', async () => {
  await assert.rejects(portableCheck('skill-smith', 'make a skill'), /scope: factory/);
  await assert.rejects(portableCheck('copy-tight', '  '), /prompt required/);
  await assert.rejects(portableCheck('copy-tight', 'shorten this', { out: join(ROOT, 'tmp-portable') }), /outside the repository/);
});
