#!/usr/bin/env node
/**
 * component-kit checker (Node.js standard library only).
 *
 *   node spec-check.mjs status [--dir design]
 *   node spec-check.mjs spec <name|file>... [--dir design]
 *   node spec-check.mjs code <file|folder>... [--dir design]
 *
 * status  no design folder: prints the fixed sentence and exits 2; else lists the twelve components,
 *         which have a spec and whether it passes, the variables the specs ask design-system to add,
 *         and the next components to specify.
 * spec    every required section is there, the eight states are there, every variable a spec names exists
 *         in <dir>/tokens.css (or is listed under "Variables to add" with an existing nearest variable).
 * code    every var(--name) in the code exists in <dir>/tokens.css; no raw colour, no raw px size where a
 *         variable holds it; focus-visible, reduced motion and the Khmer line-height where the code needs them.
 * Exit 0 passed, 1 problems, 2 no design folder or bad usage. Never edits a file.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, relative, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

export const COMPONENTS = ['button', 'input', 'select', 'checkbox', 'card', 'dialog', 'table', 'nav', 'tabs', 'toast', 'menu', 'badge'];
export const NO_DESIGN = 'There is no design folder with tokens.css in this project, so run design-system first to build the variables, then ask me for the component specs again.';
export const NO_SPEC = (name) => `There is no spec for ${name} yet, so I write the spec first: ask me to "write the spec for ${name}", and then to build it.`;

export const SECTIONS = [
  ['purpose', 'Purpose'],
  ['whennottouse', 'When not to use'],
  ['anatomy', 'Anatomy'],
  ['variantsandsizes', 'Variants and sizes'],
  ['states', 'States'],
  ['variablesused', 'Variables used'],
  ['keyboardandaria', 'Keyboard and ARIA'],
  ['khmertext', 'Khmer text'],
  ['doanddont', "Do and don't"],
  ['variablestoadd', 'Variables to add'],
];
export const STATES = [
  ['default', 'Default'],
  ['hover', 'Hover'],
  ['focusvisible', 'Focus-visible'],
  ['active', 'Active'],
  ['disabled', 'Disabled'],
  ['loading', 'Loading'],
  ['empty', 'Empty'],
  ['error', 'Error'],
];

const PRIMITIVE = /^--color-(?:primary|neutral|success|warning|danger|info)-(?:50|[1-9]00|950)$/;
const norm = (s) => s.toLowerCase().replace(/[’‘]/g, "'").replace(/[^a-z0-9]/g, '');
const VAR_NAME = /--[a-zA-Z][\w-]*/g;

/** Names defined in tokens.css. @param {string} dir */
export function loadTokens(dir) {
  const f = join(dir, 'tokens.css');
  if (!existsSync(f)) return null;
  const css = readFileSync(f, 'utf8');
  return new Set([...css.matchAll(/(--[a-zA-Z][\w-]*)\s*:/g)].map((m) => m[1]));
}

/** The variable closest to a missing one, by shared name parts. */
export function suggest(name, tokens) {
  const parts = new Set(name.split('-').filter(Boolean));
  let best = null;
  let score = 0;
  for (const t of tokens) {
    const tp = t.split('-').filter(Boolean);
    const s = tp.filter((p) => parts.has(p)).length / (new Set([...parts, ...tp]).size);
    if (s > score) { score = s; best = t; }
  }
  return score >= 0.25 ? best : null;
}

/** Split a spec into { heading, body } sections by "## " lines, and the "### " parts of a body. */
function split(text, level) {
  const re = new RegExp(`^${'#'.repeat(level)} +(.+?)\\s*#*\\s*$`, 'gm');
  const marks = [...text.matchAll(re)];
  return marks.map((m, i) => ({ heading: m[1], body: text.slice(m.index + m[0].length, i + 1 < marks.length ? marks[i + 1].index : text.length), line: text.slice(0, m.index).split('\n').length }));
}

const stripFences = (t) => t; // fenced code in a spec is checked like prose: a spec shows variables, not values

/**
 * Check one spec text. Returns the problems and the variables it uses.
 * @param {string} text @param {Set<string>} tokens @param {string} name component name
 */
export function checkSpec(text, tokens, name) {
  const problems = [];
  const secs = split(stripFences(text), 2);
  const by = new Map(secs.map((s) => [norm(s.heading), s]));
  for (const [key, label] of SECTIONS) {
    const s = by.get(key);
    if (!s) problems.push(`missing section "## ${label}"`);
    else if (!s.body.trim()) problems.push(`section "## ${label}" is empty`);
  }
  const states = by.get('states');
  if (states) {
    const subs = split(states.body, 3);
    for (const [key, label] of STATES) {
      const s = subs.find((x) => norm(x.heading).startsWith(key));
      if (!s) { problems.push(`States: missing "### ${label}"`); continue; }
      if (!s.body.trim()) problems.push(`States: "### ${label}" is empty`);
      if (key === 'loading' && !/locked|dimension/i.test(s.body)) problems.push('States: "### Loading" must say the dimensions are locked');
      if (key === 'error' && !/retry/i.test(s.body)) problems.push('States: "### Error" must say how the user retries');
    }
  }
  const used = new Set();
  const add = by.get('variablestoadd');
  const proposed = new Set();
  if (add) {
    for (const raw of add.body.split('\n')) {
      const line = raw.trim().replace(/^[-*]\s*/, '');
      if (!line || /^none\b/i.test(line.replace(/[`*_]/g, ''))) continue;
      const names = line.match(VAR_NAME) ?? [];
      if (names.length < 2) { problems.push(`Variables to add: "${line.slice(0, 60)}" must name the new variable and "nearest" existing one`); continue; }
      const [fresh, near] = names;
      if (tokens.has(fresh)) problems.push(`Variables to add: ${fresh} already exists, use it`);
      if (!tokens.has(near)) problems.push(`Variables to add: nearest ${near} is not in tokens.css`);
      proposed.add(fresh);
    }
  }
  for (const s of secs) {
    if (norm(s.heading) === 'variablestoadd') continue;
    s.body.split('\n').forEach((ln, i) => {
      for (const v of ln.match(VAR_NAME) ?? []) {
        used.add(v);
        const at = `line ${s.line + i + 1}`;
        if (PRIMITIVE.test(v)) problems.push(`${at}: ${v} is a palette step; use a semantic or component variable`);
        else if (!tokens.has(v)) {
          const near = suggest(v, tokens);
          problems.push(`${at}: ${v} is not in tokens.css${proposed.has(v) ? ' (list it only under "Variables to add")' : near ? `; nearest is ${near}` : ''}`);
        }
      }
      if (/(?<![\w&])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])/.test(ln)) problems.push(`line ${s.line + i + 1}: raw colour; name the variable instead`);
    });
  }
  const vu = by.get('variablesused');
  if (vu) {
    if (![...vu.body.matchAll(VAR_NAME)].length) problems.push('"## Variables used" names no variable');
    vu.body.split('\n').forEach((ln, i) => { if (/\b\d+(?:\.\d+)?px\b/.test(ln)) problems.push(`line ${vu.line + i + 1}: raw px size; name the variable instead`); });
  }
  const prefix = `--${name}-`;
  if ([...tokens].some((t) => t.startsWith(prefix)) && ![...used].some((v) => v.startsWith(prefix))) problems.push(`tokens.css has ${prefix}* variables and the spec uses none of them`);
  const kh = by.get('khmertext');
  if (kh && !kh.body.includes('--line-height-khmer')) problems.push('"## Khmer text" must name --line-height-khmer');
  if (kh && tokens.size && !tokens.has('--line-height-khmer')) problems.push('--line-height-khmer is not in tokens.css; list it under "Variables to add"');
  return { problems: [...new Set(problems)], used: [...used], proposed: [...proposed] };
}

const CODE_EXT = new Set(['.css', '.scss', '.sass', '.less', '.html', '.htm', '.vue', '.svelte', '.astro', '.jsx', '.tsx', '.js', '.ts', '.mjs']);
const SKIP_DIR = new Set(['node_modules', '.git', 'dist', 'build', '.next', 'design']);

/** Files under the given paths that hold code. */
export function collect(paths, cwd) {
  const out = [];
  const walk = (p) => {
    const st = statSync(p);
    if (st.isDirectory()) { for (const e of readdirSync(p)) if (!SKIP_DIR.has(e)) walk(join(p, e)); }
    else if (CODE_EXT.has(extname(p)) && basename(p) !== 'tokens.css') out.push(p);
  };
  for (const p of paths) { const abs = resolve(cwd, p); if (existsSync(abs)) walk(abs); }
  return out;
}

const PX_PROP = /(?:^|[\s;{"'(])((?:border(?:-(?:top|bottom|left|right|start|end))?(?:-(?:top|bottom|left|right|start|end))?-radius|padding(?:-[a-z]+)?|margin(?:-[a-z]+)?|gap|row-gap|column-gap|font-size|height|min-height|max-height))\s*:\s*([^;}{]*)/gi;

/** Check one code file. @param {string} text @param {Set<string>} tokens @param {Set<string>} local names declared in the scanned files */
export function checkCode(text, tokens, local) {
  const problems = [];
  const plain = text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' ')).replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/\b(?:href|id|for|to|xlink:href|aria-[a-z]+)\s*=\s*(["'])#?[^"']*\1/gi, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/url\(\s*#[^)]*\)/g, (m) => m.replace(/[^\n]/g, ' ')).replace(/&#x?[0-9a-fA-F]+;/g, (m) => m.replace(/[^\n]/g, ' '));
  const lines = plain.split('\n');
  const used = new Set();
  lines.forEach((ln, i) => {
    const at = `line ${i + 1}`;
    for (const m of ln.matchAll(/var\(\s*(--[\w-]+)/g)) used.add(m[1]);
    for (const m of ln.matchAll(/\((--[\w-]+)\)/g)) used.add(m[1]); // Tailwind v4 bg-(--name)
    if (/(?<![\w&])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])/.test(ln)) problems.push(`${at}: raw colour; use a variable`);
    else if (/\b(?:rgba?|hsla?|hwb|oklch|oklab|lab|lch)\(\s*[\d.]/i.test(ln)) problems.push(`${at}: raw colour function; use a variable (a scrim: color-mix with a variable)`);
    for (const m of ln.matchAll(PX_PROP)) {
      const bad = [...m[2].matchAll(/(?<![\w.-])(\d+(?:\.\d+)?)px\b/g)].find((x) => parseFloat(x[1]) > 2);
      if (bad) problems.push(`${at}: raw ${bad[1]}px in ${m[1].toLowerCase()}; use a variable`);
    }
    for (const m of ln.matchAll(/\b[a-z-]+-\[(\d+(?:\.\d+)?)px\]/g)) if (parseFloat(m[1]) > 2) problems.push(`${at}: raw ${m[1]}px in a class; use a variable`);
  });
  for (const v of used) {
    if (v.startsWith('--_') || local.has(v)) continue;
    if (PRIMITIVE.test(v)) problems.push(`${v} is a palette step; use a semantic or component variable`);
    else if (!tokens.has(v)) { const near = suggest(v, tokens); problems.push(`${v} is not in tokens.css${near ? `; nearest is ${near}` : ''}`); }
  }
  for (const v of used) if (tokens.has(v) && PRIMITIVE.test(v)) problems.push(`${v} is a palette step; use a semantic or component variable`);
  if (/:hover|:active|hover:/.test(plain) && !/:focus-visible|focus-visible:/.test(plain)) problems.push('has :hover or :active but no :focus-visible');
  if (/\btransition\b|\banimation\b|transition-|animate-/.test(plain) && !/prefers-reduced-motion|motion-reduce:|motion-safe:/.test(plain)) problems.push('has motion but no prefers-reduced-motion rule');
  if (/line-height\s*:/.test(plain) && !/--line-height-khmer/.test(plain)) problems.push('sets line-height but has no :lang(km) rule with --line-height-khmer');
  return { problems: [...new Set(problems)], used: [...used] };
}

const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
const flag = (argv, name, def) => { const i = argv.indexOf(name); return i >= 0 && argv[i + 1] ? argv[i + 1] : def; };
const positional = (argv) => { const out = []; for (let i = 0; i < argv.length; i++) { if (argv[i].startsWith('--')) { i++; continue; } out.push(argv[i]); } return out; };

/** @param {string[]} argv @param {string} [cwd] */
export function main(argv, cwd = process.cwd()) {
  const [cmd, ...rest] = argv;
  const dir = resolve(cwd, flag(rest, '--dir', 'design'));
  const rel = (p) => relative(cwd, p).split('\\').join('/');
  if (!['status', 'spec', 'code'].includes(cmd)) return { code: 2, out: 'usage: spec-check.mjs status | spec <name|file>... | code <file|folder>...  [--dir design]' };
  const tokens = loadTokens(dir);
  if (!tokens) return { code: 2, out: `NO DESIGN FOLDER\nReply to the user with this one sentence and nothing else, and write no file:\n${NO_DESIGN}` };
  const specPath = (n) => (/[\\/]|\.md$/.test(n) ? resolve(cwd, n) : join(dir, 'components', `${n}.md`));
  const args = positional(rest);

  if (cmd === 'status') {
    const lines = [`design folder: ${rel(dir) || '.'} (${tokens.size} variables in tokens.css)`, 'components (spec):'];
    const missing = [];
    const toAdd = new Set();
    for (const n of COMPONENTS) {
      const f = specPath(n);
      if (!existsSync(f)) { lines.push(`  ${n.padEnd(9)} no spec`); missing.push(n); continue; }
      const r = checkSpec(readFileSync(f, 'utf8'), tokens, n);
      r.proposed.forEach((p) => toAdd.add(p));
      lines.push(`  ${n.padEnd(9)} ${r.problems.length ? `spec FAILS (${r.problems.length} problems)` : 'spec ok'}`);
    }
    lines.push(`variables to add (asked of design-system): ${toAdd.size ? [...toAdd].join(', ') : 'none'}`);
    lines.push(missing.length ? `next specs (3 to 4 per turn): ${missing.slice(0, 4).join(', ')}` : 'next specs: all twelve have a spec');
    return { code: 0, out: lines.join('\n') };
  }

  if (cmd === 'spec') {
    if (!args.length) return { code: 2, out: 'spec needs at least one component name or file' };
    const lines = [];
    let bad = 0;
    for (const a of args) {
      const f = specPath(a);
      const name = basename(f, '.md');
      if (!existsSync(f)) { lines.push(`FAIL ${rel(f)}: file not found`); bad++; continue; }
      const r = checkSpec(readFileSync(f, 'utf8'), tokens, name);
      if (r.problems.length) { lines.push(`FAIL ${rel(f)}`); r.problems.forEach((p) => lines.push(`  - ${p}`)); bad += r.problems.length; }
      else lines.push(`PASS ${rel(f)} (${r.used.length} variables${r.proposed.length ? `, ${r.proposed.length} to add` : ''})`);
    }
    lines.push(bad ? `SPEC CHECK FAILED (${plural(args.length, 'spec')}, ${bad} problem${bad === 1 ? '' : 's'})` : `SPEC CHECK PASSED (${plural(args.length, 'spec')}, 0 problems)`);
    return { code: bad ? 1 : 0, out: lines.join('\n') };
  }

  const files = collect(args.length ? args : ['.'], cwd);
  if (!files.length) return { code: 2, out: 'code: no code files found in the paths given' };
  const texts = files.map((f) => [f, readFileSync(f, 'utf8')]);
  const local = new Set(texts.flatMap(([, t]) => [...t.matchAll(/(--[a-zA-Z][\w-]*)\s*:/g)].map((m) => m[1])));
  const lines = [];
  let bad = 0;
  const all = new Set();
  for (const [f, t] of texts) {
    const r = checkCode(t, tokens, local);
    r.used.forEach((u) => all.add(u));
    if (r.problems.length) { lines.push(`FAIL ${rel(f)}`); r.problems.forEach((p) => lines.push(`  - ${p}`)); bad += r.problems.length; }
    else lines.push(`PASS ${rel(f)} (${r.used.length} variables)`);
  }
  lines.push(bad ? `CODE CHECK FAILED (${plural(files.length, 'file')}, ${bad} problem${bad === 1 ? '' : 's'})` : `CODE CHECK PASSED (${plural(files.length, 'file')}, ${all.size} variables, 0 problems)`);
  return { code: bad ? 1 : 0, out: lines.join('\n') };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const r = main(process.argv.slice(2));
  console.log(r.out);
  process.exit(r.code);
}
