/**
 * A wide banner (1280×640) for each skill, drawn from data, never by hand: the skill's name, goal, version, its live
 * eval result, the one command to install it, and its cover, which is the real output a fresh agent produced
 * (a recorded figure run or the agent's answer drawn as an object). When the skill is re-recorded, the banner follows.
 * `standalone` adds the colour tokens, so the file also renders on its own (shared, opened, turned into a PNG).
 * @governed-by PO_ARCHITECT
 */
import { wrap } from './proof.mjs';

const x = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const BANNER_W = 1280;
export const BANNER_H = 640;
/** The left column ends before the cover panel (x 680). Widths are estimated with wide fallback fonts in mind
 * (bold sans about 0.68 em a character, monospace 0.62 em), because the PNG is made on a machine without our fonts. */
export const TEXT_MAX = 560;
export const fitSize = (text, max, perEm, width = TEXT_MAX) => Math.max(10, Math.min(max, Math.floor(width / (String(text).length * perEm))));

const LIGHT = '--bg:#f9f9f8;--surface:#ffffff;--surface2:#f2f2f0;--line:#e8e8e5;--line-strong:#d4d4d0;--fg:#1d1d1b;--muted:#62625e;--faint:#6a6a66';
const DARK = '--bg:#141413;--surface:#1b1b1a;--surface2:#222220;--line:#2c2c2a;--line-strong:#3a3a37;--fg:#ecebe7;--muted:#a3a29d;--faint:#9a9994';

/** The inner <svg> of the cover, placed into a box, keeping its own viewBox (and its own styles). */
function placeCover(coverSvg, bx, by, bw, bh) {
  const m = /^<svg\b([^>]*)>([\s\S]*)<\/svg>\s*$/.exec(String(coverSvg).trim());
  if (!m) return '';
  const vb = /viewBox=["']([^"']+)["']/.exec(m[1])?.[1] ?? `0 0 ${bw} ${bh}`;
  const cls = /class=["']([^"']+)["']/.exec(m[1])?.[1];
  return `<svg x="${bx}" y="${by}" width="${bw}" height="${bh}" viewBox="${vb}" preserveAspectRatio="xMidYMid meet"${cls ? ` class="${cls}"` : ''}>${m[2]}</svg>`;
}

/**
 * @param {{name:string,title:string,tagline:string,version:string,live?:{passed:number,total:number},coverSvg:string,coverKind:string,factoryOnly?:boolean,roles?:string[]}} s
 * @param {{standalone?:boolean}} [o]
 */
export function bannerSvg(s, { standalone = false } = {}) {
  const W = BANNER_W; const H = BANNER_H; const L = 72;
  const name = String(s.title || s.name);
  const goal = wrap(String(s.tagline), 30).slice(0, 3);
  const cmd = s.factoryOnly ? 'Works inside the Skill Foundry repository' : `npx github:sumtaimo/Skill-Foundry add ${s.name}`;
  const live = s.live && s.live.total ? `Tested by a real agent: ${s.live.passed} of ${s.live.total} cases pass` : '';
  const real = s.coverKind === 'concept' ? 'Concept drawing, not real output' : 'Real output from an agent';
  const nameSize = fitSize(name, 68, 0.68);
  const cmdSize = fitSize(cmd, 17, 0.62, TEXT_MAX - 36);
  const cmdW = Math.ceil(36 + cmd.length * cmdSize * 0.62);
  const style = `<style>${standalone ? `.sf-banner{${LIGHT}}@media (prefers-color-scheme:dark){.sf-banner{${DARK}}}` : ''}` +
    `.sf-banner .bn-t{font-family:'Inter',system-ui,-apple-system,'Segoe UI',sans-serif;fill:var(--fg)}` +
    `.sf-banner .bn-m{font-family:'JetBrains Mono',ui-monospace,monospace}</style>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" class="sf-banner" role="img" aria-label="${x(`${name} ${s.version}: ${s.tagline}`)}">${style}` +
    `<rect width="${W}" height="${H}" fill="var(--bg)"/>` +
    `<rect x="680" y="40" width="560" height="560" rx="28" fill="var(--surface2)" stroke="var(--line)"/>` +
    placeCover(s.coverSvg, 712, 72, 496, 476) +
    `<rect x="704" y="556" width="${Math.ceil(real.length * 10.2 + 44)}" height="30" rx="15" fill="var(--surface)" stroke="var(--line-strong)"/>` +
    `<circle cx="722" cy="571" r="4" fill="var(--fg)"/>` +
    `<text x="734" y="576" class="bn-t" font-size="15">${x(real)}</text>` +
    `<text x="${L}" y="96" class="bn-m" font-size="16" fill="var(--muted)" letter-spacing="2">SKILL FOUNDRY</text>` +
    `<text x="${L}" y="${180}" class="bn-t" font-size="${nameSize}" font-weight="650">${x(name)}</text>` +
    `<rect x="${L}" y="206" width="${String(s.version).length * 11 + 34}" height="32" rx="16" fill="var(--surface)" stroke="var(--line-strong)"/>` +
    `<text x="${L + 17}" y="228" class="bn-m" font-size="17" fill="var(--fg)">${x(s.version)}</text>` +
    goal.map((g, i) => `<text x="${L}" y="${300 + i * 38}" class="bn-t" font-size="28" fill="var(--fg)">${x(g)}</text>`).join('') +
    (live ? `<path d="M${L} ${448} l6 6 l12 -14" fill="none" stroke="var(--fg)" stroke-width="2.4"/><text x="${L + 28}" y="${454}" class="bn-t" font-size="19" fill="var(--muted)">${x(live)}</text>` : '') +
    `<rect x="${L}" y="502" width="${cmdW}" height="56" rx="12" fill="var(--fg)"/>` +
    `<text x="${L + 18}" y="537" class="bn-m" font-size="${cmdSize}" fill="var(--bg)">${x(cmd)}</text>` +
    `</svg>`;
}
