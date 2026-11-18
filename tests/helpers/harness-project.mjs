/**
 * Shared helpers for the cross-project tests (gate and ownership line).
 * A "harness source" is a folder laid out like a project root that holds what the Agentic-Harness installer writes:
 * .harness/ (lib, roles, team.json, config.json, MANIFEST.json, skills/), .claude/settings.json, .claude/commands, AGENTS.md.
 * Real snapshots live in tests/fixtures/agentic-harness/<name>/ (read-only, never edited by hand).
 * @governed-by QA_AUDITOR
 */
import { mkdirSync, readFileSync, writeFileSync, cpSync, existsSync, readdirSync, statSync, mkdtempSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { main, DENY } from '../../src/factory/foundry.mjs';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const FIXTURES = join(ROOT, 'tests', 'fixtures', 'agentic-harness');
export const w = (p, f, text) => { mkdirSync(dirname(join(p, f)), { recursive: true }); writeFileSync(join(p, f), typeof text === 'string' ? text : JSON.stringify(text, null, 2)); };
export const rd = (p, f) => readFileSync(join(p, f), 'utf8');
export const run = (p, argv) => { const cwd = process.cwd(); const out = []; process.chdir(p); try { const code = main(argv, (l) => out.push(l)); return { code, out }; } finally { process.chdir(cwd); } };
export const gitInit = (p) => spawnSync('git', ['init', '-q'], { cwd: p });
export const newProject = (tag) => { const p = mkdtempSync(join(tmpdir(), `sf-${tag}-`)); gitInit(p); return p; };

/** Every file under dir as { 'relative/path': 'content' } (binary-safe through latin1 so byte differences always show). */
export function tree(dir, base = dir) {
  const out = {};
  for (const n of readdirSync(dir)) {
    if (n === '.git') continue;
    const f = join(dir, n);
    if (statSync(f).isDirectory()) Object.assign(out, tree(f, base));
    else out[f.slice(base.length + 1).split('\\').join('/')] = readFileSync(f).toString('latin1');
  }
  return out;
}
/** Paths whose bytes differ between two trees (added, removed or changed). */
export const changed = (a, b) => [...new Set([...Object.keys(a), ...Object.keys(b)])].filter((k) => a[k] !== b[k]).sort();

const RUNTIME = /^(inbox|completed|failed|staging|releases|visible|worktrees)\//;
/** Harness sources: vendored snapshots when present, always plus this repository's own copy (an older, full harness). */
export function harnessSources() {
  const out = [];
  if (existsSync(FIXTURES)) for (const n of readdirSync(FIXTURES).sort()) if (statSync(join(FIXTURES, n)).isDirectory()) out.push({ label: `snapshot ${n}`, dir: join(FIXTURES, n), snapshot: true });
  out.push({ label: 'this repository\'s own .harness copy', dir: ROOT, snapshot: false });
  return out;
}

/** Files a harness install writes, taken from `src` (a project-root-shaped folder). Runtime folders, our pointers and Skill Foundry's block are never part of a harness. */
function harnessFiles(src) {
  const files = {};
  const h = join(src, '.harness');
  if (existsSync(h)) for (const [k, v] of Object.entries(tree(h))) if (!RUNTIME.test(k) && !k.startsWith('memory/sessions/') && !/installed-by: skill-foundry/.test(v) && !k.endsWith('.gitkeep')) files[`.harness/${k}`] = v;
  for (const dir of ['.claude/commands', '.claude/agents']) if (existsSync(join(src, dir))) for (const [k, v] of Object.entries(tree(join(src, dir)))) files[`${dir}/${k}`] = v;
  return files;
}

/**
 * What `npx github:sumtaimo/Agentic-Harness .` leaves in a project (simulated from the source):
 * its files are written (kept if already there for the project-owned ones), skills it ships are written only when the project does not have them,
 * .claude/settings.json permissions are MERGED, AGENTS.md gets its marker block appended once.
 * `update: true` is the same run again, as an update (overwrites its own files, still keeps the project's own).
 * `worstCase: true` additionally replaces .claude/settings.json with the harness's own file (no merge), the least friendly thing an installer could do.
 */
export function installHarness(p, src, { update = false, worstCase = false } = {}) {
  const KEEP = /^\.harness\/(config\.json|team\.json|charter\.md|backlog\.json|memory\/|skills\/)/;
  for (const [f, text] of Object.entries(harnessFiles(src))) {
    const here = existsSync(join(p, f));
    if (here && KEEP.test(f)) continue;
    if (here && !update && !/^\.harness\/(lib|roles)\//.test(f)) continue;
    mkdirSync(dirname(join(p, f)), { recursive: true }); writeFileSync(join(p, f), Buffer.from(text, 'latin1'));
  }
  const rawTheirs = existsSync(join(src, '.claude', 'settings.json')) ? JSON.parse(rd(src, '.claude/settings.json')) : { permissions: {} };
  const theirs = { ...rawTheirs, permissions: { ...(rawTheirs.permissions ?? {}), deny: (rawTheirs.permissions?.deny ?? []).filter((d) => !DENY.includes(d)) } };
  const sf = join(p, '.claude', 'settings.json');
  if (worstCase || !existsSync(sf)) w(p, '.claude/settings.json', theirs.hooks ? { permissions: theirs.permissions, hooks: theirs.hooks } : { permissions: theirs.permissions });
  else {
    const cfg = JSON.parse(readFileSync(sf, 'utf8')); cfg.permissions ??= {};
    for (const [k, v] of Object.entries(theirs.permissions ?? {})) cfg.permissions[k] = [...new Set([...(cfg.permissions[k] ?? []), ...v])];
    if (theirs.hooks && !cfg.hooks) cfg.hooks = theirs.hooks;
    w(p, '.claude/settings.json', cfg);
  }
  const md = existsSync(join(p, 'AGENTS.md')) ? rd(p, 'AGENTS.md') : '';
  if (!md.includes('<!-- agentic-harness -->')) w(p, 'AGENTS.md', `${md}${md ? '\n' : ''}<!-- agentic-harness -->\n# Agentic harness\nHarness rules stay here.\n<!-- /agentic-harness -->\n`);
  // A harness ships its own starter skills; the project keeps any skill that is already there.
  const skills = join(src, '.harness', 'skills');
  if (existsSync(skills)) for (const n of readdirSync(skills)) {
    const f = join(skills, n, 'SKILL.md');
    if (existsSync(f) && !/installed-by: skill-foundry/.test(readFileSync(f, 'utf8')) && !existsSync(join(p, '.harness', 'skills', n, 'SKILL.md'))) w(p, `.harness/skills/${n}/SKILL.md`, rd(src, `.harness/skills/${n}/SKILL.md`));
  }
}

/** Real governance code of the project's harness: per role, the rules a worker gets with and without the installed skills. */
export function governance(p, { all = false } = {}) {
  const gov = pathToFileURL(join(p, '.harness', 'lib', 'governance.mjs')).href;
  const script = `import { loadSkills, loadRoles, computeAllowedTools, matchSkills } from ${JSON.stringify(gov)};
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
  if (r.status !== 0) throw new Error(`governance failed: ${r.stderr}`);
  return JSON.parse(r.stdout);
}
