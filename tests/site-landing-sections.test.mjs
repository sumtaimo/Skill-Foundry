/**
 * Landing page section contract: cover tokens, section headers, proof stats, install steps,
 * agent card, limits grid, FAQ and footer columns. Numbers come from the real build data.
 * @governed-by PO_ARCHITECT
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { buildSite } from '../src/site/build.mjs';
import { loadSkills } from '../src/site/lib/content.mjs';
import { DICTS } from '../src/site/lib/i18n.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const registry = JSON.parse(readFileSync(join(ROOT, 'src/factory/registry.json'), 'utf8'));
const ready = registry.filter((s) => s.status === 'ready');

let built;
async function site() {
  if (!built) { built = mkdtempSync(join(tmpdir(), 'sf-landing-')); await buildSite({ root: ROOT, out: built }); }
  return built;
}
async function html() { return readFileSync(join(await site(), 'index.html'), 'utf8'); }
async function css() { return readFileSync(join(await site(), 'assets', 'site.css'), 'utf8'); }

/** Returns the inner HTML of the element with the given id up to its matching closing tag. */
function section(page, id) {
  if (typeof id !== 'string' || !/^[a-z-]+$/.test(id)) throw new TypeError('section: bad id');
  const m = new RegExp(`<section[^>]*\\bid="${id}"[^>]*>`).exec(page);
  if (!m) return null;
  const end = page.indexOf('</section>', m.index);
  return page.slice(m.index, end === -1 ? undefined : end);
}
function count(str, re) { return (str.match(re) || []).length; }
/** Body of the first CSS rule whose selector matches. */
function block(sheet, selRe) {
  const m = new RegExp(`(^|\\})\\s*${selRe}\\s*\\{([^}]*)\\}`, 'm').exec(sheet);
  return m ? m[2] : null;
}

test('cover tokens are defined in :root, light and dark theme blocks', async () => {
  const s = await css();
  const blocks = {
    root: block(s, ':root'),
    light: block(s, '(?:html)?\\[data-theme="?light"?\\]'),
    dark: block(s, '(?:html)?\\[data-theme="?dark"?\\]'),
  };
  for (const [name, b] of Object.entries(blocks)) {
    assert.ok(b, `${name} token block exists`);
    assert.match(b, /--cover-bg\s*:\s*[^;]+;/, `${name} defines --cover-bg`);
    assert.match(b, /--cover-accent\s*:\s*[^;]+;/, `${name} defines --cover-accent`);
  }
});

test('every section below the hero has header.sec-head with p.eyebrow', async () => {
  const page = await html();
  for (const id of ['collection', 'proof', 'install', 'agents', 'limits', 'questions']) {
    const sec = section(page, id);
    assert.ok(sec, `#${id} exists`);
    assert.match(sec, /<header class="sec-head"[^>]*>[\s\S]*?<p class="eyebrow"[^>]*>[^<]+[\s\S]*?<h2[\s\S]*?<\/header>/, `#${id} has sec-head with eyebrow and h2`);
  }
});

test('#proof has exactly three stats with the real counts', async () => {
  const sec = section(await html(), 'proof');
  assert.ok(sec, '#proof exists');
  assert.match(sec, /<div class="stats"[^>]*>/);
  assert.equal(count(sec, /<div class="stat"[\s>]/g), 3, 'exactly three div.stat');
  const nums = [...sec.matchAll(/<span class="stat-num"[^>]*>([^<]*)<\/span>/g)].map((m) => m[1].trim());
  assert.equal(nums.length, 3, 'three .stat-num');
  assert.equal(count(sec, /class="stat-label"/g), 3, 'three .stat-label');
  const skills = loadSkills(ROOT);
  assert.equal(skills.length, ready.length);
  const p = skills.reduce((a, s) => a + (s.live ? s.live.passed : 0), 0);
  const t = skills.reduce((a, s) => a + (s.live ? s.live.total : 0), 0);
  const roles = new Set(ready.flatMap((s) => s.roles || [])).size;
  assert.equal(nums[0], String(ready.length), 'ready skills count');
  assert.match(nums[1], new RegExp(`^${p}\\s*(of|/)\\s*${t}$`), 'cases passed P of T');
  assert.equal(nums[2], String(roles), 'agent roles count');
});

test('#install has three step cards and the add --all command', async () => {
  const sec = section(await html(), 'install');
  assert.ok(sec, '#install exists');
  const ol = /<ol class="steps"[^>]*>([\s\S]*?)<\/ol>/.exec(sec);
  assert.ok(ol, 'ol.steps exists');
  const steps = ol[1].split(/<li class="step"[^>]*>/).slice(1);
  assert.equal(steps.length, 3, 'exactly three li.step');
  for (const st of steps) {
    assert.match(st, /class="step-n"/, 'step has .step-n');
    assert.match(st, /<h3[\s>]/, 'step has h3');
  }
  assert.match(sec, /npx github:sumtaimo\/Skill-Foundry add --all/);
});

test('#agents has div.agent-card', async () => {
  const sec = section(await html(), 'agents');
  assert.ok(sec, '#agents exists');
  assert.match(sec, /<div class="agent-card"[^>]*>/);
});

test('#limits has ul.limit-grid with li.limit items', async () => {
  const sec = section(await html(), 'limits');
  assert.ok(sec, '#limits exists');
  const ul = /<ul class="limit-grid"[^>]*>([\s\S]*?)<\/ul>/.exec(sec);
  assert.ok(ul, 'ul.limit-grid exists');
  assert.equal(count(ul[1], /<li class="limit"[\s>]/g), 3, 'exactly three li.limit');
});

test('#questions uses details.faq with summary', async () => {
  const sec = section(await html(), 'questions');
  assert.ok(sec, '#questions exists');
  assert.ok(count(sec, /<details class="faq"[\s>]/g) >= 1, 'details.faq present');
  assert.match(sec, /<details class="faq"[^>]*>\s*<summary/);
});

test('landing keeps exactly one btn primary', async () => {
  assert.equal(count(await html(), /class="btn primary[\s"]/g), 1);
});

test('footer has div.foot-cols and MIT text', async () => {
  const page = await html();
  const f = /<footer[^>]*>([\s\S]*?)<\/footer>/.exec(page);
  assert.ok(f, 'footer exists');
  assert.match(f[1], /<div class="foot-cols"[^>]*>/);
  assert.match(f[1], /MIT/);
});

test('EN and KH dictionaries have the same keys', () => {
  const en = Object.keys(DICTS.en).sort();
  const kh = Object.keys(DICTS.kh).sort();
  assert.ok(en.length > 0, 'EN has keys');
  assert.deepEqual(en.filter((k) => !kh.includes(k)), [], 'keys missing in KH');
  assert.deepEqual(kh.filter((k) => !en.includes(k)), [], 'keys missing in EN');
});

test('New pill number equals the ready skill count', async () => {
  const m = /<span class="pill-text"[^>]*data-i18n-args="([^"]*)"/.exec(await html());
  assert.ok(m, 'pill-text with args exists');
  assert.equal(JSON.parse(m[1].replace(/&quot;/g, '"')).n, ready.length);
});

/* ---------- React Bits contract: header, buttons, footer version ---------- */

async function skillPage() { return readFileSync(join(await site(), 'skills', 'copy-tight', 'index.html'), 'utf8'); }
/** Inner HTML of the page's <header class="top">. */
function topHeader(page) {
  if (typeof page !== 'string') throw new TypeError('topHeader: page must be a string');
  const m = /<header class="top"[^>]*>([\s\S]*?)<\/header>/.exec(page);
  return m ? m[1] : null;
}

test('helpers: topHeader finds the site header and rejects bad input', () => {
  assert.equal(topHeader('<header class="top"><a>x</a></header>'), '<a>x</a>');
  assert.equal(topHeader('<header class="sec-head">x</header>'), null);
  assert.throws(() => topHeader(undefined), TypeError);
});

for (const [label, get] of [['landing', html], ['skill page', skillPage]]) {
  test(`${label}: no phone menu, no #site-menu, no text nav links, no brand chip in header`, async () => {
    const page = await get();
    assert.doesNotMatch(page, /id="site-menu"/, 'no #site-menu');
    assert.doesNotMatch(page, /aria-controls="site-menu"/, 'nothing controls site-menu');
    assert.doesNotMatch(page, /class="[^"]*\bmenu-btn\b/, 'no menu button');
    const h = topHeader(page);
    assert.ok(h, 'header.top exists');
    assert.doesNotMatch(h, /<nav[\s>]/, 'no nav inside header');
    assert.doesNotMatch(h, /<a[^>]*href="[^"]*#(collection|proof|install|agents)"/, 'no section text links in header');
    assert.doesNotMatch(h, /data-i18n="nav\.[a-z]+"/, 'no nav.* strings in header');
    // Whole class tokens only: span.tool-chip (header polish contract) is not a brand chip.
    assert.doesNotMatch(h, /class="(?:[^"]*\s)?(brand-chip|chip)(?:\s[^"]*)?"/, 'no brand chip');
    assert.match(h, /Skill Foundry/, 'wordmark present');
    assert.match(h, /class="btn cta[\s"]/, 'Install cta button present');
  });
}

test('header rule is position fixed and .is-scrolled uses backdrop-filter', async () => {
  const all = rules(await css());
  const top = all.filter((r) => selectors(r.sel).includes('.top'));
  assert.ok(top.some((r) => /(?:^|;|\s)position\s*:\s*fixed\b/.test(r.body)), '.top is position: fixed');
  const scrolled = all.filter((r) => /\.is-scrolled/.test(r.sel));
  assert.ok(scrolled.some((r) => /backdrop-filter\s*:\s*blur\(/.test(r.body)), '.is-scrolled has backdrop-filter blur');
});

test('.btn height resolves to 44px via var(--target)', async () => {
  const s = stripComments(await css());
  const root = block(s, ':root');
  const tgt = /--target\s*:\s*([^;]+);/.exec(root || '');
  assert.ok(tgt, '--target defined in :root');
  assert.equal(tgt[1].trim(), '44px');
  const btn = rules(s).filter((r) => selectors(r.sel).includes('.btn'));
  assert.ok(btn.length >= 1, '.btn rule exists');
  const ok = (v) => v === '44px' || v === 'var(--target)';
  assert.ok(btn.some((r) => [...r.body.matchAll(/(?:^|;|\s)(?:min-)?height\s*:\s*([^;]+)/g)].some((x) => ok(x[1].trim()))),
    '.btn min-height or height is 44px / var(--target)');
});

test('skill page footer shows the Skill Foundry version', async () => {
  const v = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).version;
  assert.ok(v, 'package version exists');
  const f = /<footer[^>]*>([\s\S]*?)<\/footer>/.exec(await skillPage());
  assert.ok(f, 'skill page footer exists');
  assert.match(f[1], /class="foot-ver"/, 'footer has .foot-ver');
  assert.ok(f[1].includes(v), `footer contains version ${v}`);
});

/* ---------- Stripe-exact contract ---------- */

/** CSS text with comments removed. */
function stripComments(sheet) {
  if (typeof sheet !== 'string') throw new TypeError('stripComments: sheet must be a string');
  return sheet.replace(/\/\*[\s\S]*?\*\//g, '');
}
/** Flat list of { sel, body } for every innermost rule (rules inside @media included). */
function rules(sheet) {
  if (typeof sheet !== 'string') throw new TypeError('rules: sheet must be a string');
  const out = [];
  for (const m of stripComments(sheet).matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    out.push({ sel: m[1].trim().replace(/^@[^{]*$/, '').replace(/\s+/g, ' '), body: m[2] });
  }
  return out;
}
/** Selector list split on top-level commas. */
function selectors(sel) { return sel.split(',').map((x) => x.trim()).filter(Boolean); }
const BOX_BORDER = /(?:^|;|\s)border\s*:(?!\s*(?:0|none)\b)/;
const BG_OK = /^(transparent|none|0|initial|unset|inherit)$/i;
function hasBackground(body) {
  const m = [...body.matchAll(/(?:^|;|\s)background(?:-color)?\s*:\s*([^;]+)/g)];
  return m.some((x) => !BG_OK.test(x[1].replace(/!important/, '').trim()));
}
function radiusValues(body) {
  return [...body.matchAll(/(?:^|;|\s)border-radius\s*:\s*([^;]+)/g)].map((x) => x[1].replace(/!important/, '').trim());
}

test('helpers: rules strips comments and reads @media inner rules', () => {
  const r = rules('/* .x{border-radius:9px} */ .a{color:red} @media (max-width:1px){ .b{border-radius:0} }');
  assert.deepEqual(r.map((x) => x.sel), ['.a', '.b']);
  assert.equal(hasBackground('color:red; background: transparent'), false);
  assert.equal(hasBackground('background-color: var(--surface)'), true);
  assert.throws(() => rules(null), TypeError);
  assert.doesNotMatch('border: 0', BOX_BORDER);
  assert.doesNotMatch('border:none', BOX_BORDER);
  assert.match('border: 1px solid', BOX_BORDER);
});

test('radius tokens are exactly --r-xs 4px, --r-sm 6px, --r-md 10px, --r-lg 14px, --r-xl 16px and no 999px', async () => {
  const s = stripComments(await css());
  const root = block(s, ':root');
  assert.ok(root, ':root exists');
  for (const [name, val] of [['xs', '4px'], ['sm', '6px'], ['md', '10px'], ['lg', '14px'], ['xl', '16px']]) {
    const m = new RegExp(String.raw`--r-${name}\s*:\s*([^;]+);`).exec(root);
    assert.ok(m, `--r-${name} defined in :root`);
    assert.equal(m[1].trim(), val, `--r-${name} value`);
  }
  assert.doesNotMatch(s, /999px/, 'no 999px anywhere');
  assert.doesNotMatch(s, /--r-(btn|inner|card|pill)\b/, 'old radius tokens removed');
});

test('every border-radius is a radius token, 0 or 50%', async () => {
  const bad = [];
  for (const { sel, body } of rules(await css())) {
    for (const v of radiusValues(body)) {
      if (!/^(var\(--r-(xs|sm|md|lg|xl)\)|0|50%)$/.test(v)) bad.push(`${sel} { border-radius: ${v} }`);
    }
  }
  assert.deepEqual(bad, [], 'disallowed border-radius values');
});

test('base header rule has no border-bottom, background or shadow; site.js toggles is-scrolled', async () => {
  const s = stripComments(await css());
  const top = block(s, String.raw`\.top`);
  assert.ok(top, '.top rule exists');
  assert.doesNotMatch(top, /border-bottom\s*:/, 'no border-bottom on .top');
  assert.doesNotMatch(top, /(?:^|;|\s)border\s*:/, 'no border shorthand on .top');
  assert.equal(hasBackground(top), false, 'no background on .top');
  assert.doesNotMatch(top, /box-shadow\s*:\s*(?!none)/, 'no shadow on .top');
  const scrolled = rules(s).filter((r) => /\.is-scrolled/.test(r.sel));
  assert.ok(scrolled.length >= 1, '.is-scrolled rule exists');
  assert.ok(scrolled.some((r) => /border(?:-bottom|-color)?\s*:\s*(?:1px solid )?var\(--line\)/.test(r.body)), '.is-scrolled has 1px line');
  const js = readFileSync(join(await site(), 'assets', 'site.js'), 'utf8');
  assert.match(js, /addEventListener\(\s*['"]scroll['"][\s\S]{0,400}?passive\s*:\s*true/, 'passive scroll listener');
  assert.match(js, /classList\.toggle\(\s*['"]is-scrolled['"]|classList\.(add|remove)\(\s*['"]is-scrolled['"]/, 'is-scrolled toggled');
  assert.match(js, /scrollY\s*>\s*8/, 'threshold scrollY > 8');
});

test('header nav links (.tools a) have no background and no radius in any state', async () => {
  // Nav links are removed from the header; any leftover .tools a rule must still stay plain.
  const hits = rules(await css()).filter((r) => selectors(r.sel).some((x) => /\.tools a\b/.test(x)));
  for (const { sel, body } of hits) {
    assert.equal(hasBackground(body), false, `no background in ${sel}`);
    for (const v of radiusValues(body)) assert.equal(v, '0', `no radius in ${sel}`);
  }
});

test('skill page section navigation is plain text links, no chip backgrounds', async () => {
  const page = readFileSync(join(await site(), 'skills', 'copy-tight', 'index.html'), 'utf8');
  const nav = /<nav class="qbar"[^>]*>([\s\S]*?)<\/nav>/.exec(page);
  assert.ok(nav, 'skill section nav exists');
  assert.ok(count(nav[1], /<a href="#[a-z-]+"/g) >= 2, 'nav has section links');
  const classes = new Set(['qbar', ...[...nav[1].matchAll(/class="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/))]);
  const hits = rules(await css()).filter((r) => selectors(r.sel).some((x) =>
    [...classes].some((c) => new RegExp(String.raw`\.${c}\b[^,]*\sa\b|\.${c}\b[^,]*>\s*a\b`).test(x))));
  assert.ok(hits.length >= 1, 'section nav link rules exist');
  for (const { sel, body } of hits) {
    assert.equal(hasBackground(body), false, `no background in ${sel}`);
    for (const v of radiusValues(body)) assert.equal(v, '0', `no radius in ${sel}`);
    assert.doesNotMatch(body, BOX_BORDER, `no box border in ${sel}`);
  }
});

test('every var(--cover-*) used in built pages is defined in :root, light and dark', async () => {
  const { readdirSync } = await import('node:fs');
  const dir = await site();
  const pages = [join(dir, 'index.html')];
  for (const d of readdirSync(join(dir, 'skills'), { withFileTypes: true })) {
    if (d.isDirectory()) pages.push(join(dir, 'skills', d.name, 'index.html'));
  }
  const used = new Set();
  for (const p of pages) {
    for (const m of readFileSync(p, 'utf8').matchAll(/var\(\s*(--cover-[a-z0-9-]+)/g)) used.add(m[1]);
  }
  assert.ok(used.size >= 1, 'at least one cover token is used');
  const s = stripComments(await css());
  const blocks = {
    root: block(s, ':root'),
    light: block(s, String.raw`(?:html)?\[data-theme="?light"?\]`),
    dark: block(s, String.raw`(?:html)?\[data-theme="?dark"?\]`),
  };
  const missing = [];
  for (const [name, b] of Object.entries(blocks)) {
    assert.ok(b, `${name} token block exists`);
    for (const v of used) if (!new RegExp(String.raw`${v}\s*:`).test(b)) missing.push(`${name}: ${v}`);
  }
  assert.deepEqual(missing, [], 'cover tokens used but not defined');
});

/* ---------- Motion contract ---------- */

async function js() { return readFileSync(join(await site(), 'assets', 'site.js'), 'utf8'); }
/** Bodies of every @media block whose prelude matches preRe (brace matched). */
function mediaBlocks(sheet, preRe) {
  if (typeof sheet !== 'string' || !(preRe instanceof RegExp)) throw new TypeError('mediaBlocks: bad input');
  const s = stripComments(sheet);
  const out = [];
  for (const m of s.matchAll(/@media([^{]*)\{/g)) {
    if (!preRe.test(m[1])) continue;
    let depth = 1; let i = m.index + m[0].length;
    const start = i;
    for (; i < s.length && depth > 0; i++) { if (s[i] === '{') depth++; else if (s[i] === '}') depth--; }
    out.push(s.slice(start, i - 1));
  }
  return out;
}
const REDUCE = /prefers-reduced-motion\s*:\s*reduce/;
const SAFE = /prefers-reduced-motion\s*:\s*no-preference/;

test('helpers: mediaBlocks reads nested rules and rejects bad input', () => {
  const b = mediaBlocks('.a{x:1} @media (prefers-reduced-motion: reduce){ *{animation:none} .b{c:d} } .z{}', REDUCE);
  assert.equal(b.length, 1);
  assert.match(b[0], /\*\{animation:none\}/);
  assert.doesNotMatch(b[0], /\.z/);
  assert.deepEqual(mediaBlocks('.a{}', REDUCE), []);
  assert.throws(() => mediaBlocks(null, REDUCE), TypeError);
});

test('keyframes bg-drift and glow-breathe exist', async () => {
  const s = stripComments(await css());
  for (const k of ['bg-drift', 'glow-breathe']) {
    assert.match(s, new RegExp(String.raw`@keyframes\s+${k}\s*\{`), `@keyframes ${k}`);
  }
  assert.doesNotMatch(s, /@keyframes\s+bg-drift-missing/, 'sanity: unknown keyframe absent');
});

test('reduce block disables animation and transition and neutralises the new keyframes', async () => {
  const s = await css();
  const reduce = mediaBlocks(s, REDUCE).join('\n');
  assert.ok(reduce.length > 0, 'reduced-motion block exists');
  assert.match(reduce, /animation(?:-name)?\s*:\s*none|animation-duration\s*:\s*0|animation\s*:[^;]*\b0(?:\.0+)?m?s\b/, 'animation off');
  assert.match(reduce, /transition(?:-property)?\s*:\s*none|transition-duration\s*:\s*0|transition\s*:[^;]*\b0(?:\.0+)?m?s\b/, 'transition off');
  const universal = rules(reduce).some((r) => selectors(r.sel).some((x) => /^(\*|html \*|\*,|\*::before|\*::after)/.test(x))
    && /animation[^:]*:\s*(none|0|[^;]*\b0(?:\.0+)?m?s\b)/.test(r.body));
  const safe = mediaBlocks(s, SAFE).join('\n');
  const bad = [];
  for (const { sel, body } of rules(s)) {
    const used = /animation(?:-name)?\s*:[^;]*\b(bg-drift|glow-breathe)\b/.exec(body);
    if (!used || universal) continue;
    if (safe.includes(body)) continue;
    const off = rules(reduce).some((r) => selectors(r.sel).some((x) => selectors(sel).includes(x)) && /animation[^:]*:\s*none/.test(r.body));
    if (!off) bad.push(`${sel} uses ${used[1]}`);
  }
  assert.deepEqual(bad, [], 'keyframe use not neutralised by reduce block');
});

test('site.js: IntersectionObserver, is-in, js class on html, reduced-motion check', async () => {
  const j = await js();
  assert.match(j, /new IntersectionObserver\(/, 'IntersectionObserver');
  assert.match(j, /classList\.add\(\s*['"]is-in['"]/, 'adds is-in');
  assert.match(j, /documentElement\.classList\.add\(\s*['"]js['"]|documentElement\.className\s*\+?=\s*['"][^'"]*\bjs\b/, 'html gets js class');
  assert.match(j, /matchMedia\(\s*['"]\(prefers-reduced-motion:\s*reduce\)['"]\s*\)/, 'checks prefers-reduced-motion');
});

test('reveal hides content only under html.js', async () => {
  const hidden = rules(await css()).filter((r) => selectors(r.sel).some((x) => /\.reveal\b/.test(x) && !/is-in/.test(x))
    && /opacity\s*:\s*0(?:[;\s]|$)/.test(r.body));
  for (const { sel } of hidden) {
    for (const x of selectors(sel)) if (/\.reveal\b/.test(x)) assert.match(x, /^(html)?\.js\b/, `${x} scoped to .js`);
  }
});

test('stat numbers are the real counts, never 0 placeholders', async () => {
  const sec = section(await html(), 'proof');
  assert.ok(sec, '#proof exists');
  const nums = [...sec.matchAll(/<span class="stat-num"[^>]*>([^<]*)<\/span>/g)].map((m) => m[1].trim());
  assert.equal(nums.length, 3);
  assert.equal(nums[0], String(ready.length));
  if (ready.length > 0) {
    assert.notEqual(nums[0], '0', 'skills count not a 0 placeholder');
    assert.notEqual(nums[2], '0', 'roles count not a 0 placeholder');
    assert.doesNotMatch(nums[1], /^0\s*(of|\/)\s*0$/, 'cases not 0 of 0');
  }
  for (const n of nums) assert.notEqual(n, '', 'stat not empty');
});

/** Leaf-ish groups (div/p/span with no nested same tag) inside a footer. */
function footGroups(foot) {
  if (typeof foot !== 'string') throw new TypeError('footGroups: foot must be a string');
  const re = /<(div|p)\b([^>]*)>((?:(?!<\1\b)[\s\S])*?)<\/\1>/y;
  const out = [];
  for (const o of foot.matchAll(/<(?:div|p)\b/g)) {
    re.lastIndex = o.index;
    const m = re.exec(foot);
    if (m) out.push({ attrs: m[2], inner: m[3], index: m.index });
  }
  return out;
}

for (const [label, get] of [['landing', html], ['skill page', skillPage]]) {
  test(`${label}: footer has one meta group with by TAIMO, version and year, no divider`, async () => {
    const v = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).version;
    const f = /<footer[^>]*>([\s\S]*?)<\/footer>/.exec(await get());
    assert.ok(f, 'footer exists');
    const text = (s) => s.replace(/<[^>]+>/g, ' ');
    const meta = footGroups(f[1]).filter((g) => /by\s+TAIMO/i.test(text(g.inner)) && text(g.inner).includes(v) && /\b20\d\d\b/.test(text(g.inner)));
    assert.equal(meta.length, 1, 'exactly one group holds by TAIMO, version and year');
    assert.equal(count(f[1], /by\s+TAIMO/gi), 1, 'by TAIMO appears once');
    assert.doesNotMatch(f[1], /<hr\b/i, 'no hr in footer');
    const cols = f[1].indexOf('class="foot-cols"');
    assert.ok(cols !== -1, 'foot-cols exists');
    const between = f[1].slice(cols, meta[0].index);
    assert.doesNotMatch(between, /class="[^"]*\b(divider|separator|foot-rule|rule|line)\b/, 'no divider element before meta');
  });
}

test('helpers: footGroups finds leaf groups and rejects bad input', () => {
  const g = footGroups('<div class="a"><p>by TAIMO 2026</p></div>');
  assert.ok(g.some((x) => x.inner === 'by TAIMO 2026'));
  assert.throws(() => footGroups(1), TypeError);
});

test('skill page nav.qbar exists and var(--ok) is used only in progress rules', async () => {
  const page = await skillPage();
  assert.match(page, /<nav class="qbar"[^>]*>/, 'nav.qbar exists');
  const q = rules(await css()).filter((r) => /\.qbar\b/.test(r.sel));
  assert.ok(q.length >= 1, '.qbar rules exist');
  const bad = q.filter((r) => /var\(--ok\)/.test(r.body) && !/progress/.test(r.sel)).map((r) => r.sel);
  assert.deepEqual(bad, [], 'var(--ok) outside progress rule');
  const links = q.filter((r) => selectors(r.sel).some((x) => /\.qbar\b[^,]*\sa\b|\.qbar\b[^,]*>\s*a\b/.test(x)));
  for (const { sel, body } of links) assert.doesNotMatch(body, /var\(--ok\)/, `no var(--ok) in link rule ${sel}`);
});

/* ---------- Header polish contract ---------- */

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr', 'path', 'circle', 'rect']);
/** Top-level elements of an HTML fragment: [{ tag, open, outer, index }], balanced by depth. */
function children(frag) {
  if (typeof frag !== 'string') throw new TypeError('children: frag must be a string');
  const out = [];
  let depth = 0; let cur = null;
  for (const m of frag.matchAll(/<(\/?)([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*?(\/?)>/g)) {
    const [all, close, name, self] = m;
    const tag = name.toLowerCase();
    if (close) {
      depth--;
      if (depth === 0 && cur) { cur.outer = frag.slice(cur.index, m.index + all.length); out.push(cur); cur = null; }
    } else if (self === '/' || VOID.has(tag)) {
      if (depth === 0) out.push({ tag, open: all, outer: all, index: m.index });
    } else {
      if (depth === 0) cur = { tag, open: all, index: m.index };
      depth++;
    }
  }
  return out;
}
/** Inner HTML of the first element whose open tag matches openRe (balanced). */
function inner(page, openRe) {
  if (typeof page !== 'string' || !(openRe instanceof RegExp)) throw new TypeError('inner: bad input');
  const m = openRe.exec(page);
  if (!m) return null;
  const tag = /^<([a-zA-Z0-9-]+)/.exec(m[0])[1].toLowerCase();
  const el = children(page.slice(m.index))[0];
  if (!el || el.tag !== tag || !el.outer) return null;
  return el.outer.slice(m[0].length, el.outer.length - `</${tag}>`.length);
}

test('helpers: children and inner balance nested tags and reject bad input', () => {
  const c = children('<div class="a"><div>x</div></div><img src="y"><a href="#">z</a>');
  assert.deepEqual(c.map((x) => x.tag), ['div', 'img', 'a']);
  assert.equal(inner('<p><div class="t"><div>1</div><span>2</span></div></p>', /<div class="t"[^>]*>/), '<div>1</div><span>2</span>');
  assert.equal(inner('<p>no</p>', /<div class="t"[^>]*>/), null);
  assert.deepEqual(children(''), []);
  assert.throws(() => children(null), TypeError);
  assert.throws(() => inner('x', 'y'), TypeError);
});

test('i18n gh.label: English is "Skill Foundry on GitHub" and Khmer is a different non-empty translation', () => {
  assert.equal(DICTS.en['gh.label'], 'Skill Foundry on GitHub');
  assert.equal(typeof DICTS.kh['gh.label'], 'string');
  assert.ok(DICTS.kh['gh.label'].trim().length > 0, 'KH gh.label not empty');
  assert.notEqual(DICTS.kh['gh.label'], DICTS.en['gh.label'], 'KH gh.label is translated');
});

for (const [label, get] of [['landing', html], ['skill page', skillPage]]) {
  test(`${label}: header div.top-tools holds exactly theme, language and GitHub in order; Install cta outside`, async () => {
    const h = topHeader(await get());
    assert.ok(h, 'header.top exists');
    assert.equal(count(h, /class="top-tools[\s"]/g), 1, 'exactly one div.top-tools');
    const tools = inner(h, /<div class="top-tools[\s"][^>]*>/);
    assert.ok(tools !== null, 'div.top-tools is a balanced div');
    const ctrls = children(tools).filter((k) => k.tag === 'button' || k.tag === 'a');
    assert.equal(ctrls.length, 3, 'exactly three controls in div.top-tools');
    assert.match(ctrls[0].open, /^<button\b[^>]*data-action="theme"/, 'first is theme button');
    assert.match(ctrls[1].open, /^<button\b[^>]*data-action="lang"/, 'second is language button');
    assert.match(ctrls[2].open, /^<a\b[^>]*class="[^"]*\bgh-btn\b/, 'third is a.gh-btn');
    assert.doesNotMatch(tools, /class="btn cta[\s"]/, 'Install cta is not inside div.top-tools');
    assert.equal(count(h, /class="btn cta[\s"]/g), 1, 'one Install cta in header');
    const gh = ctrls[2];
    assert.match(gh.open, /\bhref="https:\/\/github\.com\/sumtaimo\/Skill-Foundry"/, 'GitHub href exact');
    assert.match(gh.open, /\btarget="_blank"/, 'opens in new tab');
    const rel = /\brel="([^"]*)"/.exec(gh.open);
    assert.ok(rel, 'gh-btn has rel');
    assert.ok(rel[1].split(/\s+/).includes('noopener'), 'rel contains noopener');
    const labelled = (/\baria-label="[^"]+"/.test(gh.open) && /data-i18n-aria="gh\.label"/.test(gh.open))
      || /data-i18n="gh\.label"/.test(gh.outer);
    assert.ok(labelled, 'gh-btn label comes from i18n key gh.label');
    assert.ok(gh.outer.includes(DICTS.en['gh.label']), 'English label text present');
    assert.match(gh.outer, /<svg\b[^>]*aria-hidden="true"/, 'GitHub mark is a decorative inline svg');
  });
}

test('landing stage: result title is inside the request column, after the cover and before REQUEST', async () => {
  const sec = section(await html(), 'result');
  assert.ok(sec, '#result exists');
  assert.equal(count(sec, /id="result-title"/g), 1, 'one #result-title');
  assert.match(sec, /<h2 id="result-title"[^>]*>[\s\S]*?data-i18n="result\.title"/, 'h2 keeps id and data-i18n');
  const coverAt = sec.search(/class="cover[\s"]/);
  const titleAt = sec.indexOf('id="result-title"');
  const askAt = sec.indexOf('class="proof-ask"');
  assert.ok(coverAt !== -1 && askAt !== -1, 'cover and request exist');
  assert.ok(coverAt < titleAt, 'title comes after the cover');
  assert.ok(titleAt < askAt, 'title comes before the REQUEST text');
  const side = inner(sec, /<div class="result-side[\s"][^>]*>/);
  assert.ok(side !== null, 'div.result-side exists');
  assert.ok(side.includes('id="result-title"'), 'title is inside the same column as the request');
  const kids = children(side);
  assert.equal(kids[0].tag, 'h2', 'title is the first item of the column');
  assert.match(kids[1].open, /class="proof-ask"/, 'REQUEST directly follows the title');
});

for (const [label, get] of [['landing', html], ['skill page', skillPage]]) {
  test(`${label}: footer meta group is the last child of the footer block`, async () => {
    const foot = inner(await get(), /<footer\b[^>]*>/);
    assert.ok(foot !== null, 'footer exists');
    const top = children(foot);
    assert.equal(top.length, 1, 'footer has one block wrapper');
    const kids = children(inner(top[0].outer, /^<[a-z]+\b[^>]*>/));
    assert.ok(kids.length >= 2, 'footer block has columns and meta');
    const last = kids[kids.length - 1];
    assert.match(last.open, /class="foot-meta[\s"]/, 'last child is .foot-meta');
    assert.match(last.outer, /by\s+TAIMO/i, 'meta holds by TAIMO');
    assert.equal(count(foot, /class="foot-meta[\s"]/g), 1, 'one meta group');
    const cols = inner(foot, /<div class="foot-cols"[^>]*>/);
    assert.ok(cols !== null, 'foot-cols exists');
    assert.doesNotMatch(cols, /class="foot-meta/, 'meta not inside foot-cols');
  });
}
