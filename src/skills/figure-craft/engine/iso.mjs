/**
 * figure-craft isometric engine: projection, shape constructors, label layout and SVG rendering.
 * Pure and deterministic. Every fill and stroke is a var(--...) token, none or url(#...).
 * Node 24 ESM, stdlib only, zero deps.
 * @governed-by PO_ARCHITECT
 */
import { tokensCssScoped } from './tokens.mjs';

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

/** What a solid is made of. `glass` is see-through: shapes drawn before it stay visible. */
export const MATERIALS = ['plain', 'ink', 'steel', 'white', 'dark', 'glass', 'blue', 'red', 'green', 'amber'];
/** Stroke tones for lines: pipes and flows. */
export const LINE_TONES = ['copper', 'cold', 'warm'];
/** Sides a detail can sit on. `x` and `y` face the reader; `-x` and `-y` are the back sides, seen after turning the object (orbit). */
export const FACES = ['top', 'x', 'y', '-x', '-y'];
const KINDS = ['box', 'line', 'dot', 'panel', 'disc', 'glow'];
const backFace = (s) => s.on !== undefined && (s.face === '-x' || s.face === '-y');

/**
 * `material` sets the surface (see MATERIALS); `round: true` draws an upright cylinder (width = depth),
 * `round: 'x'` or `'y'` one lying along that axis (the two sides across the axis equal).
 * `when: '<state>'` draws the shape only in that state (for example a door `when: 'open'` and another `when: 'closed'`).
 * `r` rounds the upright edges (default 1.5; 0 for sharp).
 * `open: 'x' | 'y' | 'xy'` (or `'-x'`, `'-y'` for a back side seen after a turn, or an array) removes those sides so the inside shows (walls `wall` thick); shapes with
 * `inside: '<this id>'` are the contents, seen only through the opening. One open side shows little of a deep
 * body; `'xy'` is a cutaway that shows the whole inside.
 * @param {{at:number[],size:number[],material?:string,round?:boolean,tone?:string,r?:number,anim?:string,move?:number[],delay?:number,rests?:string,id?:string}} o
 */
export function box(o) {
  if (!o || typeof o !== 'object') throw new TypeError('box: options object required');
  const size = vec3(o.size, 'box size');
  if (size.some((n) => n <= 0)) throw new RangeError('box: size must be positive');
  const material = o.material ?? (o.tone === 'ink' ? 'ink' : 'plain');
  if (!MATERIALS.includes(material)) throw new TypeError(`box: material must be one of ${MATERIALS.join(', ')}`);
  const s = { kind: 'box', at: vec3(o.at, 'box at'), size, tone: material === 'ink' || material === 'dark' ? 'ink' : 'plain', material, r: isNum(o.r) && o.r >= 0 ? o.r : 1.5 };
  if (o.open !== undefined) {
    // Sides facing the reader (x, y) show the inside now; back sides (-x, -y) show it after the object is turned.
    const faces = Array.isArray(o.open) ? o.open : o.open === 'xy' ? ['x', 'y'] : [o.open];
    if (!faces.length || !faces.every((f) => ['x', 'y', '-x', '-y'].includes(f))) throw new TypeError('box: open must be x, y, xy, -x, -y or an array of those sides');
    const front = ['x', 'y'].filter((f) => faces.includes(f)).join('');
    const back = ['-x', '-y'].filter((f) => faces.includes(f));
    if (front) s.open = front;
    if (back.length) s.openBack = back;
    s.wall = isNum(o.wall) && o.wall > 0 ? o.wall : 2;
    if (s.wall * 2 >= Math.min(...size)) throw new RangeError('box: wall is too thick for this box');
  }
  if (o.inside !== undefined) s.inside = String(o.inside);
  if (o.when !== undefined) s.when = String(o.when);
  if (o.round !== undefined && o.round !== false) {
    // A cylinder: upright (true or 'z'), or lying along x or y.
    const axis = o.round === true ? 'z' : o.round;
    if (!['x', 'y', 'z'].includes(axis)) throw new TypeError('box: round must be true, x, y or z');
    const [a, b] = axis === 'z' ? [size[0], size[1]] : axis === 'x' ? [size[1], size[2]] : [size[0], size[2]];
    if (a !== b) throw new RangeError('box: a round box needs two equal sides across its axis');
    s.round = axis === 'z' ? true : axis;
  }
  if (o.anim !== undefined) s.anim = String(o.anim);
  if (o.move !== undefined) s.move = vec3(o.move, 'box move');
  if (o.delay !== undefined) { if (!isNum(o.delay)) throw new TypeError('box: delay must be a number'); s.delay = o.delay; }
  if (o.rests !== undefined) s.rests = String(o.rests);
  if (o.id !== undefined) s.id = String(o.id);
  return s;
}

/**
 * A line. With `on` and `face` it is a face detail of that box (a seam, handle, vent, shelf edge).
 * `tone` colours a pipe or flow: copper, cold or warm.
 * @param {number[][]} points @param {{bold?:boolean,id?:string,on?:string,face?:'top'|'y'|'x',tone?:string}} [opts]
 */
export function line(points, opts = {}) {
  if (!Array.isArray(points) || points.length < 2) throw new TypeError('line: at least two points required');
  const s = { kind: 'line', points: points.map((p) => vec3(p, 'line point')), bold: !!opts.bold };
  if (opts.inside !== undefined) s.inside = String(opts.inside);
  if (opts.when !== undefined) s.when = String(opts.when);
  if (opts.tone !== undefined) { if (!LINE_TONES.includes(opts.tone)) throw new TypeError(`line: tone must be one of ${LINE_TONES.join(', ')}`); s.tone = opts.tone; }
  if (opts.on !== undefined) {
    const face = opts.face ?? 'top';
    if (!FACES.includes(face)) throw new TypeError('line: face must be top, x, y, -x or -y');
    s.on = String(opts.on); s.face = face;
  }
  if (opts.id !== undefined) s.id = String(opts.id);
  return s;
}

/**
 * A filled panel on a visible face of a box: a door front, a display, a window, a drawer, a vent plate.
 * @param {number[][]} corners two opposite corners [x,y,z] lying in the face
 * @param {{on:string,face:'top'|'y'|'x',material?:string,id?:string}} opts
 */
export function panel(corners, opts) {
  if (!Array.isArray(corners) || corners.length !== 2) throw new TypeError('panel: two opposite corners required');
  if (!opts || typeof opts.on !== 'string') throw new TypeError('panel: on (box id) required');
  const face = opts.face ?? 'top';
  if (!FACES.includes(face)) throw new TypeError('panel: face must be top, x, y, -x or -y');
  const material = opts.material ?? 'plain';
  if (!MATERIALS.includes(material)) throw new TypeError(`panel: material must be one of ${MATERIALS.join(', ')}`);
  const s = { kind: 'panel', points: corners.map((p) => vec3(p, 'panel corner')), on: opts.on, face, material };
  if (opts.when !== undefined) s.when = String(opts.when);
  if (opts.id !== undefined) s.id = String(opts.id);
  return s;
}

/**
 * A round feature on a face: a dial, a knob, a button, a porthole, a screw head, a badge.
 * @param {number[]} at centre [x,y,z] lying in the face
 * @param {{on:string,face:string,r:number,material?:string,id?:string,when?:string}} opts
 */
export function disc(at, opts) {
  if (!opts || typeof opts.on !== 'string') throw new TypeError('disc: on (box id) required');
  const face = opts.face ?? 'top';
  if (!FACES.includes(face)) throw new TypeError('disc: face must be top, x, y, -x or -y');
  if (!isNum(opts.r) || opts.r <= 0) throw new RangeError('disc: r must be positive');
  const material = opts.material ?? 'plain';
  if (!MATERIALS.includes(material)) throw new TypeError(`disc: material must be one of ${MATERIALS.join(', ')}`);
  const s = { kind: 'disc', at: vec3(at, 'disc at'), r: opts.r, on: opts.on, face, material };
  if (opts.id !== undefined) s.id = String(opts.id);
  if (opts.when !== undefined) s.when = String(opts.when);
  return s;
}

/** Points around a disc, in 3D. @param {{at:number[],r:number,face:string}} s @param {number} [n] */
export function discPoints(s, n = 28) {
  const [u, v] = s.face === 'top' ? [[1, 0, 0], [0, 1, 0]] : s.face === 'x' || s.face === '-x' ? [[0, 1, 0], [0, 0, 1]] : [[1, 0, 0], [0, 0, 1]];
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2; const c = Math.cos(a) * s.r; const d = Math.sin(a) * s.r;
    return [s.at[0] + u[0] * c + v[0] * d, s.at[1] + u[1] * c + v[1] * d, s.at[2] + u[2] * c + v[2] * d];
  });
}

/**
 * A soft pool of light: a lamp inside a cabinet, a glowing display, a pilot light.
 * @param {number[]} at @param {{r?:number,inside?:string,id?:string,when?:string}} [opts]
 */
export function glow(at, opts = {}) {
  const s = { kind: 'glow', at: vec3(at, 'glow at'), r: isNum(opts.r) && opts.r > 0 ? opts.r : 12 };
  if (opts.inside !== undefined) s.inside = String(opts.inside);
  if (opts.id !== undefined) s.id = String(opts.id);
  if (opts.when !== undefined) s.when = String(opts.when);
  return s;
}

/** The four corners of a panel, in order around the face. */
export function panelCorners(s) {
  const [p, q] = s.points;
  if (s.face === 'top') return [[p[0], p[1], p[2]], [q[0], p[1], p[2]], [q[0], q[1], p[2]], [p[0], q[1], p[2]]];
  if (s.face === 'x' || s.face === '-x') return [[p[0], p[1], p[2]], [p[0], q[1], p[2]], [p[0], q[1], q[2]], [p[0], p[1], q[2]]];
  return [[p[0], p[1], p[2]], [q[0], p[1], p[2]], [q[0], p[1], q[2]], [p[0], p[1], q[2]]];
}

/** @param {number[]} at @param {{r?:number,tone?:'ok'|'ink',face?:'top'|'y'|'x',on?:string,id?:string}} [opts] */
export function dot(at, opts = {}) {
  const face = opts.face ?? 'top';
  if (!FACES.includes(face)) throw new TypeError('dot: face must be top, x, y, -x or -y');
  const s = { kind: 'dot', at: vec3(at, 'dot at'), r: isNum(opts.r) ? opts.r : 3, tone: opts.tone === 'ink' ? 'ink' : 'ok', face };
  if (opts.on !== undefined) s.on = String(opts.on);
  if (opts.id !== undefined) s.id = String(opts.id);
  return s;
}

/** Most labels a figure may carry: all visible at once, or revealed one at a time on hover. */
export const MAX_LABELS = { always: 5, hover: 9 };

/**
 * The box a label names: the smallest box whose volume holds the label's 3D anchor, or null.
 * @param {{at:number[]}} label @param {object[]} shapes
 */
export function labelTarget(label, shapes) {
  if (!label || !Array.isArray(label.at)) return null;
  const e = 1e-6;
  const holds = (b) => [0, 1, 2].every((k) => label.at[k] >= b.at[k] - e && label.at[k] <= b.at[k] + b.size[k] + e);
  const vol = (b) => b.size[0] * b.size[1] * b.size[2];
  return shapes.filter((x) => x.kind === 'box' && holds(x)).sort((p, q) => vol(p) - vol(q))[0] ?? null;
}

/**
 * The opening of an open box, as 3D corners of the hole (inset by the wall), or null.
 * For a cutaway (`open: 'xy'`) it is the six-cornered outline of both open sides together.
 * @param {{at:number[],size:number[],open?:string,wall?:number}} b
 */
export function openingCorners(b) {
  if (!b || !['x', 'y', 'xy'].includes(b.open)) return null;
  const [x, y, z] = b.at; const [w, d, h] = b.size; const t = b.wall ?? 2;
  if (b.open === 'x') return [[x + w, y + t, z + t], [x + w, y + d - t, z + t], [x + w, y + d - t, z + h - t], [x + w, y + t, z + h - t]];
  if (b.open === 'y') return [[x + t, y + d, z + t], [x + w - t, y + d, z + t], [x + w - t, y + d, z + h - t], [x + t, y + d, z + h - t]];
  return [[x + t, y + d, z + t], [x + w, y + d, z + t], [x + w, y + t, z + t], [x + w, y + t, z + h - t], [x + w, y + d, z + h - t], [x + t, y + d, z + h - t]];
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
  return hull(boxCorners(b).map(project));
}

/** Convex hull of 2D points. */
export function hull(points) {
  const pts = points.slice();
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
  else if (s.kind === 'panel') pts = panelCorners(s);
  else if (s.kind === 'disc') pts = discPoints(s, 8);
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
    return { text: l.text, side, at: vec3(l.at, `label ${i} at`), x, y, tx: side === 'l' ? bounds.minX - COL_GAP : bounds.maxX + COL_GAP, ty: y, i, ...(fontSize !== FONT_SIZE ? { fontSize } : {}) };
  });
  for (const side of ['l', 'r']) {
    const col = out.filter((l) => l.side === side).sort((a, b) => a.ty - b.ty || a.i - b.i);
    for (let k = 1; k < col.length; k++) if (col[k].ty - col[k - 1].ty < gap) col[k].ty = col[k - 1].ty + gap;
  }
  return out.map(({ i, ...l }) => l);
}

/** Token names of each material's three visible faces: top, a (left-facing, lit) and b (right-facing, shaded). */
const FACE = {
  plain: { top: 'var(--iso-top)', a: 'var(--iso-a)', b: 'var(--iso-b)' },
  ink: { top: 'var(--iso-ink-top)', a: 'var(--iso-ink-a)', b: 'var(--iso-ink-b)' },
  dark: { top: 'var(--iso-ink-top)', a: 'var(--iso-ink-a)', b: 'var(--iso-ink-b)' },
  steel: { top: 'var(--mat-steel-top)', a: 'var(--mat-steel-a)', b: 'var(--mat-steel-b)' },
  white: { top: 'var(--mat-white-top)', a: 'var(--mat-white-a)', b: 'var(--mat-white-b)' },
  glass: { top: 'var(--mat-glass)', a: 'var(--mat-glass)', b: 'var(--mat-glass)' },
  ...Object.fromEntries(['blue', 'red', 'green', 'amber'].map((t) => [t, { top: `var(--mat-${t}-top)`, a: `var(--mat-${t}-a)`, b: `var(--mat-${t}-b)` }])),
};
/** Flat faces using only shared site tokens (safe for preview covers: no gradients, no shadows). */
const FLAT_LIGHT = { top: 'var(--surface)', a: 'var(--surface2)', b: 'var(--line)' };
const FLAT_DARK = { top: 'var(--line-strong)', a: 'var(--muted)', b: 'var(--fg)' };
const FLAT = { plain: FLAT_LIGHT, steel: FLAT_LIGHT, white: FLAT_LIGHT, blue: FLAT_LIGHT, red: FLAT_LIGHT, green: FLAT_LIGHT, amber: FLAT_LIGHT, glass: { top: 'var(--line)', a: 'var(--line)', b: 'var(--line)' }, ink: FLAT_DARK, dark: FLAT_DARK };
const GLASS_OPACITY = 0.38;
/** Light comes from the upper left: the left-facing face is lit and shadows fall toward +x. */
const SHADOW = { dx: 0.5, dy: -0.12, max: 34, opacity: 0.17, blur: 3, contact: 0.24, contactBlur: 0.9 };
const TONE_STROKE = { copper: 'var(--mat-copper)', cold: 'var(--mat-cold)', warm: 'var(--mat-warm)' };
const pathOf = (pts) => 'M' + pts.map(([x, y]) => `${r2(x)} ${r2(y)}`).join(' L') + ' Z';

/**
 * Render shapes to SVG in array order.
 * @param {object[]} shapes
 * @param {{labels?:{at:number[],text:string,side?:'l'|'r'}[],labelMode?:'hover'|'always',requiredParts?:string[],padding?:number,idPrefix?:string,title?:string,flat?:boolean,fontSize?:number}} [opts]
 * labelMode 'hover' (default): a label appears as a chip beside its part, with motion, while the part is hovered, focused or tapped;
 * no room is reserved for labels, so the object fills the frame. 'always': every label is drawn in a side column.
 * requiredParts: ids of the parts the idea needs; lint L14 checks each is drawn and labelled.
 * Unless `flat`, the SVG carries its own colour tokens, materials, lighting and soft shadows, so it also works as a standalone file.
 * @returns {{svg:string, model:object}}
 */
export function renderSvg(shapes, opts = {}) {
  if (!Array.isArray(shapes)) throw new TypeError('renderSvg: shapes must be an array');
  const padding = isNum(opts.padding) ? opts.padding : 12;
  const pre = typeof opts.idPrefix === 'string' && /^[a-z][\w-]*$/i.test(opts.idPrefix) ? opts.idPrefix : 'fc';
  const flat = opts.flat === true;
  if (opts.fontSize !== undefined && (!isNum(opts.fontSize) || opts.fontSize <= 0)) throw new TypeError('renderSvg: fontSize must be a positive number');
  let fontSize = opts.fontSize ?? FONT_SIZE;
  const labelMode = opts.labelMode ?? 'hover';
  if (!['hover', 'always'].includes(labelMode)) throw new TypeError('renderSvg: labelMode must be hover or always');
  if (opts.requiredParts !== undefined && (!Array.isArray(opts.requiredParts) || !opts.requiredParts.every((x) => typeof x === 'string'))) throw new TypeError('renderSvg: requiredParts must be an array of ids');
  const hover = labelMode === 'hover';
  const fills = new Set(); const strokes = new Set();
  const F = (v) => { fills.add(v); return v; };
  const S = (v) => { strokes.add(v); return v; };

  // Details on the back sides are not drawn in this view; they appear when the object is turned.
  const model = { shapes: shapes.map((s, i) => {
    if (!s || !KINDS.includes(s.kind)) throw new TypeError(`renderSvg: shape ${i} has unknown kind`);
    return { ...structuredClone(s), id: s.id ?? `${s.kind}${i}` };
  }).filter((s) => !backFace(s)).map((s, i) => ({ ...s, drawIndex: i })) };
  // How many details each solid carries on its back sides (drawn after a turn); lint counts them as detail.
  // Contents of a body that is closed in this view or state are not drawn.
  {
    const ids = new Map(model.shapes.map((s) => [s.id, s]));
    const shut = (s) => { const h = s.inside ?? ids.get(s.on)?.inside; const c = h !== undefined ? ids.get(h) : null; return !!c && !c.open; };
    model.shut = model.shapes.filter((s) => s.kind === 'box' && shut(s)).map((s) => ({ id: s.id, holder: s.inside }));
    model.shapes = model.shapes.filter((s) => !shut(s)).map((s, i) => ({ ...s, drawIndex: i }));
  }
  model.backDetails = {};
  for (const s of shapes) if (s && backFace(s)) model.backDetails[s.on] = (model.backDetails[s.on] ?? 0) + 1;
  const byId = new Map(model.shapes.map((s) => [s.id, s]));

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const s of model.shapes) for (const [x, y] of shapePoints(s)) {
    minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
  }
  if (!model.shapes.length) { minX = minY = 0; maxX = maxY = 1; }
  maxY += 4; // ground shadow
  const bounds = { minX, minY, maxX, maxY };
  const given = opts.labels ?? [];
  if (!Array.isArray(given)) throw new TypeError('renderSvg: labels must be an array');
  // With no size given, chips are sized from the drawing so they render at about 11 CSS px on a 390px phone.
  if (hover && opts.fontSize === undefined) fontSize = Math.max(5, Math.ceil(((maxX - minX + 2 * padding) * 11) / 326));
  if (hover) {
    // Chips: each label sits just above its anchor, kept inside the drawing, so no side columns are reserved.
    model.labels = given.map((l, i) => {
      if (!l || typeof l.text !== 'string') throw new TypeError(`renderSvg: label ${i} needs text`);
      const at = vec3(l.at, `label ${i} at`);
      const [x, y] = project(at);
      const w = textWidth(l.text, fontSize);
      const lo = minX + 4; const hi = maxX - 4 - w;
      const tx = hi >= lo ? Math.min(Math.max(x - w / 2, lo), hi) : (minX + maxX - w) / 2;
      return { text: l.text, side: 'r', at, x, y, tx, ty: y - fontSize * 1.7, chip: true, ...(fontSize !== FONT_SIZE ? { fontSize } : {}) };
    });
  } else model.labels = layoutLabels(given, bounds, fontSize);
  let vx0 = minX, vy0 = minY, vx1 = maxX, vy1 = maxY;
  for (const l of model.labels) {
    const b = labelBox(l);
    const m = l.chip ? 4 : 0;
    vx0 = Math.min(vx0, b.minX - m, l.x); vx1 = Math.max(vx1, b.maxX + m, l.x); vy0 = Math.min(vy0, b.minY - m, l.y); vy1 = Math.max(vy1, b.maxY + m, l.y);
  }
  model.labelMode = labelMode;
  if (opts.requiredParts !== undefined) model.requiredParts = [...opts.requiredParts];
  if (hover) model.labels = model.labels.filter((l) => labelTarget(l, model.shapes) !== null); // a part absent from this view or state has no chip
  const targets = model.labels.map((l) => labelTarget(l, model.shapes)?.id ?? null);
  const nameOf = new Map(targets.map((id, i) => [id, model.labels[i].text]).filter(([id]) => id !== null));
  model.viewBox = [r2(vx0 - padding), r2(vy0 - padding), r2(vx1 - vx0 + 2 * padding), r2(vy1 - vy0 + 2 * padding)];

  // Line weight follows the size of the drawing, so a small object and a large one get the same hairline on screen.
  const HAIR = r2(Math.min(1, Math.max(0.25, model.viewBox[2] / 480)));
  const BOLD = r2(HAIR * 2.2); const TONE = r2(HAIR * 1.8);
  const defs = []; const body = []; const css = []; model.animations = [];
  const fig = `.${pre}-fig`;
  if (!flat) {
    css.push(tokensCssScoped(fig));
    const used = new Set(model.shapes.filter((s) => s.kind === 'box' || s.kind === 'panel' || s.kind === 'disc').map((s) => s.material ?? 'plain'));
    for (const m of [...used].filter((x) => x !== 'glass').sort()) {
      const f = FACE[m];
      // Lit left face with a soft specular band; shaded right face that picks up bounce light at its far edge; top fades away from the light.
      defs.push(`<linearGradient id="${pre}-${m}-a" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${f.a}"/><stop offset="0.12" stop-color="var(--mat-shine)" stop-opacity="0.6"/><stop offset="0.3" stop-color="${f.a}"/><stop offset="1" stop-color="${f.a}"/></linearGradient>`);
      defs.push(`<linearGradient id="${pre}-${m}-b" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${f.b}"/><stop offset="0.85" stop-color="${f.b}"/><stop offset="1" stop-color="${f.a}"/></linearGradient>`);
      defs.push(`<linearGradient id="${pre}-${m}-top" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${f.top}"/><stop offset="0.6" stop-color="${f.top}"/><stop offset="1" stop-color="${f.a}"/></linearGradient>`);
      defs.push(`<linearGradient id="${pre}-${m}-lie" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${f.a}"/><stop offset="0.25" stop-color="${f.top}"/><stop offset="0.55" stop-color="${f.a}"/><stop offset="1" stop-color="${f.b}"/></linearGradient>`);
      defs.push(`<linearGradient id="${pre}-${m}-cyl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${f.b}"/><stop offset="0.22" stop-color="${f.a}"/><stop offset="0.36" stop-color="${f.top}"/><stop offset="0.6" stop-color="${f.a}"/><stop offset="1" stop-color="${f.b}"/></linearGradient>`);
    }
    if (model.shapes.some((s) => s.kind === 'glow')) defs.push(`<filter id="${pre}-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="6"/></filter>`);
    if (model.shapes.some((s) => s.kind === 'box')) defs.push(`<filter id="${pre}-touch" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${SHADOW.contactBlur}"/></filter>`);
    if (model.shapes.some((s) => s.kind === 'box')) defs.push(`<filter id="${pre}-soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${SHADOW.blur}"/></filter>`);
  }
  const faceFill = (m, face) => {
    if (flat) return FLAT[m][face];
    if (m === 'glass') return FACE.glass[face];
    return `url(#${pre}-${m}-${face})`;
  };
  const glassAttr = (m) => (m === 'glass' ? ` fill-opacity="${GLASS_OPACITY}"` : '');

  for (const s of model.shapes) {
    // data-part ties a part and its face details together, so hovering either reveals the part's label.
    const part = s.kind === 'box' ? s.id : s.on;
    const focus = hover && s.kind === 'box' && nameOf.has(s.id) ? ` tabindex="0" aria-label="${esc(nameOf.get(s.id))}"` : '';
    const attrs = `data-id="${esc(s.id)}"${hover && part !== undefined && nameOf.has(part) ? ` data-part="${esc(part)}"${focus}` : ''}`;
    let inner = '';
    if (s.kind === 'box') {
      const m = s.material ?? (s.tone === 'ink' ? 'ink' : 'plain');
      const [x, y, z] = s.at; const [w, d, h] = s.size;
      const P = (a, b, c) => project([x + a, y + b, z + c]);
      const grounded = !s.rests && s.at[2] === 0;
      const base = s.rests !== undefined ? byId.get(s.rests) : null;
      if (flat) {
        const g = [P(0, 0, 0), P(w, 0, 0), P(w, d, 0), P(0, d, 0)].map(([a, b]) => [a, b + 2]);
        if (grounded) inner += `<path d="${pathOf(g)}" fill="${F('var(--line)')}" opacity="0.45"/>`;
      } else if (m !== 'glass' && !s.move && (grounded || (base && base.kind === 'box'))) {
        // Cast shadow: the footprint swept along the light direction, blurred, clipped to the surface it falls on.
        const k = Math.min(h, SHADOW.max);
        const foot = [[0, 0], [w, 0], [w, d], [0, d]];
        const sh = hull(foot.concat(foot.map(([a, b]) => [a + SHADOW.dx * k, b + SHADOW.dy * k])).map(([a, b]) => P(a, b, 0)));
        let clip = '';
        if (base) {
          const [bx, by, bz] = base.at; const [bw, bd, bh] = base.size;
          const cid = `${pre}-clip-${String(s.id).replace(/[^\w-]/g, '_')}`;
          defs.push(`<clipPath id="${cid}"><path d="${pathOf([[bx, by], [bx + bw, by], [bx + bw, by + bd], [bx, by + bd]].map(([a, b]) => project([a, b, bz + bh])))}"/></clipPath>`);
          clip = ` clip-path="url(#${cid})"`;
        }
        // Two layers: the long soft cast shadow, and a tight dark one where the solid meets the surface, which is what makes it sit.
        const touch = foot.map(([a, b]) => P(a, b, 0));
        body.push(`<g class="${pre}-shadow"${clip}><path d="${pathOf(sh)}" fill="${F('var(--mat-shadow)')}" opacity="${SHADOW.opacity}" filter="url(#${pre}-soft)"/>` +
          `<path d="${pathOf(touch)}" fill="${F('var(--mat-shadow)')}" opacity="${SHADOW.contact}" filter="url(#${pre}-touch)"/></g>`);
      }
      if (s.round === 'x' || s.round === 'y') {
        // A cylinder lying along x or y: the body is the hull of its two round ends, the near end is its cap.
        const r = h / 2; const len = s.round === 'x' ? w : d;
        const ring = (t) => Array.from({ length: 32 }, (_, i) => {
          const a = (i / 32) * Math.PI * 2; const c = Math.cos(a) * r; const e = Math.sin(a) * r;
          return s.round === 'x' ? P(t, r + c, r + e) : P(r + c, t, r + e);
        });
        const near = ring(len);
        inner += `<path d="${pathOf(hull(ring(0).concat(near)))}" fill="${F(flat ? FLAT[m].a : m === 'glass' ? FACE.glass.a : `url(#${pre}-${m}-lie)`)}"${glassAttr(m)} stroke="${S('var(--line-strong)')}" stroke-width="${HAIR}" stroke-linejoin="round"/>`;
        inner += `<path d="${pathOf(near)}" fill="${F(faceFill(m, s.round === 'x' ? 'b' : 'a'))}"${glassAttr(m)} stroke="${S('var(--line-strong)')}" stroke-width="${HAIR}" stroke-linejoin="round"/>`;
      } else if (s.round) {
        // Upright cylinder: a body shaded around its curve and an elliptical top.
        const r = w / 2; const rx = r * C * Math.SQRT2; const ry = r * Math.SQRT1_2;
        const [tx, ty] = P(r, r, h); const [bx, by] = P(r, r, 0);
        inner += `<path d="M${r2(tx - rx)} ${r2(ty)} L${r2(bx - rx)} ${r2(by)} A${r2(rx)} ${r2(ry)} 0 0 0 ${r2(bx + rx)} ${r2(by)} L${r2(tx + rx)} ${r2(ty)} Z" fill="${F(flat ? FLAT[m].a : m === 'glass' ? FACE.glass.a : `url(#${pre}-${m}-cyl)`)}"${glassAttr(m)} stroke="${S('var(--line-strong)')}" stroke-width="${HAIR}" stroke-linejoin="round"/>`;
        inner += `<ellipse cx="${r2(tx)}" cy="${r2(ty)}" rx="${r2(rx)}" ry="${r2(ry)}" fill="${F(faceFill(m, 'top'))}"${glassAttr(m)} stroke="${S('var(--line-strong)')}" stroke-width="${HAIR}"/>`;
      } else if (!s.open && Math.min(s.r, w / 4, d / 4) >= 0.5) {
        // Rounded upright edges: the top is a rounded rectangle and the two visible sides are one band that
        // turns the front corner, shaded from the lit side to the shaded side with no hard edge.
        const rr = Math.min(s.r, w / 4, d / 4);
        const arc = (cx, cy, a0, a1, n = 5) => Array.from({ length: n + 1 }, (_, i) => { const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180; return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, a0 + ((a1 - a0) * i) / n]; });
        // Outline of the footprint, counter-clockwise by outward-normal angle, starting at the far corner.
        const ring = [...arc(rr, rr, 180, 270), ...arc(w - rr, rr, 270, 360), ...arc(w - rr, d - rr, 0, 90), ...arc(rr, d - rr, 90, 180)];
        inner += `<path d="${pathOf(ring.map(([a, b]) => P(a, b, h)))}" fill="${F(faceFill(m, 'top'))}"${glassAttr(m)} stroke="${S('var(--line-strong)')}" stroke-width="${HAIR}" stroke-linejoin="round"/>`;
        // The visible band runs from the left silhouette (normal 135 deg) round the front corner to the right silhouette (-45 deg).
        const band = [...arc(rr, d - rr, 135, 90, 3), ...arc(w - rr, d - rr, 90, 0), ...arc(w - rr, rr, 0, -45, 3)];
        const lo = band.map(([a, b]) => P(a, b, 0)); const hi = band.map(([a, b]) => P(a, b, h));
        const side = `<path d="${pathOf(lo.concat(hi.slice().reverse()))}" fill="${F(faceFill(m, 'a'))}"${glassAttr(m)} stroke="${S('var(--line-strong)')}" stroke-width="${HAIR}" stroke-linejoin="round"/>`;
        let shade = '';
        if (m !== 'glass') {
          for (let i = 0; i < band.length - 1; i++) {
            const mid = (band[i][2] + band[i + 1][2]) / 2;
            if (mid >= 90) continue;
            const o = Math.min(1, (90 - mid) / 90);
            shade += `<path class="${pre}-shade" d="${pathOf([lo[i], lo[i + 1], hi[i + 1], hi[i]])}" fill="${F(flat ? FLAT[m].b : FACE[m].b)}" opacity="${r2(o)}"/>`;
          }
        }
        // A thin highlight just inside the top edge: the edge reads as softly rounded over, not as a knife edge.
        if (!flat && m !== 'glass' && rr - 0.8 >= 0.2 && w > 6 && d > 6) {
          const rb = rr - 0.8;
          const arcB = (cx, cy, a0, a1) => Array.from({ length: 6 }, (_, i) => { const t = ((a0 + ((a1 - a0) * i) / 5) * Math.PI) / 180; return [cx + Math.cos(t) * rb, cy + Math.sin(t) * rb]; });
          const bevel = [...arcB(rr, rr, 180, 270), ...arcB(w - rr, rr, 270, 360), ...arcB(w - rr, d - rr, 0, 90), ...arcB(rr, d - rr, 90, 180)];
          inner += `<path class="${pre}-bevel" pointer-events="none" d="${pathOf(bevel.map(([a, b]) => P(a, b, h)))}" fill="none" stroke="${S('var(--mat-shine)')}" stroke-width="${HAIR}" opacity="0.9"/>`;
        }
        // Side first, then its shading, then the top over both.
        inner = inner.replace(/^(<path [^>]*\/>)$/, '$1');
        const topPath = inner; inner = side + shade + topPath;
      } else {
        const top = [P(0, 0, h), P(w, 0, h), P(w, d, h), P(0, d, h)];
        const fy = [P(0, d, 0), P(w, d, 0), P(w, d, h), P(0, d, h)];
        const fx = [P(w, 0, 0), P(w, d, 0), P(w, d, h), P(w, 0, h)];
        const rr = Math.max(0, Math.min(s.r, w / 2, d / 2));
        inner += `<path d="${pathOf(fy)}" fill="${F(faceFill(m, 'a'))}"${glassAttr(m)} stroke="${S('var(--line-strong)')}" stroke-width="${HAIR}" stroke-linejoin="round"/>`;
        inner += `<path d="${pathOf(fx)}" fill="${F(faceFill(m, 'b'))}"${glassAttr(m)} stroke="${S('var(--line-strong)')}" stroke-width="${HAIR}" stroke-linejoin="round"/>`;
        inner += `<path d="${pathOf(top)}" fill="${F(faceFill(m, 'top'))}"${glassAttr(m)} stroke="${S('var(--line-strong)')}" stroke-width="${HAIR}" stroke-linejoin="round"/>`;
        if (s.open) {
          // Open sides: the hole shows the inside faces the viewer can see (floor, back wall, far side wall).
          const t = s.wall ?? 2;
          const hole = openingCorners(s).map(project);
          const oid = `${pre}-open-${String(s.id).replace(/[^\w-]/g, '_')}`;
          defs.push(`<clipPath id="${oid}"><path d="${pathOf(hole)}"/></clipPath>`);
          const Q = (a, b, c) => project([a, b, c]);
          const ox = s.open !== 'y'; const oy = s.open !== 'x'; // which sides are open
          const x0 = x + t, y0 = y + t, z0 = z + t, z1 = z + h - t;
          const xe = ox ? x + w : x + w - t; const ye = oy ? y + d : y + d - t;
          const floor = [Q(x0, y0, z0), Q(xe, y0, z0), Q(xe, ye, z0), Q(x0, ye, z0)];
          const wallY = [Q(x0, y0, z0), Q(xe, y0, z0), Q(xe, y0, z1), Q(x0, y0, z1)]; // the wall at the low-y side, facing the reader's left
          const wallX = [Q(x0, y0, z0), Q(x0, ye, z0), Q(x0, ye, z1), Q(x0, y0, z1)]; // the wall at the low-x side, facing the reader's right
          // The inside is lined like the body (a dark body is dark inside) and sits in shade, so it reads as a hollow, never as glass.
          const inkBody = m === 'dark' || m === 'ink';
          const liner = flat ? (inkBody ? FLAT.ink : FLAT.plain) : inkBody ? FACE.dark : FACE.white;
          const edge = `stroke="${S('var(--line-strong)')}" stroke-width="${HAIR}" stroke-linejoin="round"`;
          const shade = (pts, o) => (flat ? '' : `<path class="${pre}-shade" d="${pathOf(pts)}" fill="${F('var(--mat-shadow)')}" opacity="${o}"/>`);
          // A cutaway shows the cut through the walls as a solid band in a section tone.
          if (s.open === 'xy') {
            const sect = F(flat ? 'var(--muted)' : 'var(--mat-section)');
            inner += `<path d="${pathOf(fy)}" fill="${sect}" ${edge}/><path d="${pathOf(fx)}" fill="${sect}" ${edge}/>`;
          }
          inner += `<g clip-path="url(#${oid})"><path d="${pathOf(hole)}" fill="${F(flat ? 'var(--line)' : 'var(--mat-cavity)')}"/>` +
            `<path d="${pathOf(wallY)}" fill="${F(liner.a)}" ${edge}/>${shade(wallY, 0.06)}` +
            `<path d="${pathOf(wallX)}" fill="${F(liner.b)}" ${edge}/>${shade(wallX, 0.1)}` +
            `<path d="${pathOf(floor)}" fill="${F(inkBody ? liner.a : liner.top)}" ${edge}/>${shade(floor, 0.05)}</g>` +
            `<path d="${pathOf(hole)}" fill="${F('none')}" ${edge}/>`;
        }
        const [ex, ey0] = P(w, d, 0); const [, ey1] = P(w, d, h);
        // Edge highlight where the two side faces meet: the corner catches the light.
        // No highlight on the front corner of a cutaway: that corner has been cut away.
        if (s.open !== 'xy') inner += `<path d="M${r2(ex)} ${r2(ey0)} L${r2(ex)} ${r2(ey1)}" fill="none" stroke="${S(flat ? FLAT[m].top : m === 'glass' ? 'var(--mat-shine)' : 'var(--mat-shine)')}" stroke-width="${HAIR}" stroke-linecap="round" opacity="0.7"/>`;
      }
    } else if (s.kind === 'panel') {
      const m = s.material ?? 'plain';
      const face = s.face === 'top' ? 'top' : s.face === 'x' ? 'b' : 'a';
      inner = `<path d="${pathOf(panelCorners(s).map(project))}" fill="${F(faceFill(m, face))}"${glassAttr(m)} stroke="${S('var(--line-strong)')}" stroke-width="${HAIR}" stroke-linejoin="round"/>`;
    } else if (s.kind === 'disc') {
      const m = s.material ?? 'plain';
      const face = s.face === 'top' ? 'top' : s.face === 'x' ? 'b' : 'a';
      inner = `<path d="${pathOf(discPoints(s).map(project))}" fill="${F(faceFill(m, face))}"${glassAttr(m)} stroke="${S('var(--line-strong)')}" stroke-width="${HAIR}" stroke-linejoin="round"/>`;
    } else if (s.kind === 'glow') {
      const [cx, cy] = project(s.at);
      inner = flat ? '' : `<ellipse cx="${r2(cx)}" cy="${r2(cy)}" rx="${r2(s.r * 1.2)}" ry="${r2(s.r * 0.85)}" fill="${F('var(--mat-glow)')}" opacity="0.5" filter="url(#${pre}-glow)" pointer-events="none"/>`;
    } else if (s.kind === 'line') {
      const stroke = s.tone && !flat ? TONE_STROKE[s.tone] : s.bold ? 'var(--fg)' : 'var(--line-strong)';
      inner = `<path d="M${s.points.map((p) => project(p).map(r2).join(' ')).join(' L')}" fill="${F('none')}" stroke="${S(stroke)}" stroke-width="${s.bold ? BOLD : s.tone ? TONE : HAIR}" stroke-linecap="round" stroke-linejoin="round"/>`;
    } else {
      const [cx, cy] = project(s.at);
      const fill = F(s.tone === 'ink' ? (flat ? 'var(--fg)' : 'var(--iso-ink)') : 'var(--ok)');
      // A dot is a unit circle squashed into its face plane: the only circles in the svg are author dots.
      const [rx, ry] = s.face === 'top' ? [s.r * C * 1.15, s.r * 0.58] : [s.r * 0.6, s.r];
      inner = `<circle class="dot" r="1" transform="translate(${r2(cx)} ${r2(cy)}) scale(${r2(rx)} ${r2(ry)})" fill="${fill}"/>`;
    }
    // Contents of an open box are seen only through its opening.
    const holder = s.inside !== undefined ? s.inside : s.on !== undefined ? byId.get(s.on)?.inside : undefined;
    const holderBox = holder !== undefined ? byId.get(holder) : null;
    const within = holderBox && holderBox.open ? ` clip-path="url(#${pre}-open-${String(holder).replace(/[^\w-]/g, '_')})"` : '';
    if (within) {
      const last = body.length - 1;
      if (last >= 0 && body[last].startsWith(`<g class="${pre}-shadow"`) && s.kind === 'box') body[last] = `<g${within}>${body[last]}</g>`;
    }
    const wrap = (g) => (within ? `<g${within}>${g}</g>` : g);
    if (s.anim !== undefined || s.move) {
      const cls = `${pre}-anim-${String(s.id).replace(/[^\w-]/g, '_')}`;
      const m = s.move ?? [0, 0, 0];
      const [dx, dy] = project(m);
      const kf = s.move ? `transform:translate(${r2(dx)}px,${r2(dy)}px)` : 'opacity:0.4';
      // A moving part is hard to point at: an unseen area covering its whole path catches the pointer.
      if (s.move && s.kind === 'box' && hover && nameOf.has(s.id)) {
        const o = boxOutline(s);
        const sweep = hull(o.concat(o.map(([a, b]) => [a + dx, b + dy]), o.map(([a, b]) => [a - dx, b - dy])));
        inner = `<path d="${pathOf(sweep)}" fill="none" stroke="none" pointer-events="all" class="${pre}-shade"/>` + inner;
      }
      css.push(`@keyframes ${cls}{0%,15%{transform:none;opacity:1}60%,85%{${kf}}100%{transform:none;opacity:1}}`);
      css.push(`.${cls}{animation:${cls} 3.2s ease-in-out ${r2(s.delay ?? 0)}s infinite}`);
      css.push(`@media (prefers-reduced-motion: reduce){.${cls}{animation:none}}`);
      model.animations.push({ id: s.id, reducedFallback: true });
      body.push(wrap(`<g class="${cls}" ${attrs}>${inner}</g>`));
    } else body.push(wrap(`<g ${attrs}>${inner}</g>`));
  }

  if (hover && model.labels.length) {
    css.push(`${fig} [data-part]{cursor:pointer;outline:none}`);
    css.push(`${fig} .${pre}-label[data-for]{opacity:0;pointer-events:none;transform:translateY(5px);transition:opacity .22s ease,transform .3s ease}`);
    css.push(`${fig} .${pre}-label[data-for] .leader{stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset .3s ease .08s}`);
    css.push(`${fig} [data-part] path,${fig} [data-part] ellipse,${fig} [data-part] circle{transition:stroke .2s ease}`);
    css.push(`${fig} .${pre}-shade{stroke:none!important}${fig} .${pre}-bevel{stroke:var(--mat-shine)!important}`);
    for (const id of new Set(targets.filter((t) => t !== null))) {
      const v = String(id).replace(/["\\]/g, '\\$&');
      const q = `[data-part="${v}"]`;
      const on = [':hover', ':focus-visible', ':focus'].map((st) => `${fig}:has(${q}${st})`);
      const lab = `.${pre}-label[data-for="${v}"]`;
      css.push(`${on.map((o) => `${o} ${lab}`).join(',')}{opacity:1;transform:none}`);
      css.push(`${on.map((o) => `${o} ${lab} .leader`).join(',')}{stroke-dashoffset:0}`);
      css.push(`${on.map((o) => `${o} ${q} path,${o} ${q} ellipse`).join(',')}{stroke:var(--fg)}`);
    }
    css.push(`@media (prefers-reduced-motion: reduce){${fig} .${pre}-label[data-for],${fig} .${pre}-label[data-for] *,${fig} [data-part] *{transition:none}}`);
  }

  model.labels.forEach((l, li) => {
    if (l.chip) {
      // A chip above the part: a short leader that draws itself, a plate for legibility over the drawing, and the name.
      const b = labelBox(l);
      const cx = Math.min(Math.max(l.x, b.minX + 2), b.maxX - 2);
      const chip = `<line class="leader" pathLength="1" x1="${r2(l.x)}" y1="${r2(l.y)}" x2="${r2(cx)}" y2="${r2(b.maxY + 2)}" stroke="${S('var(--fg)')}" stroke-width="${HAIR}"/>` +
        `<rect x="${r2(b.minX - 4)}" y="${r2(b.minY - 2)}" width="${r2(b.maxX - b.minX + 8)}" height="${r2(b.maxY - b.minY + 4)}" rx="3" fill="${F('var(--surface)')}" stroke="${S('var(--line-strong)')}" stroke-width="${HAIR}"/>` +
        `<text x="${r2(l.tx)}" y="${r2(l.ty)}" text-anchor="start" dominant-baseline="middle" font-size="${fontSize}" font-family="system-ui, sans-serif" fill="${F('var(--fg)')}">${esc(l.text)}</text>`;
      body.push(targets[li] !== null ? `<g class="${pre}-label" data-for="${esc(targets[li])}">${chip}</g>` : `<g class="${pre}-label">${chip}</g>`);
      return;
    }
    const anchor = l.side === 'l' ? 'end' : 'start';
    const lx = l.side === 'l' ? l.tx + 3 : l.tx - 3;
    // Leader is a bare line: no dot or marker at either end. Only author-placed dot() shapes draw round marks.
    body.push(`<g class="${pre}-label"><line class="leader" x1="${r2(l.x)}" y1="${r2(l.y)}" x2="${r2(lx)}" y2="${r2(l.ty)}" stroke="${S('var(--muted)')}" stroke-width="0.75"/>` +
      `<text x="${r2(l.tx)}" y="${r2(l.ty)}" text-anchor="${anchor}" dominant-baseline="middle" font-size="${fontSize}" font-family="system-ui, sans-serif" fill="${F('var(--fg)')}">${esc(l.text)}</text></g>`);
  });

  model.fills = [...fills]; model.strokes = [...strokes];
  const title = typeof opts.title === 'string' ? `<title>${esc(opts.title)}</title>` : '';
  const style = css.length ? `<style>${css.join('')}</style>` : '';
  const cls = hover || !flat ? ` class="${pre}-fig"` : '';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${model.viewBox.join(' ')}" role="img"${cls}>${title}${defs.length ? `<defs>${defs.join('')}</defs>` : ''}${style}${body.join('')}</svg>`;
  return { svg, model };
}
