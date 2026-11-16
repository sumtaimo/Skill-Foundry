/**
 * Cross-repo verification gate: Skill Foundry and the Agentic-Harness must work together in both install orders.
 * Uses the harness's real governance code (.harness/lib/governance.mjs) in a child process pointed at a temp project
 * (HARNESS_ROOT), so loadSkills / matchSkills / computeAllowedTools are the real ones, not copies.
 * @governed-by PO_ARCHITECT
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, cpSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { main, catalog, DENY } from '../src/factory/foundry.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const GOV = pathToFileURL(join(ROOT, '.harness', 'lib', 'governance.mjs')).href;
const w = (p, f, text) => { mkdirSync(dirname(join(p, f)), { recursive: true }); writeFileSync(join(p, f), typeof text === 'string' ? text : JSON.stringify(text, null, 2)); };
const run = (p, argv) => { const cwd = process.cwd(); const out = []; process.chdir(p); try { const code = main(argv, (l) => out.push(l)); return { code, out }; } finally { process.chdir(cwd); } };
const tree = (dir, base = dir) => Object.fromEntries(readdirSync(dir).filter((n) => n !== '.git').flatMap((n) => { const f = join(dir, n); return statSync(f).isDirectory() ? Object.entries(tree(f, base)) : [[f.slice(base.length), readFileSync(f, 'utf8')]]; }));

const STUB = '---\nname: spec-writer\ndescription: Makes BA specs short, testable and directly usable by DEV and QA.\nroles: ["BA_ANALYST"]\nallowedTools: ["Read", "Edit", "Write"]\nkeywords: ["spec"]\nautoApply: false\n---\n# Spec Writer Rules\n1. Start with one sentence.\n';

/** What `npx github:sumtaimo/Agentic-Harness#release .` leaves in a project (roles, team, config, a stub skill, settings, AGENTS.md block). */
function installHarness(p) {
  for (const f of readdirSync(join(ROOT, '.harness', 'roles'))) cpSync(join(ROOT, '.harness', 'roles', f), join(p, '.harness', 'roles', f));
  const qa = JSON.parse(readFileSync(join(p, '.harness', 'roles', 'qa-auditor.json'), 'utf8')); qa.allowedTools.push('Bash(node --test:*)', 'Bash(git status)');
  w(p, '.harness/roles/qa-auditor.json', qa);
  w(p, '.harness/roles/ux-designer.json', { name: 'UX_DESIGNER', allowedTools: ['Read', 'Glob', 'Grep', 'Edit({targetFiles})', 'Write({targetFiles})', 'Bash(git status)'], writablePaths: ['src/**/*.css', 'src/**/*.scss', 'src/**/*.less'] });
  w(p, '.harness/team.json', { members: [{ id: 'orchestrator', level: 'orchestrator', role: 'PO_ARCHITECT', engine: 'gemini' }, { id: 'lead-dev', level: 'lead', role: 'DEV_ENGINEER', skills: ['code-craft'], scope: ['src/**'] }] });
  w(p, '.harness/config.json', { autoOrder: ['claude'], profiles: { claude: {}, orca: {} } });
  w(p, '.harness/MANIFEST.json', { version: '1.0.9' });
  w(p, '.harness/skills/spec-writer/SKILL.md', STUB);
  w(p, '.harness/skills/code-craft/SKILL.md', '---\nname: code-craft\nroles: ["DEV_ENGINEER"]\nallowedTools: ["Read", "Edit", "Write", "Bash(node --test:*)"]\nautoApply: true\n---\n# code\n');
  const sf = join(p, '.claude', 'settings.json'); const cfg = existsSync(sf) ? JSON.parse(readFileSync(sf, 'utf8')) : {};
  cfg.permissions ??= {}; for (const [k, v] of Object.entries({ allow: ['Bash(npm test:*)', 'Bash(node --test:*)'], ask: ['Bash(git push:*)'], deny: ['Edit(.harness/releases/**)'] })) cfg.permissions[k] = [...new Set([...(cfg.permissions[k] ?? []), ...v])];
  w(p, '.claude/settings.json', cfg);
  const md = existsSync(join(p, 'AGENTS.md')) ? readFileSync(join(p, 'AGENTS.md'), 'utf8') : '';
  if (!md.includes('<!-- agentic-harness -->')) w(p, 'AGENTS.md', `${md}${md ? '\n' : ''}<!-- agentic-harness -->\n# Agentic harness\nHarness rules stay here.\n<!-- /agentic-harness -->\n`);
}
const gitInit = (p) => spawnSync('git', ['init', '-q'], { cwd: p });

/** Real governance: for every role, the rules a worker gets with and without the installed skills. */
function governance(p, all = false) {
  const script = `import { loadSkills, loadRoles, computeAllowedTools, matchSkills } from ${JSON.stringify(GOV)};
const skills = loadSkills(), roles = loadRoles(), out = {};
for (const [n, r] of Object.entries(roles)) {
  const targets = r.writablePaths?.length ? ['tests/a.test.mjs', 'docs/a.md', 'src/a.css'] : [];
  const base = computeAllowedTools(r, [], targets);
  const ours = Object.fromEntries(Object.entries(skills).filter(([, s]) => process.env.ALL_SKILLS || s.raw.includes('installed-by: skill-foundry')));
  const chosen = matchSkills({ prompt: 'unrelated task' }, n, ours).chosen;
  out[n] = { base, withSkills: computeAllowedTools(r, chosen, targets), every: computeAllowedTools(r, Object.values(ours).filter((s) => s.roles.includes(n)), targets), chosen: chosen.map((s) => s.name) };
}
console.log(JSON.stringify(out));`;
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', script], { env: { ...process.env, HARNESS_ROOT: p, ...(all ? { ALL_SKILLS: '1' } : {}) }, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr); return JSON.parse(r.stdout);
}
const noStrip = (g) => {
  assert.deepEqual(Object.keys(g).sort(), ['BA_ANALYST', 'DEV_ENGINEER', 'PO_ARCHITECT', 'QA_AUDITOR', 'UX_DESIGNER']);
  for (const [role, x] of Object.entries(g)) {
    assert.deepEqual(x.withSkills, x.base, `${role}: installed skills must not narrow the role's rules`);
    assert.deepEqual(x.every, x.base, `${role}: not even when every skill is injected`);
  }
  for (const r of ['Bash(npm test:*)', 'Bash(node --test:*)', 'Bash(git status)']) assert.ok(g.QA_AUDITOR.withSkills.includes(r), `QA keeps ${r}`);
  for (const r of ['Bash(npm:*)', 'Bash(node:*)', 'Bash(git status)']) assert.ok(g.DEV_ENGINEER.withSkills.includes(r), `DEV keeps ${r}`);
  assert.ok(g.QA_AUDITOR.withSkills.some((r) => r.startsWith('Edit(')) && g.QA_AUDITOR.withSkills.some((r) => r.startsWith('Write(')), 'QA keeps its Edit/Write rules');
};

test('gate control: the old pointer line and a literal Bash(node:*) DO strip rules, so the checks above can fail', () => {
  const p = mkdtempSync(join(tmpdir(), 'sf-ctl-')); installHarness(p);
  w(p, '.harness/skills/old/SKILL.md', '---\nname: old\nroles: ["QA_AUDITOR", "DEV_ENGINEER"]\nallowedTools: ["Read", "Edit", "Write"]\nautoApply: true\n---\n# old\n');
  w(p, '.harness/skills/lit/SKILL.md', '---\nname: lit\nroles: ["DEV_ENGINEER"]\nallowedTools: ["Bash(node:*)"]\nautoApply: true\n---\n# lit\n');
  const g = governance(p, true);
  assert.ok(!g.QA_AUDITOR.withSkills.includes('Bash(npm test:*)'), 'old pointer strips npm test (the bug the brief found)');
  assert.ok(!g.DEV_ENGINEER.withSkills.some((r) => r.startsWith('Edit(')), 'a literal Bash(node:*) drops Edit/Write');
});

test('gate order 1: harness first, then add --all, update, doctor', () => {
  const p = mkdtempSync(join(tmpdir(), 'sf-g1-')); gitInit(p); installHarness(p);
  // a project upgraded from an old foundry: legacy deny rules and an old restrictive pointer
  run(p, ['add', 'test-planner', '--quiet']);
  const sf = JSON.parse(readFileSync(join(p, '.claude', 'settings.json'), 'utf8')); sf.permissions.deny.push('Write(.claude/skills/**)', 'Write(.harness/skills/**)'); w(p, '.claude/settings.json', sf);
  const old = readFileSync(join(p, '.harness', 'skills', 'test-planner', 'SKILL.md'), 'utf8').replace(/^keywords:/m, 'allowedTools: ["Read", "Edit", "Write"]\nkeywords:'); w(p, '.harness/skills/test-planner/SKILL.md', old);
  const before = run(p, ['doctor', '--json']); const b = JSON.parse(before.out.join('\n'));
  assert.equal(before.code, 2); assert.equal(b.case, 'A');
  assert.ok(b.items.some((i) => i.level === 'problem' && /strips .*QA_AUDITOR: .*Bash\(npm test:\*\)/.test(i.message)), 'doctor sees the old pointer stripping QA rules');
  assert.ok(b.items.some((i) => i.level === 'problem' && /Write\(path\)/.test(i.message)), 'doctor sees the invalid Write rules');

  const a = run(p, ['add', '--all']);
  assert.equal(a.code, 0);
  assert.ok(a.out.some((l) => /harness  ! spec-writer: .*without skill-foundry marker/.test(l)));
  assert.equal(readFileSync(join(p, '.harness', 'skills', 'spec-writer', 'SKILL.md'), 'utf8'), STUB, 'the project\'s stub is untouched');
  const cfg = JSON.parse(readFileSync(join(p, '.claude', 'settings.json'), 'utf8'));
  assert.ok(Object.values(cfg.permissions).flat().every((r) => !r.startsWith('Write(')), 'zero Write(...) rules');
  for (const d of DENY) assert.ok(cfg.permissions.deny.includes(d)); assert.ok(cfg.permissions.allow.includes('Bash(npm test:*)'), 'the harness rules are kept');
  assert.match(readFileSync(join(p, 'AGENTS.md'), 'utf8'), /<!-- agentic-harness -->[\s\S]*Harness rules stay here[\s\S]*skill-foundry:begin/);

  noStrip(governance(p));

  const snap = tree(p); run(p, ['add', '--all']); run(p, ['update']); run(p, ['add', '--role', 'QA_AUDITOR']);
  assert.deepEqual(tree(p), snap, 'add --all, update and add --role are idempotent: not one byte changes');

  const d = run(p, ['doctor', '--json']); const r = JSON.parse(d.out.join('\n'));
  assert.equal(d.code, 2, 'warnings remain'); assert.equal(r.counts.problem, 0, JSON.stringify(r.items.filter((i) => i.level === 'problem')));
  const msgs = r.items.filter((i) => i.level === 'warn').map((i) => i.message).join('\n');
  assert.match(msgs, /spec-writer: .*without the skill-foundry marker/);
  assert.match(msgs, /a11y-audit runs engine\/\*\.mjs scripts but role QA_AUDITOR may not run node/);
  assert.match(msgs, /team\.json: "lead-dev" lists skills/);
  assert.match(msgs, /gemini \(team\.json orchestrator\)/); assert.match(msgs, /orca \(config\.json profiles\)/);
  assert.ok(r.items.filter((i) => i.level !== 'ok').every((i) => i.level === 'info' || i.fix), 'every warning carries an exact fix');

  const s = run(p, ['update', 'spec-writer', '--sync-harness', '--quiet']);
  assert.ok(s.out.some((l) => /spec-writer.*replaced yours/.test(l)));
  assert.ok(!JSON.parse(run(p, ['doctor', '--json']).out.join('\n')).items.some((i) => /spec-writer: .*without the skill-foundry marker/.test(i.message)));
  noStrip(governance(p));
});

test('gate order 2: foundry first, then the harness installs over it', () => {
  const p = mkdtempSync(join(tmpdir(), 'sf-g2-')); gitInit(p);
  run(p, ['add', '--all', '--quiet']);
  const d0 = run(p, ['doctor', '--json']); assert.equal(d0.code, 0, d0.out.join('\n')); assert.equal(JSON.parse(d0.out.join('\n')).case, 'B');
  const stamps = Object.fromEntries(catalog().filter((s) => s.scope !== 'factory').map((s) => [s.name, readFileSync(join(p, '.claude', 'skills', s.name, '.foundry.json'), 'utf8')]));
  const foundryBlock = readFileSync(join(p, 'AGENTS.md'), 'utf8');

  installHarness(p); // KEEP_IF_PRESENT skills, AGENTS.md marker append, settings merge
  const md = readFileSync(join(p, 'AGENTS.md'), 'utf8');
  assert.ok(md.startsWith(foundryBlock.trimEnd()), 'the harness appended after the foundry block');
  assert.equal(run(p, ['check']).code, 0, 'foundry check passes');
  for (const [n, st] of Object.entries(stamps)) assert.equal(readFileSync(join(p, '.claude', 'skills', n, '.foundry.json'), 'utf8'), st, `${n} stamp unchanged`);

  const a = run(p, ['add', '--all', '--quiet']); assert.equal(a.code, 0);
  assert.ok(a.out.some((l) => /harness  ! spec-writer/.test(l)));
  for (const s of catalog().filter((x) => x.scope !== 'factory' && x.name !== 'spec-writer')) assert.match(readFileSync(join(p, '.harness', 'skills', s.name, 'SKILL.md'), 'utf8'), /installed-by: skill-foundry/, `${s.name} pointer written`);
  const after = readFileSync(join(p, 'AGENTS.md'), 'utf8');
  assert.equal(after.match(/skill-foundry:begin/g).length, 1); assert.equal(after.match(/<!-- agentic-harness -->/g).length, 1);
  assert.match(after, /Harness rules stay here/);
  const cfg = JSON.parse(readFileSync(join(p, '.claude', 'settings.json'), 'utf8'));
  for (const d of DENY) assert.ok(cfg.permissions.deny.includes(d)); assert.ok(cfg.permissions.ask.includes('Bash(git push:*)'));
  assert.ok(Object.values(cfg.permissions).flat().every((r) => !r.startsWith('Write(')));
  noStrip(governance(p));
  const d = run(p, ['doctor', '--json']); const r = JSON.parse(d.out.join('\n'));
  assert.equal(r.case, 'A'); assert.equal(r.counts.problem, 0);
  assert.equal(run(p, ['update', '--sync-harness', '--quiet']).code, 0);
  noStrip(governance(p));
  assert.equal(JSON.parse(run(p, ['doctor', '--json']).out.join('\n')).counts.problem, 0);
});
