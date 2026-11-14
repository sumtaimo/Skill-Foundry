/**
 * figure-craft round bodies: pure geometry for upright cylinders that can be cut open and wear details
 * that wrap round their side. Angles are in degrees, 0 = the +x side, 90 = the +y side, so the reader,
 * who looks from +x +y, sees the angles from -45 to 135.
 * No projection here: iso.mjs and lint.mjs import this. Node 24 ESM, stdlib only, zero deps.
 * @governed-by PO_ARCHITECT
 */

/** The 90 degree sector of the wall that each face of a body stands for. */
export const FACE_SECTOR = { x: [-45, 45], y: [45, 135], '-x': [135, 225], '-y': [225, 315] };
/** Angles the reader sees from the front: the outside of the wall between these two. */
export const VISIBLE = [-45, 135];

const RAD = Math.PI / 180;
const norm = (a) => ((a % 360) + 360) % 360;

/** Centre and radius of an upright round body. @param {{at:number[],size:number[]}} b */
export function roundOf(b) {
  const r = b.size[0] / 2;
  return { cx: b.at[0] + r, cy: b.at[1] + r, r, z0: b.at[2], z1: b.at[2] + b.size[2] };
}

/** A point on (or beside) the wall of an upright round body. @param {object} b @param {number} angle degrees @param {number} z @param {number} [outset] distance beyond the wall */
export function surfacePoint(b, angle, z, outset = 0) {
  const { cx, cy, r } = roundOf(b);
  return [cx + (r + outset) * Math.cos(angle * RAD), cy + (r + outset) * Math.sin(angle * RAD), z];
}

/** Points along an arc of the wall (or of a circle of another radius) at one height. */
export function arcPoints(b, a0, a1, z, radius, step = 6) {
  const { cx, cy, r } = roundOf(b);
  const rr = radius ?? r;
  const n = Math.max(2, Math.ceil(Math.abs(a1 - a0) / step));
  return Array.from({ length: n + 1 }, (_, i) => { const a = (a0 + ((a1 - a0) * i) / n) * RAD; return [cx + rr * Math.cos(a), cy + rr * Math.sin(a), z]; });
}

/** A 360 cell mask of the angles that the given faces cover. */
export function maskOfFaces(faces) {
  const m = new Uint8Array(360);
  for (const f of faces ?? []) {
    const sec = FACE_SECTOR[f]; if (!sec) continue;
    for (let a = sec[0]; a < sec[1]; a++) m[norm(a)] = 1;
  }
  return m;
}

/** Faces of a round body that are open now (front) and open on the sides turned away (back). */
export const openFaces = (b) => [...(b.open ?? ''), ...(b.openBack ?? [])].filter((f) => FACE_SECTOR[f]).map((f) => f);
/** Does the angle (degrees) lie in an open sector of this round body? */
export function angleIsOpen(b, angle) {
  return maskOfFaces(openFaces(b))[Math.floor(norm(angle)) % 360] === 1;
}

/**
 * Runs of angles where the mask is on and the angle is wanted, as [from, to] in continuous degrees
 * (to > from, may pass 360 or go below 0). `window` limits the runs to an angle window, e.g. VISIBLE.
 * `cutStart` / `cutEnd` say whether the run ends inside the window (a cut face) or only at its edge.
 * @param {Uint8Array} mask @param {[number, number]} win
 */
export function runsIn(mask, win) {
  const out = [];
  const [w0, w1] = win;
  let cur = null;
  for (let a = w0; a < w1; a++) {
    const on = mask[norm(a)] === 1;
    if (on && !cur) cur = { from: a, to: a + 1 };
    else if (on) cur.to = a + 1;
    else if (cur) { out.push(cur); cur = null; }
  }
  if (cur) out.push(cur);
  // A cut face is only seen where the run ends inside the window; at the window edge the wall turns away.
  return out.map((r) => ({ ...r, cutStart: r.from > w0, cutEnd: r.to < w1 }));
}

/** Is a point on the near half of a round body, the half the reader sees? */
export function facesReader(b, p) {
  const { cx, cy } = roundOf(b);
  return (p[0] - cx) + (p[1] - cy) >= -1e-6;
}

/** Points of a circle (floor, mouth) of an upright body. */
export function circlePoints(b, z, radius, n = 36) {
  return arcPoints(b, 0, 360, z, radius, 360 / n).slice(0, -1);
}

/**
 * Split a polyline on a round body into the runs the reader sees (near half). Runs with fewer than two points are dropped.
 * @param {object} body @param {number[][]} points
 */
export function visibleRuns(body, points) {
  const runs = []; let cur = [];
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    if (facesReader(body, p)) { cur.push(p); continue; }
    if (cur.length) {
      // end the run where the line crosses the silhouette
      const q = points[i - 1] ? crossing(body, points[i - 1], p) : null;
      if (q) cur.push(q);
      runs.push(cur); cur = [];
    }
    const nxt = points[i + 1];
    if (nxt && facesReader(body, nxt)) cur.push(crossing(body, p, nxt));
  }
  if (cur.length) runs.push(cur);
  return runs.filter((r) => r.length >= 2);
}

function crossing(body, a, b) {
  const { cx, cy } = roundOf(body);
  const fa = (a[0] - cx) + (a[1] - cy); const fb = (b[0] - cx) + (b[1] - cy);
  const t = fa === fb ? 0 : fa / (fa - fb);
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

/** Clip a closed polygon on a round body to the near half. @param {object} body @param {number[][]} poly */
export function visiblePolygon(body, poly) {
  const { cx, cy } = roundOf(body);
  const f = (p) => (p[0] - cx) + (p[1] - cy);
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i]; const b = poly[(i + 1) % poly.length];
    const fa = f(a); const fb = f(b);
    if (fa >= 0) out.push(a);
    if ((fa >= 0) !== (fb >= 0)) { const t = fa / (fa - fb); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]); }
  }
  return out;
}

/** Nearest distance from a point to an axis-aligned rectangle (x0..x1, y0..y1) in the floor plane. */
export function distToRect(px, py, x0, x1, y0, y1) {
  const dx = Math.max(x0 - px, 0, px - x1); const dy = Math.max(y0 - py, 0, py - y1);
  return Math.hypot(dx, dy);
}
/** Farthest distance from a point to a rectangle's corners. */
export function farToRect(px, py, x0, x1, y0, y1) {
  return Math.max(...[[x0, y0], [x1, y0], [x1, y1], [x0, y1]].map(([x, y]) => Math.hypot(x - px, y - py)));
}
