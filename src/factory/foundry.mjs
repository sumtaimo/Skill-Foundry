#!/usr/bin/env node
/**
 * skill-foundry: add Skill Foundry skills to any project and keep them up to date.
 *
 *   npx github:sumtaimo/Skill-Foundry list                 ready skills, version, roles
 *   npx github:sumtaimo/Skill-Foundry add test-planner     install into .claude/skills/
 *   npx github:sumtaimo/Skill-Foundry add --role QA_AUDITOR  every ready skill for that role
 *   npx github:sumtaimo/Skill-Foundry add --all              every skill that works outside this repository
 *   npx github:sumtaimo/Skill-Foundry check                which installed skills are out of date or changed locally
 *   npx github:sumtaimo/Skill-Foundry remove <name>        remove one cleanly (folder, harness pointer, AGENTS.md line)
 *   npx github:sumtaimo/Skill-Foundry update [name…]       update them; files you changed are kept
 *   npx github:sumtaimo/Skill-Foundry doctor [--fix] [--json]  diagnose the project (harness or not) with the exact fix per finding; exit 0 healthy, 2 findings, 1 usage
 *   add|update ... --sync-harness                         replace a project's own .harness/skills/<name> with the foundry pointer (original kept as SKILL.md.orig)
 *   add|update ... --quiet                                no doctor summary after the install
 *
 * Each install writes `.claude/skills/<name>/.foundry.json` (version, content hash, a hash per file), so `check`
 * and `update` know what came from the foundry and what the user changed. When the project has an agentic harness
 * (`.harness/skills/`), the skill is also registered there with the roles from the registry, so harness workers in
 * those roles get it automatically.
 * @governed-by PO_ARCHITECT
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, copyFileSync, realpathSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, resolve, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const HERE = fileURLToPath(import.meta.url);
const REPO = resolve(dirname(HERE), '..', '..');
/** Roles the Agentic-Harness knows (checked against v1.0.22 lab). A project's own `.harness/roles/*.json` adds more; see projectRoles(). */
export const ROLES = ['PO_ARCHITECT', 'BA_ANALYST', 'DEV_ENGINEER', 'QA_AUDITOR', 'UX_DESIGNER', 'REVIEWER', 'SECURITY', 'COORDINATOR'];
const STAMP = '.foundry.json';
const MARK = 'installed-by: skill-foundry';
/** Format version of the harness pointer and `.foundry.json` (not a skill version). A harness skips a pointer whose schema is newer than it knows. */
export const SCHEMA_VERSION = 1;

const sha = (b) => createHash('sha256').update(b).digest('hex');
// File hashes ignore line endings: git with core.autocrlf turns LF into CRLF on a Windows checkout, and that must not
// read as a local edit (`check` would report the skill changed and `update` would keep the old files). Binary files
// (any NUL byte) are hashed as they are.
const lf = (b) => (b.includes(0) ? b : Buffer.from(b.toString('utf8').replace(/\r\n/g, '\n')));
const fileSha = (p) => sha(lf(readFileSync(p)));
/**
 * Does the file still match its stamp hash? Stamps written before line endings were ignored hold a raw-byte hash, which
 * on a Windows install was the CRLF form, so the LF, the raw and the CRLF forms all count.
 */
const sameAs = (p, h) => {
  if (!h) return false;
  const b = readFileSync(p); const n = lf(b);
  return sha(n) === h || sha(b) === h || (n !== b && sha(Buffer.from(n.toString('utf8').replace(/\n/g, '\r\n'))) === h);
};
/**
 * A stamp matches a source folder when its hash is the source's, or, for a stamp written with raw CRLF hashes, when the
 * stamp is consistent with its own file list and every source file matches it line endings aside.
 */
const stampMatches = (st, dir, src) => st.hash === total(src)
  || (!!st.files && st.hash === total(st.files) && Object.keys(st.files).sort().join('\n') === Object.keys(src).sort().join('\n')
    && Object.entries(st.files).every(([f, h]) => sameAs(join(dir, f), h)));
/** Project/product version of Skill Foundry itself (from package.json), separate from each skill's own version. */
export function foundryVersion(root = REPO) {
  try { const v = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version; return typeof v === 'string' && v.trim() ? v.trim() : null; } catch { return null; }
}
function files(dir, base = dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...files(p, base));
    else if (e.name !== STAMP) out.push(relative(base, p).split(sep).join('/'));
  }
  return out.sort();
}
// Evals are the lab's tests, not part of the skill a user runs: their prompts and recordings would only lead a user's agent to read test data.
const SHIPPED = (f) => !/^evals\//.test(f);
const hashes = (dir) => Object.fromEntries(files(dir).filter(SHIPPED).map((f) => [f, fileSha(join(dir, f))]));
const total = (h) => sha(Object.entries(h).map(([f, x]) => `${f}:${x}`).join('\n'));

/** @param {{root?:string}} [o] */
export function catalog({ root = REPO } = {}) {
  const reg = JSON.parse(readFileSync(join(root, 'src', 'factory', 'registry.json'), 'utf8'));
  // A shipped package holds only the skills that work outside this repository; skip any that are not there.
  return reg.filter((r) => r.status === 'ready' && existsSync(join(root, 'src', 'skills', r.name, 'SKILL.md'))).map((r) => {
    const md = readFileSync(join(root, 'src', 'skills', r.name, 'SKILL.md'), 'utf8');
    const description = /^description:\s*(.+)$/m.exec(md)?.[1].trim() ?? '';
    return { name: r.name, version: String(r.version), roles: r.roles ?? [], keywords: Array.isArray(r.keywords) ? r.keywords : [], engine: ['required', 'optional'].includes(r.engine) ? r.engine : null, isDefault: r.default === true, scope: /^scope:\s*factory/m.test(md) ? 'factory' : 'portable', description, dir: join(root, 'src', 'skills', r.name) };
  });
}

/** Role definitions of the project's agentic harness (`.harness/roles/*.json`), keyed by upper-case name. Empty without a harness. */
export function projectRoles(project) {
  const dir = join(project, '.harness', 'roles');
  const out = {};
  if (!existsSync(dir)) return out;
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.json'))) {
    try { const r = JSON.parse(readFileSync(join(dir, f), 'utf8')); if (r?.name) out[String(r.name).toUpperCase()] = { ...r, file: f }; } catch { /* not a role file */ }
  }
  return out;
}
/** Roles `--role` accepts here: the known ones plus any the project's harness defines. */
export const allowedRoles = (project) => [...new Set([...ROLES, ...Object.keys(projectRoles(project))])];

const hasEngine = (s) => existsSync(join(s.dir, 'engine'));
/**
 * The pointer's `allowedTools`. The harness narrows a worker's tools to what a skill lists and DROPS every tool it does not
 * mention (governance.mjs computeAllowedTools), and a literal "Bash(node:*)" would replace the role's whole Bash rule set and drop Edit/Write.
 * So: no line at all (the role's rules stay as they are) for ordinary skills, and bare names `Edit, Write, Bash` for skills with an
 * engine/ folder: a bare name keeps that tool's role rules unchanged and tells the doctor the skill runs scripts.
 */
const pointerTools = (s) => (hasEngine(s) ? ['Edit', 'Write', 'Bash'] : []);

/**
 * Agentic-Harness starter copies of a skill Skill Foundry ships. Skill Foundry wins over them: they are replaced
 * automatically and the original is kept as SKILL.md.orig. A copy is recognised by the starter marker or by its exact
 * content (sha-256 of the text with LF line ends, trimmed), never by its name alone; any other file with the same name is the user's own.
 */
const STARTER_MARK = 'starter-stub: agentic-harness';
const STARTER_SHA = {
  'spec-writer': ['7fb11973a154c1caa78e5451d023eeb203a62208d6c0066a22d8195319546ebd'],
  'ui-craft': ['70dc022a35d83d96feb8e58f4d42adfd202367a4371c396f44d16b513407ad93'],
};
export function isStarterStub(name, text) {
  if (text.includes(STARTER_MARK)) return true;
  return (STARTER_SHA[name] ?? []).includes(sha(Buffer.from(text.replace(/\r\n?/g, '\n').trim())));
}

/** Capability flag, not a version number: does the project's harness match keywords for every member (also leads with an explicit skills list)? */
export function harnessMatchesKeywords(project) {
  const gov = join(project, '.harness', 'lib', 'governance.mjs');
  return existsSync(gov) && /SKILL_MATCH\s*=\s*['"]keywords-with-explicit['"]/.test(readFileSync(gov, 'utf8'));
}

/**
 * Register the skill with the project's agentic harness (`.harness/skills/<name>/SKILL.md`).
 * @returns {null | {path:string, status:'written'|'collision'|'replaced'|'replaced-starter'}}  null when the project has no harness skills folder
 */
function harnessPointer(project, s, { syncHarness = false } = {}) {
  const dir = join(project, '.harness', 'skills');
  if (!existsSync(dir)) return null;
  const file = join(dir, s.name, 'SKILL.md');
  const rel = relative(project, file).split(sep).join('/');
  let status = 'written';
  if (existsSync(file) && !readFileSync(file, 'utf8').includes(MARK)) {
    const starter = isStarterStub(s.name, readFileSync(file, 'utf8'));
    if (!syncHarness && !starter) return { path: rel, status: 'collision' }; // the project's own skill wins unless the user passes --sync-harness
    const keep = `${file}.orig`;
    if (!existsSync(keep)) copyFileSync(file, keep); // never lose the original
    status = starter ? 'replaced-starter' : 'replaced';
  }
  mkdirSync(dirname(file), { recursive: true });
  // The harness injects a skill into a worker only when its role matches AND (autoApply OR a keyword is in the prompt).
  // A harness that exports SKILL_MATCH = 'keywords-with-explicit' applies keywords for every member, so the pointer can use
  // autoApply: false and the agent gets only the skills that fit its task. An older harness gets autoApply: true so no skill is lost.
  // The pointer is a few lines; the full skill is read on demand.
  const tags = (() => { try { return JSON.parse(readFileSync(join(s.dir, 'preview.json'), 'utf8')).tags ?? []; } catch { return []; } })();
  const keywords = s.keywords?.length ? s.keywords : tags;
  const tools = pointerTools(s);
  writeFileSync(file, `---\nschema_version: ${SCHEMA_VERSION}\nname: ${s.name}\ndescription: ${s.description}\nroles: ${JSON.stringify(s.roles)}\n${tools.length ? `allowedTools: ${JSON.stringify(tools)}\n` : ''}keywords: ${JSON.stringify(keywords)}\n${s.engine && hasEngine(s) ? `engine: ${s.engine}\n` : ''}autoApply: ${harnessMatchesKeywords(project) ? 'false' : 'true'}\n${MARK} ${s.version}\n---\n` +
    `# ${s.name}\n\nWhen the task matches this skill (${s.description.split('. ')[0]}.), read \`.claude/skills/${s.name}/SKILL.md\` and follow it, starting from the goal the user states. When the task does not match, ignore this skill.\n`);
  return { path: rel, status };
}

/**
 * Install or update one skill. Files the user changed since the last install are kept unless `force`.
 * @returns {{name:string, action:'added'|'updated'|'current', kept:string[], harness:string|null, harnessStatus:string|null}}
 */
export function addSkill(name, { project = process.cwd(), root = REPO, force = false, syncHarness = false } = {}) {
  const s = catalog({ root }).find((x) => x.name === name);
  if (!s) throw new Error(`unknown or not ready skill "${name}" (see: list)`);
  if (s.scope === 'factory') throw new Error(`${name} only works inside the Skill Foundry repository`);
  const target = join(project, '.claude', 'skills', name);
  const src = hashes(s.dir);
  const stampPath = join(target, STAMP);
  const old = existsSync(stampPath) ? JSON.parse(readFileSync(stampPath, 'utf8')) : null;
  if (existsSync(target) && !old && !force) throw new Error(`${target} exists and was not installed by skill-foundry (use --force)`);
  const ptr = () => { const p = harnessPointer(project, s, { syncHarness }); return { harness: p && p.status !== 'collision' ? p.path : null, harnessStatus: p?.status ?? null, harnessPath: p?.path ?? null }; };
  const locallyModified = old && Object.entries(old.files ?? {}).some(([f, h]) => !existsSync(join(target, f)) || !sameAs(join(target, f), h));
  if (old && stampMatches(old, s.dir, src) && !(force && locallyModified)) return { name, action: 'current', kept: [], ...ptr() };
  const kept = [];
  for (const f of Object.keys(src)) {
    const to = join(target, f);
    if (old && existsSync(to) && !force) {
      if (!sameAs(to, old.files?.[f]) && !sameAs(to, src[f])) { kept.push(f); continue; }
    }
    mkdirSync(dirname(to), { recursive: true });
    copyFileSync(join(s.dir, f), to);
  }
  for (const f of Object.keys(old?.files ?? {})) if (!(f in src) && !kept.includes(f)) rmSync(join(target, f), { force: true });
  const pv = foundryVersion(root);
  writeFileSync(stampPath, JSON.stringify({ schemaVersion: SCHEMA_VERSION, name, version: s.version, ...(pv ? { foundryVersion: pv } : {}), hash: total(src), source: 'github:sumtaimo/Skill-Foundry', files: src }, null, 2) + '\n');
  return { name, action: old ? 'updated' : 'added', kept, ...ptr() };
}

const BEGIN = '<!-- skill-foundry:begin (managed by `npx github:sumtaimo/Skill-Foundry`; edits inside are replaced) -->';
const END = '<!-- skill-foundry:end -->';
const CLI = 'npx github:sumtaimo/Skill-Foundry';
/** The managed AGENTS.md block for the skills installed in `project`. */
function rulesBlock({ project, root }) {
  const cat = new Map(catalog({ root }).map((s) => [s.name, s]));
  const rows = checkProject({ project, root }).map((x) => cat.get(x.name)).filter(Boolean);
  const text = `${BEGIN}\n## Skills\n\nThis project has these skills in \`.claude/skills/\`. When a task matches one, read its \`SKILL.md\` first and follow it, starting from the goal the user states. Use one skill per step; when a request needs several, use them in the order the request gives.\n\n` +
    `**When you chain skills, keep the context small:**\n` +
    `1. Load only the active skill's \`SKILL.md\` and the files that step needs. When the step is done, stop following that skill.\n` +
    `2. Hand off through files, not text: save each step's result to a file and give the next step only its path and the key facts. Never paste raw file contents, search logs or long reasoning into the next step.\n` +
    `3. End each step with one compact JSON note: \`{"step_completed":"<skill>","verified_facts":["<fact + file or line>"],"gaps_or_risks":["<blocker or edge case>"],"next_skill_input":{"target_scope":"<files>","action_required":"<one sentence>"}}\`\n` +
    `4. If something blocks a skill, tell the user and point to \`${CLI} doctor\`; do not edit harness or permission files yourself.\n\n` +
    `**Never edit, delete or overwrite anything under \`.claude/skills/\` or \`.harness/skills/\`.** Skills are changed only by the user, with \`${CLI} update\`. If a skill seems wrong, say so in your answer instead of editing it.\n\n` +
    rows.map((s) => `- **${s.name}** (\`.claude/skills/${s.name}/SKILL.md\`): ${s.description}`).join('\n') + `\n\nUpdate them with \`${CLI} update\`. Check the setup with \`${CLI} doctor\`.\n${END}\n`;
  return { block: text, skills: rows.map((s) => s.name) };
}
/**
 * Write (or refresh) one managed block in the project's AGENTS.md, read by Codex, Cursor, Gemini and others, so agents
 * that do not load `.claude/skills/` still know which skills exist and when to use each. Text outside the block is never touched.
 */
export function writeRules({ project = process.cwd(), root = REPO } = {}) {
  const { block, skills } = rulesBlock({ project, root });
  const file = join(project, 'AGENTS.md');
  const old = existsSync(file) ? readFileSync(file, 'utf8') : '';
  const i = old.indexOf(BEGIN); const j = old.indexOf(END);
  const next = i >= 0 && j > i ? old.slice(0, i) + block + old.slice(j + END.length).replace(/^\r?\n/, '') : (old ? `${old.replace(/(?:\r?\n)*$/, '\n\n')}${block}` : `# AGENTS.md\n\n${block}`);
  if (next !== old) writeFileSync(file, next);
  return { file: 'AGENTS.md', skills };
}

// Edit(path) covers every file tool in Claude Code; a Write(path) rule is reported as invalid, so we never write one.
export const DENY = ['Edit(.claude/skills/**)', 'Edit(.harness/skills/**)', 'Bash(npx github:sumtaimo/Skill-Foundry update*)', 'Bash(npx github:sumtaimo/Skill-Foundry add*)'];
/** Rules older versions wrote; Claude Code reports them as invalid, so protectSkills removes exactly these. */
export const LEGACY_DENY = ['Write(.claude/skills/**)', 'Write(.harness/skills/**)'];
/**
 * Guard rail so the user's agent cannot change the installed skills: deny rules in the project's `.claude/settings.json`,
 * merged into what is there (existing settings and rules are kept; only our own legacy Write(...) rules are removed).
 * Not a lock: only the user changes skills, by running `update` themselves.
 */
export function protectSkills({ project = process.cwd() } = {}) {
  const file = join(project, '.claude', 'settings.json');
  let cfg = {};
  if (existsSync(file)) { try { cfg = JSON.parse(readFileSync(file, 'utf8')); } catch { return { file: '.claude/settings.json', added: [], removed: [], skipped: 'not valid JSON, left untouched' }; } }
  cfg.permissions = cfg.permissions && typeof cfg.permissions === 'object' ? cfg.permissions : {};
  const deny = Array.isArray(cfg.permissions.deny) ? cfg.permissions.deny : [];
  const removed = LEGACY_DENY.filter((d) => deny.includes(d));
  const kept = deny.filter((d) => !LEGACY_DENY.includes(d));
  const added = DENY.filter((d) => !kept.includes(d));
  if (added.length || removed.length) { cfg.permissions.deny = [...kept, ...added]; mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, JSON.stringify(cfg, null, 2) + '\n'); }
  return { file: '.claude/settings.json', added, removed };
}

/** Remove a foundry skill cleanly: its folder, its harness pointer (the project's original, if --sync-harness replaced it, comes back) and its line in the AGENTS.md block. The user's own skills are never touched. */
export function removeSkill(name, { project = process.cwd(), root = REPO } = {}) {
  const target = join(project, '.claude', 'skills', name);
  if (!existsSync(join(target, STAMP))) throw new Error(`${name} was not installed by skill-foundry here`);
  rmSync(target, { recursive: true, force: true });
  const ptr = join(project, '.harness', 'skills', name);
  if (existsSync(join(ptr, 'SKILL.md')) && readFileSync(join(ptr, 'SKILL.md'), 'utf8').includes(MARK)) {
    if (existsSync(join(ptr, 'SKILL.md.orig'))) { copyFileSync(join(ptr, 'SKILL.md.orig'), join(ptr, 'SKILL.md')); rmSync(join(ptr, 'SKILL.md.orig')); } else rmSync(ptr, { recursive: true, force: true });
  }
  const agents = join(project, 'AGENTS.md');
  if (existsSync(agents) && readFileSync(agents, 'utf8').includes(BEGIN)) writeRules({ project, root });
  return { name, action: 'removed' };
}

/** Installed foundry skills and whether each is current. */
export function checkProject({ project = process.cwd(), root = REPO } = {}) {
  const dir = join(project, '.claude', 'skills');
  if (!existsSync(dir)) return [];
  const cat = new Map(catalog({ root }).map((s) => [s.name, s]));
  const latestFoundry = foundryVersion(root);
  return readdirSync(dir).filter((n) => existsSync(join(dir, n, STAMP))).map((n) => {
    const st = JSON.parse(readFileSync(join(dir, n, STAMP), 'utf8'));
    const s = cat.get(n);
    // Files whose content differs from what was installed: someone (or an agent) edited the skill.
    const modified = Object.entries(st.files ?? {}).filter(([f, h]) => { const p = join(dir, n, f); return !existsSync(p) || !sameAs(p, h); }).map(([f]) => f);
    return { name: n, installed: st.version, latest: s?.version ?? null, foundryVersion: st.foundryVersion ?? null, latestFoundry, current: !!s && stampMatches(st, s.dir, hashes(s.dir)), modified };
  });
}

// ───────────── doctor ─────────────
const READ_ONLY = new Set(['Read', 'Glob', 'Grep', 'LS']);
const baseTool = (r) => String(r).split('(')[0].trim();
/** Same rule as the harness (.harness/lib/governance.mjs `covers`): same tool, equal or a ":*" prefix match. */
function covers(roleRule, skillRule) {
  if (roleRule === skillRule) return true;
  const ri = (roleRule.match(/\((.*)\)$/) || [])[1]; const si = (skillRule.match(/\((.*)\)$/) || [])[1];
  if (baseTool(roleRule) !== baseTool(skillRule) || ri === undefined || si === undefined || !ri.endsWith(':*')) return false;
  const prefix = ri.slice(0, -2);
  return si === prefix || si.startsWith(`${prefix} `) || si.startsWith(`${prefix}:`);
}
/** What the harness leaves of a role's rules after a skill with this `allowedTools` list (a copy of computeAllowedTools' narrowing step; harness 1.0.34+ also keeps the role's mcp__ rules). */
function narrow(roleRules, list) {
  if (!list.length) return roleRules;
  const bare = new Set(list.filter((r) => !r.includes('(')).map(baseTool));
  const exact = new Map();
  for (const r of list.filter((x) => x.includes('('))) exact.set(baseTool(r), [...(exact.get(baseTool(r)) || []), r]);
  const out = roleRules.filter((r) => READ_ONLY.has(baseTool(r)) || baseTool(r).startsWith('mcp__') || bare.has(baseTool(r)));
  for (const [t, rules] of exact) if (!bare.has(t)) for (const sr of rules) if (roleRules.some((r) => covers(r, sr))) out.push(sr);
  return [...new Set(out)];
}
const frontList = (raw, key) => { const m = new RegExp(`^${key}:\\s*(\\[.*\\])\\s*$`, 'm').exec(raw); if (!m) return []; try { return JSON.parse(m[1]); } catch { return []; } };
const readJson = (f) => { try { return JSON.parse(readFileSync(f, 'utf8')); } catch { return null; } };

/**
 * Read-only diagnosis of a project. Every finding has a level (ok | warn | problem | info), what is wrong and the exact fix.
 * @returns {{case:'A'|'B', project:string, counts:{ok:number,warn:number,problem:number}, healthy:boolean, items:{level:string, area:string, message:string, fix?:string}[]}}
 */
export function doctorProject({ project = process.cwd(), root = REPO } = {}) {
  const items = [];
  const add = (level, area, message, fix) => items.push({ level, area, message, ...(fix ? { fix } : {}) });
  const pv = foundryVersion(root);
  if (pv) add('ok', 'foundry', `Skill Foundry ${pv}`);
  const harness = existsSync(join(project, '.harness'));
  const cat = new Map(catalog({ root }).map((s) => [s.name, s]));

  const major = Number(process.versions.node.split('.')[0]);
  major >= 18 ? add('ok', 'node', `Node ${process.versions.node}`) : add('problem', 'node', `Node ${process.versions.node} is older than 18`, 'install Node 18 or newer');
  const g = spawnSync('git', ['rev-parse', '--is-inside-work-tree'], { cwd: project, encoding: 'utf8' });
  if (g.error) add('warn', 'git', 'git is not installed', 'install git; the harness and update rely on it');
  else if (g.status !== 0) add('warn', 'git', 'this folder is not a git repository', 'git init');
  else add('ok', 'git', 'git repository');

  // skills installed by the foundry
  const installed = checkProject({ project, root });
  if (!installed.length) add('warn', 'skills', 'no Skill Foundry skills installed', `${CLI} add --all   (or add <skill> | add --role <ROLE>)`);
  const olderFoundry = [...new Set(installed.map((x) => x.foundryVersion).filter((v) => v && pv && v !== pv))];
  if (olderFoundry.length) add('info', 'foundry', `installed skills were stamped under Skill Foundry ${olderFoundry.join(', ')} (now ${pv})`, `${CLI} list`);
  if (existsSync(join(project, '.harness', 'foundry-default.json'))) {
    const installedNames = new Set(installed.map((x) => x.name));
    const missingDefaults = [...cat.values()].filter((s) => s.scope !== 'factory' && s.isDefault && !installedNames.has(s.name)).map((s) => s.name);
    if (missingDefaults.length) add('info', 'skills', `new default skill(s) available (${missingDefaults.join(', ')})`, `${CLI} add --default`);
  }
  for (const x of installed) {
    if (!x.latest) add('warn', 'skills', `${x.name}: not in the current catalog (removed or not ready)`, `${CLI} remove ${x.name}`);
    else if (!x.current) add('warn', 'skills', `${x.name} ${x.installed} is out of date`, `${CLI} update ${x.name}`);
    else add('ok', 'skills', `${x.name} ${x.installed} is current`);
    if (x.modified.length) add('warn', 'skills', `${x.name}: changed locally (${x.modified.join(', ')})`, `update keeps your edits; ${CLI} update ${x.name} --force restores the original`);
  }
  const skillsDir = join(project, '.claude', 'skills');
  for (const s of cat.values()) {
    if (s.scope !== 'factory' && existsSync(join(skillsDir, s.name)) && !existsSync(join(skillsDir, s.name, STAMP))) add('warn', 'skills', `.claude/skills/${s.name} exists but was not installed by skill-foundry`, `${CLI} add ${s.name} --force  (replaces it) or keep yours`);
  }

  // AGENTS.md block
  if (installed.length) {
    const f = join(project, 'AGENTS.md');
    const md = existsSync(f) ? readFileSync(f, 'utf8') : '';
    const i = md.indexOf(BEGIN); const j = md.indexOf(END);
    if (i < 0 || j < i) add('warn', 'AGENTS.md', 'no skill-foundry block: agents that do not load .claude/skills/ will not know the skills', `${CLI} update   (writes the block; text outside it is never touched)`);
    else if (md.slice(i, j + END.length).replace(/\r\n?/g, '\n') !== rulesBlock({ project, root }).block.trimEnd()) add('warn', 'AGENTS.md', 'the skill-foundry block is old or lists other skills than are installed', `${CLI} update`);
    else add('ok', 'AGENTS.md', 'skill-foundry block is current');
  }

  // .claude/settings.json
  const sf = join(project, '.claude', 'settings.json');
  if (existsSync(sf)) {
    const cfg = readJson(sf);
    if (!cfg) add('problem', '.claude/settings.json', 'not valid JSON, so no permission rule in it works', 'fix the JSON by hand (doctor never rewrites it)');
    else {
      const deny = Array.isArray(cfg.permissions?.deny) ? cfg.permissions.deny : [];
      const legacy = LEGACY_DENY.filter((d) => deny.includes(d));
      if (legacy.length) add('problem', '.claude/settings.json', `invalid rule(s) ${legacy.join(', ')}: Claude Code reports Write(path) rules as invalid (Edit(path) covers every file tool)`, `${CLI} doctor --fix   (replaces them with the Edit(...) rules)`);
      else if (installed.length && DENY.some((d) => !deny.includes(d))) add('warn', '.claude/settings.json', 'the installed skills are not protected from edits by agents', `${CLI} update   (or add: ${DENY.filter((d) => !deny.includes(d)).join(', ')} to permissions.deny)`);
      else if (installed.length) add('ok', '.claude/settings.json', 'skills are protected from edits by agents');
    }
  } else if (installed.length) add('warn', '.claude/settings.json', 'missing: the installed skills are not protected from edits by agents', `${CLI} update`);

  if (harness) {
    // ── Case A: the project has an agentic harness
    const man = readJson(join(project, '.harness', 'MANIFEST.json'));
    if (man) add('ok', 'harness', `harness template ${man.version ?? man.template ?? 'version unknown'}`);
    else add('warn', 'harness', '.harness/MANIFEST.json not found: an older harness without a manifest', 'update it: npx github:sumtaimo/Agentic-Harness#release .   (never use --reset)');
    const roles = projectRoles(project);
    const hs = join(project, '.harness', 'skills');
    for (const x of installed) {
      const s = cat.get(x.name); if (!s) continue;
      const file = join(hs, x.name, 'SKILL.md');
      if (!existsSync(hs) || !existsSync(file)) { add('warn', 'harness', `${x.name}: no pointer in .harness/skills/, so harness workers do not get it`, `${CLI} add ${x.name}`); continue; }
      const raw = readFileSync(file, 'utf8');
      if (!raw.includes(MARK)) {
        const starter = isStarterStub(x.name, raw); // the harness's own starter copy: a plain update replaces it, keeping SKILL.md.orig
        add('warn', 'harness', `${x.name}: .harness/skills/${x.name}/SKILL.md ${starter ? 'is the harness starter copy' : 'already exists without the skill-foundry marker'}, so the foundry skill is not wired to workers`, starter ? `${CLI} update ${x.name}   (replaces the starter copy, keeps the original as SKILL.md.orig)` : `${CLI} update ${x.name} --sync-harness   (replaces it, keeps the original as SKILL.md.orig) or keep yours`); continue;
      }
      const auto = /^autoApply:\s*(true|false)/m.exec(raw)?.[1];
      if (harnessMatchesKeywords(project) && auto === 'true') add('warn', 'harness', `${x.name}: its pointer injects the skill into every task of its roles (autoApply: true) although this harness can inject by keyword`, `${CLI} update ${x.name}   (writes the keyword pointer: only tasks that fit get the skill)`);
      if (!harnessMatchesKeywords(project) && auto === 'false') add('warn', 'harness', `${x.name}: its pointer needs a harness with SKILL_MATCH, which this harness does not export, so leads with an explicit skills list never get it`, `${CLI} update ${x.name}   (writes autoApply: true), or update the harness`);
      const pRoles = frontList(raw, 'roles'); const tools = frontList(raw, 'allowedTools');
      const known = pRoles.filter((r) => roles[String(r).toUpperCase()]);
      if (pRoles.length && !known.length) add('problem', 'harness', `${x.name}: none of its roles (${pRoles.join(', ')}) exist in .harness/roles/, so it is never injected`, `add a role file for one of them, or ${CLI} update ${x.name}`);
      let lost = [];
      for (const r of known) {
        const role = roles[String(r).toUpperCase()];
        const rules = role.allowedTools || [];
        const left = narrow(rules, tools);
        const gone = rules.filter((q) => !left.includes(q) && !READ_ONLY.has(baseTool(q)));
        if (gone.length) lost.push(`${role.name}: ${gone.join(', ')}`);
      }
      if (lost.length) add('problem', 'harness', `${x.name}: its pointer allowedTools ${JSON.stringify(tools)} strips ${lost.join('; ')} from workers`, `${CLI} update ${x.name}   (writes a pointer that keeps the role's rules)`);
      else add('ok', 'harness', `${x.name}: pointer keeps every role rule`);
      if (hasEngine(s)) for (const r of known) {
        const role = roles[String(r).toUpperCase()];
        if ((role.allowedTools || []).some((q) => covers(q, 'Bash(node:*)'))) continue;
        // `engine: optional` in the pointer (data, never the skill's name) means the skill documents a script-less fallback.
        const mode = /^engine:\s*(required|optional)\s*$/m.exec(raw)?.[1] ?? s.engine;
        if (mode === 'optional') add('info', 'harness', `${x.name} has an engine/*.mjs script; role ${role.name} may not run node, so it uses the documented script-less fallback (less precise). Give the engine step to DEV_ENGINEER`);
        else add('warn', 'harness', `${x.name} runs engine/*.mjs scripts but role ${role.name} may not run node`, `add "Bash(node:*)" to allowedTools in .harness/roles/${role.file} (project owner), or let DEV_ENGINEER run the engine step`);
      }
      const cssOnly = (role) => (role.writablePaths || []).length && role.writablePaths.every((w) => /\.(css|scss|less)\b/.test(w));
      if (['ui-polish', 'a11y-audit'].includes(x.name)) for (const r of known) if (cssOnly(roles[String(r).toUpperCase()])) add('warn', 'harness', `${x.name} edits HTML/JSX too, but role ${r} may only write CSS`, `widen that role's writablePaths in .harness/roles (project owner) or give ${x.name} to DEV_ENGINEER`);
    }
    const team = readJson(join(project, '.harness', 'team.json'));
    // Capability flag, not a version number: a harness that exports SKILL_COMPOSITION = 'additive-union' ADDS a lead's explicit skills to autoApply skills.
    const gov = join(project, '.harness', 'lib', 'governance.mjs');
    const additive = existsSync(gov) && /SKILL_COMPOSITION\s*=\s*['"]additive-union['"]/.test(readFileSync(gov, 'utf8'));
    for (const m of additive ? [] : team?.members ?? []) {
      if (Array.isArray(m.skills) && m.skills.length) add('warn', 'harness', `team.json: "${m.id}" lists skills ${JSON.stringify(m.skills)}; explicit skills switch off autoApply, so installed foundry skills are not injected for that member`, `remove "skills" from "${m.id}" in .harness/team.json (project owner) or add the foundry skills to that list`);
    }
    const cfg = readJson(join(project, '.harness', 'config.json'));
    const stale = new Set(['gemini', 'orca']);
    const used = [...(team?.members ?? []).filter((m) => stale.has(m.engine)).map((m) => `${m.engine} (team.json ${m.id})`), ...Object.keys(cfg?.profiles ?? {}).filter((k) => stale.has(k)).map((k) => `${k} (config.json profiles)`), ...(cfg?.autoOrder ?? []).filter((k) => stale.has(k)).map((k) => `${k} (config.json autoOrder)`)];
    if (used.length) add('warn', 'harness', `engines the current Agentic-Harness has dropped are still referenced: ${used.join(', ')}`, 'run node .harness/doctor.mjs; if it reports them, switch them to claude (project owner)');
  } else {
    // ── Case B: no agentic harness
    const seen = [['.claude', '.claude/'], ['CLAUDE.md', 'CLAUDE.md'], ['AGENTS.md', 'AGENTS.md'], ['GEMINI.md', 'GEMINI.md'], ['.cursor/rules', '.cursor/rules/'], ['.windsurfrules', '.windsurfrules'], ['.github/copilot-instructions.md', '.github/copilot-instructions.md']].filter(([p]) => existsSync(join(project, p))).map(([, n]) => n);
    add('info', 'agents', seen.length ? `agent files found: ${seen.join(', ')}` : 'no agent instruction files found yet');
    const has = (p) => existsSync(join(project, p));
    if (has('.cursor/rules')) add('info', 'cursor', 'Cursor reads AGENTS.md (skills are listed there). To load a skill natively, add a rule file', 'create .cursor/rules/skills.mdc containing: "When a task matches a skill listed in AGENTS.md, read its .claude/skills/<name>/SKILL.md first."');
    if (has('.windsurfrules')) add('info', 'windsurf', 'Windsurf does not read AGENTS.md from this file; point it there', 'add a line to .windsurfrules: "Skills: read AGENTS.md and follow the matching .claude/skills/<name>/SKILL.md."');
    if (has('GEMINI.md')) add('info', 'gemini', 'Gemini CLI reads GEMINI.md; import the skill list', 'add the line "@AGENTS.md" to GEMINI.md');
    if (has('.github/copilot-instructions.md')) add('info', 'copilot', 'GitHub Copilot reads this file; point it at the skill list', 'add a line to .github/copilot-instructions.md: "Skills: see AGENTS.md and follow the matching .claude/skills/<name>/SKILL.md."');
    if (has('.claude/agents')) add('info', 'claude', '.claude/agents/ found: custom agents load installed skills through .claude/skills/ automatically', 'mention a skill by name in an agent prompt to force it');
    add('info', 'harness', 'no agentic harness (.harness/). For team governance, isolated workers and per-role skills', 'npx github:sumtaimo/Agentic-Harness#release .');
  }
  const counts = { ok: 0, warn: 0, problem: 0 };
  for (const i of items) if (i.level in counts) counts[i.level]++;
  return { case: harness ? 'A' : 'B', project, ...(pv ? { foundryVersion: pv } : {}), counts, healthy: !counts.warn && !counts.problem, items };
}

const MARKS = { ok: '✔ ok     ', warn: '! warn   ', problem: '✖ problem', info: '· info   ' };
function printDoctor(r, log) {
  log(`Skill Foundry${r.foundryVersion ? ` ${r.foundryVersion}` : ''} doctor: ${r.case === 'A' ? 'project with an agentic harness' : 'project without an agentic harness'}`);
  for (const level of ['problem', 'warn', 'info', 'ok']) for (const i of r.items.filter((x) => x.level === level)) {
    log(`${MARKS[level]} ${i.area}: ${i.message}`);
    if (i.fix) log(`           fix: ${i.fix}`);
  }
  log(r.healthy ? 'Healthy.' : `${r.counts.problem} problem(s), ${r.counts.warn} warning(s). Exit code 2.`);
}
/** One short block after add/update: the counts and the first findings, never the full report. */
function summary(log, project, root) {
  const r = doctorProject({ project, root });
  if (r.healthy) return log('doctor   healthy');
  log(`doctor   ${r.counts.problem} problem(s), ${r.counts.warn} warning(s):`);
  for (const i of r.items.filter((x) => x.level === 'problem' || x.level === 'warn').slice(0, 4)) log(`  ${i.level === 'problem' ? '✖' : '!'} ${i.area}: ${i.message}`);
  log(`  full list with fixes: ${CLI} doctor`);
}

const KNOWN_FLAGS = ['--json', '--force', '--quiet', '--no-rules', '--no-protect', '--sync-harness', '--all', '--default', '--role', '--fix'];

export function main(argv, log = console.log) {
  const [cmd, ...rest] = argv;
  const project = process.cwd();
  // A mistyped option must stop the command, never be ignored: `add x --no-protec` would silently add the protection
  // rules the user meant to skip. (Every option the harness and the docs use is in KNOWN_FLAGS.)
  const unknownFlags = ['list', 'add', 'check', 'doctor', 'remove', 'update'].includes(cmd) ? rest.filter((a) => a.startsWith('-') && !KNOWN_FLAGS.includes(a)) : [];
  if (unknownFlags.length) throw new Error(`unknown option ${unknownFlags.map((a) => `"${a}"`).join(', ')}. Options: ${KNOWN_FLAGS.join(' ')}`);
  const force = rest.includes('--force');
  const syncHarness = rest.includes('--sync-harness');
  const ri = rest.indexOf('--role');
  const names = rest.filter((a, i) => !a.startsWith('--') && !(ri >= 0 && i === ri + 1));
  const show = (r) => {
    log(`${r.action.padEnd(8)} ${r.name}${r.kept.length ? `  (kept your changes: ${r.kept.join(', ')})` : ''}${r.harness ? `  → harness: ${r.harness}${r.harnessStatus === 'replaced' ? ' (replaced yours; original kept as SKILL.md.orig)' : r.harnessStatus === 'replaced-starter' ? ' (replaced the harness starter copy; original kept as SKILL.md.orig)' : ''}` : ''}`);
    if (r.harnessStatus === 'collision') log(`harness  ! ${r.name}: ${r.harnessPath} already exists without skill-foundry marker — pointer skipped (use --sync-harness to wrap/replace or keep yours)`);
  };
  if (cmd === '--version' || cmd === '-v') {
    log(foundryVersion() ?? 'unknown');
  } else if (cmd === 'list' && rest.includes('--json')) {
    // Machine contract for the Agentic-Harness on-demand fetch: every READY portable skill, installed or not, from the
    // registry shipped in this package (works offline). stdout is only the JSON array; exit 0.
    let have = new Map();
    try { have = new Map(checkProject({ project }).map((x) => [x.name, x])); } catch { /* no project skills: none installed */ }
    const out = catalog().filter((s) => s.scope !== 'factory').map((s) => {
      const h = have.get(s.name);
      return { name: s.name, version: s.version, description: s.description, roles: s.roles, keywords: s.keywords, default: s.isDefault, engine: s.engine, installed: h ? h.installed : null, current: h ? h.current : null };
    });
    process.stdout.write(`${JSON.stringify(out, null, 2)}\n`);
  } else if (cmd === 'list') {
    const pv = foundryVersion();
    if (pv) log(`Skill Foundry ${pv}`);
    for (const s of catalog()) log(`${s.name.padEnd(18)} ${s.version.padEnd(7)} ${s.roles.join(',').padEnd(26)} ${s.scope === 'factory' ? '(repo only) ' : ''}${s.description.slice(0, 70)}`);
  } else if (cmd === 'add') {
    let list = names;
    if (ri >= 0 && names.length) throw new Error(`use either skill names (${names.join(', ')}) or --role, not both: run them as two commands`);
    if (ri >= 0) {
      const role = String(rest[ri + 1] ?? '').toUpperCase(); const ok = allowedRoles(project); // roles are written in capitals; accept qa_auditor too
      if (!ok.includes(role)) throw new Error(`--role must be one of ${ok.join(', ')}`);
      list = catalog().filter((s) => s.scope !== 'factory' && s.roles.includes(role)).map((s) => s.name);
    }
    if (rest.includes('--all')) list = catalog().filter((s) => s.scope !== 'factory').map((s) => s.name);
    if (rest.includes('--default')) list = catalog().filter((s) => s.scope !== 'factory' && s.isDefault).map((s) => s.name);
    if (!list.length && ri >= 0) { log(`no ready skill is registered for ${String(rest[ri + 1]).toUpperCase()} yet`); return 0; }
    if (!list.length) throw new Error('usage: add <skill…> | add --all | add --default | add --role <ROLE>');
    list.forEach((n) => show(addSkill(n, { force, syncHarness })));
    if (!rest.includes('--no-rules')) log(`rules    AGENTS.md lists ${writeRules().skills.join(', ')}`);
    if (!rest.includes('--no-protect')) { const g = protectSkills(); log(`protect  ${g.file}: ${g.skipped ?? (g.added.length || g.removed.length ? `${g.added.length} protection rule(s) added${g.removed.length ? `, ${g.removed.length} invalid rule(s) removed` : ''}` : 'already in place')}`); }
    if (!rest.includes('--quiet')) summary(log, project);
    log('Restart your agent (Claude Code) so it loads the skills.');
  } else if (cmd === 'check') {
    const r = checkProject();
    if (rest.includes('--json')) log(JSON.stringify(r, null, 2));
    else {
      if (!r.length) log('No Skill Foundry skills installed here.');
      for (const x of r) log(`${x.current ? 'current ' : 'outdated'} ${x.name} ${x.installed}${x.latest && !x.current ? ` → ${x.latest} (new content)` : ''}${x.modified.length ? `  CHANGED LOCALLY: ${x.modified.join(', ')} (update keeps them; update --force restores the original)` : ''}`);
      const pv = foundryVersion();
      const older = [...new Set(r.map((x) => x.foundryVersion).filter((v) => v && pv && v !== pv))];
      if (older.length) log(`foundry  Skill Foundry ${pv} (installed under ${older.join(', ')})`);
      if (existsSync(join(project, '.harness', 'foundry-default.json'))) {
        const installedNames = new Set(r.map((x) => x.name));
        const missingDefaults = catalog().filter((s) => s.scope !== 'factory' && s.isDefault && !installedNames.has(s.name)).map((s) => s.name);
        if (missingDefaults.length) log(`default  new default skill(s): ${missingDefaults.join(', ')} (run: ${CLI} add --default)`);
      }
    }
    return r.some((x) => !x.current || x.modified.length) ? 2 : 0;
  } else if (cmd === 'doctor') {
    if (rest.includes('--fix')) {
      const g = protectSkills();
      if (g.skipped) log(`fix      ${g.file}: ${g.skipped}`); else if (g.added.length || g.removed.length) log(`fix      ${g.file}: ${g.added.length} protection rule(s) added, ${g.removed.length} invalid rule(s) removed`);
      if (checkProject().length) { writeRules(); log('fix      AGENTS.md block refreshed'); }
    }
    const r = doctorProject({ project });
    if (rest.includes('--json')) log(JSON.stringify(r, null, 2)); else printDoctor(r, log);
    return r.healthy ? 0 : 2;
  } else if (cmd === 'remove') {
    if (!names.length) throw new Error('usage: remove <skill…>');
    names.forEach((n) => log(`removed  ${removeSkill(n).name}`));
  } else if (cmd === 'update') {
    const known = new Set(catalog().filter((s) => s.scope !== 'factory').map((s) => s.name));
    const typo = names.filter((n) => !known.has(n));
    if (typo.length) throw new Error(`unknown or not ready skill ${typo.map((n) => `"${n}"`).join(', ')} (see: list)`); // a typo is not "nothing to update"
    const have = checkProject();
    for (const n of names.filter((n) => !have.some((x) => x.name === n))) log(`${n} is not installed here (add it first: add ${n})`);
    const r = have.filter((x) => x.latest && (!names.length || names.includes(x.name)));
    if (!r.length) log('Nothing to update.');
    r.forEach((x) => show(addSkill(x.name, { force, syncHarness })));
    if (r.length && !rest.includes('--no-rules')) log(`rules    AGENTS.md lists ${writeRules().skills.join(', ')}`);
    if (r.length && !rest.includes('--no-protect')) protectSkills();
    if (r.length && !rest.includes('--quiet')) summary(log, project);
  } else {
    log(`skill-foundry${foundryVersion() ? ` ${foundryVersion()}` : ''} list [--json] | add <skill…> | add --all | add --role <ROLE> | check [--json] | update [skill…] [--force] | remove <skill…> | doctor [--fix] [--json] | --version\n  Roles: ${ROLES.join(', ')} (and any role in the project's .harness/roles/).\n  By default add also (1) lists the skills in AGENTS.md so any agent uses them, and (2) denies agents edit rights on the installed skills in .claude/settings.json.\n  --no-rules  skip (1)   --no-protect  skip (2)   --sync-harness  replace a project's own .harness/skills/<name> (original kept)   --quiet  no doctor summary\n  Existing text and settings are kept. Running add or update again changes nothing that is already in place.\n  doctor exit codes: 0 healthy, 2 warnings or problems, 1 usage error.`);
    return cmd ? 1 : 0;
  }
  return 0;
}

// npx runs the file through a symlink in node_modules/.bin, so compare real paths.
if (process.argv[1] && realpathSync(resolve(process.argv[1])) === realpathSync(HERE)) {
  try { process.exitCode = main(process.argv.slice(2)); } catch (e) { console.error(e.message); process.exitCode = 1; }
}
