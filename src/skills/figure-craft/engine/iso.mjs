/**
 * figure-craft isometric engine: projection, shape constructors, label layout and SVG rendering.
 * Pure and deterministic. Every fill and stroke is a var(--...) token, none or url(#...).
 * Node 24 ESM, stdlib only, zero deps.
 * @governed-by PO_ARCHITECT
 */

export const C = 0.866;
export const LABEL_GAP = 13;
export const FONT_SIZE = 11;
const CHAR_W = 6.2;
const COL_GAP = 16;

const isNum = (n) => typeof n === 'number' && Number.isFinite(n);
function vec3(v, name) {
  if (!Array.isArray(v) || v.length !== 3 || !v.every(isNum)) throw new TypeError(`${name} must be [x,y,z] numbers`);
  return [v[0], v[1], v[2]];
}
const r2 = (n) => Math.round(n * 100) / 100;
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/** @param {number[]} p [x,y,z] @returns {[number, number]} screen [x,y] */
export function project(p) {
  const [x, y, z] = vec3(p, 'project point');
  return [(x - y) * C, (x + y) * 0.5 - z];
}

const fsOf = (n) => (isNum(n) && n > 0 ? n : FONT_SIZE);

/** Estimated label text width in user units. @param {string} text @param {number} [fontSize] */
export function textWidth(text, fontSize = FONT_SIZE) {
  return String(text).length * CHAR_W * (fsOf(fontSize) / FONT_SIZE);
}

/** Text box of a laid-out label. @param {{text:string,side:string,tx:number,ty:number,fontSize?:number}} l */
export function labelBox(l) {
  if (!l || typeof l.text !== 'string') throw new TypeError('labelBox: label needs text');
  const fs = fsOf(l.fontSize);
  const w = textWidth(l.text, fs);
  const x0 = l.side === 'l' ? l.tx - w : l.tx;
  return { minX: x0, maxX: x0 + w, minY: l.ty - fs / 2 - 1, maxY: l.ty + fs / 2 + 1 };
}

/**
 * @param {{at:number[],size:number[],tone?:string,r?:number,anim?:string,move?:number[],delay?:number,rests?:string,id?:string}} o
 */
export function box(o) {
  if (!o || typeof o !== 'object') throw new TypeError('box: options object required');
  const size = vec3(o.size, 'box size');
  if (size.some((n) => n <= 0)) throw new RangeError('box: size must be positive');
  const s = { kind: 'box', at: vec3(o.at, 'box at'), size, tone: o.tone === 'ink' ? 'ink' : 'plain', r: isNum(o.r) ? o.r : 3 };
  if (o.anim !== undefined) s.anim = String(o.anim);
  if (o.move !== undefined) s.move = vec3(o.move, 'box move');
  if (o.delay !== undefined) { if (!isNum(o.delay)) throw new TypeError('box: delay must be a number'); s.delay = o.delay; }
  if (o.rests !== undefined) s.rests = String(o.rests);
  if (o.id !== undefined) s.id = String(o.id);
  return s;
}

/** @param {number[][]} points @param {{bold?:boolean,id?:string}} [opts] */
export function line(points, opts = {}) {
  if (!Array.isArray(points) || points.length < 2) throw new TypeError('line: at least two points required');
  const s = { kind: 'line', points: points.map((p) => vec3(p, 'line point')), bold: !!opts.bold };
  if (opts.id !== undefined) s.id = String(opts.id);
  return s;
}

/** @param {number[]} at @param {{r?:number,tone?:'ok'|'ink',face?:'top'|'y'|'x',on?:string,id?:string}} [opts] */
export function dot(at, opts = {}) {
  const face = opts.face ?? 'top';
  if (!['top', 'x', 'y'].includes(face)) throw new TypeError('dot: face must be top, x or y');
  const s = { kind: 'dot', at: vec3(at, 'dot at'), r: isNum(opts.r) ? opts.r : 3, tone: opts.tone === 'ink' ? 'ink' : 'ok', face };
  if (opts.on !== undefined) s.on = String(opts.on);
  if (opts.id !== undefined) s.id = String(opts.id);
  return s;
}

/** The 8 corners of a box. @param {{at:number[],size:number[]}} b */
export function boxCorners(b) {
  const [x, y, z] = b.at; const [w, d, h] = b.size;
  const out = [];
  for (const dz of [0, h]) for (const [dx, dy] of [[0, 0], [w, 0], [w, d], [0, d]]) out.push([x + dx, y + dy, z + dz]);
  return out;
}

/** Projected silhouette (convex hexagon) of a box. @returns {number[][]} */
export function boxOutline(b) {
  const pts = boxCorners(b).map(project);
  pts.sort((a, b2) => a[0] - b2[0] || a[1] - b2[1]);
  const cross = (o, a, c) => (a[0] - o[0]) * (c[1] - o[1]) - (a[1] - o[1]) * (c[0] - o[0]);
  const lower = []; const upper = [];
  for (const p of pts) { while (lower.length >= 2 && cross(lower.at(-2), lower.at(-1), p) <= 1e-9) lower.pop(); lower.push(p); }
  for (const p of pts.slice().reverse()) { while (upper.length >= 2 && cross(upper.at(-2), upper.at(-1), p) <= 1e-9) upper.pop(); upper.push(p); }
  return lower.slice(0, -1).concat(upper.slice(0, -1));
}

/** Projected points of any shape, including its moved end position. */
export function shapePoints(s) {
  let pts;
  if (s.kind === 'box') pts = boxCorners(s);
  else if (s.kind === 'line') pts = s.points;
  else pts = [s.at];
  const all = pts.map(project);
  if (s.move) for (const p of pts) all.push(project([p[0] + s.move[0], p[1] + s.move[1], p[2] + s.move[2]]));
  if (s.kind === 'dot') return all.flatMap(([x, y]) => [[x - s.r, y - s.r], [x + s.r, y + s.r]]);
  return all;
}

/**
 * Place labels in a column left or right of the drawing, sorted by y, at least LABEL_GAP apart.
 * @param {{at:number[],text:string,side:'l'|'r'}[]} labels
 * @param {{minX:number,minY:number,maxX:number,maxY:number}} bounds
 * @param {number} [fontSize] label font size in user units (default FONT_SIZE)
 */
export function layoutLabels(labels, bounds, fontSize = FONT_SIZE) {
  if (!isNum(fontSize) || fontSize <= 0) throw new TypeError('layoutLabels: fontSize must be a positive number');
  const gap = Math.max(LABEL_GAP, fontSize + 3);
  if (!Array.isArray(labels)) throw new TypeError('layoutLabels: labels must be an array');
  if (!bounds || !['minX', 'minY', 'maxX', 'maxY'].every((k) => isNum(bounds[k]))) throw new TypeError('layoutLabels: bounds need minX, minY, maxX, maxY');
  const out = labels.map((l, i) => {
    if (!l || typeof l.text !== 'string') throw new TypeError(`layoutLabels: label ${i} needs text`);
    const side = l.side === 'l' ? 'l' : 'r';
    const [x, y] = project(l.at);
    return { text: l.text, side, x, y, tx: side === 'l' ? bounds.minX - COL_GAP : bounds.maxX + COL_GAP, ty: y, i, ...(fontSize !== FONT_SIZE ? { fontSize } : {}) };
  });
  for (const side of ['l', 'r']) {
    const col = out.filter((l) => l.side === side).sort((a, b) => a.ty - b.ty || a.i - b.i);
    for (let k = 1; k < col.length; k++) if (col[k].ty - col[k - 1].ty < gap) col[k].ty = col[k - 1].ty + gap;
  }
  return out.map(({ i, ...l }) => l);
}

const FACE = {
  plain: { top: 'var(--iso-top)', a: 'var(--iso-a)', b: 'var(--iso-b)' },
  ink: { top: 'var(--iso-ink-top)', a: 'var(--iso-ink-a)', b: 'var(--iso-ink-b)' },
};
/** Flat faces using only shared site tokens (safe for preview covers: no gradients). */
const FLAT = {
  plain: { top: 'var(--surface)', a: 'var(--surface2)', b: 'var(--line)' },
  ink: { top: 'var(--line-strong)', a: 'var(--muted)', b: 'var(--fg)' },
};
const pathOf = (pts) => 'M' + pts.map(([x, y]) => `${r2(x)} ${r2(y)}`).join(' L') + ' Z';

/**
 * Render shapes to SVG in array order.
 * @param {object[]} shapes
 * @param {{labels?:{at:number[],text:string,side:'l'|'r'}[],padding?:number,idPrefix?:string,title?:string,flat?:boolean,fontSize?:number}} [opts]
 * @returns {{svg:string, model:object}}
 */
export function renderSvg(shapes, opts = {}) {
  if (!Array.isArray(shapes)) throw new TypeError('renderSvg: shapes must be an array');
  const padding = isNum(opts.padding) ? opts.padding : 12;
  const pre = typeof opts.idPrefix === 'string' && /^[a-z][\w-]*$/i.test(opts.idPrefix) ? opts.idPrefix : 'fc';
  const flat = opts.flat === true;
  if (opts.fontSize !== undefined && (!isNum(opts.fontSize) || opts.fontSize <= 0)) throw new TypeError('renderSvg: fontSize must be a positive number');
  const fontSize = opts.fontSize ?? FONT_SIZE;
  const fills = new Set(); const strokes = new Set();
  const F = (v) => { fills.add(v); return v; };
  const S = (v) => { strokes.add(v); return v; };

  const model = { shapes: shapes.map((s, i) => {
    if (!s || !['box', 'line', 'dot'].includes(s.kind)) throw new TypeError(`renderSvg: shape ${i} has unknown kind`);
    return { ...structuredClone(s), id: s.id ?? `${s.kind}${i}`, drawIndex: i };
  }) };

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const s of model.shapes) for (const [x, y] of shapePoints(s)) {
    minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
  }
  if (!model.shapes.length) { minX = minY = 0; maxX = maxY = 1; }
  maxY += 4; // ground shadow
  const bounds = { minX, minY, maxX, maxY };
  model.labels = layoutLabels(opts.labels ?? [], bounds, fontSize);
  let vx0 = minX, vy0 = minY, vx1 = maxX, vy1 = maxY;
  for (const l of model.labels) {
    const b = labelBox(l);
    vx0 = Math.min(vx0, b.minX, l.x); vx1 = Math.max(vx1, b.maxX, l.x); vy0 = Math.min(vy0, b.minY, l.y); vy1 = Math.max(vy1, b.maxY, l.y);
  }
  model.viewBox = [r2(vx0 - padding), r2(vy0 - padding), r2(vx1 - vx0 + 2 * padding), r2(vy1 - vy0 + 2 * padding)];

  const defs = []; const body = []; const css = []; model.animations = [];
  for (const tone of flat ? [] : ['plain', 'ink']) {
    defs.push(`<linearGradient id="${pre}-${tone}-a" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${FACE[tone].a}"/><stop offset="0.12" stop-color="${FACE[tone].top}" stop-opacity="0.35"/><stop offset="0.3" stop-color="${FACE[tone].a}"/><stop offset="1" stop-color="${FACE[tone].a}"/></linearGradient>`);
    defs.push(`<linearGradient id="${pre}-${tone}-b" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${FACE[tone].b}"/><stop offset="0.85" stop-color="${FACE[tone].b}"/><stop offset="1" stop-color="${FACE[tone].a}"/></linearGradient>`);
  }

  for (const s of model.shapes) {
    const attrs = `data-id="${esc(s.id)}"`;
    let inner = '';
    if (s.kind === 'box') {
      const [x, y, z] = s.at; const [w, d, h] = s.size;
      const P = (a, b, c) => project([x + a, y + b, z + c]);
      const top = [P(0, 0, h), P(w, 0, h), P(w, d, h), P(0, d, h)];
      const fy = [P(0, d, 0), P(w, d, 0), P(w, d, h), P(0, d, h)];
      const fx = [P(w, 0, 0), P(w, d, 0), P(w, d, h), P(w, 0, h)];
      const g = [P(0, 0, 0), P(w, 0, 0), P(w, d, 0), P(0, d, 0)].map(([a, b]) => [a, b + 2]);
      const rr = Math.max(0, Math.min(s.r, w / 2, d / 2));
      if (!s.rests && s.at[2] === 0) inner += `<path d="${pathOf(g)}" fill="${F('var(--line)')}" opacity="0.45"/>`;
      inner += `<path d="${pathOf(fy)}" fill="${F(flat ? FLAT[s.tone].a : `url(#${pre}-${s.tone}-a)`)}" stroke="${S('var(--line-strong)')}" stroke-width="0.6" stroke-linejoin="round"/>`;
      inner += `<path d="${pathOf(fx)}" fill="${F(flat ? FLAT[s.tone].b : `url(#${pre}-${s.tone}-b)`)}" stroke="${S('var(--line-strong)')}" stroke-width="0.6" stroke-linejoin="round"/>`;
      inner += `<path d="${pathOf(top)}" fill="${F((flat ? FLAT : FACE)[s.tone].top)}" stroke="${S('var(--line-strong)')}" stroke-width="${r2(0.6 + rr * 0.2)}" stroke-linejoin="round"/>`;
      const [ex, ey0] = P(w, d, 0); const [, ey1] = P(w, d, h);
      inner += `<path d="M${r2(ex)} ${r2(ey0)} L${r2(ex)} ${r2(ey1)}" fill="none" stroke="${S((flat ? FLAT : FACE)[s.tone].top)}" stroke-width="${r2(Math.max(0.6, rr * 0.4))}" stroke-linecap="round" opacity="0.5"/>`;
    } else if (s.kind === 'line') {
      inner = `<path d="M${s.points.map((p) => project(p).map(r2).join(' ')).join(' L')}" fill="${F('none')}" stroke="${S(s.bold ? 'var(--fg)' : 'var(--line-strong)')}" stroke-width="${s.bold ? 2 : 1}" stroke-linecap="round" stroke-linejoin="round"/>`;
    } else {
      const [cx, cy] = project(s.at);
      const fill = F(s.tone === 'ink' ? (flat ? 'var(--fg)' : 'var(--iso-ink)') : 'var(--ok)');
      // A dot is a unit circle squashed into its face plane: the only circles in the svg are author dots.
      const [rx, ry] = s.face === 'top' ? [s.r * C * 1.15, s.r * 0.58] : [s.r * 0.6, s.r];
      inner = `<circle class="dot" r="1" transform="translate(${r2(cx)} ${r2(cy)}) scale(${r2(rx)} ${r2(ry)})" fill="${fill}"/>`;
    }
    if (s.anim !== undefined || s.move) {
      const cls = `${pre}-anim-${String(s.id).replace(/[^\w-]/g, '_')}`;
      const m = s.move ?? [0, 0, 0];
      const [dx, dy] = project(m);
      const kf = s.move ? `transform:translate(${r2(dx)}px,${r2(dy)}px)` : 'opacity:0.4';
      css.push(`@keyframes ${cls}{0%,15%{transform:none;opacity:1}60%,85%{${kf}}100%{transform:none;opacity:1}}`);
      css.push(`.${cls}{animation:${cls} 3.2s ease-in-out ${r2(s.delay ?? 0)}s infinite}`);
      css.push(`@media (prefers-reduced-motion: reduce){.${cls}{animation:none}}`);
      model.animations.push({ id: s.id, reducedFallback: true });
      body.push(`<g class="${cls}" ${attrs}>${inner}</g>`);
    } else body.push(`<g ${attrs}>${inner}</g>`);
  }

  for (const l of model.labels) {
    const anchor = l.side === 'l' ? 'end' : 'start';
    const lx = l.side === 'l' ? l.tx + 3 : l.tx - 3;
    // Leader is a bare line: no dot or marker at either end. Only author-placed dot() shapes draw round marks.
    body.push(`<g class="${pre}-label"><line class="leader" x1="${r2(l.x)}" y1="${r2(l.y)}" x2="${r2(lx)}" y2="${r2(l.ty)}" stroke="${S('var(--muted)')}" stroke-width="0.75"/>` +
      `<text x="${r2(l.tx)}" y="${r2(l.ty)}" text-anchor="${anchor}" dominant-baseline="middle" font-size="${fontSize}" font-family="system-ui, sans-serif" fill="${F('var(--fg)')}">${esc(l.text)}</text></g>`);
  }

  model.fills = [...fills]; model.strokes = [...strokes];
  const title = typeof opts.title === 'string' ? `<title>${esc(opts.title)}</title>` : '';
  const style = css.length ? `<style>${css.join('')}</style>` : '';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${model.viewBox.join(' ')}" role="img">${title}${defs.length ? `<defs>${defs.join('')}</defs>` : ''}${style}${body.join('')}</svg>`;
  return { svg, model };
}
