#!/usr/bin/env node
/**
 * One command that says whether this branch may go to master: every gate of the lab, in order, no tokens spent.
 *   npm run release:check
 * Prints PASS or FAIL per gate and exits 0 only when all pass. It never merges, pushes or records anything.
 * @governed-by PO_ARCHITECT
 */
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const ready = JSON.parse(readFileSync(join(ROOT, 'src', 'factory', 'registry.json'), 'utf8')).filter((r) => r.status === 'ready').map((r) => r.name);
export const GATES = [
  ['tests (incl. portable, recipes, real-output site, CLI)', 'npm', ['test']],
  ['skill lint', 'node', ['src/factory/lint-skills.mjs']],
  ['routing evals (recorded)', 'node', ['src/factory/routing-evals.mjs']],
  ...ready.map((n) => [`live evals: ${n}`, 'node', ['src/factory/live-evals.mjs', n]]),
  ['site builds the same twice, links ok', 'node', ['src/site/build.mjs', '--check']],
  ['version & changelog tracking (against master)', 'node', ['src/factory/version-check.mjs']],
  ['skill guard (one skill per change, locks)', 'node', ['src/factory/skill-guard.mjs']],
];

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let bad = 0;
  for (const [name, cmd, args] of GATES) {
    const winNpm = process.platform === 'win32' && cmd === 'npm';
    const r = spawnSync(winNpm ? 'cmd.exe' : cmd, winNpm ? ['/c', cmd, ...args] : args, { cwd: ROOT, encoding: 'utf8', env: { ...process.env, NODE_NO_WARNINGS: '1' } });
    const ok = r.status === 0;
    if (!ok) bad++;
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`);
    if (!ok) {
      const msg = `${r.stdout ?? ''}${r.stderr ?? ''}${r.error ? `\n${r.error.message}` : ''}`.trim();
      if (msg) console.log(msg.split('\n').slice(-8).map((l) => `      ${l}`).join('\n'));
    }
  }
  console.log(bad ? `\nNOT READY: ${bad} gate(s) failed. Fix them; do not ask for a merge.` : '\nREADY: all gates pass. Ask TAIMO in chat to approve the merge to master.');
  process.exitCode = bad ? 1 : 0;
}
