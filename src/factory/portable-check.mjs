/**
 * Portable check: install a skill into a brand-new empty project outside this repository and have a real
 * agent use it on one request, so the result shows how the skill behaves for someone who is not in this repo
 * (no CLAUDE.md, no lessons, no registry). It costs tokens. Skills with `scope: factory` cannot be checked.
 * CLI: node src/factory/portable-check.mjs <skill> --prompt "<user request>" [--out <dir>] [--engine claude]
 * @governed-by PO_ARCHITECT
 */
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { installSkill } from './install.mjs';

const HERE = fileURLToPath(import.meta.url);
const REPO_ROOT = resolve(dirname(HERE), '..', '..');

/** Words that only exist in this repository's own rules; an answer containing one leaked them. */
export const REPO_MARKERS = /TAIMO|lessons\.md|CLAUDE\.md|AGENTS\.md|docs\/PROJECT|skill-guard|\bL\d{1,2}\b rule|Skill Foundry repo/i;

/**
 * Read a `claude -p --output-format stream-json --verbose` transcript.
 * @param {string} stdout @param {string} skill
 * @returns {{tools:{name:string,input:string}[], final:string, cost:number|null, usedSkill:boolean, touchedRepo:string[]}}
 */
export function parseStream(stdout, skill) {
  const tools = []; let final = ''; let cost = null;
  for (const line of String(stdout).split('\n')) {
    if (!line.trim()) continue;
    let e; try { e = JSON.parse(line); } catch { continue; }
    if (e.type === 'assistant') for (const b of e.message?.content ?? []) if (b.type === 'tool_use') tools.push({ name: b.name, input: JSON.stringify(b.input) });
    if (e.type === 'result') { final = String(e.result ?? ''); cost = typeof e.total_cost_usd === 'number' ? e.total_cost_usd : null; }
  }
  const usedSkill = tools.some((t) => (t.name === 'Skill' && t.input.includes(skill)) || (t.name === 'Read' && t.input.includes(`.claude/skills/${skill}`)));
  const touchedRepo = tools.filter((t) => t.input.includes(REPO_ROOT)).map((t) => t.name);
  return { tools, final, cost, usedSkill, touchedRepo };
}

/** @param {string} dir files under dir, relative, without the installed .claude folder */
export function listProduced(dir) {
  const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => {
    if (e.name === '.claude') return [];
    const p = join(d, e.name);
    return e.isDirectory() ? walk(p) : [p.slice(dir.length + 1)];
  });
  return walk(dir).sort();
}

/**
 * @param {string} skill @param {string} prompt
 * @param {{out?:string, engine?:string, timeoutMs?:number}} [opts]
 */
export async function portableCheck(skill, prompt, { out, engine = 'claude', timeoutMs = 900000 } = {}) {
  if (typeof prompt !== 'string' || !prompt.trim()) throw new TypeError('portableCheck: prompt required');
  const md = readFileSync(join(REPO_ROOT, 'src', 'skills', skill, 'SKILL.md'), 'utf8');
  if (/^scope:\s*factory\s*$/m.test(md)) throw new Error(`${skill} has scope: factory and only runs inside this repository`);
  const root = out ? resolve(out) : mkdtempSync(join(tmpdir(), 'portable-'));
  if (root.startsWith(REPO_ROOT)) throw new Error('portableCheck: the empty project must be outside the repository');
  mkdirSync(root, { recursive: true });
  const installed = await installSkill(skill, { projectRoot: root, force: true });
  const r = spawnSync(engine, ['-p', '--output-format', 'stream-json', '--verbose', '--allowedTools', 'Read', 'Write', 'Edit', 'Glob', 'Grep', 'Skill', 'Bash(node:*)', 'Bash(ls:*)'],
    { cwd: root, input: prompt, encoding: 'utf8', timeout: timeoutMs, maxBuffer: 1 << 28 });
  if (r.error) throw r.error;
  const s = parseStream(r.stdout, skill);
  writeFileSync(join(root, '.portable-check.jsonl'), r.stdout);
  return { skill, project: root, installedFiles: installed.length, exit: r.status, usedSkill: s.usedSkill, leakedRepoRules: REPO_MARKERS.test(s.final), touchedRepo: s.touchedRepo, produced: listProduced(root).filter((f) => f !== '.portable-check.jsonl'), cost: s.cost, answer: s.final };
}

if (process.argv[1] && resolve(process.argv[1]) === HERE) {
  const a = process.argv.slice(2);
  const arg = (n) => { const i = a.indexOf(n); return i >= 0 ? a[i + 1] : undefined; };
  const skill = a.find((x) => !x.startsWith('--'));
  try {
    if (!skill || !arg('--prompt')) throw new Error('usage: portable-check.mjs <skill> --prompt "<user request>" [--out <dir>] [--engine claude]');
    const r = await portableCheck(skill, arg('--prompt'), { out: arg('--out'), engine: arg('--engine') });
    const { answer, ...rest } = r;
    console.log(JSON.stringify(rest, null, 2));
    console.log('\nANSWER:\n' + answer);
    process.exit(r.exit === 0 && r.usedSkill && !r.leakedRepoRules && r.touchedRepo.length === 0 ? 0 : 1);
  } catch (e) { console.error(e.message); process.exit(2); }
}
