/**
 * figure-craft lint: geometry, layout and detail checks L1-L11 on a renderSvg model (or a hand-built one).
 * Node 24 ESM, stdlib only, zero deps.
 * @governed-by PO_ARCHITECT
 */
import { boxOutline, shapePoints, labelBox, LABEL_GAP } from './iso.mjs';

const EPS = 1e-6;
/** L10: minimum gap between sibling parts, and minimum share of the base they span. */
export const MIN_PART_GAP = 4;
export const MIN_BASE_USE = 0.3;

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
function faceProblem(d, b, corners = true) {
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
  if (corners) for (const cu of [u0, u1]) for (const cv of [v0, v1]) {
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

  // L1 also: a box sitting on another box's top must declare it with `rests`
  const within = (a0, a1, b0, b1) => a0 >= b0 - EPS && a1 <= b1 + EPS;
  for (const s of boxes) {
    if (s.rests !== undefined || s.at[2] === 0) continue;
    const base = boxes.find((b) => b !== s && Math.abs(b.at[2] + b.size[2] - s.at[2]) < EPS
      && within(s.at[0], s.at[0] + s.size[0], b.at[0], b.at[0] + b.size[0]) && within(s.at[1], s.at[1] + s.size[1], b.at[1], b.at[1] + b.size[1]));
    if (base) err('L1-painter-order', `${s.id} sits on ${base.id} but does not declare rests: '${base.id}'`);
  }

  // L2 face detail (lines used as face details: every point in the face; corners may be touched)
  for (const d of shapes) {
    if (d.kind !== 'line' || d.on === undefined) continue;
    const b = byId.get(d.on);
    if (!b || b.kind !== 'box') { err('L2-face-detail', `${d.id} lies on unknown box ${d.on}`); continue; }
    const p = d.points.map((pt) => faceProblem({ at: pt, face: d.face }, b, false)).find(Boolean);
    if (p) err('L2-face-detail', `${d.id} on ${d.on}: ${p}`);
  }
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

  // Which box a label names: the smallest box whose volume holds the label's 3D anchor.
  const holds = (b, p) => [0, 1, 2].every((k) => p[k] >= b.at[k] - EPS && p[k] <= b.at[k] + b.size[k] + EPS);
  const vol = (b) => b.size[0] * b.size[1] * b.size[2];
  const named = new Map();
  for (const l of labels) {
    if (!Array.isArray(l.at)) continue;
    const b = boxes.filter((x) => holds(x, l.at)).sort((p, q) => vol(p) - vol(q))[0];
    if (b) named.set(b.id, l);
  }

  // L9 the moving part is the story: it must be labelled
  for (const s of boxes) {
    if (Array.isArray(s.move) && s.move.some((n) => n !== 0) && !named.has(s.id)) err('L9-moving-unlabelled', `${s.id} moves but has no label; name the part that tells the story`);
  }

  // L10 parts on one base: not crowded, and using the base (warnings)
  const kids = new Map();
  for (const s of boxes) if (s.rests !== undefined && !s.move) kids.set(s.rests, [...(kids.get(s.rests) ?? []), s]);
  for (const [baseId, list] of kids) {
    const base = byId.get(baseId);
    for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
      const a = list[i]; const b = list[j];
      const gap = (k) => Math.max(a.at[k] - (b.at[k] + b.size[k]), b.at[k] - (a.at[k] + a.size[k]), 0);
      const d = Math.hypot(gap(0), gap(1));
      if (d < MIN_PART_GAP - EPS) warnings.push({ rule: 'L10-crowded', message: `${a.id} and ${b.id} are ${Math.round(d * 10) / 10} apart on ${baseId} (min ${MIN_PART_GAP}); leave a gap so each reads as its own part` });
    }
    if (base && base.kind === 'box' && list.length >= 2) {
      const x0 = Math.min(...list.map((b) => b.at[0])); const x1 = Math.max(...list.map((b) => b.at[0] + b.size[0]));
      const y0 = Math.min(...list.map((b) => b.at[1])); const y1 = Math.max(...list.map((b) => b.at[1] + b.size[1]));
      const used = ((x1 - x0) * (y1 - y0)) / (base.size[0] * base.size[1]);
      if (used < MIN_BASE_USE - EPS) warnings.push({ rule: 'L10-crowded', message: `parts span ${Math.round(used * 100)}% of ${baseId} (min ${MIN_BASE_USE * 100}%); spread them out or shrink the base` });
    }
  }

  // L11 every labelled part carries a detail that identifies it
  for (const [id, l] of named) {
    const b = byId.get(id);
    if (b.move || kids.has(id)) continue; // moving tokens and bases that carry parts are identified by those
    if (!shapes.some((s) => (s.kind === 'dot' || s.kind === 'line') && s.on === id)) err('L11-no-detail', `"${l.text}" (${id}) has no face detail; add a line or dot with on: '${id}' that identifies it`);
  }

  return { errors, warnings };
}
