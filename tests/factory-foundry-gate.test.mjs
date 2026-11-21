/**
 * Cross-project gate: Skill Foundry and the Agentic-Harness must work together in every user situation.
 *   S1  Skill Foundry only (no harness)
 *   S2  harness first, then Skill Foundry
 *   S3  Skill Foundry first, then the harness installs (and updates) over it
 * Each situation runs against every harness source (vendored snapshots in tests/fixtures/agentic-harness/ when present,
 * always this repository's own copy). The harness's real governance code (.harness/lib/governance.mjs) runs in a child process
 * pointed at the temp project (HARNESS_ROOT), so loadSkills / matchSkills / computeAllowedTools are the real ones, not copies.
 * For every role in the source, no Skill Foundry pointer may strip Bash(npm test:*), Bash(node --test:*) or the role's Edit/Write rules.
 * @governed-by PO_ARCHITECT
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';
import { catalog, DENY, projectRoles } from '../src/factory/foundry.mjs';
import { harnessSources, installHarness, newProject, run, tree, w, rd, governance, FIXTURES } from './helpers/harness-project.mjs';

const STUB = '---\nname: spec-writer\ndescription: Makes BA specs short, testable and directly usable by DEV and QA.\nroles: ["BA_ANALYST"]\nallowedTools: ["Read", "Edit", "Write"]\nkeywords: ["spec"]\nautoApply: false\n---\n# Spec Writer Rules\n1. Start with one sentence.\n';
const hasFlag = (dir) => /SKILL_COMPOSITION\s*=\s*['"]additive-union['"]/.test(readFileSync(join(dir, '.harness', 'lib', 'governance.mjs'), 'utf8'));
const portable = () => catalog().filter((s) => s.scope !== 'factory').map((s) => s.name);

/** What a real project adds on top of the harness: a starter copy of one of our skills, a custom role, team skills, stale engines. */
function customise(p) {
  w(p, '.harness/skills/spec-writer/SKILL.md', STUB);
  w(p, '.harness/roles/ux-designer.json', { name: 'UX_DESIGNER', allowedTools: ['Read', 'Glob', 'Grep', 'Edit({targetFiles})', 'Write({targetFiles})', 'Bash(git status)'], writablePaths: ['src/**/*.css', 'src/**/*.scss', 'src/**/*.less'] });
  const team = existsSync(join(p, '.harness', 'team.json')) ? JSON.parse(rd(p, '.harness/team.json')) : { members: [] };
  team.members = [...(team.members ?? []).filter((m) => m.id !== 'lead-dev'), { id: 'orchestrator', level: 'orchestrator', role: 'PO_ARCHITECT', engine: 'gemini' }, { id: 'lead-dev', level: 'lead', role: 'DEV_ENGINEER', skills: ['code-craft'], scope: ['src/**'] }];
  w(p, '.harness/team.json', team);
  const cfg = existsSync(join(p, '.harness', 'config.json')) ? JSON.parse(rd(p, '.harness/config.json')) : {};
  cfg.profiles = { ...(cfg.profiles ?? {}), orca: {} }; w(p, '.harness/config.json', cfg);
}

/** For every role of the project's harness: the installed skills never narrow the role's rules. */
function noStrip(p, label) {
  const g = governance(p);
  const names = Object.keys(g);
  assert.ok(names.length >= 4, `${label}: the harness defines at least its 4 base roles (${names.join(', ')})`);
  for (const [role, x] of Object.entries(g)) {
    assert.deepEqual(x.withSkills, x.base, `${label} ${role}: installed skills must not narrow the role's rules`);
    assert.deepEqual(x.every, x.base, `${label} ${role}: not even when every skill is injected`);
    for (const r of ['Bash(npm test:*)', 'Bash(node --test:*)']) if (x.base.includes(r)) assert.ok(x.withSkills.includes(r), `${label} ${role} keeps ${r}`);
    for (const t of ['Edit(', 'Write(']) assert.equal(x.withSkills.filter((r) => r.startsWith(t)).length, x.base.filter((r) => r.startsWith(t)).length, `${label} ${role} keeps its ${t}…) rules`);
  }
  return g;
}

test('gate: vendored snapshots of both Agentic-Harness versions are present', { skip: !existsSync(FIXTURES) && 'tests/fixtures/agentic-harness/ is not vendored yet (needs read access to sumtaimo/Agentic-Harness: release 15bd31e and lab bf8b43c)' }, () => {
  const names = harnessSources().filter((s) => s.snapshot).map((s) => s.label);
  const labMinor = names.map((n) => /lab-v1\.0\.(\d+)/.exec(n)).filter(Boolean).map((m) => Number(m[1]));
  assert.ok(names.some((n) => /release-v1\.0\.6/.test(n)) && labMinor.some((v) => v >= 9), `a release v1.0.6 snapshot and a lab snapshot at 1.0.9 or newer exist, found: ${names.join(', ')}`);
  for (const s of harnessSources().filter((x) => x.snapshot)) assert.ok(existsSync(join(s.dir, 'README.md')), `${s.label} has a README naming its source`);
});

test('gate control: the old pointer line and a literal Bash(node:*) DO strip rules, so the checks below can fail', () => {
  const src = harnessSources().at(-1).dir;
  const p1 = newProject('ctl1'); installHarness(p1, src);
  w(p1, '.harness/skills/old/SKILL.md', '---\nname: old\nroles: ["QA_AUDITOR", "DEV_ENGINEER"]\nallowedTools: ["Read", "Edit", "Write"]\nautoApply: true\n---\n# old\n');
  assert.ok(!governance(p1, { all: true }).QA_AUDITOR.withSkills.includes('Bash(npm test:*)'), 'old pointer strips npm test (the bug the brief found)');
  const p2 = newProject('ctl2'); installHarness(p2, src);
  w(p2, '.harness/skills/lit/SKILL.md', '---\nname: lit\nroles: ["DEV_ENGINEER"]\nallowedTools: ["Bash(node:*)"]\nautoApply: true\n---\n# lit\n');
  assert.ok(!governance(p2, { all: true }).DEV_ENGINEER.withSkills.some((r) => r.startsWith('Edit(')), 'a literal Bash(node:*) drops Edit/Write');
});

test('situation S1: Skill Foundry only, no harness: skills, AGENTS.md and protection, nothing else; doctor advises', () => {
  const p = newProject('s1'); w(p, 'src/app.js', 'x\n');
  const a = run(p, ['add', '--all']); assert.equal(a.code, 0);
  const files = Object.keys(tree(p));
  assert.ok(files.every((f) => /^\.claude\/skills\/[^/]+\//.test(f) || ['AGENTS.md', '.claude/settings.json', 'src/app.js'].includes(f)), `only our files: ${files.filter((f) => !/^\.claude\/skills\//.test(f)).join(', ')}`);
  assert.ok(!existsSync(join(p, '.harness')), 'Skill Foundry never creates a harness');
  const cfg = JSON.parse(rd(p, '.claude/settings.json'));
  for (const d of DENY) assert.ok(cfg.permissions.deny.includes(d));
  assert.ok(Object.values(cfg.permissions).flat().every((r) => !r.startsWith('Write(')));
  const d = run(p, ['doctor', '--json']); const r = JSON.parse(d.out.join('\n'));
  assert.equal(d.code, 0, d.out.join('\n')); assert.equal(r.case, 'B'); assert.equal(r.counts.problem, 0);
  assert.ok(r.items.some((i) => i.level === 'info' && i.area === 'harness'), 'the doctor mentions the harness only as read-only advice');
  const snap = tree(p); run(p, ['add', '--all']); run(p, ['update']); assert.deepEqual(tree(p), snap, 'idempotent');
});

for (const src of harnessSources()) {
  const L = src.label;

  test(`situation S2 [${L}]: harness first, then add --all, update, doctor`, () => {
    const p = newProject('s2'); installHarness(p, src.dir); customise(p);
    const roles = projectRoles(p);
    run(p, ['add', 'test-planner', '--quiet']);
    // a project upgraded from an old foundry: legacy deny rules and an old restrictive pointer
    const sf = JSON.parse(rd(p, '.claude/settings.json')); sf.permissions.deny.push('Write(.claude/skills/**)', 'Write(.harness/skills/**)'); w(p, '.claude/settings.json', sf);
    const old = rd(p, '.harness/skills/test-planner/SKILL.md').replace(/^keywords:/m, 'allowedTools: ["Read", "Edit", "Write"]\nkeywords:'); w(p, '.harness/skills/test-planner/SKILL.md', old);
    const b = JSON.parse(run(p, ['doctor', '--json']).out.join('\n'));
    assert.equal(b.case, 'A');
    assert.ok(b.items.some((i) => i.level === 'problem' && /Write\(path\)/.test(i.message)), 'doctor sees the invalid Write rules');
    const tp = catalog().find((s) => s.name === 'test-planner');
    const stripped = tp.roles.map((r) => roles[r]).filter(Boolean).some((role) => (role.allowedTools ?? []).some((x) => /^Bash\(/.test(x)));
    if (stripped) assert.ok(b.items.some((i) => i.level === 'problem' && /strips /.test(i.message)), 'doctor sees the old pointer stripping a role\'s Bash rules');

    const a = run(p, ['add', '--all']); assert.equal(a.code, 0);
    assert.ok(a.out.some((l) => /harness  ! spec-writer: .*without skill-foundry marker/.test(l)) || a.out.some((l) => /spec-writer.*replaced the harness starter copy/.test(l)), 'the stub is either kept with a warning or replaced as a known starter');
    const cfg = JSON.parse(rd(p, '.claude/settings.json'));
    assert.ok(Object.values(cfg.permissions).flat().every((r) => !r.startsWith('Write(')), 'zero Write(...) rules');
    for (const d of DENY) assert.ok(cfg.permissions.deny.includes(d));
    for (const r of ['Bash(npm test:*)', 'Bash(node --test:*)']) assert.ok(cfg.permissions.allow.includes(r), `the harness rule ${r} is kept`);
    assert.match(rd(p, 'AGENTS.md'), /<!-- agentic-harness -->[\s\S]*Harness rules stay here[\s\S]*skill-foundry:begin/);
    noStrip(p, `${L} S2`);

    const snap = tree(p); run(p, ['add', '--all']); run(p, ['update']); run(p, ['add', '--role', 'QA_AUDITOR']);
    assert.deepEqual(tree(p), snap, 'add --all, update and add --role are idempotent: not one byte changes');

    const d = run(p, ['doctor', '--json']); const r = JSON.parse(d.out.join('\n'));
    assert.equal(r.counts.problem, 0, JSON.stringify(r.items.filter((i) => i.level === 'problem')));
    const msgs = r.items.filter((i) => i.level === 'warn').map((i) => i.message).join('\n');
    (hasFlag(src.dir) ? assert.doesNotMatch : assert.match)(msgs, /team\.json: "lead-dev" lists skills/);
    assert.match(msgs, /gemini \(team\.json orchestrator\)/); assert.match(msgs, /orca \(config\.json profiles\)/);
    const qa = roles.QA_AUDITOR; const qaNode = (qa?.allowedTools ?? []).some((x) => x === 'Bash(node:*)');
    const infos = r.items.filter((i) => i.level === 'info').map((i) => i.message).join('\n');
    if (qa && !qaNode) { assert.match(infos, /a11y-audit has an engine\/\*\.mjs script; role QA_AUDITOR may not run node, so it uses the documented script-less fallback/); assert.doesNotMatch(msgs, /runs engine\/\*\.mjs scripts but role/, 'an engine: optional skill is an info note, not a warning'); }
    assert.ok(r.items.filter((i) => i.level !== 'ok').every((i) => i.level === 'info' || i.fix), 'every warning carries an exact fix');

    const s = run(p, ['update', 'spec-writer', '--sync-harness', '--quiet']);
    assert.equal(s.code, 0);
    assert.ok(!JSON.parse(run(p, ['doctor', '--json']).out.join('\n')).items.some((i) => /spec-writer: .*without the skill-foundry marker/.test(i.message)));
    noStrip(p, `${L} S2 after sync`);
  });

  test(`situation S3 [${L}]: Skill Foundry first, then the harness installs and updates over it`, () => {
    const p = newProject('s3');
    run(p, ['add', '--all', '--quiet']);
    const d0 = run(p, ['doctor', '--json']); assert.equal(d0.code, 0, d0.out.join('\n')); assert.equal(JSON.parse(d0.out.join('\n')).case, 'B');
    const stamps = Object.fromEntries(portable().map((n) => [n, rd(p, `.claude/skills/${n}/.foundry.json`)]));
    const ours = rd(p, 'AGENTS.md');

    installHarness(p, src.dir); customise(p);
    assert.ok(rd(p, 'AGENTS.md').startsWith(ours.trimEnd()), 'the harness appended after the foundry block');
    assert.equal(run(p, ['check']).code, 0, 'foundry check passes');
    for (const [n, st] of Object.entries(stamps)) assert.equal(rd(p, `.claude/skills/${n}/.foundry.json`), st, `${n} stamp unchanged`);

    const a = run(p, ['add', '--all', '--quiet']); assert.equal(a.code, 0);
    for (const n of portable().filter((x) => x !== 'spec-writer')) assert.match(rd(p, `.harness/skills/${n}/SKILL.md`), /installed-by: skill-foundry/, `${n} pointer written`);
    const after = rd(p, 'AGENTS.md');
    assert.equal(after.match(/skill-foundry:begin/g).length, 1); assert.equal(after.match(/<!-- agentic-harness -->/g).length, 1);
    assert.match(after, /Harness rules stay here/);
    const cfg = JSON.parse(rd(p, '.claude/settings.json'));
    for (const d of DENY) assert.ok(cfg.permissions.deny.includes(d));
    assert.ok(Object.values(cfg.permissions).flat().every((r) => !r.startsWith('Write(')));
    noStrip(p, `${L} S3`);
    const r = JSON.parse(run(p, ['doctor', '--json']).out.join('\n'));
    assert.equal(r.case, 'A'); assert.equal(r.counts.problem, 0);
    assert.equal(run(p, ['update', '--sync-harness', '--quiet']).code, 0);
    noStrip(p, `${L} S3 after sync`);

    // the harness updates itself later: our pointers, deny rules and skills survive
    installHarness(p, src.dir, { update: true });
    assert.equal(run(p, ['check']).code, 0);
    for (const d of DENY) assert.ok(JSON.parse(rd(p, '.claude/settings.json')).permissions.deny.includes(d));
    noStrip(p, `${L} S3 after harness update`);
    assert.equal(JSON.parse(run(p, ['doctor', '--json']).out.join('\n')).counts.problem, 0);
  });
}


test('doctor reads the harness capability flag, not a version: explicit team skills warn only for a harness without SKILL_COMPOSITION = additive-union', () => {
  const snaps = harnessSources().filter((s) => s.snapshot);
  const without = snaps.find((s) => !hasFlag(s.dir)); const withFlag = snaps.find((s) => hasFlag(s.dir));
  assert.ok(without && withFlag, `one snapshot without and one with the flag exist, found: ${snaps.map((s) => `${s.label} flag=${hasFlag(s.dir)}`).join(', ')}`);
  for (const [src, expectWarn] of [[without, true], [withFlag, false]]) {
    const p = newProject('flag'); installHarness(p, src.dir);
    const team = JSON.parse(rd(p, '.harness/team.json'));
    team.members = (team.members ?? []).map((m) => (m.id === 'lead-dev' ? { ...m, skills: ['code-craft'] } : m));
    w(p, '.harness/team.json', team);
    run(p, ['add', 'copy-tight']);
    const n = JSON.parse(run(p, ['doctor', '--json']).out.join('\n')).items.filter((i) => /switch off autoApply/.test(i.message)).length;
    assert.equal(n > 0, expectWarn, `${src.label}: explicit lead skills ${expectWarn ? 'warn (no capability flag)' : 'do not warn (flag present)'}`);
  }
});

for (const src of harnessSources()) {
  test(`harness default install [${src.label}]: add spec-writer replaces the starter stub once, and adding again changes nothing`, () => {
    const p = newProject('dflt'); installHarness(p, src.dir);
    const stub = rd(p, '.harness/skills/spec-writer/SKILL.md');
    const first = run(p, ['add', 'spec-writer', '--quiet']); assert.equal(first.code, 0, first.out.join('\n'));
    const after = rd(p, '.harness/skills/spec-writer/SKILL.md');
    assert.match(after, /installed-by: skill-foundry/, 'the pointer replaced the stub');
    assert.doesNotMatch(after, /starter-stub: agentic-harness/);
    if (/starter-stub: agentic-harness/.test(stub)) assert.equal(rd(p, '.harness/skills/spec-writer/SKILL.md.orig'), stub, 'the original stub is kept as SKILL.md.orig');
    assert.equal(rd(p, 'AGENTS.md').split('skill-foundry:begin').length - 1, 1, 'one managed block');
    const before = tree(p);
    const again = run(p, ['add', 'spec-writer', '--quiet']); assert.equal(again.code, 0);
    assert.deepEqual(tree(p), before, 'a second add changes nothing and duplicates nothing');
    const d = JSON.parse(run(p, ['doctor', '--json']).out.join('\n')); assert.equal(d.counts.problem, 0, JSON.stringify(d.items.filter((i) => i.level === 'problem')));
  });
}

test('add spec-writer never breaks an install: no .harness/skills folder, and no git repository', () => {
  const src = harnessSources().filter((x) => x.snapshot).find((x) => hasFlag(x.dir)).dir;
  const p = newProject('nogit'); installHarness(p, src);
  rmSync(join(p, '.git'), { recursive: true, force: true });
  rmSync(join(p, '.harness', 'skills'), { recursive: true, force: true });
  assert.ok(!existsSync(join(p, '.git')), 'the project is not a git repository');
  const r = run(p, ['add', 'spec-writer', '--quiet']); assert.equal(r.code, 0, r.out.join('\n'));
  assert.ok(!existsSync(join(p, '.harness', 'skills')), 'Skill Foundry never creates a folder of the harness (ownership line)');
  assert.ok(existsSync(join(p, '.claude', 'skills', 'spec-writer', '.foundry.json')));
  const d = JSON.parse(run(p, ['doctor', '--json']).out.join('\n')); assert.equal(d.counts.problem, 0);
});

// ── injection by keyword: the pointer narrows to the task only when the harness exports SKILL_MATCH ──
const hasMatch = (dir) => /SKILL_MATCH\s*=\s*['"]keywords-with-explicit['"]/.test(readFileSync(join(dir, '.harness', 'lib', 'governance.mjs'), 'utf8'));
function chosenFor(p, role, sub) {
  const gov = pathToFileURL(join(p, '.harness', 'lib', 'governance.mjs')).href;
  const script = `import { loadSkills, matchSkills } from ${JSON.stringify(gov)};
const all = loadSkills();
console.log(JSON.stringify(matchSkills(${JSON.stringify(sub)}, ${JSON.stringify(role)}, all).chosen.filter((s) => s.raw.includes('installed-by: skill-foundry')).map((s) => s.name).sort()));`;
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', script], { env: { ...process.env, HARNESS_ROOT: p }, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr); return JSON.parse(r.stdout);
}

test('pointers: autoApply follows the harness capability SKILL_MATCH, never a version', () => {
  const snaps = harnessSources().filter((s) => s.snapshot);
  const without = snaps.find((s) => !hasMatch(s.dir) && hasFlag(s.dir)); const withMatch = snaps.find((s) => hasMatch(s.dir));
  assert.ok(without && withMatch, `a snapshot without and one with SKILL_MATCH exist, found: ${snaps.map((s) => `${s.label}=${hasMatch(s.dir)}`).join(', ')}`);
  for (const [src, auto] of [[without, 'true'], [withMatch, 'false']]) {
    const p = newProject('match'); installHarness(p, src.dir); run(p, ['add', '--all', '--quiet']);
    if (auto === 'true') assert.ok(chosenFor(p, 'DEV_ENGINEER', { skills: ['code-craft'], prompt: 'an unrelated task' }).includes('a11y-audit'), `${src.label}: a lead with an explicit skills list still receives the skill (autoApply: true)`);
    for (const n of portable()) assert.match(rd(p, `.harness/skills/${n}/SKILL.md`), new RegExp(`^autoApply: ${auto}$`, 'm'), `${src.label} ${n}`);
    const d = JSON.parse(run(p, ['doctor', '--json']).out.join('\n')); assert.equal(d.counts.problem, 0, JSON.stringify(d.items.filter((i) => i.level === 'problem')));
    assert.ok(!d.items.some((i) => /autoApply|SKILL_MATCH/.test(i.message)), `${src.label}: pointer and harness agree, no warning`);
  }
});

test('keyword injection: only the skills that fit the task, only for their roles, also for a lead with an explicit skills list', () => {
  const src = harnessSources().filter((s) => s.snapshot).find((s) => hasMatch(s.dir));
  const p = newProject('kw'); installHarness(p, src.dir); run(p, ['add', '--all', '--quiet']);
  assert.deepEqual(chosenFor(p, 'DEV_ENGINEER', { prompt: 'Run an accessibility check on the form with WCAG' }), ['a11y-audit']);
  assert.deepEqual(chosenFor(p, 'DEV_ENGINEER', { skills: ['code-craft'], prompt: 'Run an accessibility check on the form' }), ['a11y-audit'], 'an explicit list does not switch keywords off');
  assert.deepEqual(chosenFor(p, 'DEV_ENGINEER', { prompt: 'Add a database migration and review the variation of the build' }), [], 'whole-phrase keywords do not match inside other words (database, variation, build)');
  assert.deepEqual(chosenFor(p, 'BA_ANALYST', { prompt: 'Write the spec with acceptance criteria' }), ['spec-writer']);
  assert.deepEqual(chosenFor(p, 'DEV_ENGINEER', { prompt: 'Write the spec with acceptance criteria' }), [], 'role fit stays mandatory');
  assert.ok(chosenFor(p, 'DEV_ENGINEER', { prompt: 'Fix the spacing and contrast, then update the design tokens' }).length <= 3, 'a task gets a few skills, not all six');
  const g = noStrip(p, 'keyword harness');
  assert.ok(g.DEV_ENGINEER.base.length > 0);
});

test('doctor: a pointer and its harness that disagree are reported with the exact fix', () => {
  const snaps = harnessSources().filter((s) => s.snapshot);
  const withMatch = snaps.find((s) => hasMatch(s.dir)); const without = snaps.find((s) => !hasMatch(s.dir));
  const p = newProject('mix'); installHarness(p, without.dir); run(p, ['add', 'copy-tight', '--quiet']);
  w(p, '.harness/lib/governance.mjs', `${rd(p, '.harness/lib/governance.mjs')}\nexport const SKILL_MATCH = 'keywords-with-explicit';\n`);
  let items = JSON.parse(run(p, ['doctor', '--json']).out.join('\n')).items;
  assert.ok(items.some((i) => i.level === 'warn' && /autoApply: true/.test(i.message) && /update copy-tight/.test(i.fix)), 'harness upgraded after the pointer: warn, fix is update');
  run(p, ['update', 'copy-tight', '--quiet']);
  assert.match(rd(p, '.harness/skills/copy-tight/SKILL.md'), /^autoApply: false$/m);
  const q = newProject('mix2'); installHarness(q, withMatch.dir); run(q, ['add', 'copy-tight', '--quiet']);
  w(q, '.harness/lib/governance.mjs', rd(q, '.harness/lib/governance.mjs').replace(/\nexport const SKILL_MATCH[^\n]*\n/, '\n'));
  items = JSON.parse(run(q, ['doctor', '--json']).out.join('\n')).items;
  assert.ok(items.some((i) => i.level === 'warn' && /needs a harness with SKILL_MATCH/.test(i.message)), 'harness downgraded: warn');
});

test('add --default installs every ready portable skill (the harness installer calls it), and registry keywords are whole phrases of at least 4 characters', () => {
  const p = newProject('dflt2'); const r = run(p, ['add', '--default', '--quiet']); assert.equal(r.code, 0, r.out.join('\n'));
  // TAIMO, 2026-11-21: the harness installs Skill Foundry by default, so every ready skill comes with it; a worker still gets
  // only the skills that fit its role and task (keywords), each as a short pointer. Node is always there (npx runs on it).
  const DEFAULT = catalog().filter((x) => x.scope !== 'factory').map((x) => x.name).sort();
  assert.ok(DEFAULT.length >= 11);
  assert.deepEqual(existsSync(join(p, '.claude', 'skills')) ? readdirSync(join(p, '.claude', 'skills')).sort() : [], DEFAULT, 'every ready portable skill');
  assert.deepEqual(catalog().filter((x) => x.isDefault).map((x) => x.name).sort(), DEFAULT, 'registry default flag on every ready portable skill');
  const before = tree(p); const again = run(p, ['add', '--default', '--quiet']); assert.equal(again.code, 0); assert.deepEqual(tree(p), before, 'a second add --default changes nothing');
  const cat = catalog().filter((x) => DEFAULT.includes(x.name));
  for (const x of cat) if (existsSync(join(x.dir, 'engine'))) assert.ok(x.engine, `${x.name}: a default skill with an engine/ script declares engine required or optional`);
  for (const role of ['BA_ANALYST', 'DEV_ENGINEER', 'QA_AUDITOR', 'UX_DESIGNER']) assert.ok(cat.some((x) => x.roles.includes(role)), `${role} has at least one usable default skill`);
  for (const s of catalog().filter((x) => x.scope !== 'factory')) {
    assert.ok(s.keywords.length >= 3, `${s.name} has its own injection keywords`);
    for (const k of s.keywords) assert.ok(k.length >= 4 || k === 'svg' || k === 'css', `${s.name}: keyword "${k}" is long enough not to match inside other words`);
  }
});

test('check --json contract (the harness session-start check depends on it): exit 0 when current, exit 2 when outdated or edited, always only JSON on stdout', () => {
  const FOUNDRY = join(FIXTURES, '..', '..', '..', 'src', 'factory', 'foundry.mjs');
  const p = newProject('chk'); run(p, ['add', 'copy-tight', '--quiet']);
  const check = () => { const r = spawnSync(process.execPath, [FOUNDRY, 'check', '--json'], { cwd: p, encoding: 'utf8' }); return { code: r.status, json: JSON.parse(r.stdout), stdout: r.stdout, stderr: r.stderr }; };
  let r = check(); assert.equal(r.code, 0); assert.ok(Array.isArray(r.json) && r.json.length === 1 && r.json[0].current === true && r.json[0].modified.length === 0);
  assert.equal(r.stdout.trim()[0], '[', 'stdout is only the JSON array');
  const file = join(p, '.claude', 'skills', 'copy-tight', 'SKILL.md'); writeFileSync(file, `${readFileSync(file, 'utf8')}\nedited\n`);
  r = check(); assert.equal(r.code, 2, 'an edited skill gives exit 2'); assert.deepEqual(r.json[0].modified, ['SKILL.md']);
  writeFileSync(file, readFileSync(file, 'utf8').replace('\nedited\n', ''));
  assert.equal(check().code, 0, 'restored: current again');
  const stamp = join(p, '.claude', 'skills', 'copy-tight', '.foundry.json'); const st = JSON.parse(readFileSync(stamp, 'utf8')); st.hash = '0'.repeat(64); writeFileSync(stamp, JSON.stringify(st));
  r = check(); assert.equal(r.code, 2, 'an outdated skill gives exit 2'); assert.equal(r.json[0].current, false);
  const none = newProject('chk0'); const q = spawnSync(process.execPath, [FOUNDRY, 'check', '--json'], { cwd: none, encoding: 'utf8' });
  assert.equal(q.status, 0); assert.deepEqual(JSON.parse(q.stdout), [], 'no skills: exit 0 and an empty array');
});

test('doctor: a harness starter copy that was left in place is reported with the plain update as the fix', () => {
  const src = harnessSources().filter((s) => s.snapshot).find((s) => hasMatch(s.dir));
  const p = newProject('stub'); installHarness(p, src.dir);
  const stub = rd(p, '.harness/skills/spec-writer/SKILL.md'); assert.match(stub, /starter-stub: agentic-harness/);
  run(p, ['add', 'spec-writer', '--quiet']); w(p, '.harness/skills/spec-writer/SKILL.md', stub);
  const it = JSON.parse(run(p, ['doctor', '--json']).out.join('\n')).items.find((i) => /spec-writer/.test(i.message) && /starter copy/.test(i.message));
  assert.ok(it, 'the starter copy is named'); assert.match(it.fix, /update spec-writer\s+\(replaces the starter copy/); assert.doesNotMatch(it.fix, /--sync-harness/);
  run(p, ['update', 'spec-writer', '--quiet']);
  assert.match(rd(p, '.harness/skills/spec-writer/SKILL.md'), /installed-by: skill-foundry/); assert.equal(rd(p, '.harness/skills/spec-writer/SKILL.md.orig'), stub);
});

test('engine field: every skill with an engine/ script declares engine required or optional; the pointer carries it; both are data the harness reads, never the skill name', () => {
  for (const s of catalog().filter((x) => x.scope !== 'factory' && existsSync(join(x.dir, 'engine')))) {
    assert.ok(['required', 'optional'].includes(s.engine), `${s.name} has an engine/ script, so registry.json must declare "engine": "required" or "optional"`);
    if (s.engine === 'required') assert.deepEqual(s.roles, ['DEV_ENGINEER'], `${s.name} needs its script, so only the role that may run node can have it`);
  }
  const src = harnessSources().filter((x) => x.snapshot).find((x) => hasMatch(x.dir));
  const p = newProject('eng'); installHarness(p, src.dir); run(p, ['add', '--all', '--quiet']);
  for (const [n, v] of [['figure-craft', 'required'], ['a11y-audit', 'optional'], ['ui-polish', 'optional'], ['design-system', 'optional']]) assert.match(rd(p, `.harness/skills/${n}/SKILL.md`), new RegExp(`^engine: ${v}$`, 'm'), n);
  assert.doesNotMatch(rd(p, '.harness/skills/copy-tight/SKILL.md'), /^engine:/m, 'a skill without a script has no engine field');
  assert.match(rd(p, '.harness/skills/figure-craft/SKILL.md'), /^roles: \["DEV_ENGINEER"\]$/m);
  const d = JSON.parse(run(p, ['doctor', '--json']).out.join('\n'));
  const warns = d.items.filter((i) => i.level === 'warn' && !/MANIFEST\.json/.test(i.message)); // the test project has no installer manifest
  assert.equal(d.counts.problem, 0); assert.equal(warns.length, 0, JSON.stringify(warns));
  assert.ok(d.items.some((i) => i.level === 'info' && /engine\/\*\.mjs script/.test(i.message)), 'the engine message is an info note');
  w(p, '.harness/skills/ui-polish/SKILL.md', rd(p, '.harness/skills/ui-polish/SKILL.md').replace(/^engine: optional\n/m, ''));
  const old = JSON.parse(run(p, ['doctor', '--json']).out.join('\n'));
  assert.equal(old.counts.problem, 0); assert.ok(old.items.some((i) => i.level === 'info' && /ui-polish has an engine/.test(i.message)), 'a pointer written before the field existed falls back to the registry and still gives an info note');
});
