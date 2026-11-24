// Record live evals in four fixed batches, each in its own copy outside the repository. Starts exactly four children.
import { spawn } from 'node:child_process';
import { cpSync, mkdirSync, rmSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { tmpdir } from 'node:os';
const SP = join(tmpdir(), 'motion-craft-proof'); // outside the repository on purpose: agents started inside it read its rules
mkdirSync(SP, { recursive: true });
const REPO = fileURLToPath(new URL('../../../../', import.meta.url)); // the repository this file is in
const OUT = join(SP, 'recorded');
const all = ['no-assets,build-boundary,no-subject', 'khmer,lookbook,no-subject-khmer', 'has-video,override,video-generator', 'rooms,no-facts,task-screen', 'editorial,spatial-canvas'];
const args = process.argv.slice(2);
const ei = args.indexOf('--engine');
const engine = ei >= 0 ? args[ei + 1] : undefined;
const pos = args.filter((a, i) => !a.startsWith('--') && (ei < 0 || i !== ei + 1));
const BATCHES = pos[0] ? [pos[0]] : all;
if (!pos[0]) rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

await Promise.all(BATCHES.map((cases, i) => new Promise((done) => {
  const root = join(SP, `batch-${i}`);
  rmSync(root, { recursive: true, force: true });
  cpSync(join(REPO, 'src/factory'), join(root, 'src/factory'), { recursive: true });
  const skill = join(root, 'src/skills/motion-craft');
  cpSync(join(REPO, 'src/skills/motion-craft'), skill, { recursive: true });
  rmSync(join(skill, 'evals/live'), { recursive: true, force: true });
  writeFileSync(join(root, 'package.json'), '{"type":"module"}');
  const child = spawn(process.execPath, [join(root, 'src/factory/live-evals.mjs'), 'motion-craft', '--run', '--case', cases, ...(engine ? ['--engine', engine] : [])], { cwd: skill, timeout: 560000 });
  let log = '';
  child.stdout.on('data', (d) => { log += d; });
  child.stderr.on('data', (d) => { log += d; });
  child.on('close', (code) => {
    try { for (const f of readdirSync(join(skill, 'evals/live'))) cpSync(join(skill, 'evals/live', f), join(OUT, f)); } catch { /* nothing recorded */ }
    const names = cases.split(',');
    console.log(log.split('\n').filter((l) => names.some((n) => l.startsWith(`PASS ${n}`) || l.startsWith(`FAIL ${n} `)) || !/^(PASS|FAIL|live-evals)/.test(l)).join('\n') + ` (exit ${code})`);
    done();
  });
})));
