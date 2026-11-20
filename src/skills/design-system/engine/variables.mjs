#!/usr/bin/env node
/**
 * Variables engine of the design-system skill: one source (design/variables.json), three tiers, light and dark modes,
 * and four commands. Node.js only, no dependencies. It builds on tokens.mjs, so the numbers are the same.
 *
 *   node variables.mjs init  [--dir design] [--brief design/BRIEF.md] [--primary #hex] [--archetype id] [--font name]
 *                            [--modern] [--name "Product"] [--why "..."] [--force]
 *   node variables.mjs set   <variable> <value> [--mode light|dark] [--dir design] [--dry-run]
 *   node variables.mjs check [--dir design] [--code <folder>]
 *   node variables.mjs explain <variable> [--dir design] [--code <folder>]
 *   node variables.mjs build [--dir design]        write the generated files again from variables.json
 *
 * Tiers: primitive (a value), semantic (a role that points at a primitive, per mode) and component (points at a role).
 * The only editable part of variables.json is "source" (inputs and overrides), and only through `set`. Every other
 * file is generated from it. Exit codes: 0 ok, 1 a contrast pair, an alias or a generated file is wrong, 2 bad input.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync, appendFileSync } from 'node:fs';
import { resolve, join, relative, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build, tokenList, toCss, toJson, report, contrast, ratioText, normHex, hexToRgb, rgbToHex, rgbToHsl, hslToRgb, jsonPath, ARCHETYPES } from './tokens.mjs';

const SKILL_DIR = resolve(fileURLToPath(new URL('..', import.meta.url)));
export const VERSION = 1;
const MODES = ['light', 'dark'];
const WHITE = '#ffffff', BLACK = '#000000';
const COLOR_INPUTS = ['accent', 'success', 'warning', 'danger', 'info'];
const SCALES = ['primary', 'neutral', ...COLOR_INPUTS];

// ---------- names ----------

/** `--color-action-primary-bg` is the role `action-primary-bg`; its variable key is `color/action/primary-bg`. */
export const roleKey = (role) => `color/${role.replace('-', '/')}`;
const SCALE_VAR = new RegExp(`^--color-(${SCALES.join('|')})-(\\d+)$`);

/** Component tier: each variable points at a role (or token) and follows it in every mode. */
export const COMPONENTS = [
  ['button/primary/bg', '--button-primary-bg', '--color-action-primary-bg'],
  ['button/primary/bg-hover', '--button-primary-bg-hover', '--color-action-primary-bg-hover'],
  ['button/primary/bg-pressed', '--button-primary-bg-pressed', '--color-action-primary-bg-pressed'],
  ['button/primary/text', '--button-primary-text', '--color-action-primary-text'],
  ['button/secondary/text', '--button-secondary-text', '--color-action-secondary-text'],
  ['button/secondary/border', '--button-secondary-border', '--color-action-secondary-border'],
  ['button/radius', '--button-radius', '--radius-control'],
  ['button/height', '--button-height', '--control-height-md'],
  ['button/padding-x', '--button-padding-x', '--density-control-x'],
  ['input/bg', '--input-bg', '--color-surface-default'],
  ['input/text', '--input-text', '--color-text-default'],
  ['input/border', '--input-border', '--color-border-strong'],
  ['input/border-focus', '--input-border-focus', '--color-border-focus'],
  ['input/radius', '--input-radius', '--radius-control'],
  ['input/height', '--input-height', '--control-height-md'],
  ['card/bg', '--card-bg', '--color-surface-raised'],
  ['card/border', '--card-border', '--color-border-default'],
  ['card/radius', '--card-radius', '--radius-lg'],
  ['card/shadow', '--card-shadow', '--shadow-1'],
  ['card/padding', '--card-padding', '--space-16'],
];
const COMPONENT_PAIRS = [
  ['button/primary/text', 'button/primary/bg', 4.5], ['button/primary/text', 'button/primary/bg-hover', 4.5], ['button/primary/text', 'button/primary/bg-pressed', 4.5],
  ['input/text', 'input/bg', 4.5], ['input/border', 'input/bg', 3], ['input/border-focus', 'input/bg', 3],
];
/** Khmer needs a taller line and no negative tracking: one number, used by `:lang(km)`. */
export const KHMER = { key: 'font/line-height/khmer', css: '--line-height-khmer', value: '1.6' };

function collectionOf(css) {
  if (/^--color-/.test(css)) return 'color';
  if (/^--(font-|line-height|measure)/.test(css)) return 'typography';
  if (/^--(space-|control-|size-target|density-|button-(height|padding)|input-height|card-padding)/.test(css)) return 'size-space';
  if (/^--(radius|border-width|r-|button-radius|input-radius|card-radius)/.test(css)) return 'shape';
  if (/^--(shadow|z-|glass|glow|btn-gloss|card-shadow)/.test(css)) return 'elevation';
  if (/^--(duration|ease)/.test(css)) return 'motion';
  return 'size-space';
}
function scopesOf(css, tier) {
  if (/^--color-/.test(css) || /^--(button|input|card)-.*(bg|text|border)/.test(css)) {
    if (SCALE_VAR.test(css) || css === '--color-brand') return ['fill', 'stroke', 'text'];
    if (/(^|-)text(-|$)/.test(css)) return ['text'];
    if (/(^|-)border(-|$)/.test(css)) return ['stroke'];
    if (/(surface|bg)/.test(css)) return ['fill'];
    return ['fill', 'stroke', 'text'];
  }
  if (/radius|^--r-/.test(css)) return ['radius'];
  if (/^--font-size/.test(css)) return ['font-size'];
  if (/^--(space-|density-|control-|size-target|button-(height|padding)|input-height|card-padding)/.test(css)) return ['gap', 'size'];
  if (/shadow|glass|glow|gloss/.test(css)) return ['effect'];
  if (/^--z-/.test(css)) return ['layer'];
  if (/^--(duration|ease)/.test(css)) return ['motion'];
  return ['all'];
}
const figmaType = (dtcg) => (dtcg === 'color' ? 'COLOR' : ['dimension', 'number', 'fontWeight', 'duration'].includes(dtcg) ? 'FLOAT' : 'STRING');

// ---------- state, build, model ----------

/** state = { name, why, inputs: {primary, accent, ..., archetype, font, modern}, overrides: { variable: {value} | {light, dark} } } */
const aliasRef = (v) => { const m = /^\{([^}]+)\}$/.exec(String(v).trim()); return m ? m[1] : null; };

function parseBlock(css, header) {
  const i = css.indexOf(`${header} {`);
  const out = new Map();
  if (i < 0) return out;
  const body = css.slice(i, css.indexOf('\n}', i));
  for (const m of body.matchAll(/(--[\w-]+):\s*([^;]+);/g)) out.set(m[1], m[2].trim());
  return out;
}

function ink(b) { return { ref: 'color.neutral.900', hex: b.scales.neutral.scale[900] }; }
function refToHex(b, ref) {
  const [, scale, step] = ref.split('.');
  const hex = b.scales[scale]?.scale?.[step];
  if (!hex) throw new Error(`${ref.replace(/\./g, '/')} is not a colour variable`);
  return hex;
}
/** Role by variable key: `color/text/muted` is the role text-muted. */
function roleByKey(b, key) { return Object.keys(b.roles.light).find((r) => roleKey(r) === key); }

function applyOverrides(b, overrides) {
  const held = new Set(); // `role|mode` the user set: never recomputed
  for (const [key, o] of Object.entries(overrides)) {
    const sm = /^color\/(\w+)\/(\d+)$/.exec(key);
    if (sm && b.scales[sm[1]] && b.scales[sm[1]].scale[sm[2]]) b.scales[sm[1]].scale[sm[2]] = normHex(o.value);
  }
  for (const m of MODES) for (const r of Object.values(b.roles[m])) if (r.ref) r.hex = refToHex(b, r.ref);
  for (const [key, o] of Object.entries(overrides)) {
    const role = roleByKey(b, key);
    if (role) {
      for (const m of MODES) {
        const v = o[m] ?? o.value;
        if (v == null) continue;
        const al = aliasRef(v);
        const entry = al ? { ref: al.replace(/\//g, '.'), hex: refToHex(b, al.replace(/\//g, '.')) } : { ref: null, hex: normHex(v) };
        b.roles[m][role] = entry;
        if (role === 'action-primary-bg' && b.roles[m]['surface-brand']) b.roles[m]['surface-brand'] = entry;
        if (role === 'action-primary-text' && b.roles[m]['text-on-brand']) b.roles[m]['text-on-brand'] = entry;
        held.add(`${role}|${m}`);
      }
      continue;
    }
    const tk = tokenList(b).find((t) => jsonPath(t).join('/') === key);
    if (tk) { const v = o.value; b.overrides[tk.name] = { css: v, json: v }; }
  }
  rederiveOn(b, held);
}

/** Text that sits on a filled colour is derived: when its fill changes and the text no longer reaches 4.5:1, pick the best of white, the ink or black. */
function rederiveOn(b, held) {
  const groups = [['action-primary-text', ['action-primary-bg', 'action-primary-bg-hover', 'action-primary-bg-pressed']], ['accent-text-on', ['accent-bg']], ...['success', 'warning', 'danger', 'info'].map((k) => [`${k}-text-on`, [`${k}-bg`]])];
  for (const m of MODES) {
    const R = b.roles[m];
    for (const [fg, bgs] of groups) {
      if (!R[fg] || held.has(`${fg}|${m}`) || bgs.some((x) => !R[x])) continue;
      const min = (hex) => Math.min(...bgs.map((x) => contrast(hex, R[x].hex)));
      if (min(R[fg].hex) >= 4.5) continue;
      const best = [{ ref: null, hex: WHITE }, ink(b), { ref: null, hex: BLACK }].filter((c) => min(c.hex) >= 4.5).sort((p, q) => min(q.hex) - min(p.hex))[0];
      if (!best) continue;
      R[fg] = best;
      if (fg === 'action-primary-text' && R['text-on-brand']) R['text-on-brand'] = best;
    }
  }
}

export function makeBuild(state) {
  const i = state.inputs;
  const b = build({ primary: i.primary, accent: i.accent, neutral: i.neutral, success: i.success, warning: i.warning, danger: i.danger, info: i.info, archetype: i.archetype, font: i.font, modern: !!i.modern });
  b.overrides = {};
  applyOverrides(b, state.overrides ?? {});
  return b;
}

function componentCss(state, keyOfCss, comp) {
  return comp.map(([key, css, to]) => {
    const o = state.overrides?.[key]?.value;
    const al = o != null ? aliasRef(o) : null;
    const target = al ? [...keyOfCss].find(([, k]) => k === al)?.[0] ?? to : to;
    return `  ${css}: ${o != null && !al ? o : `var(${target})`};`;
  });
}

/** tokens.css: the standard token file plus the component tier and the Khmer line. */
export function makeCss(state, b = makeBuild(state)) {
  const base = toCss(b);
  const keyOfCss = cssKeys(b);
  const extra = ['', '/* Component variables point at the roles above, so one change reaches every component in light and dark. */', ':root {', ...componentCss(state, keyOfCss, COMPONENTS), `  ${KHMER.css}: ${state.overrides?.[KHMER.key]?.value ?? KHMER.value};`, '}', '',
    '/* Khmer needs a taller line and no negative letter-spacing. */', ':lang(km) {', '  letter-spacing: 0;', `  line-height: var(${KHMER.css});`, '}', ''];
  return base.replace(/^\/\* Design tokens/, '/* Design tokens (generated from variables.json: do not edit by hand)').trimEnd() + '\n' + extra.join('\n');
}

function cssKeys(b) {
  const keyOf = new Map();
  const tks = new Map(tokenList(b).map((t) => [`--${t.name}`, t]));
  const root = parseBlock(toCss(b), ':root');
  for (const name of root.keys()) keyOf.set(name, tks.has(name) ? jsonPath(tks.get(name)).join('/') : roleKey(name.slice('--color-'.length)));
  return keyOf;
}

/** The full variable model: key -> { type, tier, collection, scopes, hidden, cssName, value | values{light,dark}, description }. */
export function makeModel(state, b = makeBuild(state)) {
  const css = toCss(b);
  const root = parseBlock(css, ':root'), dark = parseBlock(css, ':root[data-theme="dark"]');
  const tks = new Map(tokenList(b).map((t) => [`--${t.name}`, t]));
  const keyOf = cssKeys(b);
  const toVal = (v) => { const m = /^var\((--[\w-]+)\)$/.exec(v); return m && keyOf.has(m[1]) ? `{${keyOf.get(m[1])}}` : v; };
  const vars = {};
  for (const [name, light] of root) {
    const tk = tks.get(name), key = keyOf.get(name);
    const l = toVal(light), d = dark.has(name) ? toVal(dark.get(name)) : l;
    const isRole = !tk;
    const tier = isRole || aliasRef(l) ? 'semantic' : 'primitive';
    const v = { type: isRole ? 'COLOR' : figmaType(tk.type), tier, collection: collectionOf(name), scopes: scopesOf(name, tier) };
    if (!isRole) v.dtcg = tk.type;
    if (tier === 'primitive' && SCALE_VAR.test(name)) v.hidden = true;
    if (tk?.desc) v.description = tk.desc;
    v.codeSyntax = { web: name };
    if (l === d) v.value = l; else v.values = { light: l, dark: d };
    vars[key] = v;
  }
  for (const [key, cssName, to] of COMPONENTS) {
    const target = keyOf.get(to), tk = vars[target];
    const o = state.overrides?.[key]?.value;
    const val = o != null ? o : `{${target}}`;
    vars[key] = { type: tk.type, tier: 'component', collection: collectionOf(cssName), scopes: scopesOf(cssName, 'component'), codeSyntax: { web: cssName }, value: val };
    if (tk.dtcg) vars[key].dtcg = tk.dtcg;
  }
  vars[KHMER.key] = { type: 'FLOAT', tier: 'primitive', collection: 'typography', scopes: ['font-size'], dtcg: 'number', codeSyntax: { web: KHMER.css }, description: 'Line height for Khmer text; :lang(km) also sets letter-spacing to 0.', value: state.overrides?.[KHMER.key]?.value ?? KHMER.value };
  return vars;
}

/** Resolve every alias, per mode. Returns { res: Map(key -> {light, dark}), problems: [string] }. */
export function resolveModel(vars) {
  const res = new Map(), problems = [];
  const get = (key, mode, seen) => {
    const v = vars[key];
    if (!v) return { err: `${key} does not exist` };
    const raw = v.values ? v.values[mode] : v.value;
    const al = aliasRef(raw);
    if (!al) return { val: String(raw) };
    if (seen.includes(al)) return { err: `alias cycle: ${[...seen, al].join(' -> ')}` };
    if (!vars[al]) return { err: `${key} points at ${al}, which does not exist` };
    return get(al, mode, [...seen, al]);
  };
  for (const key of Object.keys(vars)) {
    const r = {};
    for (const m of MODES) {
      const x = get(key, m, [key]);
      if (x.err) { if (!problems.includes(x.err)) problems.push(x.err); } else r[m] = x.val;
    }
    res.set(key, r);
  }
  return { res, problems };
}

export function evalPairs(vars, b) {
  const { res } = resolveModel(vars);
  const pairs = [...b.pairs.map((p) => [roleKey(p.fg), roleKey(p.bg), p.need]), ...COMPONENT_PAIRS];
  const rows = [], failing = [];
  for (const [fg, bg, need] of pairs) {
    const row = { fg, bg, need };
    for (const m of MODES) {
      const f = res.get(fg)?.[m], g = res.get(bg)?.[m];
      row[m] = f && g && /^#/.test(f) && /^#/.test(g) ? contrast(f, g) : null;
      if (row[m] != null && row[m] < need) failing.push({ fg, bg, mode: m, ratio: row[m], need });
    }
    rows.push(row);
  }
  return { rows, failing };
}

export function evaluate(state) {
  const b = makeBuild(state);
  const vars = makeModel(state, b);
  const { problems } = resolveModel(vars);
  const { rows, failing } = evalPairs(vars, b);
  return { b, vars, problems, rows, failing };
}

// ---------- files ----------

const GEN = 'Generated by the design-system skill from variables.json. Change a value with the variables engine (set), never by hand.';
export function variablesJson(state, vars) {
  return JSON.stringify({
    $description: GEN, version: VERSION, name: state.name, archetype: state.inputs.archetype ?? 'calm-workspace',
    modes: { color: MODES, elevation: MODES, others: ['default'] },
    source: { inputs: state.inputs, overrides: state.overrides ?? {} },
    variables: vars,
  }, null, 2) + '\n';
}
function generated(state, ev) {
  return { 'variables.json': variablesJson(state, ev.vars), 'tokens.css': makeCss(state, ev.b), 'design-tokens.json': JSON.stringify(toJson(ev.b), null, 2) + '\n' };
}
function readState(dir) {
  const f = join(dir, 'variables.json');
  if (!existsSync(f)) throw new Error(`${f} does not exist; run init first`);
  const j = JSON.parse(readFileSync(f, 'utf8'));
  if (!j.source?.inputs) throw new Error('variables.json has no source; it was not written by this engine');
  return { name: j.name, why: j.why ?? '', inputs: j.source.inputs, overrides: j.source.overrides ?? {} };
}
const today = () => new Date().toISOString().slice(0, 10);

// ---------- commands ----------

export function parseBrief(text) {
  const get = (k) => new RegExp(`^[-*]?\\s*${k}\\s*:\\s*(.+)$`, 'im').exec(text)?.[1].trim();
  const o = {};
  const colour = get('Brand colou?r');
  if (colour && /^#[0-9a-f]{3,6}$/i.test(colour.split(/\s/)[0])) o.primary = colour.split(/\s/)[0];
  const arch = get('Archetype')?.split(/\s/)[0];
  if (arch && ARCHETYPES[arch]) o.archetype = arch;
  const font = get('Font');
  if (font && !/^(system|none|default)/i.test(font)) o.font = font.replace(/[,.].*$/, '').trim();
  if (/^(yes|true|modern)/i.test(get('Modern effects') ?? '')) o.modern = true;
  const product = get('Product');
  if (product) o.name = product;
  return o;
}

export function parseArgv(argv) {
  const o = { _: [] }, BOOL = new Set(['force', 'modern', 'dry-run']);
  const OPTIONS = new Set([...BOOL, 'dir', 'brief', 'primary', 'accent', 'neutral', 'success', 'warning', 'danger', 'info', 'archetype', 'font', 'name', 'why', 'mode', 'code', 'open']);
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    // `--color-brand` is a variable name, not an option: after set or explain, an unknown --name is a positional.
    if (!a.startsWith('--') || (['set', 'explain'].includes(o._[0]) && o._.length < 2 && !OPTIONS.has(a.slice(2)))) { o._.push(a); continue; }
    const k = a.slice(2);
    if (BOOL.has(k)) o[k] = true; else { o[k] = argv[i + 1]; i++; }
  }
  return o;
}

function dirOf(o, cwd) {
  const d = resolve(cwd, o.dir ?? 'design');
  if (d === SKILL_DIR || d.startsWith(SKILL_DIR + sep)) throw new Error(`the folder is inside the skill folder (${d}); pass --dir <the user's project>/design`);
  return d;
}

function writeAll(dir, state, ev) {
  mkdirSync(dir, { recursive: true });
  const g = generated(state, ev);
  for (const [f, text] of Object.entries(g)) writeFileSync(join(dir, f), text);
  return Object.keys(g);
}

export function cmdInit(o, cwd) {
  const dir = dirOf(o, cwd);
  if (existsSync(join(dir, 'variables.json')) && !o.force) throw new Error(`${join(dir, 'variables.json')} already exists; change values with set, or pass --force to start again`);
  const brief = o.brief ? parseBrief(readFileSync(resolve(cwd, o.brief), 'utf8')) : {};
  const inputs = { primary: o.primary ?? brief.primary, accent: o.accent, neutral: o.neutral, success: o.success, warning: o.warning, danger: o.danger, info: o.info, archetype: o.archetype ?? brief.archetype, font: o.font ?? brief.font, modern: !!(o.modern || brief.modern) };
  for (const k of Object.keys(inputs)) if (inputs[k] == null || inputs[k] === false) delete inputs[k];
  const state = { name: o.name ?? brief.name ?? 'Product', why: o.why ?? '', inputs, overrides: {} };
  const ev = evaluate(state);
  const files = [...writeAll(dir, state, ev), 'CHANGES.md', 'STATUS.md', 'design-system-report.md'];
  const md = report(ev.b, { name: state.name, why: state.why, path: 'd', files, open: o.open ? [o.open] : [] });
  writeFileSync(join(dir, 'design-system-report.md'), md);
  writeFileSync(join(dir, 'CHANGES.md'), `# Variable changes\n\nEvery change made with the variables engine, newest last.\n\n- ${today()} init: ${Object.keys(ev.vars).length} variables, ${ev.rows.length} contrast pairs checked in light and dark.\n`);
  writeFileSync(join(dir, 'STATUS.md'), `# Design status\n\n- step_completed: foundation (variables, tokens.css, design-tokens.json)\n- verified: ${ev.rows.length} contrast pairs pass in light and dark; ${Object.keys(ev.vars).length} variables, 0 broken aliases\n- files: ${files.join(', ')}\n- next_skill: ui-craft (build the first screen from design/tokens.css; component specs are a later step)\n- continue_with: "Build the <screen> from the design folder"\n- note: variables change only with the variables engine (set); tokens.css and design-tokens.json are generated.\n`);
  return { ev, md, dir, files, bad: ev.failing.length };
}

function valueFor(vars, key, raw) {
  const v = vars[key];
  const al = aliasRef(raw);
  if (v.type === 'COLOR') {
    if (al) { if (vars[al]?.type !== 'COLOR') throw new Error(`${al} is not a colour variable`); return raw.trim(); }
    return normHex(raw);
  }
  if (al) throw new Error(`${key} is not a colour: give a number, not another variable`);
  if (v.dtcg === 'dimension') { if (/^\d+(\.\d+)?$/.test(raw)) return `${raw}px`; if (/^\d+(\.\d+)?px$/.test(raw)) return raw; throw new Error(`${key} needs a pixel value such as 8px`); }
  if (v.dtcg === 'duration') { if (/^\d+ms$/.test(raw)) return raw; throw new Error(`${key} needs milliseconds such as 150ms`); }
  if (['number', 'fontWeight'].includes(v.dtcg)) { if (/^\d+(\.\d+)?$/.test(raw)) return raw; throw new Error(`${key} needs a number`); }
  throw new Error(`${key} cannot be changed with set in this version (type ${v.dtcg ?? v.type})`);
}

/** Return the new state for `set`, or throw. */
export function applySet(state, vars, keyArg, raw, mode) {
  const next = { ...state, inputs: { ...state.inputs }, overrides: { ...state.overrides } };
  const byCss = Object.entries(vars).find(([, v]) => v.codeSyntax?.web === keyArg)?.[0];
  const key = byCss ?? keyArg;
  const input = key === 'color/brand' ? 'primary' : /^color\/(accent|success|warning|danger|info)$/.test(key) ? key.slice(6) : null;
  if (input) { if (mode) throw new Error('a brand colour has no mode; it changes the whole scale'); next.inputs[input] = normHex(raw); return { next, key, input }; }
  if (key === 'font/family/sans') { next.inputs.font = raw; return { next, key, input: 'font' }; }
  const v = vars[key];
  if (!v) throw new Error(`no variable named ${keyArg}; run explain or open variables.json to see the names`);
  if (/^--(shadow-|glass-bg|glow$|btn-gloss)/.test(v.codeSyntax?.web ?? '') || /^--font-family/.test(v.codeSyntax?.web ?? '')) throw new Error(`${key} is derived from the brand colour or the style; change color/brand (or the font with font/family/sans) instead`);
  if (v.tier === 'semantic' && v.type === 'COLOR') {
    if (mode && ![...MODES, 'both'].includes(mode)) throw new Error('--mode is light, dark or both');
    const val = valueFor(vars, key, raw), cur = next.overrides[key] ? { ...next.overrides[key] } : {};
    for (const m of mode === 'both' ? MODES : [mode ?? 'light']) cur[m] = val;
    delete cur.value;
    next.overrides[key] = cur;
    return { next, key, note: mode ? '' : ' Light mode only: dark mode keeps its value; add --mode dark (or --mode both) to change it too.' };
  }
  if (mode) throw new Error(`${key} has one value in every mode; leave out --mode`);
  next.overrides[key] = { value: valueFor(vars, key, raw) };
  return { next, key };
}

function snapshot(vars) {
  const { res } = resolveModel(vars);
  return res;
}
function changedKeys(before, after) {
  return [...after.keys()].filter((k) => JSON.stringify(before.get(k)) !== JSON.stringify(after.get(k)));
}

function suggest(state, vars, keyArg, raw, mode) {
  if (!/^#?[0-9a-f]{3,6}$/i.test(raw)) return null;
  const [h, s, l] = rgbToHsl(hexToRgb(raw));
  for (let d = 1; d <= 60; d++) for (const sg of [1, -1]) {
    const L = l + (sg * d) / 100;
    if (L < 0 || L > 1) continue;
    const cand = rgbToHex(hslToRgb(h, s, L));
    try { const { next } = applySet(state, vars, keyArg, cand, mode); const ev = evaluate(next); if (!ev.failing.length && !ev.problems.length) return cand; } catch { /* try the next one */ }
  }
  return null;
}

export function cmdSet(o, cwd) {
  const dir = dirOf(o, cwd);
  const [keyArg, raw] = o._.slice(1);
  if (!keyArg || raw == null) throw new Error('usage: set <variable> <value> [--mode light|dark] [--dry-run]');
  const state = readState(dir), before = evaluate(state);
  const { next, key, note = '' } = applySet(state, before.vars, keyArg, String(raw), o.mode);
  let after;
  try { after = evaluate(next); } catch (e) { return { ok: false, text: `REFUSED: ${key} = ${raw} cannot be built (${e.message}). Nothing was written.${hint(state, before.vars, keyArg, raw, o.mode)}` }; }
  if (after.problems.length || after.failing.length) {
    const lines = [...after.problems.map((p) => `- ${p}`), ...after.failing.map((f) => `- ${f.fg} on ${f.bg} in ${f.mode}: ${ratioText(f.ratio)}, needs ${f.need}:1`)];
    return { ok: false, text: `REFUSED: ${key} = ${raw} would break ${lines.length} check${lines.length === 1 ? '' : 's'}. Nothing was written.\n${lines.join('\n')}${hint(state, before.vars, keyArg, raw, o.mode)}` };
  }
  const changed = changedKeys(snapshot(before.vars), snapshot(after.vars));
  const warn = /^(space\/|font\/size\/)/.test(key) ? `\nNote: ${raw} is off the standard scale of this skill (spacing 0, 4, 8, 12, 16, 24, 32, 48, 64 px; font sizes 12 to 48 px).` : '';
  const follow = changed.filter((k) => k !== key);
  const text = `${o['dry-run'] ? 'DRY RUN, nothing written. ' : ''}${key} = ${raw}${o.mode ? ` (${o.mode})` : ''}: 1 variable set, ${follow.length} value${follow.length === 1 ? '' : 's'} follow${follow.length === 1 ? 's' : ''}${follow.length ? ` (${follow.slice(0, 8).join(', ')}${follow.length > 8 ? ', ...' : ''})` : ''}. ${after.rows.length} contrast pairs checked in light and dark: all pass.${note}${warn}`;
  if (!o['dry-run']) {
    writeAll(dir, next, after);
    appendFileSync(join(dir, 'CHANGES.md'), `- ${today()} set ${key}${o.mode ? ` (${o.mode})` : ''} = ${raw}: ${follow.length} values follow, ${after.rows.length} pairs pass.\n`);
  }
  return { ok: true, text, changed };
}
function hint(state, vars, keyArg, raw, mode) {
  const s = suggest(state, vars, keyArg, raw, mode);
  return s ? `\nNearest value that passes every check: ${s}` : '\nNo nearby value passes; change the colour it sits on, or pick another colour.';
}

// ---------- check and explain ----------

const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', 'design', '.harness', 'runs', 'coverage', '.next']);
const WEB_EXT = new Set(['.css', '.scss', '.less', '.html', '.htm', '.vue', '.svelte', '.jsx', '.tsx']);
function* walk(dir) {
  for (const n of readdirSync(dir)) {
    if (SKIP_DIRS.has(n)) continue;
    const p = join(dir, n), st = statSync(p);
    if (st.isDirectory()) yield* walk(p); else if (WEB_EXT.has(extname(n))) yield p;
  }
}
const scopeClass = (prop) => (/^(color|caret-color|text-decoration-color|-webkit-text-fill-color)$/.test(prop) ? 'text' : /^(background|background-color|fill)$/.test(prop) ? 'fill' : /^(border|outline|stroke)(-[\w-]*color)?$|^border-(top|right|bottom|left)(-color)?$|^outline-color$/.test(prop) ? 'stroke' : null);

/** Raw colours and pixel values in web code, and a variable used for the wrong job. Reports only; it never edits. */
export function scanCode(folder, vars) {
  const { res } = resolveModel(vars);
  const byCss = new Map(Object.entries(vars).map(([k, v]) => [v.codeSyntax?.web, k]));
  const lightHex = new Map();
  for (const [k, r] of res) if (/^#/.test(r.light ?? '')) { const a = lightHex.get(r.light.toLowerCase()) ?? []; a.push(k); lightHex.set(r.light.toLowerCase(), a); }
  const findings = [];
  const suggestFor = (hex, cls) => {
    const ks = lightHex.get(hex.toLowerCase()) ?? [];
    const pick = ks.find((k) => vars[k].tier === 'semantic' && (!cls || vars[k].scopes.includes(cls))) ?? ks.find((k) => !cls || vars[k].scopes.includes(cls));
    return pick ? `use ${vars[pick].codeSyntax.web}` : 'no variable has this value; add one or choose the nearest variable';
  };
  for (const file of walk(folder)) {
    const lines = readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, i) => {
      const where = `${relative(folder, file)}:${i + 1}`;
      for (const m of line.matchAll(/([a-z-]+)\s*:\s*([^;{}]+)/gi)) {
        const prop = m[1].toLowerCase(), val = m[2];
        if (prop.startsWith('--')) continue;
        const cls = scopeClass(prop);
        for (const h of val.matchAll(/#[0-9a-f]{6}\b|#[0-9a-f]{3}\b/gi)) {
          if (cls || /shadow/.test(prop)) findings.push({ where, kind: 'raw colour', text: `${prop}: ${h[0]}`, fix: suggestFor(h[0].length === 4 ? `#${[...h[0].slice(1)].map((c) => c + c).join('')}` : h[0], cls) });
        }
        if (/^(border-radius|font-size)$/.test(prop)) for (const px of val.matchAll(/(?<![\w-])\d+(?:\.\d+)?px/g)) findings.push({ where, kind: 'raw size', text: `${prop}: ${px[0]}`, fix: prop === 'border-radius' ? 'use a --radius-* variable' : 'use a --font-size-* variable' });
        for (const v of val.matchAll(/var\((--[\w-]+)/g)) {
          const key = byCss.get(v[1]);
          if (key && cls && !vars[key].scopes.includes(cls)) findings.push({ where, kind: 'wrong scope', text: `${prop}: var(${v[1]})`, fix: `${v[1]} is for ${vars[key].scopes.join(', ')}, not ${cls}` });
        }
      }
    });
  }
  return findings;
}

export function cmdCheck(o, cwd) {
  const dir = dirOf(o, cwd);
  const state = readState(dir), ev = evaluate(state);
  const lines = [], problems = [];
  const g = generated(state, ev);
  for (const [f, text] of Object.entries(g)) {
    const p = join(dir, f);
    if (!existsSync(p) || readFileSync(p, 'utf8') !== text) problems.push(`DRIFT: ${f} is not what variables.json generates (edited by hand?). Run build to write it again; hand edits are lost.`);
  }
  for (const p of ev.problems) problems.push(`ALIAS: ${p}`);
  for (const f of ev.failing) problems.push(`CONTRAST: ${f.fg} on ${f.bg} in ${f.mode}: ${ratioText(f.ratio)}, needs ${f.need}:1`);
  lines.push(`${Object.keys(ev.vars).length} variables (${Object.values(ev.vars).filter((v) => v.tier === 'primitive').length} primitive, ${Object.values(ev.vars).filter((v) => v.tier === 'semantic').length} semantic, ${Object.values(ev.vars).filter((v) => v.tier === 'component').length} component); ${ev.problems.length} broken aliases or cycles.`);
  lines.push(`${ev.rows.length} contrast pairs checked in light and dark: ${ev.failing.length ? `${ev.failing.length} below the minimum` : 'all pass'}.`);
  if (o.code) {
    const folder = resolve(cwd, o.code);
    const found = scanCode(folder, ev.vars);
    lines.push(`Code in ${o.code} (web files only, report only, nothing is changed): ${found.length} finding${found.length === 1 ? '' : 's'}.`);
    for (const f of found.slice(0, 40)) lines.push(`- ${f.where}  ${f.kind}  ${f.text}  -> ${f.fix}`);
    if (found.length > 40) lines.push(`- and ${found.length - 40} more`);
  }
  lines.push(...problems);
  lines.push(problems.length ? `CHECK FAILED: ${problems.length} problem${problems.length === 1 ? '' : 's'}.` : 'CHECK PASSED.');
  return { ok: !problems.length, text: lines.join('\n') };
}

export function cmdExplain(o, cwd) {
  const dir = dirOf(o, cwd);
  const keyArg = o._[1];
  if (!keyArg) throw new Error('usage: explain <variable>');
  const state = readState(dir), ev = evaluate(state);
  const byCss = Object.entries(ev.vars).find(([, v]) => v.codeSyntax?.web === keyArg)?.[0];
  const key = byCss ?? keyArg, v = ev.vars[key];
  if (!v) throw new Error(`no variable named ${keyArg}`);
  const { res } = resolveModel(ev.vars);
  const L = [`${key}  (${v.tier}, ${v.type}, scope ${v.scopes.join('/')}, ${v.codeSyntax.web})`];
  for (const m of MODES) {
    const raw = v.values ? v.values[m] : v.value;
    L.push(`  ${m}: ${raw}${aliasRef(raw) ? ` -> ${res.get(key)?.[m]}` : ''}`);
  }
  const direct = Object.entries(ev.vars).filter(([, x]) => [x.value, ...Object.values(x.values ?? {})].some((r) => aliasRef(r) === key)).map(([k]) => k);
  const all = new Set(direct);
  for (let n = 0; n < 5; n++) for (const [k, x] of Object.entries(ev.vars)) if ([x.value, ...Object.values(x.values ?? {})].some((r) => all.has(aliasRef(r)))) all.add(k);
  L.push(`Used directly by ${direct.length}: ${direct.slice(0, 12).join(', ') || 'nothing'}${direct.length > 12 ? ', ...' : ''}`);
  L.push(`Changing it moves ${all.size} variable${all.size === 1 ? '' : 's'} in total.`);
  if (o.code) {
    const uses = [];
    for (const file of walk(resolve(cwd, o.code))) readFileSync(file, 'utf8').split('\n').forEach((line, i) => { if (line.includes(`var(${v.codeSyntax.web}`)) uses.push(`${relative(resolve(cwd, o.code), file)}:${i + 1}`); });
    L.push(`Used in code: ${uses.length}${uses.length ? ` (${uses.slice(0, 10).join(', ')}${uses.length > 10 ? ', ...' : ''})` : ''}`);
  }
  return { ok: true, text: L.join('\n') };
}

export function cmdBuild(o, cwd) {
  const dir = dirOf(o, cwd);
  const state = readState(dir), ev = evaluate(state);
  if (ev.failing.length || ev.problems.length) return { ok: false, text: `Not written: ${ev.failing.length + ev.problems.length} check(s) fail; run check.` };
  writeAll(dir, state, ev);
  return { ok: true, text: `Wrote variables.json, tokens.css and design-tokens.json again in ${relative(cwd, dir) || '.'}.` };
}

export function main(argv, cwd = process.cwd()) {
  const o = parseArgv(argv), cmd = o._[0];
  if (cmd === 'init') { const r = cmdInit(o, cwd); return { code: r.bad ? 1 : 0, out: `${r.md}\n---\nFiles written to ${r.dir}. Reply to the user with the report above, word for word, and nothing before or after it. Then stop: the next step is in STATUS.md.` }; }
  const fn = { set: cmdSet, check: cmdCheck, explain: cmdExplain, build: cmdBuild }[cmd];
  if (!fn) throw new Error('commands: init, set, check, explain, build');
  const r = fn(o, cwd);
  return { code: r.ok ? 0 : 1, out: r.text };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const r = main(process.argv.slice(2));
    console.log(r.out);
    process.exit(r.code);
  } catch (e) {
    console.error(`design-system variables engine: ${e.message}`);
    process.exit(2);
  }
}
