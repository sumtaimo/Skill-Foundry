/**
 * design-system: lint is clean, the engine keeps hue and passes contrast for any colour and archetype,
 * the eval cases pass on engine output and fail on bad answers, path c never overwrites, versions are in step.
 * @governed-by PO_ARCHITECT
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { runEvals } from '../src/factory/evals.mjs';
import { lintSkill } from '../src/factory/lint-skills.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'src', 'skills', 'design-system');
const E = await import(pathToFileURL(path.join(DIR, 'engine', 'tokens.mjs')).href);
const BRIEF = [
  'Before I build your design foundation, confirm or change each line. Reply "OK" to accept all of them.',
  '1. Product: tell me in a few words what you are building and who uses it.',
  '2. Brand colour: a hex code such as #2563eb, or leave it and I choose one from the style.',
  '3. Style: A calm and focused (default), B precise and trustworthy, C bold and playful, D editorial, E dense and data-heavy.',
  '4. Font: the system font (default), or name a font and I put it first in the stack.',
  '5. Modes: light and dark (default).',
  '6. Effects: standard (default), or modern with glass, glow and layered depth.',
].join('\n');
const V = await import(pathToFileURL(path.join(DIR, 'engine', 'variables.mjs')).href);

/** What a path d run leaves: the files under design/ (BRIEF.md written by the agent) and the reply text. */
function foundationText(initArgs, sets = []) {
  const dir = mkdtempSync(path.join(tmpdir(), 'dsf-'));
  mkdirSync(path.join(dir, 'design'));
  writeFileSync(path.join(dir, 'design', 'BRIEF.md'), '# Design brief\n- Assumed: everything the user did not answer\n');
  const init = V.main(['init', ...initArgs], dir);
  const replies = [init.out.split('\n---\n')[0], ...sets.map((a) => V.main(['set', ...a], dir).out)];
  const names = readdirSync(path.join(dir, 'design')).sort();
  const files = names.map((f) => `design/${f}`);
  return { text: [replies.join('\n\n'), ...names.filter((f) => !f.endsWith('.md')).map((f) => readFileSync(path.join(dir, 'design', f), 'utf8'))].join('\n'), files, reply: replies.join('\n\n') };
}
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
  'midtone-teal': ['--primary', '#0d9488', '--archetype', 'calm-workspace', '--name', 'Plant-care app'],
  'engine-one-command': ['--primary', '#2563eb', '--archetype', 'precise-fintech', '--name', 'Project-planning tool'],
  'modern-glass': ['--primary', '#4f46e5', '--archetype', 'bold-consumer', '--font', 'Inter', '--modern'],
  'modern-midtone': ['--primary', '#0d9488', '--archetype', 'calm-workspace', '--modern'],
  'modern-not-asked': ['--primary', '#2563eb', '--archetype', 'precise-fintech'],
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
  const partial = JSON.parse(readFileSync(path.join(DIR, 'evals', 'cases.json'), 'utf8')).find((c) => c.id === 'existing-partial').prompt;
  out['existing-partial'] = engineText(['--existing', 'base.css'], (d) => writeFileSync(path.join(d, 'base.css'), /:root \{[\s\S]*?\n\}/.exec(partial)[0]));
  out['engine-unavailable'] = engineText(['--primary', '#7c3aed', '--archetype', 'calm-workspace', '--open', 'The engine could not run (running commands is not allowed in this session), so the tokens were built by hand; run the engine to confirm the numbers.']);
  out['no-input'] = { text: BRIEF };
  out['foundation-ok'] = foundationText(['--primary', '#8b5e3c', '--archetype', 'calm-workspace', '--name', 'Coffee-booking app']);
  out['foundation-set-border'] = foundationText(['--primary', '#0f766e', '--archetype', 'precise-fintech', '--name', 'Invoicing app'], [['color/border/default', '#c9d3d2']]);
  out['foundation-set-refused'] = foundationText(['--primary', '#4f46e5', '--archetype', 'calm-workspace', '--name', 'Notes app'], [['color/text/muted', '#cccccc', '--mode', 'light']]);
  out['foundation-defaults'] = foundationText(['--archetype', 'calm-workspace']);
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
    const l0 = E.rgbToHsl(E.hexToRgb(hx))[2], c0 = E.chroma(r.saturation, l0);
    for (const s of E.STEPS) {
      if (s === r.at || s <= 100) continue; // 50 and 100 are near-white: 8-bit hex cannot hold their HSL saturation, only their hue
      const [, ss, ll] = E.rgbToHsl(E.hexToRgb(r.scale[s]));
      assert.ok(E.chroma(ss, ll) <= E.chroma(r.saturation * E.SAT_TAPER[s], E.LIGHTNESS[s] / 100) + 0.02, `${hx} ${s}: saturation ${ss.toFixed(3)} is tapered, never above the input`);
      if (E.CHROMA_CAP[s] && ss > r.saturation * E.SAT_FLOOR + 0.03) assert.ok(E.chroma(ss, ll) <= E.CHROMA_CAP[s] * c0 + 0.02, `${hx} ${s}: steps 400 to 700 are never more colourful than the input`);
    }
  }
  // A mid-tone teal no longer turns bright cyan in the middle steps: 400 and 500 stay below the input's colourfulness.
  const teal = E.ramp('#0d9488');
  assert.equal(teal.scale[700], '#0d9488');
  for (const s of [400, 500]) {
    const [, ss, ll] = E.rgbToHsl(E.hexToRgb(teal.scale[s]));
    assert.ok(ss < 0.7 && E.chroma(ss, ll) < E.chroma(teal.saturation, 0.316), `teal ${s}: ${teal.scale[s]} is not a bright cyan`);
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
    if (!hx) continue;
    const given = E.normHex(hx), fill = b.roles.light['action-primary-bg'].hex, f = b.fills.primary;
    if (f && f.fillStep != null) {
      // mid-tone: neither white nor the dark ink reaches 4.5:1 on the given colour, so the fill is the nearest darker step that carries white
      assert.ok(E.contrast('#ffffff', given) < 4.5 && E.contrast(b.scales.neutral.scale[900], given) < 4.5, `${a} ${hx}: only mid-tones move`);
      assert.equal(fill, b.scales.primary.scale[f.fillStep]);
      assert.ok(f.fillStep > b.scales.primary.at, `${a} ${hx}: the fill is darker than the given step`);
      assert.equal(b.roles.light['action-primary-text'].hex, '#ffffff');
      const nearer = E.STEPS.filter((st) => st > b.scales.primary.at && st < f.fillStep);
      for (const st of nearer) assert.ok(E.contrast('#ffffff', b.scales.primary.scale[st]) < 4.5, `${a} ${hx}: ${st} is a nearer darker step with white at 4.5:1`);
    } else assert.equal(fill, given, `${a} ${hx}: the given colour is the action fill when white or the dark ink reads on it`);
    assert.equal(b.scales.primary.scale[b.scales.primary.at], given, `${a} ${hx}: the given hex stays in its scale`);
  }
});

test('engine: a mid-tone brand colour keeps its hex as --color-brand; the button moves to a darker step of the same hue and the report shows both ratios', () => {
  const { dir, reply } = engineText(['--primary', '#0d9488', '--archetype', 'calm-workspace']);
  const css = readFileSync(path.join(dir, 'tokens.css'), 'utf8');
  const json = JSON.parse(readFileSync(path.join(dir, 'design-tokens.json'), 'utf8'));
  assert.match(css, /--color-brand: #0d9488;/);
  assert.equal(json.color.brand.$value, '#0d9488');
  assert.match(css, /--color-primary-700: #0d9488;/);
  assert.match(css, /--color-action-primary-bg: var\(--color-primary-800\);/);
  assert.match(css, /--color-action-primary-text: #ffffff;/);
  const b = E.build({ primary: '#0d9488', archetype: 'calm-workspace' });
  assert.ok(E.hueDiff(E.hueOf(b.roles.light['action-primary-bg'].hex), b.scales.primary.hue) <= 1, 'same hue');
  assert.match(reply, /white text on your #0d9488 is 3\.74:1 \(below 4\.5:1\), so the fill uses primary-800 #[0-9a-f]{6}, the nearest darker step of the same hue, where white text is (\d+\.\d\d):1/);
  const shown = Number(/where white text is (\d+\.\d\d):1/.exec(reply)[1]);
  assert.ok(shown >= 4.5 && Math.abs(shown - E.contrast('#ffffff', b.roles.light['action-primary-bg'].hex)) < 0.01);
  // a light colour keeps its hex as the fill with dark text; a dark colour keeps it with white text
  assert.equal(E.build({ primary: '#facc15' }).roles.light['action-primary-bg'].hex, '#facc15');
  assert.equal(E.build({ primary: '#0f766e' }).roles.light['action-primary-bg'].hex, '#0f766e');
  assert.equal(E.build({ primary: '#facc15' }).fills.primary, undefined);
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

/** Run path c on a token file in a new folder; returns the folder and the result. */
function pathC(css, args = []) {
  const dir = mkdtempSync(path.join(tmpdir(), 'ds-s5-'));
  writeFileSync(path.join(dir, 'mine.css'), css);
  const r = E.run(['--existing', 'mine.css', ...args], dir);
  return { dir, r, gaps: readFileSync(path.join(dir, 'tokens.gaps.css'), 'utf8'), json: JSON.parse(readFileSync(path.join(dir, 'design-tokens.gaps.json'), 'utf8')) };
}
const lightRoot = (gaps) => gaps.split('\n:root[data-theme="light"]')[0].split('@media')[0];

test('S5: one --gutter does not hide the spacing scale; every family it does not cover is still written; the user file stays byte for byte', () => {
  const css = ':root {\n  --gutter: 24px;\n}\n';
  const { dir, r, gaps, json } = pathC(css);
  assert.equal(readFileSync(path.join(dir, 'mine.css'), 'utf8'), css);
  for (const n of E.SPACING) assert.match(gaps, new RegExp(`--space-${n}: ${n}px;`));
  assert.deepEqual(Object.keys(json.space).sort(), E.SPACING.map(String).sort());
  for (const s of ['--radius-md:', '--duration-fast:', '--shadow-1:', 'prefers-reduced-motion: reduce', ':root[data-theme="dark"]']) assert.ok(gaps.includes(s), s);
  assert.ok(!gaps.includes('--gutter'), 'the user token is never written again');
  assert.match(r.md, /spacing is only partly present \(--gutter\)/);
});

test('S5: a family is present only with at least 3 matching tokens', () => {
  const three = pathC(':root {\n  --space-1: 4px;\n  --space-2: 8px;\n  --space-3: 16px;\n  --radius-card: 6px;\n}\n');
  assert.ok(!/--space-\d+:/.test(lightRoot(three.gaps)), 'three spacing tokens are a scale: nothing added');
  assert.match(lightRoot(three.gaps), /--radius-md:/, 'one radius token is not a family');
  assert.equal(E.FAMILY_MIN, 3);
  const two = pathC(':root {\n  --space-1: 4px;\n  --space-2: 8px;\n}\n');
  assert.match(lightRoot(two.gaps), /--space-16: 16px;/, 'two spacing tokens are only partly present');
});

test('S5: a partly present family never overwrites a user token, in the light root, the dark blocks, reduced motion or density', () => {
  const css = ':root {\n  --space-16: 20px;\n  --shadow-1: 0 0 1px red;\n  --duration-fast: 90ms;\n  --density-row: 30px;\n  --radius-md: 5px;\n}\n';
  const { gaps, json } = pathC(css);
  for (const n of ['--space-16', '--shadow-1', '--duration-fast', '--density-row', '--radius-md']) assert.ok(!gaps.includes(`${n}:`), `${n} written by the gap file`);
  assert.ok(!json.space?.['16'] && !json.radius?.md && !json.shadow?.['1'] && !json.motion?.['duration-fast'] && !json.density?.row, 'JSON gap file has no user token');
  assert.match(gaps, /--space-8: 8px;/);
  assert.match(gaps, /--shadow-2:/);
  assert.match(gaps, /--duration-base:/);
  assert.match(gaps, /--duration-base: 0ms;/);
  assert.match(gaps, /--density-control-x:/);
});

test('S5: the neutral scale keeps the project greys, fills the missing steps and every pair still passes', () => {
  const css = ':root {\n  --ink: #1f2933;\n  --line: #cbd2d9;\n  --mute: #616e7c;\n  --paper: #f5f7fa;\n  --brand: #0d9488;\n}\n';
  const { dir, r, gaps, json } = pathC(css);
  assert.equal(r.bad.length, 0, JSON.stringify(r.bad));
  const n = r.b.scales.neutral;
  assert.deepEqual(n.fromGreys.kept.map((k) => [k.hex, k.step]), [['#f5f7fa', 50], ['#cbd2d9', 200], ['#616e7c', 600], ['#1f2933', 900]]);
  for (const [hex, st] of [['#f5f7fa', 50], ['#cbd2d9', 200], ['#616e7c', 600], ['#1f2933', 900]]) {
    assert.match(gaps, new RegExp(`--color-neutral-${st}: ${hex};`));
    assert.equal(json.color.neutral[st].$value, hex);
  }
  assert.deepEqual(n.fromGreys.interpolated, [100, 300, 400, 500, 700, 800]);
  const lums = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((st) => E.luminance(n.scale[st]));
  assert.ok(lums.every((v, i) => i === 0 || v < lums[i - 1]), 'lighter to darker');
  assert.match(r.md, /Neutral scale: built from your own greys/);
  assert.equal(readFileSync(path.join(dir, 'mine.css'), 'utf8'), css);
  const plain = E.build({ primary: '#0d9488' });
  assert.notEqual(plain.scales.neutral.scale[900], n.scale[900], 'the default tint is not used when the project has greys');
});

test('S5: greys are found by value, not by name, and brand, status, white and black are not greys', () => {
  const greys = E.findGreys([
    { name: 'brand-grey', value: '#888888' }, { name: 'bg', value: '#ffffff' }, { name: 'ink', value: '#000000' },
    { name: 'text', value: '#111827' }, { name: 'danger', value: '#999999' }, { name: 'blue', value: '#2563eb' }, { name: 'rule', value: '#e5e7eb' }, { name: 'rule2', value: '#E5E7EB' },
  ]);
  assert.deepEqual(greys.map((g) => g.name), ['text', 'rule']);
});

test('S5: running the same gap request twice gives byte-identical files (idempotent) and never touches the user file', () => {
  const css = ':root {\n  --gutter: 24px;\n  --ink: #1f2933;\n  --paper: #f5f7fa;\n}\n';
  const a = pathC(css);
  const first = ['tokens.gaps.css', 'design-tokens.gaps.json', 'design-system-report.md'].map((f) => readFileSync(path.join(a.dir, f), 'utf8'));
  E.run(['--existing', 'mine.css', '--force'], a.dir);
  const second = ['tokens.gaps.css', 'design-tokens.gaps.json', 'design-system-report.md'].map((f) => readFileSync(path.join(a.dir, f), 'utf8'));
  assert.deepEqual(second, first);
  assert.equal(readFileSync(path.join(a.dir, 'mine.css'), 'utf8'), css);
});

test('S1: the engine tells the agent to run it as one plain command and how to reply when it cannot run', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'ds-s1-'));
  const bad = spawnSync(process.execPath, [path.join(DIR, 'engine', 'tokens.mjs'), '--primary', 'teal'], { cwd: dir, encoding: 'utf8' });
  assert.equal(bad.status, 2);
  assert.match(bad.stderr, /ONE plain command/);
  assert.match(bad.stderr, /no cd, no shell variable, no pipe/);
  assert.match(bad.stderr, /The engine could not run \(<say plainly why>\), so the tokens were built by hand/);
  const ok = spawnSync(process.execPath, [path.join(DIR, 'engine', 'tokens.mjs'), '--primary', '#0f766e'], { cwd: dir, encoding: 'utf8' });
  assert.equal(ok.status, 0);
  assert.match(ok.stdout, /Reply to the user with the report above, word for word/);
  assert.ok(existsSync(path.join(dir, 'tokens.css')), 'with no cd the engine writes into the current folder');
});

test('S1: SKILL.md and layer 04 tell the agent to run the engine as one plain command and to say plainly when it could not run', () => {
  const skill = readFileSync(path.join(DIR, 'SKILL.md'), 'utf8');
  const flow = readFileSync(path.join(DIR, 'layers', '04-flow.md'), 'utf8');
  assert.match(skill, /R-design-system-19: .*ONE plain command/);
  for (const w of ['no `cd`', 'no shell variable', 'no pipe']) assert.ok(skill.includes(w) && flow.includes(w), w);
  assert.match(flow, /The engine could not run \(<say plainly why>\)/);
});

test('2026 group: --modern adds the exact ui-craft names with dark values, keeps every 1.0.0 token, and is absent without the flag', () => {
  const plain = engineText(INPUTS['midtone-teal']);
  const modern = engineText(INPUTS['modern-midtone']);
  const css = readFileSync(path.join(modern.dir, 'tokens.css'), 'utf8');
  for (const s of ['--glass-bg: #ffffffb8', '--glass-blur: 12px', '--r-xs: 4px', '--r-sm: 6px', '--r-md: 10px', '--r-lg: 14px', '--r-xl: 16px', '--z-sticky: 20', '--z-dropdown: 40', '--z-command: 60', '--z-modal: 80', '--z-toast: 100', '--glow: radial-gradient(', '--btn-gloss: linear-gradient(', '--font-weight-medium: 500']) assert.ok(css.includes(s), s);
  const darkBlock = /:root\[data-theme="dark"\] \{[\s\S]*?\n\}/.exec(css)[0];
  for (const s of ['--glass-bg: #', '--glow:', '--btn-gloss:']) assert.ok(darkBlock.includes(s), 'dark ' + s);
  const plainCss = readFileSync(path.join(plain.dir, 'tokens.css'), 'utf8');
  for (const line of plainCss.split('\n').filter((l) => /^\s+--/.test(l))) assert.ok(css.includes(line), 'kept ' + line);
  for (const s of ['--glass', '--z-', '--r-', '--glow', '--btn-gloss', '--font-weight-medium']) assert.ok(!plainCss.includes(s), 'absent ' + s);
  const json = JSON.parse(readFileSync(path.join(modern.dir, 'design-tokens.json'), 'utf8'));
  assert.equal(json.modern['z-toast'].$value, 100);
  assert.equal(json.font.weight.medium.$value, 500);
  assert.equal(json.modern['btn-gloss'].$type, 'gradient');
  for (const bad of ['@import', 'url(', '<link', '@font-face']) assert.ok(!css.includes(bad), bad);
});

test('2026 group on path c: never written over a user token with the same name', () => {
  const r = engineText(['--existing', 'brand.css', '--modern'], (d) => writeFileSync(path.join(d, 'brand.css'), EXISTING.replace(/\n\}$/, '\n  --z-modal: 999;\n}')));
  const gaps = readFileSync(path.join(r.dir, 'tokens.gaps.css'), 'utf8');
  assert.ok(!gaps.includes('--z-modal'));
  assert.ok(gaps.includes('--z-toast: 100'));
});

test('the report says text-disabled is exempt from contrast, with its hex, so no agent or reviewer "fixes" it', () => {
  const b = E.build({ primary: '#0f766e' });
  const md = E.report(b, { name: 'Product', path: 'a', files: [], open: [] });
  assert.match(md, /text-disabled is not checked on purpose: WCAG 1\.4\.3 exempts/);
  assert.ok(md.includes(b.roles.light['text-disabled'].hex) && md.includes(b.roles.dark['text-disabled'].hex));
  assert.ok(!b.pairs.some((p) => p.fg === 'text-disabled'), 'still not a checked pair');
});

test('design-system version matches CHANGELOG and registry', () => {
  const v = /^version:\s*(\S+)/m.exec(readFileSync(path.join(DIR, 'SKILL.md'), 'utf8'))[1];
  assert.equal(v, '1.2.1');
  assert.match(readFileSync(path.join(DIR, 'CHANGELOG.md'), 'utf8'), new RegExp(`## ${v} - \\d{4}-\\d{2}-\\d{2}`));
  const reg = JSON.parse(readFileSync(path.join(ROOT, 'src', 'factory', 'registry.json'), 'utf8'));
  assert.equal(reg.find((x) => x.name === 'design-system').version, v);
});
