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
    return { name: r.name, description: /^description:\s*(.*)$/m.exec(md)[1].trim() };
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

/** Ask a fresh agent and save the recording. */
export function runRouting({ engine = 'claude' } = {}) {
  const cases = JSON.parse(readFileSync(join(DIR, 'cases.json'), 'utf8'));
  const skills = readySkills();
  const res = spawnSync(engine, ['-p', routingPrompt(skills, cases)], { encoding: 'utf8', timeout: 300000 });
  if (res.status !== 0) throw new Error(`runRouting: ${engine} failed: ${res.stderr}`);
  const answers = parseRouting(res.stdout, cases);
  const live = { agent: `${engine} -p (fresh context, saw only skill names and descriptions)`, recordedAt: new Date().toISOString().slice(0, 10), descriptions: Object.fromEntries(skills.map((s) => [s.name, s.description])), answers };
  writeFileSync(join(DIR, 'live.json'), JSON.stringify(live, null, 2) + '\n');
  return live;
}

if (process.argv[1] && resolve(process.argv[1]) === HERE) {
  const i = process.argv.indexOf('--engine');
  if (process.argv.includes('--run')) runRouting({ engine: i > 0 && process.argv[i + 1] ? process.argv[i + 1] : 'claude' });
  const s = scoreRouting();
  for (const r of s.results) console.log(`${r.ok ? 'PASS' : 'FAIL'} ${r.id} expect ${r.expect}, got ${r.got}`);
  console.log(`routing-evals: ${s.passed} passed, ${s.failed} failed`);
  process.exit(s.failed ? 1 : 0);
}
