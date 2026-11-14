/**
 * figure-craft colour tokens: one light and one dark set, emitted as CSS custom properties.
 * Node 24 ESM, stdlib only, zero deps.
 * @governed-by PO_ARCHITECT
 */

const TINTS = ['Blue', 'Red', 'Green', 'Amber'];
const KEYS = ['bg', 'surface', 'surface2', 'line', 'lineStrong', 'fg', 'muted', 'faint', 'ok', 'warn', 'danger',
  'isoTop', 'isoA', 'isoB', 'isoInk', 'isoInkTop', 'isoInkA', 'isoInkB',
  'matSteelTop', 'matSteelA', 'matSteelB', 'matWhiteTop', 'matWhiteA', 'matWhiteB',
  ...TINTS.flatMap((t) => [`mat${t}Top`, `mat${t}A`, `mat${t}B`]),
  'matCavity', 'matGlow', 'matGlass', 'matCopper', 'matCold', 'matWarm', 'matShadow', 'matShine'];

// Modern, quiet palette: near-white surfaces, low contrast between faces, hairline grey outlines.
export const TOKENS = Object.freeze({
  light: Object.freeze({
    bg: '#fafafa', surface: '#ffffff', surface2: '#f4f4f3', line: '#e6e6e3', lineStrong: '#a9a9a4',
    fg: '#1a1a19', muted: '#6b6b68', faint: '#9a9a96', ok: '#2f8f5b', warn: '#b7791f', danger: '#c0392b',
    isoTop: '#ffffff', isoA: '#f5f5f4', isoB: '#e8e8e6', isoInk: '#2b2b2a', isoInkTop: '#6a6a67', isoInkA: '#565654', isoInkB: '#434341',
    matSteelTop: '#f8f9fa', matSteelA: '#eceff1', matSteelB: '#d9dde1', matWhiteTop: '#ffffff', matWhiteA: '#fbfbfa', matWhiteB: '#eeeeec',
    matBlueTop: '#e2eef8', matBlueA: '#cfe2f3', matBlueB: '#b3cfe8', matRedTop: '#fae1da', matRedA: '#f4cdc2', matRedB: '#e8b0a1',
    matGreenTop: '#e0f1e3', matGreenA: '#cde6d2', matGreenB: '#b0d4b8', matAmberTop: '#fbf0d6', matAmberA: '#f5e3b8', matAmberB: '#e8cd8e',
    matCavity: '#dfe1e3', matGlow: '#fff3cf', matGlass: '#bcdaea', matCopper: '#c98f63', matCold: '#4f9fd3', matWarm: '#df7655', matShadow: '#1a1a19', matShine: '#ffffff',
  }),
  dark: Object.freeze({
    bg: '#141413', surface: '#1d1d1c', surface2: '#262625', line: '#383836', lineStrong: '#7a7a76',
    fg: '#f1f1ee', muted: '#b0b0ab', faint: '#8a8a86', ok: '#4fbf83', warn: '#e0a84a', danger: '#e5675a',
    isoTop: '#3a3a38', isoA: '#2f2f2e', isoB: '#252524', isoInk: '#e8e8e4', isoInkTop: '#d9d9d5', isoInkA: '#bdbdb8', isoInkB: '#a0a09c',
    matSteelTop: '#5b6066', matSteelA: '#4a4f54', matSteelB: '#3a3e42', matWhiteTop: '#4c4c4a', matWhiteA: '#414140', matWhiteB: '#343433',
    matBlueTop: '#3f5a73', matBlueA: '#334b61', matBlueB: '#283c4e', matRedTop: '#7a4a40', matRedA: '#663d35', matRedB: '#52312a',
    matGreenTop: '#3f6549', matGreenA: '#33543c', matGreenB: '#284330', matAmberTop: '#7a6534', matAmberA: '#66542b', matAmberB: '#524322',
    matCavity: '#1b1c1d', matGlow: '#ffe6a3', matGlass: '#6fa3bb', matCopper: '#d7935c', matCold: '#62b3e6', matWarm: '#ec8560', matShadow: '#000000', matShine: '#8d9399',
  }),
});

/** @param {string} k camelCase key @returns {string} kebab-case css variable name */
export function cssName(k) {
  if (typeof k !== 'string' || !k) throw new TypeError('cssName: key must be a non-empty string');
  return '--' + k.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/** @param {Record<string,string>} set */
function decls(set) {
  return KEYS.map((k) => `${cssName(k)}:${set[k]};`).join('');
}

/**
 * The same tokens scoped to one selector, so a standalone SVG carries its own colours.
 * Dark follows `[data-theme="dark"]` on any ancestor, or the system setting unless `[data-theme="light"]` is set.
 * @param {string} sel css selector of the figure root, e.g. ".fc-fig"
 */
export function tokensCssScoped(sel) {
  if (typeof sel !== 'string' || !/^[.#]?[\w-]+$/.test(sel)) throw new TypeError('tokensCssScoped: simple selector required');
  return `${sel}{${decls(TOKENS.light)}}` +
    `[data-theme="dark"] ${sel},${sel}[data-theme="dark"]{${decls(TOKENS.dark)}}` +
    `@media (prefers-color-scheme: dark){:root:not([data-theme="light"]) ${sel}:not([data-theme="light"]){${decls(TOKENS.dark)}}}`;
}

/**
 * CSS text: light on :root, dark on [data-theme="dark"] and under prefers-color-scheme dark.
 * @returns {string}
 */
export function tokensCss() {
  for (const mode of ['light', 'dark']) {
    for (const k of KEYS) if (typeof TOKENS[mode][k] !== 'string') throw new Error(`tokensCss: ${mode}.${k} missing`);
  }
  return `:root{${decls(TOKENS.light)}}\n` +
    `[data-theme="dark"]{${decls(TOKENS.dark)}}\n` +
    `@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){${decls(TOKENS.dark)}}}\n`;
}
