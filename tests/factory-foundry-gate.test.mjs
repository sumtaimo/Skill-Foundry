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
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { catalog, DENY, projectRoles } from '../src/factory/foundry.mjs';
import { harnessSources, installHarness, newProject, run, tree, w, rd, governance, FIXTURES } from './helpers/harness-project.mjs';

const STUB = '---\nname: spec-writer\ndescription: Makes BA specs short, testable and directly usable by DEV and QA.\nroles: ["BA_ANALYST"]\nallowedTools: ["Read", "Edit", "Write"]\nkeywords: ["spec"]\nautoApply: false\n---\n# Spec Writer Rules\n1. Start with one sentence.\n';
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
  const src = harnessSources().at(-1).dir; const p = newProject('ctl'); installHarness(p, src);
  w(p, '.harness/skills/old/SKILL.md', '---\nname: old\nroles: ["QA_AUDITOR", "DEV_ENGINEER"]\nallowedTools: ["Read", "Edit", "Write"]\nautoApply: true\n---\n# old\n');
  w(p, '.harness/skills/lit/SKILL.md', '---\nname: lit\nroles: ["DEV_ENGINEER"]\nallowedTools: ["Bash(node:*)"]\nautoApply: true\n---\n# lit\n');
  const g = governance(p, { all: true });
  assert.ok(!g.QA_AUDITOR.withSkills.includes('Bash(npm test:*)'), 'old pointer strips npm test (the bug the brief found)');
  assert.ok(!g.DEV_ENGINEER.withSkills.some((r) => r.startsWith('Edit(')), 'a literal Bash(node:*) drops Edit/Write');
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
    assert.match(msgs, /team\.json: "lead-dev" lists skills/);
    assert.match(msgs, /gemini \(team\.json orchestrator\)/); assert.match(msgs, /orca \(config\.json profiles\)/);
    const qa = roles.QA_AUDITOR; const qaNode = (qa?.allowedTools ?? []).some((x) => x === 'Bash(node:*)');
    if (qa && !qaNode) assert.match(msgs, /a11y-audit runs engine\/\*\.mjs scripts but role QA_AUDITOR may not run node/);
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

test('doctor reads the harness capability flag, not a version: explicit team skills warn only without SKILL_COMPOSITION = additive-union', () => {
  const src = harnessSources().at(-1).dir; const p = newProject('flag'); installHarness(p, src);
  const team = JSON.parse(rd(p, '.harness/team.json'));
  team.members = (team.members ?? []).map((m) => (m.id === 'lead-dev' ? { ...m, skills: ['code-craft'] } : m));
  w(p, '.harness/team.json', team);
  run(p, ['add', 'copy-tight']);
  const warns = () => JSON.parse(run(p, ['doctor', '--json']).out.join('\n')).items.filter((i) => /switch off autoApply/.test(i.message));
  const gov = join(p, '.harness', 'lib', 'governance.mjs');
  const text = readFileSync(gov, 'utf8').replace(/\nexport const SKILL_COMPOSITION[^\n]*\n/, '\n');
  w(p, '.harness/lib/governance.mjs', text);
  assert.ok(warns().length >= 1, 'no flag: the old behaviour is still warned about');
  w(p, '.harness/lib/governance.mjs', `${text}\nexport const SKILL_COMPOSITION = 'additive-union';\n`);
  assert.equal(warns().length, 0, 'flag present: explicit lead skills are added to autoApply skills, so no warning');
});
