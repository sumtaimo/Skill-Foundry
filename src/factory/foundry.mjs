#!/usr/bin/env node
/**
 * skill-foundry: add Skill Foundry skills to any project and keep them up to date.
 *
 *   npx github:sumtaimo/Skill-Foundry list                 ready skills, version, roles
 *   npx github:sumtaimo/Skill-Foundry add test-planner     install into .claude/skills/
 *   npx github:sumtaimo/Skill-Foundry add --role QA_AUDITOR  every ready skill for that role
 *   npx github:sumtaimo/Skill-Foundry check                which installed skills are out of date
 *   npx github:sumtaimo/Skill-Foundry update [name…]       update them; files you changed are kept
 *
 * Each install writes `.claude/skills/<name>/.foundry.json` (version, content hash, a hash per file), so `check`
 * and `update` know what came from the foundry and what the user changed. When the project has an agentic harness
 * (`.harness/skills/`), the skill is also registered there with the roles from the registry, so harness workers in
 * those roles get it automatically.
 * @governed-by PO_ARCHITECT
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, copyFileSync, realpathSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, resolve, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = fileURLToPath(import.meta.url);
const REPO = resolve(dirname(HERE), '..', '..');
export const ROLES = ['PO_ARCHITECT', 'BA_ANALYST', 'DEV_ENGINEER', 'QA_AUDITOR'];
const STAMP = '.foundry.json';
const MARK = 'installed-by: skill-foundry';

const sha = (b) => createHash('sha256').update(b).digest('hex');
function files(dir, base = dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...files(p, base));
    else if (e.name !== STAMP) out.push(relative(base, p).split(sep).join('/'));
  }
  return out.sort();
}
const hashes = (dir) => Object.fromEntries(files(dir).map((f) => [f, sha(readFileSync(join(dir, f)))]));
const total = (h) => sha(Object.entries(h).map(([f, x]) => `${f}:${x}`).join('\n'));

/** @param {{root?:string}} [o] */
export function catalog({ root = REPO } = {}) {
  const reg = JSON.parse(readFileSync(join(root, 'src', 'factory', 'registry.json'), 'utf8'));
  return reg.filter((r) => r.status === 'ready').map((r) => {
    const md = readFileSync(join(root, 'src', 'skills', r.name, 'SKILL.md'), 'utf8');
    const description = /^description:\s*(.+)$/m.exec(md)?.[1].trim() ?? '';
    return { name: r.name, version: String(r.version), roles: r.roles ?? [], scope: /^scope:\s*factory/m.test(md) ? 'factory' : 'portable', description, dir: join(root, 'src', 'skills', r.name) };
  });
}

function harnessPointer(project, s) {
  const dir = join(project, '.harness', 'skills');
  if (!existsSync(dir)) return null;
  const file = join(dir, s.name, 'SKILL.md');
  if (existsSync(file) && !readFileSync(file, 'utf8').includes(MARK)) return null; // the project's own skill wins
  mkdirSync(dirname(file), { recursive: true });
  // The harness injects a skill into a worker only when its role matches AND (autoApply OR a keyword is in the prompt),
  // so the pointer sets autoApply: true. The pointer is a few lines; the full skill is read on demand.
  const tags = (() => { try { return JSON.parse(readFileSync(join(s.dir, 'preview.json'), 'utf8')).tags ?? []; } catch { return []; } })();
  writeFileSync(file, `---\nname: ${s.name}\ndescription: ${s.description}\nroles: ${JSON.stringify(s.roles)}\nallowedTools: ["Read", "Edit", "Write"]\nkeywords: ${JSON.stringify(tags)}\nautoApply: true\n${MARK} ${s.version}\n---\n` +
    `# ${s.name}\n\nWhen the task matches this skill (${s.description.split('. ')[0]}.), read \`.claude/skills/${s.name}/SKILL.md\` and follow it with its layers, starting from the goal the user states. When the task does not match, ignore this skill.\n`);
  return relative(project, file).split(sep).join('/');
}

/**
 * Install or update one skill. Files the user changed since the last install are kept unless `force`.
 * @returns {{name:string, action:'added'|'updated'|'current', kept:string[], harness:string|null}}
 */
export function addSkill(name, { project = process.cwd(), root = REPO, force = false } = {}) {
  const s = catalog({ root }).find((x) => x.name === name);
  if (!s) throw new Error(`unknown or not ready skill "${name}" (see: list)`);
  if (s.scope === 'factory') throw new Error(`${name} only works inside the Skill Foundry repository`);
  const target = join(project, '.claude', 'skills', name);
  const src = hashes(s.dir);
  const stampPath = join(target, STAMP);
  const old = existsSync(stampPath) ? JSON.parse(readFileSync(stampPath, 'utf8')) : null;
  if (existsSync(target) && !old && !force) throw new Error(`${target} exists and was not installed by skill-foundry (use --force)`);
  if (old && old.hash === total(src)) return { name, action: 'current', kept: [], harness: harnessPointer(project, s) };
  const kept = [];
  for (const f of Object.keys(src)) {
    const to = join(target, f);
    if (old && existsSync(to) && !force) {
      const now = sha(readFileSync(to));
      if (now !== old.files?.[f] && now !== src[f]) { kept.push(f); continue; }
    }
    mkdirSync(dirname(to), { recursive: true });
    copyFileSync(join(s.dir, f), to);
  }
  writeFileSync(stampPath, JSON.stringify({ name, version: s.version, hash: total(src), source: 'github:sumtaimo/Skill-Foundry', files: src }, null, 2) + '\n');
  return { name, action: old ? 'updated' : 'added', kept, harness: harnessPointer(project, s) };
}

/** Installed foundry skills and whether each is current. */
export function checkProject({ project = process.cwd(), root = REPO } = {}) {
  const dir = join(project, '.claude', 'skills');
  if (!existsSync(dir)) return [];
  const cat = new Map(catalog({ root }).map((s) => [s.name, s]));
  return readdirSync(dir).filter((n) => existsSync(join(dir, n, STAMP))).map((n) => {
    const st = JSON.parse(readFileSync(join(dir, n, STAMP), 'utf8'));
    const s = cat.get(n);
    return { name: n, installed: st.version, latest: s?.version ?? null, current: !!s && st.hash === total(hashes(s.dir)) };
  });
}

export function main(argv, log = console.log) {
  const [cmd, ...rest] = argv;
  const force = rest.includes('--force');
  const ri = rest.indexOf('--role');
  const names = rest.filter((a, i) => !a.startsWith('--') && !(ri >= 0 && i === ri + 1));
  const show = (r) => log(`${r.action.padEnd(8)} ${r.name}${r.kept.length ? `  (kept your changes: ${r.kept.join(', ')})` : ''}${r.harness ? `  → harness: ${r.harness}` : ''}`);
  if (cmd === 'list') {
    for (const s of catalog()) log(`${s.name.padEnd(18)} ${s.version.padEnd(7)} ${s.roles.join(',').padEnd(26)} ${s.scope === 'factory' ? '(repo only) ' : ''}${s.description.slice(0, 70)}`);
  } else if (cmd === 'add') {
    let list = names;
    if (ri >= 0) {
      const role = rest[ri + 1];
      if (!ROLES.includes(role)) throw new Error(`--role must be one of ${ROLES.join(', ')}`);
      list = catalog().filter((s) => s.scope !== 'factory' && s.roles.includes(role)).map((s) => s.name);
    }
    if (!list.length) throw new Error('usage: add <skill…> | add --role <ROLE>');
    list.forEach((n) => show(addSkill(n, { force })));
    log('Restart your agent (Claude Code) so it loads the skills.');
  } else if (cmd === 'check') {
    const r = checkProject();
    if (!r.length) log('No Skill Foundry skills installed here.');
    for (const x of r) log(`${x.current ? 'current ' : 'outdated'} ${x.name} ${x.installed}${x.latest && !x.current ? ` → ${x.latest} (new content)` : ''}`);
    return r.some((x) => !x.current) ? 2 : 0;
  } else if (cmd === 'update') {
    const r = checkProject().filter((x) => x.latest && (!names.length || names.includes(x.name)));
    if (!r.length) log('Nothing to update.');
    r.forEach((x) => show(addSkill(x.name, { force })));
  } else {
    log('skill-foundry list | add <skill…> | add --role <PO_ARCHITECT|BA_ANALYST|DEV_ENGINEER|QA_AUDITOR> | check | update [skill…] [--force]');
    return cmd ? 1 : 0;
  }
  return 0;
}

// npx runs the file through a symlink in node_modules/.bin, so compare real paths.
if (process.argv[1] && realpathSync(resolve(process.argv[1])) === realpathSync(HERE)) {
  try { process.exitCode = main(process.argv.slice(2)); } catch (e) { console.error(e.message); process.exitCode = 1; }
}
