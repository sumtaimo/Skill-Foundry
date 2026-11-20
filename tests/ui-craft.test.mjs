/**
 * ui-craft: lint is clean, rule check IDs are covered, evals pass on modern UI/navigation/state/AI reference patterns,
 * starter harness integration works for DEV_ENGINEER and UX_DESIGNER, and rendered HTML passes checkPage.
 * @governed-by PO_ARCHITECT
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lintSkill } from '../src/factory/lint-skills.mjs';
import { runEvals } from '../src/factory/evals.mjs';
import { checkPage, SKIP_REASON } from '../src/factory/visual.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'src', 'skills', 'ui-craft');

// Rule check coverage IDs referenced in src/skills/ui-craft/RULES.json:
const RULE_CHECKS = [
  'uicraft-detect-stack',
  'uicraft-surfaces-glass',
  'uicraft-contrast',
  'uicraft-type-rhythm',
  'uicraft-spatial-zindex',
  'uicraft-buttons-gradients',
  'uicraft-command-nav',
  'uicraft-adaptive-nav',
  'uicraft-motion-reduced',
  'uicraft-lifecycle-states',
  'uicraft-inline-ai',
  'uicraft-semantic-a11y',
  'uicraft-refuse-out-of-scope',
  'uicraft-foundation-first',
  'uicraft-cold-start-gate',
];

const REFERENCE_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Workspace UI Craft Showcase</title>
<style>
:root {
  color-scheme: light dark;
  --color-surface-default: #ffffff;
  --color-surface-raised: #fafafa;
  --color-surface-subtle: #f4f4f5;
  --glass-bg: color-mix(in srgb, var(--color-surface-raised) 74%, transparent);
  --color-text-default: #09090b;
  --color-text-muted: #52525b;
  --color-border-default: #e4e4e7;
  --color-border-strong: #a1a1aa;
  --color-action-primary-bg: #18181b;
  --color-action-primary-text: #ffffff;
  --color-border-focus: #2563eb;
  --color-danger-text: #b91c1c;
  --color-danger-bg-subtle: #fef2f2;
  --btn-gloss: linear-gradient(180deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0) 60%);
  --r-xs: 4px;
  --r-sm: 6px;
  --r-md: 10px;
  --r-lg: 14px;
  --r-xl: 16px;
  --z-sticky: 20;
  --z-dropdown: 40;
  --z-command: 60;
  --z-modal: 80;
  --z-toast: 100;
}
:root[data-theme="dark"] {
  --color-surface-default: #09090b;
  --color-surface-raised: #121216;
  --color-surface-subtle: #1c1c22;
  --glass-bg: color-mix(in srgb, var(--color-surface-raised) 78%, transparent);
  --color-text-default: #fafafa;
  --color-text-muted: #a1a1aa;
  --color-border-default: #27272a;
  --color-border-strong: #52525b;
  --color-action-primary-bg: #fafafa;
  --color-action-primary-text: #09090b;
  --color-border-focus: #60a5fa;
  --color-danger-text: #f87171;
  --color-danger-bg-subtle: rgba(185, 28, 28, 0.16);
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-surface-default: #09090b;
    --color-surface-raised: #121216;
    --color-surface-subtle: #1c1c22;
    --glass-bg: color-mix(in srgb, var(--color-surface-raised) 78%, transparent);
    --color-text-default: #fafafa;
    --color-text-muted: #a1a1aa;
    --color-border-default: #27272a;
    --color-border-strong: #52525b;
    --color-action-primary-bg: #fafafa;
    --color-action-primary-text: #09090b;
    --color-border-focus: #60a5fa;
    --color-danger-text: #f87171;
    --color-danger-bg-subtle: rgba(185, 28, 28, 0.16);
  }
}
* { box-sizing: border-box; }
body {
  margin: 0;
  background: var(--color-surface-default);
  color: var(--color-text-default);
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 16px;
  line-height: 1.5;
}
.shell { max-width: 1120px; margin: 0 auto; padding: 16px; }
.nav-glass {
  position: sticky;
  top: 16px;
  z-index: var(--z-sticky);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 16px;
  border: 1px solid var(--color-border-default);
  border-radius: var(--r-xl);
  background: var(--color-surface-raised);
  transition: transform 180ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease;
}
@supports (backdrop-filter: blur(20px)) {
  .nav-glass { background: var(--glass-bg); backdrop-filter: blur(20px) saturate(1.4); }
}
.tabs { position: relative; display: flex; gap: 4px; flex-wrap: wrap; }
.btn {
  min-height: 44px;
  min-width: 44px;
  padding: 0 20px;
  border-radius: var(--r-md);
  border: 1px solid var(--color-border-default);
  background: var(--color-surface-raised);
  color: var(--color-text-default);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: transform 140ms cubic-bezier(0.2, 0, 0, 1), border-color 140ms ease;
}
.btn:hover { border-color: var(--color-border-strong); transform: translateY(-1px); }
.btn:active { transform: translateY(0); }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn:focus-visible, kbd:focus-visible, input:focus-visible { outline: 2px solid var(--color-border-focus); outline-offset: 2px; }
.btn-primary {
  background-color: var(--color-action-primary-bg);
  background-image: var(--btn-gloss);
  color: var(--color-action-primary-text);
  border-color: var(--color-action-primary-bg);
}
.bento {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
  gap: 16px;
  margin-top: 24px;
}
.card {
  padding: 24px;
  border: 1px solid var(--color-border-default);
  border-radius: var(--r-lg);
  background: var(--color-surface-raised);
}
.card h1, .card h2 { letter-spacing: -0.02em; font-weight: 600; margin: 0 0 8px; }
.skeleton { min-height: 64px; border-radius: var(--r-md); background: var(--color-surface-subtle); }
.alert { padding: 12px 16px; border-radius: var(--r-md); background: var(--color-danger-bg-subtle); color: var(--color-danger-text); border: 1px solid var(--color-border-default); }
.ai-bar { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; padding: 12px; border: 1px solid var(--color-border-default); border-radius: var(--r-lg); }
kbd { font-variant-numeric: tabular-nums; padding: 2px 6px; border: 1px solid var(--color-border-default); border-radius: var(--r-xs); }
dialog#cmd { z-index: var(--z-command); border: 1px solid var(--color-border-default); border-radius: var(--r-lg); background: var(--color-surface-raised); color: var(--color-text-default); max-width: 92vw; }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-property: opacity, background-color, border-color, color !important; transition-duration: 120ms !important; }
  .btn:hover { transform: none !important; }
}
</style>
</head>
<body>
<div class="shell">
  <header class="nav-glass">
    <nav class="tabs" aria-label="Workspace">
      <a class="btn" href="#overview" aria-current="page">Overview</a>
      <button type="button" class="btn" id="cmd-btn">Search <kbd>Ctrl+K</kbd></button>
    </nav>
    <button type="button" class="btn btn-primary">Create project</button>
  </header>
  <main id="overview">
    <section class="bento">
      <article class="card">
        <h1>2026 UI Craft Shell</h1>
        <p style="max-width:65ch;color:var(--color-text-muted)">Complete states, keyboard navigation and accessible contrast.</p>
        <button type="button" class="btn" disabled>Disabled preview</button>
      </article>
      <article class="card" aria-busy="true">
        <h2>Loading Skeleton</h2>
        <div class="skeleton"></div>
      </article>
      <article class="card">
        <h2>Empty Search</h2>
        <p style="color:var(--color-text-muted)">No results match the current filter.</p>
        <button type="button" class="btn">Reset filters</button>
      </article>
      <article class="card">
        <h2>Inline Error</h2>
        <div class="alert" role="alert">Sync paused. Retry connection.</div>
        <button type="button" class="btn" style="margin-top:8px">Retry</button>
      </article>
    </section>
    <section class="ai-bar" aria-label="Inline AI bar">
      <input type="text" aria-label="Ask AI" placeholder="Refine spacing or states..." style="min-height:44px;padding:0 12px;border:1px solid var(--color-border-default);border-radius:var(--r-md);background:var(--color-surface-raised);color:var(--color-text-default);flex:1;min-width:180px">
      <button type="button" class="btn">Summarize</button>
      <span role="status" aria-live="polite" style="align-self:center">Ready</span>
      <button type="button" class="btn">Stop</button>
      <button type="button" class="btn">Undo</button>
    </section>
  </main>
  <dialog id="cmd" aria-label="Command menu">
    <p>Type a command or press Escape to close.</p>
    <button type="button" class="btn">Clear search</button>
  </dialog>
</div>
</body>
</html>`;

test('ui-craft lint is clean and every RULES.json check ID is declared in tests', async () => {
  const problems = await lintSkill(DIR, { testsDir: path.join(ROOT, 'tests') });
  assert.deepEqual(problems, []);
  const rules = JSON.parse(readFileSync(path.join(DIR, 'RULES.json'), 'utf8'));
  const checksInRules = rules.filter((r) => r.check).map((r) => r.check);
  assert.deepEqual(checksInRules, RULE_CHECKS);
});

test('ui-craft reference outputs pass cases.json and negative boundaries reject code leaks', () => {
  const mdOut = (title, body) => `## UI Craft: ${title}\n\n${body}`;
  const answers = {
    'bento-glass-landing': { text: mdOut('Landing Shell', REFERENCE_HTML), reply: 'Built bento landing shell.' },
    'command-palette-shell': { text: mdOut('Command Shell', REFERENCE_HTML), reply: 'Built command shell.' },
    'lifecycle-states-grid': { text: mdOut('Workspace Grid', REFERENCE_HTML), reply: 'Built lifecycle states.' },
    'inline-ai-action-bar': { text: mdOut('AI Bar', REFERENCE_HTML), reply: 'Built inline AI bar.' },
    'ux-designer-css-handoff': {
      text: mdOut('Sticky Sub-Bar CSS', ':root[data-theme="dark"] {} @media (prefers-reduced-motion: reduce) {} /* --z-sticky */\n\n### Markup Handoff Contract\n- `<nav class="subnav">`'),
      reply: 'Done.',
    },
    'vague-no-surface-ask': { text: '1. Which screen or component are we building?\n2. Which stack (HTML/CSS, Tailwind, React)?' },
    'polish-only-declined': { text: 'This skill designs and builds new UI screens and components; for a pixel pass on finished code, use ui-polish.' },
    'tokens-only-declined': { text: 'This skill builds UI components and screens; to build or change tokens and variables (tokens.css / design-tokens.json), use design-system.' },
    'gate-cold-start': { text: 'This is a whole product screen and the project has no design foundation yet. Use defaults for a prototype, or build the foundation first with design-system? (defaults / foundation)' },
    'reads-design-foundation': { text: mdOut('Settings', 'Read design/tokens.css first.\n```css\n.btn{background:var(--button-primary-bg);}\n.field{border:1px solid var(--input-border);}\n.card{border-radius:var(--card-radius);}\n.btn:focus-visible{outline:2px solid var(--color-border-focus);}\n```') },
    'khmer-line-height': { text: mdOut('Khmer sign-up', ':root{--color-text-default:#111;--line-height-khmer:1.6;}\n:lang(km){line-height:var(--line-height-khmer);letter-spacing: 0;}') },
  };
  const cases = JSON.parse(readFileSync(path.join(DIR, 'evals', 'cases.json'), 'utf8'));
  assert.equal(cases.length, Object.keys(answers).length);
  const byPrompt = Object.fromEntries(cases.map((c) => [c.prompt, answers[c.id]]));
  const r = runEvals(DIR, (p) => byPrompt[p]);
  assert.equal(r.failed, 0, JSON.stringify(r.results.filter((x) => !x.ok)));
  // Negative check: CSS-only handoff fails if it emits full HTML, and polish redirect fails if it leaks HTML.
  const bad = runEvals(DIR, () => ({ text: REFERENCE_HTML }));
  assert.equal(bad.results.find((x) => x.id === 'ux-designer-css-handoff').ok, false);
  assert.equal(bad.results.find((x) => x.id === 'polish-only-declined').ok, false);
});

test('ui-craft version matches SKILL.md, CHANGELOG.md and registry.json', () => {
  const v = /^version:\s*(\S+)/m.exec(readFileSync(path.join(DIR, 'SKILL.md'), 'utf8'))[1];
  assert.equal(v, '1.0.0');
  assert.match(readFileSync(path.join(DIR, 'CHANGELOG.md'), 'utf8'), new RegExp(`## ${v.replace(/\./g, '\\.')} - \\d{4}-\\d{2}-\\d{2}`));
  const reg = JSON.parse(readFileSync(path.join(ROOT, 'src', 'factory', 'registry.json'), 'utf8'));
  const entry = reg.find((x) => x.name === 'ui-craft');
  assert.ok(entry);
  assert.equal(entry.version, v);
  assert.deepEqual(entry.roles, ['DEV_ENGINEER', 'UX_DESIGNER']);
});

test('ui-craft reference HTML renders cleanly in Playwright at 1440px & 390px (light/dark, reduced motion)', async (t) => {
  const tmpDir = mkdtempSync(path.join(tmpdir(), 'sf-uicraft-vis-'));
  const htmlPath = path.join(tmpDir, 'index.html');
  writeFileSync(htmlPath, REFERENCE_HTML);
  try {
    const res = await checkPage(htmlPath, { widths: [1440, 390], themes: ['light', 'dark'], reducedMotion: true });
    if (res.skipped === SKIP_REASON) {
      t.skip(SKIP_REASON);
      return;
    }
    assert.equal(res.ok, true, JSON.stringify(res.problems));
    assert.deepEqual(res.problems, []);
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('ui-craft foundation-first and cold-start gate are written into the layers and rules', () => {
  const read = (f) => readFileSync(path.join(DIR, f), 'utf8');
  const l2 = read('layers/02-context.md');
  for (const s of ['design/STATUS.md', 'design/BRIEF.md', 'design/tokens.css', 'design/components', '--button-*', 'Never edit a file in `design/`']) assert.ok(l2.includes(s), `layer 02 lacks ${s}`);
  const l3 = read('layers/03-inputs.md');
  assert.ok(l3.includes('Use defaults for a prototype, or build the foundation first with design-system? (defaults / foundation)'));
  assert.match(l3, /whole product screen/);
  assert.match(read('SKILL.md'), /R-ui-craft-19[\s\S]*R-ui-craft-20/);
});

test('ui-craft has no private token names, no year wording and one Khmer line-height in the skill text', () => {
  const files = ['SKILL.md', 'RULES.json', 'preview.json', ...['layers', 'references', 'examples'].flatMap((d) => readdirSync(path.join(DIR, d)).map((f) => `${d}/${f}`))];
  for (const f of files) {
    const txt = readFileSync(path.join(DIR, f), 'utf8');
    assert.doesNotMatch(txt, /2026/, `${f} has the year`);
    assert.doesNotMatch(txt, /--(bg|surface|surface-2|fg|muted|line|line-strong|accent|focus|danger|dot)(?![\w-])/, `${f} has a private token name`);
    assert.doesNotMatch(txt, /1\.55|1\.65/, `${f} has a second Khmer line-height`);
  }
});
