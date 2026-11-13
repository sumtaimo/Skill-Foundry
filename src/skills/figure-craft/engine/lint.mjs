/**
 * figure-craft lint: geometry and taste checks L1-L8 on a renderSvg model (or a hand-built one).
 * Node 24 ESM, stdlib only, zero deps.
 * @governed-by PO_ARCHITECT
 */
import { boxOutline, shapePoints, labelBox, LABEL_GAP } from './iso.mjs';

const EPS = 1e-6;

function segCross(a, b, c, d) {
  const o = (p, q, r) => (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]);
  const d1 = o(c, d, a), d2 = o(c, d, b), d3 = o(a, b, c), d4 = o(a, b, d);
  return ((d1 > EPS && d2 < -EPS) || (d1 < -EPS && d2 > EPS)) && ((d3 > EPS && d4 < -EPS) || (d3 < -EPS && d4 > EPS));
}

function inPoly(p, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i]; const [xj, yj] = poly[j];
    if ((yi > p[1]) !== (yj > p[1]) && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** Check a dot against the face of its box. @returns {string|null} problem */
function faceProblem(d, b) {
  const [x, y, z] = b.at; const [w, h3, h] = [b.size[0], b.size[1], b.size[2]];
  const face = d.face ?? 'top';
  const [px, py, pz] = d.at;
  const r = typeof b.r === 'number' ? b.r : 0;
  let plane, u, v, u0, u1, v0, v1;
  if (face === 'top') { plane = Math.abs(pz - (z + h)) < EPS; [u, v, u0, u1, v0, v1] = [px, py, x, x + w, y, y + h3]; }
  else if (face === 'x') { plane = Math.abs(px - (x + w)) < EPS; [u, v, u0, u1, v0, v1] = [py, pz, y, y + h3, z, z + h]; }
  else { plane = Math.abs(py - (y + h3)) < EPS; [u, v, u0, u1, v0, v1] = [px, pz, x, x + w, z, z + h]; }
  if (!plane) return `not in the plane of the ${face} face`;
  if (u < u0 || u > u1 || v < v0 || v > v1) return `outside the ${face} face`;
  for (const cu of [u0, u1]) for (const cv of [v0, v1]) {
    if (Math.hypot(u - cu, v - cv) < r) return `within r=${r} of a rounded corner`;
  }
  return null;
}

/**
 * @param {{shapes:object[],labels?:object[],viewBox:number[],fills?:string[],strokes?:string[],animations?:object[]}} model
 * @returns {{errors:{rule:string,message:string}[],warnings:{rule:string,message:string}[]}}
 */
export function lint(model) {
  if (!model || !Array.isArray(model.shapes)) throw new TypeError('lint: model.shapes must be an array');
  if (!Array.isArray(model.viewBox) || model.viewBox.length !== 4) throw new TypeError('lint: model.viewBox must be [x,y,w,h]');
  const errors = []; const warnings = [];
  const err = (rule, message) => errors.push({ rule, message });
  const shapes = model.shapes.map((s, i) => ({ ...s, drawIndex: typeof s.drawIndex === 'number' ? s.drawIndex : i }));
  const byId = new Map(shapes.filter((s) => s.id !== undefined).map((s) => [s.id, s]));
  const labels = model.labels ?? [];
  const boxes = shapes.filter((s) => s.kind === 'box');

  // L1 painter order
  for (const s of shapes) {
    if (s.rests === undefined) continue;
    const base = byId.get(s.rests);
    if (!base) err('L1-painter-order', `${s.id} rests on unknown shape ${s.rests}`);
    else if (base.drawIndex > s.drawIndex) err('L1-painter-order', `${s.id} is drawn before ${s.rests}, which it rests on`);
  }

  // L2 face detail
  for (const d of shapes) {
    if (d.kind !== 'dot' || d.on === undefined) continue;
    const b = byId.get(d.on);
    if (!b || b.kind !== 'box') { err('L2-face-detail', `${d.id} lies on unknown box ${d.on}`); continue; }
    const p = faceProblem(d, b);
    if (p) err('L2-face-detail', `${d.id} on ${d.on}: ${p}`);
  }

  // L3 label overlap
  for (let i = 0; i < labels.length; i++) for (let j = i + 1; j < labels.length; j++) {
    const a = labels[i]; const b = labels[j];
    if (a.side === b.side && Math.abs(a.ty - b.ty) < LABEL_GAP - EPS) { err('L3-label-overlap', `labels "${a.text}" and "${b.text}" are closer than ${LABEL_GAP}`); continue; }
    const A = labelBox(a); const B = labelBox(b);
    if (A.minX < B.maxX && B.minX < A.maxX && A.minY < B.maxY && B.minY < A.maxY) err('L3-label-overlap', `labels "${a.text}" and "${b.text}" overlap`);
  }

  // L4 leader crosses solid (warning)
  const outlines = boxes.map((b) => ({ id: b.id, poly: boxOutline(b) }));
  for (const l of labels) {
    const a = [l.x, l.y]; const t = [l.tx, l.ty];
    for (const o of outlines) {
      if (inPoly(a, o.poly)) continue; // the box the label points at
      const hit = o.poly.some((p, k) => segCross(a, t, p, o.poly[(k + 1) % o.poly.length]));
      if (hit) warnings.push({ rule: 'L4-leader-crosses-solid', message: `leader of "${l.text}" crosses ${o.id}` });
    }
  }

  // L5 outside viewBox
  const [vx, vy, vw, vh] = model.viewBox;
  const inside = (x, y) => x >= vx - EPS && x <= vx + vw + EPS && y >= vy - EPS && y <= vy + vh + EPS;
  for (const s of shapes) {
    if (shapePoints(s).some(([x, y]) => !inside(x, y))) err('L5-outside-viewbox', `${s.id} is outside the viewBox`);
  }
  for (const l of labels) {
    const b = labelBox(l);
    if (!inside(b.minX, b.minY) || !inside(b.maxX, b.maxY)) err('L5-outside-viewbox', `label "${l.text}" is outside the viewBox`);
  }

  // L6 raw colour
  const okColour = (v) => typeof v === 'string' && (/^var\(--[\w-]+\)$/.test(v) || v === 'none' || /^url\(#[\w-]+\)$/.test(v));
  for (const [kind, list] of [['fill', model.fills ?? []], ['stroke', model.strokes ?? []]]) {
    for (const v of list) if (!okColour(v)) err('L6-raw-colour', `${kind} ${v} is not a var(--...) token`);
  }

  // L7 motion without reduced fallback
  for (const a of model.animations ?? []) {
    if (a.reducedFallback !== true) err('L7-motion-no-reduced', `animation ${a.id} has no prefers-reduced-motion fallback`);
  }

  // L8 motion off axis
  for (const s of shapes) {
    if (!Array.isArray(s.move)) continue;
    const nonZero = s.move.filter((n) => n !== 0).length;
    if (nonZero > 1) err('L8-motion-off-axis', `${s.id} moves along more than one axis`);
    else if (s.rests !== undefined && s.move[2] !== 0) err('L8-motion-off-axis', `${s.id} rests on ${s.rests} but moves in z`);
  }

  return { errors, warnings };
}
