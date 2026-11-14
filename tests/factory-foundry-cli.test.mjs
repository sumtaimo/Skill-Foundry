/**
 * skill-foundry CLI: add, add --role, check, update keeps the user's edits, harness hookup, factory skills refused.
 * @governed-by PO_ARCHITECT
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, cpSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { addSkill, checkProject, catalog, main } from '../src/factory/foundry.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));

test('npx entry point is declared and runnable', () => {
  assert.equal(pkg.bin['skill-foundry'], 'src/factory/foundry.mjs');
  assert.match(readFileSync(join(ROOT, pkg.bin['skill-foundry']), 'utf8'), /^#!\/usr\/bin\/env node/);
});

test('add --role installs every portable skill for that role and registers it in the harness', () => {
  const p = mkdtempSync(join(tmpdir(), 'sf-cli-')); mkdirSync(join(p, '.harness', 'skills'), { recursive: true });
  const out = []; const cwd = process.cwd(); process.chdir(p);
  try { assert.equal(main(['add', '--role', 'QA_AUDITOR'], (l) => out.push(l)), 0); } finally { process.chdir(cwd); }
  const want = catalog().filter((s) => s.scope !== 'factory' && s.roles.includes('QA_AUDITOR')).map((s) => s.name);
  assert.ok(want.length > 0);
  for (const n of want) {
    assert.ok(existsSync(join(p, '.claude', 'skills', n, 'SKILL.md')), n);
    const h = readFileSync(join(p, '.harness', 'skills', n, 'SKILL.md'), 'utf8');
    assert.match(h, /roles: \[.*"QA_AUDITOR".*\]/);
  }
  const q = mkdtempSync(join(tmpdir(), 'sf-one-')); process.chdir(q);
  try { main(['add', 'copy-tight'], () => {}); } finally { process.chdir(cwd); }
  assert.ok(existsSync(join(q, '.claude', 'skills', 'copy-tight', '.foundry.json')), 'add <name> installs that skill');
  assert.throws(() => addSkill('skill-smith', { project: p }), /only works inside/);
});

test('update brings new content and keeps files the user changed', () => {
  const root = mkdtempSync(join(tmpdir(), 'sf-src-'));
  mkdirSync(join(root, 'src', 'factory'), { recursive: true });
  cpSync(join(ROOT, 'src', 'skills', 'test-planner'), join(root, 'src', 'skills', 'test-planner'), { recursive: true });
  writeFileSync(join(root, 'src', 'factory', 'registry.json'), JSON.stringify([{ name: 'test-planner', version: '1.0.0', status: 'ready', roles: ['QA_AUDITOR'] }]));
  const p = mkdtempSync(join(tmpdir(), 'sf-prj-'));
  assert.equal(addSkill('test-planner', { project: p, root }).action, 'added');
  assert.equal(addSkill('test-planner', { project: p, root }).action, 'current');
  const mine = join(p, '.claude', 'skills', 'test-planner', 'RULES.json');
  writeFileSync(mine, '[]');
  writeFileSync(join(root, 'src', 'skills', 'test-planner', 'layers', '01-intent.md'), 'new upstream text\n');
  assert.deepEqual(checkProject({ project: p, root }).map((x) => x.current), [false]);
  const r = addSkill('test-planner', { project: p, root });
  assert.equal(r.action, 'updated');
  assert.deepEqual(r.kept, ['RULES.json']);
  assert.equal(readFileSync(mine, 'utf8'), '[]', 'user edit kept');
  assert.equal(readFileSync(join(p, '.claude', 'skills', 'test-planner', 'layers', '01-intent.md'), 'utf8'), 'new upstream text\n');
  assert.deepEqual(checkProject({ project: p, root }).map((x) => x.current), [true]);
  mkdirSync(join(p, '.claude', 'skills', 'mine'), { recursive: true });
  assert.equal(checkProject({ project: p, root }).length, 1, 'the user\'s own skills are not touched');
});

test('the site shows the npx command on the landing and every skill page', async () => {
  const { buildSite } = await import('../src/site/build.mjs');
  const out = mkdtempSync(join(tmpdir(), 'sf-npx-'));
  await buildSite({ root: ROOT, out });
  assert.match(readFileSync(join(out, 'index.html'), 'utf8'), /npx github:sumtaimo\/Skill-Foundry add --role QA_AUDITOR/);
  for (const s of catalog().filter((x) => x.scope !== 'factory')) {
    assert.match(readFileSync(join(out, 'skills', s.name, 'index.html'), 'utf8'), new RegExp(`npx github:sumtaimo/Skill-Foundry add ${s.name}<`));
  }
});
