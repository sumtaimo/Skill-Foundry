/**
 * Routing evals: does a real agent, seeing only skill names and descriptions, load the right skill?
 * Cases: src/factory/routing/cases.json. Recorded real-agent answers: src/factory/routing/live.json.
 * CLI: node src/factory/routing-evals.mjs
 * @governed-by PO_ARCHITECT
 */
import { readFileSync } from 'node:fs';
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

if (process.argv[1] && resolve(process.argv[1]) === HERE) {
  const s = scoreRouting();
  for (const r of s.results) console.log(`${r.ok ? 'PASS' : 'FAIL'} ${r.id} expect ${r.expect}, got ${r.got}`);
  console.log(`routing-evals: ${s.passed} passed, ${s.failed} failed`);
  process.exit(s.failed ? 1 : 0);
}
