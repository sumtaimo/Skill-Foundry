/**
 * figure-craft kit: small real features in one call, so micro detail is cheap to add: rows of vent slots,
 * screws at the corners of a plate, rings and bands round a cylinder, repeated items; and parts fixed to the
 * OUTSIDE of a body (handle, spout, lid) that stay outside it.
 * Every helper returns shapes (or an array of shapes) to spread into the scene. Node 24 ESM, stdlib only.
 * @governed-by PO_ARCHITECT
 */
import { box, line, disc, dot, panel } from './iso.mjs';
import { surfacePoint, arcPoints, roundOf } from './round.mjs';

export { surfacePoint };

const lerp = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);

/**
 * A row of parallel slots (a vent, a grille, cooling fins, drawer lines) between two edges of a face.
 * @param {number[][]} first the first slot, two points @param {number[][]} last the last slot, two points
 * @param {number} count @param {{on:string,face:string,id?:string,when?:string}} opts
 */
export function slots(first, last, count, opts) {
  if (!Number.isInteger(count) || count < 2) throw new RangeError('slots: count must be an integer of at least 2');
  return Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    return line([lerp(first[0], last[0], t), lerp(first[1], last[1], t)], { ...opts, id: opts.id ? `${opts.id}-${i}` : undefined });
  });
}

/**
 * Screw heads at the four corners of a rectangle on a face, inset from its corners.
 * @param {number[][]} corners two opposite corners of the plate @param {{on:string,face:string,r?:number,inset?:number,material?:string,id?:string,when?:string}} opts
 */
export function screws(corners, opts) {
  const [p, q] = corners; const inset = opts.inset ?? 2; const r = opts.r ?? 0.8;
  const axes = [0, 1, 2].filter((k) => p[k] !== q[k]);
  if (axes.length !== 2) throw new RangeError('screws: corners must span a rectangle in one face');
  const [a, b] = axes;
  return [[0, 0], [1, 0], [1, 1], [0, 1]].map(([i, j], n) => {
    const at = p.slice();
    at[a] = i ? Math.max(p[a], q[a]) - inset : Math.min(p[a], q[a]) + inset;
    at[b] = j ? Math.max(p[b], q[b]) - inset : Math.min(p[b], q[b]) + inset;
    return disc(at, { on: opts.on, face: opts.face, r, material: opts.material ?? 'steel', when: opts.when, id: opts.id ? `${opts.id}-${n}` : undefined });
  });
}

/**
 * Repeat a shape along a step: `repeat(4, (i) => box({ at: [10 + i * 12, 20, 30], ... }))`.
 * @param {number} count @param {(i:number)=>object|object[]} make
 */
export function repeat(count, make) {
  if (!Number.isInteger(count) || count < 1) throw new RangeError('repeat: count must be a positive integer');
  return Array.from({ length: count }, (_, i) => make(i)).flat();
}

const needId = (body, who) => { if (!body || body.kind !== 'box' || typeof body.id !== 'string') throw new TypeError(`${who}: the body must be a box() with an id`); };
const needRound = (body, who) => { needId(body, who); if (body.round !== true) throw new TypeError(`${who}: the body must be an upright round box (round: true)`); };

/**
 * A line round an upright round body at one height: a seam, a rim, a ring, a weld. Angles in degrees,
 * 0 = the +x side, 90 = the +y side; the reader sees -45 to 135 and the rest shows after a turn.
 * @param {object} body @param {number} z height @param {{from?:number,to?:number,id?:string,bold?:boolean,tone?:string,when?:string}} [opts]
 */
export function ring(body, z, opts = {}) {
  needRound(body, 'ring');
  const { from = 0, to = 360, ...rest } = opts;
  return line(arcPoints(body, from, to, z), { ...rest, on: body.id, face: 'wrap' });
}

/** Several rings at the given heights. @param {object} body @param {number[]} zs @param {object} [opts] */
export function rings(body, zs, opts = {}) {
  return zs.map((z, i) => ring(body, z, { ...opts, id: opts.id ? `${opts.id}-${i}` : undefined }));
}

/**
 * A filled strip that follows the wall of a round body: a label band, a water-level window, a control panel, a grip.
 * @param {object} body @param {number} z0 @param {number} z1 @param {{from?:number,to?:number,material?:string,id?:string,when?:string}} [opts]
 */
export function band(body, z0, z1, opts = {}) {
  needRound(body, 'band');
  const { from = 0, to = 360, ...rest } = opts;
  return panel([...arcPoints(body, from, to, z0), ...arcPoints(body, to, from, z1)], { ...rest, on: body.id, face: 'wrap' });
}

/**
 * Small round features along the wall of a round body (rivets, studs, vent holes, buttons): `count` dots between two angles.
 * @param {object} body @param {number} z @param {number} count @param {{from?:number,to?:number,r?:number,id?:string,when?:string}} [opts]
 */
export function studs(body, z, count, opts = {}) {
  needRound(body, 'studs');
  const { from = -30, to = 120, id, ...rest } = opts;
  if (!Number.isInteger(count) || count < 1) throw new RangeError('studs: count must be a positive integer');
  return Array.from({ length: count }, (_, i) => dot(surfacePoint(body, count === 1 ? (from + to) / 2 : from + ((to - from) * i) / (count - 1), z), { ...rest, on: body.id, face: 'wrap', tone: 'ink', id: id ? `${id}-${i}` : undefined }));
}

/**
 * A box fixed flush to the OUTSIDE of a body: it touches the wall, sinks no deeper than `embed`, and carries `attach`
 * so lint `L20-attach-outside` checks it (never inside the opening, never floating, never on a cut-away side).
 * `side` is the side of the body it stands on: x, y, -x or -y. `reach` is how far it sticks out, `width` its size along the wall,
 * `along` shifts it along the wall from the middle, `z` and `height` place it up the wall.
 * Parts on the back sides (-x, -y) are behind the body: list them BEFORE the body in the scene. Parts on x and y go after it.
 * @param {object} body @param {'x'|'y'|'-x'|'-y'} side @param {{reach:number,width:number,z:number,height:number,along?:number,embed?:number,material?:string,id:string,when?:string,round?:boolean|string}} o
 */
export function attach(body, side, o) {
  needId(body, 'attach');
  if (!['x', 'y', '-x', '-y'].includes(side)) throw new TypeError('attach: side must be x, y, -x or -y');
  const { reach, width, z, height, along = 0, embed = Math.min(1.2, (body.wall ?? 2) * 0.6), material = 'dark', id, ...rest } = o ?? {};
  if (![reach, width, z, height].every((n) => typeof n === 'number' && Number.isFinite(n) && n > 0 || n === z)) throw new TypeError('attach: reach, width, z and height must be numbers (z may be 0)');
  const [bx, by] = body.at; const [bw, bd] = body.size;
  const cx = bx + bw / 2 + (side === 'y' || side === '-y' ? along : 0); const cy = by + bd / 2 + (side === 'x' || side === '-x' ? along : 0);
  const len = reach + embed;
  const at = side === 'x' ? [bx + bw - embed, cy - width / 2, z] : side === '-x' ? [bx - reach, cy - width / 2, z] : side === 'y' ? [cx - width / 2, by + bd - embed, z] : [cx - width / 2, by - reach, z];
  const size = side === 'x' || side === '-x' ? [len, width, height] : [width, len, height];
  return box({ at, size, material, id, attach: body.id, ...rest });
}

/**
 * A handle of a jug, kettle or pan: two bars into the wall and a grip, with grooves on the grip. Returns the three boxes
 * and the grip details. The grip is `id`, the one to label. `z0`..`z1` is the height it spans on the wall.
 * @param {object} body @param {'x'|'y'|'-x'|'-y'} side @param {{id:string,z0:number,z1:number,reach?:number,thick?:number,width?:number,along?:number,material?:string,when?:string}} o
 */
export function handle(body, side, o) {
  needId(body, 'handle');
  const { id, z0, z1, reach = Math.max(9, Math.round(body.size[0] * 0.3)), thick = 3.2, width = 4.5, along = 0, material = 'dark', when } = o ?? {};
  if (typeof id !== 'string' || !(z1 > z0 + thick * 2)) throw new TypeError('handle: id and z0 < z1 (at least two bar thicknesses apart) are required');
  const bar = (name, z) => attach(body, side, { reach, width, z, height: thick, along, material, id: `${id}-${name}`, when });
  const [bx, by] = body.at; const [bw, bd] = body.size;
  const cx = bx + bw / 2 + (side === 'y' || side === '-y' ? along : 0); const cy = by + bd / 2 + (side === 'x' || side === '-x' ? along : 0);
  const out = side === 'x' ? bx + bw + reach : side === '-x' ? bx - reach : side === 'y' ? by + bd + reach : by - reach;
  const sx = side === 'x' || side === '-x';
  const gx = sx ? (side === 'x' ? out - thick : out) : cx - width / 2; const gy = sx ? cy - width / 2 : (side === 'y' ? out - thick : out);
  const grip = box({ at: [gx, gy, z0], size: sx ? [thick, width, z1 - z0] : [width, thick, z1 - z0], material, id, when, r: 0.8, attach: body.id });
  // Grooves across the outer face of the grip, and a seam down the face the reader sees.
  const outer = side;
  const plane = sx ? (side === 'x' ? gx + thick : gx) : (side === 'y' ? gy + thick : gy);
  const along0 = sx ? gy : gx; const along1 = along0 + width;
  const gz = (t) => z0 + (z1 - z0) * t;
  const groove = (t) => (sx ? line([[plane, along0 + 0.6, gz(t)], [plane, along1 - 0.6, gz(t)]], { on: id, face: outer, when, id: `${id}-groove-${Math.round(t * 100)}` })
    : line([[along0 + 0.6, plane, gz(t)], [along1 - 0.6, plane, gz(t)]], { on: id, face: outer, when, id: `${id}-groove-${Math.round(t * 100)}` }));
  const seam = sx ? line([[gx + 0.6, gy + width, gz(0.12)], [gx + thick - 0.6, gy + width, gz(0.12)], [gx + thick - 0.6, gy + width, gz(0.88)]], { on: id, face: 'y', when, id: `${id}-edge` })
    : line([[gx + width, gy + 0.6, gz(0.12)], [gx + width, gy + thick - 0.6, gz(0.12)], [gx + width, gy + thick - 0.6, gz(0.88)]], { on: id, face: 'x', when, id: `${id}-edge` });
  return [bar('low', z0), bar('high', z1 - thick), grip, groove(0.3), groove(0.5), groove(0.7), seam, line([[gx + 0.6, gy + 0.6, z1], [gx + (sx ? thick : width) - 0.6, gy + (sx ? width : thick) - 0.6, z1]], { on: id, face: 'top', when, id: `${id}-top` })];
}

/**
 * A pouring spout: a short wide neck and a narrower lip, two cylinders lying along `side` that leave the wall one after the
 * other, rising a little, with the dark mouth at the end. The first touches the wall (`attach`), the second touches the first.
 * The lip is `id`, the one to label.
 * @param {object} body @param {'x'|'y'|'-x'|'-y'} side @param {{id:string,z:number,reach?:number,diameter?:number,rise?:number,along?:number,material?:string,when?:string}} o
 */
export function spout(body, side, o) {
  needId(body, 'spout');
  const { id, z, reach = Math.max(14, Math.round(body.size[0] * 0.42)), diameter = Math.max(9, Math.round(body.size[0] * 0.3)), rise = 4, along = 0, material = 'steel', when } = o ?? {};
  if (typeof id !== 'string') throw new TypeError('spout: id is required');
  const sx = side === 'x' || side === '-x';
  const [bx, by] = body.at; const [bw, bd] = body.size;
  const embed = Math.min(1.2, (body.wall ?? 2) * 0.6);
  const neck = attach(body, side, { reach: reach * 0.55, width: diameter, z, height: diameter, along, embed, material, id: `${id}-neck`, when, round: sx ? 'x' : 'y' });
  const d2 = Math.round(diameter * 0.72 * 10) / 10;
  const cx = bx + bw / 2 + (sx ? 0 : along); const cy = by + bd / 2 + (sx ? along : 0);
  const l2 = reach * 0.45; const near = reach * 0.55;
  const z2 = z + (diameter - d2) / 2 + rise;
  const start = side === 'x' ? bx + bw + near : side === '-x' ? bx - reach : side === 'y' ? by + bd + near : by - reach;
  const lip = box({ at: sx ? [start, cy - d2 / 2, z2] : [cx - d2 / 2, start, z2], size: sx ? [l2, d2, d2] : [d2, l2, d2], round: sx ? 'x' : 'y', material, id, when });
  // The dark mouth at the free end, and a seam where the lip meets the neck.
  const endFace = side;
  const plane = side === 'x' ? start + l2 : side === 'y' ? start + l2 : start;
  const mouth = sx ? disc([plane, cy, z2 + d2 / 2], { on: id, face: endFace, r: d2 * 0.34, material: 'dark', id: `${id}-mouth`, when })
    : disc([cx, plane, z2 + d2 / 2], { on: id, face: endFace, r: d2 * 0.34, material: 'dark', id: `${id}-mouth`, when });
  return [neck, lip, mouth];
}

/**
 * A circle drawn on the top of a round body or lid, about its centre: the ring of a heating element, a lid rim, a grip groove.
 * @param {object} body round box (upright) @param {number} radius @param {{id?:string,z?:number,bold?:boolean,tone?:string,when?:string}} [opts] z defaults to the top of the body
 */
export function topRing(body, radius, opts = {}) {
  needRound(body, 'topRing');
  const { z, ...rest } = opts;
  return line(arcPoints(body, 0, 360, z ?? body.at[2] + body.size[2], radius, 10), { ...rest, on: body.id, face: 'top' });
}

/**
 * A lid that is not a solid cap: a round disc that sits on the open top (`mouth`) of a round body when the scene is in its
 * `closedState`, and floats `lift` above it, held by a dashed axis, in its `openState`. Both are returned; render them as states.
 * Also adds the lid's own details (rim ring, grooves) and a knob. The lid is `id`, the one to label.
 * @param {object} body round box with mouth: true @param {{id:string,thick?:number,lift?:number,overhang?:number,material?:string,knob?:boolean,openState?:string,closedState?:string}} o
 */
export function lid(body, o) {
  needRound(body, 'lid');
  const { id, thick = 3, overhang = 0.8, material = 'dark', knob = true, openState = 'open', closedState = 'closed' } = o ?? {};
  if (typeof id !== 'string') throw new TypeError('lid: id is required');
  const { cx, cy, r, z1 } = roundOf(body);
  const lift = o?.lift ?? Math.round(r * 1.6);
  const make = (state, zz) => {
    const R = r + overhang;
    const disc0 = box({ at: [cx - R, cy - R, zz], size: [2 * R, 2 * R, thick], round: true, material, rests: body.id, id, when: state });
    const k = Math.max(2.4, r * 0.17);
    const lidBody = { kind: 'box', id, at: [cx - R, cy - R, zz], size: [2 * R, 2 * R, thick], round: true };
    const parts = [disc0,
      topRing(lidBody, R - 1.6, { when: state, id: `${id}-rim-${state}` }),
      topRing(lidBody, R * 0.55, { when: state, id: `${id}-inner-${state}` }),
      ring(lidBody, zz + thick * 0.45, { from: -45, to: 135, when: state, id: `${id}-seam-${state}` })];
    if (knob) parts.push(box({ at: [cx - k, cy - k, zz + thick], size: [2 * k, 2 * k, k * 1.1], round: true, material: 'steel', rests: id, id: `${id}-knob`, when: state }),
      disc([cx, cy, zz + thick + k * 1.1], { on: `${id}-knob`, face: 'top', r: k * 0.55, material: 'dark', id: `${id}-knob-cap-${state}`, when: state }));
    return parts;
  };
  return [
    ...make(closedState, z1),
    ...make(openState, z1 + lift),
    line([[cx, cy, z1 + 0.5], [cx, cy, z1 + lift - 0.5]], { dash: true, when: openState, id: `${id}-axis` }),
  ];
}
