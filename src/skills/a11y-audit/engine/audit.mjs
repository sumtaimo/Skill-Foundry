#!/usr/bin/env node
/**
 * a11y-audit engine: lists structural accessibility problems in an HTML or JSX string, so the result
 * does not depend on an agent's eyes. Node.js standard library only, no dependencies.
 *
 *   node audit.mjs --file page.html          audit a file
 *   node audit.mjs --html "<button></button>" audit a string
 *   node audit.mjs -  < page.html             audit stdin (a here-document works)
 *   add --json for machine-readable output
 *
 * It finds what a search of the markup can find. It never claims conformance: the report ends with the
 * checks that need a manual test with assistive technology. It does not look at CSS, so it never reports
 * contrast, focus-ring style, spacing or target size.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const VERSION = '1.0.0';

/** One row per check: id, success criterion, its name, level, who is affected, default status, page-only. */
export const RULES = [
  ['html-lang', '3.1.1', 'Language of Page', 'A', ['screen reader'], 'failure', true],
  ['page-title', '2.4.2', 'Page Titled', 'A', ['screen reader'], 'failure', true],
  ['viewport-zoom', '1.4.4', 'Resize Text', 'AA', ['zoom'], 'failure', true],
  ['main-landmark', '2.4.1', 'Bypass Blocks', 'A', ['keyboard', 'screen reader'], 'failure', true],
  ['landmark-name', '1.3.1', 'Info and Relationships', 'A', ['screen reader'], 'advisory', false],
  ['heading-order', '1.3.1', 'Info and Relationships', 'A', ['screen reader'], 'advisory', false],
  ['heading-empty', '2.4.6', 'Headings and Labels', 'AA', ['screen reader'], 'failure', false],
  ['img-alt', '1.1.1', 'Non-text Content', 'A', ['screen reader'], 'failure', false],
  ['img-alt-bad', '1.1.1', 'Non-text Content', 'A', ['screen reader'], 'failure', false],
  ['control-name', '4.1.2', 'Name, Role, Value', 'A', ['screen reader', 'voice control'], 'failure', false],
  ['form-label', '3.3.2', 'Labels or Instructions', 'A', ['screen reader', 'voice control'], 'failure', false],
  ['label-orphan', '1.3.1', 'Info and Relationships', 'A', ['screen reader', 'voice control'], 'failure', false],
  ['required-state', '1.3.1', 'Info and Relationships', 'A', ['screen reader'], 'failure', false],
  ['error-link', '3.3.1', 'Error Identification', 'A', ['screen reader'], 'failure', false],
  ['autocomplete', '1.3.5', 'Identify Input Purpose', 'AA', ['keyboard', 'voice control'], 'failure', false],
  ['group-name', '1.3.1', 'Info and Relationships', 'A', ['screen reader'], 'failure', false],
  ['click-no-keyboard', '2.1.1', 'Keyboard', 'A', ['keyboard', 'voice control'], 'failure', false],
  ['link-no-href', '2.1.1', 'Keyboard', 'A', ['keyboard'], 'failure', false],
  ['tabindex-positive', '2.4.3', 'Focus Order', 'A', ['keyboard'], 'failure', false],
  ['native-element', '4.1.2', 'Name, Role, Value', 'A', ['keyboard', 'screen reader'], 'advisory', false],
  ['redundant-role', '4.1.2', 'Name, Role, Value', 'A', ['screen reader'], 'advisory', false],
  ['aria-hidden-focusable', '4.1.2', 'Name, Role, Value', 'A', ['keyboard', 'screen reader'], 'failure', false],
  ['aria-invalid-use', '4.1.2', 'Name, Role, Value', 'A', ['screen reader'], 'failure', false],
  ['aria-ref-missing', '1.3.1', 'Info and Relationships', 'A', ['screen reader'], 'failure', false],
  ['aria-label-ignored', '4.1.2', 'Name, Role, Value', 'A', ['screen reader'], 'advisory', false],
  ['aria-state-missing', '4.1.2', 'Name, Role, Value', 'A', ['screen reader'], 'failure', false],
  ['dialog-name', '4.1.2', 'Name, Role, Value', 'A', ['screen reader'], 'failure', false],
  ['status-message', '4.1.3', 'Status Messages', 'AA', ['screen reader'], 'failure', false],
  ['link-purpose', '2.4.4', 'Link Purpose (In Context)', 'A', ['screen reader', 'voice control'], 'failure', false],
  ['label-in-name', '2.5.3', 'Label in Name', 'A', ['voice control'], 'failure', false],
  ['table-header', '1.3.1', 'Info and Relationships', 'A', ['screen reader'], 'failure', false],
  ['video-captions', '1.2.2', 'Captions (Prerecorded)', 'A', ['deaf or hard-of-hearing'], 'failure', false],
  ['audio-transcript', '1.2.1', 'Audio-only and Video-only (Prerecorded)', 'A', ['deaf or hard-of-hearing'], 'failure', false],
  ['media-autoplay', '1.4.2', 'Audio Control', 'A', ['screen reader'], 'failure', false],
  ['iframe-title', '4.1.2', 'Name, Role, Value', 'A', ['screen reader'], 'failure', false],
  ['nested-interactive', '4.1.2', 'Name, Role, Value', 'A', ['keyboard', 'screen reader'], 'failure', false],
  ['focus-trap', '2.1.2', 'No Keyboard Trap', 'A', ['keyboard'], 'failure', false],
  ['duplicate-id', '1.3.1', 'Info and Relationships', 'A', ['screen reader', 'voice control'], 'failure', false],
].map(([id, sc, scName, level, who, status, pageOnly]) => ({ id, sc, scName, level, who, status, pageOnly }));
const RULE = Object.fromEntries(RULES.map((r) => [r.id, r]));

const VOID = new Set('area base br col embed hr img input link meta param source track wbr'.split(' '));
const ROLES = new Set(`alert alertdialog application article banner blockquote button caption cell checkbox code columnheader combobox complementary contentinfo definition deletion dialog directory document emphasis feed figure form generic grid gridcell group heading img insertion link list listbox listitem log main marquee math meter menu menubar menuitem menuitemcheckbox menuitemradio navigation none note option paragraph presentation progressbar radio radiogroup region row rowgroup rowheader scrollbar search searchbox separator slider spinbutton status strong subscript superscript switch tab table tablist tabpanel term textbox time timer toolbar tooltip tree treegrid treeitem`.split(/\s+/));
const ARIA = new Set(`activedescendant atomic autocomplete braillelabel brailleroledescription busy checked colcount colindex colindextext colspan controls current describedby description details disabled dropeffect errormessage expanded flowto grabbed haspopup hidden invalid keyshortcuts label labelledby level live modal multiline multiselectable orientation owns placeholder posinset pressed readonly relevant required roledescription rowcount rowindex rowindextext rowspan selected setsize sort valuemax valuemin valuenow valuetext`.split(/\s+/));
const NATIVE_ROLE = { button: 'button', link: 'a', checkbox: 'input', radio: 'input', textbox: 'input', heading: 'h2', navigation: 'nav', main: 'main', banner: 'header', contentinfo: 'footer', table: 'table', article: 'article', form: 'form', complementary: 'aside', option: 'option', progressbar: 'progress', combobox: 'select' };
const GENERIC = new Set(['div', 'span', 'p', 'li', 'td', 'section', 'b', 'i', 'em', 'strong', 'small', 'label', 'a']);
const NAMED_ROLES = new Set(['button', 'link', 'menuitem', 'tab', 'switch', 'checkbox', 'radio', 'option', 'treeitem', 'slider', 'spinbutton', 'menuitemcheckbox', 'menuitemradio']);
const GENERIC_LINKS = new Set(['click here', 'here', 'read more', 'more', 'learn more', 'link', 'this link', 'details', 'more info', 'more information', 'click', 'see more', 'view more']);
const HINTS = ['close', 'search', 'menu', 'delete', 'remove', 'edit', 'save', 'next', 'previous', 'prev', 'back', 'add', 'settings', 'cart', 'home', 'share', 'download', 'play', 'pause', 'cancel', 'submit', 'filter', 'refresh'];
const MANUAL_ALWAYS = [
  'Keyboard only: press Tab through the whole input; every control is reachable, the order follows the reading order and focus is never trapped (SC 2.1.1, 2.1.2, 2.4.3).',
  'Screen reader pass (for example NVDA with Firefox, VoiceOver with Safari): names, roles, states and headings are spoken as expected (SC 4.1.2, 1.3.1).',
  'Voice control pass (for example Voice Control or Dragon): say each visible label and check that it activates the control (SC 2.5.3).',
  'Zoom and reflow: set the browser to 200% and to 400% at 1280 CSS px wide (about 320 CSS px); no content is lost and nothing needs two-way scrolling (SC 1.4.4, 1.4.10).',
];

// ---------------------------------------------------------------- parser
/** Parse HTML or JSX into a tolerant element tree. */
export function parse(src) {
  const nl = []; for (let i = 0; i < src.length; i++) if (src[i] === '\n') nl.push(i);
  const lineAt = (p) => { let lo = 0, hi = nl.length; while (lo < hi) { const m = (lo + hi) >> 1; if (nl[m] < p) lo = m + 1; else hi = m; } return lo + 1; };
  const jsx = /className=|htmlFor=|\{\.\.\.|<>|=\{|^\s*(import|export)\s|=>\s*[(<]/m.test(src);
  const root = { tag: '#root', attrs: {}, children: [], parent: null, line: 0, raw: '' };
  const stack = [root];
  const top = () => stack[stack.length - 1];
  const addText = (t) => { const c = jsx ? t.replace(/[{}();,]/g, ' ') : t; if (/[\p{L}\p{N}]/u.test(c)) top().children.push({ text: c.replace(/\s+/g, ' '), parent: top() }); };
  const balanced = (i) => { // src[i] === '{'; returns index after the matching '}'
    let d = 0, q = null;
    for (let j = i; j < src.length; j++) {
      const ch = src[j];
      if (q) { if (ch === '\\') j++; else if (ch === q) q = null; continue; }
      if (ch === '"' || ch === "'" || ch === '`') q = ch;
      else if (ch === '{') d++;
      else if (ch === '}' && --d === 0) return j + 1;
    }
    return src.length;
  };
  const implied = (tag) => {
    const closes = { li: ['li'], dt: ['dt', 'dd'], dd: ['dt', 'dd'], option: ['option'], p: ['p'], td: ['td', 'th'], th: ['td', 'th'], tr: ['td', 'th', 'tr'] }[tag];
    if (closes) while (stack.length > 1 && closes.includes(top().tag)) stack.pop();
  };
  let i = 0; const n = src.length;
  while (i < n) {
    const c = src[i];
    if (c === '{' ) { // JSX / template expression in text
      const end = balanced(i); const inner = src.slice(i + 1, end - 1);
      if (/^\s*\/\*[\s\S]*\*\/\s*$/.test(inner)) { i = end; continue; }
      top().children.push({ text: '{…}', dyn: true, parent: top() });
      const lt = inner.indexOf('<');
      if (lt >= 0 && jsx) { i = i + 1 + lt; continue; }
      i = end; continue;
    }
    if (c !== '<') { let j = i; while (j < n && src[j] !== '<' && src[j] !== '{') j++; addText(src.slice(i, j)); i = j; continue; }
    if (src.startsWith('<!--', i)) { const e = src.indexOf('-->', i + 4); i = e < 0 ? n : e + 3; continue; }
    if (src[i + 1] === '!' || src[i + 1] === '?') { const e = src.indexOf('>', i); i = e < 0 ? n : e + 1; continue; }
    if (src[i + 1] === '/') { // closing tag
      const e = src.indexOf('>', i); const name = src.slice(i + 2, e < 0 ? n : e).trim().toLowerCase(); i = e < 0 ? n : e + 1;
      const want = name === '' ? '#fragment' : name;
      for (let k = stack.length - 1; k > 0; k--) if (stack[k].tag === want || (stack[k].orig && stack[k].orig.toLowerCase() === want)) { stack.length = k; break; }
      continue;
    }
    if (src[i + 1] === '>') { stack.push({ tag: '#fragment', attrs: {}, children: [], parent: top(), line: lineAt(i), raw: '<>' }); top().parent.children.push(top()); i += 2; continue; }
    const m = /^<([A-Za-z][\w.:-]*)/.exec(src.slice(i, i + 80));
    if (!m) { addText('<'); i++; continue; }
    const start = i; i += m[0].length; const orig = m[1]; const attrs = {}; let selfClose = false;
    while (i < n) {
      while (i < n && /\s/.test(src[i])) i++;
      if (src[i] === '>') { i++; break; }
      if (src[i] === '/' && src[i + 1] === '>') { selfClose = true; i += 2; break; }
      if (src[i] === '{') { const e = balanced(i); attrs['{...}'] = { v: '', dyn: true }; i = e; continue; }
      const nm = /^[^\s=\/>{]+/.exec(src.slice(i, i + 200)); if (!nm) { i++; continue; }
      i += nm[0].length; let key = nm[0].toLowerCase(); if (key === 'classname') key = 'class'; if (key === 'htmlfor') key = 'for';
      while (i < n && /\s/.test(src[i])) i++;
      if (src[i] !== '=') { attrs[key] = { v: '', dyn: false }; continue; }
      i++; while (i < n && /\s/.test(src[i])) i++;
      if (src[i] === '"' || src[i] === "'") { const q = src[i]; const e = src.indexOf(q, i + 1); const end = e < 0 ? n : e; attrs[key] = { v: src.slice(i + 1, end), dyn: false }; i = end + 1; }
      else if (src[i] === '{') { const e = balanced(i); const inner = src.slice(i + 1, e - 1).trim(); const lit = /^(["'])(.*)\1$/s.exec(inner) ?? /^`([^`$]*)`$/s.exec(inner); const numeric = /^-?\d+$/.test(inner); attrs[key] = lit ? { v: lit[2] ?? lit[1], dyn: false } : numeric ? { v: inner, dyn: false } : { v: '', dyn: true }; i = e; }
      else { const u = /^[^\s>]+/.exec(src.slice(i)); attrs[key] = { v: u ? u[0] : '', dyn: false }; i += u ? u[0].length : 0; }
    }
    const comp = /^[A-Z]/.test(orig) || orig.includes('.');
    const node = { tag: comp ? '#component' : orig.toLowerCase(), orig, comp, attrs, children: [], parent: top(), line: lineAt(start), raw: src.slice(start, i).replace(/\s+/g, ' ') };
    if (!comp) implied(node.tag);
    node.parent = top(); top().children.push(node);
    if (node.tag === 'script' || node.tag === 'style') { const e = src.toLowerCase().indexOf(`</${node.tag}`, i); const end = e < 0 ? n : e; node.content = src.slice(i, end); i = e < 0 ? n : src.indexOf('>', end) + 1; continue; }
    if (!selfClose && !VOID.has(node.tag)) stack.push(node);
  }
  return { root, jsx, lines: src.split('\n').length };
}

// ---------------------------------------------------------------- helpers
const attr = (n, k) => { const a = n.attrs[k]; return a ? (a.dyn ? '{…}' : a.v) : null; };
const has = (n, k) => k in n.attrs;
const spread = (n) => '{...}' in n.attrs;
const role = (n) => { const r = attr(n, 'role'); return r && r !== '{…}' ? r.trim().toLowerCase().split(/\s+/)[0] : r; };
const norm = (s) => String(s).toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
const hidden = (n) => attr(n, 'aria-hidden') === 'true' || (has(n, 'hidden') && !n.attrs.hidden.dyn && n.attrs.hidden.v !== 'false') || /display\s*:\s*none|visibility\s*:\s*hidden/.test(attr(n, 'style') ?? '');
const type = (n) => (attr(n, 'type') ?? 'text').toLowerCase();
const isEl = (n) => n.tag !== undefined && !n.tag.startsWith('#');

function walk(node, fn) { for (const c of node.children) { if (c.text !== undefined) continue; fn(c); walk(c, fn); } }
function descendants(node) { const out = []; walk(node, (c) => out.push(c)); return out; }
function ancestors(n) { const out = []; for (let p = n.parent; p; p = p.parent) out.push(p); return out; }

/** Text of the children as a reader gets it: text, alt, svg titles, aria-label of children; hidden parts left out. */
function ctext(n) {
  const out = [];
  for (const c of n.children) {
    if (c.text !== undefined) { out.push(c.text); continue; }
    if (hidden(c)) continue;
    if (c.comp) { out.push('{…}'); continue; }
    if (['script', 'style', 'template'].includes(c.tag)) continue;
    if (c.tag === 'input') { if (['submit', 'button', 'reset'].includes(type(c))) out.push(attr(c, 'value') ?? ''); continue; }
    if (c.tag === 'select' || c.tag === 'textarea') continue;
    if (c.tag === 'img' || c.tag === 'area') { out.push(attr(c, 'alt') ?? ''); continue; }
    if (c.tag === 'svg') { const t = c.children.find((x) => x.tag === 'title'); out.push(attr(c, 'aria-label') ?? (t ? ctext(t) : '')); continue; }
    const al = attr(c, 'aria-label'); if (al) { out.push(al); continue; }
    out.push(ctext(c));
  }
  return out.join(' ').replace(/\s+/g, ' ').trim();
}
/** Visible words only (no aria-label, no alt). */
function vtext(n) { return n.children.map((c) => (c.text !== undefined ? (c.dyn ? '' : c.text) : hidden(c) || c.comp || ['script', 'style', 'svg', 'select', 'textarea', 'input', 'img'].includes(c.tag) ? '' : vtext(c))).join(' ').replace(/\s+/g, ' ').trim(); }

/** Accessible name of an element, '' when it has none; '{…}' when it depends on a run-time value. */
export function accName(n, ctx) {
  const lb = attr(n, 'aria-labelledby');
  if (lb) { const t = lb.split(/\s+/).map((id) => (ctx.byId.get(id) ? ctext(ctx.byId.get(id)) || attr(ctx.byId.get(id), 'aria-label') || '' : '')).join(' ').trim(); if (t) return t; }
  const al = attr(n, 'aria-label'); if (al && al.trim()) return al.trim();
  const tag = n.tag;
  if (tag === 'img' || (tag === 'input' && type(n) === 'image') || tag === 'area') { const a = attr(n, 'alt'); if (a && a.trim()) return a.trim(); }
  if (tag === 'input' || tag === 'select' || tag === 'textarea') {
    if (tag === 'input' && ['submit', 'reset'].includes(type(n))) return attr(n, 'value') || (type(n) === 'submit' ? 'Submit' : 'Reset');
    if (tag === 'input' && type(n) === 'button') return attr(n, 'value') || '';
    const labels = [];
    const id = attr(n, 'id'); if (id && ctx.labelsFor.has(id)) labels.push(...ctx.labelsFor.get(id));
    const wrap = ancestors(n).find((a) => a.tag === 'label'); if (wrap) labels.push(wrap);
    const t = labels.map((l) => ctext(l)).join(' ').trim(); if (t) return t;
  } else if (tag === 'svg') { const t = n.children.find((x) => x.tag === 'title'); if (t && ctext(t)) return ctext(t); }
  else if (tag === 'table') { const c = n.children.find((x) => x.tag === 'caption'); if (c && ctext(c)) return ctext(c); }
  else if (tag === 'fieldset') { const c = n.children.find((x) => x.tag === 'legend'); if (c && ctext(c)) return ctext(c); }
  else if (!['dialog', 'iframe', 'video', 'audio'].includes(tag) && !['dialog', 'alertdialog'].includes(role(n) ?? '')) { const t = ctext(n); if (t) return t; }
  const ti = attr(n, 'title'); if (ti && ti.trim()) return ti.trim();
  return '';
}

const focusable = (n) => !n.comp && !hidden(n) && ((n.tag === 'a' && has(n, 'href')) || n.tag === 'button' || (n.tag === 'input' && type(n) !== 'hidden') || n.tag === 'select' || n.tag === 'textarea' || n.tag === 'summary' || (has(n, 'tabindex') && attr(n, 'tabindex') !== '-1') || ((n.tag === 'audio' || n.tag === 'video') && has(n, 'controls')));
const withAttr = (n, s) => n.raw.replace(/\s*(\/?)>$/, ` ${s}$1>`);
const without = (raw, k) => raw.replace(new RegExp(`\\s+${k}(=("[^"]*"|'[^']*'|\\{[^}]*\\}))?(?=[\\s/>])`, 'i'), '');
const retag = (raw, tag) => raw.replace(/^<[\w.:-]+/, `<${tag}`);
const hint = (n) => { const t = `${attr(n, 'class') ?? ''} ${attr(n, 'id') ?? ''} ${attr(n, 'name') ?? ''} ${attr(n, 'data-action') ?? ''}`.toLowerCase(); const h = HINTS.find((x) => new RegExp(`(^|[^a-z])${x}`).test(t)); return h ? h[0].toUpperCase() + h.slice(1) : null; };
/** The nearest heading before the node among its own, its parent's and its grandparent's children. */
function prevHeading(n) {
  let child = n;
  for (let p = n.parent, k = 0; p && k < 3; child = p, p = p.parent, k++) {
    const i = p.children.indexOf(child);
    for (let j = i - 1; j >= 0; j--) if (/^h[1-6]$/.test(p.children[j].tag ?? '') && !hidden(p.children[j])) return ctext(p.children[j]);
  }
  return '';
}
const shortRaw = (n) => (n.raw.length > 120 ? `${n.raw.slice(0, 117)}…` : n.raw);

// ---------------------------------------------------------------- the audit
/**
 * @param {string} src HTML or JSX
 * @returns {{mode:string, lines:number, elements:number, components:number, page:boolean, ran:string[], skipped:{id:string, why:string}[], findings:object[], manual:string[]}}
 */
export function audit(src) {
  const { root, jsx, lines } = parse(String(src));
  const all = descendants(root);
  const els = all.filter((n) => isEl(n));
  const components = all.filter((n) => n.comp).length;
  const jsxNote = jsx ? ' (JSX: for is htmlFor, tabindex is tabIndex)' : '';
  const A = (name) => (jsx ? { for: 'htmlFor', tabindex: 'tabIndex', class: 'className' }[name] ?? name : name);
  const page = els.some((n) => ['html', 'head', 'body'].includes(n.tag));
  const byId = new Map(); const idCount = new Map(); const labelsFor = new Map();
  for (const n of els) { const id = attr(n, 'id'); if (id && id !== '{…}') { if (!byId.has(id)) byId.set(id, n); idCount.set(id, (idCount.get(id) ?? 0) + 1); } if (n.tag === 'label' && attr(n, 'for')) { const f = attr(n, 'for'); labelsFor.set(f, [...(labelsFor.get(f) ?? []), n]); } }
  const ctx = { byId, labelsFor };
  const findings = []; const ran = []; const skipped = [];
  const add = (id, n, problem, fix, note, status) => findings.push({ rule: id, sc: RULE[id].sc, scName: RULE[id].scName, level: RULE[id].level, status: status ?? RULE[id].status, who: RULE[id].who, element: shortRaw(n), line: n.line, problem, fix, note: note ?? '' });
  for (const r of RULES) { if (r.pageOnly && !page) skipped.push({ id: r.id, why: 'needs a full page (html, head or body) and the input is a fragment' }); else ran.push(r.id); }
  const on = (id) => ran.includes(id);
  const skip = (n) => spread(n) || n.comp;

  const html = els.find((n) => n.tag === 'html'), head = els.find((n) => n.tag === 'head'), body = els.find((n) => n.tag === 'body');
  const anchor = html ?? head ?? body;
  if (on('html-lang') && html && !skip(html)) {
    const l = attr(html, 'lang');
    if (l === null || l.trim() === '') add('html-lang', html, 'The page has no language, so a screen reader cannot choose the right voice and pronunciation.', `- ${html.raw}\n+ ${withAttr(html, 'lang="en"')}`, 'Use the language code of the page text (for example en, fr, km).');
    else if (l !== '{…}' && !/^[a-z]{2,3}(-[a-z0-9]{2,8})*$/i.test(l)) add('html-lang', html, `lang="${l}" is not a valid language code.`, `- ${html.raw}\n+ ${html.raw.replace(/lang=("[^"]*"|'[^']*')/i, 'lang="en"')}`, 'Use a code such as en, fr or km.');
  }
  if (on('page-title') && anchor) {
    const t = els.find((n) => n.tag === 'title');
    if (!t) add('page-title', head ?? anchor, 'The page has no title element, so the tab, history and screen reader have no page name.', `+ <title>Page name - Site name</title>   (inside ${head ? 'head' : 'the page'})`, 'Put the specific page first, then the site name.');
    else if (!ctext(t)) add('page-title', t, 'The title element is empty.', `- ${t.raw}\n+ <title>Page name - Site name</title>`);
  }
  if (on('viewport-zoom')) for (const n of els.filter((x) => x.tag === 'meta' && attr(x, 'name') === 'viewport')) {
    const c = (attr(n, 'content') ?? '').toLowerCase().replace(/\s+/g, '');
    const max = /maximum-scale=([\d.]+)/.exec(c);
    if (/user-scalable=(no|0)/.test(c) || (max && parseFloat(max[1]) < 2)) add('viewport-zoom', n, 'The viewport blocks pinch zoom or limits it below 200%.', `- ${n.raw}\n+ <meta name="viewport" content="width=device-width, initial-scale=1">`, 'Remove user-scalable and maximum-scale from the content value.');
    else if (/width=(\d{3,4})(,|$)/.test(c)) add('viewport-zoom', n, 'The viewport has a fixed pixel width, so the page cannot reflow at narrow widths.', `- ${n.raw}\n+ <meta name="viewport" content="width=device-width, initial-scale=1">`);
  }
  if (on('main-landmark') && (body || html)) {
    const mains = els.filter((n) => (n.tag === 'main' || role(n) === 'main') && !hidden(n));
    if (!mains.length) add('main-landmark', body ?? html, 'The page has no main landmark, so keyboard and screen reader users cannot jump past the repeated header and navigation.', '+ <main id="main"> ... the page content ... </main>   (one per page, inside body)');
    else if (mains.length > 1) add('main-landmark', mains[1], 'The page has more than one main landmark.', `- ${mains[1].raw}\n+ <div>   (keep a single main)`, '', 'failure');
  }
  if (on('landmark-name')) {
    const navs = els.filter((n) => (n.tag === 'nav' || role(n) === 'navigation') && !hidden(n));
    if (navs.length > 1) for (const n of navs) if (!attr(n, 'aria-label') && !attr(n, 'aria-labelledby')) add('landmark-name', n, 'The page has several navigation landmarks and this one has no name, so a screen reader lists them all as "navigation".', `- ${n.raw}\n+ ${withAttr(n, 'aria-label="Main"')}`, 'Give each navigation a different name (Main, Footer, Breadcrumb).');
  }
  const heads = els.filter((n) => /^h[1-6]$/.test(n.tag) && !hidden(n));
  if (on('heading-order')) { let prev = 0; for (const h of heads) { const l = Number(h.tag[1]); if (prev && l > prev + 1) add('heading-order', h, `The heading level jumps from h${prev} to h${l}, so the outline a screen reader user navigates has a hole.`, `- ${h.raw}\n+ ${h.raw.replace(/^<h\d/, `<h${prev + 1}`)}`, `Change the closing tag to </h${prev + 1}> and style the size with CSS.`); prev = l; } }
  if (on('heading-empty')) for (const h of heads) if (!skip(h) && !accName(h, ctx)) add('heading-empty', h, 'The heading has no text, so it is announced as an empty heading.', `- ${h.raw}\n+ ${h.raw}Section name</${h.tag}>`, 'Give it the section name, or remove the element.');

  for (const n of els) {
    if (skip(n)) continue;
    const t = n.tag, r = role(n);
    if (t === 'img' && hidden(n) === false && r !== 'presentation' && r !== 'none') {
      const a = attr(n, 'alt');
      if (a === null) add('img-alt', n, 'The image has no alt attribute, so a screen reader reads the file name.', `- ${n.raw}\n+ ${withAttr(n, 'alt="Short description of what the image shows"')}`, 'A decorative image gets alt="" instead.');
      else if (a !== '{…}' && a.trim() && (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(a.trim()) || /^(image|img|photo|picture|graphic|icon|banner)\s*\d*$/i.test(a.trim()) || /^(image|picture|photo|graphic) of\b/i.test(a.trim()))) add('img-alt-bad', n, `The alt text "${a}" is a file name or a generic word, not what the image is for.`, `- ${n.raw}\n+ ${n.raw.replace(/alt=("[^"]*"|'[^']*')/i, 'alt="What the image shows or does"')}`, 'Start with the content, not "image of".');
    }
    if (t === 'area' && has(n, 'href') && attr(n, 'alt') === null) add('img-alt', n, 'The image map area has no alt text.', `- ${n.raw}\n+ ${withAttr(n, 'alt="Where the link goes"')}`);
    if (t === 'svg' && r === 'img' && !accName(n, ctx)) add('img-alt', n, 'The svg has role="img" but no name.', `- ${n.raw}\n+ ${withAttr(n, 'aria-label="What the graphic shows"')}`);

    const field = (t === 'input' && !['hidden', 'button', 'submit', 'reset', 'image'].includes(type(n))) || t === 'select' || t === 'textarea';
    const widget = t === 'button' || (t === 'a' && has(n, 'href')) || t === 'summary' || (t === 'input' && ['button', 'submit', 'reset', 'image'].includes(type(n))) || (NAMED_ROLES.has(r) && !field);
    if (field && !hidden(n)) {
      const nm = accName(n, ctx);
      if (!nm && !(has(n, 'aria-labelledby'))) {
        const ph = attr(n, 'placeholder'); let id = attr(n, 'id'); const text = ph || attr(n, 'name') || 'Field name';
        const mk = `${attr(n, 'name') || 'field'}${['radio', 'checkbox'].includes(type(n)) && attr(n, 'value') ? `-${attr(n, 'value')}` : ''}`.replace(/[^\w-]/g, '');
        const withId = id ? n.raw : withAttr(n, `id="${mk}"`); id ||= mk;
        add('form-label', n, ph ? 'The field has only a placeholder, which disappears when typing and is not a reliable name.' : 'The field has no label, so a screen reader announces it with no name and voice control cannot target it.', `- ${n.raw}\n+ <label ${A('for')}="${id}">${text}</label>\n+ ${withId}`, 'Use the label text users see. Keep a placeholder only as an example.');
      }
    }
    if (widget && !hidden(n) && !accName(n, ctx) && !has(n, 'aria-labelledby')) {
      const h = hint(n);
      add('control-name', n, `The ${t === 'a' ? 'link' : t === 'input' ? 'input button' : r ?? t} has no accessible name, so a screen reader says only "${t === 'a' ? 'link' : 'button'}" and voice control has nothing to say.`, `- ${n.raw}\n+ ${withAttr(n, `aria-label="${h ?? 'Name of the action'}"`)}`, 'The name says what the control does. If the control holds an icon, name it here.');
    }
    if (t === 'label' && !has(n, 'for') === false && attr(n, 'for') !== '{…}' && !byId.has(attr(n, 'for'))) add('label-orphan', n, `The label points to id "${attr(n, 'for')}" and no element has that id.`, `- ${n.raw}\n+ ${n.raw.replace(/(?:htmlFor|for)=("[^"]*"|'[^']*'|\{[^}]*\})/, () => `${A('for')}="id-of-the-field"`)}`);
    else if (t === 'label' && !has(n, 'for') && !descendants(n).some((d) => ['input', 'select', 'textarea', 'meter', 'progress', 'output'].includes(d.tag)) && !n.children.some((c) => c.comp)) add('label-orphan', n, 'The label has no for attribute and wraps no field, so it labels nothing.', `- ${n.raw}\n+ ${withAttr(n, `${A('for')}="id-of-the-field"`)}`);
    if (field && !hidden(n) && !has(n, 'required') && !has(n, 'aria-required')) {
      const labs = [...(labelsFor.get(attr(n, 'id')) ?? []), ...ancestors(n).filter((a) => a.tag === 'label')];
      const txt = labs.map((l) => ctext(l)).join(' ');
      if (/\*\s*$/.test(txt) || /\(required\)|\brequired\b/i.test(txt)) add('required-state', n, 'The label says the field is required but the field does not say so, so a screen reader user is not told.', `- ${n.raw}\n+ ${withAttr(n, 'required')}`, 'Hide a visual asterisk from the name with aria-hidden="true".');
    }
    if (attr(n, 'aria-invalid') === 'true' && !has(n, 'aria-describedby') && !has(n, 'aria-errormessage')) add('error-link', n, 'The field is marked invalid but no error text is linked to it, so the screen reader says "invalid" without saying why.', `- ${n.raw}\n+ ${withAttr(n, 'aria-describedby="error-id"')}\n+ <p id="error-id">What is wrong and how to fix it</p>`, 'Place the error text next to the field and give it that id.');
    if (t === 'input' && !hidden(n) && !has(n, 'autocomplete')) {
      const k = `${attr(n, 'name') ?? ''} ${attr(n, 'id') ?? ''}`.toLowerCase(); const ty = type(n); let tok = null;
      if (ty === 'email') tok = 'email'; else if (ty === 'tel') tok = 'tel'; else if (ty === 'password') tok = /new|confirm|create|register|signup/.test(k) ? 'new-password' : 'current-password';
      else if (['text', 'search', 'url'].includes(ty)) tok = /e-?mail/.test(k) ? 'email' : /(first|given).?name/.test(k) ? 'given-name' : /(last|family|sur).?name/.test(k) ? 'family-name' : /(^|[^a-z])(full.?)?name($|[^a-z])/.test(k) ? 'name' : /user.?name|login/.test(k) ? 'username' : /zip|postal/.test(k) ? 'postal-code' : /street|address/.test(k) ? 'street-address' : /city/.test(k) ? 'address-level2' : /country/.test(k) ? 'country-name' : /phone|mobile|tel/.test(k) ? 'tel' : /card.?(num|no)|cc.?num/.test(k) ? 'cc-number' : /birth|bday/.test(k) ? 'bday' : null;
      if (tok) add('autocomplete', n, `The field asks for the user's own ${tok.replace(/-/g, ' ')} and has no autocomplete token, so browsers and assistive tools cannot fill it.`, `- ${n.raw}\n+ ${withAttr(n, `autocomplete="${tok}"`)}`);
    }
    if (t === 'fieldset' && !accName(n, ctx)) add('group-name', n, 'The fieldset has no legend, so its group name is never announced.', `- ${n.raw}\n+ ${n.raw}<legend>Group question</legend>   (first child)`);
    const hasClick = has(n, 'onclick');
    const nativeInteractive = ['a', 'button', 'input', 'select', 'textarea', 'summary', 'details', 'label', 'option', 'audio', 'video'].includes(t);
    if (hasClick && !nativeInteractive && !descendants(n).some((d) => focusable(d))) {
      const tabbable = has(n, 'tabindex') && attr(n, 'tabindex') !== '-1';
      if (!tabbable) add('click-no-keyboard', n, `The ${t} reacts to a click but cannot be reached or used with the keyboard, and has no role.`, `- ${n.raw}\n+ ${retag(without(n.raw, 'role'), 'button').replace(/^<button/, '<button type="button"')}`, `Change the closing tag to </button>. A native button gets focus, Enter and Space for free.`);
    }
    if (t === 'a' && !has(n, 'href') && !r && (ctext(n) || hasClick)) add('link-no-href', n, 'The anchor has no href, so it is not in the Tab order and is not a link for a screen reader.', `- ${n.raw}\n+ ${hasClick ? retag(n.raw, 'button').replace(/^<button/, '<button type="button"') : withAttr(n, 'href="/where-it-goes"')}`, hasClick ? 'It runs a script, so it is a button: change the closing tag to </button>.' : '');
    const ti = attr(n, 'tabindex'); if (ti && /^\d+$/.test(ti) && Number(ti) > 0) add('tabindex-positive', n, `${A('tabindex')}="${ti}" forces this element before the natural order, so Tab jumps around the page.`, `- ${n.raw}\n+ ${without(n.raw, 'tabindex')}`, 'Fix the order by moving the element in the markup, not with tabindex. Use 0 or -1 only.');
    if (r && NATIVE_ROLE[r] && GENERIC.has(t) && !(t === 'a' && r === 'link') && !(t === 'label')) {
      const tag = r === 'heading' ? `h${/^[1-6]$/.test(attr(n, 'aria-level') ?? '') ? attr(n, 'aria-level') : '2'}` : NATIVE_ROLE[r];
      const extra = tag === 'button' ? ' type="button"' : tag === 'input' ? ` type="${r === 'textbox' ? 'text' : r}"` : '';
      add('native-element', n, `role="${r}" on a ${t} rebuilds what <${tag}> already does, and needs extra scripts for keys and states.`, `- ${n.raw}\n+ ${retag(without(without(n.raw, 'role'), 'aria-level'), tag).replace(/^<(\w+)/, `<$1${extra}`)}`, 'Change the closing tag to match. Native elements bring focus, keys and states.');
    }
    const redundant = (t === 'button' && r === 'button') || (t === 'a' && has(n, 'href') && r === 'link') || (t === 'nav' && r === 'navigation') || (t === 'main' && r === 'main') || (t === 'img' && r === 'img') || (t === 'table' && r === 'table') || (t === 'form' && r === 'form') || (/^h[1-6]$/.test(t) && r === 'heading') || (t === 'input' && r === type(n));
    if (redundant) add('redundant-role', n, `role="${r}" repeats the role <${t}> already has.`, `- ${n.raw}\n+ ${without(n.raw, 'role')}`);
    if (hidden(n) && attr(n, 'aria-hidden') === 'true' && (focusable(n) || descendants(n).some((d) => focusable(d) && attr(d, 'tabindex') !== '-1'))) add('aria-hidden-focusable', n, 'The element is hidden from screen readers but can still receive keyboard focus, so focus lands on something that is never announced.', `- ${n.raw}\n+ ${without(n.raw, 'aria-hidden')}`, 'Remove aria-hidden, or also remove the content from the Tab order with the hidden attribute or inert.');
    if (r && r !== '{…}' && !ROLES.has(r)) add('aria-invalid-use', n, `role="${r}" is not a role that exists.`, `- ${n.raw}\n+ ${without(n.raw, 'role')}`, 'Use a real role, or no role when a native element fits.');
    for (const k of Object.keys(n.attrs)) if (k.startsWith('aria-') && !ARIA.has(k.slice(5))) add('aria-invalid-use', n, `${k} is not an ARIA attribute.`, `- ${n.raw}\n+ ${without(n.raw, k)}`, `Check the spelling, for example aria-label, aria-labelledby, aria-describedby.`);
    for (const k of ['aria-labelledby', 'aria-describedby', 'aria-controls', 'aria-owns', 'aria-errormessage', 'aria-activedescendant']) { const v = n.attrs[k]; if (v && !v.dyn) for (const id of v.v.split(/\s+/).filter(Boolean)) if (!byId.has(id)) add('aria-ref-missing', n, `${k} points to id "${id}" and no element has that id.`, `- ${n.raw}\n+ ${n.raw.replace(new RegExp(`${k}=("[^"]*"|'[^']*')`), `${k}="id-of-an-element-on-the-page"`)}`, 'Add the id to the element it should point to, or remove the attribute.'); }
    if (['div', 'span', 'p', 'b', 'i', 'em', 'strong', 'small'].includes(t) && !r && (attr(n, 'aria-label') || attr(n, 'aria-labelledby'))) add('aria-label-ignored', n, `aria-label on a ${t} with no role is ignored by many screen readers, because a plain ${t} has no role to name.`, `- ${n.raw}\n+ ${without(without(n.raw, 'aria-label'), 'aria-labelledby')}`, 'Put the name on an interactive element, or give the element a role such as region.');
    const need = { checkbox: 'aria-checked', switch: 'aria-checked', radio: 'aria-checked', menuitemcheckbox: 'aria-checked', tab: 'aria-selected', combobox: 'aria-expanded' }[r];
    if (need && !has(n, need) && !['input', 'select'].includes(t)) add('aria-state-missing', n, `role="${r}" needs ${need}, so a screen reader cannot say its state.`, `- ${n.raw}\n+ ${withAttr(n, `${need}="false"`)}`, `Update the value in script whenever the state changes.`);
    if ((r === 'dialog' || r === 'alertdialog' || t === 'dialog') && !hidden(n) && !accName(n, ctx)) add('dialog-name', n, 'The dialog has no accessible name, so a screen reader opens it with no title.', `- ${n.raw}\n+ ${withAttr(n, 'aria-labelledby="dialog-title"')}\n+ (give the dialog heading id="dialog-title")`);
    const cls = `${attr(n, 'class') ?? ''} ${attr(n, 'id') ?? ''}`.toLowerCase().split(/[\s]+/);
    if (['div', 'p', 'span', 'section', 'aside', 'li'].includes(t) && cls.some((c) => /^(toast|snackbar|notification|flash|alert|status-message|error-message|success-message|form-error|form-success|validation-message|field-error|inline-error|error-text|toast-message)$/.test(c)) && !['alert', 'status', 'log', 'alertdialog'].includes(r ?? '') && !has(n, 'aria-live') && !ancestors(n).some((a) => has(a, 'aria-live') || ['alert', 'status', 'log'].includes(role(a) ?? ''))) {
      add('status-message', n, 'This message appears after an action but is not a live region, so a screen reader never announces it.', `- ${n.raw}\n+ ${withAttr(n, /error|alert|invalid/.test(cls.join(' ')) ? 'role="alert"' : 'role="status"')}`, 'Keep the container in the page from the start and change only its text, so the change is announced.');
    }
    if (t === 'a' && has(n, 'href') && !hidden(n)) {
      const nm = norm(accName(n, ctx));
      if (GENERIC_LINKS.has(nm) && !attr(n, 'aria-label')) {
        const block = ancestors(n).find((a) => ['p', 'li', 'td', 'th', 'dd'].includes(a.tag));
        const others = block ? norm(vtext(block)).replace(nm, '').split(' ').filter(Boolean).length : 0;
        const near = prevHeading(n);
        add('link-purpose', n, `The link text "${ctext(n)}" does not say where the link goes; in a list of links a screen reader user hears only "${ctext(n)}".`, `- ${n.raw}\n+ ${withAttr(n, `aria-label="${ctext(n)}${near ? ` about ${near}` : ' about <topic>'}"`)}`, 'The visible text stays; the accessible name starts with it and adds the topic. Changing the visible words belongs to copy-tight.', block && others >= 4 ? 'advisory' : 'failure');
      }
    }
    const al = attr(n, 'aria-label');
    if (al && al !== '{…}' && (t === 'button' || t === 'a' || NAMED_ROLES.has(r ?? '')) && !hidden(n)) {
      const vis = norm(vtext(n)); if (vis && !norm(al).includes(vis)) add('label-in-name', n, `The accessible name "${al}" does not contain the visible text "${vtext(n)}", so saying the visible words to voice control fails.`, `- ${n.raw}\n+ ${without(n.raw, 'aria-label')}`, `Or keep aria-label and begin it with the visible text: aria-label="${vtext(n)} ...".`);
    }
    if (t === 'table' && r !== 'presentation' && r !== 'none' && !descendants(n).some((d) => d.tag === 'th' || role(d) === 'columnheader' || role(d) === 'rowheader') && !descendants(n).some((d) => d.comp)) { const td = descendants(n).find((d) => d.tag === 'td'); add('table-header', n, 'The data table has no header cells, so a screen reader cannot say which column or row a cell belongs to.', td ? `- ${td.raw}   (cells of the header row)\n+ <th scope="col">` : '+ <th scope="col"> for each column heading', 'If the table is only for layout, add role="presentation" to the table instead.'); }
    if (t === 'video' && !descendants(n).some((d) => d.tag === 'track' && /captions|subtitles/i.test(attr(d, 'kind') ?? ''))) add('video-captions', n, 'The video has no captions track, so people who cannot hear it miss the speech and sounds.', `- ${n.raw}\n+ ${n.raw}\n+   <track kind="captions" src="captions.vtt" srclang="en" label="English" default>   (inside the video)`, 'If the video has no sound at all, say so in a text alternative instead.');
    if (t === 'audio' && !/transcript/i.test(src)) add('audio-transcript', n, 'The audio has no transcript on the page.', `- ${n.raw}\n+ <a href="transcript.html">Transcript</a>   (next to the audio)`);
    if ((t === 'video' || t === 'audio') && has(n, 'autoplay') && !has(n, 'muted')) add('media-autoplay', n, 'The media starts playing with sound and speaks over a screen reader.', `- ${n.raw}\n+ ${without(n.raw, 'autoplay')}`, 'Let the user start it, or make it muted with visible controls.');
    if (t === 'iframe' && !accName(n, ctx) && !attr(n, 'name')) add('iframe-title', n, 'The frame has no title, so a screen reader announces it as "frame" with no purpose.', `- ${n.raw}\n+ ${withAttr(n, 'title="What the frame contains"')}`);
    if ((t === 'a' || t === 'button' || NAMED_ROLES.has(r ?? '')) && !hidden(n)) { const inner = descendants(n).find((d) => focusable(d)); if (inner) add('nested-interactive', n, `A control contains another control (${inner.raw.slice(0, 50)}), so keyboard focus and screen reader output are ambiguous.`, `- ${n.raw}\n+ (move ${inner.raw.slice(0, 40)} out of this element)`, 'Use one control per action, side by side.'); }
    const id = attr(n, 'id'); if (id && id !== '{…}' && idCount.get(id) > 1 && byId.get(id) !== n && (labelsFor.has(id) || els.some((e) => ['aria-labelledby', 'aria-describedby', 'aria-controls'].some((k) => (attr(e, k) ?? '').split(/\s+/).includes(id))))) add('duplicate-id', n, `id="${id}" is used more than once and a label or aria attribute points to it, so it may point at the wrong element.`, `- ${n.raw}\n+ ${n.raw.replace(/id=("[^"]*"|'[^']*')/i, `id="${id}-2"`)}`, 'Make each id unique and point the label or aria attribute at the right one.');
  }
  for (const n of els.filter((x) => x.tag === 'script' && x.content)) {
    const c = n.content;
    if (/(key|code|keyCode|which)\b[^;\n]{0,40}(['"]Tab['"]|\b9\b)/.test(c) && /preventDefault/.test(c) && !/Escape|\bEsc\b|keyCode\s*={1,3}\s*27/.test(c)) add('focus-trap', n, 'The script captures the Tab key and cancels it, and nothing in it handles Escape, so a keyboard user cannot leave.', `- ${(c.split('\n').find((l) => /Tab|\b9\b/.test(l)) ?? n.raw).trim()}\n+ (delete this line so Tab moves focus normally; a dialog may loop Tab only if Escape also closes it)`, 'A native dialog opened with showModal() traps focus and closes on Escape without any script.');
  }
  // radio groups
  const radios = new Map(); for (const n of els) if (n.tag === 'input' && type(n) === 'radio' && attr(n, 'name') && !n.comp) radios.set(attr(n, 'name'), [...(radios.get(attr(n, 'name')) ?? []), n]);
  for (const [nm, list] of radios) if (list.length > 1 && !ancestors(list[0]).some((a) => a.tag === 'fieldset' || ['group', 'radiogroup'].includes(role(a) ?? ''))) add('group-name', list[0], `The radio buttons named "${nm}" are not in a group, so a screen reader reads each option without the question.`, `+ <fieldset><legend>The question</legend> ... the radio buttons ... </fieldset>`);

  const seen = new Set();
  const out = findings.filter((f) => { const k = `${f.rule}|${f.line}|${f.element}|${f.problem}`; if (seen.has(k)) return false; seen.add(k); return true; }).sort((a, b) => a.line - b.line || a.rule.localeCompare(b.rule));
  out.forEach((f, i) => { f.n = i + 1; });
  const manual = [...MANUAL_ALWAYS];
  if (els.some((n) => ['img', 'area', 'svg'].includes(n.tag) || (n.tag === 'input' && type(n) === 'image'))) manual.push('Alt text quality: the script checks that alt text exists, a person must check that it says what each image is for (SC 1.1.1).');
  if (els.some((n) => n.tag === 'dialog' || ['dialog', 'alertdialog'].includes(role(n) ?? '') || attr(n, 'aria-modal') === 'true')) manual.push('Dialog: opening moves focus inside, Tab stays inside while it is open, Escape closes it and focus returns to the button that opened it (SC 2.1.2, 2.4.3).');
  if (els.some((n) => ['form', 'input', 'textarea', 'select'].includes(n.tag))) manual.push('Forms: submit with errors and check the screen reader announces each error and moves to the first one (SC 3.3.1, 4.1.3).');
  if (els.some((n) => n.tag === 'video' || n.tag === 'audio')) manual.push('Media: captions match the speech, and a video with important visuals has audio description (SC 1.2.2, 1.2.5).');
  if (components) manual.push(`${components} component${components > 1 ? 's' : ''} (capitalised JSX tags) and run-time values in braces were not checked; render the page and audit the HTML it produces.`);
  if (!page) manual.push('Page-level checks (language, title, viewport, main landmark) were skipped because the input is a fragment; run them on the full page.');
  return { mode: jsx ? 'jsx' : 'html', lines, elements: els.length, components, page, ran, skipped, findings: out, manual, jsxNote };
}

/** The text report the agent reads. */
export function report(r) {
  const fail = r.findings.filter((f) => f.status === 'failure').length;
  const o = [`a11y-audit engine ${VERSION}`, `input: ${r.mode}, ${r.lines} lines, ${r.elements} elements, ${r.components} components, full page: ${r.page ? 'yes' : 'no'}`, `checks that ran: ${r.ran.length} of ${RULES.length}${r.skipped.length ? ` (skipped: ${r.skipped.map((s) => s.id).join(', ')}, because ${r.skipped[0].why})` : ''}`, `findings: ${r.findings.length} (${fail} failure, ${r.findings.length - fail} advisory)`, ''];
  for (const f of r.findings) o.push(`${f.n}. [${f.rule}] SC ${f.sc} ${f.scName} (${f.level}), ${f.status}`, `   element: ${f.element} (line ${f.line})`, `   affects: ${f.who.join(', ')}`, `   problem: ${f.problem}`, '   fix:', ...f.fix.split('\n').map((l) => `   ${l}`), ...(f.note ? [`   note: ${f.note}`] : []), '');
  if (!r.findings.length) o.push('No findings from the script.', '');
  o.push('manual tests needed (the script cannot do these):', ...r.manual.map((m) => `- ${m}`));
  return o.join('\n');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const a = process.argv.slice(2); const arg = (k) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : undefined; };
  let src;
  try { src = arg('--file') ? readFileSync(arg('--file'), 'utf8') : arg('--html') !== undefined ? arg('--html') : a.includes('-') ? readFileSync(0, 'utf8') : undefined; } catch (e) { console.error(`cannot read the input: ${e.message}`); process.exit(2); }
  if (src === undefined || !src.trim()) { console.error('usage: node audit.mjs --file <path> | --html "<markup>" | - (stdin) [--json]'); process.exit(2); }
  const r = audit(src);
  console.log(a.includes('--json') ? JSON.stringify(r, null, 2) : report(r));
}
