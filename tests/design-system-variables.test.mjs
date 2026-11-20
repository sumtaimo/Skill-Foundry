/**
 * design-system variables engine: init writes the foundation, `set` changes one variable and everything that
 * follows it in light and dark, refuses a change that breaks a contrast pair without writing anything,
 * keeps the values the user set, finds hand edits and raw values, and never edits project code.
 * @governed-by PO_ARCHITECT
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKILL = path.join(ROOT, 'src', 'skills', 'design-system');
const V = await import(pathToFileURL(path.join(SKILL, 'engine', 'variables.mjs')).href);
const T = await import(pathToFileURL(path.join(SKILL, 'engine', 'tokens.mjs')).href);
const read = (d, f) => readFileSync(path.join(d, 'design', f), 'utf8');
const project = () => mkdtempSync(path.join(tmpdir(), 'dsv-'));
const run = (cwd, ...args) => V.main(args, cwd);
const fresh = (extra = []) => { const cwd = project(); const r = run(cwd, 'init', '--primary', '#0f766e', '--archetype', 'calm-workspace', '--name', 'Test app', ...extra); return { cwd, r }; };

test('init writes the foundation: six files, three tiers, every pair passes', () => {
  const { cwd, r } = fresh();
  assert.equal(r.code, 0);
  assert.deepEqual(readdirSync(path.join(cwd, 'design')).sort(), ['CHANGES.md', 'STATUS.md', 'design-system-report.md', 'design-tokens.json', 'tokens.css', 'variables.json']);
  const j = JSON.parse(read(cwd, 'variables.json'));
  const tiers = new Set(Object.values(j.variables).map((v) => v.tier));
  assert.deepEqual([...tiers].sort(), ['component', 'primitive', 'semantic']);
  assert.ok(r.out.startsWith('## Design system: Test app'));
  assert.match(read(cwd, 'STATUS.md'), /step_completed: foundation/);
  assert.match(read(cwd, 'STATUS.md'), /next_skill: ui-craft/);
  const ev = V.evaluate({ name: 'x', inputs: j.source.inputs, overrides: {} });
  assert.equal(ev.failing.length, 0);
  assert.equal(ev.problems.length, 0);
});

test('tokens.css has dark mode, the component tier and the Khmer line, and no external link', () => {
  const { cwd } = fresh();
  const css = read(cwd, 'tokens.css');
  assert.match(css, /prefers-color-scheme: dark/);
  assert.match(css, /\[data-theme="dark"\]/);
  assert.match(css, /--button-primary-bg: var\(--color-action-primary-bg\)/);
  assert.match(css, /:lang\(km\) \{\s*letter-spacing: 0;\s*line-height: var\(--line-height-khmer\);/);
  assert.match(css, /--line-height-khmer: 1\.6/);
  assert.doesNotMatch(css, /@import|https?:|url\(/);
});

test('every semantic role resolves to the same colour the token engine computed', () => {
  const state = { name: 'x', inputs: { primary: '#7c3aed', archetype: 'bold-consumer' }, overrides: {} };
  const ev = V.evaluate(state);
  const { res } = V.resolveModel(ev.vars);
  for (const m of ['light', 'dark']) for (const [role, v] of Object.entries(ev.b.roles[m])) assert.equal(res.get(V.roleKey(role))[m], v.hex, `${role} ${m}`);
});

test('init refuses to overwrite, and refuses a folder inside the skill folder', () => {
  const { cwd } = fresh();
  assert.throws(() => run(cwd, 'init', '--primary', '#0f766e'), /already exists/);
  assert.throws(() => run(cwd, 'init', '--dir', path.join(SKILL, 'out')), /inside the skill folder/);
});

test('init reads BRIEF.md: colour, archetype, font and modern effects', () => {
  const cwd = project();
  mkdirSync(path.join(cwd, 'design'));
  writeFileSync(path.join(cwd, 'design', 'BRIEF.md'), '# Design brief\n- Product: Plant care\n- Brand colour: #0d9488 (assumed)\n- Archetype: calm-workspace\n- Font: Inter, then system\n- Modern effects: yes\n');
  const r = run(cwd, 'init', '--brief', 'design/BRIEF.md');
  assert.equal(r.code, 0);
  const j = JSON.parse(read(cwd, 'variables.json'));
  assert.equal(j.name, 'Plant care');
  assert.equal(j.source.inputs.primary, '#0d9488');
  assert.equal(j.source.inputs.font, 'Inter');
  assert.equal(j.source.inputs.modern, true);
  assert.match(read(cwd, 'tokens.css'), /--glass-bg/);
  assert.match(read(cwd, 'tokens.css'), /--color-brand: #0d9488/);
});

test('set changes one variable, the component that uses it follows, and CHANGES.md records it', () => {
  const { cwd } = fresh();
  const r = run(cwd, 'set', 'color/border/default', '#c9d3d2');
  assert.equal(r.code, 0);
  assert.match(r.out, /1 variable set, 1 value follows \(card\/border\)/);
  assert.match(r.out, /Light mode only/);
  const { res } = V.resolveModel(V.evaluate(stateOf(cwd)).vars);
  assert.equal(res.get('card/border').light, '#c9d3d2');
  assert.notEqual(res.get('card/border').dark, '#c9d3d2');
  assert.match(read(cwd, 'CHANGES.md'), /set color\/border\/default = #c9d3d2/);
});
function stateOf(cwd) { const j = JSON.parse(read(cwd, 'variables.json')); return { name: j.name, inputs: j.source.inputs, overrides: j.source.overrides }; }

test('set with --dry-run writes nothing', () => {
  const { cwd } = fresh();
  const before = ['variables.json', 'tokens.css', 'CHANGES.md'].map((f) => read(cwd, f));
  const r = run(cwd, 'set', 'color/border/default', '#c9d3d2', '--dry-run');
  assert.match(r.out, /DRY RUN/);
  assert.deepEqual(['variables.json', 'tokens.css', 'CHANGES.md'].map((f) => read(cwd, f)), before);
});

test('set refuses a change that breaks a contrast pair, writes nothing, and names a value that passes', () => {
  const { cwd } = fresh();
  const before = ['variables.json', 'tokens.css', 'design-tokens.json'].map((f) => read(cwd, f));
  const r = run(cwd, 'set', 'color/text/muted', '#cccccc', '--mode', 'light');
  assert.equal(r.code, 1);
  assert.match(r.out, /REFUSED/);
  assert.match(r.out, /color\/text\/muted on color\/surface\/default in light: 1\.\d\d:1, needs 4\.5:1/);
  assert.deepEqual(['variables.json', 'tokens.css', 'design-tokens.json'].map((f) => read(cwd, f)), before);
  const hex = /Nearest value that passes every check: (#[0-9a-f]{6})/.exec(r.out)?.[1];
  assert.ok(hex, r.out);
  assert.equal(run(cwd, 'set', 'color/text/muted', hex, '--mode', 'light').code, 0);
});

test('set color/brand keeps the given hex, rebuilds the scale and re-derives the text on the fill', () => {
  const { cwd } = fresh();
  assert.equal(run(cwd, 'set', 'color/brand', '#14b8a6').code, 0);
  const css = read(cwd, 'tokens.css');
  assert.match(css, /--color-brand: #14b8a6;/);
  const ev = V.evaluate(stateOf(cwd));
  assert.equal(ev.failing.length, 0);
  const { res } = V.resolveModel(ev.vars);
  assert.ok(V.evaluate(stateOf(cwd)).rows.every((p) => p.light >= p.need && p.dark >= p.need));
  assert.match(res.get('color/action/primary-text').light, /^#/);
});

test('a value the user set is kept when the brand colour changes later', () => {
  const { cwd } = fresh();
  run(cwd, 'set', 'color/border/default', '#c9d3d2');
  run(cwd, 'set', 'color/brand', '#1d4ed8');
  const { res } = V.resolveModel(V.evaluate(stateOf(cwd)).vars);
  assert.equal(res.get('color/border/default').light, '#c9d3d2');
});

test('set on a non-colour variable: radius follows into the components; derived and wrong values are refused', () => {
  const { cwd } = fresh();
  const r = run(cwd, 'set', 'radius/md', '12');
  assert.match(r.out, /radius\/control, button\/radius, input\/radius/);
  assert.match(read(cwd, 'tokens.css'), /--radius-md: 12px;/);
  assert.throws(() => run(cwd, 'set', 'radius/md', 'big'), /pixel value/);
  assert.throws(() => run(cwd, 'set', 'shadow/1', 'none'), /derived/);
  assert.throws(() => run(cwd, 'set', 'no/such', '1'), /no variable named/);
  assert.throws(() => run(cwd, 'set', 'color/brand', '#123456', '--mode', 'dark'), /no mode/);
});

test('an alias to a colour that does not exist is refused; a cycle is found', () => {
  const { cwd } = fresh();
  assert.throws(() => run(cwd, 'set', 'color/border/default', '{color/nope/1}'), /not a colour variable/);
  const { res, problems } = V.resolveModel({ a: { type: 'COLOR', value: '{b}' }, b: { type: 'COLOR', value: '{a}' }, c: { type: 'COLOR', value: '{zzz}' } });
  assert.ok(problems.some((p) => /alias cycle/.test(p)));
  assert.ok(problems.some((p) => /does not exist/.test(p)));
  assert.ok(res.has('a'));
});

test('check passes on a fresh foundation, finds a hand edit, and build repairs it', () => {
  const { cwd } = fresh();
  assert.equal(run(cwd, 'check').code, 0);
  writeFileSync(path.join(cwd, 'design', 'tokens.css'), read(cwd, 'tokens.css') + '\n.x{color:red}\n');
  const bad = run(cwd, 'check');
  assert.equal(bad.code, 1);
  assert.match(bad.out, /DRIFT: tokens\.css/);
  assert.equal(run(cwd, 'build').code, 0);
  assert.equal(run(cwd, 'check').code, 0);
});

test('check --code reports raw colours, raw sizes and a variable used for the wrong job, and edits nothing', () => {
  const { cwd } = fresh();
  mkdirSync(path.join(cwd, 'src'));
  const css = '.card{border:1px solid #dcd8d5;border-radius:8px;color:var(--color-border-default);background:#ff00aa}\n.t{font-size:15px}\n';
  writeFileSync(path.join(cwd, 'src', 'a.css'), css);
  writeFileSync(path.join(cwd, 'src', 'page.html'), '<a href="#abc">link</a>\n');
  const r = run(cwd, 'check', '--code', 'src');
  assert.equal(r.code, 0, 'findings are reported, not failures');
  assert.match(r.out, /raw colour {2}background: #ff00aa/);
  assert.match(r.out, /raw size {2}border-radius: 8px/);
  assert.match(r.out, /raw size {2}font-size: 15px/);
  assert.match(r.out, /wrong scope {2}color: var\(--color-border-default\)/);
  assert.doesNotMatch(r.out, /#abc/, 'an anchor is not a colour');
  assert.equal(readFileSync(path.join(cwd, 'src', 'a.css'), 'utf8'), css);
});

test('check --code suggests the variable that already holds a raw value', () => {
  const { cwd } = fresh();
  const { res } = V.resolveModel(V.evaluate(stateOf(cwd)).vars);
  const hex = res.get('color/border/default').light;
  mkdirSync(path.join(cwd, 'src'));
  writeFileSync(path.join(cwd, 'src', 'b.css'), `.a{border:1px solid ${hex}}\n`);
  assert.match(run(cwd, 'check', '--code', 'src').out, /use --color-border-default/);
});

test('explain shows the alias chain and what follows', () => {
  const { cwd } = fresh();
  const r = run(cwd, 'explain', 'color/border/default');
  assert.match(r.out, /light: \{color\/neutral\/200\} -> #[0-9a-f]{6}/);
  assert.match(r.out, /Used directly by 1: card\/border/);
  assert.match(run(cwd, 'explain', '--color-brand').out, /color\/brand/);
});

test('the plain token path is untouched: tokens.css of path a still equals the engine output without the variables extras', () => {
  const b = T.build({ primary: '#0f766e', archetype: 'calm-workspace' });
  const { cwd } = fresh();
  const css = read(cwd, 'tokens.css');
  const base = T.toCss(b).replace(/^\/\* Design tokens/, '/* Design tokens (generated from variables.json: do not edit by hand)').trimEnd();
  assert.ok(css.startsWith(base));
});
