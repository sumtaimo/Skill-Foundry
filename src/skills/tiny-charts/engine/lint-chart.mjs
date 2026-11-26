/**
 * Deterministic static verifier (C1-C8) for playable single-file HTML diagrams produced by tiny-charts.
 * Zero dependencies; usable as ES module or CLI:
 *   node engine/lint-chart.mjs <path-to-html>
 */
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const EXTERNAL_ASSET_RE = /<(?:script|link)\b[^>]+(?:src|href)\s*=\s*["']\s*(?:https?:)?\/\//i;
const VIEWBOX_RE = /<svg\b[^>]*\bviewBox\s*=\s*["']\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s*["']/i;

/**
 * Verify a tiny-charts HTML deliverable against checks C1-C8.
 * @param {string} source
 * @param {{ margin?: number }} [opts]
 * @returns {{ ok: boolean, checks: Record<string, boolean>, errors: string[] }}
 */
export function lintTinyChart(source, { margin = 12 } = {}) {
  const text = String(source ?? '');
  const errors = [];
  const checks = {
    C1_selfContained: false,
    C2_svgViewportA11y: false,
    C3_lightDarkTokens: false,
    C4_playableControls: false,
    C5_showLogicToggle: false,
    C6_declarativeStatechart: false,
    C7_autoPickRationale: false,
    C8_reducedMotion: false,
  };

  // C1: standalone HTML5 without external runtime scripts/stylesheets
  const hasDoctype = /<!doctype\s+html>/i.test(text) && /<html\b/i.test(text);
  const hasExternal = EXTERNAL_ASSET_RE.test(text);
  checks.C1_selfContained = hasDoctype && !hasExternal;
  if (!checks.C1_selfContained) errors.push('C1: Output must be a single self-contained HTML5 document with zero external script/stylesheet URLs.');

  // C2: primary SVG has viewBox, role="img", aria-labelledby, <title>, <desc>, safe text margins
  const svgMatch = /<svg\b[\s\S]*?<\/svg>/i.exec(text);
  const svg = svgMatch ? svgMatch[0] : '';
  const vb = VIEWBOX_RE.exec(svg);
  const hasA11y = /\brole\s*=\s*["']img["']/i.test(svg)
    && /\baria-labelledby\s*=\s*["'][^"']+["']/i.test(svg)
    && /<title\b[^>]*>[\s\S]*?\S[\s\S]*?<\/title>/i.test(svg)
    && /<desc\b[^>]*>[\s\S]*?\S[\s\S]*?<\/desc>/i.test(svg);
  let textOk = false;
  if (vb) {
    const [vx, vy, vw, vh] = vb.slice(1).map(Number);
    if ([vx, vy, vw, vh].every(Number.isFinite) && vw > 0 && vh > 0) {
      textOk = true;
      for (const m of svg.matchAll(/<text\b([^>]*)>/gi)) {
        const xm = /\bx\s*=\s*["'](-?\d+(?:\.\d+)?)["']/i.exec(m[1]);
        const ym = /\by\s*=\s*["'](-?\d+(?:\.\d+)?)["']/i.exec(m[1]);
        if (xm && (Number(xm[1]) < vx + margin || Number(xm[1]) > vx + vw - margin)) textOk = false;
        if (ym && (Number(ym[1]) < vy + margin || Number(ym[1]) > vy + vh - margin)) textOk = false;
      }
    }
  }
  checks.C2_svgViewportA11y = Boolean(vb) && hasA11y && textOk;
  if (!checks.C2_svgViewportA11y) errors.push('C2: Primary <svg> must declare numeric viewBox, role="img", aria-labelledby, <title>, <desc>, and keep <text> inside safe margins.');

  // C3: light and dark theme tokens
  checks.C3_lightDarkTokens = /:root\b/.test(text) && (/data-theme\s*=\s*["']dark["']/i.test(text) || /prefers-color-scheme\s*:\s*dark/i.test(text));
  if (!checks.C3_lightDarkTokens) errors.push('C3: Must support both light (:root) and dark ([data-theme="dark"] or prefers-color-scheme: dark) tokens.');

  // C4: playable interactive controls + aria-live status
  const hasPlayOrStep = /<button\b[^>]*(?:data-tc-play|data-tc-step|aria-pressed)/i.test(text);
  const hasLive = /\baria-live\s*=\s*["']polite["']/i.test(text);
  checks.C4_playableControls = hasPlayOrStep && hasLive;
  if (!checks.C4_playableControls) errors.push('C4: Must provide interactive Play/Step/event controls and an aria-live="polite" status readout.');

  // C5: "Show the logic" toggle revealing Rules + Flowchart
  const hasLogicBtn = /<button\b[^>]*aria-expanded/i.test(text) && /show the logic/i.test(text);
  const hasRulesAndFlow = /rules/i.test(text) && /flowchart/i.test(text);
  checks.C5_showLogicToggle = hasLogicBtn && hasRulesAndFlow;
  if (!checks.C5_showLogicToggle) errors.push('C5: Must include a "Show the logic" toggle (aria-expanded) revealing synchronized Rules and Flowchart.');

  // C6: declarative statechart model
  checks.C6_declarativeStatechart = /\b(?:CHART_SPEC|STATECHART)\b/.test(text)
    && /\bstates\s*:/.test(text)
    && /\btransitions\s*:/.test(text)
    && /\brules\s*:/.test(text);
  if (!checks.C6_declarativeStatechart) errors.push('C6: Must include a declarative statechart spec (states, transitions, rules) driving the diagram and logic panel.');

  // C7: auto-picker chart rationale
  checks.C7_autoPickRationale = /(?:Why this chart|Chart choice)\s*:/i.test(text);
  if (!checks.C7_autoPickRationale) errors.push('C7: Must state why the auto-selected chart type fits the user prompt ("Why this chart:" or "Chart choice:").');

  // C8: reduced-motion fallback
  checks.C8_reducedMotion = /@media\s*\([^)]*prefers-reduced-motion\s*:\s*reduce[^)]*\)/i.test(text);
  if (!checks.C8_reducedMotion) errors.push('C8: Must include @media (prefers-reduced-motion: reduce) fallback.');

  return { ok: errors.length === 0, checks, errors };
}

const isCli = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isCli) {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: node engine/lint-chart.mjs <file.html>');
    process.exit(2);
  }
  const res = lintTinyChart(readFileSync(file, 'utf8'));
  console.log(JSON.stringify(res, null, 2));
  process.exit(res.ok ? 0 : 1);
}
