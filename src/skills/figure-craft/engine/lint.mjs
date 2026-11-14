/**
 * figure-craft lint: geometry, layout and detail checks L1-L19 on a renderSvg model (or a hand-built one).
 * Node 24 ESM, stdlib only, zero deps.
 * @governed-by PO_ARCHITECT
 */
import { boxOutline, shapePoints, labelBox, labelTarget, panelCorners, discPoints, openingCorners, project, LABEL_GAP, MAX_LABELS } from './iso.mjs';

const EPS = 1e-6;
/** L10: minimum gap between sibling parts, and minimum share of the base they span. */
export const MIN_PART_GAP = 4;
export const MIN_BASE_USE = 0.3;
/** L12: a labelled part covers at least this share of the drawing. L11: one more detail per DETAIL_STEP of the drawing, up to 3. */
export const MIN_PART_SHARE = 0.01;
export const DETAIL_STEP = 0.08;
/** L13: solid volumes (thinnest side at least BODY_THICK of the longest) together cover at least BODY_SHARE of the drawing. */
export const BODY_SHARE = 0.2;
export const BODY_THICK = 0.3;
/** L16: share of a labelled part that must stay visible behind later-drawn solids (glass does not hide). */
export const MIN_VISIBLE = 0.4;
/** L19: fewest face details in a figure, and per labelled part. */
export const MIN_DETAILS = 12;
export const DETAILS_PER_PART = 3;
/** L19: a solid covering this share of the drawing must carry at least one face detail. */
export const BARE_SHARE = 0.04;

const polyArea = (p) => Math.abs(p.reduce((s, [x, y], i) => { const [a, b] = p[(i + 1) % p.length]; return s + x * b - a * y; }, 0)) / 2;

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
    if (!(d.kind === 'line' || d.kind === 'panel' || d.kind === 'disc') || d.on === undefined) continue;
    const b = byId.get(d.on);
    if (!b || b.kind !== 'box') { err('L2-face-detail', `${d.id} lies on unknown box ${d.on}`); continue; }
    const p = (d.kind === 'panel' ? panelCorners(d) : d.kind === 'disc' ? discPoints(d, 4) : d.points).map((pt) => faceProblem({ at: pt, face: d.face }, b, false)).find(Boolean);
    if (p) err('L2-face-detail', `${d.id} on ${d.on}: ${p}`);
  }
  for (const d of shapes) {
    if (d.kind !== 'dot' || d.on === undefined) continue;
    const b = byId.get(d.on);
    if (!b || b.kind !== 'box') { err('L2-face-detail', `${d.id} lies on unknown box ${d.on}`); continue; }
    const p = faceProblem(d, b);
    if (p) err('L2-face-detail', `${d.id} on ${d.on}: ${p}`);
  }

  // L3 label overlap (labels revealed on hover show one at a time, so they cannot collide)
  const hoverMode = model.labelMode === 'hover';
  for (let i = 0; i < labels.length && !hoverMode; i++) for (let j = i + 1; j < labels.length; j++) {
    const a = labels[i]; const b = labels[j];
    if (a.side === b.side && Math.abs(a.ty - b.ty) < LABEL_GAP - EPS) { err('L3-label-overlap', `labels "${a.text}" and "${b.text}" are closer than ${LABEL_GAP}`); continue; }
    const A = labelBox(a); const B = labelBox(b);
    if (A.minX < B.maxX && B.minX < A.maxX && A.minY < B.maxY && B.minY < A.maxY) err('L3-label-overlap', `labels "${a.text}" and "${b.text}" overlap`);
  }

  // L3 also: label count (in hover mode one label shows at a time, so more are allowed)
  const maxLabels = MAX_LABELS[model.labelMode === 'hover' ? 'hover' : 'always'];
  if (labels.length > maxLabels) err('L3-label-overlap', `${labels.length} labels (max ${maxLabels}); split the figure or group small parts`);

  // L4 leader crosses solid (warning)
  const outlines = boxes.map((b) => ({ id: b.id, poly: boxOutline(b) }));
  for (const l of hoverMode ? [] : labels) {
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
  const named = new Map();
  for (const l of labels) {
    const b = labelTarget(l, boxes);
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
      // Touching parts (gap 0) are one joined structure, such as cabinet walls; only a small open gap is crowded.
      if (d > EPS && d < MIN_PART_GAP - EPS) warnings.push({ rule: 'L10-crowded', message: `${a.id} and ${b.id} are ${Math.round(d * 10) / 10} apart on ${baseId} (min ${MIN_PART_GAP}); leave a gap so each reads as its own part` });
    }
    if (base && base.kind === 'box' && list.length >= 2) {
      const x0 = Math.min(...list.map((b) => b.at[0])); const x1 = Math.max(...list.map((b) => b.at[0] + b.size[0]));
      const y0 = Math.min(...list.map((b) => b.at[1])); const y1 = Math.max(...list.map((b) => b.at[1] + b.size[1]));
      const used = ((x1 - x0) * (y1 - y0)) / (base.size[0] * base.size[1]);
      if (used < MIN_BASE_USE - EPS) warnings.push({ rule: 'L10-crowded', message: `parts span ${Math.round(used * 100)}% of ${baseId} (min ${MIN_BASE_USE * 100}%); spread them out or shrink the base` });
    }
  }

  // Share of the drawing each box covers, from the projected outlines.
  const pts = boxes.flatMap((b) => boxOutline(b));
  const xs = pts.map((p) => p[0]); const ys = pts.map((p) => p[1]);
  const drawing = pts.length ? (Math.max(...xs) - Math.min(...xs)) * (Math.max(...ys) - Math.min(...ys)) : 0;
  const share = (b) => (drawing > 0 ? polyArea(boxOutline(b)) / drawing : 1);

  // L11 every labelled part carries details that identify it; bigger parts carry more (up to 3)
  for (const [id, l] of named) {
    const b = byId.get(id);
    if (b.move || kids.has(id)) continue; // moving tokens and bases that carry parts are identified by those
    const have = shapes.filter((s) => (s.kind === 'dot' || s.kind === 'line' || s.kind === 'panel' || s.kind === 'disc') && s.on === id).length + (model.backDetails?.[id] ?? 0);
    const need = Math.min(3, 1 + Math.floor(share(b) / DETAIL_STEP + EPS));
    if (have === 0) err('L11-no-detail', `"${l.text}" (${id}) has no face detail; add a line or dot with on: '${id}' that identifies it`);
    else if (have < need) err('L11-no-detail', `"${l.text}" (${id}) covers ${Math.round(share(b) * 100)}% of the drawing and has ${have} detail(s); it needs ${need}`);
  }

  // L12 a labelled part is large enough to read
  for (const [id, l] of named) {
    const b = byId.get(id);
    if (b.move) continue;
    if (share(b) < MIN_PART_SHARE - EPS) err('L12-part-too-small', `"${l.text}" (${id}) covers ${Math.round(share(b) * 1000) / 10}% of the drawing (min ${MIN_PART_SHARE * 100}%); make it larger or shrink the rest`);
  }

  // L13 the object is drawn as full solid volumes, not only thin slabs
  if (boxes.length) {
    const thick = (b) => Math.min(...b.size) / Math.max(...b.size);
    const solid = boxes.filter((b) => thick(b) >= BODY_THICK - EPS).reduce((sum, b) => sum + share(b), 0);
    if (solid < BODY_SHARE - EPS) err('L13-no-solid-body', `solid volumes cover ${Math.round(solid * 100)}% of the drawing (min ${BODY_SHARE * 100}%): draw the object as full volumes (thinnest side at least ${BODY_THICK * 100}% of the longest); thin slabs alone do not read as the object`);
  }

  // L14 completeness: the parts the idea needs are declared, drawn and labelled
  if (!Array.isArray(model.requiredParts) || model.requiredParts.length === 0) err('L14-missing-part', 'requiredParts is not declared; list the ids of the parts the idea needs before building');
  else for (const id of model.requiredParts) {
    const b = byId.get(id);
    if ((model.shut ?? []).some((x) => x.id === id)) continue; // reported by L16
    if (!b || b.kind !== 'box') err('L14-missing-part', `required part ${id} is not drawn; never drop a part the idea needs to pass another check`);
    else if (!named.has(id)) err('L14-missing-part', `required part ${id} has no label`);
  }

  // L15 nothing floats: a part above the ground declares rests or touches another part
  const touch = (a, b) => [0, 1, 2].every((k) => a.at[k] <= b.at[k] + b.size[k] + EPS && b.at[k] <= a.at[k] + a.size[k] + EPS);
  for (const s of boxes) {
    if (s.at[2] <= EPS || s.rests !== undefined || s.move) continue;
    if (!boxes.some((b) => b !== s && touch(s, b))) err('L15-floating', `${s.id} floats: it does not rest on or touch any other part`);
  }

  // L16 a labelled part stays visible: later-drawn solids (not glass) may hide at most 1 - MIN_VISIBLE of it
  for (const [id, l] of named) {
    const b = byId.get(id);
    if (b.move) continue;
    const poly = boxOutline(b);
    const px = poly.map((p) => p[0]); const py = poly.map((p) => p[1]);
    const x0 = Math.min(...px), x1 = Math.max(...px), y0 = Math.min(...py), y1 = Math.max(...py);
    // Contents of an open box are seen through its opening only; the box itself does not hide them.
    const holder = b.inside !== undefined ? byId.get(b.inside) : null;
    const hole = holder && holder.open ? openingCorners(holder).map(project) : null;
    // Things standing on a part (food on a shelf) are not counted as hiding it.
    const over = boxes.filter((o) => o !== b && o !== holder && o.rests !== b.id && o.drawIndex > b.drawIndex && o.material !== 'glass').map((o) => boxOutline(o));
    let total = 0; let seen = 0;
    for (let i = 0; i < 14; i++) for (let j = 0; j < 14; j++) {
      const pt = [x0 + ((i + 0.5) / 14) * (x1 - x0), y0 + ((j + 0.5) / 14) * (y1 - y0)];
      if (!inPoly(pt, poly)) continue;
      total++;
      if ((!hole || inPoly(pt, hole)) && !over.some((o) => inPoly(pt, o))) seen++;
    }
    if (holder && !holder.open) err('L16-hidden-part', `"${l.text}" (${id}) is inside ${holder.id}, which has no open side; give ${holder.id} open: 'xy' (a cutaway), 'x' or 'y'`);
    else if (total && seen / total < MIN_VISIBLE - EPS) err('L16-hidden-part', `"${l.text}" (${id}) is ${Math.round((seen / total) * 100)}% visible (min ${MIN_VISIBLE * 100}%); move it toward the opening, open the side in front of it, or make the cover glass`);
  }

  // L16 also: a required part shut inside a body with no open side cannot be seen at all
  for (const x of model.shut ?? []) {
    if (model.requiredParts?.includes(x.id)) err('L16-hidden-part', `"${x.id}" (${x.id}) is inside ${x.holder}, which has no open side; give ${x.holder} open: 'xy' (a cutaway), 'x' or 'y'`);
  }

  // L18 contents stay inside their container
  for (const s of shapes) {
    if (s.inside === undefined) continue;
    const c = byId.get(s.inside);
    if (!c || c.kind !== 'box') { err('L18-outside-container', `${s.id} is inside unknown box ${s.inside}`); continue; }
    const pts = s.kind === 'box' ? [s.at, [s.at[0] + s.size[0], s.at[1] + s.size[1], s.at[2] + s.size[2]]] : s.points ?? [s.at];
    if (pts.some((p) => [0, 1, 2].some((k) => p[k] < c.at[k] - EPS || p[k] > c.at[k] + c.size[k] + EPS))) err('L18-outside-container', `${s.id} is declared inside ${c.id} but reaches outside it`);
  }

  // L19 micro detail: enough small real features for the size of the figure, and no large bare solid
  if (Array.isArray(model.requiredParts) && model.requiredParts.length) {
    const back = model.backDetails ?? {};
    const count = (id) => shapes.filter((x) => x.kind !== 'box' && x.on === id).length + (back[id] ?? 0);
    const labelled = [...named.keys()].filter((id) => !byId.get(id).move).length;
    const solids = boxes.filter((x) => !x.move).length;
    // At least 12, three per labelled part, and one per solid on average: a bigger object needs more.
    const need = Math.max(MIN_DETAILS, DETAILS_PER_PART * labelled, solids);
    const have = shapes.filter((x) => x.kind !== 'box' && x.on !== undefined).length + Object.values(back).reduce((p, q) => p + q, 0);
    if (have < need) err('L19-sparse', `${have} face details in the figure (min ${need} for ${solids} solids and ${labelled} labelled parts); add the small real features of each part: seams, handles, vents, screws, feet, controls, edges`);
    for (const x of boxes) {
      if (x.move || x.material === 'glass' || kids.has(x.id) && x.at[2] === 0 && x.size[2] <= 4) continue; // glass and flat ground plates stay plain
      if (share(x) >= BARE_SHARE - EPS && count(x.id) === 0) err('L19-sparse', `${x.id} covers ${Math.round(share(x) * 100)}% of the drawing and has no face detail; a large surface of a real object is never bare`);
    }
  }

  // L17 materials: a figure with several solids uses more than one material, as real objects do
  if (boxes.length >= 3 && new Set(boxes.map((b) => b.material ?? (b.tone === 'ink' ? 'ink' : 'plain'))).size < 2) {
    err('L17-one-material', 'every solid has the same material; give each part the material of the real thing (steel, white, dark, glass, plain)');
  }

  return { errors, warnings };
}

/** Rules that must hold from every side when the figure can be turned. */
const EVERY_VIEW = ['L2-face-detail', 'L5-outside-viewbox', 'L6-raw-colour', 'L7-motion-no-reduced', 'L15-floating', 'L18-outside-container'];
const partOf = (e) => /\(([^)]+)\) is (?:\d+% visible|inside)/.exec(e.message)?.[1];

/**
 * Lint a four-view orbit: every rule on the front view, the geometry rules on the other three.
 * A labelled part may be hidden from the front as long as it is visible from another side.
 * @param {{model:object}[]} views from renderViews
 */
export function lintViews(views) {
  if (!Array.isArray(views) || !views.length) throw new TypeError('lintViews: views required');
  const all = views.map((v) => lint(v.model));
  const front = all[0];
  const hiddenIn = all.map((r) => new Set(r.errors.filter((e) => e.rule === 'L16-hidden-part').map(partOf)));
  const drawnIn = views.map((v) => new Set(v.model.shapes.map((s) => s.id)));
  const seenElsewhere = (id) => views.some((_, i) => i > 0 && drawnIn[i].has(id) && !hiddenIn[i].has(id));
  front.errors = front.errors.filter((e) => !(e.rule === 'L16-hidden-part' && seenElsewhere(partOf(e))));
  all.slice(1).forEach((r, i) => {
    for (const e of r.errors) if (EVERY_VIEW.includes(e.rule)) front.errors.push({ rule: e.rule, message: `view ${i + 2}: ${e.message}` });
  });
  return front;
}

/**
 * Lint every state from renderStates: all rules on the first state, the geometry rules on the others.
 * @param {Record<string,{model:object}[]>} states
 */
export function lintStates(states) {
  const names = Object.keys(states ?? {});
  if (!names.length) throw new TypeError('lintStates: states required');
  const first = lintViews(states[names[0]]);
  for (const n of names.slice(1)) {
    for (const e of lintViews(states[n]).errors) if (EVERY_VIEW.includes(e.rule)) first.errors.push({ rule: e.rule, message: `${n}: ${e.message}` });
  }
  return first;
}
