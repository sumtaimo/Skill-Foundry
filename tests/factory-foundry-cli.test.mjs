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
import { spawnSync } from 'node:child_process';
import { addSkill, checkProject, catalog, main, removeSkill, doctorProject } from '../src/factory/foundry.mjs';

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
  assert.ok(existsSync(join(d, 'SKILL.md')) && existsSync(join(d, 'layers')), 'the skill itself is installed');
  assert.ok(!existsSync(join(d, 'evals')), 'evals (prompts and answers) are lab tests, not shipped');
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
  assert.ok(DENY.some((d) => d.startsWith('Edit(.claude/skills')) && DENY.some((d) => d.startsWith('Edit(.harness/skills')));
  assert.ok(DENY.every((d) => !d.startsWith('Write(')), 'Claude Code reports Write(path) rules as invalid: Edit(path) only');
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

test('a line-ending-only change (git autocrlf on Windows) is not a local edit: check stays clean and update still updates', () => {
  const p = mkdtempSync(join(tmpdir(), 'sf-eol-'));
  addSkill('copy-tight', { project: p });
  const f = join(p, '.claude', 'skills', 'copy-tight', 'SKILL.md');
  const text = readFileSync(f, 'utf8');
  const flipped = text.includes('\r\n') ? text.replace(/\r\n/g, '\n') : text.replace(/\n/g, '\r\n');
  assert.notEqual(flipped, text);
  writeFileSync(f, flipped);
  const st = checkProject({ project: p }).find((x) => x.name === 'copy-tight');
  assert.deepEqual(st.modified, [], 'CRLF and LF are the same content');
  assert.equal(st.current, true);
  writeFileSync(f, flipped + '\nreal edit\n');
  assert.deepEqual(checkProject({ project: p }).find((x) => x.name === 'copy-tight').modified, ['SKILL.md'], 'a real edit is still reported');
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

test('an old install upgrades cleanly: legacy Write(...) deny rules are removed, ours kept once, the user\'s rules untouched', async () => {
  const { protectSkills, LEGACY_DENY, DENY } = await import('../src/factory/foundry.mjs');
  const p = mkdtempSync(join(tmpdir(), 'sf-legacy-')); mkdirSync(join(p, '.claude'), { recursive: true });
  const old = ['Read(.env)', 'Edit(.claude/skills/**)', 'Write(.claude/skills/**)', 'Edit(.harness/skills/**)', 'Write(.harness/skills/**)', 'Bash(npx github:sumtaimo/Skill-Foundry update*)', 'Bash(npx github:sumtaimo/Skill-Foundry add*)'];
  writeFileSync(join(p, '.claude', 'settings.json'), JSON.stringify({ permissions: { allow: ['Bash(ls:*)'], deny: old } }));
  const r = protectSkills({ project: p });
  assert.deepEqual(r.removed, LEGACY_DENY); assert.deepEqual(r.added, []);
  const deny = JSON.parse(readFileSync(join(p, '.claude', 'settings.json'), 'utf8')).permissions.deny;
  assert.deepEqual(deny, ['Read(.env)', ...DENY]);
  assert.deepEqual(protectSkills({ project: p }), { file: '.claude/settings.json', added: [], removed: [] }, 'second run changes nothing');
});

test('the AGENTS.md block teaches lazy loading, file handoff without raw dumps, and the doctor command', async () => {
  const { writeRules } = await import('../src/factory/foundry.mjs');
  const p = mkdtempSync(join(tmpdir(), 'sf-block-')); addSkill('copy-tight', { project: p });
  writeFileSync(join(p, 'AGENTS.md'), '# Mine\n\nkeep me\n');
  writeRules({ project: p }); const first = readFileSync(join(p, 'AGENTS.md'), 'utf8'); writeRules({ project: p });
  const md = readFileSync(join(p, 'AGENTS.md'), 'utf8');
  assert.equal(md, first, 'refresh is idempotent'); assert.ok(md.startsWith('# Mine\n\nkeep me\n'));
  assert.match(md, /Load only the active skill's `SKILL\.md`/); assert.match(md, /Never paste raw file contents/);
  assert.match(md, /"step_completed"/); assert.match(md, /npx github:sumtaimo\/Skill-Foundry doctor/);
  assert.match(md, /Never edit, delete or overwrite anything under/);
  assert.equal(md.match(/skill-foundry:begin/g).length, 1);
});

test('roles: the harness roles are accepted, and so is any role the project defines; an unknown one is refused', () => {
  const p = mkdtempSync(join(tmpdir(), 'sf-roles-')); mkdirSync(join(p, '.harness', 'roles'), { recursive: true });
  writeFileSync(join(p, '.harness', 'roles', 'docs.json'), JSON.stringify({ name: 'DOCS_BOT', allowedTools: ['Read'] }));
  const cwd = process.cwd(); process.chdir(p); const out = [];
  try {
    for (const r of ['UX_DESIGNER', 'REVIEWER', 'SECURITY', 'COORDINATOR', 'DOCS_BOT']) assert.equal(main(['add', '--role', r, '--quiet'], (l) => out.push(l)), 0, r);
    assert.throws(() => main(['add', '--role', 'NOPE'], () => {}), /--role must be one of .*UX_DESIGNER.*DOCS_BOT/);
  } finally { process.chdir(cwd); }
  assert.ok(out.some((l) => /no ready skill is registered for SECURITY yet/.test(l)), 'a valid role without skills is not an error, so installers can call it');
});

test('collision: a project\'s own .harness/skills/<name> is kept with a warning; --sync-harness replaces it and remove brings it back', () => {
  const p = mkdtempSync(join(tmpdir(), 'sf-coll-')); mkdirSync(join(p, '.harness', 'skills', 'spec-writer'), { recursive: true });
  const stub = '---\nname: spec-writer\nroles: ["BA_ANALYST"]\n---\n# stub\n'; const f = join(p, '.harness', 'skills', 'spec-writer', 'SKILL.md');
  writeFileSync(f, stub);
  const cwd = process.cwd(); process.chdir(p); const out = [];
  try {
    main(['add', 'spec-writer', '--quiet'], (l) => out.push(l));
    assert.ok(out.some((l) => /^harness  ! spec-writer: \.harness\/skills\/spec-writer\/SKILL\.md already exists without skill-foundry marker — pointer skipped \(use --sync-harness/.test(l)), out.join('\n'));
    assert.equal(readFileSync(f, 'utf8'), stub, 'kept untouched without the flag');
    main(['update', 'spec-writer', '--sync-harness', '--quiet'], (l) => out.push(l));
    assert.match(readFileSync(f, 'utf8'), /installed-by: skill-foundry/);
    assert.equal(readFileSync(`${f}.orig`, 'utf8'), stub, 'the original is kept');
    main(['remove', 'spec-writer'], () => {});
  } finally { process.chdir(cwd); }
  assert.equal(readFileSync(f, 'utf8'), stub, 'remove restores the project\'s own skill');
  assert.ok(!existsSync(`${f}.orig`));
});

test('pointers: ordinary skills declare no allowedTools; skills with an engine/ folder declare bare Edit, Write, Bash (never a literal Bash(node:*))', () => {
  const p = mkdtempSync(join(tmpdir(), 'sf-ptr-')); mkdirSync(join(p, '.harness', 'skills'), { recursive: true });
  const cwd = process.cwd(); process.chdir(p);
  try { main(['add', '--all', '--quiet'], () => {}); } finally { process.chdir(cwd); }
  for (const s of catalog().filter((x) => x.scope !== 'factory')) {
    const raw = readFileSync(join(p, '.harness', 'skills', s.name, 'SKILL.md'), 'utf8');
    if (existsSync(join(s.dir, 'engine'))) assert.match(raw, /^allowedTools: \["Edit","Write","Bash"\]$/m, s.name);
    else assert.doesNotMatch(raw, /allowedTools/, s.name);
    assert.match(raw, /^---\nschema_version: 1\n/, `${s.name}: pointer starts with schema_version`);
    assert.equal(JSON.parse(readFileSync(join(p, '.claude', 'skills', s.name, '.foundry.json'), 'utf8')).schemaVersion, 1, `${s.name}: stamp schemaVersion`);
    assert.doesNotMatch(raw, /Bash\(node:\*\)/, 'a literal Bash(node:*) would replace the role\'s whole Bash rule set');
  }
  assert.ok(['a11y-audit', 'design-system', 'ui-polish', 'figure-craft'].every((n) => /allowedTools/.test(readFileSync(join(p, '.harness', 'skills', n, 'SKILL.md'), 'utf8'))), 'engine skills found');
});

test('doctor: exit 1 on usage error, 0 when healthy, 2 with findings; --json is machine readable', () => {
  const p = mkdtempSync(join(tmpdir(), 'sf-doc-')); spawnSync('git', ['init', '-q'], { cwd: p });
  const cwd = process.cwd(); process.chdir(p); const out = [];
  try {
    assert.equal(main(['bogus'], () => {}), 1);
    assert.equal(main(['doctor'], () => {}), 2, 'nothing installed is a finding');
    main(['add', 'copy-tight', '--quiet'], () => {});
    assert.equal(main(['doctor'], (l) => out.push(l)), 0, out.join('\n'));
    assert.match(out.join('\n'), /Healthy\./);
    writeFileSync(join(p, '.claude', 'settings.json'), JSON.stringify({ permissions: { deny: ['Write(.claude/skills/**)'] } }));
    const j = []; assert.equal(main(['doctor', '--json'], (l) => j.push(l)), 2);
    const r = JSON.parse(j.join('\n'));
    assert.equal(r.case, 'B'); assert.equal(r.healthy, false);
    const bad = r.items.find((i) => i.level === 'problem'); assert.match(bad.message, /Write\(path\)/); assert.match(bad.fix, /doctor --fix/);
    assert.equal(main(['doctor', '--fix'], () => {}), 0, 'fix repairs what the foundry wrote');
    assert.deepEqual(JSON.parse(readFileSync(join(p, '.claude', 'settings.json'), 'utf8')).permissions.deny, DENY_LIST());
  } finally { process.chdir(cwd); }
});
const DENY_LIST = () => ['Edit(.claude/skills/**)', 'Edit(.harness/skills/**)', 'Bash(npx github:sumtaimo/Skill-Foundry update*)', 'Bash(npx github:sumtaimo/Skill-Foundry add*)'];

test('add and update print a short doctor summary unless --quiet', () => {
  const p = mkdtempSync(join(tmpdir(), 'sf-sum-')); spawnSync('git', ['init', '-q'], { cwd: p });
  const cwd = process.cwd(); process.chdir(p); const a = []; const b = [];
  try { main(['add', 'copy-tight'], (l) => a.push(l)); main(['update', '--quiet'], (l) => b.push(l)); } finally { process.chdir(cwd); }
  assert.ok(a.some((l) => /^doctor   /.test(l)), a.join('\n'));
  assert.ok(!b.some((l) => /^doctor/.test(l)));
});

const STARTER_SPEC_WRITER = `---
name: spec-writer
description: Makes BA specs short, testable and directly usable by DEV and QA.
roles: ["BA_ANALYST"]
allowedTools: ["Read", "Edit", "Write"]
keywords: ["spec", "requirement", "acceptance", "docs", "document"]
autoApply: false
---
# Spec Writer Rules
1. Start with one sentence: what the feature does and for whom.
2. List acceptance criteria as numbered Given / When / Then lines; each must be testable.
3. List edge cases and error states explicitly.
4. Copy the exact names, signatures and formats from the shared interface contract; do not invent new ones.
5. Keep it under one page. No code.
`;

test('Skill Foundry wins over a recognised Agentic-Harness starter copy: replaced without --sync-harness, original kept, idempotent, remove restores', () => {
  for (const [label, text] of [['known content', STARTER_SPEC_WRITER], ['starter marker', `---\nname: spec-writer\nstarter-stub: agentic-harness\n---\nanything\n`], ['CRLF line ends', STARTER_SPEC_WRITER.replace(/\n/g, '\r\n')]]) {
    const p = mkdtempSync(join(tmpdir(), 'sf-starter-'));
    const f = join(p, '.harness', 'skills', 'spec-writer', 'SKILL.md');
    mkdirSync(join(p, '.harness', 'skills', 'spec-writer'), { recursive: true });
    writeFileSync(f, text);
    const r = addSkill('spec-writer', { project: p });
    assert.equal(r.harnessStatus, 'replaced-starter', label);
    assert.match(readFileSync(f, 'utf8'), /installed-by: skill-foundry/, label);
    assert.equal(readFileSync(`${f}.orig`, 'utf8'), text, `${label}: original kept byte for byte`);
    assert.equal(addSkill('spec-writer', { project: p }).harnessStatus, 'written', `${label}: second run keeps our pointer`);
    assert.equal(readFileSync(`${f}.orig`, 'utf8'), text, `${label}: .orig not overwritten`);
    removeSkill('spec-writer', { project: p });
    assert.equal(readFileSync(f, 'utf8'), text, `${label}: remove restores the original`);
    assert.ok(!existsSync(`${f}.orig`));
  }
});

test('an unknown skill with the same name is never replaced without --sync-harness; the name alone proves nothing', () => {
  const p = mkdtempSync(join(tmpdir(), 'sf-custom-'));
  const f = join(p, '.harness', 'skills', 'spec-writer', 'SKILL.md');
  mkdirSync(join(p, '.harness', 'skills', 'spec-writer'), { recursive: true });
  const mine = STARTER_SPEC_WRITER.replace('Keep it under one page.', 'Keep it under two pages.');
  writeFileSync(f, mine);
  const r = addSkill('spec-writer', { project: p });
  assert.equal(r.harnessStatus, 'collision');
  assert.equal(readFileSync(f, 'utf8'), mine, 'your skill is untouched');
  assert.ok(!existsSync(`${f}.orig`));
  assert.equal(addSkill('spec-writer', { project: p, syncHarness: true }).harnessStatus, 'replaced', '--sync-harness still replaces it, keeping the original');
  assert.equal(readFileSync(`${f}.orig`, 'utf8'), mine);
});

test('user-facing text stays short and plain: no layers, evals, deny rules or internal skill mechanics in AGENTS.md, doctor or the add summary', async () => {
  const p = mkdtempSync(join(tmpdir(), 'sf-plain-')); const out = [];
  const cwd = process.cwd(); process.chdir(p);
  try { main(['add', 'copy-tight'], (l) => out.push(l)); main(['doctor'], (l) => out.push(l)); } finally { process.chdir(cwd); }
  const md = readFileSync(join(p, 'AGENTS.md'), 'utf8');
  const bad = /\blayers?\b|\bevals?\b|deny rule|RULES\.json|machine-check|autoApply/i;
  assert.doesNotMatch(md, bad, 'AGENTS.md block');
  assert.doesNotMatch(out.join('\n'), bad, 'add and doctor output');
  assert.match(md, /Never edit, delete or overwrite anything under/, 'the one instruction agents need is kept');
  assert.match(md, /npx github:sumtaimo\/Skill-Foundry doctor/, 'exact fix command kept');
});

test('update --force restores locally edited files when upstream is unchanged, and doctor accepts CRLF AGENTS.md', () => {
  const p = mkdtempSync(join(tmpdir(), 'sf-force-')); spawnSync('git', ['init', '-q'], { cwd: p });
  const cwd = process.cwd(); process.chdir(p);
  try {
    main(['add', 'copy-tight'], () => {});
    const target = join(p, '.claude', 'skills', 'copy-tight', 'SKILL.md');
    const original = readFileSync(target, 'utf8');
    writeFileSync(target, `${original}\n<!-- local edit -->\n`);
    writeFileSync(join(p, 'AGENTS.md'), readFileSync(join(p, 'AGENTS.md'), 'utf8').replace(/\n/g, '\r\n'));
    assert.equal(doctorProject({ project: p }).items.some((i) => i.area === 'AGENTS.md' && i.level === 'warn'), false, 'CRLF AGENTS.md passes doctor');
    main(['update', 'copy-tight', '--force'], () => {});
    assert.equal(readFileSync(target, 'utf8'), original, 'update --force restores locally modified skill files');
  } finally { process.chdir(cwd); }
});

test('Skill Foundry project version is shown by --version, list, doctor and recorded in .foundry.json', () => {
  const vOut = []; const lOut = []; const dOut = [];
  assert.equal(main(['--version'], (l) => vOut.push(l)), 0);
  assert.equal(main(['-v'], (l) => vOut.push(l)), 0);
  assert.deepEqual(vOut, [pkg.version, pkg.version]);
  assert.equal(main(['list'], (l) => lOut.push(l)), 0);
  assert.equal(lOut[0], `Skill Foundry ${pkg.version}`);
  const p = mkdtempSync(join(tmpdir(), 'sf-pv-'));
  const cwd = process.cwd(); process.chdir(p);
  try {
    main(['add', 'copy-tight', '--quiet'], () => {});
    const stamp = JSON.parse(readFileSync(join(p, '.claude', 'skills', 'copy-tight', '.foundry.json'), 'utf8'));
    assert.equal(stamp.foundryVersion, pkg.version);
    assert.equal(checkProject({ project: p })[0].foundryVersion, pkg.version);
    assert.equal(checkProject({ project: p })[0].latestFoundry, pkg.version);
    writeFileSync(join(p, '.claude', 'skills', 'copy-tight', '.foundry.json'), JSON.stringify({ ...stamp, foundryVersion: '1.0.0' }, null, 2));
    const cOut = []; const dOldOut = [];
    assert.equal(main(['check'], (l) => cOut.push(l)), 0);
    assert.ok(cOut.some((l) => l.includes(`Skill Foundry ${pkg.version}`) && l.includes('1.0.0')), cOut.join('\n'));
    main(['doctor'], (l) => dOldOut.push(l));
    assert.ok(dOldOut.some((l) => l.includes('1.0.0') && l.includes(pkg.version)), dOldOut.join('\n'));
    mkdirSync(join(p, '.harness'), { recursive: true });
    writeFileSync(join(p, '.harness', 'foundry-default.json'), JSON.stringify({ at: '2026-11-18' }));
    const cDefOut = []; const dDefOut = [];
    assert.equal(main(['check'], (l) => cDefOut.push(l)), 0);
    assert.ok(cDefOut.some((l) => l.startsWith('default  new default skill(s):') && l.includes('test-planner')), cDefOut.join('\n'));
    main(['doctor'], (l) => dDefOut.push(l));
    assert.ok(dDefOut.some((l) => l.includes('new default skill(s) available') && l.includes('test-planner')), dDefOut.join('\n'));
    main(['doctor'], (l) => dOut.push(l));
    assert.match(dOut[0], new RegExp(`^Skill Foundry ${pkg.version.replace(/\./g, '\\.')} doctor:`));
    assert.equal(doctorProject({ project: p }).foundryVersion, pkg.version);
  } finally { process.chdir(cwd); }
});

test('Agentic-Harness ui-craft starter copy is replaced cleanly without --sync-harness when ui-craft is installed', () => {
  const root = mkdtempSync(join(tmpdir(), 'sf-uicraft-src-'));
  mkdirSync(join(root, 'src', 'factory'), { recursive: true });
  cpSync(join(ROOT, 'src', 'skills', 'ui-craft'), join(root, 'src', 'skills', 'ui-craft'), { recursive: true });
  writeFileSync(join(root, 'src', 'factory', 'registry.json'), JSON.stringify([
    { name: 'ui-craft', version: '0.1.0', status: 'ready', roles: ['DEV_ENGINEER', 'UX_DESIGNER'], keywords: ['ui', 'navbar'] },
  ]));
  const p = mkdtempSync(join(tmpdir(), 'sf-uicraft-prj-'));
  const starter = readFileSync(join(ROOT, '.harness', 'skills', 'ui-craft', 'SKILL.md'), 'utf8');
  const f = join(p, '.harness', 'skills', 'ui-craft', 'SKILL.md');
  mkdirSync(join(p, '.harness', 'skills', 'ui-craft'), { recursive: true });
  writeFileSync(f, starter);
  const r = addSkill('ui-craft', { project: p, root });
  assert.equal(r.harnessStatus, 'replaced-starter');
  assert.match(readFileSync(f, 'utf8'), /installed-by: skill-foundry/);
  assert.match(readFileSync(f, 'utf8'), /roles: \["DEV_ENGINEER","UX_DESIGNER"\]/);
  assert.equal(readFileSync(`${f}.orig`, 'utf8'), starter);
  removeSkill('ui-craft', { project: p, root });
  assert.equal(readFileSync(f, 'utf8'), starter);
});

test('doctor: an engine skill pointer keeps the role mcp__ tools (harness 1.0.34 narrowing)', () => {
  const p = mkdtempSync(join(tmpdir(), 'sf-mcp-')); mkdirSync(join(p, '.harness', 'roles'), { recursive: true }); mkdirSync(join(p, '.harness', 'skills'), { recursive: true });
  writeFileSync(join(p, '.harness', 'roles', 'ux-designer.json'), JSON.stringify({ name: 'UX_DESIGNER', allowedTools: ['Read', 'Edit(src/**)', 'Write(src/**)', 'Bash(node:*)', 'mcp__playwright'] }));
  addSkill('design-system', { project: p });
  const r = doctorProject(p);
  assert.ok(!r.items.some((i) => i.level === 'problem' && /strips/.test(i.message)), JSON.stringify(r.items.filter((i) => i.level === 'problem')));
});

test('CLI is strict about what you type: unknown options stop the command, --role accepts lower case, names and --role do not mix, update names a typo', () => {
  const p = mkdtempSync(join(tmpdir(), 'sf-strict-')); mkdirSync(join(p, '.harness', 'skills'), { recursive: true });
  const cwd = process.cwd(); process.chdir(p);
  try {
    // a typo of an opt-out must NOT silently turn the default (protection rules) on
    assert.throws(() => main(['add', 'copy-tight', '--no-protec'], () => {}), /unknown option "--no-protec"/);
    assert.ok(!existsSync(join(p, '.claude', 'skills', 'copy-tight')), 'nothing may be installed when an option is unknown');
    assert.throws(() => main(['list', '--bogus'], () => {}), /unknown option "--bogus"/);
    assert.throws(() => main(['check', '--jsn'], () => {}), /unknown option/);
    // every option the harness and the docs use is still accepted
    for (const argv of [['list', '--json'], ['check', '--json'], ['doctor', '--json'], ['add', 'copy-tight', '--quiet', '--no-rules', '--no-protect', '--force', '--sync-harness']]) {
      const spy = process.stdout.write; process.stdout.write = () => true;
      try { main(argv, () => {}); } finally { process.stdout.write = spy; }
    }
    assert.ok(existsSync(join(p, '.claude', 'skills', 'copy-tight', 'SKILL.md')), 'valid options still work');
    // roles are capitals everywhere else; lower case is understood
    const out = []; main(['add', '--role', 'ba_analyst', '--quiet'], (l) => out.push(l));
    assert.ok(out.some((l) => /copy-tight|spec-writer|journey-mapper/.test(l)), out.join('\n'));
    assert.throws(() => main(['add', '--role', 'NOPE'], () => {}), /--role must be one of/);
    assert.throws(() => main(['add', 'copy-tight', '--role', 'QA_AUDITOR'], () => {}), /either skill names .* or --role, not both/);
    // update: a typo is an error, a real skill that is not installed is explained, never silently "nothing to update"
    assert.throws(() => main(['update', 'journey-mappr'], () => {}), /unknown or not ready skill "journey-mappr"/);
    assert.ok(!existsSync(join(p, '.claude', 'skills', 'figure-craft')), 'precondition: figure-craft (DEV_ENGINEER only) is not installed by the BA_ANALYST role add');
    const u = []; assert.equal(main(['update', 'figure-craft'], (l) => u.push(l)), 0);
    assert.ok(u.some((l) => /figure-craft is not installed here \(add it first: add figure-craft\)/.test(l)), u.join('\n'));
  } finally { process.chdir(cwd); }
});
