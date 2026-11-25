/**
 * Deterministic static verifier (M1-M8) for 2D animated mechanism SVGs.
 * Zero dependencies; usable as ES module or CLI:
 *   node engine/lint-svg.mjs <path-to-html-or-svg>
 */
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const RAW_COLOR_RE = /\b(fill|stroke|stop-color)\s*=\s*["']\s*(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\))\s*["']/gi;
const VIEWBOX_RE = /<svg\b[^>]*\bviewBox\s*=\s*["']\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s*["']/i;

/**
 * Inspect HTML or standalone SVG text against mechanism rules M1-M8.
 * @param {string} source
 * @param {{ requireInteractive?: boolean, margin?: number }} [opts]
 * @returns {{ ok: boolean, checks: Record<string, boolean>, errors: string[], viewBox: number[] | null }}
 */
export function lintMechanismSvg(source, { requireInteractive = true, margin = 16 } = {}) {
  const text = String(source ?? '');
  const errors = [];
  const checks = {
    M1_viewBox: false,
    M2_defs: false,
    M3_a11yTitleDesc: false,
    M4_playPause: false,
    M5_reducedMotion: false,
    M6_noRawHexInSvg: false,
    M7_safeTextMargins: false,
    M8_lightDarkTokens: false,
  };

  const svgMatch = /<svg\b[\s\S]*?<\/svg>/i.exec(text);
  const svgBlock = svgMatch ? svgMatch[0] : '';

  // M1: explicit numeric viewBox
  const vbMatch = VIEWBOX_RE.exec(svgBlock);
  let viewBox = null;
  if (vbMatch) {
    const nums = vbMatch.slice(1).map(Number);
    if (nums.every(Number.isFinite) && nums[2] > 0 && nums[3] > 0) {
      viewBox = nums;
      checks.M1_viewBox = true;
    }
  }
  if (!checks.M1_viewBox) errors.push('M1: <svg> must declare a valid numeric viewBox="x y w h" with positive width and height.');

  // M2: <defs> with gradient or marker
  const hasDefs = /<defs\b[\s\S]*?<\/defs>/i.test(svgBlock);
  const hasDefItem = /<(?:linearGradient|radialGradient|marker|pattern|filter)\b/i.test(svgBlock);
  checks.M2_defs = hasDefs && hasDefItem;
  if (!checks.M2_defs) errors.push('M2: <svg> must include <defs> with at least one gradient, marker, pattern or filter.');

  // M3: role="img", aria-labelledby, <title>, <desc>
  const hasRoleOrLabel = /\brole\s*=\s*["']img["']/i.test(svgBlock) && /\baria-labelledby\s*=\s*["'][^"']+["']/i.test(svgBlock);
  const hasTitle = /<title\b[^>]*>[\s\S]*?\S[\s\S]*?<\/title>/i.test(svgBlock);
  const hasDesc = /<desc\b[^>]*>[\s\S]*?\S[\s\S]*?<\/desc>/i.test(svgBlock);
  checks.M3_a11yTitleDesc = hasRoleOrLabel && hasTitle && hasDesc;
  if (!checks.M3_a11yTitleDesc) errors.push('M3: <svg> must include role="img", aria-labelledby, <title> and <desc>.');

  // M4: Play/Pause interactive control
  if (!requireInteractive) {
    checks.M4_playPause = true;
  } else {
    const hasButton = /<button\b[^>]*aria-pressed/i.test(text) || /aria-pressed\s*=\s*\{/i.test(text);
    const hasPauseWiring = /data-paused|animation-play-state\s*:\s*paused|pauseAnimations/i.test(text);
    checks.M4_playPause = hasButton && hasPauseWiring;
    if (!checks.M4_playPause) errors.push('M4: Interactive wrapper must include a Play/Pause <button> with aria-pressed and pause state wiring.');
  }

  // M5: prefers-reduced-motion: reduce
  checks.M5_reducedMotion = /@media\s*\([^)]*prefers-reduced-motion\s*:\s*reduce[^)]*\)/i.test(text);
  if (!checks.M5_reducedMotion) errors.push('M5: Styles must include @media (prefers-reduced-motion: reduce) fallback.');

  // M6: zero raw hex / rgb() color attributes inside <svg>
  const svgWithoutStyle = svgBlock.replace(/<style\b[\s\S]*?<\/style>/gi, '');
  const rawMatches = [...svgWithoutStyle.matchAll(RAW_COLOR_RE)].map((m) => m[0]);
  checks.M6_noRawHexInSvg = svgBlock.length > 0 && rawMatches.length === 0;
  if (!checks.M6_noRawHexInSvg) {
    errors.push(`M6: Found raw color literal(s) inside <svg> attributes (${rawMatches.slice(0, 3).join(', ')}); bind colors to var(--...), url(#...), currentColor or none.`);
  }

  // M7: <text> coordinates stay within viewBox safe margins
  if (viewBox) {
    const [vx, vy, vw, vh] = viewBox;
    const textTags = [...svgBlock.matchAll(/<text\b([^>]*)>/gi)];
    const badTexts = [];
    for (const m of textTags) {
      const attrs = m[1];
      const xm = /\bx\s*=\s*["'](-?\d+(?:\.\d+)?)["']/i.exec(attrs);
      const ym = /\by\s*=\s*["'](-?\d+(?:\.\d+)?)["']/i.exec(attrs);
      if (xm) {
        const x = Number(xm[1]);
        if (x < vx + margin || x > vx + vw - margin) badTexts.push(`x=${x}`);
      }
      if (ym) {
        const y = Number(ym[1]);
        if (y < vy + margin || y > vy + vh - margin) badTexts.push(`y=${y}`);
      }
    }
    checks.M7_safeTextMargins = badTexts.length === 0;
    if (!checks.M7_safeTextMargins) {
      errors.push(`M7: <text> coordinates too close to viewBox edge (${badTexts.slice(0, 4).join(', ')}); keep >= ${margin}px margin.`);
    }
  } else {
    checks.M7_safeTextMargins = false;
  }

  // M8: light + dark CSS custom properties
  const hasRoot = /:root\b/.test(text);
  const hasDark = /data-theme\s*=\s*["']dark["']|prefers-color-scheme\s*:\s*dark/i.test(text);
  checks.M8_lightDarkTokens = hasRoot && hasDark;
  if (!checks.M8_lightDarkTokens) errors.push('M8: Must define light (:root) and dark ([data-theme="dark"] or prefers-color-scheme: dark) CSS tokens.');

  return { ok: errors.length === 0, checks, errors, viewBox };
}

const isCli = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isCli) {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: node engine/lint-svg.mjs <file.html|file.svg>');
    process.exit(2);
  }
  const src = readFileSync(file, 'utf8');
  const requireInteractive = !file.toLowerCase().endsWith('.svg');
  const result = lintMechanismSvg(src, { requireInteractive });
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.ok ? 0 : 1);
}
