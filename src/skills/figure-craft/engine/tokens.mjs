/**
 * figure-craft colour tokens: one light and one dark set, emitted as CSS custom properties.
 * Node 24 ESM, stdlib only, zero deps.
 * @governed-by PO_ARCHITECT
 */

const KEYS = ['bg', 'surface', 'surface2', 'line', 'lineStrong', 'fg', 'muted', 'faint', 'ok', 'warn', 'danger',
  'isoTop', 'isoA', 'isoB', 'isoInk', 'isoInkTop', 'isoInkA', 'isoInkB'];

export const TOKENS = Object.freeze({
  light: Object.freeze({
    bg: '#f7f6f2', surface: '#ffffff', surface2: '#efede6', line: '#d9d5ca', lineStrong: '#8f8a7c',
    fg: '#1d1c19', muted: '#5c5850', faint: '#8a857a', ok: '#2f8f5b', warn: '#b7791f', danger: '#c0392b',
    isoTop: '#ffffff', isoA: '#e6e2d8', isoB: '#cfc9bb', isoInk: '#2b2a27', isoInkTop: '#4a4843', isoInkA: '#33312d', isoInkB: '#22211e',
  }),
  dark: Object.freeze({
    bg: '#141413', surface: '#1d1c1a', surface2: '#262522', line: '#3a3833', lineStrong: '#77736a',
    fg: '#f1efe8', muted: '#b3aea2', faint: '#8a857a', ok: '#4fbf83', warn: '#e0a84a', danger: '#e5675a',
    isoTop: '#3b3934', isoA: '#2d2b27', isoB: '#22211e', isoInk: '#e8e4da', isoInkTop: '#f6f3ec', isoInkA: '#d6d1c5', isoInkB: '#bdb7a9',
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
