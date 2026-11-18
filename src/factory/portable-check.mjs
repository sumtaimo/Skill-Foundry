/**
 * Portable check: install a skill into a brand-new empty project outside this repository and have a real
 * agent use it on one request, so the result shows how the skill behaves for someone who is not in this repo
 * (no CLAUDE.md, no lessons, no registry). It costs tokens. Skills with `scope: factory` cannot be checked.
 * CLI: node src/factory/portable-check.mjs <skill> --prompt "<user request>" [--record] [--out <dir>] [--engine claude]
 *   --record: save the result as src/skills/<skill>/evals/portable.json; `npm test` requires it for every ready skill
 *   that is not `scope: factory` (see tests/factory-portable-gate.test.mjs), and it is stale when the skill changes.
 * @governed-by PO_ARCHITECT
 */
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, resolve, dirname, relative, sep, isAbsolute } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { addSkill, writeRules } from './foundry.mjs';
import { isQuotaError, winCommandLine } from './live-evals.mjs';

const HERE = fileURLToPath(import.meta.url);
const REPO_ROOT = resolve(dirname(HERE), '..', '..');

/** Words that only exist in this repository's own rules; an answer containing one leaked them. */
// AGENTS.md and CLAUDE.md are not markers: a user's project legitimately has them (`add --rules` writes AGENTS.md there).
export const REPO_MARKERS = /TAIMO|lessons\.md|docs\/PROJECT|skill-guard|\bL\d{1,2}\b rule|Skill Foundry repo/i;

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
  const norm = (s) => s.replace(/\\\\/g, '/').replace(/\\/g, '/');
  const repoNorm = norm(REPO_ROOT);
  const usedSkill = tools.some((t) => {
    if (t.name === 'Skill') {
      try { if (JSON.parse(t.input)?.skill === skill) return true; } catch { /* fall through */ }
      return t.input.includes(`"${skill}"`);
    }
    return (t.name === 'Read' || t.name === 'Bash') && norm(t.input).includes(`.claude/skills/${skill}`); // reading the skill with `cat` counts too
  });
  const touchedRepo = tools.filter((t) => {
    const inp = norm(t.input);
    return process.platform === 'win32' ? inp.toLowerCase().includes(repoNorm.toLowerCase()) : inp.includes(repoNorm);
  }).map((t) => t.name);
  return { tools, final, cost, usedSkill, touchedRepo };
}

/** Files that do not change how a skill behaves for a user, so editing them never makes a recording stale. */
const NOT_BEHAVIOUR = (rel) => rel.startsWith('evals/live/') || rel === 'evals/portable.json' || rel === 'CHANGELOG.md' || rel.startsWith('preview/') || rel.startsWith('examples/');
const normLf = (buf) => (buf.includes(0) ? buf : Buffer.from(buf.toString('utf8').replace(/\r\n/g, '\n'), 'utf8'));

/**
 * Hash of what an agent follows when it uses the skill (instructions, layers, references, rules, engine, evals cases).
 * @param {string} skillDir
 */
export function behaviourHash(skillDir) {
  const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => {
    const p = join(d, e.name);
    return e.isDirectory() ? walk(p) : [relative(skillDir, p).split(sep).join('/')];
  });
  const h = createHash('sha256');
  for (const rel of walk(skillDir).filter((f) => !NOT_BEHAVIOUR(f)).sort()) h.update(rel).update('\0').update(normLf(readFileSync(join(skillDir, rel)))).update('\0');
  return h.digest('hex');
}

/**
 * Is there a passing portable-check recording that matches the skill as it is now?
 * @param {string} skillDir @returns {{ok:boolean, problems:string[]}}
 */
export function checkRecording(skillDir) {
  const p = join(skillDir, 'evals', 'portable.json');
  if (!existsSync(p)) return { ok: false, problems: ['no portable-check recording (run: node src/factory/portable-check.mjs <name> --prompt "<request>" --record)'] };
  let rec; try { rec = JSON.parse(readFileSync(p, 'utf8')); } catch { return { ok: false, problems: ['portable.json is not valid JSON'] }; }
  const problems = [];
  if (!rec.usedSkill) problems.push('the agent did not use the skill');
  if (rec.leakedRepoRules) problems.push("this repository's rules leaked into the answer");
  if (Array.isArray(rec.touchedRepo) && rec.touchedRepo.length) problems.push('the agent touched this repository');
  if (rec.exit !== 0) problems.push(`the agent run exited with ${rec.exit}`);
  if (typeof rec.prompt !== 'string' || !rec.prompt.trim() || typeof rec.answer !== 'string' || !rec.answer.trim()) problems.push('prompt or answer is missing');
  if (isQuotaError(rec.answer)) problems.push('quota/limit error recorded instead of agent answer, record again');
  if (rec.skillSha !== behaviourHash(skillDir)) problems.push('stale: the skill changed since this recording, record it again');
  return { ok: problems.length === 0, problems };
}

/** @param {string} dir files under dir, relative, without the installed .claude folder */
export function listProduced(dir) {
  const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => {
    if (e.name === '.claude') return [];
    const p = join(d, e.name);
    return e.isDirectory() ? walk(p) : [relative(dir, p).split(sep).join('/')];
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
  const relRepo = relative(REPO_ROOT, root);
  if (relRepo === '' || (!relRepo.startsWith('..') && !isAbsolute(relRepo))) throw new Error('portableCheck: the empty project must be outside the repository');
  mkdirSync(root, { recursive: true });
  // Install the way a user does (`npx github:sumtaimo/Skill-Foundry add <skill> --rules`), so the check covers that real path.
  addSkill(skill, { project: root, force: true });
  writeRules({ project: root });
  const installed = { length: readdirSync(join(root, '.claude', 'skills', skill)).length };
  const args = ['-p', '--output-format', 'stream-json', '--verbose', '--allowedTools', 'Read', 'Write', 'Edit', 'Glob', 'Grep', 'Skill', 'Bash(node:*)', 'Bash(ls:*)'];
  const spawnOpts = { cwd: root, input: prompt, encoding: 'utf8', timeout: timeoutMs, maxBuffer: 1 << 28 };
  const r = process.platform === 'win32'
    ? spawnSync(winCommandLine(engine, args), { ...spawnOpts, shell: true })
    : spawnSync(engine, args, spawnOpts);
  if (r.error) throw r.error;
  const s = parseStream(r.stdout, skill);
  writeFileSync(join(root, '.portable-check.jsonl'), r.stdout);
  return { skill, prompt, project: root, installedFiles: installed.length, exit: r.status, usedSkill: s.usedSkill, leakedRepoRules: REPO_MARKERS.test(s.final), touchedRepo: s.touchedRepo, produced: listProduced(root).filter((f) => f !== '.portable-check.jsonl' && f !== 'AGENTS.md'), cost: s.cost, answer: s.final };
}

if (process.argv[1] && resolve(process.argv[1]) === HERE) {
  const a = process.argv.slice(2);
  const arg = (n) => { const i = a.indexOf(n); return i >= 0 ? a[i + 1] : undefined; };
  const valued = new Set(['--prompt', '--out', '--engine']);
  const skill = a.find((x, i) => !x.startsWith('--') && !valued.has(a[i - 1]));
  try {
    if (!skill || !arg('--prompt')) throw new Error('usage: portable-check.mjs <skill> --prompt "<user request>" [--out <dir>] [--engine claude]');
    const r = await portableCheck(skill, arg('--prompt'), { out: arg('--out'), engine: arg('--engine') });
    const { answer, ...rest } = r;
    const quota = isQuotaError(answer);
    const pass = r.exit === 0 && r.usedSkill && !r.leakedRepoRules && r.touchedRepo.length === 0 && !quota && Boolean(answer.trim());
    if (a.includes('--record')) {
      if (!pass) {
        console.error(`refused to save evals/portable.json (${quota ? 'quota/limit error' : 'portable check failed'}); existing recording kept`);
      } else {
        const dir = join(REPO_ROOT, 'src', 'skills', skill);
        const rec = { skill, prompt: r.prompt, recordedAt: new Date().toISOString().slice(0, 10), agent: `${arg('--engine') ?? 'claude'} -p in an empty project outside the repository`, skillSha: behaviourHash(dir), exit: r.exit, usedSkill: r.usedSkill, leakedRepoRules: r.leakedRepoRules, touchedRepo: r.touchedRepo, produced: r.produced.length, cost: r.cost, answer: answer.slice(0, 6000) };
        mkdirSync(join(dir, 'evals'), { recursive: true });
        writeFileSync(join(dir, 'evals', 'portable.json'), JSON.stringify(rec, null, 2) + '\n');
        console.log(`recorded src/skills/${skill}/evals/portable.json`);
      }
    }
    console.log(JSON.stringify(rest, null, 2));
    console.log('\nANSWER:\n' + answer);
    process.exit(pass ? 0 : 1);
  } catch (e) { console.error(e.message); process.exit(2); }
}
