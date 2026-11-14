/**
 * Skill guard: one skill per session, and never a locked skill.
 * Looks at the uncommitted changes (staged, unstaged and untracked) in git, which is the work of the
 * current session, and maps them to skills via src/skills/<name>/ and docs/skills/<name>/.
 * CLI: node src/factory/skill-guard.mjs [--base <ref>]   (exit 1 with a WARNING when a rule is broken)
 *   --base <ref>: also count changes committed since <ref> (for example the session's start commit)
 * Unlock for the owner: SKILL_OWNER=<skill> node src/factory/skill-guard.mjs
 * @governed-by PO_ARCHITECT
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const HERE = fileURLToPath(import.meta.url);
const REPO_ROOT = resolve(dirname(HERE), '..', '..');

/** @param {string[]} paths repo-relative paths */
export function skillsTouched(paths) {
  const set = new Set();
  for (const p of paths) {
    const m = /^(?:src|docs)\/skills\/([a-z0-9][a-z0-9-]*)\//.exec(p.replace(/\\/g, '/'));
    if (m && m[1] !== '_template') set.add(m[1]);
  }
  return [...set].sort();
}

/**
 * @param {string[]} paths
 * @param {Record<string,{owner:string,reason:string}>} locks
 * @param {{owner?:string}} [opts]
 */
export function checkGuard(paths, locks, { owner } = {}) {
  const skills = skillsTouched(paths);
  const problems = [];
  if (skills.length > 1) problems.push(`one skill per session: this session changes ${skills.length} skills (${skills.join(', ')}). Finish and commit one skill, then start a new session for the next.`);
  for (const s of skills) {
    if (locks[s] && owner !== s) problems.push(`${s} is locked by ${locks[s].owner}: ${locks[s].reason}`);
  }
  return { skills, problems, ok: problems.length === 0 };
}

export function changedPaths({ base, cwd = REPO_ROOT } = {}) {
  const git = (args) => execFileSync('git', args, { cwd, encoding: 'utf8' }).split('\n').filter(Boolean);
  const paths = [...git(['diff', '--name-only', 'HEAD']), ...git(['ls-files', '--others', '--exclude-standard'])];
  if (base) paths.push(...git(['diff', '--name-only', `${base}...HEAD`]));
  return [...new Set(paths)];
}

export function loadLocks(root = REPO_ROOT) {
  const p = join(root, 'src', 'factory', 'locks.json');
  return existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : {};
}

if (process.argv[1] && resolve(process.argv[1]) === HERE) {
  const i = process.argv.indexOf('--base');
  const base = i > 0 ? process.argv[i + 1] : undefined;
  const r = checkGuard(changedPaths({ base }), loadLocks(), { owner: process.env.SKILL_OWNER });
  if (r.ok) { console.log(`skill-guard: ok (${r.skills.length ? 'skill: ' + r.skills.join(', ') : 'no skill changed'})`); process.exit(0); }
  for (const p of r.problems) console.error(`WARNING skill-guard: ${p}`);
  process.exit(1);
}
