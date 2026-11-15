/**
 * design-system: lint is clean, the engine keeps hue and passes contrast for any colour and archetype,
 * the eval cases pass on engine output and fail on bad answers, path c never overwrites, versions are in step.
 * @governed-by PO_ARCHITECT
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runEvals } from '../src/factory/evals.mjs';
import { lintSkill } from '../src/factory/lint-skills.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'src', 'skills', 'design-system');
const E = await import(path.join(DIR, 'engine', 'tokens.mjs'));
const ASK = 'Give me a brand colour as a hex code (for example #2563eb), a few words about the style you want, or the path to your existing design tokens.';
const SCREEN = 'This skill builds design tokens, not screens. For finished screen code, use ui-polish.';
const EXISTING = /:root \{[\s\S]*?\n\}/.exec(JSON.parse(readFileSync(path.join(DIR, 'evals', 'cases.json'), 'utf8')).find((c) => c.id === 'existing-gaps').prompt)[0];

/** What the engine writes for a set of arguments: the report plus every non-Markdown file, as run-skill scores it. */
function engineText(args, setup) {
  const dir = mkdtempSync(path.join(tmpdir(), 'ds-'));
  if (setup) setup(dir);
  const r = E.run(args, dir);
  assert.equal(r.bad.length, 0, JSON.stringify(r.bad));
  return { text: [r.md, ...r.files.filter((f) => !f.endsWith('.md')).map((f) => readFileSync(path.join(dir, f), 'utf8'))].join('\n'), files: r.files, reply: r.md, dir };
}

const INPUTS = {
  'hex-invoicing': ['--primary', '#0f766e', '--archetype', 'precise-fintech', '--name', 'Invoicing app'],
  'two-hex-kids': ['--primary', '#7c3aed', '--accent', '#f59e0b', '--archetype', 'bold-consumer'],
  'mood-calm': ['--archetype', 'calm-workspace', '--name', 'Notes app'],
  'like-brand': ['--primary', '#1e3a8a', '--archetype', 'precise-fintech', '--why', 'Mapped from the online bank you named.'],
  'yellow-brand': ['--primary', '#facc15', '--archetype', 'bold-consumer'],
  'font-editorial': ['--primary', '#be123c', '--archetype', 'editorial', '--font', 'Atkinson Hyperlegible'],
  'dense-tool': ['--primary', '#4f46e5', '--archetype', 'dense-data-tool'],
};

test('design-system lint is clean', async () => {
  const problems = await lintSkill(DIR, { testsDir: path.join(ROOT, 'tests') });
  assert.deepEqual(problems, []);
});

test('design-system eval cases pass on the engine output and the exact sentences', () => {
  const cases = JSON.parse(readFileSync(path.join(DIR, 'evals', 'cases.json'), 'utf8'));
  const out = {};
  for (const [id, args] of Object.entries(INPUTS)) out[id] = engineText(args);
  out['existing-gaps'] = engineText(['--existing', 'brand.css'], (d) => writeFileSync(path.join(d, 'brand.css'), EXISTING));
  out['no-input'] = { text: ASK };
  out['screen-declined'] = { text: SCREEN };
  assert.equal(cases.length, Object.keys(out).length);
  const byPrompt = Object.fromEntries(cases.map((c) => [c.prompt, out[c.id]]));
  const r = runEvals(DIR, (p) => byPrompt[p]);
  assert.equal(r.failed, 0, JSON.stringify(r.results.filter((x) => !x.ok)));
});

test('design-system evals reject tokens without an ask, markup for a screen, a repeated brand name and a changed hex', () => {
  const tokens = engineText(INPUTS['hex-invoicing']);
  const r = runEvals(DIR, () => ({ ...tokens, text: `${tokens.text}\n<div>Brightledger</div>` }));
  for (const id of ['no-input', 'screen-declined', 'like-brand']) assert.equal(r.results.find((x) => x.id === id).ok, false, id);
  const shifted = engineText(['--primary', '#0f766f', '--archetype', 'precise-fintech']);
  assert.equal(runEvals(DIR, () => shifted).results.find((x) => x.id === 'hex-invoicing').ok, false, 'a changed hex fails');
});

test('engine: the given hex sits unchanged at its nearest step; steps keep its hue (1 degree at 300 to 800, 4 elsewhere)', () => {
  const hexes = ['#0f766e', '#1d4ed8', '#facc15', '#ff8a00', '#7c3aed', '#e11d48', '#16a34a', '#be123c', '#0ea5e9', '#fef3c7', '#1e3a8a', '#4f46e5', '#84cc16', '#c026d3'];
  for (const hx of hexes) {
    const r = E.ramp(hx);
    assert.equal(r.scale[r.at], hx, hx);
    assert.deepEqual(Object.keys(r.scale).map(Number), E.STEPS);
    assert.ok(E.maxDrift(r, E.MID_STEPS) <= 1, `${hx}: drift ${E.maxDrift(r, E.MID_STEPS)} at 300 to 800`);
    assert.ok(E.maxDrift(r) <= 4, `${hx}: drift ${E.maxDrift(r)}`);
    const ls = E.STEPS.map((s) => E.rgbToHsl(E.hexToRgb(r.scale[s]))[2]);
    for (let i = 1; i < ls.length; i++) assert.ok(ls[i] < ls[i - 1], `${hx}: lightness goes down step by step`);
    for (const s of E.MID_STEPS) assert.ok(Math.abs(E.rgbToHsl(E.hexToRgb(r.scale[s]))[1] - r.saturation) < 0.06, `${hx} ${s}: saturation kept`);
  }
  let seed = 11; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  for (let i = 0; i < 2000; i++) {
    const r = E.ramp(E.rgbToHex([rnd() * 255, rnd() * 255, rnd() * 255]));
    if (r.saturation < 0.25) continue;
    assert.ok(E.maxDrift(r, E.MID_STEPS) <= 1 && E.maxDrift(r) <= 4, `${r.given}: drift`);
  }
  assert.equal(E.normHex('#0F7'), '#00ff77');
  assert.equal(E.ramp('#123456', { withDarkest: true }).scale[950] != null, true);
});

test('engine: every archetype passes every text pair for light, dark, vivid, grey, white and black brand colours', () => {
  const hexes = [undefined, '#facc15', '#ff8a00', '#808080', '#fef3c7', '#111827', '#0ea5e9', '#22c55e', '#be123c', '#000000', '#ffffff', '#f59e0b'];
  for (const a of Object.keys(E.ARCHETYPES)) for (const hx of hexes) {
    const b = E.build({ primary: hx, accent: '#f59e0b', archetype: a });
    const bad = b.pairs.filter((p) => p.light < p.need || p.dark < p.need);
    assert.deepEqual(bad, [], `${a} ${hx}`);
    if (hx) assert.equal(b.roles.light['action-primary-bg'].hex, E.normHex(hx), `${a} ${hx}: the given colour is the action fill`);
  }
});

test('engine: contrast maths and ratio text match the reference table; a failing ratio never rounds up', () => {
  assert.equal(E.ratioText(E.contrast('#aaaaaa', '#ffffff')), '2.32:1');
  assert.equal(E.ratioText(E.contrast('#767676', '#ffffff')), '4.54:1');
  assert.equal(E.ratioText(E.contrast('#0f766e', '#ffffff')), '5.47:1');
  assert.equal(E.ratioText(4.4999), '4.49:1');
  assert.equal(E.ratioText(2.996), '2.99:1');
  assert.equal(E.ratioText(5.476), '5.48:1');
});

test('engine: tokens.css and design-tokens.json have every group, both dark modes, reduced motion and nothing external', () => {
  const { dir } = engineText(INPUTS['font-editorial']);
  const css = readFileSync(path.join(dir, 'tokens.css'), 'utf8');
  const json = JSON.parse(readFileSync(path.join(dir, 'design-tokens.json'), 'utf8'));
  for (const s of ['@media (prefers-color-scheme: dark)', ':root:not([data-theme="light"])', ':root[data-theme="dark"]', ':root[data-theme="light"]', '@media (prefers-reduced-motion: reduce)', '[data-density="compact"]', '--size-target-min: 44px', '--breakpoint-md: 768px', '--border-width-focus: 2px', '"Atkinson Hyperlegible", system-ui']) assert.ok(css.includes(s), s);
  for (const bad of ['@import', 'http', 'url(', '<link', '@font-face']) assert.ok(!css.includes(bad) && !JSON.stringify(json).includes(bad), bad);
  for (const g of ['color', 'font', 'space', 'control', 'radius', 'shadow', 'border-width', 'motion', 'breakpoint', 'density']) assert.ok(json[g], g);
  assert.equal(json.color.role.light['text-default'].$value, '{color.neutral.900}');
  assert.equal(json.color.primary['600'].$value, '#be123c');
  const sizes = [...css.matchAll(/--font-size-[\w]+: (\d+)px/g)].map((m) => Number(m[1]));
  assert.ok(sizes.every((s) => E.TYPE_SCALE.includes(s)));
  const spaces = [...css.matchAll(/--space-\d+: (\d+)px/g)].map((m) => Number(m[1]));
  assert.deepEqual(spaces, E.SPACING);
  const weights = new Set([...css.matchAll(/--font-weight-\w+: (\d+)/g)].map((m) => m[1]));
  assert.equal(weights.size, 2);
});

test('engine path c: the existing file is untouched, no existing name is written again, failing pairs are kept and reported', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'ds-c-'));
  writeFileSync(path.join(dir, 'brand.css'), EXISTING);
  const r = E.run(['--existing', 'brand.css'], dir);
  assert.equal(readFileSync(path.join(dir, 'brand.css'), 'utf8'), EXISTING);
  assert.ok(!existsSync(path.join(dir, 'tokens.css')) && !existsSync(path.join(dir, 'design-tokens.json')));
  const gaps = readFileSync(path.join(dir, 'tokens.gaps.css'), 'utf8');
  const root = gaps.split('\n:root[data-theme="light"]')[0].split('@media')[0];
  for (const n of ['--brand-primary', '--space-1', '--radius-card', '--font-body', '--bg:', '--text:']) assert.ok(!root.includes(n), `${n} redefined in the light root`);
  assert.match(gaps, /:root\[data-theme="dark"\] \{[\s\S]*--text-muted: #/);
  assert.match(r.md, /--text-muted \| --bg \| 2\.54:1 \(yours, kept\)/);
  assert.ok(!/var\(--color-primary-/.test(gaps), 'roles never point at a scale the gap file does not write');
  assert.throws(() => E.run(['--existing', 'brand.css'], dir), /already exists/);
  const full = mkdtempSync(path.join(tmpdir(), 'ds-full-'));
  const { dir: d2 } = engineText(INPUTS['hex-invoicing']);
  writeFileSync(path.join(full, 'tokens.css'), readFileSync(path.join(d2, 'tokens.css'), 'utf8'));
  const none = E.run(['--existing', 'tokens.css'], full);
  assert.match(none.md, /No gaps found/);
  assert.deepEqual(none.files, ['design-system-report.md']);
});

test('design-system version matches CHANGELOG and registry', () => {
  const v = /^version:\s*(\S+)/m.exec(readFileSync(path.join(DIR, 'SKILL.md'), 'utf8'))[1];
  assert.equal(v, '1.0.0');
  assert.match(readFileSync(path.join(DIR, 'CHANGELOG.md'), 'utf8'), new RegExp(`## ${v} - \\d{4}-\\d{2}-\\d{2}`));
  const reg = JSON.parse(readFileSync(path.join(ROOT, 'src', 'factory', 'registry.json'), 'utf8'));
  assert.equal(reg.find((x) => x.name === 'design-system').version, v);
});
