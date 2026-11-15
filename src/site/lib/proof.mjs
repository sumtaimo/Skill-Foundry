/**
 * Real-agent proof for the showcase: what a fresh agent actually answered when it used the skill,
 * and a document figure drawn from that answer. Nothing here is written by hand: the text comes word for word
 * from a recording made by src/factory/portable-check.mjs (an empty project outside this repository) or,
 * for a `scope: factory` skill, from a live eval recording made by a fresh agent.
 * @governed-by PO_ARCHITECT
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { checkRecording } from '../../factory/portable-check.mjs';
import { scoreLive } from '../../factory/live-evals.mjs';

/**
 * The real answer to show for a skill, or null when it has none that passes.
 * Order: a current, passing portable-check recording; else the live recording of the registry `showcase` case;
 * else the first live recording that passes its eval case.
 * @param {string} skillDir @param {{showcase?:string}} [opts]
 * @returns {{source:'portable'|'live', prompt:string, answer:string, agent:string, caseId?:string}|null}
 */
export function loadProof(skillDir, { showcase } = {}) {
  const portable = join(skillDir, 'evals', 'portable.json');
  if (existsSync(portable) && checkRecording(skillDir).ok) {
    const r = JSON.parse(readFileSync(portable, 'utf8'));
    return { source: 'portable', prompt: String(r.prompt), answer: String(r.answer), agent: String(r.agent ?? '') };
  }
  if (!existsSync(join(skillDir, 'evals', 'live'))) return null;
  const scored = scoreLive(skillDir);
  const passing = scored.results.filter((x) => x.ok).map((x) => x.id);
  const order = showcase && passing.includes(showcase) ? [showcase, ...passing.filter((x) => x !== showcase)] : passing;
  for (const id of order) {
    const p = join(skillDir, 'evals', 'live', `${id}.json`);
    if (!existsSync(p)) continue;
    const r = JSON.parse(readFileSync(p, 'utf8'));
    if (typeof r.output !== 'string' || !r.output.trim()) continue;
    return { source: 'live', prompt: String(r.prompt), answer: r.output, agent: String(r.agent ?? ''), caseId: id };
  }
  return null;
}

/**
 * The tokens.css a fresh agent wrote in the live run of one eval case, or null. It counts only when that case's live
 * recording passes and the file is byte for byte the one the run manifest hashed, so nothing hand-written can be drawn.
 * @param {string} skillDir @param {string} [caseId]
 * @returns {{css:string, caseId:string, prompt:string, answer:string, run:string, sha256:string}|null}
 */
export function loadTokens(skillDir, caseId) {
  if (typeof caseId !== 'string' || !caseId) return null;
  const p = join(skillDir, 'evals', 'live', `${caseId}.json`);
  if (!existsSync(p)) return null;
  const rec = JSON.parse(readFileSync(p, 'utf8'));
  if (typeof rec.run !== 'string' || !/^runs\/[a-z0-9-]+\/[0-9a-f]+$/.test(rec.run)) return null;
  if (!scoreLive(skillDir).results.find((r) => r.id === caseId)?.ok) return null;
  const runDir = join(resolve(skillDir, '..', '..', '..'), rec.run);
  const mp = join(runDir, 'manifest.json'); const cp = join(runDir, 'output', 'tokens.css');
  if (!existsSync(mp) || !existsSync(cp)) return null;
  const m = JSON.parse(readFileSync(mp, 'utf8'));
  const css = readFileSync(cp, 'utf8');
  const sha256 = createHash('sha256').update(readFileSync(cp)).digest('hex');
  if (m.status !== 'pass' || !m.files?.some((f) => f.path === 'tokens.css' && f.sha256 === sha256)) return null;
  return { css, caseId, prompt: String(rec.prompt), answer: String(rec.output ?? ''), run: rec.run, sha256 };
}

const x = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Wrap one line of text at word boundaries to at most `width` characters. */
export function wrap(line, width) {
  const out = [];
  let cur = '';
  for (const word of String(line).split(/(\s+)/)) {
    if (!word) continue;
    if ((cur + word).length <= width) { cur += word; continue; }
    if (cur.trim()) out.push(cur.replace(/\s+$/, ''));
    cur = word.trimStart();
    while (cur.length > width) { out.push(cur.slice(0, width)); cur = cur.slice(width); }
  }
  if (cur.trim() || !out.length) out.push(cur.replace(/\s+$/, ''));
  return out;
}

/**
 * Lines of the answer for the figure. Code-fence markers (```) are formatting, not content, so they are left out;
 * every other line is the agent's text, only wrapped.
 */
export function figureLines(answer, width = 41, max = 15) {
  const lines = [];
  for (const raw of String(answer).replace(/\r\n?/g, '\n').split('\n')) {
    if (/^\s*```/.test(raw)) continue;
    if (!raw.trim()) { if (lines.length && lines.at(-1) !== '') lines.push(''); continue; }
    lines.push(...wrap(raw, width));
  }
  while (lines.at(-1) === '') lines.pop();
  const cut = lines.length > max;
  return { lines: cut ? lines.slice(0, max - 1) : lines, cut };
}

/**
 * A sheet of paper with the request on top and the agent's real answer below, in site tokens only.
 * @param {{prompt:string, answer:string}} proof @param {{askLabel?:string, moreLabel?:string}} [labels]
 */
export function docFigure(proof, { askLabel = 'Request', moreLabel = 'continues on the page' } = {}) {
  const W = 360; const pad = 22; const lh = 15;
  // Monospace at 11px is about 6.6 units a character; the text column is about 280 units wide.
  const askAll = wrap(String(proof.prompt).replace(/\s+/g, ' ').trim(), 42);
  const ask = askAll.length > 2 ? [askAll[0], `${askAll[1].slice(0, 40)}…`] : askAll;
  const { lines, cut } = figureLines(proof.answer);
  const askTop = 52; const bodyTop = askTop + ask.length * 14 + 26;
  const H = bodyTop + lines.length * lh + (cut ? lh + 6 : 0) + pad;
  const fold = 22;
  const sheet = `M${pad} 10 H${W - pad - fold} L${W - pad} ${10 + fold} V${H - 6} H${pad} Z`;
  const text = (ty, s, cls) => `<text x="${pad + 16}" y="${ty}" class="${cls}">${x(s)}</text>`;
  const body = lines.map((l, i) => {
    const y = bodyTop + i * lh;
    const strong = /^(#{1,6}\s|\*\*|Rewritten copy:|What changed:|Bump:)/.test(l);
    return l ? text(y, l.replace(/^#{1,6}\s+/, '').replace(/\*\*/g, ''), strong ? 'doc-strong' : 'doc-line') : '';
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" class="doc-figure" role="img">` +
    `<style>.doc-figure text{font-family:'JetBrains Mono',ui-monospace,monospace}.doc-figure .doc-line{font-size:11px;fill:var(--fg)}` +
    `.doc-figure .doc-strong{font-size:11px;font-weight:600;fill:var(--fg)}.doc-figure .doc-ask{font-size:10.5px;fill:var(--muted)}` +
    `.doc-figure .doc-label{font-size:9px;letter-spacing:.08em;fill:var(--muted)}.doc-figure .doc-more{font-size:10px;fill:var(--muted);font-style:italic}</style>` +
    `<path d="${sheet}" transform="translate(4 5)" fill="var(--line)" opacity="0.5"/>` +
    `<path d="${sheet}" fill="var(--surface)" stroke="var(--line-strong)" stroke-width="0.8"/>` +
    `<path d="M${W - pad - fold} 10 V${10 + fold} H${W - pad}" fill="var(--surface2)" stroke="var(--line-strong)" stroke-width="0.8"/>` +
    `<rect x="${pad}" y="${askTop - 22}" width="${W - 2 * pad - fold}" height="${ask.length * 14 + 16}" fill="var(--surface2)"/>` +
    `<text x="${pad + 16}" y="${askTop - 8}" class="doc-label">${x(askLabel.toUpperCase())}</text>` +
    ask.map((l, i) => `<text x="${pad + 16}" y="${askTop + 6 + i * 14}" class="doc-ask">${x(l)}</text>`).join('') +
    `<path d="M${pad + 16} ${bodyTop - 14} H${W - pad - 16}" stroke="var(--line)" stroke-width="0.8"/>` +
    `<rect x="${pad}" y="${bodyTop - 10}" width="3" height="${lines.length * lh}" fill="var(--line-strong)"/>` +
    body +
    (cut ? text(bodyTop + lines.length * lh + 4, `… ${moreLabel}`, 'doc-more') : '') +
    `</svg>`;
}
