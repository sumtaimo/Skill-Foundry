/**
 * Build script for the electric kettle figure (figure-craft).
 * Writes electric-kettle.html, electric-kettle.svg and lint-report.json into the folder this script is in.
 * Uses the figure-craft engine from the skill folder. Run: node build-figure.mjs
 * Node 22+, stdlib only.
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { box, line, disc } from '/home/user/Skill-Foundry/src/skills/figure-craft/engine/iso.mjs';
import { renderStates, orbitHtml } from '/home/user/Skill-Foundry/src/skills/figure-craft/engine/orbit.mjs';
import { lintStates } from '/home/user/Skill-Foundry/src/skills/figure-craft/engine/lint.mjs';
import { ring, band, topRing, lid, handle, spout, attach, slots } from '/home/user/Skill-Foundry/src/skills/figure-craft/engine/kit.mjs';
import { cardsHtml, lintCards } from '/home/user/Skill-Foundry/src/skills/figure-craft/engine/page.mjs';
import { tokensCss } from '/home/user/Skill-Foundry/src/skills/figure-craft/engine/tokens.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const TITLE = 'How an electric kettle boils water';
const FIG_TITLE = 'An electric kettle with its lid lifted and its side cut away: the water sits over the heating element, and the thermostat watches it.';
const IDEA = 'An electric kettle boils water by passing current through a heating element on the floor of its body, which heats the water until the thermostat switches the power off.';

// Geometry (arbitrary units). Body centre (34, 34). Feet on the ground, the power base on the feet, the body on the base.
const CX = 34; const CY = 34;
const BASE_Z = 3; const BASE_H = 15; // base spans z 3..15; the body stands from z 15
const BODY_R = 28; const WALL = 2.5;
const BODY_H = 80; const BODY_TOP = BASE_H + BODY_H; // 95
const FLOOR = BASE_H + WALL; // inside floor of the body
const PLATE_Z = FLOOR; const PLATE_TOP = PLATE_Z + 2; // heating plate, top face
const WATER_TOP = PLATE_TOP + 56;
const LID_LIFT = 40;

/** The parts the idea needs. Never shortened to make a check pass. */
export const REQUIRED_PARTS = ['body', 'water', 'element-plate', 'thermostat', 'lid', 'handle', 'spout', 'base', 'switch'];

/** Label anchors sit inside the part they name (the open state). */
export const LABELS = [
  { at: [CX, 20, BODY_TOP - 10], text: 'Kettle body' },
  { at: [CX + 4, CY + 4, 50], text: 'Water' },
  { at: [CX - 8, CY + 4, PLATE_TOP], text: 'Heating element' },
  { at: [CX - 1, CY - 1, PLATE_TOP + 3], text: 'Thermostat' },
  { at: [CX + 10, CY - 8, BODY_TOP + LID_LIFT + 1.5], text: 'Lid' },
  { at: [76.5, CY, 55], text: 'Handle' },
  { at: [-11, CY, 72], text: 'Spout' },
  { at: [CX, CY, 9], text: 'Power base' },
  { at: [62, CY, 9], text: 'On/off switch' },
];

const SRC = 'General layout of a common cordless electric kettle; not checked against one model.';
const CARDS = [
  { name: 'Kettle body', does: 'Holds the water and keeps the heat in while it boils.', where: 'The round steel jug that stands on the power base, with the lid on its open top.', source: SRC },
  { name: 'Water', does: 'The water to boil. It is shown clear so the element and thermostat stay visible.', where: 'Inside the body, sitting on the heating element; its level is seen through the window in the wall.', source: SRC },
  { name: 'Heating element', does: 'Heats the water from the bottom when current flows through its coil.', where: 'On the floor of the body, under the water; the coil rings sit on its top face.', source: 'Assumed arrangement: the element is drawn exposed on the floor. Many kettles hide it under the floor.', assumed: true },
  { name: 'Thermostat', does: 'Senses the water temperature and switches the element off when the water boils.', where: 'On top of the heating element, in the water; it is the small disc at the centre of the floor.', source: 'Assumed placement: kettles put the boil cut-out in different spots (plate underside, steam path near the spout).', assumed: true },
  { name: 'Lid', does: 'Closes the top of the body, keeps the steam in and lets you fill the kettle.', where: 'Sits on the open top of the body when closed; shown lifted straight up here. A real kettle lid is hinged at the back.', source: SRC },
  { name: 'Handle', does: 'The grip you hold to lift and pour the kettle.', where: 'Fixed to the outside of the body on one side, from near the top down to the middle, opposite the spout.', source: SRC },
  { name: 'Spout', does: 'Directs the water out when you pour.', where: 'Fixed to the outside of the body near the top, on the side opposite the handle.', source: SRC },
  { name: 'Power base', does: 'Carries the current from the mains cable to the kettle body.', where: 'The round base under the body, on three feet; the power cable leaves from its back.', source: SRC },
  { name: 'On/off switch', does: 'Starts and stops the heating.', where: 'On the outside of the power base, on its right-hand side below the body.', source: 'Assumed placement: many cordless kettles put the switch on the base; some put it on the handle.', assumed: true },
];

/** Build the kettle scene. The reader sees the open state first (lid lifted, side cut away, water inside). */
function shapes() {
  // Outside first: three feet, the power base on them, the steel body, the handle and the spout.
  const feet = [90, 210, 330].map((deg, i) => {
    const a = (deg * Math.PI) / 180;
    const x = CX + 20 * Math.cos(a) - 3.5; const y = CY + 20 * Math.sin(a) - 3.5;
    return box({ at: [x, y, 0], size: [7, 7, BASE_Z], round: true, material: 'dark', id: `foot-${i}` });
  });
  const feetRings = feet.flatMap((f, i) => [
    ring(f, 1.2, { id: `foot-${i}-ring` }),
    ring(f, 2.2, { id: `foot-${i}-ring-top` }),
  ]);
  const base = box({ at: [8, 8, BASE_Z], size: [52, 52, BASE_H - BASE_Z], round: true, material: 'dark', id: 'base', rests: 'foot-0' });
  const bodyOpen = box({ at: [CX - BODY_R, CY - BODY_R, BASE_H], size: [2 * BODY_R, 2 * BODY_R, BODY_H], round: true, mouth: true, open: 'y', wall: WALL, material: 'steel', id: 'body', rests: 'base', when: 'open' });
  const bodyShut = box({ at: [CX - BODY_R, CY - BODY_R, BASE_H], size: [2 * BODY_R, 2 * BODY_R, BODY_H], round: true, mouth: true, material: 'steel', id: 'body', rests: 'base', when: 'closed' });

  // Parts fixed to the back of the base (-y) go before the base; parts on its x side go after it.
  const cableSocket = attach(base, '-y', { reach: 4, width: 9, z: BASE_Z + 3, height: 7, id: 'cable-socket', material: 'dark' });
  const cableGrip = attach(base, '-y', { reach: 2, width: 13, z: BASE_Z + 1, height: 2, id: 'cable-grip', material: 'dark', along: 0 });
  const cableGripDetail = line([[CX - 6, 8 - 2, BASE_Z + 2], [CX + 6, 8 - 2, BASE_Z + 2]], { on: 'cable-grip', face: '-y', id: 'cable-grip-ridge' });

  // Parts fixed to the back of the body (-y) and to the spout side (-x) go before the body.
  const hinge = attach(bodyOpen, '-y', { reach: 3, width: 9, z: BODY_TOP - 8, height: 4, id: 'lid-hinge', material: 'dark' });
  // The hinge box sits behind the body: its top is at BODY_TOP - 4, its x runs CX-4.5..CX+4.5, its y 3..7.2 (see attach).
  const hingeDetail = [
    line([[CX - 3, 5, BODY_TOP - 4], [CX + 3, 5, BODY_TOP - 4]], { on: 'lid-hinge', face: 'top', id: 'lid-hinge-pin' }),
    line([[CX - 3, 6.5, BODY_TOP - 4], [CX + 3, 6.5, BODY_TOP - 4]], { on: 'lid-hinge', face: 'top', id: 'lid-hinge-seam' }),
  ];
  const spoutParts = spout(bodyOpen, '-x', { id: 'spout', z: 66, reach: 20, diameter: 15, rise: 3 });
  const spoutDetail = [];

  // Inside the body, seen through the open y side: the heating plate on the floor with its coil and terminals, the thermostat, the water.
  const plate = box({ at: [CX - 20, CY - 20, PLATE_Z], size: [40, 40, 2], round: true, material: 'steel', inside: 'body', rests: 'body', id: 'element-plate', when: 'open' });
  const thermostat = box({ at: [CX - 6, CY - 6, PLATE_TOP], size: [12, 12, 4], round: true, material: 'steel', inside: 'body', rests: 'element-plate', id: 'thermostat', when: 'open' });
  const water = box({ at: [CX - 24, CY - 24, PLATE_TOP], size: [48, 48, WATER_TOP - PLATE_TOP], round: true, material: 'glass', inside: 'body', rests: 'element-plate', id: 'water', when: 'open' });
  const zc = PLATE_TOP;
  const plateDetail = [
    topRing(plate, 16, { tone: 'warm', inside: 'body', when: 'open', id: 'coil-outer', z: zc }),
    topRing(plate, 11, { tone: 'warm', inside: 'body', when: 'open', id: 'coil-middle', z: zc }),
    topRing(plate, 6.5, { tone: 'warm', inside: 'body', when: 'open', id: 'coil-inner', z: zc }),
    topRing(plate, 13.5, { tone: 'warm', inside: 'body', when: 'open', id: 'coil-mid-2', z: zc }),
    topRing(plate, 18.5, { tone: 'warm', inside: 'body', when: 'open', id: 'coil-rim-2', z: zc }),
    line([[CX - 16, CY, zc], [CX - 11, CY + 3, zc], [CX - 6.5, CY, zc]], { tone: 'warm', inside: 'body', when: 'open', id: 'coil-lead' }),
    line([[CX - 19, CY - 19, zc], [CX - 19, CY + 19, zc]], { on: 'element-plate', face: 'top', inside: 'body', when: 'open', id: 'plate-edge' }),
    line([[CX - 20 + 1, CY - 2, zc], [CX - 20 + 1, CY + 2, zc]], { on: 'element-plate', face: 'top', inside: 'body', when: 'open', id: 'element-tab-1' }),
    line([[CX + 20 - 1, CY - 2, zc], [CX + 20 - 1, CY + 2, zc]], { on: 'element-plate', face: 'top', inside: 'body', when: 'open', id: 'element-tab-2' }),
    line([[CX - 2, CY - 19, zc], [CX + 2, CY - 19, zc]], { on: 'element-plate', face: 'top', inside: 'body', when: 'open', id: 'element-tab-3' }),
    line([[CX - 2, CY + 19, zc], [CX + 2, CY + 19, zc]], { on: 'element-plate', face: 'top', inside: 'body', when: 'open', id: 'element-tab-4' }),
  ];
  // Two terminal blocks on the plate, either side of the thermostat, each with its screw.
  const terminals = [
    box({ at: [CX - 15, CY - 4, zc], size: [4, 8, 3], material: 'dark', inside: 'body', rests: 'element-plate', id: 'terminal-block-1', when: 'open' }),
    box({ at: [CX + 11, CY - 4, zc], size: [4, 8, 3], material: 'dark', inside: 'body', rests: 'element-plate', id: 'terminal-block-2', when: 'open' }),
    line([[CX - 13, CY - 2, zc + 3], [CX - 13, CY + 2, zc + 3]], { on: 'terminal-block-1', face: 'top', inside: 'body', when: 'open', id: 'terminal-block-1-screw' }),
    line([[CX + 13, CY - 2, zc + 3], [CX + 13, CY + 2, zc + 3]], { on: 'terminal-block-2', face: 'top', inside: 'body', when: 'open', id: 'terminal-block-2-screw' }),
  ];
  const thermDetail = [
    disc([CX, CY, PLATE_TOP + 4], { on: 'thermostat', face: 'top', r: 2.6, material: 'dark', inside: 'body', when: 'open', id: 'thermostat-knob' }),
    line([[CX - 4, CY - 4, PLATE_TOP + 4], [CX + 4, CY - 4, PLATE_TOP + 4]], { on: 'thermostat', face: 'top', inside: 'body', when: 'open', id: 'thermostat-slot' }),
    line([[CX - 4, CY + 4, PLATE_TOP + 4], [CX + 4, CY + 4, PLATE_TOP + 4]], { on: 'thermostat', face: 'top', inside: 'body', when: 'open', id: 'thermostat-slot-2' }),
    line([[CX - 6, CY - 2, PLATE_TOP + 1.5], [CX - 12, CY - 2, PLATE_TOP + 4]], { tone: 'warm', inside: 'body', when: 'open', id: 'thermostat-lead' }),
    line([[CX + 6, CY + 2, PLATE_TOP + 1.5], [CX + 12, CY + 2, PLATE_TOP + 4]], { tone: 'warm', inside: 'body', when: 'open', id: 'thermostat-lead-2' }),
  ];
  const waterDetail = [
    topRing(water, 23, { inside: 'body', when: 'open', id: 'water-surface' }),
    topRing(water, 12, { inside: 'body', when: 'open', id: 'water-ripple' }),
    ring(water, WATER_TOP - 10, { inside: 'body', when: 'open', id: 'water-level-ring-a' }),
    ring(water, WATER_TOP - 22, { inside: 'body', when: 'open', id: 'water-level-ring-b' }),
    ring(water, WATER_TOP - 34, { inside: 'body', when: 'open', id: 'water-level-ring-c' }),
    ring(water, WATER_TOP - 46, { inside: 'body', when: 'open', id: 'water-level-ring-d' }),
    ring(water, WATER_TOP - 4, { inside: 'body', when: 'open', id: 'water-top-ring' }),
    ring(water, WATER_TOP - 52, { inside: 'body', when: 'open', id: 'water-level-ring-e' }),
    ring(water, WATER_TOP - 40, { inside: 'body', when: 'open', id: 'water-level-ring-f' }),
  ];

  // Lid: the steam vent in its top, drawn for each state at that state's height.
  const ventOpen = slots([[CX - 10, CY - 16, BODY_TOP + LID_LIFT + 3], [CX + 10, CY - 16, BODY_TOP + LID_LIFT + 3]], [[CX - 10, CY + 16, BODY_TOP + LID_LIFT + 3], [CX + 10, CY + 16, BODY_TOP + LID_LIFT + 3]], 5, { on: 'lid', face: 'top', when: 'open', id: 'lid-vent-open' });
  const ventShut = slots([[CX - 10, CY - 16, BODY_TOP + 3], [CX + 10, CY - 16, BODY_TOP + 3]], [[CX - 10, CY + 16, BODY_TOP + 3], [CX + 10, CY + 16, BODY_TOP + 3]], 5, { on: 'lid', face: 'top', when: 'closed', id: 'lid-vent-closed' });

  const scene = [
    // Feet, then the base: a ring step at its foot, two rings, vents, a rocker on the switch, the cable from its socket.
    ...feet,
    ...feetRings,
    cableGrip,
    cableGripDetail,
    cableSocket,
    base,
    ring(base, BASE_Z + 2, { id: 'base-foot-ring' }),
    ring(base, BASE_H - 3, { id: 'base-top-ring' }),
    ...[0, 1, 2, 3].map((i) => ring(base, BASE_Z + 6 + i * 2, { from: 120, to: 240, id: `base-vent-${i}` })),
    ring(base, BASE_Z + 0.8, { id: 'base-bottom-edge' }),
    ring(base, BASE_Z + 5, { from: -60, to: 60, id: 'base-chamfer' }),
    ring(base, BASE_H - 6, { id: 'base-step' }),
    ring(base, BASE_Z + 4, { from: 150, to: 210, id: 'base-vent-4' }),
    // Rating plate on the back of the base, with its two lines of print (seen after a turn).
    band(base, BASE_Z + 1.5, BASE_Z + 5, { from: 236, to: 264, material: 'white', id: 'rating-plate' }),
    ring(base, BASE_Z + 2.7, { from: 240, to: 260, id: 'rating-text-1' }),
    ring(base, BASE_Z + 3.9, { from: 240, to: 260, id: 'rating-text-2' }),
    // The on/off switch: a box fixed to the outside of the base, on its x side, with a rocker on its face.
    attach(base, 'x', { reach: 5, width: 12, z: BASE_Z + 1, height: 10, id: 'switch', material: 'dark' }),
    line([[65, CY - 4, BASE_Z + 6], [65, CY + 4, BASE_Z + 6]], { on: 'switch', face: 'x', bold: true, id: 'switch-rocker' }),
    line([[65, CY - 5, BASE_Z + 3], [65, CY + 5, BASE_Z + 3]], { on: 'switch', face: 'x', id: 'switch-lip' }),
    line([[65, CY - 5, BASE_Z + 9], [65, CY + 5, BASE_Z + 9]], { on: 'switch', face: 'x', id: 'switch-lip-top' }),
    line([[CX, 8, BASE_Z + 6], [CX, -14, BASE_Z + 6], [CX + 22, -26, 0]], { bold: true, id: 'power-cable' }),
    line([[CX + 1.5, 8, BASE_Z + 4.5], [CX + 1.5, -14, BASE_Z + 4.5], [CX + 23.5, -26, 0]], { id: 'power-cable-earth' }),

    // Back side of the body, then the body, then what is inside it.
    hinge,
    ...hingeDetail,
    ...spoutParts,
    ...spoutDetail,
    bodyOpen,
    bodyShut,
    plate,
    ...terminals,
    thermostat,
    ...plateDetail,
    ...thermDetail,
    water,
    ...waterDetail,

    // Wall detail on the body: seams, collar, rim, the level window with its end caps and marks, a badge.
    ring(bodyOpen, BASE_H + 2, { id: 'body-foot-seam' }),
    ring(bodyOpen, BASE_H + 4, { id: 'body-foot-seam-2' }),
    ring(bodyOpen, BASE_H + 8, { id: 'body-lower-seam' }),
    ring(bodyOpen, BASE_H + 30, { id: 'body-seam-a' }),
    ring(bodyOpen, BASE_H + 40, { id: 'body-mid-seam' }),
    ring(bodyOpen, BODY_TOP - 30, { id: 'body-seam-c' }),
    ring(bodyOpen, BODY_TOP - 10, { id: 'body-collar' }),
    ring(bodyOpen, BODY_TOP - 3, { id: 'body-rim-ring' }),
    ring(bodyOpen, BODY_TOP - 16, { from: 150, to: 300, id: 'body-back-seam' }),
    ring(bodyOpen, BASE_H + 20, { from: 150, to: 300, id: 'body-back-seam-low' }),
    ring(bodyOpen, BODY_TOP - 22, { from: 150, to: 300, id: 'body-back-seam-mid' }),
    band(bodyOpen, BASE_H + 60, BASE_H + 68, { from: 60, to: 120, material: 'white', id: 'body-badge' }),
    band(bodyOpen, BASE_H + 14, BASE_H + 74, { from: -26, to: -12, material: 'glass', id: 'level-window' }),
    ring(bodyOpen, BASE_H + 14, { from: -26, to: -12, id: 'level-window-cap-low' }),
    ring(bodyOpen, BASE_H + 74, { from: -26, to: -12, id: 'level-window-cap-high' }),
    ...[22, 30, 46, 54, 62, 70].map((z, i) => ring(bodyOpen, BASE_H + z, { from: -26, to: -12, id: `level-mark-${i}` })),
    ring(bodyOpen, BASE_H + 26, { from: 150, to: 300, id: 'body-back-seam-low-2' }),
    ring(bodyOpen, BASE_H + 34, { from: 150, to: 300, id: 'body-back-seam-low-3' }),
    ring(bodyOpen, BODY_TOP - 16, { from: -60, to: 0, id: 'body-back-seam-front' }),
    ring(bodyOpen, BODY_TOP - 22, { from: 150, to: 300, id: 'body-back-seam-mid-2' }),
    ring(bodyOpen, BODY_TOP - 6, { from: 150, to: 300, id: 'body-back-seam-top' }),
    topRing(bodyOpen, BODY_R - 1.2, { id: 'body-rim', z: BODY_TOP }),
    topRing(bodyOpen, BODY_R - 4, { id: 'body-rim-inner', z: BODY_TOP }),
    ring(bodyOpen, BODY_TOP - 1.5, { id: 'body-lid-seat' }),

    // Handle on the x side (after the body), then the lid lifted above the open top.
    ...handle(bodyOpen, 'x', { id: 'handle', z0: 36, z1: 82, reach: 16, thick: 3.2, width: 6 }),
    ...lid(bodyOpen, { id: 'lid', lift: LID_LIFT, openState: 'open', closedState: 'closed' }),
    ...ventOpen,
    ...ventShut,
  ];
  return { scene };
}

export function kettleStates() {
  return renderStates(shapes().scene, { labels: LABELS, requiredParts: REQUIRED_PARTS, title: FIG_TITLE, states: ['open', 'closed'] });
}

/** Page html. */
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
<figcaption>Hover or tap a part to see its name. Turn it to see every side, and close it to see it as it stands. <button type="button" id="play" aria-pressed="true">Pause motion</button></figcaption>
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
const lintResult = lintStates(states);
const cardLint = lintCards(CARDS, LABELS);
lintResult.errors.push(...cardLint.errors);
const report = { errors: lintResult.errors, warnings: lintResult.warnings };

const html = page(orbitHtml(states, { label: 'Electric kettle', stateLabels: { open: 'Open it', closed: 'Close it' } }));
const svg = states.open[0].svg + '\n';

writeFileSync(join(HERE, 'electric-kettle.html'), html);
writeFileSync(join(HERE, 'electric-kettle.svg'), svg);
writeFileSync(join(HERE, 'lint-report.json'), JSON.stringify(report, null, 2) + '\n');
console.log(`errors: ${report.errors.length}, warnings: ${report.warnings.length}`);
for (const e of report.errors) console.log(`ERROR ${e.rule}: ${e.message}`);
for (const w of report.warnings) console.log(`WARN ${w.rule}: ${w.message}`);
