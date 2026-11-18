/**
 * Live evals: run a skill's eval cases through a REAL agent, record the raw output,
 * and score the recording with runEvals. Recordings live in evals/live/<case-id>.json.
 * CLI:  node src/factory/live-evals.mjs <skill> [--run] [--case <id[,id...]>] [--engine claude]
 *   without --run: score the existing recordings only (free, deterministic)
 *   with --run:    start a fresh agent per case (costs tokens), save, then score
 * @governed-by PO_ARCHITECT
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { runEvals } from './evals.mjs';

const HERE = fileURLToPath(import.meta.url);
const REPO_ROOT = resolve(dirname(HERE), '..', '..');

export const QUOTA_LIMIT_RE = /^\s*(?:API Error:\s*)?(?:You(?:'ve|’ve| have) (?:hit|reached) your [^\n]*limit|Usage limit reached|Rate limit reached|Credit balance is too low)/im;

/** Quote a command + args into a single Windows cmd.exe command string (avoids Node 24 DEP0190 and preserves spaces/parens). */
export function winCommandLine(cmd, args = []) {
  return [cmd, ...args].map((a) => {
    const s = String(a);
    return s === '' || /[\s"&|<>^()%]/.test(s) ? `"${s.replace(/(\\*)"/g, '$1$1\\"').replace(/(\\+)$/, '$1$1')}"` : s;
  }).join(' ');
}

/** Detect short CLI usage-limit / quota banners so exit-0 limit errors never pass or overwrite recordings. */
export function isQuotaError(text) {
  const s = String(text ?? '').trim();
  if (!s || s.length > 500) return false;
  return QUOTA_LIMIT_RE.test(s);
}

/** @param {string} skillDir */
export function loadRecordings(skillDir) {
  const cases = JSON.parse(readFileSync(join(skillDir, 'evals', 'cases.json'), 'utf8'));
  const rec = {};
  for (const c of cases) {
    const p = join(skillDir, 'evals', 'live', `${c.id}.json`);
    if (existsSync(p)) rec[c.id] = JSON.parse(readFileSync(p, 'utf8'));
  }
  return { cases, rec };
}

/**
 * Score recorded real-agent output. Missing, stale, and quota-limit recordings count as failures.
 * @param {string} skillDir
 */
export function scoreLive(skillDir) {
  if (typeof skillDir !== 'string' || !skillDir) throw new TypeError('scoreLive: skillDir required');
  const { cases, rec } = loadRecordings(skillDir);
  const byPrompt = new Map(cases.map((c) => [c.prompt, rec[c.id]?.prompt === c.prompt ? rec[c.id] : undefined]));
  const r = runEvals(skillDir, (prompt) => {
    const x = byPrompt.get(prompt);
    return x ? { text: x.output + runText(x), files: x.files ?? [], reply: x.output } : { text: '' };
  });
  const missing = cases.filter((c) => !rec[c.id]).map((c) => c.id);
  const stale = cases.filter((c) => rec[c.id] && rec[c.id].prompt !== c.prompt).map((c) => c.id);
  const quota = cases.filter((c) => rec[c.id] && isQuotaError(rec[c.id].output)).map((c) => c.id);
  for (const res of r.results) {
    if (missing.includes(res.id)) { res.ok = false; res.failures.unshift('no live recording'); }
    if (stale.includes(res.id)) { res.ok = false; res.failures.unshift('stale recording: case prompt changed, re-run'); }
    if (quota.includes(res.id)) { res.ok = false; res.failures.unshift('quota/limit error recorded instead of agent answer, re-run'); }
  }
  const passed = r.results.filter((x) => x.ok).length;
  return { passed, failed: r.results.length - passed, missing, stale, quota, results: r.results };
}

/**
 * A recording made by src/factory/run-skill.mjs points at the run folder that holds the files the agent produced
 * (`run: "runs/<skill>/<id>"`). Their text is scored together with the agent's reply; Markdown reports are left out.
 * @param {{run?:string}} rec
 */
export function runText(rec) {
  if (!rec || typeof rec.run !== 'string' || !/^runs\/[a-z0-9-]+\/[0-9a-f]+$/.test(rec.run)) return '';
  const dir = join(REPO_ROOT, rec.run, 'output');
  if (!existsSync(dir)) return '';
  let text = '';
  const walk = (d) => { for (const e of readdirSync(d)) { const p = join(d, e); if (statSync(p).isDirectory()) walk(p); else if (!e.endsWith('.md')) text += `\n${readFileSync(p, 'utf8')}`; } };
  walk(dir);
  return text;
}

/** Build the prompt a fresh agent receives: only the skill path and the user request. */
export function agentPrompt(skillDir, prompt) {
  return [
    `You have the skill at ${skillDir} installed. Read its SKILL.md and follow it exactly.`,
    'Do not edit files outside a temporary folder. Reply with only the answer you would give the user.',
    '',
    `User request: ${prompt}`,
  ].join('\n');
}

/** Normalize `--case` inputs (single id, comma-separated, or array) against `cases.json`. */
export function selectCases(cases, caseIds) {
  if (!caseIds || (Array.isArray(caseIds) && caseIds.length === 0)) return cases;
  const raw = Array.isArray(caseIds) ? caseIds : [caseIds];
  const wanted = [...new Set(raw.flatMap((x) => String(x).split(',')).map((x) => x.trim()).filter(Boolean))];
  if (wanted.length === 0) throw new Error('runLive: --case requires at least one case id');
  const known = new Set(cases.map((c) => c.id));
  const unknown = wanted.filter((id) => !known.has(id));
  if (unknown.length) throw new Error(`runLive: unknown case id(s): ${unknown.join(', ')}`);
  const set = new Set(wanted);
  return cases.filter((c) => set.has(c.id));
}

/** Run selected (or all) cases through a real agent CLI and save valid recordings without overwriting on errors/limits. */
export function runLive(skillDir, { engine = 'claude', cases: caseIds, spawn = spawnSync } = {}) {
  const { cases } = loadRecordings(skillDir);
  const targets = selectCases(cases, caseIds);
  mkdirSync(join(skillDir, 'evals', 'live'), { recursive: true });
  for (const c of targets) {
    const input = agentPrompt(skillDir, c.prompt);
    const res = process.platform === 'win32' && spawn === spawnSync
      ? spawn(winCommandLine(engine, ['-p']), { input, encoding: 'utf8', shell: true, timeout: 600000 })
      : spawn(engine, ['-p'], { input, encoding: 'utf8', timeout: 600000 });
    if (res.error) throw new Error(`runLive: ${engine} failed on ${c.id}: ${res.error.message}`);
    if (res.status !== 0) {
      const detail = (res.stderr || res.stdout || `exit ${res.status}`).trim();
      throw new Error(`runLive: ${engine} failed on ${c.id}: ${detail}`);
    }
    const output = String(res.stdout ?? '').trim();
    if (!output) throw new Error(`runLive: ${engine} returned empty output on ${c.id}; existing recording kept`);
    if (isQuotaError(output)) {
      throw new Error(`runLive: ${engine} hit usage/quota limit on ${c.id} ("${output.split('\n')[0]}"); existing recording kept`);
    }
    const record = { case: c.id, prompt: c.prompt, agent: engine, recordedAt: new Date().toISOString().slice(0, 10), output, files: [] };
    writeFileSync(join(skillDir, 'evals', 'live', `${c.id}.json`), JSON.stringify(record, null, 2) + '\n');
  }
  return targets.map((c) => c.id);
}

/** Parse CLI flags for live-evals.mjs. */
export function parseLiveArgs(argv) {
  let name;
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--engine' || a === '--case') { rest.push(a); if (argv[i + 1] !== undefined) rest.push(argv[++i]); continue; }
    if (!a.startsWith('--') && name === undefined) name = a;
    else rest.push(a);
  }
  let engine = 'claude';
  const cases = [];
  let run = false;
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a === '--run') run = true;
    else if (a === '--engine') {
      if (!rest[i + 1] || rest[i + 1].startsWith('--')) throw new Error('--engine requires a value');
      engine = rest[++i];
    } else if (a === '--case') {
      if (!rest[i + 1] || rest[i + 1].startsWith('--')) throw new Error('--case requires a case id');
      cases.push(rest[++i]);
    } else if (a.startsWith('--case=')) {
      const v = a.slice('--case='.length);
      if (!v) throw new Error('--case requires a case id');
      cases.push(v);
    } else if (a.startsWith('--engine=')) {
      const v = a.slice('--engine='.length);
      if (!v) throw new Error('--engine requires a value');
      engine = v;
    } else {
      throw new Error(`unknown option: ${a}`);
    }
  }
  return { name, run, engine, cases };
}

if (process.argv[1] && resolve(process.argv[1]) === HERE) {
  try {
    const { name, run, engine, cases } = parseLiveArgs(process.argv.slice(2));
    if (!name || !/^[a-z0-9][a-z0-9-]*$/.test(name)) {
      console.error('usage: live-evals.mjs <skill> [--run] [--case <id[,id...]>] [--engine claude]');
      process.exit(2);
    }
    const dir = join(REPO_ROOT, 'src', 'skills', name);
    if (run) runLive(dir, { engine, cases });
    const s = scoreLive(dir);
    for (const r of s.results) console.log(`${r.ok ? 'PASS' : 'FAIL'} ${r.id}${r.failures.length ? ' - ' + r.failures.join('; ') : ''}`);
    console.log(`live-evals ${name}: ${s.passed} passed, ${s.failed} failed`);
    process.exit(s.failed ? 1 : 0);
  } catch (e) {
    console.error(e.message);
    process.exit(2);
  }
}
