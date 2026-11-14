/**
 * figure-craft kit: small real features in one call, so micro detail is cheap to add:
 * rows of vent slots, screws at the corners of a plate, shelf rows, repeated items.
 * Every helper returns an array of shapes to spread into the scene. Node 24 ESM, stdlib only.
 * @governed-by PO_ARCHITECT
 */
import { line, disc } from './iso.mjs';

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
