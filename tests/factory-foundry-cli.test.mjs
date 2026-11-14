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
    assert.match(h, /autoApply: true/, 'the harness only injects a skill that is autoApply or keyword-matched');
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

test('the harness really injects an installed skill into a worker of the matching role', async () => {
  const { matchSkills } = await import('../.harness/lib/governance.mjs');
  const p = mkdtempSync(join(tmpdir(), 'sf-inj-')); mkdirSync(join(p, '.harness', 'skills'), { recursive: true });
  addSkill('test-planner', { project: p });
  const raw = readFileSync(join(p, '.harness', 'skills', 'test-planner', 'SKILL.md'), 'utf8');
  const meta = (k) => new RegExp(`^${k}: (.*)$`, 'm').exec(raw)[1];
  const skill = { name: 'test-planner', roles: JSON.parse(meta('roles')), keywords: JSON.parse(meta('keywords')), autoApply: meta('autoApply') === 'true' };
  assert.deepEqual(matchSkills({ prompt: 'unrelated task' }, 'QA_AUDITOR', { 'test-planner': skill }).chosen.map((x) => x.name), ['test-planner']);
  assert.equal(matchSkills({ prompt: 'x' }, 'DEV_ENGINEER', { 'test-planner': skill }).chosen.length, 0, 'other roles do not get it');
});

test('--rules writes one managed block in AGENTS.md, keeps the user text, and refreshes in place', async () => {
  const { writeRules } = await import('../src/factory/foundry.mjs');
  const p = mkdtempSync(join(tmpdir(), 'sf-rules-'));
  writeFileSync(join(p, 'AGENTS.md'), '# My project\n\nMy own rule.\n');
  addSkill('test-planner', { project: p });
  writeRules({ project: p });
  addSkill('copy-tight', { project: p });
  writeRules({ project: p });
  const md = readFileSync(join(p, 'AGENTS.md'), 'utf8');
  assert.ok(md.startsWith('# My project\n\nMy own rule.\n'), 'user text kept');
  assert.equal(md.match(/skill-foundry:begin/g).length, 1, 'one block, refreshed in place');
  assert.match(md, /\*\*test-planner\*\*/); assert.match(md, /\*\*copy-tight\*\*/);
});

test('recordings of our own evals are not installed into users\' projects', () => {
  const p = mkdtempSync(join(tmpdir(), 'sf-noeval-'));
  addSkill('copy-tight', { project: p });
  const d = join(p, '.claude', 'skills', 'copy-tight');
  assert.ok(existsSync(join(d, 'SKILL.md')) && existsSync(join(d, 'evals', 'cases.json')), 'the skill itself and its cases are installed');
  assert.ok(!existsSync(join(d, 'evals', 'portable.json')), 'portable.json (an answer) must not be installed');
  assert.ok(!existsSync(join(d, 'evals', 'live')), 'live recordings must not be installed');
  assert.equal(checkProject({ project: p }).every((x) => x.current), true, 'check still sees it as current');
});

test('by default add lists the skills in AGENTS.md and denies agents edit rights on installed skills', async () => {
  const { protectSkills, DENY } = await import('../src/factory/foundry.mjs');
  const p = mkdtempSync(join(tmpdir(), 'sf-prot-'));
  mkdirSync(join(p, '.claude'), { recursive: true });
  writeFileSync(join(p, '.claude', 'settings.json'), JSON.stringify({ model: 'x', permissions: { allow: ['Bash(ls:*)'], deny: ['Read(.env)'] } }));
  const cwd = process.cwd(); process.chdir(p);
  try { main(['add', 'copy-tight'], () => {}); main(['update'], () => {}); } finally { process.chdir(cwd); }
  const cfg = JSON.parse(readFileSync(join(p, '.claude', 'settings.json'), 'utf8'));
  assert.equal(cfg.model, 'x'); assert.deepEqual(cfg.permissions.allow, ['Bash(ls:*)']);
  assert.deepEqual(cfg.permissions.deny, ['Read(.env)', ...DENY], 'user rules kept, ours added once');
  assert.ok(DENY.some((d) => d.startsWith('Edit(.claude/skills')) && DENY.some((d) => d.startsWith('Write(.claude/skills')));
  const md = readFileSync(join(p, 'AGENTS.md'), 'utf8');
  assert.match(md, /Never edit, delete or overwrite anything under/);
  assert.deepEqual(protectSkills({ project: p }).added, [], 'idempotent');
  const q = mkdtempSync(join(tmpdir(), 'sf-optout-')); process.chdir(q);
  try { main(['add', 'copy-tight', '--no-rules', '--no-protect'], () => {}); } finally { process.chdir(cwd); }
  assert.ok(!existsSync(join(q, 'AGENTS.md')) && !existsSync(join(q, '.claude', 'settings.json')), 'opt-out writes neither');
  const bad = mkdtempSync(join(tmpdir(), 'sf-badjson-')); mkdirSync(join(bad, '.claude'));
  writeFileSync(join(bad, '.claude', 'settings.json'), '{ not json');
  assert.match(protectSkills({ project: bad }).skipped, /left untouched/);
  assert.equal(readFileSync(join(bad, '.claude', 'settings.json'), 'utf8'), '{ not json');
});

test('add --all, check reports local edits, remove cleans up only what we installed', () => {
  const p = mkdtempSync(join(tmpdir(), 'sf-all-')); mkdirSync(join(p, '.harness', 'skills'), { recursive: true });
  mkdirSync(join(p, '.claude', 'skills', 'mine'), { recursive: true }); writeFileSync(join(p, '.claude', 'skills', 'mine', 'SKILL.md'), 'mine');
  const cwd = process.cwd(); process.chdir(p); const out = [];
  try {
    main(['add', '--all'], () => {});
    const portable = catalog().filter((s) => s.scope !== 'factory').map((s) => s.name).sort();
    assert.deepEqual(checkProject({ project: p }).map((x) => x.name).sort(), portable);
    writeFileSync(join(p, '.claude', 'skills', 'copy-tight', 'SKILL.md'), 'tampered');
    assert.equal(main(['check'], (l) => out.push(l)), 2);
    assert.ok(out.some((l) => /copy-tight.*CHANGED LOCALLY: SKILL\.md/.test(l)), out.join('\n'));
    main(['remove', 'copy-tight'], () => {});
  } finally { process.chdir(cwd); }
  assert.ok(!existsSync(join(p, '.claude', 'skills', 'copy-tight')) && !existsSync(join(p, '.harness', 'skills', 'copy-tight')));
  assert.doesNotMatch(readFileSync(join(p, 'AGENTS.md'), 'utf8'), /\*\*copy-tight\*\*/);
  assert.equal(readFileSync(join(p, '.claude', 'skills', 'mine', 'SKILL.md'), 'utf8'), 'mine', 'the user skill is untouched');
  assert.throws(() => main(['remove', 'mine'], () => {}), /not installed by skill-foundry/);
});
