/**
 * tiny-charts: lint is clean, all RULES.json check IDs are covered, engine/lint-chart.mjs
 * catches C1-C8 violations, gold example passes Playwright checkPage + interactive logic toggle,
 * and recorded live HTML outputs pass lintTinyChart + Playwright checkPage.
 * @governed-by PO_ARCHITECT
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { lintSkill } from '../src/factory/lint-skills.mjs';
import { runEvals } from '../src/factory/evals.mjs';
import { checkPage, SKIP_REASON } from '../src/factory/visual.mjs';
import { lintTinyChart } from '../src/skills/tiny-charts/engine/lint-chart.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'src', 'skills', 'tiny-charts');

// Rule check coverage IDs referenced in src/skills/tiny-charts/RULES.json:
const RULE_CHECKS = [
  'tinycharts-autopick-rationale',
  'tinycharts-self-contained',
  'tinycharts-declarative-statechart',
  'tinycharts-playable-controls',
  'tinycharts-show-logic',
  'tinycharts-svg-a11y',
  'tinycharts-light-dark',
  'tinycharts-reduced-motion',
  'tinycharts-ask-when-vague',
  'tinycharts-refuse-out-of-scope',
];

test('tiny-charts lint is clean and every RULES.json check ID is declared', async () => {
  const problems = await lintSkill(DIR, { testsDir: path.join(ROOT, 'tests') });
  assert.deepEqual(problems, []);
  const rules = JSON.parse(readFileSync(path.join(DIR, 'RULES.json'), 'utf8'));
  const checksInRules = rules.filter((r) => r.check).map((r) => r.check);
  assert.deepEqual(checksInRules, RULE_CHECKS);
});

test('engine/lint-chart.mjs passes C1-C8 on gold example and catches violations', () => {
  const examplePath = path.join(DIR, 'assets', 'examples', 'checkout-statechart.html');
  const html = readFileSync(examplePath, 'utf8');
  const good = lintTinyChart(html);
  assert.equal(good.ok, true, `Expected clean lint, got: ${good.errors.join('; ')}`);

  const withCdn = html.replace('</head>', '<script src="https://cdn.example.com/lib.js"></script></head>');
  assert.equal(lintTinyChart(withCdn).checks.C1_selfContained, false);

  const noLogic = html.replace(/Show the logic/gi, 'Details');
  assert.equal(lintTinyChart(noLogic).checks.C5_showLogicToggle, false);

  const noSpec = html.replace(/CHART_SPEC/g, 'DATA_ONLY');
  assert.equal(lintTinyChart(noSpec).checks.C6_declarativeStatechart, false);

  const noWhy = html.replace(/Why this chart:/gi, 'Summary:');
  assert.equal(lintTinyChart(noWhy).checks.C7_autoPickRationale, false);

  const noReduced = html.replace('prefers-reduced-motion: reduce', 'min-width: 100px');
  assert.equal(lintTinyChart(noReduced).checks.C8_reducedMotion, false);
});

test('tiny-charts reference outputs satisfy cases.json', () => {
  const exampleHtml = readFileSync(path.join(DIR, 'assets', 'examples', 'checkout-statechart.html'), 'utf8');
  const make = (type, why) => `Chart choice: ${type}\nWhy this chart: ${why}\n\n\`\`\`html\n${exampleHtml.replace('Statechart', type)}\n\`\`\``;
  const answers = {
    'checkout-statechart': { text: make('Statechart', 'Guarded statuses and bounded retries fit a statechart.') },
    'actor-sequence': { text: make('Sequence', 'Ordered messages between named actors fit a sequence diagram.') },
    'refund-flowchart': { text: make('Flowchart', 'Explicit if/else approval thresholds fit a flowchart.') },
    'trial-timeline': { text: make('Timeline', 'Chronological phases across Day 0-14 fit a timeline.') },
    'funnel-sankey': { text: make('Sankey', 'Proportional splits across funnel stages fit a sankey diagram.') },
    'vague-ask-first': { text: '1. Which workflow, decision policy, or system steps should this diagram show?\n2. What states or branches can the user trigger?' },
    'static-pie-declined': { text: 'Out of scope: tiny-charts builds playable workflow and statechart diagrams rather than static pie or bar charts of spreadsheet numbers.' },
    'isometric-cutaway-declined': { text: 'For a 3D isometric cutaway illustration of a physical coffee grinder, use figure-craft.' },
    'token-svg-declined': { text: 'For a token-synced 2D technical architecture SVG bound to design/tokens.css, use svg-mechanism.' },
  };
  const cases = JSON.parse(readFileSync(path.join(DIR, 'evals', 'cases.json'), 'utf8'));
  assert.equal(cases.length, Object.keys(answers).length);
  const byPrompt = Object.fromEntries(cases.map((c) => [c.prompt, answers[c.id]]));
  const { passed, failed, results } = runEvals(DIR, (prompt) => byPrompt[prompt]);
  assert.equal(failed, 0, JSON.stringify(results.filter((r) => !r.ok), null, 2));
  assert.equal(passed, 9);
});

test('tiny-charts gold example passes checkPage and interactive state transitions + Show the logic toggle', async (t) => {
  const examplePath = path.join(DIR, 'assets', 'examples', 'checkout-statechart.html');
  const res = await checkPage(examplePath, { widths: [1440, 390], themes: ['light', 'dark'], reducedMotion: true });
  if (res.skipped === SKIP_REASON) return t.skip(SKIP_REASON);
  assert.equal(res.ok, true, JSON.stringify(res.problems));

  const pw = await import('playwright');
  const chromium = pw.chromium ?? pw.default?.chromium;
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(pathToFileURL(examplePath).href, { waitUntil: 'load' });
    assert.equal(await page.locator('[data-tc-state-label]').textContent(), 'Cart Ready');
    await page.getByRole('button', { name: 'Submit' }).click();
    assert.equal(await page.locator('[data-tc-state-label]').textContent(), 'Authorizing');
    await page.getByRole('button', { name: 'Show the logic' }).click();
    assert.equal(await page.locator('#tc-logic-drawer').isVisible(), true);
    assert.ok((await page.locator('#tc-logic-svg rect').count()) >= 6);
  } finally {
    await browser.close();
  }
});

test('tiny-charts live HTML files in evals/live/files pass lintTinyChart and checkPage', async (t) => {
  const filesDir = path.join(DIR, 'evals', 'live', 'files');
  if (!existsSync(filesDir)) return t.skip('no live HTML files recorded yet');
  const htmlFiles = readdirSync(filesDir).filter((f) => f.endsWith('.html'));
  if (!htmlFiles.length) return t.skip('no live HTML files recorded yet');

  for (const f of htmlFiles) {
    const full = path.join(filesDir, f);
    const src = readFileSync(full, 'utf8');
    const lint = lintTinyChart(src);
    assert.equal(lint.ok, true, `${f} failed lintTinyChart: ${lint.errors.join('; ')}`);
    const res = await checkPage(full, { widths: [1440, 390], themes: ['light', 'dark'], reducedMotion: true });
    if (res.skipped !== SKIP_REASON) {
      assert.equal(res.ok, true, `${f} failed checkPage: ${JSON.stringify(res.problems)}`);
    }
  }
});
