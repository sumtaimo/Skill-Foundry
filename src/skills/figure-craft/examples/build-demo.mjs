/**
 * figure-craft reference figure: one refrigerator, drawn whole, that the reader can open, turn and hover.
 * This is the detail level every figure aims for. Run directly to write examples/demo.html,
 * preview/example.html and preview/cover.svg. Node 24 ESM, stdlib only, zero deps.
 * @governed-by PO_ARCHITECT
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { box, line, panel, disc, glow, renderSvg } from '../engine/iso.mjs';
import { renderStates, orbitHtml } from '../engine/orbit.mjs';
import { lintStates } from '../engine/lint.mjs';
import { slots, screws, repeat } from '../engine/kit.mjs';
import { tokensCss } from '../engine/tokens.mjs';

const TITLE = 'How a refrigerator keeps food cold';
const FIG_TITLE = 'A refrigerator with its doors open: cold air falls from the vent over the food on the shelves.';
const IDEA = 'A refrigerator keeps food cold by moving heat from inside the cabinet to the coil on its back.';

/** The parts the idea needs. Never shortened to make a check pass. */
export const REQUIRED_PARTS = ['fridge', 'freezer', 'door', 'shelf-2', 'crisper', 'evaporator', 'cold-air', 'compressor', 'condenser'];

/** Label anchors sit inside the part they name. */
export const LABELS = [
  { at: [69, 30, 74], text: 'Fresh-food cabinet' },
  { at: [69, 30, 154], text: 'Freezer' },
  { at: [1.5, 100, 74], text: 'Door and bins' },
  { at: [62, 48, 83], text: 'Glass shelf' },
  { at: [62, 52, 48], text: 'Crisper drawer' },
  { at: [35, 4, 147], text: 'Evaporator coil' },
  { at: [36, 11, 117], text: 'Cold air' },
  { at: [18, 14, 13], text: 'Compressor' },
  { at: [35, -1, 114], text: 'Condenser coil' },
];

/** What each part does, for the cards under the figure. */
const CARDS = [
  ['Compressor', 'Squeezes the refrigerant gas and pushes it round the loop. It sits in the machine bay at the bottom; turn the fridge to see it.'],
  ['Condenser coil', 'The warm coil on the back. The refrigerant gives its heat to the room here.'],
  ['Evaporator coil', 'The cold coil in the freezer. The refrigerant takes heat out of the air here.'],
  ['Cold air', 'Chilled air falls from the vent and passes over the food.'],
  ['Freezer', 'The coldest space, next to the evaporator.'],
  ['Fresh-food cabinet', 'Insulated walls keep the cold in and the room heat out.'],
  ['Glass shelf', 'Lets cold air pass round the food and shows what is behind.'],
  ['Crisper drawer', 'A closed drawer that keeps vegetables from drying out.'],
  ['Door and bins', 'A rubber seal closes the gap; bins hold bottles and small things.'],
];

/** A zigzag coil across a face, as one line. */
function coil(a, b, turns, fixed) {
  const pts = [];
  for (let i = 0; i <= turns; i++) {
    const u = a[0] + ((b[0] - a[0]) * i) / turns;
    pts.push(fixed(u, i % 2 ? b[1] : a[1]), fixed(u + (i < turns ? 0 : 0), i % 2 ? a[1] : b[1]));
  }
  return pts;
}

function shapes() {
  const FR = 'fridge'; const FZ = 'freezer';
  const on = (id, n) => ({ inside: FR, rests: id, id: n });
  const scene = [
    // Feet
    ...[[4, 4], [60, 4], [4, 50], [60, 50]].map(([x, y], i) => box({ at: [x, y, 0], size: [6, 6, 3], round: true, material: 'dark', id: `foot-${i}` })),

    // Back: condenser rack, compressor, pipes, cable (seen after a turn)
    box({ at: [6, -2, 40], size: [58, 2, 110], material: 'dark', id: 'condenser' }),
    line(coil([10, 46], [60, 144], 10, (u, v) => [u, -2, v]), { on: 'condenser', face: '-y', tone: 'copper', id: 'condenser-tube' }),
    ...slots([[8, -2, 60], [62, -2, 60]], [[8, -2, 130], [62, -2, 130]], 8, { on: 'condenser', face: '-y', id: 'condenser-wire' }),
    ...screws([[6, -2, 40], [64, -2, 150]], { on: 'condenser', face: '-y', id: 'condenser-screw' }),

    // Base: the kick plate in front, the machine bay behind it (open at the back, seen after a turn)
    line([[26, 14, 21], [26, -3, 21], [26, -3, 60]], { tone: 'copper', id: 'discharge-pipe' }),
    line([[14, 14, 21], [14, -5, 21], [14, -5, 46], [50, -3, 46], [50, -3, 60]], { tone: 'cold', id: 'suction-pipe' }),
    line([[34, 0, 6], [48, -8, 0], [62, -8, 0]], { bold: true, id: 'power-cable' }),
    box({ at: [0, 0, 3], size: [70, 60, 22], material: 'dark', id: 'base', open: ['-x', '-y'], wall: 2 }),
    ...slots([[10, 60, 8], [60, 60, 8]], [[10, 60, 20], [60, 60, 20]], 5, { on: 'base', face: 'y', id: 'kick-vent' }),
    ...slots([[70, 8, 8], [70, 52, 8]], [[70, 8, 20], [70, 52, 20]], 5, { on: 'base', face: 'x', id: 'side-vent' }),
    box({ at: [40, 6, 5], size: [24, 18, 4], material: 'white', inside: 'base', id: 'drain-pan' }),
    line([[42, 24, 9], [62, 24, 9]], { on: 'drain-pan', face: 'y', id: 'drain-pan-rim' }),
    box({ at: [8, 4, 5], size: [20, 20, 16], round: true, material: 'dark', inside: 'base', id: 'compressor' }),
    disc([18, 14, 21], { on: 'compressor', face: 'top', r: 5, material: 'steel', id: 'compressor-cap' }),
    disc([18, 14, 21], { on: 'compressor', face: 'top', r: 1.6, material: 'dark', id: 'compressor-terminal' }),
    line([[11, 14, 21], [25, 14, 21]], { on: 'compressor', face: 'top', id: 'compressor-weld' }),

    // Fresh-food cabinet, open at the front
    box({ at: [0, 0, 11], size: [70, 60, 108], material: 'steel', id: FR, rests: 'base', open: 'xy', wall: 3, when: 'open' }),
    box({ at: [0, 0, 11], size: [70, 60, 108], material: 'steel', id: FR, rests: 'base', when: 'closed' }),
    line([[70, 56, 11], [70, 56, 119]], { on: FR, face: 'x', id: 'fridge-side-seam', when: 'closed' }),
    panel([[0, 30, 20], [0, 46, 30]], { on: FR, face: '-x', material: 'white', id: 'rating-plate' }),
    ...screws([[0, 30, 20], [0, 46, 30]], { on: FR, face: '-x', inset: 1.5, r: 0.6, id: 'rating-screw' }),
    ...slots([[0, 32, 23], [0, 44, 23]], [[0, 32, 27], [0, 44, 27]], 3, { on: FR, face: '-x', id: 'rating-text' }),
    line([[0, 4, 11], [0, 4, 119]], { on: FR, face: '-x', id: 'fridge-seam' }),
    ...slots([[10, 0, 16], [60, 0, 16]], [[10, 0, 34], [60, 0, 34]], 5, { on: FR, face: '-y', id: 'back-vent' }),
    glow([35, 24, 108], { r: 20, inside: FR, id: 'lamp-glow' }),

    // Cold-air vent on the back wall, with the temperature dial
    box({ at: [18, 3, 98], size: [34, 2, 14], material: 'white', inside: FR, id: 'vent' }),
    ...slots([[21, 5, 101], [41, 5, 101]], [[21, 5, 109], [41, 5, 109]], 5, { on: 'vent', face: 'y', id: 'vent-slot' }),
    disc([47, 5, 105], { on: 'vent', face: 'y', r: 3, material: 'steel', id: 'dial' }),
    line([[47, 5, 105], [47, 5, 107.5]], { on: 'vent', face: 'y', bold: true, id: 'dial-mark' }),
    box({ at: [33, 8, 100], size: [6, 6, 6], material: 'blue', inside: FR, move: [0, 0, -34], anim: 'fall', id: 'cold-air' }),

    // Crisper drawer with vegetables
    box({ at: [10, 16, 15], size: [14, 12, 10], material: 'green', inside: FR, id: 'lettuce' }),
    box({ at: [30, 18, 15], size: [8, 8, 8], round: true, material: 'red', inside: FR, id: 'tomato-1' }),
    box({ at: [42, 18, 15], size: [8, 8, 8], round: true, material: 'red', inside: FR, id: 'tomato-2' }),
    box({ at: [30, 32, 15], size: [22, 6, 6], round: 'x', material: 'amber', inside: FR, id: 'carrots' }),
    box({ at: [5, 10, 14], size: [60, 44, 22], material: 'glass', inside: FR, id: 'crisper' }),
    line([[20, 54, 30], [50, 54, 30]], { on: 'crisper', face: 'y', bold: true, id: 'crisper-handle' }),
    line([[7, 54, 16], [63, 54, 16]], { on: 'crisper', face: 'y', id: 'crisper-rail' }),
    line([[7, 12, 36], [63, 12, 36]], { on: 'crisper', face: 'top', id: 'crisper-lid' }),

    // Shelf 1
    box({ at: [3, 3, 44], size: [64, 50, 1.5], material: 'glass', inside: FR, id: 'shelf-1' }),
    line([[4, 53, 45.5], [66, 53, 45.5]], { on: 'shelf-1', face: 'top', id: 'shelf-1-trim' }),
    box({ at: [8, 8, 45.5], size: [10, 10, 20], material: 'blue', ...on('shelf-1', 'milk') }),
    panel([[9, 18, 52], [17, 18, 60]], { on: 'milk', face: 'y', material: 'white', id: 'milk-label' }),
    box({ at: [24, 8, 45.5], size: [8, 8, 22], round: true, material: 'amber', ...on('shelf-1', 'juice') }),
    disc([28, 12, 67.5], { on: 'juice', face: 'top', r: 2, material: 'white', id: 'juice-cap' }),
    box({ at: [38, 10, 45.5], size: [10, 10, 12], round: true, material: 'green', ...on('shelf-1', 'pickles') }),
    disc([43, 15, 57.5], { on: 'pickles', face: 'top', r: 4, material: 'steel', id: 'pickles-lid' }),
    box({ at: [52, 8, 45.5], size: [12, 10, 8], material: 'red', ...on('shelf-1', 'leftovers') }),
    box({ at: [12, 30, 45.5], size: [12, 8, 5], material: 'amber', ...on('shelf-1', 'butter') }),
    box({ at: [32, 28, 45.5], size: [14, 14, 7], round: true, material: 'white', ...on('shelf-1', 'bowl') }),
    disc([39, 35, 52.5], { on: 'bowl', face: 'top', r: 5, material: 'green', id: 'salad' }),

    // Shelf 2
    box({ at: [3, 3, 68], size: [64, 50, 1.5], material: 'glass', inside: FR, id: 'shelf-2' }),
    line([[4, 53, 69.5], [66, 53, 69.5]], { on: 'shelf-2', face: 'top', id: 'shelf-2-trim' }),
    line([[4, 4, 69.5], [66, 4, 69.5]], { on: 'shelf-2', face: 'top', id: 'shelf-2-back' }),
    ...repeat(3, (i) => [
      box({ at: [8 + i * 10, 8, 69.5], size: [6, 6, 20], round: true, material: 'green', ...on('shelf-2', `bottle-${i}`) }),
      disc([11 + i * 10, 11, 89.5], { on: `bottle-${i}`, face: 'top', r: 1.5, material: 'steel', id: `bottle-cap-${i}` }),
    ]),
    box({ at: [44, 10, 69.5], size: [16, 12, 10], material: 'blue', ...on('shelf-2', 'container') }),
    line([[45, 22, 77.5], [59, 22, 77.5]], { on: 'container', face: 'y', id: 'container-lid' }),
    box({ at: [10, 30, 69.5], size: [20, 10, 6], material: 'amber', ...on('shelf-2', 'eggs') }),
    ...repeat(4, (i) => disc([13 + i * 4.6, 35, 75.5], { on: 'eggs', face: 'top', r: 1.7, material: 'white', id: `egg-${i}` })),
    box({ at: [44, 30, 69.5], size: [8, 8, 11], round: true, material: 'red', ...on('shelf-2', 'jam') }),
    disc([48, 34, 80.5], { on: 'jam', face: 'top', r: 3.2, material: 'steel', id: 'jam-lid' }),

    // Shelf 3
    box({ at: [3, 3, 92], size: [64, 50, 1.5], material: 'glass', inside: FR, id: 'shelf-3' }),
    line([[4, 53, 93.5], [66, 53, 93.5]], { on: 'shelf-3', face: 'top', id: 'shelf-3-trim' }),
    box({ at: [54, 10, 93.5], size: [8, 8, 18], round: true, material: 'blue', ...on('shelf-3', 'water') }),
    disc([58, 14, 111.5], { on: 'water', face: 'top', r: 1.8, material: 'white', id: 'water-cap' }),
    box({ at: [10, 30, 93.5], size: [12, 10, 6], material: 'amber', ...on('shelf-3', 'cheese') }),
    ...repeat(3, (i) => box({ at: [30 + i * 10, 32, 93.5], size: [6, 6, 7], round: true, material: 'white', ...on('shelf-3', `yogurt-${i}`) })),

    // Freezer, open at the front
    box({ at: [0, 0, 119], size: [70, 60, 48], material: 'steel', id: FZ, rests: FR, open: 'xy', wall: 3, when: 'open' }),
    box({ at: [0, 0, 119], size: [70, 60, 48], material: 'steel', id: FZ, rests: FR, when: 'closed' }),
    line([[70, 56, 119], [70, 56, 167]], { on: FZ, face: 'x', id: 'freezer-side-seam', when: 'closed' }),
    line([[0, 4, 119], [0, 4, 167]], { on: FZ, face: '-x', id: 'freezer-seam' }),
    line([[4, 30, 167], [66, 30, 167]], { on: FZ, face: 'top', id: 'top-rib' }),
    panel([[2, 52, 167], [12, 60, 167]], { on: FZ, face: 'top', material: 'dark', id: 'hinge-cover' }),
    line([[0, 4, 167], [70, 4, 167]], { on: FZ, face: 'top', id: 'top-seam' }),
    box({ at: [6, 3, 123], size: [58, 2, 20], material: 'steel', inside: FZ, id: 'evaporator' }),
    line(coil([10, 126], [60, 140], 8, (u, v) => [u, 5, v]), { on: 'evaporator', face: 'y', tone: 'cold', id: 'evaporator-tube' }),
    ...slots([[8, 5, 124], [8, 5, 142]], [[62, 5, 124], [62, 5, 142]], 7, { on: 'evaporator', face: 'y', id: 'evaporator-fin' }),
    box({ at: [8, 30, 122], size: [18, 10, 4], material: 'white', inside: FZ, id: 'ice-tray' }),
    ...slots([[11, 31, 126], [11, 39, 126]], [[23, 31, 126], [23, 39, 126]], 4, { on: 'ice-tray', face: 'top', id: 'ice-cell' }),
    box({ at: [34, 34, 122], size: [22, 14, 7], material: 'blue', inside: FZ, id: 'frozen-box' }),
    panel([[36, 48, 123.5], [54, 48, 127.5]], { on: 'frozen-box', face: 'y', material: 'white', id: 'frozen-label' }),
    box({ at: [12, 46, 122], size: [10, 10, 8], round: true, material: 'amber', inside: FZ, id: 'ice-cream' }),
    disc([17, 51, 130], { on: 'ice-cream', face: 'top', r: 4, material: 'white', id: 'ice-cream-lid' }),

    // Doors swung open on their hinges, showing the liner, the seal and the bins
    box({ at: [0, 60, 11], size: [3, 68, 108], material: 'steel', id: 'door', when: 'open' }),
    panel([[3, 64, 15], [3, 124, 115]], { on: 'door', face: 'x', material: 'white', id: 'door-liner', when: 'open' }),
    line([[3, 62, 13], [3, 126, 13], [3, 126, 117], [3, 62, 117], [3, 62, 13]], { on: 'door', face: 'x', bold: true, id: 'door-seal', when: 'open' }),
    line([[0, 120, 40], [0, 120, 92]], { on: 'door', face: '-x', bold: true, id: 'door-handle-out', when: 'open' }),
    ...repeat(3, (i) => [
      box({ at: [3, 70, 26 + i * 30], size: [8, 50, 6], material: 'white', id: `bin-${i}`, when: 'open' }),
      line([[11, 72, 30 + i * 30], [11, 118, 30 + i * 30]], { on: `bin-${i}`, face: 'x', id: `bin-rail-${i}`, when: 'open' }),
      ...repeat(3, (j) => box({ at: [4, 74 + j * 14, 32 + i * 30], size: [6, 6, 14 + ((i + j) % 2) * 4], round: true, material: ['green', 'amber', 'blue'][(i + j) % 3], rests: `bin-${i}`, id: `bin-${i}-item-${j}`, when: 'open' })),
    ]),
    box({ at: [0, 60, 119], size: [3, 68, 48], material: 'steel', id: 'freezer-door', rests: 'door', when: 'open' }),
    panel([[3, 64, 123], [3, 124, 163]], { on: 'freezer-door', face: 'x', material: 'white', id: 'freezer-liner', when: 'open' }),
    line([[3, 62, 121], [3, 126, 121], [3, 126, 165], [3, 62, 165], [3, 62, 121]], { on: 'freezer-door', face: 'x', bold: true, id: 'freezer-seal', when: 'open' }),
    box({ at: [3, 70, 130], size: [8, 50, 6], material: 'white', id: 'freezer-bin', when: 'open' }),

    // The same doors closed
    box({ at: [0, 60, 11], size: [70, 3, 108], material: 'steel', id: 'door', when: 'closed' }),
    line([[8, 63, 48], [8, 63, 100]], { on: 'door', face: 'y', bold: true, id: 'door-handle', when: 'closed' }),
    panel([[40, 63, 96], [62, 63, 110]], { on: 'door', face: 'y', material: 'dark', id: 'display', when: 'closed' }),
    disc([46, 63, 103], { on: 'door', face: 'y', r: 2, material: 'steel', id: 'display-knob-1', when: 'closed' }),
    disc([56, 63, 103], { on: 'door', face: 'y', r: 2, material: 'steel', id: 'display-knob-2', when: 'closed' }),
    panel([[30, 63, 20], [40, 63, 24]], { on: 'door', face: 'y', material: 'white', id: 'badge', when: 'closed' }),
    box({ at: [0, 60, 119], size: [70, 3, 48], material: 'steel', id: 'freezer-door', rests: 'door', when: 'closed' }),
    line([[8, 63, 126], [8, 63, 150]], { on: 'freezer-door', face: 'y', bold: true, id: 'freezer-handle', when: 'closed' }),
  ];
  // The scene above is laid out with the cabinet starting at z = 11; the machine bay makes the base taller,
  // so everything above the base moves up by LIFT.
  return scene.map((sh) => (GROUND.test(sh.id ?? '') || GROUND.test(sh.on ?? '') || GROUND.test(sh.inside ?? '') ? sh : raise(sh)));
}

const LIFT = 14;
const GROUND = /^(foot|base|kick-vent|side-vent|drain-pan|compressor|discharge-pipe|suction-pipe|power-cable)/;
const up = (p) => [p[0], p[1], p[2] + LIFT];
function raise(sh) {
  const t = { ...sh };
  if (t.at) t.at = up(t.at);
  if (t.points) t.points = t.points.map(up);
  return t;
}

const OPTS = { labels: LABELS, requiredParts: REQUIRED_PARTS, title: FIG_TITLE, states: ['open', 'closed'] };

/** Both states, four views each: what the page shows and what lint checks. */
export function demoStates() {
  return renderStates(shapes(), OPTS);
}

/** The front view with the doors open: `{ svg, model }`. */
export function demoRender() {
  return demoStates().open[0];
}

/** Lint result for every state and view of the reference figure. */
export function demoLint() {
  return lintStates(demoStates());
}

/** Demo page html. @param {string} figure orbit markup */
function page(figure) {
  if (typeof figure !== 'string' || !figure.startsWith('<div class="fc-orbit"')) throw new TypeError('page: orbit markup required');
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
dl{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:1px;margin:0;background:var(--line);border:1px solid var(--line);border-radius:14px;overflow:hidden}
dl div{background:var(--surface);padding:12px 14px}
dt{font-weight:600;font-size:.9rem}
dd{margin:2px 0 0;color:var(--muted);font-size:.9rem}
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
<dl>
${CARDS.map(([name, what]) => `<div><dt>${name}</dt><dd>${what}</dd></div>`).join('\n')}
</dl>
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

/**
 * Build the demo page and the preview cover from the engine.
 * @returns {{demoHtml:string, coverSvg:string}}
 */
export function buildDemo() {
  const states = demoStates();
  // The cover is the refrigerator as it stands, doors closed, in flat site tokens.
  const outside = shapes().filter((s) => s.when !== 'open' && s.inside === undefined && s.kind !== 'glow' && !(s.on && /^(vent|milk|juice|pickles|bowl|bottle|container|eggs|jam|water|ice|frozen|shelf|crisper|evaporator)/.test(s.on)));
  const cover = renderSvg(outside, { padding: 16, idPrefix: 'cv', flat: true, labelMode: 'always' });
  const coverSvg = cover.svg.replace('role="img">', 'role="img" aria-label="figure-craft cover: a refrigerator">') + '\n';
  return { demoHtml: page(orbitHtml(states, { label: 'Refrigerator', stateLabels: { open: 'Open it', closed: 'Close it' } })), coverSvg };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { demoHtml, coverSvg } = buildDemo();
  const at = (p) => fileURLToPath(new URL(p, import.meta.url));
  writeFileSync(at('./demo.html'), demoHtml);
  writeFileSync(at('../preview/example.html'), demoHtml);
  writeFileSync(at('../preview/cover.svg'), coverSvg);
}
