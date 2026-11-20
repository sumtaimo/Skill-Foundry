/**
 * ui-polish: lint is clean, evals pass on reference answers and fail on bad ones, versions are in step.
 * @governed-by PO_ARCHITECT
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { runEvals } from '../src/factory/evals.mjs';
import { lintSkill } from '../src/factory/lint-skills.mjs';
import { checkPage, SKIP_REASON } from '../src/factory/visual.mjs';

const SCRIPT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'skills', 'ui-polish', 'engine', 'contrast.mjs');
const C = await import(pathToFileURL(SCRIPT).href);

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'src', 'skills', 'ui-polish');
const ASK = 'Paste the HTML and CSS of the finished screen you want polished.';
const NEW = 'This skill polishes a finished UI; it does not design new screens. Use ui-craft to design one.';
const TEXT = 'This skill does not rewrite text; every word is kept as written.';
const shape = (body) => `## UI polish: x\n\n1 fix.\n\n### Fixes\n${body}\n\n### Contrast\n| a | b | c |\n\n### Polished code\n\`\`\`\n${body}\n\`\`\`\n\n### Not changed\n- All visible text, word for word.\n- Brand hue kept: blue.\n\n### Open questions\n- None.`;

const answers = {
  'settings-card': shape('1. **Spacing**: 13px. 2. **Contrast**: 2.32:1. Ratios computed with the contrast script. 3. **Hierarchy**: (R-ui-polish-5) 4. **States**: focus-visible\nNotification settings Choose how we contact you about your account. Save changes Cancel'),
  'tailwind-jsx': shape('1. **Hierarchy**: one primary.\n<div className="p-3"><span>Unsaved draft</span><button onClick={onSave} className="focus-visible:outline">Save draft</button><button onClick={onDiscard}>Discard</button></div>'),
  'brand-hue-kept': shape('1. **Contrast**: 2.36:1. min-height: 44px; prefers-reduced-motion; focus-visible\nStart your free trial Get started'),
  'text-rewrite-declined': `${TEXT}\n\n${shape('1. **Contrast**: 2.73:1.\nClick here to download your monthly report in PDF format Download')}`,
  'already-polished': '## UI polish: Invite your team\n\nNo fixes needed.\n\n### Fixes\nNone.\n\n### Polished code\nUnchanged.\n\n### Not changed\n- All visible text.\n\n### Open questions\n- None.',
  'no-code': ASK,
  'description-only': ASK,
  'new-design-declined': NEW,
};

// Reference answers for the token cases are made from each case's own expectations (they show the shape, they are not proof).
for (const c of JSON.parse(readFileSync(path.join(DIR, 'evals', 'cases.json'), 'utf8'))) {
  if (c.id.startsWith('tokens-') || ['script-one-command', 'passing-dark-button', 'shared-stylesheet', 'overflow-measured', 'foundation-components', 'modern-group-kept', 'drift-kept', 'khmer-tokens', 'khmer-default'].includes(c.id)) answers[c.id] = shape(c.expect.filter((e) => e.type === 'contains').map((e) => e.value).join('\n'));
}

test('ui-polish lint is clean', async () => {
  const problems = await lintSkill(DIR, { testsDir: path.join(ROOT, 'tests') });
  assert.deepEqual(problems, []);
});

test('ui-polish evals pass on reference answers', () => {
  const cases = JSON.parse(readFileSync(path.join(DIR, 'evals', 'cases.json'), 'utf8'));
  assert.equal(cases.length, Object.keys(answers).length);
  for (const id of ['tokens-css', 'tokens-tailwind', 'tokens-no-match', 'tokens-fail-contrast', 'foundation-components', 'modern-group-kept', 'drift-kept', 'khmer-tokens', 'khmer-default']) assert.ok(cases.some((c) => c.id === id), id);
  const byPrompt = Object.fromEntries(cases.map((c) => [c.prompt, answers[c.id]]));
  const r = runEvals(DIR, (p) => ({ text: byPrompt[p] }));
  assert.equal(r.failed, 0, JSON.stringify(r.results.filter((x) => !x.ok)));
});

test('ui-polish evals reject fixes without code, code for a new design, and changed text', () => {
  const r = runEvals(DIR, () => ({ text: shape('<div>Polished pricing page</div>') }));
  for (const id of ['no-code', 'description-only', 'new-design-declined', 'settings-card', 'text-rewrite-declined']) assert.equal(r.results.find((x) => x.id === id).ok, false, id);
  const reworded = runEvals(DIR, () => ({ text: `${TEXT}\n${shape('2.73:1 Download your monthly PDF report Download')}` }));
  assert.equal(reworded.results.find((x) => x.id === 'text-rewrite-declined').ok, false);
});

test('ui-polish rejects inline style objects in utility-class code', () => {
  const r = runEvals(DIR, () => ({ text: shape('**Hierarchy** className= p-3 focus-visible: onClick={onSave} onClick={onDiscard} Unsaved draft Save draft Discard style={{ padding: 12 }}') }));
  assert.equal(r.results.find((x) => x.id === 'tailwind-jsx').ok, false);
});

test('ui-polish version matches CHANGELOG and registry', () => {
  const v = /^version:\s*(\S+)/m.exec(readFileSync(path.join(DIR, 'SKILL.md'), 'utf8'))[1];
  assert.equal(v, '1.1.0');
  assert.match(readFileSync(path.join(DIR, 'CHANGELOG.md'), 'utf8'), new RegExp(`## ${v} - \\d{4}-\\d{2}-\\d{2}`));
  const reg = JSON.parse(readFileSync(path.join(ROOT, 'src', 'factory', 'registry.json'), 'utf8'));
  assert.equal(reg.find((x) => x.name === 'ui-polish').version, v);
});

test('ui-polish token cases reject an invented token name, a redefined token and a raw-only answer', () => {
  const ok = (id) => runEvals(DIR, (p) => ({ text: answers[id] })).results;
  const bad = (id, extra) => runEvals(DIR, () => ({ text: `${answers[id]}\n${extra}` })).results.find((x) => x.id === id).ok;
  assert.equal(bad('tokens-no-match', 'background: var(--color-purple-600);'), false, 'invented token name');
  assert.equal(bad('tokens-fail-contrast', ':root { --color-text-muted: #595959; }'), false, 'token redefined');
  assert.equal(bad('tokens-css', ':root { --space-12: 12px; }'), false, 'token redefined');
  assert.equal(bad('settings-card', 'padding: var(--space-12);'), false, 'default mode must not use tokens');
  const raw = runEvals(DIR, () => ({ text: shape('1. **Spacing**: 13px. padding: 12px; background: #2563eb; Invoice 1042') }));
  assert.equal(raw.results.find((x) => x.id === 'tokens-css').ok, false, 'raw values only');
  assert.ok(ok('tokens-css').find((x) => x.id === 'tokens-css').ok);
});

test('ui-polish foundation cases reject a flattened modern group, an invented variable and negative Khmer tracking', () => {
  const bad = (id, extra) => runEvals(DIR, () => ({ text: `${answers[id]}\n${extra}` })).results.find((x) => x.id === id).ok;
  assert.equal(bad('foundation-components', 'padding: var(--card-gap);'), false, 'invented variable');
  assert.equal(bad('foundation-components', ':root { --card-padding: 12px; }'), false, 'variable redefined');
  assert.equal(bad('khmer-default', 'padding: var(--space-12);'), false, 'default mode must not use variables');
  const flat = runEvals(DIR, () => ({ text: shape('1. **Tokens**: padding: 12px; backdrop-filter: blur(12px); Acme Billing') }));
  assert.equal(flat.results.find((x) => x.id === 'modern-group-kept').ok, false, 'flattened glass');
});

test('chk-contrast-script: the contrast script agrees with the reference table, uses only node: imports and never writes', () => {
  const ref = readFileSync(path.join(DIR, 'references', 'README.md'), 'utf8');
  const rows = [...ref.matchAll(/^\| (#[0-9a-f]{6}) \| ([\d.]+:1) \| ([\d.]+:1) \| ([\d.]+:1) \| ([\d.]+:1) \|$/gm)];
  assert.ok(rows.length >= 20);
  for (const [, hex, onWhite, onF9, onF3, onDark] of rows) {
    assert.equal(C.ratioText(C.contrast(hex, '#f9fafb')), onF9, `${hex} on #f9fafb`);
    assert.equal(C.ratioText(C.contrast(hex, '#f3f4f6')), onF3, `${hex} on #f3f4f6`);
    assert.equal(C.ratioText(C.contrast(hex, '#ffffff')), onWhite, `${hex} on white`);
    assert.equal(C.ratioText(C.contrast(hex, '#111827')), onDark, `${hex} on #111827`);
  }
  const src = readFileSync(SCRIPT, 'utf8');
  for (const m of src.matchAll(/from '([^']+)'/g)) assert.match(m[1], /^node:/, `import ${m[1]}`);
  assert.doesNotMatch(src, /writeFile|appendFile|mkdir|unlink|rmSync|createWriteStream/);
});

test('contrast script: exact ratios, never a failing ratio shown as passing, hue kept by --suggest', () => {
  assert.equal(C.ratioText(C.contrast('#999999', '#f9fafb')), '2.73:1');
  assert.equal(C.ratioText(C.contrast('#166534', '#ffffff')), '7.13:1', 'the ratio a first-release agent wrote as 7.14:1');
  assert.equal(C.ratioText(4.4971), '4.49:1');
  assert.equal(C.ratioText(2.999), '2.99:1');
  const s = C.suggest('#16a34a', '#ffffff');
  assert.ok(s.changed && s.ratio >= 4.5);
  const hue = (h) => { const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255); const mx = Math.max(r, g, b), d = mx - Math.min(r, g, b); return ((mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4) * 60 + 360) % 360; };
  assert.ok(Math.abs(hue(s.hex) - hue('#16a34a')) < 3);
  assert.equal(C.suggest('#595959', '#ffffff').changed, false);
  assert.throws(() => C.normHex('blue'));
  assert.match(C.run(['#ffffff', '#16a34a'])[0], /3\.29:1|3\.30:1/);
});

test('contrast script reads tokens.css and design-tokens.json of the design-system skill, light and dark, the same way', async () => {
  const E = await import(pathToFileURL(path.join(ROOT, 'src', 'skills', 'design-system', 'engine', 'tokens.mjs')).href);
  const dir = mkdtempSync(path.join(tmpdir(), 'cs-'));
  const r = E.run(['--primary', '#0f766e', '--archetype', 'precise-fintech'], dir);
  assert.equal(r.bad.length, 0);
  const css = path.join(dir, 'tokens.css'), json = path.join(dir, 'design-tokens.json');
  const a = C.readTokens([css]), b = C.readTokens([json]);
  for (const name of ['--color-text-muted', '--color-action-primary-bg', '--color-surface-default', '--color-border-focus', '--space-12', '--font-size-md', '--duration-base']) {
    assert.equal(C.resolveToken(name, a.light), C.resolveToken(name, b.light), `${name} light`);
  }
  for (const name of ['--color-text-muted', '--color-surface-default', '--color-text-link']) assert.equal(C.resolveToken(name, a.dark), C.resolveToken(name, b.dark), `${name} dark`);
  assert.notEqual(C.resolveToken('--color-surface-default', a.light), C.resolveToken('--color-surface-default', a.dark));
  const line = C.run(['--tokens', css, '--color-text-muted', '--color-surface-default'])[0];
  assert.match(line, /--color-text-muted \(#[0-9a-f]{6}\) on --color-surface-default \(#ffffff\): \d+\.\d\d:1 {2}passes/);
  assert.throws(() => C.run(['--tokens', css, '--color-nope', '#ffffff']), /no token named --color-nope/);
  const scale = C.run(['--tokens', css, '--scale', '--color-neutral-', '--on', '--color-surface-default']);
  assert.ok(scale.length >= 10);
});

test('ui-polish polished pages from real agents pass checkPage (layout, overflow, both themes)', async (t) => {
  for (const n of ['foundation-components', 'modern-group-kept', 'drift-kept', 'khmer-tokens']) {
    const res = await checkPage(path.join(DIR, 'evals', 'live', 'files', `${n}.html`), { widths: [1440, 390], themes: ['light', 'dark'], reducedMotion: true });
    if (res.skipped === SKIP_REASON) { t.skip(SKIP_REASON); return; }
    assert.equal(res.ok, true, `${n}: ${JSON.stringify(res.problems)}`);
  }
});
