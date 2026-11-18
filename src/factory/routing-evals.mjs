/**
 * Routing evals: does a real agent, seeing only skill names and descriptions, load the right skill?
 * Cases: src/factory/routing/cases.json. Recorded real-agent answers: src/factory/routing/live.json.
 * CLI: node src/factory/routing-evals.mjs [--run] [--engine claude]
 *   --run: ask a fresh agent (costs tokens) with the current descriptions of every ready skill, and save its answers
 * @governed-by PO_ARCHITECT
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isQuotaError } from './live-evals.mjs';

const HERE = fileURLToPath(import.meta.url);
const DIR = join(dirname(HERE), 'routing');

/** The prompt a fresh agent receives: the skill list exactly as a runtime shows it, then the requests. */
export function routingPrompt(skills, cases) {
  const list = skills.map((s) => `- ${s.name}: ${s.description}`).join('\n');
  const reqs = cases.map((c, i) => `${i + 1}. ${c.prompt}`).join('\n');
  return `You see ONLY these skills:\n${list}\n\nFor each request answer the single skill you would load, or none.\n${reqs}\n\nReply with lines "<n>: <skill-or-none>".`;
}

/** @param {{cases?:any[], live?:any}} [opts] */
export function scoreRouting({ cases, live } = {}) {
  cases ??= JSON.parse(readFileSync(join(DIR, 'cases.json'), 'utf8'));
  live ??= JSON.parse(readFileSync(join(DIR, 'live.json'), 'utf8'));
  const results = cases.map((c) => {
    const got = live.answers?.[c.id];
    return { id: c.id, expect: c.expect, got: got ?? null, ok: got === c.expect };
  });
  const passed = results.filter((r) => r.ok).length;
  return { passed, failed: results.length - passed, results };
}

/** Current name and description of every ready skill, as an agent runtime would list them. */
export function readySkills(root = resolve(dirname(HERE), '..', '..')) {
  const registry = JSON.parse(readFileSync(join(root, 'src', 'factory', 'registry.json'), 'utf8'));
  return registry.filter((r) => r.status === 'ready').map((r) => {
    const md = readFileSync(join(root, 'src', 'skills', r.name, 'SKILL.md'), 'utf8');
    const m = /^description:\s*(.*)$/m.exec(md);
    if (!m) throw new Error(`readySkills: missing description in ${r.name}/SKILL.md`);
    return { name: r.name, description: m[1].trim() };
  });
}

/** Parse an agent reply of lines "<n>: <skill-or-none>" into answers by case id. */
export function parseRouting(reply, cases) {
  const answers = {};
  for (const m of String(reply).matchAll(/^\s*(\d+)\s*[:.]\s*`?([a-z0-9-]+)`?\s*$/gim)) {
    const c = cases[Number(m[1]) - 1];
    if (c) answers[c.id] = m[2].toLowerCase();
  }
  return answers;
}

/** Ask a fresh agent and save the recording, keeping existing live.json on CLI or quota errors. */
export function runRouting({ engine = 'claude', spawn = spawnSync, dir = DIR } = {}) {
  const cases = JSON.parse(readFileSync(join(dir, 'cases.json'), 'utf8'));
  const skills = readySkills();
  const res = spawn(engine, ['-p'], { input: routingPrompt(skills, cases), encoding: 'utf8', shell: process.platform === 'win32', timeout: 300000 });
  if (res.error) throw new Error(`runRouting: ${engine} failed: ${res.error.message}`);
  if (res.status !== 0) throw new Error(`runRouting: ${engine} failed: ${(res.stderr || res.stdout || `exit ${res.status}`).trim()}`);
  if (isQuotaError(res.stdout)) throw new Error(`runRouting: ${engine} hit usage/quota limit ("${String(res.stdout).trim().split('\n')[0]}"); existing live.json kept`);
  const answers = parseRouting(res.stdout, cases);
  if (Object.keys(answers).length === 0) throw new Error(`runRouting: ${engine} returned no "<n>: <skill>" answers; existing live.json kept`);
  if (Object.keys(answers).length < cases.length) throw new Error(`runRouting: ${engine} answered ${Object.keys(answers).length} of ${cases.length} cases; existing live.json kept`);
  const live = { agent: `${engine} -p (fresh context, saw only skill names and descriptions)`, recordedAt: new Date().toISOString().slice(0, 10), descriptions: Object.fromEntries(skills.map((s) => [s.name, s.description])), answers };
  writeFileSync(join(dir, 'live.json'), JSON.stringify(live, null, 2) + '\n');
  return live;
}

if (process.argv[1] && resolve(process.argv[1]) === HERE) {
  try {
    const i = process.argv.indexOf('--engine');
    const engine = i > 0 ? (process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : (() => { throw new Error('--engine requires a value'); })()) : 'claude';
    if (process.argv.includes('--run')) runRouting({ engine });
    const s = scoreRouting();
    for (const r of s.results) console.log(`${r.ok ? 'PASS' : 'FAIL'} ${r.id} expect ${r.expect}, got ${r.got}`);
    const live = JSON.parse(readFileSync(join(DIR, 'live.json'), 'utf8'));
    const stale = readySkills().filter((sk) => live.descriptions?.[sk.name] !== sk.description).map((sk) => sk.name);
    if (stale.length) console.error(`FAIL routing recording is stale for: ${stale.join(', ')}`);
    console.log(`routing-evals: ${s.passed} passed, ${s.failed} failed${stale.length ? `, ${stale.length} stale` : ''}`);
    process.exit(s.failed || stale.length ? 1 : 0);
  } catch (e) { console.error(e.message); process.exit(2); }
}
