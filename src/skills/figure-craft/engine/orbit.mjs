/**
 * figure-craft orbit: the same scene seen from four sides, a quarter turn apart, and the markup that
 * lets a reader turn it (buttons, drag, arrow keys). Each view is a normal renderSvg result.
 * Node 24 ESM, stdlib only, zero deps.
 * @governed-by PO_ARCHITECT
 */
import { renderSvg } from './iso.mjs';

/** One quarter turn: the world +y side comes to face the reader's right, the world -x side their left. */
const TURN_FACE = { y: 'x', '-x': 'y', x: '-y', '-y': '-x', top: 'top' };
const turnPoint = ([x, y, z]) => [y, -x, z];

function turnFace(face, k) {
  let f = face;
  for (let i = 0; i < k; i++) f = TURN_FACE[f];
  return f;
}
function turnPointK(p, k) {
  let q = p;
  for (let i = 0; i < k; i++) q = turnPoint(q);
  return q;
}

/**
 * The scene after k quarter turns. Details on sides that now face away are dropped; an open side that
 * now faces away is closed, and its contents are hidden with it.
 * @param {object[]} shapes @param {number} k 0..3
 */
export function turnShapes(shapes, k) {
  if (!Array.isArray(shapes)) throw new TypeError('turnShapes: shapes must be an array');
  if (![0, 1, 2, 3].includes(k)) throw new RangeError('turnShapes: k must be 0, 1, 2 or 3');
  const named = shapes.map((s, i) => ({ ...structuredClone(s), id: s.id ?? `${s.kind}${i}` }));
  if (k === 0) return named;
  const closed = new Set();
  const out = [];
  for (const s of named) {
    if (s.kind !== 'box') continue;
    const [x, y, z] = s.at; const [w, d, h] = s.size;
    const a = turnPointK([x, y, z], k); const b = turnPointK([x + w, y + d, z], k);
    const t = { ...s, at: [Math.min(a[0], b[0]), Math.min(a[1], b[1]), z], size: [Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]), h] };
    if (s.move) t.move = turnPointK(s.move, k);
    if (s.round === 'x' || s.round === 'y') t.round = k % 2 ? (s.round === 'x' ? 'y' : 'x') : s.round;
    if (s.open) {
      // Each open side turns with the body; a side that now faces away is closed.
      const faces = [...s.open].map((f) => turnFace(f, k)).filter((f) => f === 'x' || f === 'y').sort().join('');
      if (faces) t.open = faces;
      else { delete t.open; delete t.wall; closed.add(s.id); }
    }
    out.push(t);
  }
  const boxes = new Map(out.map((b) => [b.id, b]));
  const hidden = (s) => {
    const holder = s.inside ?? boxes.get(s.on)?.inside;
    return holder !== undefined && closed.has(holder);
  };
  const kept = out.filter((b) => !hidden(b));
  const keptIds = new Set(kept.map((b) => b.id));
  for (const s of named) {
    if (s.kind === 'box') continue;
    if (hidden(s) || (s.on !== undefined && !keptIds.has(s.on))) continue;
    const t = { ...s };
    if (s.face !== undefined && s.on !== undefined) {
      const f = turnFace(s.face, k);
      if (!['x', 'y', 'top'].includes(f)) continue; // this side now faces away
      t.face = f;
    }
    if (s.kind === 'dot' || s.kind === 'disc' || s.kind === 'glow') t.at = turnPointK(s.at, k);
    else t.points = s.points.map((p) => turnPointK(p, k));
    kept.push(t);
  }
  return kept;
}

/**
 * Draw order for a scene: farther solids first, contents after their container, each solid's details
 * right after it, free lines last.
 * @param {object[]} shapes shapes with ids
 */
export function sortShapes(shapes) {
  if (!Array.isArray(shapes)) throw new TypeError('sortShapes: shapes must be an array');
  const boxes = shapes.filter((s) => s.kind === 'box');
  const e = 1e-6;
  const max = (b, k) => b.at[k] + b.size[k];
  // a must be drawn before b
  const before = (a, b) => {
    if (b.inside === a.id) return true;
    if (a.inside === b.id) return false;
    const votes = [0, 1, 2].map((k) => (max(a, k) <= b.at[k] + e ? 1 : max(b, k) <= a.at[k] + e ? -1 : 0));
    const yes = votes.filter((v) => v === 1).length; const no = votes.filter((v) => v === -1).length;
    if (yes && !no) return true;
    if (no && !yes) return false;
    const depth = (s) => s.at[0] + s.size[0] / 2 + s.at[1] + s.size[1] / 2 + s.at[2] + s.size[2] / 2;
    return depth(a) < depth(b);
  };
  const left = boxes.slice();
  const order = [];
  while (left.length) {
    let i = left.findIndex((c) => left.every((o) => o === c || !before(o, c)));
    if (i < 0) {
      // A cycle (three solids each partly behind the next): take the one with the fewest solids still behind it.
      const waiting = left.map((c) => left.filter((o) => o !== c && before(o, c)).length);
      i = waiting.indexOf(Math.min(...waiting));
    }
    order.push(left.splice(i, 1)[0]);
  }
  const out = [];
  for (const b of order) {
    out.push(b);
    for (const s of shapes) if (s.kind !== 'box' && s.on === b.id) out.push(s);
  }
  for (const s of shapes) if (s.kind !== 'box' && s.on === undefined && s.inside === undefined) out.push(s);
  // Free shapes inside a container (pipes, lamp glow) follow the container's contents.
  for (const s of shapes) if (s.kind !== 'box' && s.on === undefined && s.inside !== undefined) out.push(s);
  return out;
}

/**
 * Render the scene from four sides. View 0 keeps the author's draw order; the others are ordered by sortShapes.
 * @param {object[]} shapes @param {object} [opts] renderSvg options (labels, requiredParts, title, fontSize, padding)
 * @returns {{svg:string, model:object, view:number}[]}
 */
export function renderViews(shapes, opts = {}) {
  if (!Array.isArray(shapes)) throw new TypeError('renderViews: shapes must be an array');
  const pre = typeof opts.idPrefix === 'string' ? opts.idPrefix : 'fc';
  return [0, 1, 2, 3].map((k) => {
    const turned = turnShapes(shapes, k);
    const ids = new Set(turned.map((s) => s.id));
    const labels = (opts.labels ?? []).map((l) => ({ ...l, at: turnPointK(l.at, k) }));
    const r = renderSvg(k === 0 ? turned : sortShapes(turned), {
      ...opts,
      labels,
      requiredParts: opts.requiredParts?.filter((id) => k === 0 || ids.has(id)),
      idPrefix: `${pre}${k}`,
      title: opts.title ? `${opts.title} (view ${k + 1} of 4)` : undefined,
    });
    return { ...r, view: k };
  });
}

/**
 * Render every state of the scene from four sides. Shapes with `when: '<state>'` are drawn only in that
 * state; a scene with no `when` has the single state "default".
 * @param {object[]} shapes @param {object} [opts] renderSvg options; `states` sets the order (the first is shown first)
 * @returns {Record<string, {svg:string, model:object, view:number}[]>}
 */
export function renderStates(shapes, opts = {}) {
  if (!Array.isArray(shapes)) throw new TypeError('renderStates: shapes must be an array');
  const found = [...new Set(shapes.map((s) => s.when).filter((w) => w !== undefined))];
  const names = Array.isArray(opts.states) && opts.states.length ? opts.states : found.length ? found : ['default'];
  const pre = typeof opts.idPrefix === 'string' ? opts.idPrefix : 'fc';
  const { states, ...rest } = opts;
  return Object.fromEntries(names.map((name, i) => [name, renderViews(shapes.filter((s) => s.when === undefined || s.when === name), { ...rest, idPrefix: `${pre}${String.fromCharCode(97 + i)}` })]));
}

/**
 * Markup for an orbit: every view stacked, one shown, with turn buttons, drag and arrow keys, and a
 * state button when the scene has two states (for example Open and Close).
 * Without JavaScript the first view of the first state is shown. Colours come from the page tokens.
 * @param {{svg:string}[] | Record<string,{svg:string}[]>} views from renderViews or renderStates
 * @param {{id?:string, label?:string, stateLabels?:Record<string,string>}} [opts] stateLabels: the button text that leads to each state, e.g. { open: 'Open the doors', closed: 'Close the doors' }
 */
export function orbitHtml(views, opts = {}) {
  const states = Array.isArray(views) ? { default: views } : views;
  const names = Object.keys(states ?? {});
  if (!names.length || !names.every((n) => Array.isArray(states[n]) && states[n].length === 4 && states[n].every((v) => v && typeof v.svg === 'string'))) throw new TypeError('orbitHtml: four rendered views per state required');
  const id = typeof opts.id === 'string' && /^[a-z][\w-]*$/i.test(opts.id) ? opts.id : 'fc-orbit';
  const escText = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const label = escText(opts.label ?? 'Figure');
  const frames = names.map((n, si) => states[n].map((v, i) => `<div class="fc-orbit-view" data-state="${escText(n)}" data-view="${i}"${si || i ? ' hidden' : ''}>${v.svg}</div>`).join('')).join('');
  const texts = Object.fromEntries(names.map((n) => [n, String(opts.stateLabels?.[n] ?? n.charAt(0).toUpperCase() + n.slice(1))]));
  const cap = (n) => escText(texts[n]);
  const stateBtn = names.length > 1 ? `<button type="button" data-orbit-toggle aria-label="Change state">${cap(names[1])}</button>` : '';
  const css = `#${id}{position:relative;touch-action:pan-y}` +
    // The figure never grows taller than the screen, so the controls stay in view.
    `#${id} .fc-orbit-view svg{display:block;margin:0 auto;width:100%;height:auto;max-height:min(70vh,640px)}` +
    `#${id} .fc-orbit-bar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:center;margin-top:8px;font:inherit;font-size:.85rem;color:var(--muted)}` +
    `#${id} .fc-orbit-bar button{font:inherit;color:var(--fg);background:var(--surface);border:1px solid var(--line);border-radius:999px;padding:4px 12px;cursor:pointer}` +
    `#${id} .fc-orbit-bar button:hover{border-color:var(--line-strong)}` +
    `#${id} .fc-orbit-bar button:focus-visible{outline:2px solid var(--ok);outline-offset:2px}#${id}.fc-drag{cursor:grabbing}`;
  const js = `(function(){var r=document.getElementById(${JSON.stringify(id)});if(!r)return;var v=r.querySelectorAll('.fc-orbit-view'),s=r.querySelector('[data-orbit-state]'),t=r.querySelector('[data-orbit-toggle]'),names=${JSON.stringify(names)},texts=${JSON.stringify(texts).replace(/</g, '\\u003c')},n=0,st=0;` +
    `function cap(x){return texts[x];}` +
    `function show(){for(var i=0;i<v.length;i++)v[i].hidden=!(v[i].getAttribute('data-state')===names[st]&&+v[i].getAttribute('data-view')===n);if(s)s.textContent='View '+(n+1)+' of 4';if(t)t.textContent=cap(names[(st+1)%names.length]);}` +
    `function turn(d){n=((n+d)%4+4)%4;show();}` +
    `r.querySelector('[data-orbit="-1"]').addEventListener('click',function(){turn(-1);});r.querySelector('[data-orbit="1"]').addEventListener('click',function(){turn(1);});` +
    `if(t)t.addEventListener('click',function(){st=(st+1)%names.length;show();});` +
    `r.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){turn(-1);e.preventDefault();}if(e.key==='ArrowRight'){turn(1);e.preventDefault();}});` +
    `var x0=null;r.addEventListener('pointerdown',function(e){if(e.target.closest('button'))return;x0=e.clientX;r.classList.add('fc-drag');});` +
    `window.addEventListener('pointerup',function(e){if(x0===null)return;var d=e.clientX-x0;x0=null;r.classList.remove('fc-drag');if(Math.abs(d)>40)turn(d<0?1:-1);});show();})();`;
  return `<div class="fc-orbit" id="${id}" role="group" aria-label="${label}: turn to see each side"><style>${css}</style>${frames}` +
    `<div class="fc-orbit-bar"><button type="button" data-orbit="-1" aria-label="Turn left">&#8592; Turn</button><span data-orbit-state aria-live="polite">View 1 of 4</span><button type="button" data-orbit="1" aria-label="Turn right">Turn &#8594;</button>${stateBtn}</div>` +
    `<script>${js}</script></div>`;
}
