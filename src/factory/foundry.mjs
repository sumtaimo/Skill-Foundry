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
 *   add ... --rules                                       also list the skills in AGENTS.md for non-Claude agents
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
// Evals are the lab's tests, not part of the skill a user runs: their prompts and recordings would only lead a user's agent to read test data.
const SHIPPED = (f) => !/^evals\//.test(f);
const hashes = (dir) => Object.fromEntries(files(dir).filter(SHIPPED).map((f) => [f, sha(readFileSync(join(dir, f)))]));
const total = (h) => sha(Object.entries(h).map(([f, x]) => `${f}:${x}`).join('\n'));

/** @param {{root?:string}} [o] */
export function catalog({ root = REPO } = {}) {
  const reg = JSON.parse(readFileSync(join(root, 'src', 'factory', 'registry.json'), 'utf8'));
  // A shipped package holds only the skills that work outside this repository; skip any that are not there.
  return reg.filter((r) => r.status === 'ready' && existsSync(join(root, 'src', 'skills', r.name, 'SKILL.md'))).map((r) => {
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

const BEGIN = '<!-- skill-foundry:begin (managed by `npx github:sumtaimo/Skill-Foundry`; edits inside are replaced) -->';
const END = '<!-- skill-foundry:end -->';
/**
 * Write (or refresh) one managed block in the project's AGENTS.md, read by Codex, Cursor, Gemini and others, so agents
 * that do not load `.claude/skills/` still know which skills exist and when to use each. Text outside the block is never touched.
 */
export function writeRules({ project = process.cwd(), root = REPO } = {}) {
  const cat = new Map(catalog({ root }).map((s) => [s.name, s]));
  const rows = checkProject({ project, root }).map((x) => cat.get(x.name)).filter(Boolean);
  const block = `${BEGIN}\n## Skills\n\nThis project has these skills in \`.claude/skills/\`. When a task matches one, read its \`SKILL.md\` first and follow its steps and layers, starting from the goal the user states. Use one skill per step; when a request needs several, use them in the order the request gives.\n\n**Never edit, delete or overwrite anything under \`.claude/skills/\` or \`.harness/skills/\`.** Skills are changed only by the user, with \`npx github:sumtaimo/Skill-Foundry update\`. If a skill seems wrong, say so in your answer instead of editing it.\n\n` +
    rows.map((s) => `- **${s.name}** (\`.claude/skills/${s.name}/SKILL.md\`): ${s.description}`).join('\n') + `\n\nUpdate them with \`npx github:sumtaimo/Skill-Foundry update\`.\n${END}\n`;
  const file = join(project, 'AGENTS.md');
  const old = existsSync(file) ? readFileSync(file, 'utf8') : '';
  const i = old.indexOf(BEGIN); const j = old.indexOf(END);
  const next = i >= 0 && j > i ? old.slice(0, i) + block + old.slice(j + END.length).replace(/^\n/, '') : (old ? `${old.replace(/\n*$/, '\n\n')}${block}` : `# AGENTS.md\n\n${block}`);
  writeFileSync(file, next);
  return { file: 'AGENTS.md', skills: rows.map((s) => s.name) };
}

export const DENY = ['Edit(.claude/skills/**)', 'Write(.claude/skills/**)', 'Edit(.harness/skills/**)', 'Write(.harness/skills/**)', 'Bash(npx github:sumtaimo/Skill-Foundry update*)', 'Bash(npx github:sumtaimo/Skill-Foundry add*)'];
/**
 * Guard rail so the user's agent cannot change the installed skills: deny rules in the project's `.claude/settings.json`,
 * merged into what is there (existing settings and rules are kept; nothing is removed).
 * Not a lock: only the user changes skills, by running `update` themselves.
 */
export function protectSkills({ project = process.cwd() } = {}) {
  const file = join(project, '.claude', 'settings.json');
  let cfg = {};
  if (existsSync(file)) { try { cfg = JSON.parse(readFileSync(file, 'utf8')); } catch { return { file: '.claude/settings.json', added: [], skipped: 'not valid JSON, left untouched' }; } }
  cfg.permissions = cfg.permissions && typeof cfg.permissions === 'object' ? cfg.permissions : {};
  const deny = Array.isArray(cfg.permissions.deny) ? cfg.permissions.deny : [];
  const added = DENY.filter((d) => !deny.includes(d));
  if (added.length) { cfg.permissions.deny = [...deny, ...added]; mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, JSON.stringify(cfg, null, 2) + '\n'); }
  return { file: '.claude/settings.json', added };
}

/** Remove a foundry skill cleanly: its folder, its harness pointer and its line in the AGENTS.md block. The user's own skills are never touched. */
export function removeSkill(name, { project = process.cwd(), root = REPO } = {}) {
  const target = join(project, '.claude', 'skills', name);
  if (!existsSync(join(target, STAMP))) throw new Error(`${name} was not installed by skill-foundry here`);
  rmSync(target, { recursive: true, force: true });
  const ptr = join(project, '.harness', 'skills', name);
  if (existsSync(join(ptr, 'SKILL.md')) && readFileSync(join(ptr, 'SKILL.md'), 'utf8').includes(MARK)) rmSync(ptr, { recursive: true, force: true });
  const agents = join(project, 'AGENTS.md');
  if (existsSync(agents) && readFileSync(agents, 'utf8').includes(BEGIN)) writeRules({ project, root });
  return { name, action: 'removed' };
}

/** Installed foundry skills and whether each is current. */
export function checkProject({ project = process.cwd(), root = REPO } = {}) {
  const dir = join(project, '.claude', 'skills');
  if (!existsSync(dir)) return [];
  const cat = new Map(catalog({ root }).map((s) => [s.name, s]));
  return readdirSync(dir).filter((n) => existsSync(join(dir, n, STAMP))).map((n) => {
    const st = JSON.parse(readFileSync(join(dir, n, STAMP), 'utf8'));
    const s = cat.get(n);
    // Files whose content differs from what was installed: someone (or an agent) edited the skill.
    const modified = Object.entries(st.files ?? {}).filter(([f, h]) => { const p = join(dir, n, f); return !existsSync(p) || sha(readFileSync(p)) !== h; }).map(([f]) => f);
    return { name: n, installed: st.version, latest: s?.version ?? null, current: !!s && st.hash === total(hashes(s.dir)), modified };
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
    if (rest.includes('--all')) list = catalog().filter((s) => s.scope !== 'factory').map((s) => s.name);
    if (!list.length) throw new Error('usage: add <skill…> | add --all | add --role <ROLE>');
    list.forEach((n) => show(addSkill(n, { force })));
    if (!rest.includes('--no-rules')) log(`rules    AGENTS.md lists ${writeRules().skills.join(', ')}`);
    if (!rest.includes('--no-protect')) { const g = protectSkills(); log(`protect  ${g.file}: ${g.skipped ?? (g.added.length ? `${g.added.length} deny rules added` : 'already in place')}`); }
    log('Restart your agent (Claude Code) so it loads the skills.');
  } else if (cmd === 'check') {
    const r = checkProject();
    if (!r.length) log('No Skill Foundry skills installed here.');
    for (const x of r) log(`${x.current ? 'current ' : 'outdated'} ${x.name} ${x.installed}${x.latest && !x.current ? ` → ${x.latest} (new content)` : ''}${x.modified.length ? `  CHANGED LOCALLY: ${x.modified.join(', ')} (update keeps them; update --force restores the original)` : ''}`);
    return r.some((x) => !x.current || x.modified.length) ? 2 : 0;
  } else if (cmd === 'remove') {
    if (!names.length) throw new Error('usage: remove <skill…>');
    names.forEach((n) => log(`removed  ${removeSkill(n).name}`));
  } else if (cmd === 'update') {
    const r = checkProject().filter((x) => x.latest && (!names.length || names.includes(x.name)));
    if (!r.length) log('Nothing to update.');
    r.forEach((x) => show(addSkill(x.name, { force })));
    if (r.length && !rest.includes('--no-rules')) log(`rules    AGENTS.md lists ${writeRules().skills.join(', ')}`);
    if (r.length && !rest.includes('--no-protect')) protectSkills();
  } else {
    log('skill-foundry list | add <skill…> | add --all | add --role <PO_ARCHITECT|BA_ANALYST|DEV_ENGINEER|QA_AUDITOR> | check | update [skill…] [--force] | remove <skill…>\n  By default add also (1) lists the skills in AGENTS.md so any agent uses them, and (2) denies agents edit rights on the installed skills in .claude/settings.json.\n  --no-rules  skip (1)   --no-protect  skip (2)   Existing text and settings are kept.');
    return cmd ? 1 : 0;
  }
  return 0;
}

// npx runs the file through a symlink in node_modules/.bin, so compare real paths.
if (process.argv[1] && realpathSync(resolve(process.argv[1])) === realpathSync(HERE)) {
  try { process.exitCode = main(process.argv.slice(2)); } catch (e) { console.error(e.message); process.exitCode = 1; }
}
