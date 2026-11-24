import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { runRouting, scoreRouting } from '../../../../src/factory/routing-evals.mjs';

const regPath = 'src/factory/registry.json';
const origReg = readFileSync(regPath, 'utf8');
const reg = JSON.parse(origReg);
const entry = reg.find((x) => x.name === 'svg-mechanism');
if (!entry) throw new Error('svg-mechanism not in registry.json');
entry.status = 'ready';
writeFileSync(regPath, JSON.stringify(reg, null, 2) + '\n', 'utf8');

const extraCases = [
  { id: 'sm1', prompt: 'Draw an animated 2D architecture SVG showing how our webhook queue and retry DLQ work, synced to CSS tokens with Play/Pause.', expect: 'svg-mechanism' },
  { id: 'sm2', prompt: 'Build a token-synced animated SVG diagram explaining an OAuth 2.0 PKCE handshake with prefers-reduced-motion support.', expect: 'svg-mechanism' },
  { id: 'sm3', prompt: 'Visualize how our CDN edge cache hit/miss pipeline works as an animated 2D data flow SVG in React.', expect: 'svg-mechanism' },
  { id: 'sm4', prompt: 'Create an interactive 2D animated SVG explaining an AI agent planner-executor-verifier loop with light and dark CSS variables.', expect: 'svg-mechanism' },
  { id: 'sm5', prompt: 'Draw an interactive 3D isometric cutaway illustration of an espresso machine showing the boiler and pump.', expect: 'figure-craft' },
  { id: 'sm6', prompt: 'Build a modern billing dashboard screen with frosted glass header, Ctrl+K command palette, and empty states.', expect: 'ui-craft' },
];

const tempDir = mkdtempSync(join(tmpdir(), 'sf-svgmech-route-'));
try {
  const baseCases = JSON.parse(readFileSync('src/factory/routing/cases.json', 'utf8'));
  const allCases = [...baseCases, ...extraCases];
  writeFileSync(join(tempDir, 'cases.json'), JSON.stringify(allCases, null, 2) + '\n', 'utf8');
  const live = runRouting({ engine: 'agy', dir: tempDir });
  const score = scoreRouting({ cases: allCases, live });
  mkdirSync('docs/skills/svg-mechanism/proof', { recursive: true });
  writeFileSync('docs/skills/svg-mechanism/proof/routing-live.json', JSON.stringify({ ...live, summary: { passed: score.passed, failed: score.failed, total: allCases.length } }, null, 2) + '\n', 'utf8');
  const fails = score.results.filter((r) => !r.ok);
  for (const f of fails) console.log(`FAIL ${f.id}: expected ${f.expect}, got ${f.got}`);
  console.log(`shadow routing svg-mechanism: ${score.passed} passed, ${score.failed} failed (total ${allCases.length})`);
  process.exitCode = score.failed ? 1 : 0;
} finally {
  writeFileSync(regPath, origReg, 'utf8');
  rmSync(tempDir, { recursive: true, force: true });
}
