#!/usr/bin/env node
/**
 * design-system engine: builds one complete, consistent design-token set from the user's goal.
 * Zero dependencies (Node standard library only). Deterministic: the same input gives the same files.
 *
 * CLI (run from the folder where the files must go, or pass --out):
 *   node engine/tokens.mjs --primary "#0f766e" [--accent "#f59e0b"] [--neutral|--success|--warning|--danger|--info "#hex"]
 *                          [--archetype precise-fintech|calm-workspace|bold-consumer|editorial|dense-data-tool]
 *                          [--font "Font Name"] [--existing <file> ...] [--name "Product"] [--why "<one line>"] [--out <dir>]
 * Writes design-tokens.json, tokens.css and design-system-report.md (or, with --existing, the gap files
 * design-tokens.gaps.json and tokens.gaps.css and never touches the existing files). Prints the report.
 * Exit 0 when every text pair meets its contrast minimum, 1 when one does not, 2 on bad input.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, resolve, basename, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

// ---------- colour maths ----------

/** @param {string} hex */
export function normHex(hex) {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(hex ?? '').trim());
  if (!m) throw new Error(`not a hex colour: ${hex}`);
  const h = m[1].length === 3 ? m[1].split('').map((c) => c + c).join('') : m[1];
  return `#${h.toLowerCase()}`;
}
export const hexToRgb = (hex) => { const h = normHex(hex).slice(1); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); };
export const rgbToHex = (rgb) => `#${rgb.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('')}`;

/** HSL with h in degrees, s and l from 0 to 1. @param {number[]} rgb 0..255 */
export function rgbToHsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min, l = (max + min) / 2;
  if (d === 0) return [0, 0, l];
  const s = d / (1 - Math.abs(2 * l - 1));
  let h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h *= 60; if (h < 0) h += 360;
  return [h, s, l];
}
/** @returns {number[]} unrounded 0..255 */
export function hslToRgb(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
}
export const hueOf = (hex) => rgbToHsl(hexToRgb(hex))[0];
export const hueDiff = (a, b) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };

/** Relative luminance (sRGB). */
export function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
/** Exact contrast ratio. */
export function contrast(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
/** Ratio as written in reports: truncated to two decimals, so a shown 4.50:1 always passes. */
export function ratioText(r) {
  let v = Math.round(r * 100) / 100;
  for (const need of [4.5, 3]) if (r < need && v >= need) v = Math.floor(r * 100) / 100; // a failing ratio never shows as passing
  return `${v.toFixed(2)}:1`;
}

/**
 * Round an HSL colour to a hex whose hue stays as close as possible to h: try the nearby 8-bit values of each
 * channel (lightness kept within 1 percent) and keep the one with the smallest hue drift, then the nearest saturation.
 */
function hslToHexKeepHue(h, s, l) {
  const f = hslToRgb(h, s, l);
  if (s === 0) return rgbToHex(f);
  const opts = f.map((v) => { const lo = Math.floor(v); return [lo - 2, lo - 1, lo, lo + 1, lo + 2, lo + 3].filter((x) => x >= 0 && x <= 255); });
  let best = null;
  for (const r of opts[0]) for (const g of opts[1]) for (const bl of opts[2]) {
    const [ch, cs, cl] = rgbToHsl([r, g, bl]);
    if (cs === 0 || Math.abs(cl - l) > (l > 0.9 || l < 0.12 ? 0.02 : 0.01)) continue;
    const score = [hueDiff(ch, h), Math.abs(cs - s) + Math.abs(cl - l)];
    if (!best || score[0] < best.score[0] - 0.05 || (Math.abs(score[0] - best.score[0]) <= 0.05 && score[1] < best.score[1])) best = { hx: rgbToHex([r, g, bl]), score };
  }
  return best ? best.hx : rgbToHex(f);
}

// ---------- fixed choices ----------

export const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
/** HSL lightness of each step, in percent. Neutral adds 950 for dark surfaces. */
export const LIGHTNESS = { 50: 97, 100: 93, 200: 85, 300: 75, 400: 64, 500: 53, 600: 43, 700: 34, 800: 24, 900: 15, 950: 8 };
export const STATUS_DEFAULTS = { success: '#16a34a', warning: '#d97706', danger: '#dc2626', info: '#2563eb' };
export const SPACING = [0, 4, 8, 12, 16, 24, 32, 48, 64];
export const TYPE_SCALE = [12, 14, 16, 18, 20, 24, 30, 36, 48];
export const BREAKPOINTS = { sm: 640, md: 768, lg: 1024, xl: 1280 };
export const TARGET_MIN = 44;
export const SYSTEM_SANS = ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'];
export const SYSTEM_SERIF = ['ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'serif'];
export const SYSTEM_MONO = ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'];
export const DENSITY = {
  compact: { 'control-x': 8, 'control-y': 4, row: 32, stack: 8, section: 24 },
  comfortable: { 'control-x': 12, 'control-y': 8, row: 40, stack: 12, section: 32 },
  spacious: { 'control-x': 16, 'control-y': 12, row: 48, stack: 16, section: 48 },
};

/** Five style archetypes: each is a set of numbers, not adjectives. */
export const ARCHETYPES = {
  'precise-fintech': {
    primary: '#1d4ed8', neutralSat: 0.12, sizes: [12, 14, 16, 18, 20, 24, 30], ratio: 1.2, weights: [400, 600], headingFont: 'sans',
    radius: { sm: 4, md: 6, lg: 8 }, buttonRadius: 'md', controls: [32, 40, 48], density: 'comfortable',
    shadow: [[1, 2, 0, 0.08], [2, 6, -1, 0.1], [8, 16, -4, 0.12]], motion: { fast: 100, base: 150, slow: 200 }, emphasized: false,
    accentShare: 10, accentUse: 'primary action, links, focus ring, selected row',
  },
  'calm-workspace': {
    primary: '#0f766e', neutralSat: 0.06, sizes: [12, 14, 16, 20, 24, 30, 36], ratio: 1.25, weights: [400, 600], headingFont: 'sans',
    radius: { sm: 6, md: 10, lg: 16 }, buttonRadius: 'md', controls: [36, 44, 52], density: 'spacious',
    shadow: [[1, 3, 0, 0.06], [4, 12, -2, 0.08], [12, 32, -8, 0.1]], motion: { fast: 150, base: 200, slow: 300 }, emphasized: false,
    accentShare: 5, accentUse: 'primary action, focus ring, selected item background',
  },
  'bold-consumer': {
    primary: '#e11d48', neutralSat: 0.04, sizes: [12, 14, 16, 20, 24, 36, 48], ratio: 1.333, weights: [400, 700], headingFont: 'sans',
    radius: { sm: 8, md: 12, lg: 24 }, buttonRadius: 'full', controls: [40, 48, 56], density: 'spacious',
    shadow: [[2, 4, 0, 0.12], [6, 16, -2, 0.16], [16, 40, -8, 0.2]], motion: { fast: 120, base: 200, slow: 320 }, emphasized: true,
    accentShare: 30, accentUse: 'primary action, brand surfaces (hero, banners), badges, focus ring', brandSurface: true,
  },
  editorial: {
    primary: '#9a3412', neutralSat: 0.03, sizes: [12, 14, 18, 24, 30, 36, 48], ratio: 1.414, weights: [400, 700], headingFont: 'serif',
    radius: { sm: 0, md: 2, lg: 4 }, buttonRadius: 'md', controls: [32, 40, 48], density: 'spacious',
    shadow: [null, null, [8, 24, -6, 0.1]], motion: { fast: 150, base: 250, slow: 400 }, emphasized: false,
    accentShare: 5, accentUse: 'links, focus ring, one highlight per page',
  },
  'dense-data-tool': {
    primary: '#4f46e5', neutralSat: 0.08, sizes: [12, 14, 16, 18, 20, 24, 24], ratio: 1.125, weights: [400, 600], headingFont: 'sans',
    radius: { sm: 2, md: 4, lg: 6 }, buttonRadius: 'md', controls: [24, 32, 40], density: 'compact',
    shadow: [[1, 1, 0, 0.1], [2, 4, 0, 0.12], [6, 12, -2, 0.14]], motion: { fast: 80, base: 120, slow: 160 }, emphasized: false,
    accentShare: 10, accentUse: 'primary action, selected rows and cells, focus ring, chart highlight',
  },
};
export const SIZE_NAMES = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];

// ---------- scales ----------

/** Share of the input saturation each step keeps: 1 in the middle, less toward the palest and darkest steps. */
export const SAT_TAPER = { 50: 0.8, 100: 0.85, 200: 0.9, 300: 0.95, 400: 1, 500: 1, 600: 1, 700: 1, 800: 0.95, 900: 0.88, 950: 0.8 };
/** Steps 400 to 700 are never more colourful than the input: their HSL chroma stays at or under this share of the input's chroma. */
export const CHROMA_CAP = { 400: 0.85, 500: 0.9, 600: 0.95, 700: 1 };
/** A capped step keeps at least this share of the input saturation, so 8-bit hex can still hold the hue. */
export const SAT_FLOOR = 0.6;
/** HSL chroma (colourfulness) of a saturation at a lightness, both 0 to 1. */
export const chroma = (s, l) => (1 - Math.abs(2 * l - 1)) * s;

/**
 * Saturation of one step: the input saturation, tapered toward the ends; in steps 400 to 700 also capped so the step is
 * no more colourful than the input (a mid-tone teal never turns into a bright cyan at 400 or 500).
 * @param {number} st step @param {number} s input saturation @param {number} l input lightness
 */
export function stepSaturation(st, s, l) {
  let out = s * (SAT_TAPER[st] ?? 1);
  if (CHROMA_CAP[st]) {
    const L = LIGHTNESS[st] / 100;
    out = Math.min(out, Math.max((CHROMA_CAP[st] * chroma(s, l)) / (1 - Math.abs(2 * L - 1)), s * SAT_FLOOR));
  }
  return out;
}

/**
 * A 50-900 scale that keeps the input's hue; lightness follows the fixed table and saturation follows stepSaturation.
 * The input hex itself sits unchanged at the step whose lightness is nearest.
 * @param {string} hex @param {{withDarkest?:boolean}} [o]
 */
export function ramp(hex, { withDarkest = false } = {}) {
  const given = normHex(hex);
  const [h, s, l] = rgbToHsl(hexToRgb(given));
  const steps = withDarkest ? [...STEPS, 950] : STEPS;
  let at = steps[0];
  for (const st of steps) if (Math.abs(LIGHTNESS[st] / 100 - l) < Math.abs(LIGHTNESS[at] / 100 - l)) at = st;
  const scale = {};
  for (const st of steps) scale[st] = st === at ? given : hslToHexKeepHue(h, stepSaturation(st, s, l), LIGHTNESS[st] / 100);
  return { given, hue: h, saturation: s, at, scale };
}
/** Neutral scale tinted with the primary hue at a low saturation. */
export function neutralRamp(hue, sat) {
  const scale = {};
  for (const st of [...STEPS, 950]) scale[st] = hslToHexKeepHue(hue, sat, LIGHTNESS[st] / 100);
  return { given: null, hue, saturation: sat, at: null, scale };
}
export const MID_STEPS = [300, 400, 500, 600, 700, 800];
/** Largest hue drift of the coloured steps (all, or the steps named), in degrees. */
export function maxDrift(r, steps) {
  let d = 0;
  for (const [st, v] of Object.entries(r.scale)) {
    if (steps && !steps.includes(Number(st))) continue; const [hh, ss] = rgbToHsl(hexToRgb(v)); if (ss > 0) d = Math.max(d, hueDiff(hh, r.hue)); }
  return d;
}

// ---------- roles ----------

const WHITE = '#ffffff';
const BLACK = '#000000';
const passesAll = (fg, bgs, need) => bgs.every((b) => contrast(fg, b) >= need);
/** First candidate whose colour passes on every background. */
function pick(scale, order, bgs, need) {
  for (const st of order) if (scale[st] && passesAll(scale[st], bgs, need)) return st;
  return null;
}
/** Order of steps starting next to `from` and moving in one direction. */
const from = (start, dir, steps = STEPS) => { const i = steps.indexOf(start); return dir > 0 ? steps.slice(i) : steps.slice(0, i + 1).reverse(); };

/**
 * Fill colour with a readable text colour on it: keep the given step when white or the dark ink passes on it.
 * A brand colour that is a mid-tone (neither white nor the dark ink reaches 4.5:1 on it) moves the fill to the nearest
 * darker step of the same scale where white reaches 4.5:1; only when no darker step can, black text goes on the given colour.
 * The result keeps `midTone` with both ratios for the report.
 */
function solid(r, ink, { brand = false } = {}) {
  const tries = [r.at ?? 600, ...from(r.at ?? 600, 1).slice(1), ...from(r.at ?? 600, -1).slice(1)];
  for (const st of tries) {
    const bg = r.scale[st];
    const opts = [WHITE, ink].map((t) => ({ t, c: contrast(t, bg) })).sort((a, b) => b.c - a.c);
    if (opts[0].c >= 4.5) return { step: st, bg, on: opts[0].t };
    if (brand && st === r.at) {
      const darker = from(st, 1).slice(1).find((d) => r.scale[d] && contrast(WHITE, r.scale[d]) >= 4.5);
      const midTone = { step: st, hex: bg, white: contrast(WHITE, bg), black: contrast(BLACK, bg) };
      if (darker != null) return { step: darker, bg: r.scale[darker], on: WHITE, midTone: { ...midTone, fillStep: darker, fillHex: r.scale[darker], fillWhite: contrast(WHITE, r.scale[darker]) } };
      if (midTone.black >= 4.5) return { step: st, bg, on: BLACK, midTone: { ...midTone, fillStep: null } };
    }
    if (contrast(BLACK, bg) >= 4.5) return { step: st, bg, on: BLACK }; // no darker step of the hue carries white text: black keeps the colour as the fill
  }
  return { step: 900, bg: r.scale[900], on: WHITE };
}
/** Text on a fill as a role value: white and black are literal, the dark ink is neutral-900. */
const onRole = (on, ref, lit) => (on === WHITE || on === BLACK ? lit(on) : ref('neutral', 900));
/** Hover and pressed shades: neighbours that keep the text readable. */
function shades(r, s) {
  const dir = s.on === WHITE ? 1 : -1;
  const ok = (st) => r.scale[st] && contrast(s.on, r.scale[st]) >= 4.5;
  const seq = [...from(s.step, dir).slice(1), ...from(s.step, -dir).slice(1)].filter(ok);
  return { hover: seq[0] ?? s.step, pressed: seq[1] ?? seq[0] ?? s.step };
}

/**
 * Build every token from the inputs.
 * @param {{primary?:string, accent?:string, neutral?:string, success?:string, warning?:string, danger?:string, info?:string,
 *   archetype?:string, font?:string, name?:string}} input
 */
export function build(input = {}) {
  const archId = input.archetype ?? 'calm-workspace';
  const A = ARCHETYPES[archId];
  if (!A) throw new Error(`unknown archetype ${archId} (one of ${Object.keys(ARCHETYPES).join(', ')})`);
  const primaryHex = input.primary ? normHex(input.primary) : A.primary;
  const scales = { primary: ramp(primaryHex) };
  if (input.accent) scales.accent = ramp(input.accent);
  scales.neutral = input.neutral ? ramp(input.neutral, { withDarkest: true }) : neutralRamp(scales.primary.hue, A.neutralSat);
  for (const k of Object.keys(STATUS_DEFAULTS)) scales[k] = ramp(input[k] ?? STATUS_DEFAULTS[k]);
  const N = scales.neutral.scale, P = scales.primary;
  const ink = N[900];

  const surf = {
    light: { default: WHITE, subtle: N[50], raised: WHITE, sunken: N[100] },
    dark: { default: N[950], subtle: N[900], raised: N[800], sunken: N[950] },
  };
  const roles = { light: {}, dark: {} };
  const ref = (scale, st) => ({ ref: `color.${scale}.${st}`, hex: scales[scale].scale[st] });
  const lit = (hex) => ({ ref: null, hex });
  const need = (step, msg) => { if (step == null) throw new Error(msg); return step; };
  const fills = {}; // mid-tone brand colours whose filled button moved to a darker step (or got black text), for the report

  for (const mode of ['light', 'dark']) {
    const S = surf[mode], R = roles[mode], bgs = Object.values(S);
    const lighter = mode === 'dark';
    for (const [k, v] of Object.entries(S)) R[`surface-${k}`] = v === WHITE ? lit(WHITE) : ref('neutral', Object.keys(N).find((st) => N[st] === v));
    R['surface-inverse'] = lighter ? ref('neutral', 50) : ref('neutral', 900);
    R['text-default'] = lighter ? ref('neutral', 50) : ref('neutral', 900);
    R['text-muted'] = ref('neutral', need(pick(N, lighter ? [400, 300, 200, 100] : [600, 700, 800], bgs, 4.5), 'no muted text step passes'));
    R['text-disabled'] = ref('neutral', lighter ? 600 : 400);
    R['text-inverse'] = lighter ? ref('neutral', 900) : ref('neutral', 50);
    const link = need(pick(P.scale, lighter ? from(Math.min(P.at, 400), -1) : from(Math.max(P.at, 500), 1), bgs, 4.5), 'no link step passes');
    R['text-link'] = ref('primary', link);
    R['text-link-hover'] = ref('primary', (lighter ? from(link, -1) : from(link, 1))[1] ?? link);
    R['border-default'] = ref('neutral', lighter ? 800 : 200);
    R['border-strong'] = ref('neutral', need(pick(N, lighter ? [500, 400, 300] : [400, 500, 600, 700], bgs, 3), 'no strong border passes'));
    R['border-focus'] = ref('primary', need(pick(P.scale, lighter ? from(Math.min(P.at, 400), -1) : from(Math.max(P.at, 500), 1), bgs, 3), 'no focus step passes'));
    const s = solid(P, ink, { brand: true }), sh = shades(P, s);
    if (s.midTone) fills.primary = s.midTone;
    R['action-primary-bg'] = ref('primary', s.step);
    R['action-primary-bg-hover'] = ref('primary', sh.hover);
    R['action-primary-bg-pressed'] = ref('primary', sh.pressed);
    R['action-primary-text'] = onRole(s.on, ref, lit);
    R['action-secondary-text'] = R['text-link'];
    R['action-secondary-border'] = R['border-focus'];
    R['selected-bg'] = ref('primary', lighter ? 900 : 50);
    R['selected-text'] = ref('primary', need(pick(P.scale, lighter ? from(Math.min(P.at, 400), -1) : from(Math.max(P.at, 500), 1), [...bgs, P.scale[lighter ? 900 : 50]], 4.5), 'no selected text step passes'));
    if (A.brandSurface) {
      R['surface-brand'] = R['action-primary-bg'];
      R['text-on-brand'] = R['action-primary-text'];
    }
    if (scales.accent) {
      const a = solid(scales.accent, ink, { brand: true });
      if (a.midTone) fills.accent = a.midTone;
      R['accent-bg'] = ref('accent', a.step);
      R['accent-text-on'] = onRole(a.on, ref, lit);
      R['accent-text'] = ref('accent', need(pick(scales.accent.scale, lighter ? from(Math.min(scales.accent.at, 400), -1) : from(Math.max(scales.accent.at, 500), 1), bgs, 4.5), 'no accent text step passes'));
    }
    for (const k of Object.keys(STATUS_DEFAULTS)) {
      const sc = scales[k].scale, sub = lighter ? 900 : 50;
      R[`${k}-bg-subtle`] = ref(k, sub);
      R[`${k}-border`] = ref(k, lighter ? 700 : 200);
      R[`${k}-text`] = ref(k, need(pick(sc, lighter ? [400, 300, 200, 100] : [600, 700, 800, 900], [...bgs, sc[sub]], 4.5), `no ${k} text step passes`));
      const so = solid(scales[k], ink);
      R[`${k}-bg`] = ref(k, so.step);
      R[`${k}-text-on`] = onRole(so.on, ref, lit);
    }
  }

  // Every text pair a screen can show, with the minimum it needs.
  const pairs = [];
  const add = (fg, bg, needRatio, kind = 'text') => pairs.push({ fg, bg, need: needRatio, kind, light: contrast(roles.light[fg].hex, roles.light[bg].hex), dark: contrast(roles.dark[fg].hex, roles.dark[bg].hex) });
  for (const t of ['text-default', 'text-muted', 'text-link', 'selected-text', ...(scales.accent ? ['accent-text'] : [])]) for (const b of ['surface-default', 'surface-subtle', 'surface-raised', 'surface-sunken']) add(t, b, 4.5);
  add('text-inverse', 'surface-inverse', 4.5);
  add('action-primary-text', 'action-primary-bg', 4.5);
  add('action-primary-text', 'action-primary-bg-hover', 4.5);
  add('action-primary-text', 'action-primary-bg-pressed', 4.5);
  add('selected-text', 'selected-bg', 4.5);
  if (scales.accent) add('accent-text-on', 'accent-bg', 4.5);
  for (const k of Object.keys(STATUS_DEFAULTS)) { add(`${k}-text`, 'surface-default', 4.5); add(`${k}-text`, `${k}-bg-subtle`, 4.5); add(`${k}-text-on`, `${k}-bg`, 4.5); }
  for (const b of ['surface-default', 'surface-subtle']) { add('border-strong', b, 3, 'non-text'); add('border-focus', b, 3, 'non-text'); }

  const fontSans = input.font ? [input.font, ...SYSTEM_SANS] : SYSTEM_SANS;
  const fontHeading = input.font ? fontSans : A.headingFont === 'serif' ? SYSTEM_SERIF : SYSTEM_SANS;
  return { archetype: archId, A, scales, roles, pairs, fills, fonts: { sans: fontSans, heading: fontHeading, mono: SYSTEM_MONO }, input: { ...input, primary: primaryHex, primaryFromArchetype: !input.primary } };
}

// ---------- writers ----------

const px = (n) => `${n}px`;
const fam = (list) => list.map((f) => (/[\s]/.test(f) && !/^-/.test(f) ? `"${f}"` : f)).join(', ');
function shadowCss(sh, rgb, mult = 1) {
  if (!sh) return 'none';
  const [y, blur, spread, a] = sh;
  return `0 ${y}px ${blur}px ${spread}px rgba(${rgb.join(', ')}, ${Math.min(0.6, +(a * mult).toFixed(2))})`;
}

/** Flat list of every token: [group, cssName, value, $type, jsonValue, description?]. */
export function tokenList(b) {
  const { A, scales, fonts } = b;
  const out = [];
  const t = (group, name, css, type, json = css, desc) => out.push({ group, name, css: String(css), type, json, desc });
  t('color-primary', 'color-brand', scales.primary.given, 'color', scales.primary.given, 'The brand colour exactly as given; the filled button may use a darker step of the same hue (see color.role.*.action-primary-bg).');
  for (const [k, r] of Object.entries(scales)) for (const [st, hx] of Object.entries(r.scale)) t(k === 'neutral' ? 'color-neutral' : ['success', 'warning', 'danger', 'info'].includes(k) ? 'color-status' : 'color-primary', `color-${k}-${st}`, hx, 'color');
  t('typography', 'font-family-sans', fam(fonts.sans), 'fontFamily', fonts.sans);
  t('typography', 'font-family-heading', fam(fonts.heading), 'fontFamily', fonts.heading);
  t('typography', 'font-family-mono', fam(fonts.mono), 'fontFamily', fonts.mono);
  A.sizes.forEach((s, i) => t('typography', `font-size-${SIZE_NAMES[i]}`, px(s), 'dimension'));
  t('typography', 'line-height-body', 1.5, 'number', 1.5);
  t('typography', 'line-height-heading', 1.25, 'number', 1.25);
  t('typography', 'line-height-display', 1.2, 'number', 1.2);
  t('typography', 'font-weight-regular', A.weights[0], 'fontWeight', A.weights[0]);
  t('typography', 'font-weight-strong', A.weights[1], 'fontWeight', A.weights[1]);
  t('typography', 'measure', '65ch', 'dimension');
  for (const s of SPACING) t('spacing', `space-${s}`, px(s), 'dimension');
  ['sm', 'md', 'lg'].forEach((n, i) => t('control', `control-height-${n}`, px(A.controls[i]), 'dimension'));
  t('control', 'size-target-min', px(TARGET_MIN), 'dimension', px(TARGET_MIN), 'Smallest click or tap area; extend small controls with padding or a pseudo-element.');
  for (const [n, v] of Object.entries(A.radius)) t('radius', `radius-${n}`, px(v), 'dimension');
  t('radius', 'radius-full', '9999px', 'dimension');
  t('radius', 'radius-control', A.buttonRadius === 'full' ? 'var(--radius-full)' : `var(--radius-${A.buttonRadius})`, 'dimension', A.buttonRadius === 'full' ? '{radius.full}' : `{radius.${A.buttonRadius}}`);
  const rgb = hexToRgb(scales.neutral.scale[950]);
  A.shadow.forEach((sh, i) => t('shadow', `shadow-${i + 1}`, shadowCss(sh, rgb), 'shadow', sh ? { color: `rgba(${rgb.join(', ')}, ${sh[3]})`, offsetX: '0px', offsetY: px(sh[0]), blur: px(sh[1]), spread: px(sh[2]) } : 'none'));
  t('border-width', 'border-width-hairline', '1px', 'dimension');
  t('border-width', 'border-width-thick', '2px', 'dimension');
  t('border-width', 'border-width-focus', '2px', 'dimension');
  for (const [n, v] of Object.entries(A.motion)) t('motion', `duration-${n}`, `${v}ms`, 'duration');
  t('motion', 'ease-standard', 'cubic-bezier(0.2, 0, 0, 1)', 'cubicBezier', [0.2, 0, 0, 1]);
  t('motion', 'ease-enter', 'cubic-bezier(0, 0, 0.2, 1)', 'cubicBezier', [0, 0, 0.2, 1]);
  t('motion', 'ease-exit', 'cubic-bezier(0.4, 0, 1, 1)', 'cubicBezier', [0.4, 0, 1, 1]);
  if (A.emphasized) t('motion', 'ease-emphasized', 'cubic-bezier(0.34, 1.56, 0.64, 1)', 'cubicBezier', [0.34, 1.56, 0.64, 1]);
  for (const [n, v] of Object.entries(BREAKPOINTS)) t('breakpoint', `breakpoint-${n}`, px(v), 'dimension', px(v), 'CSS variables do not work inside media queries; copy this number there.');
  for (const [n, v] of Object.entries(DENSITY[A.density])) t('density', `density-${n}`, px(v), 'dimension');
  return out;
}

/** Where a token sits in the JSON tree: color.primary.600, font.size.md, space.16, motion.duration-fast. */
export function jsonPath(tk) {
  const p = tk.name.split('-');
  if (tk.name === 'color-brand') return ['color', 'brand'];
  if (p[0] === 'color') return ['color', p[1], p.slice(2).join('-')];
  if (p[0] === 'font') return ['font', p[1], p.slice(2).join('-')];
  if (tk.name.startsWith('line-height-')) return ['font', 'line-height', p.slice(2).join('-')];
  if (tk.name === 'measure') return ['font', 'measure'];
  if (tk.name.startsWith('size-target')) return ['control', p.slice(1).join('-')];
  if (tk.group === 'motion') return ['motion', tk.name];
  if (tk.name.startsWith('border-width-')) return ['border-width', p.slice(2).join('-')];
  return [p[0], p.slice(1).join('-')];
}

/** W3C design tokens (Design Tokens Community Group format): groups, $type, $value, aliases in braces. */
export function toJson(b, { only } = {}) {
  const doc = { $description: `Design tokens, archetype ${b.archetype}. Light and dark roles under color.role.light and color.role.dark.` };
  const set = (path, leaf) => { let o = doc; for (const k of path.slice(0, -1)) o = o[k] ??= {}; o[path.at(-1)] = leaf; };
  for (const tk of tokenList(b)) {
    if (only && !only.has(tk.group)) continue;
    const path = jsonPath(tk);
    const leaf = { $type: tk.type, $value: tk.json };
    if (tk.desc) leaf.$description = tk.desc;
    set(path, leaf);
  }
  if (!only || only.has('color-roles')) {
    for (const mode of ['light', 'dark']) for (const [k, v] of Object.entries(b.roles[mode])) set(['color', 'role', mode, k], { $type: 'color', $value: jsonRef(v, only) });
  }
  if (doc.color?.primary) doc.color.primary.$description = `Brand colour on at most ${b.A.accentShare}% of a screen: ${b.A.accentUse}.`;
  return doc;
}

const SCALE_GROUP = (ref) => { const k = ref.split('.')[1]; return k === 'neutral' ? 'color-neutral' : ['success', 'warning', 'danger', 'info'].includes(k) ? 'color-status' : 'color-primary'; };
/** A role points at its scale step; when that scale is not written (a gap file), it holds the hex itself. */
const cssRef = (v, only) => (v.ref && (!only || only.has(SCALE_GROUP(v.ref))) ? `var(--${v.ref.replace(/\./g, '-')})` : v.hex);
const jsonRef = (v, only) => (v.ref && (!only || only.has(SCALE_GROUP(v.ref))) ? `{${v.ref}}` : v.hex);

/** CSS custom properties: scales and light roles on :root, dark roles by system setting and by [data-theme]. */
export function toCss(b, { only, extraDark = [], skipNames = new Set() } = {}) {
  const L = [];
  const list = tokenList(b).filter((tk) => (!only || only.has(tk.group)) && !skipNames.has(`--${tk.name}`));
  const role = (mode) => Object.entries(b.roles[mode]).filter(([k]) => !skipNames.has(`--color-${k}`)).map(([k, v]) => `  --color-${k}: ${cssRef(v, only)};`);
  const withRoles = !only || only.has('color-roles');
  const withDark = !only || only.has('dark-mode');
  L.push(`/* Design tokens, archetype ${b.archetype}. Generated by the design-system skill. No external fonts or links. */`);
  L.push(':root {');
  if (withRoles || withDark) L.push('  color-scheme: light dark;');
  for (const tk of list) L.push(`  --${tk.name}: ${tk.css};`);
  if (withRoles) L.push(...role('light'));
  L.push('}');
  if (withRoles) L.push('', ':root[data-theme="light"] {', '  color-scheme: light;', ...role('light'), '}');
  const rgb = hexToRgb('#000000');
  const darkShadows = (!only || only.has('shadow')) ? b.A.shadow.map((sh, i) => `  --shadow-${i + 1}: ${shadowCss(sh, rgb, 3)};`) : [];
  const dark = [...(withRoles ? role('dark') : []), ...extraDark.map(([n, v]) => `  ${n}: ${v};`), ...darkShadows];
  if (withDark && dark.length) {
    L.push('', '@media (prefers-color-scheme: dark) {', '  :root:not([data-theme="light"]) {', '    color-scheme: dark;', ...dark.map((l) => `  ${l}`), '  }', '}');
    L.push('', ':root[data-theme="dark"] {', '  color-scheme: dark;', ...dark, '}');
  }
  if (!only || only.has('density')) {
    for (const [mode, v] of Object.entries(DENSITY)) L.push('', `[data-density="${mode}"] {`, ...Object.entries(v).map(([n, x]) => `  --density-${n}: ${x}px;`), '}');
  }
  if (!only || only.has('motion')) {
    L.push('', '@media (prefers-reduced-motion: reduce) {', '  :root {', ...Object.keys(b.A.motion).map((n) => `    --duration-${n}: 0ms;`), '  }', '}');
  }
  return L.join('\n') + '\n';
}

// ---------- existing systems (path c) ----------

export const GROUP_PATTERNS = [
  ['color-primary', /primary|brand|accent/],
  ['color-neutral', /neutral|gr[ae]y|slate|zinc|stone/],
  ['color-status', /success|warning|danger|error|info/],
  ['color-roles', /(^|-)(surface|background|bg|text|fg|foreground|border)(-|$)/],
  ['typography', /font|text-(xs|sm|base|md|lg|xl)|leading|line-height|weight|type-/],
  ['spacing', /space|spacing|gap|gutter/],
  ['control', /control|input-height|button-height|target/],
  ['radius', /radius|rounded/],
  ['shadow', /shadow|elevation/],
  ['border-width', /border-width|stroke-width/],
  ['motion', /duration|ease|easing|motion|transition/],
  ['breakpoint', /breakpoint|screen|(^|-)bp(-|$)/],
  ['density', /density/],
];
const isColour = (v) => /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(String(v).trim());

/** Read existing CSS custom properties and W3C/plain JSON tokens. */
export function readExisting(files) {
  const tokens = []; let hasDark = false;
  for (const f of files) {
    const text = readFileSync(f, 'utf8');
    if (/\.json$/i.test(f)) {
      const walk = (o, path) => {
        if (o && typeof o === 'object' && ('$value' in o || 'value' in o)) { tokens.push({ name: path.join('-'), value: String(o.$value ?? o.value), file: basename(f) }); return; }
        if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) if (!k.startsWith('$')) walk(v, [...path, k]);
      };
      walk(JSON.parse(text), []);
      if (/"dark"/.test(text)) hasDark = true;
    } else {
      if (/prefers-color-scheme:\s*dark|\[data-theme/.test(text)) hasDark = true;
      const root = text.replace(/@media[^{]*\{[\s\S]*?\}\s*\}/g, '');
      for (const m of root.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) tokens.push({ name: m[1].slice(2), value: m[2].trim(), file: basename(f) });
    }
  }
  const groups = new Set();
  for (const tk of tokens) for (const [g, re] of GROUP_PATTERNS) {
    if (!re.test(tk.name.toLowerCase())) continue;
    if (g.startsWith('color-') && !isColour(tk.value)) continue;
    if (g === 'color-roles' && !isColour(tk.value)) continue;
    groups.add(g); break;
  }
  if (hasDark) groups.add('dark-mode');
  return { tokens, groups };
}

/** Role of an existing colour token from its name, used to give it a dark value. */
export function roleOfName(name) {
  const n = name.toLowerCase();
  if (/primary|brand|accent|success|warning|danger|error|info/.test(n)) return null;
  if (/(^|-)(surface|background|bg)(-|$)/.test(n)) return /subtle|muted|alt|secondary|sunken/.test(n) ? 'surface-subtle' : 'surface-default';
  if (/(^|-)(text|fg|foreground)(-|$)/.test(n)) return /muted|secondary|subtle|soft/.test(n) ? 'text-muted' : 'text-default';
  if (/(^|-)border(-|$)/.test(n)) return 'border-default';
  return null;
}

// ---------- report ----------

export const ALL_GROUPS = ['color-primary', 'color-neutral', 'color-status', 'color-roles', 'dark-mode', 'typography', 'spacing', 'control', 'radius', 'shadow', 'border-width', 'motion', 'breakpoint', 'density'];

/** Questions the engine can see itself, so they never depend on the agent noticing them. */
export function autoQuestions(b, existing) {
  const q = [];
  const writesRoles = !existing || existing.added.includes('color-roles');
  const L = b.roles.light;
  if (writesRoles && L['action-primary-bg-hover'].ref === L['action-primary-bg-pressed'].ref) q.push(`Hover and pressed share ${L['action-primary-bg-hover'].ref.replace('color.', '').replace('.', '-')}, because the filled button sits near the end of its scale; give pressed its own colour if they must differ.`);
  for (const k of Object.keys(STATUS_DEFAULTS)) {
    if (b.input[k]) continue;
    if (hueDiff(b.scales.primary.hue, b.scales[k].hue) < 15 && b.scales.primary.saturation > 0.25) q.push(`Your primary colour is close to the ${k} colour (${b.scales[k].given}); should ${k} use a different hue?`);
  }
  return q;
}

export function report(b, { name = 'Product', why = '', path = 'a', existing = null, files = [], failing = [], open = [] } = {}) {
  const L = [];
  const pathText = { a: 'a, from your colour', b: 'b, from your description of the style', c: 'c, filling the gaps of your existing design system' }[path];
  L.push(`## Design system: ${name}`, '');
  L.push(`Path ${pathText}. Archetype: ${b.archetype}.${why ? ` ${why}` : ''}`, '');
  L.push('This report is the whole reply: the files written, the checks run with every result, and the open questions.', '');
  const WHAT = { 'design-tokens.json': 'W3C design tokens', 'tokens.css': 'CSS custom properties, light and dark', 'design-tokens.gaps.json': 'W3C design tokens, missing groups only', 'tokens.gaps.css': 'CSS custom properties, missing groups only', 'design-system-report.md': 'this report' };
  L.push('### Files', ...files.map((f) => `- ${f}${WHAT[f] ? `: ${WHAT[f]}` : ''}`), '');
  L.push('### Colours kept', '| Input | Hex | Hue | Placed at |', '|-------|-----|-----|-----------|');
  const STATUS = ['success', 'warning', 'danger', 'info'];
  const defaults = [];
  for (const [k, r] of Object.entries(b.scales)) {
    if (!r.given) continue;
    if (STATUS.includes(k) && !b.input[k]) { defaults.push(`${k} ${r.given} (${k}-${r.at})`); continue; }
    const src = k === 'primary' && b.input.primaryFromArchetype ? 'primary (archetype default)' : k;
    const keptHere = existing && !existing.added.includes(SCALE_GROUP(`color.${k}`));
    L.push(`| ${src} | ${r.given} | ${Math.round(r.hue)}° | ${keptHere ? 'your token, unchanged' : `${k}-${r.at}`} |`);
  }
  if (defaults.length) L.push('', `Status colours not given, defaults used: ${defaults.join(', ')}.`);
  for (const [k, f] of Object.entries(b.fills ?? {})) {
    const keptHere = existing && !existing.added.includes(SCALE_GROUP(`color.${k}`));
    if (keptHere) continue;
    const what = k === 'primary' ? 'Primary button' : 'Accent fill';
    L.push('', f.fillStep != null
      ? `${what}: white text on your ${f.hex} is ${ratioText(f.white)} (below 4.5:1), so the fill uses ${k}-${f.fillStep} ${f.fillHex}, the nearest darker step of the same hue, where white text is ${ratioText(f.fillWhite)}. Your ${f.hex} stays unchanged at ${k}-${f.step}${k === 'primary' ? ' and as --color-brand' : ''}.`
      : `${what}: white text on your ${f.hex} is ${ratioText(f.white)} and no darker step of the same hue reaches 4.5:1 with white, so the fill keeps your colour with black text at ${ratioText(f.black)}.`);
  }
  const given = Object.values(b.scales).filter((r) => r.given);
  const mid = Math.max(...given.map((r) => maxDrift(r, MID_STEPS))), ends = Math.max(...given.map((r) => maxDrift(r)));
  L.push('', `Hue check: each input hex is unchanged and every step aims at its exact hue; lightness follows the fixed steps and saturation eases toward the palest and darkest steps, and steps 400 to 700 are never more colourful than your colour. Rounding to hex moves the hue at most ${mid.toFixed(1)}° at steps 300 to 800 and ${ends.toFixed(1)}° at the palest and darkest steps.`, '');
  L.push('### Contrast', `Text needs 4.5:1; borders of controls and focus rings need 3:1; border-default is for dividers and is not checked. ${failing.length ? 'Pairs of your own tokens below 4.5:1 are marked "yours, kept": this skill never changes your tokens.' : 'Every text role meets 4.5:1, so it is safe at any size.'}`, '');
  L.push('| Text | On | Light | Dark | Needs | Result |', '|------|----|-------|------|-------|--------|');
  if (existing && !existing.added.includes('color-roles')) {
    for (const p of existing.pairs) L.push(`| ${p.fg} | ${p.bg} | ${ratioText(p.light)}${p.light < 4.5 ? ' (yours, kept)' : ''} | ${p.dark == null ? 'none' : ratioText(p.dark)} | 4.5:1 | ${p.light >= 4.5 && (p.dark == null || p.dark >= 4.5) ? 'pass' : 'FAIL'} |`);
    if (!existing.pairs.length) L.push('| none | none | none | none | 4.5:1 | no text and surface tokens found |');
  } else {
    // One row per text role: the lowest ratio over every surface it sits on, so a passing row means every pair passes.
    const rows = new Map();
    for (const p of b.pairs) {
      const key = `${p.fg}|${p.need}`;
      const r = rows.get(key) ?? { fg: p.fg, need: p.need, bgs: [], light: Infinity, dark: Infinity };
      r.bgs.push(p.bg); r.light = Math.min(r.light, p.light); r.dark = Math.min(r.dark, p.dark); rows.set(key, r);
    }
    const SURF = ['surface-default', 'surface-subtle', 'surface-raised', 'surface-sunken'];
    for (const r of rows.values()) {
      const all = SURF.every((x) => r.bgs.includes(x));
      const on = all ? ['all 4 surfaces', ...r.bgs.filter((x) => !SURF.includes(x))].join(', ') : r.bgs.join(', ');
      L.push(`| ${r.fg} | ${on} | ${ratioText(r.light)} | ${ratioText(r.dark)} | ${r.need}:1 | ${r.light >= r.need && r.dark >= r.need ? 'pass' : 'FAIL'} |`);
    }
    L.push('', `Light and Dark give the lowest ratio of each role over the surfaces listed; ${b.pairs.length} pairs checked in each mode.`);
  }
  L.push('');
  if (existing) {
    L.push('### Kept from your system', `- ${existing.tokens.length} tokens in ${[...new Set(existing.tokens.map((t) => t.file))].join(', ')}, unchanged. Groups found: ${[...existing.groups].join(', ') || 'none'}.`);
    L.push('', '### Added', existing.added.length ? `- Groups added: ${existing.added.join(', ')}.` : '- No gaps found. Nothing added.');
    if (existing.darkFor.length) L.push(`- Dark values for your existing role tokens: ${existing.darkFor.join(', ')}.`);
    L.push('', '### Existing pairs below the minimum (kept, not changed)');
    L.push(...(failing.length ? failing.map((f) => `- ${f.fg} on ${f.bg}: ${f.fgHex} on ${f.bgHex}, ${ratioText(f.ratio)}; needs 4.5:1.`) : ['- None.']));
    L.push('');
  }
  L.push('### How to use', existing ? '- Load tokens.gaps.css after your existing token files and before your own styles; it only adds tokens and dark values.' : '- Load tokens.css before your own styles. ', '- Without a data-theme attribute the page follows the system setting; set data-theme="light" or data-theme="dark" on the html element to force one.');
  L.push(`- Spacing: ${SPACING.join(', ')} px. Type sizes: ${b.A.sizes.join(', ')} px, body ${b.A.sizes[2]} px, line-height 1.5. Weights: ${b.A.weights.join(' and ')}.`);
  L.push(`- Controls: ${b.A.controls.join(', ')} px high; every click or tap area at least ${TARGET_MIN} px. Breakpoints: ${Object.values(BREAKPOINTS).join(', ')} px (copy the numbers into media queries).`);
  L.push(`- Brand colour on at most ${b.A.accentShare}% of a screen: ${b.A.accentUse}.`);
  if (b.input.font) L.push(`- Font: ${b.input.font}, then the system stack. Load the font files yourself; these tokens add no font files, imports or links.`);
  else L.push('- Font: the system font stack. No font files, imports or links.');
  const auto = autoQuestions(b, existing);
  const qs = [...auto, ...open];
  L.push('', '### Open questions', ...(qs.length ? qs.map((q) => `- ${q}`) : ['- None.']), '');
  return L.join('\n');
}

// ---------- CLI ----------

export function parseArgs(argv) {
  const o = { existing: [], open: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const k = a.slice(2), v = argv[i + 1];
    if (k === 'existing' || k === 'open') { o[k].push(v); i++; } else if (k === 'force') o.force = true; else { o[k] = v; i++; }
  }
  return o;
}

export function run(argv, cwd = process.cwd()) {
  const o = parseArgs(argv);
  const out = resolve(cwd, o.out ?? '.');
  const SKILL_DIR = resolve(fileURLToPath(new URL('..', import.meta.url)));
  if (out === SKILL_DIR || out.startsWith(SKILL_DIR + sep)) throw new Error(`the output folder is inside the skill folder (${out}); pass --out <the user's project folder>`);
  let existing = null, only = null, skipNames = new Set(), extraDark = [], failing = [];
  if (o.existing.length) {
    const files = o.existing.map((f) => resolve(cwd, f));
    existing = readExisting(files);
    if (!o.primary) {
      const brand = existing.tokens.find((t) => /primary|brand/.test(t.name) && isColour(t.value));
      if (brand) o.primary = brand.value;
    }
    skipNames = new Set(existing.tokens.map((t) => `--${t.name}`));
    existing.added = ALL_GROUPS.filter((g) => !existing.groups.has(g));
    only = new Set(existing.added);
  }
  const b = build({ primary: o.primary, accent: o.accent, neutral: o.neutral, success: o.success, warning: o.warning, danger: o.danger, info: o.info, archetype: o.archetype, font: o.font });
  if (existing) {
    existing.darkFor = [];
    if (only.has('dark-mode') && existing.groups.has('color-roles')) {
      for (const t of existing.tokens) { const r = isColour(t.value) && roleOfName(t.name); if (r) { extraDark.push([`--${t.name}`, b.roles.dark[r].hex]); existing.darkFor.push(`--${t.name}`); } }
    }
    const fgs = existing.tokens.filter((t) => isColour(t.value) && /^text-(default|muted)$/.test(roleOfName(t.name) ?? ''));
    const bgs = existing.tokens.filter((t) => isColour(t.value) && /^surface-/.test(roleOfName(t.name) ?? ''));
    existing.pairs = [];
    const darkOf = (t) => (extraDark.find(([n]) => n === `--${t.name}`) ?? [])[1];
    for (const f of fgs) for (const g of bgs) {
      const r = contrast(f.value, g.value);
      const df = darkOf(f), dg = darkOf(g);
      existing.pairs.push({ fg: `--${f.name}`, bg: `--${g.name}`, light: r, dark: df && dg ? contrast(df, dg) : null });
      if (r < 4.5) failing.push({ fg: `--${f.name}`, bg: `--${g.name}`, fgHex: normHex(f.value), bgHex: normHex(g.value), ratio: r });
    }
  }
  mkdirSync(out, { recursive: true });
  const files = [];
  const write = (f, text) => { writeFileSync(join(out, f), text); files.push(f); };
  if (!existing) {
    write('design-tokens.json', JSON.stringify(toJson(b), null, 2) + '\n');
    write('tokens.css', toCss(b));
  } else if (existing.added.length || extraDark.length) {
    for (const f of ['design-tokens.gaps.json', 'tokens.gaps.css']) if (existsSync(join(out, f)) && !o.force) throw new Error(`${f} already exists; pass --force to replace your earlier gap file`);
    write('design-tokens.gaps.json', JSON.stringify(toJson(b, { only }), null, 2) + '\n');
    write('tokens.gaps.css', toCss(b, { only, extraDark, skipNames }));
  }
  const path = existing ? 'c' : o.primary ? 'a' : 'b';
  const md = report(b, { name: o.name ?? 'Product', why: o.why ?? '', path, existing, files: [...files, 'design-system-report.md'], failing, open: o.open });
  write('design-system-report.md', md);
  const bad = b.pairs.filter((p) => p.light < p.need || p.dark < p.need);
  return { b, md, files, bad, out };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const r = run(process.argv.slice(2));
    console.log(r.md);
    console.log(`---\nFiles written to ${r.out}. Reply to the user with the report above, word for word (it is also in design-system-report.md), and nothing before or after it: it already lists the files, the checks and the open questions.`);
    process.exit(r.bad.length ? 1 : 0);
  } catch (e) { console.error(`design-system engine: ${e.message}`); process.exit(2); }
}
