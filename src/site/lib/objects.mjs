/**
 * Draw a text skill's real answer as the object it stands for, not as a page of text:
 * copy-tight → the message before and after, changelog-writer → a version tag, test-planner → a clipboard,
 * skill-smith → a skill folder. Every word drawn is cut word for word from the recording (the answer, or the quote
 * in the request for the "before" message); only the small captions in class `obj-label` are the site's own.
 * When nothing can be cut out, the caller falls back to the document figure.
 * @governed-by PO_ARCHITECT
 */
import { wrap } from './proof.mjs';

const x = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const lines = (s) => String(s).replace(/\r\n?/g, '\n').split('\n');
const unquote = (s) => s.trim().replace(/^["'“‘](.*)["'”’]$/, '$1');

/** Pieces of each kind of object, cut from the answer. Each returns null when the answer does not hold it. */
export const extract = {
  toast(prompt, answer) {
    const L = lines(answer); const i = L.findIndex((l) => /^Rewritten copy:/.test(l.trim()));
    if (i < 0) return null;
    const after = L.slice(i + 1).find((l) => l.trim());
    const before = /'([^']{8,})'|"([^"]{8,})"/.exec(prompt);
    return after ? { before: before ? before[1] ?? before[2] : null, after: unquote(after) } : null;
  },
  tag(answer) {
    const L = lines(answer); const i = L.findIndex((l) => /^##\s+\d+\.\d+\.\d+\s+-\s+\d{4}-\d\d-\d\d/.test(l));
    if (i < 0) return null;
    const m = /^##\s+(\d+\.\d+\.\d+)\s+-\s+(\S+)/.exec(L[i]);
    const items = [];
    for (const l of L.slice(i + 1)) { if (/^(##|```)/.test(l)) break; const b = /^-\s+(.+)/.exec(l); if (b) items.push(b[1]); }
    const bump = L.map((l) => /^Bump:\s*(.+)/.exec(l)?.[1]).find(Boolean) ?? null;
    return items.length ? { version: m[1], date: m[2], items, bump } : null;
  },
  clipboard(answer) {
    const L = lines(answer);
    const title = L.map((l) => /^##\s+Regression checklist:\s*(.+)/.exec(l)?.[1]).find(Boolean);
    const items = L.map((l) => /^\d+\.\s+\[ \]\s+(.+?)(\s+_[^_]+_)?\s*$/.exec(l)?.[1]).filter(Boolean);
    return items.length ? { title: title ?? null, items } : null;
  },
  folder(answer) {
    const name = /`([a-z][a-z0-9-]+)` skill/.exec(answer)?.[1];
    if (!name) return null;
    const files = [...new Set([...answer.matchAll(/`((?:[\w.-]+\/)*[\w-]+\.(?:md|json|svg|zip))`/g)].map((m) => m[1]))];
    const checks = lines(answer).map((l) => /(Live evals: \d+ passed, \d+ failed)/.exec(l)?.[1] ?? /\((no problems)\)|: (no problems)/.exec(l)?.[0]).filter(Boolean);
    return files.length ? { name, files, checks: checks.map((c) => c.replace(/^[:(]\s*|\)$/g, '')) } : null;
  },
};

const STYLE = `<style>.obj text{font-family:'JetBrains Mono',ui-monospace,monospace;fill:var(--fg)}.obj .t{font-size:11px}.obj .b{font-size:12px;font-weight:600}` +
  `.obj .s{font-size:10px;fill:var(--muted)}.obj .obj-label{font-size:9px;letter-spacing:.08em;fill:var(--muted)}.obj .big{font-size:20px;font-weight:700}</style>`;
const T = (tx, ty, s, cls = 't') => `<text x="${tx}" y="${ty}" class="${cls}">${x(s)}</text>`;
const shadow = (d) => `<path d="${d}" transform="translate(4 5)" fill="var(--line)" opacity="0.5"/>`;
const rr = (X, Y, w, h, r) => `M${X + r} ${Y} H${X + w - r} Q${X + w} ${Y} ${X + w} ${Y + r} V${Y + h - r} Q${X + w} ${Y + h} ${X + w - r} ${Y + h} H${X + r} Q${X} ${Y + h} ${X} ${Y + h - r} V${Y + r} Q${X} ${Y} ${X + r} ${Y} Z`;
const W = 360;

/** Each drawer returns {h, body} at width W, drawn from y=0. */
const draw = {
  toast({ before, after }, L) {
    let y = 14; let body = '';
    const one = (label, text, muted) => {
      const ls = wrap(text, 38).slice(0, 4); const h = 26 + ls.length * 15;
      body += T(26, y + 8, label, 'obj-label');
      y += 16;
      body += shadow(rr(22, y, W - 44, h, 10)) + `<path d="${rr(22, y, W - 44, h, 10)}" fill="var(--surface)" stroke="var(--line-strong)" stroke-width="${muted ? 0.8 : 1.4}"/>` +
        `<circle cx="42" cy="${y + 20}" r="7" fill="none" stroke="var(--line-strong)"/><path d="M39 ${y + 17} l6 6 M45 ${y + 17} l-6 6" stroke="var(--fg)" stroke-width="1.2"/>` +
        ls.map((l, i) => T(58, y + 24 + i * 15, l, muted ? 's' : 'b')).join('');
      y += h + 14;
    };
    if (before) { one(L.before, before, true); body += `<path d="M${W / 2} ${y - 8} v12 m-5 -5 l5 5 l5 -5" fill="none" stroke="var(--line-strong)" stroke-width="1.2"/>`; y += 6; }
    one(L.after, after, false);
    return { h: y, body };
  },
  tag({ version, date, items, bump }, L) {
    const its = items.slice(0, 4).flatMap((it) => wrap(it, 31).slice(0, 2).map((l, i) => [l, i === 0]));
    const h = 92 + its.length * 16 + (bump ? 22 : 0);
    const d = `M70 14 H${W - 22} V${14 + h} H70 L28 ${14 + h / 2} Z`;
    let body = shadow(d) + `<path d="${d}" fill="var(--surface)" stroke="var(--line-strong)" stroke-width="1.2"/>` +
      `<circle cx="52" cy="${14 + h / 2}" r="6" fill="var(--bg)" stroke="var(--line-strong)"/>` +
      T(84, 34, L.release, 'obj-label') + T(84, 60, version, 'big') + T(84 + version.length * 12.5 + 10, 60, date, 's') +
      `<path d="M84 72 H${W - 38}" stroke="var(--line)"/>`;
    its.forEach(([l, first], i) => { const y = 92 + i * 16; body += (first ? `<circle cx="90" cy="${y - 4}" r="2" fill="var(--fg)"/>` : '') + T(100, y, l); });
    if (bump) body += T(84, 92 + its.length * 16 + 8, `Bump: ${bump}`.slice(0, 40), 's');
    return { h: h + 28, body };
  },
  clipboard({ title, items }, L) {
    const cut2 = (t, n) => { const w = wrap(t, n); return w.length > 2 ? [w[0], `${w[1].slice(0, n - 1)}…`] : w; };
    const shown = items.slice(0, 4).map((it) => cut2(it, 34));
    const rows = shown.reduce((a, r) => a + r.length, 0);
    const tl = title ? wrap(title, 36).slice(0, 2) : [];
    const h = 64 + tl.length * 15 + rows * 15 + shown.length * 10 + (items.length > 4 ? 22 : 0) + 10;
    const d = rr(30, 22, W - 60, h, 8);
    let body = shadow(d) + `<path d="${d}" fill="var(--surface)" stroke="var(--line-strong)" stroke-width="1.2"/>` +
      `<path d="${rr(W / 2 - 46, 12, 92, 22, 5)}" fill="var(--surface2)" stroke="var(--line-strong)"/><circle cx="${W / 2}" cy="20" r="3" fill="var(--bg)" stroke="var(--line-strong)"/>` +
      T(50, 52, L.checklist, 'obj-label');
    let y = 70; tl.forEach((l) => { body += T(50, y, l, 'b'); y += 15; }); y += 8;
    shown.forEach((r) => {
      body += `<rect x="50" y="${y - 10}" width="11" height="11" rx="2" fill="none" stroke="var(--fg)" stroke-width="1.1"/>`;
      r.forEach((l, i) => { body += T(70, y + i * 15, l); }); y += r.length * 15 + 10;
    });
    if (items.length > 4) body += T(50, y + 4, `+${items.length - 4} ${L.more}`, 'obj-label');
    return { h: h + 32, body };
  },
  folder({ name, files, checks }, L) {
    const fs = files.slice(0, 8); const h = 74 + Math.ceil(fs.length / 2) * 24 + checks.length * 16 + 16;
    const d = `M24 30 H130 L146 46 H${W - 24} V${30 + h} H24 Z`;
    let body = shadow(d) + `<path d="${d}" fill="var(--surface)" stroke="var(--line-strong)" stroke-width="1.2"/>` +
      `<path d="M24 46 H${W - 24}" stroke="var(--line)"/>` + T(36, 42, L.folder, 'obj-label') + T(40, 72, `${name}/`, 'b');
    fs.forEach((f, i) => {
      const cx = 40 + (i % 2) * 150; const cy = 88 + Math.floor(i / 2) * 24; const s = f.split('/').pop();
      body += `<path d="${rr(cx, cy, 140, 18, 4)}" fill="var(--surface2)" stroke="var(--line)"/>` + T(cx + 8, cy + 13, s.length > 19 ? `${s.slice(0, 18)}…` : s, 's');
    });
    let y = 88 + Math.ceil(fs.length / 2) * 24 + 14;
    checks.forEach((c) => { body += `<path d="M40 ${y - 4} l3 3 l6 -7" fill="none" stroke="var(--fg)" stroke-width="1.4"/>` + T(56, y, c); y += 16; });
    return { h: h + 36, body };
  },
};

/** Which objects a skill draws, in order. A recipe draws every object its skills stand for. */
export const KINDS = { 'copy-tight': ['toast'], 'changelog-writer': ['tag'], 'test-planner': ['clipboard'], 'skill-smith': ['folder'] };
export const DEFAULT_LABELS = { before: 'BEFORE', after: 'AFTER', release: 'RELEASE', checklist: 'RETEST', more: 'more', folder: 'NEW SKILL' };

/**
 * The answer drawn as objects, or null when none of the kinds can be cut from it.
 * @param {string[]} kinds @param {{prompt:string, answer:string}} proof @param {object} [labels]
 */
export function objectFigure(kinds, proof, labels = {}) {
  const L = { ...DEFAULT_LABELS, ...labels };
  const parts = [];
  for (const k of kinds) {
    const data = k === 'toast' ? extract.toast(proof.prompt, proof.answer) : extract[k]?.(proof.answer);
    if (data) parts.push(draw[k](data, L));
  }
  if (!parts.length) return null;
  let y = 0; let body = '';
  for (const p of parts) { body += `<g transform="translate(0 ${y})">${p.body}</g>`; y += p.h; }
  y += 34; // room for the "Real output" tag the page lays over the bottom edge
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${y}" class="obj doc-figure" role="img">${STYLE}${body}</svg>`;
}
