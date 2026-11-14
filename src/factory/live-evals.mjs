/**
 * Live evals: run a skill's eval cases through a REAL agent, record the raw output,
 * and score the recording with runEvals. Recordings live in evals/live/<case-id>.json.
 * CLI:  node src/factory/live-evals.mjs <skill> [--run] [--engine claude]
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
 * Score recorded real-agent output. Missing recordings count as failures.
 * @param {string} skillDir
 */
export function scoreLive(skillDir) {
  if (typeof skillDir !== 'string' || !skillDir) throw new TypeError('scoreLive: skillDir required');
  const { cases, rec } = loadRecordings(skillDir);
  const byPrompt = new Map(cases.map((c) => [c.prompt, rec[c.id]?.prompt === c.prompt ? rec[c.id] : undefined]));
  const r = runEvals(skillDir, (prompt) => {
    const x = byPrompt.get(prompt);
    return x ? { text: x.output + runText(x), files: x.files ?? [] } : { text: '' };
  });
  const missing = cases.filter((c) => !rec[c.id]).map((c) => c.id);
  const stale = cases.filter((c) => rec[c.id] && rec[c.id].prompt !== c.prompt).map((c) => c.id);
  for (const res of r.results) {
    if (missing.includes(res.id)) { res.ok = false; res.failures.unshift('no live recording'); }
    if (stale.includes(res.id)) { res.ok = false; res.failures.unshift('stale recording: case prompt changed, re-run'); }
  }
  const passed = r.results.filter((x) => x.ok).length;
  return { passed, failed: r.results.length - passed, missing, stale, results: r.results };
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

/** Run every case through a real agent CLI and save the recordings. */
export function runLive(skillDir, { engine = 'claude' } = {}) {
  const { cases } = loadRecordings(skillDir);
  mkdirSync(join(skillDir, 'evals', 'live'), { recursive: true });
  for (const c of cases) {
    const res = spawnSync(engine, ['-p', agentPrompt(skillDir, c.prompt)], { encoding: 'utf8', timeout: 600000 });
    if (res.status !== 0) throw new Error(`runLive: ${engine} failed on ${c.id}: ${res.stderr}`);
    const record = { case: c.id, prompt: c.prompt, agent: engine, recordedAt: new Date().toISOString().slice(0, 10), output: res.stdout.trim(), files: [] };
    writeFileSync(join(skillDir, 'evals', 'live', `${c.id}.json`), JSON.stringify(record, null, 2) + '\n');
  }
}

if (process.argv[1] && resolve(process.argv[1]) === HERE) {
  const [name, ...rest] = process.argv.slice(2);
  if (!name || !/^[a-z0-9][a-z0-9-]*$/.test(name)) { console.error('usage: live-evals.mjs <skill> [--run] [--engine claude]'); process.exit(2); }
  const dir = join(REPO_ROOT, 'src', 'skills', name);
  if (rest.includes('--run')) runLive(dir, { engine: rest[rest.indexOf('--engine') + 1] && rest.includes('--engine') ? rest[rest.indexOf('--engine') + 1] : 'claude' });
  const s = scoreLive(dir);
  for (const r of s.results) console.log(`${r.ok ? 'PASS' : 'FAIL'} ${r.id}${r.failures.length ? ' - ' + r.failures.join('; ') : ''}`);
  console.log(`live-evals ${name}: ${s.passed} passed, ${s.failed} failed`);
  process.exit(s.failed ? 1 : 0);
}
