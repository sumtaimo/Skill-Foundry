/**
 * component-kit checker: specs need every section and the eight states, every variable a spec or code names must exist
 * in design/tokens.css, raw colours and px sizes are reported, a missing design folder gives the fixed sentence, and
 * the checker never edits a file.
 * @governed-by PO_ARCHITECT
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, cpSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKILL = path.join(ROOT, 'src', 'skills', 'component-kit');
const K = await import(pathToFileURL(path.join(SKILL, 'engine', 'spec-check.mjs')).href);
const SAMPLE = path.join(SKILL, 'examples', 'sample-design');

const project = (withSpecs = true) => {
  const cwd = mkdtempSync(path.join(tmpdir(), 'ck-'));
  cpSync(SAMPLE, path.join(cwd, 'design'), { recursive: true });
  if (!withSpecs) cpSync(path.join(SAMPLE, 'components'), path.join(cwd, 'x'), { recursive: true });
  return cwd;
};
const tokens = K.loadTokens(SAMPLE);
// Normalise line endings: a Windows checkout with core.autocrlf gives CRLF, and the replacements below match "\n".
const spec = () => readFileSync(path.join(SAMPLE, 'components', 'button.md'), 'utf8').replace(/\r\n/g, '\n');
const check = (text, name = 'button') => K.checkSpec(text, tokens, name);
const put = (cwd, rel, text) => { const f = path.join(cwd, rel); mkdirSync(path.dirname(f), { recursive: true }); writeFileSync(f, text); return f; };

test('the two model specs pass; the checker prints one result line and exits 0', () => {
  const cwd = project();
  const r = K.main(['spec', 'button', 'card'], cwd);
  assert.equal(r.code, 0);
  assert.match(r.out, /SPEC CHECK PASSED \(2 specs, 0 problems\)/);
  assert.match(K.main(['spec', 'button'], cwd).out, /SPEC CHECK PASSED \(1 spec, 0 problems\)/);
});

test('no design folder: the fixed sentence and exit 2, for status, spec and code', () => {
  const cwd = mkdtempSync(path.join(tmpdir(), 'ck-empty-'));
  for (const cmd of [['status'], ['spec', 'button'], ['code', '.']]) {
    const r = K.main(cmd, cwd);
    assert.equal(r.code, 2);
    assert.ok(r.out.includes(K.NO_DESIGN));
  }
  assert.equal(K.NO_DESIGN, 'There is no design folder with tokens.css in this project, so run design-system first to build the variables, then ask me for the component specs again.');
});

test('a missing section, a missing state and a loading without locked dimensions are reported', () => {
  const noKeyboard = spec().replace(/## Keyboard and ARIA[\s\S]*?(?=## Khmer text)/, '');
  assert.match(check(noKeyboard).problems.join('\n'), /missing section "## Keyboard and ARIA"/);
  const noHover = spec().replace(/### Hover[\s\S]*?(?=### Focus-visible)/, '');
  assert.match(check(noHover).problems.join('\n'), /missing "### Hover"/);
  const loose = spec().replace(/Dimensions are locked/, 'It spins').replace(/the button keeps its width and height/, 'it spins');
  assert.match(check(loose).problems.join('\n'), /Loading" must say the dimensions are locked/);
  const noRetry = spec().replace(/retry/gi, 'again');
  assert.match(check(noRetry).problems.join('\n'), /Error" must say how the user retries/);
});

test('a variable that is not in tokens.css is reported with the nearest one; a palette step and a raw colour are refused', () => {
  const bad = spec().replace('`--button-radius`', '`--button-corner`');
  const p = check(bad).problems.join('\n');
  assert.match(p, /--button-corner is not in tokens\.css; nearest is --button-/);
  assert.match(check(spec().replace('`--button-radius`', '`--color-neutral-200`')).problems.join('\n'), /--color-neutral-200 is a palette step/);
  assert.match(check(spec().replace('### Hover','### Hover\nFill #0f766e.\n')).problems.join('\n'), /raw colour/);
  assert.match(check(spec().replace(/`--space-12`/g, '12px')).problems.join('\n'), /raw px size/);
});

test('a component whose own variables exist must use them; a spec without them fails', () => {
  const stripped = spec().replace(/`--button-[a-z-]+`/g, '`--color-action-primary-bg`');
  assert.match(check(stripped).problems.join('\n'), /--button-\* variables and the spec uses none/);
  assert.equal(check(stripped.replace(/`--color-action-primary-bg`/g, '`--color-action-primary-bg`'), 'tabs').problems.some((x) => /--tabs-/.test(x)), false);
});

test('the Khmer note must name --line-height-khmer', () => {
  assert.match(check(spec().replace(/--line-height-khmer/g, 'a taller line')).problems.join('\n'), /"## Khmer text" must name --line-height-khmer/);
});

test('Variables to add: the new name must not exist, the nearest must; a good line passes', () => {
  const add = (line) => check(spec().replace(/## Variables to add\nNone\.\n?/, `## Variables to add\n${line}\n`));
  assert.deepEqual(add('- --tabs-indicator-bg: nearest --color-border-focus (underline)').problems, []);
  assert.deepEqual(add('- --tabs-indicator-bg: nearest --color-border-focus (underline)').proposed, ['--tabs-indicator-bg']);
  assert.match(add('- --button-radius: nearest --radius-md').problems.join('\n'), /already exists, use it/);
  assert.match(add('- --tabs-indicator-bg: nearest --not-a-variable').problems.join('\n'), /nearest --not-a-variable is not in tokens\.css/);
  assert.match(add('- --tabs-indicator-bg').problems.join('\n'), /must name the new variable and "nearest" existing one/);
  assert.match(check(spec().replace('`--button-radius`', '`--tabs-indicator-bg`') + '\n').problems.join('\n'), /--tabs-indicator-bg is not in tokens\.css/);
});

const css = (body) => K.checkCode(body, tokens, new Set());
test('code: every var() must exist; unknown names get the nearest; palette steps are refused', () => {
  assert.deepEqual(css('.b{background:var(--button-primary-bg);color:var(--button-primary-text)}\n.b:focus-visible{outline:var(--border-width-focus) solid var(--color-border-focus)}').problems, []);
  assert.match(css('.b{background:var(--button-bg)}').problems.join('\n'), /--button-bg is not in tokens\.css; nearest is --button-/);
  assert.match(css('.b{color:var(--color-neutral-700)}').problems.join('\n'), /palette step/);
  assert.deepEqual(css('.b{--_gap:var(--space-8);gap:var(--_gap)}').problems, []);
});

test('code: raw colours, colour functions and px sizes where a variable holds them are reported', () => {
  assert.match(css('.b{color:#fff}').problems.join('\n'), /raw colour/);
  assert.match(css('.b{background:rgba(0,0,0,.4)}').problems.join('\n'), /raw colour function/);
  assert.match(css('.b{border-radius:12px}').problems.join('\n'), /raw 12px in border-radius/);
  assert.match(css('.b{padding:8px 16px}').problems.join('\n'), /raw 8px in padding/);
  assert.match(css('<div class="p-[13px] bg-[#0f766e]">').problems.join('\n'), /raw 13px in a class/);
  assert.deepEqual(css('.b{border:1px solid var(--color-border-default);margin:0;outline-offset:2px;width:min(100%, 30rem)}').problems, []);
  assert.deepEqual(css('<a href="#main">Skip</a><div id="#x"></div> &#169; url(#clip)').problems, []);
  assert.deepEqual(css('.b{background:color-mix(in srgb, var(--color-surface-inverse) 50%, transparent)}').problems, []);
});

test('code: Tailwind v3 and v4 forms read variables and are checked', () => {
  assert.deepEqual(css('<button class="bg-[var(--button-primary-bg)] rounded-[var(--button-radius)] focus-visible:ring-2">').problems, []);
  assert.deepEqual(css('<button class="bg-(--button-primary-bg) focus-visible:outline">').problems, []);
  assert.match(css('<button class="bg-(--button-nope)">').problems.join('\n'), /--button-nope is not in tokens\.css/);
});

test('code: focus-visible with hover, reduced motion with motion, Khmer line height with line-height', () => {
  assert.match(css('.b:hover{color:var(--button-primary-text)}').problems.join('\n'), /no :focus-visible/);
  assert.match(css('.b{transition:color var(--duration-fast)}').problems.join('\n'), /prefers-reduced-motion/);
  assert.match(css('.b{line-height:var(--line-height-body)}').problems.join('\n'), /--line-height-khmer/);
  assert.deepEqual(css('.b{transition:color var(--duration-fast)}@media (prefers-reduced-motion:reduce){.b{transition:none}}').problems, []);
  assert.deepEqual(css('.b{line-height:var(--line-height-body)}:lang(km) .b{line-height:var(--line-height-khmer)}').problems, []);
});

test('code command: scans folders, skips node_modules and design, passes clean code and fails dirty code', () => {
  const cwd = project();
  put(cwd, 'src/components/button.css', '.button{background:var(--button-primary-bg);border-radius:var(--button-radius)}\n.button:hover{background:var(--button-primary-bg-hover)}\n.button:focus-visible{outline:var(--border-width-focus) solid var(--color-border-focus)}\n');
  put(cwd, 'node_modules/x/bad.css', '.x{color:#fff}');
  const ok = K.main(['code', 'src'], cwd);
  assert.equal(ok.code, 0);
  assert.match(ok.out, /CODE CHECK PASSED \(1 file, 5 variables, 0 problems\)/);
  put(cwd, 'src/components/card.css', '.card{background:#ffffff;border-radius:16px}');
  const bad = K.main(['code', 'src'], cwd);
  assert.equal(bad.code, 1);
  assert.match(bad.out, /CODE CHECK FAILED \(2 files, 2 problems\)/);
  assert.equal(K.main(['code', 'nothing-here'], cwd).code, 2);
});

test('status lists the twelve components, the specs that pass and the variables asked for, and edits nothing', () => {
  const cwd = project();
  const before = readFileSync(path.join(cwd, 'design', 'tokens.css'), 'utf8');
  put(cwd, 'design/components/tabs.md', spec().replace('# Button', '# Tabs').replace(/## Variables to add\nNone\.\n?/, '## Variables to add\n- --tabs-indicator-bg: nearest --color-border-focus (underline)\n'));
  const r = K.main(['status'], cwd);
  assert.equal(r.code, 0);
  assert.match(r.out, /button\s+spec ok/);
  assert.match(r.out, /input\s+no spec/);
  assert.match(r.out, /tabs\s+spec ok/);
  assert.match(r.out, /variables to add \(asked of design-system\): --tabs-indicator-bg/);
  assert.match(r.out, /next specs \(3 to 4 per turn\): input, select, checkbox, dialog/);
  assert.equal(readFileSync(path.join(cwd, 'design', 'tokens.css'), 'utf8'), before);
  assert.equal(K.COMPONENTS.length, 12);
});

test('the sample installer copies the design folder, with or without the specs, and refuses to overwrite', async () => {
  const { spawnSync } = await import('node:child_process');
  const run = (cwd, ...a) => spawnSync(process.execPath, [path.join(SKILL, 'examples', 'install-sample.mjs'), ...a], { cwd, encoding: 'utf8' });
  const a = mkdtempSync(path.join(tmpdir(), 'ck-i-'));
  assert.equal(run(a).status, 0);
  assert.ok(existsSync(path.join(a, 'design', 'components', 'button.md')));
  assert.equal(run(a).status, 1);
  const b = mkdtempSync(path.join(tmpdir(), 'ck-j-'));
  assert.equal(run(b, '--no-specs').status, 0);
  assert.ok(existsSync(path.join(b, 'design', 'tokens.css')));
  assert.ok(!existsSync(path.join(b, 'design', 'components')));
});

test('the skill text never names a year and SKILL.md stays under 150 lines', () => {
  const skill = readFileSync(path.join(SKILL, 'SKILL.md'), 'utf8');
  assert.ok(skill.split('\n').length <= 150);
  for (const f of ['SKILL.md', 'references/README.md', 'layers/01-intent.md', 'layers/08-output.md']) assert.doesNotMatch(readFileSync(path.join(SKILL, f), 'utf8'), /\b20\d\d\b/);
});
