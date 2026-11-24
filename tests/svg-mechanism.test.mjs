/**
 * svg-mechanism: lint is clean, all RULES.json check IDs are covered, engine/lint-svg.mjs
 * catches M1-M8 violations, reference outputs satisfy cases.json, and live HTML outputs
 * pass Playwright checkPage (1440px/390px, light/dark, reduced motion, zero console errors).
 * @governed-by PO_ARCHITECT
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lintSkill } from '../src/factory/lint-skills.mjs';
import { runEvals } from '../src/factory/evals.mjs';
import { checkPage, SKIP_REASON } from '../src/factory/visual.mjs';
import { lintMechanismSvg } from '../src/skills/svg-mechanism/engine/lint-svg.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'src', 'skills', 'svg-mechanism');

// Rule check coverage IDs referenced in src/skills/svg-mechanism/RULES.json:
const RULE_CHECKS = [
  'svgmech-detect-tokens',
  'svgmech-viewbox-margins',
  'svgmech-defs-layers',
  'svgmech-token-colors',
  'svgmech-light-dark',
  'svgmech-gpu-motion',
  'svgmech-play-pause',
  'svgmech-reduced-motion',
  'svgmech-a11y-title-desc',
  'svgmech-khmer-legibility',
  'svgmech-ask-when-vague',
  'svgmech-refuse-out-of-scope',
];

const REFERENCE_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Webhook Delivery Pipeline</title>
<style>
:root {
  color-scheme: light dark;
  --color-surface-default: #f8fafc;
  --color-surface-raised: #ffffff;
  --color-surface-subtle: #f1f5f9;
  --color-text-default: #0f172a;
  --color-text-muted: #475569;
  --color-border-default: #cbd5e1;
  --color-border-strong: #64748b;
  --color-border-focus: #2563eb;
  --color-action-primary-bg: #1d4ed8;
  --color-warning-text: #b45309;
  --mech-canvas: var(--color-surface-default);
  --mech-node-top: var(--color-surface-raised);
  --mech-node-bottom: var(--color-surface-subtle);
  --mech-grid-dot: var(--color-border-default);
  --mech-track: var(--color-border-strong);
  --mech-accent: var(--color-action-primary-bg);
  --mech-warn: var(--color-warning-text);
  --mech-text: var(--color-text-default);
  --mech-muted: var(--color-text-muted);
}
:root[data-theme="dark"] {
  --color-surface-default: #0b1120;
  --color-surface-raised: #162033;
  --color-surface-subtle: #111827;
  --color-text-default: #f8fafc;
  --color-text-muted: #cbd5e1;
  --color-border-default: #334155;
  --color-border-strong: #64748b;
  --color-border-focus: #60a5fa;
  --color-action-primary-bg: #38bdf8;
  --color-warning-text: #fbbf24;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-surface-default: #0b1120;
    --color-surface-raised: #162033;
    --color-surface-subtle: #111827;
    --color-text-default: #f8fafc;
    --color-text-muted: #cbd5e1;
    --color-border-default: #334155;
    --color-border-strong: #64748b;
    --color-border-focus: #60a5fa;
    --color-action-primary-bg: #38bdf8;
    --color-warning-text: #fbbf24;
  }
}
* { box-sizing: border-box; }
body {
  margin: 0;
  padding: 20px;
  background: var(--color-surface-default);
  color: var(--color-text-default);
  font-family: system-ui, -apple-system, sans-serif;
}
.mech-figure { max-width: 920px; margin: 0 auto; }
.mech-controls { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin-bottom: 12px; }
.mech-btn {
  min-height: 44px; min-width: 44px; padding: 0 16px;
  border-radius: 10px; border: 1px solid var(--color-border-default);
  background: var(--color-surface-raised); color: var(--color-text-default);
  font-size: 14px; font-weight: 500; cursor: pointer;
}
.mech-btn:focus-visible { outline: 2px solid var(--color-border-focus); outline-offset: 2px; }
.mech-svg { display: block; width: 100%; height: auto; }
.km-label { letter-spacing: 0; }
@keyframes mech-flow { from { stroke-dashoffset: 64; } to { stroke-dashoffset: 0; } }
.signal-stream { stroke-dasharray: 14 18; stroke-linecap: round; animation: mech-flow 2.4s linear infinite; }
.mech-figure[data-paused="true"] .signal-stream { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) {
  .signal-stream { animation: none !important; animation-play-state: paused !important; }
}
</style>
</head>
<body>
<figure class="mech-figure" data-paused="false">
  <div class="mech-controls">
    <button type="button" class="mech-btn" data-mech-toggle aria-pressed="false">Pause animation</button>
    <span role="status" aria-live="polite" data-mech-status>Animation playing.</span>
  </div>
  <svg class="mech-svg" viewBox="0 0 920 400" width="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-labelledby="mech-title mech-desc">
    <title id="mech-title">Webhook Delivery Pipeline</title>
    <desc id="mech-desc">Events flow from Producer to Queue to Worker; failed deliveries route to Retry DLQ.</desc>
    <defs>
      <linearGradient id="node-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--mech-node-top)"/>
        <stop offset="100%" stop-color="var(--mech-node-bottom)"/>
      </linearGradient>
      <pattern id="dot-grid" width="24" height="24" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill="var(--mech-grid-dot)"/>
      </pattern>
      <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 1 2 L 8 5 L 1 8 Z" fill="var(--mech-accent)"/>
      </marker>
    </defs>
    <g class="layer-backdrop">
      <rect x="0" y="0" width="920" height="400" rx="16" fill="var(--mech-canvas)"/>
      <rect x="0" y="0" width="920" height="400" rx="16" fill="url(#dot-grid)"/>
    </g>
    <g class="layer-tracks" fill="none" stroke-width="2">
      <path d="M 224 148 L 352 148" stroke="var(--mech-track)" marker-end="url(#arrow)"/>
      <path d="M 552 148 L 680 148" stroke="var(--mech-track)" marker-end="url(#arrow)"/>
      <path d="M 780 198 L 780 300 L 560 300" stroke="var(--mech-warn)" stroke-dasharray="6 4" marker-end="url(#arrow)"/>
    </g>
    <g class="layer-signals" fill="none">
      <path class="signal-stream" d="M 224 148 L 348 148" stroke="var(--mech-accent)" stroke-width="3"/>
      <path class="signal-stream" d="M 552 148 L 676 148" stroke="var(--mech-accent)" stroke-width="3"/>
    </g>
    <g class="layer-nodes">
      <rect x="44" y="98" width="180" height="100" rx="12" fill="url(#node-grad)" stroke="var(--mech-accent)" stroke-width="1.5"/>
      <rect x="358" y="98" width="194" height="100" rx="12" fill="url(#node-grad)" stroke="var(--mech-track)" stroke-width="1.5"/>
      <rect x="686" y="98" width="184" height="100" rx="12" fill="url(#node-grad)" stroke="var(--mech-track)" stroke-width="1.5"/>
      <rect x="358" y="264" width="194" height="72" rx="12" fill="url(#node-grad)" stroke="var(--mech-warn)" stroke-width="1.5"/>
    </g>
    <g class="layer-labels" font-family="system-ui, -apple-system, sans-serif">
      <text x="134" y="144" fill="var(--mech-text)" font-size="15" font-weight="600" text-anchor="middle">Producer</text>
      <text x="455" y="144" fill="var(--mech-text)" font-size="15" font-weight="600" text-anchor="middle">Queue</text>
      <text x="778" y="144" fill="var(--mech-text)" font-size="15" font-weight="600" text-anchor="middle">Worker</text>
      <text x="455" y="305" fill="var(--mech-warn)" font-size="14" font-weight="600" text-anchor="middle">Retry DLQ</text>
    </g>
  </svg>
</figure>
<script>
const fig = document.querySelector('.mech-figure');
const btn = fig.querySelector('[data-mech-toggle]');
const status = fig.querySelector('[data-mech-status]');
btn.addEventListener('click', () => {
  const next = fig.dataset.paused !== 'true';
  fig.dataset.paused = String(next);
  btn.setAttribute('aria-pressed', String(next));
  btn.textContent = next ? 'Play animation' : 'Pause animation';
  status.textContent = next ? 'Animation paused.' : 'Animation playing.';
});
</script>
</body>
</html>`;

test('svg-mechanism lint is clean and every RULES.json check ID is declared', async () => {
  const problems = await lintSkill(DIR, { testsDir: path.join(ROOT, 'tests') });
  assert.deepEqual(problems, []);
  const rules = JSON.parse(readFileSync(path.join(DIR, 'RULES.json'), 'utf8'));
  const checksInRules = rules.filter((r) => r.check).map((r) => r.check);
  assert.deepEqual(checksInRules, RULE_CHECKS);
});

test('engine/lint-svg.mjs passes M1-M8 on reference HTML and catches raw hex / clipped text / missing reduced-motion', () => {
  const good = lintMechanismSvg(REFERENCE_HTML);
  assert.equal(good.ok, true, `Expected clean lint, got: ${good.errors.join('; ')}`);
  assert.deepEqual(good.viewBox, [0, 0, 920, 400]);

  const withRawHex = REFERENCE_HTML.replace('fill="var(--mech-text)"', 'fill="#123456"');
  const hexRes = lintMechanismSvg(withRawHex);
  assert.equal(hexRes.ok, false);
  assert.equal(hexRes.checks.M6_noRawHexInSvg, false);

  const clippedText = REFERENCE_HTML.replace('x="134"', 'x="4"');
  const clipRes = lintMechanismSvg(clippedText);
  assert.equal(clipRes.ok, false);
  assert.equal(clipRes.checks.M7_safeTextMargins, false);

  const noReduced = REFERENCE_HTML.replace('prefers-reduced-motion: reduce', 'min-width: 100px');
  const rmRes = lintMechanismSvg(noReduced);
  assert.equal(rmRes.ok, false);
  assert.equal(rmRes.checks.M5_reducedMotion, false);
});

test('svg-mechanism reference outputs satisfy cases.json', () => {
  const wrap = (title, body) => `## SVG Mechanism: ${title}\n\n${body}`;
  const answers = {
    'webhook-pipeline': { text: wrap('Webhook Delivery Pipeline', REFERENCE_HTML) },
    'oauth-pkce-handshake': { text: wrap('OAuth 2.0 PKCE Handshake', REFERENCE_HTML.replace('Webhook Delivery Pipeline', 'OAuth 2.0 PKCE Handshake')) },
    'react-cache-flow': { text: wrap('3-Tier Cache Flow', `export function CacheFlow() {\n${REFERENCE_HTML}\n}`) },
    'reads-design-foundation': { text: wrap('AI Agent Loop', REFERENCE_HTML) },
    'khmer-payment-flow': { text: wrap('QR Payment Flow', REFERENCE_HTML.replace('Producer', 'QR Scan')) },
    'vague-ask-first': { text: '1. Which system or mechanism should the diagram explain, and what are its stages?\n2. Should it be standalone HTML or React/JSX?' },
    'isometric-object-declined': { text: 'This skill draws 2D animated technical architecture SVGs; for a 3D isometric cutaway illustration of a physical espresso machine, use figure-craft.' },
    'ui-screen-declined': { text: 'This skill builds animated 2D architecture SVGs; to design and build a full SaaS billing screen with navbar and command palette, use ui-craft.' },
    'scroll-story-declined': { text: 'This skill draws 2D animated architecture SVGs; for a full-page scroll-choreographed showcase with GSAP ScrollTrigger, Lenis and WebGL, use motion-craft.' },
  };
  const cases = JSON.parse(readFileSync(path.join(DIR, 'evals', 'cases.json'), 'utf8'));
  assert.equal(cases.length, Object.keys(answers).length);
  const byPrompt = Object.fromEntries(cases.map((c) => [c.prompt, answers[c.id]]));
  const { passed, failed, results } = runEvals(DIR, (prompt) => byPrompt[prompt]);
  assert.equal(failed, 0, JSON.stringify(results.filter((r) => !r.ok), null, 2));
  assert.equal(passed, 9);
});

test('svg-mechanism reference HTML passes Playwright checkPage (1440px, 390px, light/dark, reduced motion)', async (t) => {
  const tmp = mkdtempSync(path.join(tmpdir(), 'svgmech-ref-'));
  try {
    const htmlPath = path.join(tmp, 'ref.html');
    writeFileSync(htmlPath, REFERENCE_HTML, 'utf8');
    const res = await checkPage(htmlPath, { widths: [1440, 390], themes: ['light', 'dark'], reducedMotion: true });
    if (res.skipped === SKIP_REASON) return t.skip(SKIP_REASON);
    assert.equal(res.ok, true, JSON.stringify(res.problems));
    assert.deepEqual(res.problems, []);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});

test('svg-mechanism live HTML files in evals/live/files pass lintMechanismSvg and Playwright checkPage', async (t) => {
  const filesDir = path.join(DIR, 'evals', 'live', 'files');
  if (!existsSync(filesDir)) return t.skip('no live HTML files recorded yet');
  const htmlFiles = readdirSync(filesDir).filter((f) => f.endsWith('.html'));
  if (!htmlFiles.length) return t.skip('no live HTML files recorded yet');

  for (const f of htmlFiles) {
    const full = path.join(filesDir, f);
    const src = readFileSync(full, 'utf8');
    const lint = lintMechanismSvg(src, { requireInteractive: true });
    assert.equal(lint.ok, true, `${f} failed lintMechanismSvg: ${lint.errors.join('; ')}`);
    const res = await checkPage(full, { widths: [1440, 390], themes: ['light', 'dark'], reducedMotion: true });
    if (res.skipped !== SKIP_REASON) {
      assert.equal(res.ok, true, `${f} failed checkPage: ${JSON.stringify(res.problems)}`);
      assert.deepEqual(res.problems, []);
    }
  }
});
