/**
 * The ownership line between Skill Foundry and the Agentic-Harness, as tests (byte for byte).
 *
 * Skill Foundry may write or remove ONLY: .claude/skills/<name>/**, .harness/skills/<name>/SKILL.md (+ .orig),
 * the managed block in AGENTS.md and the Edit deny rules in .claude/settings.json. Nothing else in a project with a full harness
 * (config, team, roles, charter, backlog, memory, lib, hooks, MANIFEST, commands, agents, other root files) may change.
 * Conversely a harness install or update must not be able to undo the protection or the pointers, and Skill Foundry must notice and repair it if it does.
 * Runs against every harness source (vendored snapshots when present, always this repository's own full copy).
 * @governed-by QA_AUDITOR
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { catalog, DENY, LEGACY_DENY } from '../src/factory/foundry.mjs';
import { harnessSources, installHarness, newProject, run, tree, changed, w, rd, governance } from './helpers/harness-project.mjs';

const BEGIN = '<!-- skill-foundry:begin';
const END = '<!-- skill-foundry:end -->';
const portable = () => catalog().filter((s) => s.scope !== 'factory').map((s) => s.name);

/** A project with a full harness: the source's own files plus the root files an installer leaves. */
function fullHarness(src) {
  const p = newProject('own');
  installHarness(p, src);
  w(p, 'CLAUDE.md', '@AGENTS.md\n');
  w(p, 'GEMINI.md', '@AGENTS.md\n');
  w(p, '.github/copilot-instructions.md', 'See AGENTS.md\n');
  w(p, 'src/app.js', 'export const x = 1;\n');
  return p;
}

const stripBlock = (md) => { const i = md.indexOf(BEGIN); const j = md.indexOf(END); return i >= 0 && j > i ? md.slice(0, i) + md.slice(j + END.length) : md; };
const norm = (s) => s.replace(/\s+$/g, '').replace(/\n{3,}/g, '\n\n');
const withoutOurRules = (cfg) => { const c = structuredClone(cfg); if (c.permissions?.deny) { c.permissions.deny = c.permissions.deny.filter((d) => !DENY.includes(d) && !LEGACY_DENY.includes(d)); } return c; };

/** Asserts that going from `before` to `after` touched only what Skill Foundry owns, and nothing else byte for byte. */
function assertOnlyOurs(before, after, step) {
  const diff = changed(before, after);
  const ok = (f) => /^\.claude\/skills\/[^/]+\//.test(f) || /^\.harness\/skills\/[^/]+\/SKILL\.md(\.orig)?$/.test(f) || f === 'AGENTS.md' || f === '.claude/settings.json';
  const foreign = diff.filter((f) => !ok(f));
  assert.deepEqual(foreign, [], `${step}: Skill Foundry changed files it does not own`);
  if (diff.includes('AGENTS.md')) assert.equal(norm(stripBlock(after['AGENTS.md'] ?? '')), norm(stripBlock(before['AGENTS.md'] ?? '')), `${step}: text outside the managed block changed`);
  if (diff.includes('.claude/settings.json')) assert.deepEqual(withoutOurRules(JSON.parse(after['.claude/settings.json'])), withoutOurRules(JSON.parse(before['.claude/settings.json'])), `${step}: settings changed beyond our deny rules`);
  // a pointer is only ever written or removed under our marker, and the project's original is kept as .orig
  for (const f of diff.filter((x) => /^\.harness\/skills\/[^/]+\/SKILL\.md$/.test(x))) {
    if (after[f] !== undefined && before[f] !== undefined && !/installed-by: skill-foundry/.test(before[f])) assert.ok(after[f.replace(/$/, '.orig')] === before[f], `${step}: ${f} replaced without keeping the original as .orig`);
  }
  return diff;
}

for (const src of harnessSources()) {
  test(`ownership line [${src.label}]: add --all, update, remove and doctor --fix change only what Skill Foundry owns`, () => {
    const p = fullHarness(src.dir);
    const t0 = tree(p);
    // a project upgraded from an older foundry: legacy Write rules present (we may remove exactly those)
    const cfg = JSON.parse(rd(p, '.claude/settings.json')); cfg.permissions.deny = [...(cfg.permissions.deny ?? []), ...LEGACY_DENY]; w(p, '.claude/settings.json', cfg);
    const t1 = tree(p);

    assert.equal(run(p, ['add', '--all']).code, 0);
    const t2 = tree(p);
    const d2 = assertOnlyOurs(t1, t2, 'add --all');
    assert.ok(d2.some((f) => f.startsWith('.claude/skills/')) && d2.includes('AGENTS.md') && d2.includes('.claude/settings.json'), 'add --all really wrote our files');
    assert.ok(Object.keys(t2).filter((f) => /^\.harness\/skills\/[^/]+\/SKILL\.md$/.test(f)).some((f) => /installed-by: skill-foundry/.test(t2[f])), 'pointers exist');
    // the harness files the line protects are byte-identical to what the harness installed
    for (const f of Object.keys(t0).filter((x) => /^\.harness\/(config\.json|team\.json|charter\.md|backlog\.json|MANIFEST\.json|lib\/|roles\/|memory\/)|^\.claude\/(commands|agents)\/|^(CLAUDE|GEMINI)\.md$|^src\//.test(x))) assert.equal(t2[f], t0[f], `${f} unchanged`);

    run(p, ['update']); assertOnlyOurs(t2, tree(p), 'update');
    run(p, ['update', '--force']); const t3 = tree(p); assertOnlyOurs(t2, t3, 'update --force');

    // an out-of-date install: update changes our files only
    const name = portable()[0];
    const stamp = JSON.parse(t3[`.claude/skills/${name}/.foundry.json`]); stamp.hash = 'old'; w(p, `.claude/skills/${name}/.foundry.json`, stamp);
    const t4 = tree(p); run(p, ['update']); assertOnlyOurs(t4, tree(p), 'update of an out-of-date skill');

    // doctor --fix after something broke our parts (harness-independent damage to our own files only)
    const sf = JSON.parse(rd(p, '.claude/settings.json')); sf.permissions.deny = sf.permissions.deny.filter((d) => !DENY.includes(d)); w(p, '.claude/settings.json', sf);
    w(p, 'AGENTS.md', rd(p, 'AGENTS.md').replace(/- \*\*[^\n]*\n/, ''));
    const t5 = tree(p); run(p, ['doctor', '--fix']); const t6 = tree(p);
    const d6 = assertOnlyOurs(t5, t6, 'doctor --fix');
    assert.ok(d6.includes('.claude/settings.json') && d6.includes('AGENTS.md'), 'doctor --fix repaired the protection and the block');
    // plain doctor never writes
    const t7 = tree(p); run(p, ['doctor']); run(p, ['doctor', '--json']); run(p, ['check']); assert.deepEqual(changed(t7, tree(p)), [], 'doctor and check are read-only');

    // remove: our folder, our pointer and our line only; a project original comes back
    const t8 = tree(p); run(p, ['remove', name]); const t9 = tree(p);
    const d9 = assertOnlyOurs(t8, t9, 'remove');
    assert.ok(d9.every((f) => f.includes(name) || f === 'AGENTS.md'), `remove touched only ${name} and the AGENTS.md line: ${d9.join(', ')}`);
    assert.ok(!Object.keys(t9).some((f) => f.startsWith(`.claude/skills/${name}/`)));
    for (const x of portable().filter((n) => n !== name)) run(p, ['remove', x]);
    const end = tree(p);
    assertOnlyOurs(t9, end, 'remove the rest');
    // after removing everything the harness side is exactly as installed (apart from the deny rules and an empty managed block, which stay by design)
    for (const f of Object.keys(t0)) if (!['AGENTS.md', '.claude/settings.json'].includes(f)) assert.equal(end[f], t0[f], `${f} back to what the harness installed`);
  });

  test(`ownership line [${src.label}]: a harness install, then an update, cannot undo our protection or pointers`, () => {
    const p = newProject('own2');
    w(p, 'src/app.js', 'x\n');
    run(p, ['add', '--all', '--quiet']);                              // Skill Foundry first
    const stamps = Object.fromEntries(portable().map((n) => [n, tree(join(p, '.claude', 'skills', n))]));
    const mine = tree(p);

    for (const [step, opts] of [['harness install', {}], ['harness update', { update: true }]]) {
      installHarness(p, src.dir, opts);
      const after = tree(p);
      for (const n of portable()) assert.deepEqual(tree(join(p, '.claude', 'skills', n)), stamps[n], `${step}: .claude/skills/${n} unchanged`);
      const cfg = JSON.parse(rd(p, '.claude/settings.json'));
      for (const d of DENY) assert.ok(cfg.permissions.deny.includes(d), `${step}: deny rule ${d} survives`);
      assert.equal(run(p, ['check']).code, 0, `${step}: foundry check is clean`);
      assert.match(rd(p, 'AGENTS.md'), /skill-foundry:begin/, `${step}: our block survives`);
      assert.equal(rd(p, 'AGENTS.md').match(/<!-- agentic-harness -->/g).length, 1);
      if (step === 'harness install') {
        // the first harness run arrives after us: wire the skills, then everything must be healthy on our side
        run(p, ['add', '--all', '--quiet']);
      }
      for (const n of portable()) {
        const f = `.harness/skills/${n}/SKILL.md`;
        assert.ok(after[f] === undefined || /installed-by: skill-foundry|^---/.test(after[f]), f);
      }
      const d = JSON.parse(run(p, ['doctor', '--json']).out.join('\n'));
      assert.equal(d.counts.problem, 0, `${step}: ${JSON.stringify(d.items.filter((i) => i.level === 'problem'))}`);
      const ours = d.items.filter((i) => i.level === 'warn' && ['skills', 'AGENTS.md', '.claude/settings.json'].includes(i.area));
      assert.deepEqual(ours, [], `${step}: nothing on our side is unhealthy`);
      const pointers = readdirSync(join(p, '.harness', 'skills')).filter((n) => portable().includes(n) && /installed-by: skill-foundry/.test(rd(p, `.harness/skills/${n}/SKILL.md`)));
      assert.ok(pointers.length >= portable().length - 1, `${step}: our pointers are intact (${pointers.length} of ${portable().length}; a starter copy of the same name stays the project's until --sync-harness)`);
      const g = governance(p);
      for (const [role, x] of Object.entries(g)) assert.deepEqual(x.withSkills, x.base, `${step}: ${role} keeps every tool rule`);
    }
    assert.notDeepEqual(tree(p), mine);

    // worst case: the harness replaces .claude/settings.json outright. We must notice and be able to repair it.
    installHarness(p, src.dir, { update: true, worstCase: true });
    const lost = JSON.parse(rd(p, '.claude/settings.json'));
    assert.ok(DENY.some((d) => !lost.permissions.deny?.includes(d)), 'the worst case really removed the protection');
    const d = JSON.parse(run(p, ['doctor', '--json']).out.join('\n'));
    assert.ok(d.items.some((i) => i.level === 'warn' && i.area === '.claude/settings.json' && /not protected/.test(i.message)), 'doctor reports the lost protection');
    run(p, ['doctor', '--fix']);
    const fixed = JSON.parse(rd(p, '.claude/settings.json'));
    for (const x of DENY) assert.ok(fixed.permissions.deny.includes(x));
    assert.deepEqual(withoutOurRules(fixed), withoutOurRules(lost), 'the repair added our rules and nothing else');
  });
}

test('ownership control: the checker does fail when a foreign file, text outside the block or other settings change', () => {
  const p = fullHarness(harnessSources().at(-1).dir);
  run(p, ['add', 'test-planner', '--quiet']);
  const base = tree(p);
  const mutate = (f, fn) => { const before = tree(p); w(p, f, fn(rd(p, f))); const after = tree(p); w(p, f, before[f]); return after; };
  assert.throws(() => assertOnlyOurs(base, mutate('.harness/team.json', (t) => t.replace('{', '{ "x": 1,')), 'x'), /does not own/);
  assert.throws(() => assertOnlyOurs(base, mutate('.harness/roles/qa-auditor.json', (t) => `${t} `), 'x'), /does not own/);
  assert.throws(() => assertOnlyOurs(base, mutate('AGENTS.md', (t) => `extra line\n${t}`), 'x'), /outside the managed block/);
  assert.throws(() => assertOnlyOurs(base, mutate('.claude/settings.json', (t) => { const c = JSON.parse(t); c.permissions.allow.pop(); return JSON.stringify(c, null, 2); }), 'x'), /beyond our deny rules/);
  assert.doesNotThrow(() => assertOnlyOurs(base, mutate('.claude/skills/test-planner/SKILL.md', (t) => `${t}\nedit`), 'x'), 'a change inside our own skill folder is allowed');
});
