import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { routingPrompt, parseRouting, scoreRouting, readySkills } from '../../../../src/factory/routing-evals.mjs';
import { isQuotaError, winCommandLine } from '../../../../src/factory/live-evals.mjs';

const regPath = 'src/factory/registry.json';
const origReg = readFileSync(regPath, 'utf8');
const reg = JSON.parse(origReg);
const entry = reg.find((x) => x.name === 'tiny-charts');
if (!entry) throw new Error('tiny-charts not in registry.json');
entry.status = 'ready';
writeFileSync(regPath, JSON.stringify(reg, null, 2) + '\n', 'utf8');

const extraCases = [
  { id: 'tc1', prompt: 'Create a playable single-file HTML statechart for our checkout payment retry rules and include a Show the logic toggle.', expect: 'tiny-charts' },
  { id: 'tc2', prompt: 'Auto-pick the best playable chart type for our 14-day trial timeline, explain why, and give me a standalone HTML with Rules and Flowchart.', expect: 'tiny-charts' },
  { id: 'tc3', prompt: 'Turn this refund policy (<= 14 days and unopened -> auto-approve, else manual review) into an interactive playable HTML flowchart with Show the logic.', expect: 'tiny-charts' },
  { id: 'tc4', prompt: 'Show how 100% incoming leads split across Qualified, Drop-off, and Won in a playable standalone HTML Sankey with a Show the logic drawer.', expect: 'tiny-charts' },
  { id: 'tc5', prompt: 'Draw an animated 2D architecture SVG of our Producer -> Queue -> Worker pipeline synced strictly to design/tokens.css with <defs> gradients and Play/Pause.', expect: 'svg-mechanism' },
  { id: 'tc6', prompt: 'Draw an interactive 3D isometric cutaway of a coffee grinder showing its burrs and motor.', expect: 'figure-craft' },
];

const tempDir = mkdtempSync(join(tmpdir(), 'sf-tc-route-'));
const outFile = join(tempDir, 'route.txt');
try {
  const baseCases = JSON.parse(readFileSync('src/factory/routing/cases.json', 'utf8'));
  const cases = [...baseCases, ...extraCases];
  const skills = readySkills();
  const prompt = routingPrompt(skills, cases);

  const args = ['exec', '-s', 'read-only', '--skip-git-repo-check', '--ephemeral', '-C', tempDir, '-o', outFile, '-'];
  const r = spawnSync(winCommandLine('codex', args), {
    input: prompt,
    encoding: 'utf8',
    shell: true,
    timeout: 300000,
  });
  if (r.error) throw r.error;
  if (r.status !== 0) throw new Error(`codex exit ${r.status}: ${(r.stderr || r.stdout || '').slice(0, 400)}`);
  const reply = readFileSync(outFile, 'utf8').trim();
  if (isQuotaError(reply)) throw new Error(`quota error: ${reply}`);

  const answers = parseRouting(reply, cases);
  const live = {
    agent: 'codex exec (fresh context, saw only skill names and descriptions)',
    recordedAt: new Date().toISOString().slice(0, 10),
    descriptions: Object.fromEntries(skills.map((s) => [s.name, s.description])),
    answers,
  };
  const score = scoreRouting({ cases, live });
  mkdirSync('docs/skills/tiny-charts/proof', { recursive: true });
  writeFileSync(
    'docs/skills/tiny-charts/proof/routing-live.json',
    JSON.stringify({ ...live, summary: { passed: score.passed, failed: score.failed, total: cases.length } }, null, 2) + '\n',
    'utf8',
  );
  const fails = score.results.filter((x) => !x.ok);
  for (const f of fails) console.log(`FAIL ${f.id}: expected ${f.expect}, got ${f.got}`);
  console.log(`shadow routing tiny-charts: ${score.passed} passed, ${score.failed} failed (total ${cases.length})`);
  process.exitCode = score.failed ? 1 : 0;
} finally {
  writeFileSync(regPath, origReg, 'utf8');
  rmSync(tempDir, { recursive: true, force: true });
}
