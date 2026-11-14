/**
 * Electric kettle figure (figure-craft). Builds electric-kettle.html, electric-kettle.svg and lint-report.json
 * from the figure-craft engine. Run from this folder: node build-figure.mjs
 * The engine is imported from the skill folder; nothing in the SVG or HTML is edited by hand.
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { box, line, disc, labelTarget } from '../../../../src/skills/figure-craft/engine/iso.mjs';
import { renderViews, orbitHtml } from '../../../../src/skills/figure-craft/engine/orbit.mjs';
import { lintStates } from '../../../../src/skills/figure-craft/engine/lint.mjs';
import { lintCards, cardsHtml } from '../../../../src/skills/figure-craft/engine/page.mjs';
import { tokensCss } from '../../../../src/skills/figure-craft/engine/tokens.mjs';
import { topRing, ring, rings, band, handle, spout, lid, attach } from '../../../../src/skills/figure-craft/engine/kit.mjs';
import { surfacePoint } from '../../../../src/skills/figure-craft/engine/round.mjs';

const SLUG = 'electric-kettle';
const TITLE = 'How an electric kettle boils water';
const FIG_TITLE = 'An electric kettle with its lid lifted and the jug cut open: the element heats the water until the steam trips the switch.';
const IDEA = 'An electric kettle boils water: a heating element on the floor of the jug heats the water, and when it boils, the steam trips a switch that cuts the power.';

const CX = 50;
const CY = 50;
const W = { when: 'open' }; // parts that exist only in the open state (the jug cut open, with water inside)
const deg = (a) => (a * Math.PI) / 180;
const onRim = (r, a, z = 0) => [CX + r * Math.cos(deg(a)), CY + r * Math.sin(deg(a)), z];

/** The parts the idea needs. Each is a solid box with this id, drawn in the first state and labelled. */
export const REQUIRED_PARTS = ['base', 'jug', 'lid', 'element', 'water', 'steam-switch', 'spout', 'handle'];

/**
 * Label anchors sit inside the part they name, and `part` is the box the anchor must resolve to. `states` says in which
 * state the part exists: the parts inside the jug are labelled only in the open state, where they are drawn. The lid
 * moves, so it has one anchor per state.
 */
export const LABELS = [
  { at: [CX - 3, CY - 3, 23], text: 'Bubble', part: 'bubble', states: ['open'] },
  { at: [CX + 6, CY - 6, 40], text: 'Water', part: 'water', states: ['open'] },
  { at: [CX, CY, 13.5], text: 'Heating element', part: 'element', states: ['open'] },
  { at: [23, CY - 1, 90], text: 'Steam switch', part: 'steam-switch', states: ['open'] },
  { at: [-9, CY, 92], text: 'Spout', part: 'spout', states: ['open', 'closed'] },
  { at: [104.25, CY, 52], text: 'Handle', part: 'handle', states: ['open', 'closed'] },
  { at: [CX + 18, CY - 18, 98], text: 'Jug', part: 'jug', states: ['open', 'closed'] },
  { at: [CX, CY, 6], text: 'Power base', part: 'base', states: ['open', 'closed'] },
  { at: [CX, CY, 149.5], text: 'Lid', part: 'lid', states: ['open'] },
  { at: [CX, CY, 109.5], text: 'Lid', part: 'lid', states: ['closed'] },
];
const STATES = ['open', 'closed'];

/** What each part does and where it really sits (rule R-figure-craft-31). Assumed locations are marked. */
const SRC = 'Typical electric kettle layout from general knowledge; no kettle model was supplied.';
export const CARDS = [
  { name: 'Jug', does: 'Holds the water and keeps it in while it heats.', where: 'The main round body. It stands on the power base, and its open top is closed by the lid.', source: SRC },
  { name: 'Lid', does: 'Closes the top of the jug. Drawn lifted here, to show the open mouth.', where: 'Sits on the top rim of the jug, with a knob and a steam vent on its top. Real lids hinge at the back; this figure lifts it straight up.', source: SRC },
  { name: 'Water', does: 'The water to be boiled, which the element heats from below.', where: 'Fills the jug above the heating element, up to the level the window shows.', source: SRC },
  { name: 'Heating element', does: 'Turns electric current into heat, which passes into the water.', where: 'A flat plate on the floor of the jug, inside it, under the water.', source: SRC },
  { name: 'Steam switch', does: 'Steam from the spout bends this metal switch, which cuts the power when the water boils.', where: 'Inside the jug near the spout, above the water. Its exact place differs between kettles.', assumed: true, source: SRC },
  { name: 'Spout', does: 'Pours the water out, and lets the steam out of the jug.', where: 'Fixed to the outside of the jug wall near the top, on the side opposite the handle.', source: SRC },
  { name: 'Handle', does: 'Lets you lift and pour the jug without touching its hot wall.', where: 'Fixed to the outside of the jug on the side away from the spout, between the base and the top.', source: SRC },
  { name: 'Power base', does: 'Carries power from the cord to the jug through the contacts on its top.', where: 'The round base under the jug, lifted on feet. The cord leaves it at the back and the contacts sit on its top.', source: SRC },
  { name: 'Bubble', does: 'A bubble that forms at the element and rises as the water heats.', where: 'An illustration inside the water, above the element. It is not a fixed part of the kettle.', assumed: true, source: SRC },
];

/** A zigzag coil across the top of the element, one line. */
const coilPoints = (z) => Array.from({ length: 9 }, (_, i) => [CX - 16 + 4 * i, CY + (i % 2 ? 8 : -8), z]);

/** The lid in each state, as the kit draws it (same geometry: a disc of radius 36.8, thickness 3, on the jug mouth). */
const LID_Z = { closed: 108, open: 148 };

/** Build the scene. Back parts first, then the base, the jug, what is inside it, and the parts on the outside. */
export function shapes() {
  // The base stands on four feet. Its top is at z 12, where the jug sits.
  const feet = [45, 135, 225, 315].map((a, i) => box({ at: [onRim(40, a)[0] - 3, onRim(40, a)[1] - 3, 0], size: [6, 6, 2], round: true, material: 'dark', id: `foot-${i}` }));
  const base = box({ at: [6, 6, 2], size: [88, 88, 10], round: true, material: 'dark', id: 'base', rests: 'foot-0' });
  const cordClip = attach(base, '-x', { reach: 4, width: 6, z: 6, height: 4, id: 'cord-clip', material: 'dark' });
  const cord = line([surfacePoint(base, 200, 6), [-4, 30, 4], [-22, 24, 1], [-36, 18, 1]], { bold: true, id: 'cord' });
  const plug = box({ at: [-46, 12, 0], size: [10, 10, 6], material: 'dark', id: 'plug' });
  const jugBody = { kind: 'box', id: 'jug', at: [14, 14, 12], size: [72, 72, 96], round: true, wall: 2.5, mouth: true };
  const spoutParts = spout(jugBody, '-x', { id: 'spout', z: 80, reach: 30, diameter: 20 });
  const hinge = attach(jugBody, '-y', { reach: 4, width: 9, z: 100, height: 8, id: 'lid-hinge', material: 'steel' });
  const hinge2 = attach(jugBody, '-y', { reach: 4, width: 4, z: 100, height: 8, along: 9, id: 'lid-hinge-2', material: 'steel' });

  const jugOpen = box({ at: [14, 14, 12], size: [72, 72, 96], round: true, material: 'steel', id: 'jug', rests: 'base', open: 'y', wall: 2.5, mouth: true, when: 'open' });
  const jugShut = box({ at: [14, 14, 12], size: [72, 72, 96], round: true, material: 'steel', id: 'jug', rests: 'base', wall: 2.5, mouth: true, when: 'closed' });

  const element = box({ at: [CX - 22, CY - 22, 12], size: [44, 44, 3], round: true, material: 'dark', inside: 'jug', rests: 'jug', id: 'element', ...W });
  const water = box({ at: [CX - 31, CY - 31, 15], size: [62, 62, 57], round: true, material: 'glass', inside: 'jug', rests: 'element', id: 'water', ...W });
  const bubble = box({ at: [CX - 4, CY - 4, 20], size: [6, 6, 6], round: true, material: 'white', inside: 'jug', move: [0, 0, 30], anim: 'rise', id: 'bubble', ...W });
  const steamSwitch = box({ at: [CX - 30, CY - 6, 84], size: [6, 12, 12], material: 'steel', inside: 'jug', id: 'steam-switch', ...W });

  const lidParts = lid(jugBody, { id: 'lid', lift: 40, thick: 3 });
  const hand = handle(jugBody, 'x', { id: 'handle', z0: 34, z1: 70, reach: 20, thick: 3.5, width: 5 });

  return [
    // Behind the body: the cord and plug, the spout on the back side (-x), the spout flange and the lid hinge
    cord, plug,
    ...[1.5, 4.5].map((z, i) => line([[-46, 22, z], [-36, 22, z]], { on: 'plug', face: 'y', id: `plug-seam-${i}` })),
    disc([-43, 15, 6], { on: 'plug', face: 'top', r: 0.8, material: 'steel', id: 'plug-pin-1' }),
    disc([-43, 19, 6], { on: 'plug', face: 'top', r: 0.8, material: 'steel', id: 'plug-pin-2' }),
    disc([-41.5, 17, 6], { on: 'plug', face: 'top', r: 0.8, material: 'steel', id: 'plug-pin-3' }),
    ...spoutParts,
    box({ at: [-5, CY - 11, 74], size: [2.5, 22, 22], material: 'white', id: 'spout-flange' }),
    disc([-3.75, CY + 11, 78], { on: 'spout-flange', face: 'y', r: 0.8, material: 'steel', id: 'spout-flange-screw-1' }),
    disc([-3.75, CY + 11, 92], { on: 'spout-flange', face: 'y', r: 0.8, material: 'steel', id: 'spout-flange-screw-2' }),
    line([[-2.5, CY + 10, 84], [12, CY + 10, 84]], { on: 'spout-neck', face: 'y', id: 'spout-neck-seam' }),
    line([[6, CY + 10, 82], [6, CY + 10, 98]], { on: 'spout-neck', face: 'y', id: 'spout-neck-clamp' }),
    line([[-14, CY + 7.2, 94], [-4, CY + 7.2, 94]], { on: 'spout', face: 'y', id: 'spout-lip-seam' }),
    line([[-14, CY + 7.2, 98], [-4, CY + 7.2, 98]], { on: 'spout', face: 'y', id: 'spout-lip-seam-2' }),
    line([[-14, CY + 7.2, 90], [-4, CY + 7.2, 90]], { on: 'spout', face: 'y', id: 'spout-lip-seam-3' }),
    line([[1, CY + 10, 88], [1, CY + 10, 96]], { on: 'spout-neck', face: 'y', id: 'spout-neck-seam-2' }),
    hinge,
    line([[CX - 3.5, 12.5, 108], [CX + 3.5, 12.5, 108]], { on: 'lid-hinge', face: 'top', id: 'lid-hinge-pin' }),
    hinge2,
    line([[CX + 7.5, 12.5, 108], [CX + 10.5, 12.5, 108]], { on: 'lid-hinge-2', face: 'top', id: 'lid-hinge-pin-2' }),
    cordClip,
    // The feet, then the base that carries the body
    ...feet,
    base,
    topRing(base, 40, { z: 12, id: 'base-top-ring' }),
    topRing(base, 42, { z: 12, id: 'base-top-ring-outer' }),
    topRing(base, 38, { z: 12, id: 'base-top-ring-inner' }),
    ring(base, 4, { id: 'base-ring-low' }),
    ring(base, 9, { id: 'base-ring-high' }),
    ring(base, 2.5, { id: 'base-foot-line' }),
    band(base, 4.5, 8, { from: 50, to: 70, material: 'steel', id: 'base-switch' }),
    ring(base, 6.2, { from: 52, to: 68, id: 'base-switch-slot' }),
    disc(onRim(40, 90, 12), { on: 'base', face: 'top', r: 1.2, material: 'steel', id: 'base-light' }),
    ...[0, 1, 2, 3, 4].map((i) => ring(base, 7, { from: 100 + i * 5, to: 102.5 + i * 5, id: `base-vent-${i}` })),
    ...[0, 1, 2, 3, 4].map((i) => ring(base, 11, { from: 100 + i * 5, to: 102.5 + i * 5, id: `base-vent-row2-${i}` })),
    ...[0, 1, 2, 3].map((i) => ring(base, 7, { from: 150 + i * 8, to: 154 + i * 8, id: `base-back-vent-${i}` })),
    box({ at: onRim(39, -28, 12).map((v, k) => (k === 2 ? 12 : v - 2)), size: [4, 4, 2], round: true, material: 'steel', rests: 'base', id: 'contact-1' }),
    box({ at: onRim(39, 28, 12).map((v, k) => (k === 2 ? 12 : v - 2)), size: [4, 4, 2], round: true, material: 'steel', rests: 'base', id: 'contact-2' }),
    disc(onRim(39, -28, 14), { on: 'contact-1', face: 'top', r: 0.9, material: 'dark', id: 'contact-1-pin' }),
    disc(onRim(39, 28, 14), { on: 'contact-2', face: 'top', r: 0.9, material: 'dark', id: 'contact-2-pin' }),
    line([[CX - 39, CY - 2, 12], [CX - 39, CY + 2, 12]], { on: 'base', face: 'top', id: 'base-notch' }),
    // The jug, open at the front-left and closed in the other state
    jugOpen,
    jugShut,
    ...rings(jugBody, [14, 104], { id: 'jug-ring' }),
    ring(jugBody, 106, { id: 'jug-rim' }),
    ring(jugBody, 20, { id: 'jug-ring-low' }),
    line([surfacePoint(jugBody, 30, 18), surfacePoint(jugBody, 30, 100)], { on: 'jug', face: 'wrap', id: 'jug-seam' }),
    band(jugBody, 36, 62, { from: -40, to: -14, material: 'glass', id: 'level-window' }),
    ring(jugBody, 62, { from: -40, to: -14, id: 'level-max' }),
    ring(jugBody, 36, { from: -40, to: -14, id: 'level-min' }),
    line([surfacePoint(jugBody, -40, 36), surfacePoint(jugBody, -40, 62)], { on: 'jug', face: 'wrap', id: 'level-edge-a' }),
    line([surfacePoint(jugBody, -14, 36), surfacePoint(jugBody, -14, 62)], { on: 'jug', face: 'wrap', id: 'level-edge-b' }),
    ...[42, 48, 54].map((z, i) => ring(jugBody, z, { from: -38, to: -32, id: `level-tick-${i}` })),
    // Inside the jug, open state only
    element,
    topRing(element, 18, { z: 15, id: 'element-ring', ...W }),
    topRing(element, 12, { z: 15, id: 'element-ring-inner', ...W }),
    topRing(element, 6, { z: 15, id: 'element-ring-core', ...W }),
    line(coilPoints(15), { on: 'element', face: 'top', id: 'element-coil', ...W }),
    box({ at: [CX - 14.5, CY + 9.5, 15], size: [5, 5, 3], material: 'steel', inside: 'jug', rests: 'element', id: 'terminal-1', ...W }),
    box({ at: [CX + 9.5, CY + 9.5, 15], size: [5, 5, 3], material: 'steel', inside: 'jug', rests: 'element', id: 'terminal-2', ...W }),
    disc([CX - 12, CY + 12, 18], { on: 'terminal-1', face: 'top', r: 1.2, material: 'dark', id: 'terminal-1-screw', ...W }),
    disc([CX + 12, CY + 12, 18], { on: 'terminal-2', face: 'top', r: 1.2, material: 'dark', id: 'terminal-2-screw', ...W }),
    disc([CX - 19, CY, 15], { on: 'element', face: 'top', r: 1.2, material: 'steel', id: 'element-bolt-1', ...W }),
    disc([CX + 19, CY, 15], { on: 'element', face: 'top', r: 1.2, material: 'steel', id: 'element-bolt-2', ...W }),
    disc([CX, CY, 15], { on: 'element', face: 'top', r: 3, material: 'steel', id: 'thermostat', ...W }),
    disc([CX, CY - 19, 15], { on: 'element', face: 'top', r: 1.2, material: 'steel', id: 'element-stud-1', ...W }),
    disc([CX, CY + 19, 15], { on: 'element', face: 'top', r: 1.2, material: 'steel', id: 'element-stud-2', ...W }),
    water,
    topRing(water, 28, { z: 72, id: 'water-surface', ...W }),
    ring(water, 72, { from: -45, to: 135, id: 'water-rim', ...W }),
    ring(water, 36, { from: -45, to: 135, id: 'water-level', ...W }),
    bubble,
    steamSwitch,
    box({ at: [CX - 24, CY - 4, 88], size: [3, 8, 4], material: 'steel', inside: 'jug', id: 'steam-bimetal', ...W }),
    line([[CX - 30, CY - 3, 96], [CX - 24, CY - 3, 96]], { on: 'steam-switch', face: 'top', id: 'steam-seam', ...W }),
    line([[CX - 24, CY - 4, 86], [CX - 24, CY + 4, 86], [CX - 24, CY + 4, 94]], { on: 'steam-switch', face: 'x', id: 'steam-strip', ...W }),
    line([[CX - 24, CY - 4, 91], [CX - 24, CY + 4, 91]], { on: 'steam-switch', face: 'x', id: 'steam-strip-2', ...W }),
    disc([CX - 24, CY - 3, 92], { on: 'steam-switch', face: 'x', r: 1.2, material: 'steel', id: 'steam-screw', ...W }),
    // Parts on the outside, after the body
    ...hand,
    ...[0.1, 0.2, 0.4, 0.6, 0.8, 0.9].map((t) => line([[106, 48.1, 34 + 36 * t], [106, 51.9, 34 + 36 * t]], { on: 'handle', face: 'x', id: `handle-rib-${Math.round(t * 100)}` })),
    // The lid, lifted in the open state and on the mouth in the closed state
    ...lidParts,
    ...['closed', 'open'].flatMap((state) => {
      const zz = LID_Z[state];
      const R = 36.8;
      const lidBody = { kind: 'box', id: 'lid', at: [CX - R, CY - R, zz], size: [2 * R, 2 * R, 3], round: true };
      return [
        ring(lidBody, zz + 0.4, { id: `lid-seal-${state}`, when: state }),
        disc([CX, CY + 8, zz + 3], { on: 'lid', face: 'top', r: 1.2, material: 'dark', id: `lid-vent-${state}`, when: state }),
        line([[CX - 6, CY + 14, zz + 3], [CX + 6, CY + 14, zz + 3]], { on: 'lid', face: 'top', id: `lid-slot-a-${state}`, when: state }),
        line([[CX - 6, CY + 18, zz + 3], [CX + 6, CY + 18, zz + 3]], { on: 'lid', face: 'top', id: `lid-slot-b-${state}`, when: state }),
      ];
    }),
  ];
}

/**
 * Both states, four views each: what the page shows and what lint checks. Each state is rendered with renderViews and
 * its own label list (the same engine as renderStates, which gives every state one shared list). Shapes with `when`
 * appear only in their state; the others appear in both.
 */
export function kettleStates() {
  const all = shapes();
  return Object.fromEntries(STATES.map((name, i) => [name, renderViews(
    all.filter((s) => s.when === undefined || s.when === name),
    { requiredParts: REQUIRED_PARTS, title: FIG_TITLE, idPrefix: `fc${String.fromCharCode(97 + i)}`, labels: LABELS.filter((l) => l.states.includes(name)).map(({ at, text }) => ({ at, text })) },
  )]));
}

/** Every label must name the part it is meant for, in every state where it is shown; a label may not land on another part. */
export function labelCheck(states) {
  const errors = [];
  for (const name of STATES) {
    const shapes0 = states[name][0].model.shapes;
    const want = LABELS.filter((l) => l.states.includes(name));
    for (const l of want) {
      const hit = labelTarget({ at: l.at }, shapes0);
      if (!hit || hit.id !== l.part) errors.push({ rule: 'label-target', message: `"${l.text}" in ${name} lands on ${hit?.id ?? 'nothing'}, not ${l.part}` });
    }
    const shown = states[name][0].model.labels ?? [];
    if (shown.length !== want.length) errors.push({ rule: 'label-target', message: `${name}: ${shown.length} labels shown, ${want.length} expected` });
  }
  return errors;
}

/** Lint for every state and view, the label targets, and the cards under the figure. */
export function kettleLint(states) {
  const r = lintStates(states);
  const c = lintCards(CARDS, LABELS);
  const t = labelCheck(states);
  return { errors: [...r.errors, ...c.errors, ...t], warnings: [...r.warnings, ...c.warnings] };
}

function page(figure) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${TITLE}</title>
<script>try{var t=localStorage.getItem('fc-theme');if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t);}catch(e){}</script>
<style>
${tokensCss()}*{box-sizing:border-box}
html,body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.5 system-ui,sans-serif}
main{max-width:760px;margin:0 auto;padding:24px 16px 48px}
header{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
h1{font-size:1.4rem;line-height:1.25;margin:0;font-weight:600}
.kicker{color:var(--muted);font-size:.8rem;margin:0 0 4px;letter-spacing:.06em}
button{font:inherit;font-size:.85rem;color:var(--fg);background:var(--surface);border:1px solid var(--line);border-radius:999px;padding:5px 12px;cursor:pointer}
button:hover{border-color:var(--line-strong)}
button:focus-visible{outline:2px solid var(--ok);outline-offset:2px}
.lede{color:var(--muted);max-width:60ch}
figure{margin:20px 0;padding:16px;background:var(--surface);border:1px solid var(--line);border-radius:14px}
figcaption{color:var(--muted);font-size:.9rem;margin-top:10px;text-align:center}
.paused svg *{animation-play-state:paused!important}
@media (max-width:480px){figure{padding:8px}}
</style>
</head>
<body>
<main>
<header>
<div><p class="kicker">FIGURE</p><h1>${TITLE}</h1></div>
<button type="button" id="theme" aria-pressed="false">Dark theme</button>
</header>
<p class="lede">${IDEA}</p>
<figure id="fig">
${figure}
<figcaption>Hover or tap a part to see its name. Turn it to see every side. <button type="button" id="play" aria-pressed="true">Pause motion</button></figcaption>
</figure>
${cardsHtml(CARDS)}
</main>
<script>
(function(){
  var root=document.documentElement, tb=document.getElementById('theme'), pb=document.getElementById('play'), fig=document.getElementById('fig');
  var mq=window.matchMedia('(prefers-color-scheme: dark)');
  function isDark(){var t=root.getAttribute('data-theme');return t?t==='dark':mq.matches;}
  function sync(){var d=isDark();tb.textContent=d?'Light theme':'Dark theme';tb.setAttribute('aria-pressed',String(d));}
  tb.addEventListener('click',function(){var next=isDark()?'light':'dark';root.setAttribute('data-theme',next);try{localStorage.setItem('fc-theme',next);}catch(e){}sync();});
  if(mq.addEventListener)mq.addEventListener('change',sync);
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce){pb.hidden=true;}
  pb.addEventListener('click',function(){var p=fig.classList.toggle('paused');pb.textContent=p?'Play motion':'Pause motion';pb.setAttribute('aria-pressed',String(!p));});
  sync();
})();
</script>
</body>
</html>
`;
}

const states = kettleStates();
const report = kettleLint(states);
const at = (p) => fileURLToPath(new URL(p, import.meta.url));
writeFileSync(at('./lint-report.json'), JSON.stringify({ errors: report.errors, warnings: report.warnings }, null, 2) + '\n');
writeFileSync(at(`./${SLUG}.svg`), states.open[0].svg);
writeFileSync(at(`./${SLUG}.html`), page(orbitHtml(states, { label: 'Electric kettle', stateLabels: { open: 'Open the jug', closed: 'Close the jug' } })));
console.log(`errors: ${report.errors.length}, warnings: ${report.warnings.length}`);
for (const e of report.errors) console.log(`ERROR ${e.rule}: ${e.message}`);
for (const w of report.warnings) console.log(`WARN ${w.rule}: ${w.message}`);
if (report.errors.length) process.exitCode = 1;
