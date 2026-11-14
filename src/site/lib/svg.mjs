/**
 * Validates and lightly cleans a skill cover SVG for inline use.
 * @governed-by PO_ARCHITECT
 */

/**
 * @param {string} text raw SVG source
 * @returns {string} cleaned SVG markup
 * @throws {Error} on script, foreignObject, on* attributes or external href
 */
export function sanitizeSvg(text) {
  if (typeof text !== 'string') throw new TypeError('sanitizeSvg: text must be a string');
  if (/<script/i.test(text)) throw new Error('sanitizeSvg: <script> not allowed');
  if (/<foreignObject/i.test(text)) throw new Error('sanitizeSvg: <foreignObject> not allowed');
  if (/[\s"'/]on[a-z]+\s*=/i.test(text)) throw new Error('sanitizeSvg: on* attributes not allowed');
  if (/(?:xlink:)?href\s*=\s*["']?\s*(?:https?:|\/\/|javascript:)/i.test(text)) {
    throw new Error('sanitizeSvg: external href not allowed');
  }
  const out = text
    .replace(/<\?xml[\s\S]*?\?>/g, '')
    .replace(/<!DOCTYPE[\s\S]*?>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\r\n?/g, '\n')
    .trim();
  if (!/^<svg[\s>]/i.test(out)) throw new Error('sanitizeSvg: root element must be <svg>');
  return out;
}
