#!/usr/bin/env node
/**
 * ui-polish contrast script: exact contrast ratios, so no ratio is worked out by hand.
 * Zero dependencies (Node standard library only). It only reads; it never writes or edits a file.
 *
 * CLI:
 *   node engine/contrast.mjs <text> <background> [<text> <background> ...] [--tokens <file> ...] [--theme dark]
 *       One line per pair: the ratio, and whether it meets 4.5:1 (normal text) and 3:1 (large text).
 *       A colour is a hex (#rgb or #rrggbb) or, with --tokens, a token name such as --color-text-muted.
 *   node engine/contrast.mjs --suggest <colour> --on <other colour> [--min 4.5]
 *       The nearest shade of <colour> with the same hue that reaches --min against <other colour>.
 *   node engine/contrast.mjs --tokens <file> --scale <prefix> --on <background> [--theme dark]
 *       Every colour token whose name starts with <prefix> (for example --color-neutral-) against one background.
 *   node engine/contrast.mjs --tokens <file> --list [--theme dark]
 *       Every token of the file with its value (colours as hex).
 * Token files: CSS custom properties (tokens.css) or W3C design tokens (design-tokens.json).
 * Ratios are rounded to two decimals; a ratio just under 4.5 or 3 is cut instead, so a printed 4.50:1 always passes.
 * Exit 0 on success, 2 on bad input.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/** @param {string} hex */
export function normHex(hex) {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(hex ?? '').trim());
  if (!m) throw new Error(`not a hex colour: ${hex}`);
  const h = m[1].length === 3 ? m[1].split('').map((c) => c + c).join('') : m[1];
  return `#${h.toLowerCase()}`;
}
const rgb = (hex) => { const h = normHex(hex).slice(1); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); };
const toHex = (c) => `#${c.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('')}`;

/** Relative luminance (sRGB). */
export function luminance(hex) {
  const [r, g, b] = rgb(hex).map((v) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
/** Exact contrast ratio of two hex colours. */
export function contrast(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
/** The ratio as it is written in a reply: two decimals with ":1"; a failing ratio never shows as passing. */
export function ratioText(r) {
  let v = Math.round(r * 100) / 100;
  for (const need of [4.5, 3]) if (r < need && v >= need) v = Math.floor(r * 100) / 100;
  return `${v.toFixed(2)}:1`;
}

function toHsl(hex) {
  const [r, g, b] = rgb(hex).map((v) => v / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min, l = (max + min) / 2;
  if (d === 0) return [0, 0, l];
  const s = d / (1 - Math.abs(2 * l - 1));
  let h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h *= 60; if (h < 0) h += 360;
  return [h, s, l];
}
function fromHsl(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return toHex([(r + m) * 255, (g + m) * 255, (b + m) * 255]);
}

/**
 * The nearest shade of `colour` (same hue and saturation, lightness moved in steps of 1%) that reaches `min`
 * against `other`. Returns the colour itself when it already passes, and null when no shade of that hue can.
 * @returns {{hex:string, ratio:number, changed:boolean}|null}
 */
export function suggest(colour, other, min = 4.5) {
  const start = normHex(colour);
  if (contrast(start, other) >= min) return { hex: start, ratio: contrast(start, other), changed: false };
  const [h, s, l] = toHsl(start);
  const found = [];
  for (const dir of [-1, 1]) {
    for (let i = 1; i <= 100; i++) {
      const next = l + dir * i / 100;
      if (next < 0 || next > 1) break;
      const hex = fromHsl(h, s, next);
      if (contrast(hex, other) >= min) { found.push({ hex, ratio: contrast(hex, other), changed: true, steps: i }); break; }
    }
  }
  if (!found.length) return null;
  found.sort((a, b) => a.steps - b.steps);
  const { steps, ...best } = found[0];
  return best;
}

// ---------- token files ----------

/** CSS name of a W3C design-token path, as a design-token set writes its custom properties. */
function cssName(path) {
  let n = path.join('-');
  n = n.replace(/^color-role-(?:light|dark)-/, 'color-').replace(/^motion-/, '').replace(/^font-line-height-/, 'line-height-')
    .replace(/^font-measure$/, 'measure').replace(/^control-target-min$/, 'size-target-min');
  return `--${n}`;
}

/**
 * Read token files into two maps, light and dark, of token name to raw value.
 * @param {string[]} files paths of .css or .json files
 * @returns {{light:Map<string,string>, dark:Map<string,string>}}
 */
export function readTokens(files) {
  const light = new Map(), darkOnly = new Map();
  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    if (/\.json$/i.test(file)) {
      const walk = (o, path) => {
        for (const [k, v] of Object.entries(o)) {
          if (k.startsWith('$') || !v || typeof v !== 'object') continue;
          if ('$value' in v) {
            const val = typeof v.$value === 'string' ? v.$value.replace(/^\{(.+)\}$/, (_, p) => `var(${cssName(p.split('.'))})`) : JSON.stringify(v.$value);
            (path[0] === 'color' && path[1] === 'role' && path[2] === 'dark' ? darkOnly : light).set(cssName([...path, k]), val);
          } else walk(v, [...path, k]);
        }
      };
      walk(JSON.parse(text), []);
    } else {
      const css = text.replace(/\/\*[\s\S]*?\*\//g, '');
      const stack = []; let buf = '';
      for (const ch of css) {
        if (ch === '{') { stack.push(buf.trim()); buf = ''; }
        else if (ch === '}' || ch === ';') {
          const m = /^\s*(--[\w-]+)\s*:\s*([\s\S]+?)\s*$/.exec(buf);
          if (m) {
            const where = stack.join(' ');
            const isDark = /prefers-color-scheme:\s*dark|data-theme=["']?dark|\.dark\b/.test(where);
            const isLightRoot = !isDark && (/:root|html|^$/.test(where)) && !/data-density|prefers-reduced-motion/.test(where);
            if (isDark) darkOnly.set(m[1], m[2]); else if (isLightRoot) light.set(m[1], m[2]);
          }
          buf = '';
          if (ch === '}') stack.pop();
        } else buf += ch;
      }
    }
  }
  return { light, dark: new Map([...light, ...darkOnly]) };
}

/** Follow var(--x) references until a plain value is left. @param {Map<string,string>} map */
export function resolveToken(name, map, seen = []) {
  if (!map.has(name)) throw new Error(`no token named ${name} in the token file`);
  if (seen.includes(name)) throw new Error(`token ${name} refers to itself`);
  const v = map.get(name);
  const m = /^var\(\s*(--[\w-]+)\s*(?:,[^)]*)?\)$/.exec(v);
  return m ? resolveToken(m[1], map, [...seen, name]) : v;
}

/** A colour argument (hex or token name) as { label, hex }. */
function colourArg(arg, map) {
  if (/^--[\w-]+$/.test(arg)) {
    if (!map) throw new Error(`${arg} is a token name; pass --tokens <file>`);
    return { label: `${arg} (${normHex(resolveToken(arg, map))})`, hex: normHex(resolveToken(arg, map)) };
  }
  const hex = normHex(arg);
  return { label: hex, hex };
}

const verdict = (r) => `${r >= 4.5 ? 'passes' : 'fails'} 4.5:1 (normal text), ${r >= 3 ? 'passes' : 'fails'} 3:1 (large text)`;

/** Run the CLI. @param {string[]} argv @returns {string[]} the lines to print */
export function run(argv) {
  const files = [], rest = [];
  let theme = 'light', min = 4.5, mode = 'pairs', sug, on, prefix;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => { if (argv[i + 1] === undefined) throw new Error(`${a} needs a value`); return argv[++i]; };
    if (a === '--tokens') files.push(next());
    else if (a === '--theme') { theme = next(); if (!['light', 'dark'].includes(theme)) throw new Error('--theme must be light or dark'); }
    else if (a === '--min') { min = Number(next()); if (!(min >= 1 && min <= 21)) throw new Error('--min must be a number from 1 to 21'); }
    else if (a === '--suggest') { mode = 'suggest'; sug = next(); }
    else if (a === '--on') on = next();
    else if (a === '--scale') { mode = 'scale'; prefix = next(); }
    else if (a === '--list') mode = 'list';
    else rest.push(a);
  }
  const tokens = files.length ? readTokens(files) : null;
  const map = tokens ? tokens[theme] : null;
  const head = tokens && theme === 'dark' ? ['Dark theme values.'] : [];
  if (mode === 'list') {
    if (!map) throw new Error('--list needs --tokens <file>');
    return [...head, ...[...map.keys()].map((k) => { const v = resolveToken(k, map); return `${k}: ${/^#[0-9a-f]{3,6}$/i.test(v) ? normHex(v) : v}`; })];
  }
  if (mode === 'suggest') {
    if (!on) throw new Error('--suggest <colour> needs --on <other colour>');
    const c = colourArg(sug, map), o = colourArg(on, map);
    const before = contrast(c.hex, o.hex), s = suggest(c.hex, o.hex, min);
    if (!s) return [`${c.label} with ${o.label}: ${ratioText(before)}. No shade of this hue reaches ${min}:1; change the other colour instead.`];
    if (!s.changed) return [`${c.label} with ${o.label}: ${ratioText(before)}. Already reaches ${min}:1; keep it.`];
    return [`${c.label} with ${o.label}: ${ratioText(before)}. Nearest shade of the same hue that reaches ${min}:1: ${s.hex}, ${ratioText(s.ratio)}.`];
  }
  if (mode === 'scale') {
    if (!map || !on) throw new Error('--scale <prefix> needs --tokens <file> and --on <background>');
    const o = colourArg(on, map);
    const names = [...map.keys()].filter((k) => k.startsWith(prefix) && /^#[0-9a-f]{3,6}$/i.test(resolveToken(k, map)));
    if (!names.length) throw new Error(`no colour token starts with ${prefix}`);
    return [...head, ...names.map((k) => { const c = colourArg(k, map), r = contrast(c.hex, o.hex); return `${c.label} on ${o.label}: ${ratioText(r)}  ${verdict(r)}`; })];
  }
  if (!rest.length || rest.length % 2) throw new Error('give colours in pairs: <text> <background> [<text> <background> ...]');
  const lines = [...head];
  for (let i = 0; i < rest.length; i += 2) {
    const c = colourArg(rest[i], map), o = colourArg(rest[i + 1], map), r = contrast(c.hex, o.hex);
    lines.push(`${c.label} on ${o.label}: ${ratioText(r)}  ${verdict(r)}`);
  }
  return lines;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { console.log(run(process.argv.slice(2)).join('\n')); }
  catch (e) { console.error(`contrast: ${e.message}\nusage: node engine/contrast.mjs <text> <background> [...pairs] [--tokens <file>] [--theme dark] | --suggest <colour> --on <colour> [--min 4.5] | --tokens <file> --scale <prefix> --on <background> | --tokens <file> --list`); process.exit(2); }
}
