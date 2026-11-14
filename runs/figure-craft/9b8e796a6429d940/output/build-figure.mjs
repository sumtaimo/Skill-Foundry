#!/usr/bin/env node
/**
 * figure-craft build: "How a refrigerator keeps food cold".
 * Writes refrigerator.html, refrigerator.svg and lint-report.json into the folder this script sits in.
 * Run: node build-figure.mjs   (same bytes every time).
 * The engine is read from FIGURE_CRAFT_ENGINE, or from the figure-craft skill folder by default.
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ENGINE = process.env.FIGURE_CRAFT_ENGINE ?? '/home/user/Skill-Foundry/src/skills/figure-craft/engine';
const load = (file) => import(pathToFileURL(join(ENGINE, file)).href);
const { box, line, panel, disc, glow, renderSvg } = await load('iso.mjs');
const { renderStates, orbitHtml } = await load('orbit.mjs');
const { lintStates } = await load('lint.mjs');
const { slots, screws, repeat } = await load('kit.mjs');
const { tokensCss } = await load('tokens.mjs');

const SLUG = 'refrigerator';
const TITLE = 'How a refrigerator keeps food cold';
const FIG_TITLE = 'A refrigerator with its doors open: cold air falls from the vent over the food on the shelves.';
const IDEA = 'A refrigerator keeps food cold by moving heat from inside the cabinet to the coil on its back.';

/** The parts the idea needs. Never shortened to make a check pass. */
const REQUIRED_PARTS = ['fridge', 'freezer', 'door', 'shelf-2', 'crisper', 'evaporator', 'cold-air', 'compressor', 'condenser'];

/** Label anchors sit inside the part they name (checked below against the engine's own target lookup). */
const LABELS = [
  { at: [69, 30, 60], text: 'Fresh-food cabinet', target: 'fridge' },
  { at: [69, 30, 150], text: 'Freezer', target: 'freezer' },
  { at: [1.5, 62, 60], text: 'Door and bins', target: 'door' },
  { at: [30, 25, 80.8], text: 'Glass shelf', target: 'shelf-2' },
  { at: [60, 40, 36], text: 'Crisper drawer', target: 'crisper' },
  { at: [35, 4, 142], text: 'Evaporator coil', target: 'evaporator' },
  { at: [36, 11, 112], text: 'Cold air', target: 'cold-air' },
  { at: [15, 15, 12], text: 'Compressor', target: 'compressor' },
  { at: [35, -1, 75], text: 'Condenser coil', target: 'condenser' },
];

/** What each labelled part does, for the cards under the figure. Plain facts only. */
const CARDS = [
  ['Fresh-food cabinet', 'The insulated box for everyday food. Its walls keep the room heat out and the cold in.'],
  ['Freezer', 'The coldest compartment, above the fresh-food cabinet. The evaporator coil sits at its back.'],
  ['Door and bins', 'The door closes on a rubber seal. Bins on its inner side hold bottles and small items.'],
  ['Glass shelf', 'Holds food and lets cold air pass round it.'],
  ['Crisper drawer', 'A closed drawer for vegetables, kept apart from the cold air that moves past the shelves.'],
  ['Evaporator coil', 'The cold coil in the freezer. The refrigerant takes heat out of the air here.'],
  ['Cold air', 'Chilled air falls from the vent and moves over the food. This is the one moving part of the story.'],
  ['Compressor', 'Pumps the refrigerant round the loop. It sits in the base at the back; turn the fridge to see it.'],
  ['Condenser coil', 'The coil on the back. The refrigerant gives up its heat to the room here.'],
];

/** A zigzag line across one face: `at(u, v)` maps the two face coordinates to a point. */
const zigzag = (u0, u1, v0, v1, turns, at) =>
  Array.from({ length: turns + 1 }, (_, i) => at(u0 + ((u1 - u0) * i) / turns, i % 2 ? v1 : v0));

/** The scene, farthest parts first. Units are schematic millimetres / 10; the cabinet is 70 x 60 x 156. */
function scene() {
  const FR = 'fridge';
  const FZ = 'freezer';
  // Shelf contents: they stand on a glass shelf and sit inside the cabinet.
  const onShelf = (id) => ({ inside: FR, rests: id });

  return [
    // Feet under the base
    ...[[3, 3], [61, 3], [3, 51], [61, 51]].map(([x, y], i) =>
      box({ at: [x, y, 0], size: [6, 6, 3], round: true, material: 'dark', id: `foot-${i}` })),

    // Back: the condenser grille on the rear wall (seen after a turn), its coil and screws
    box({ at: [6, -2, 30], size: [58, 2, 90], material: 'dark', id: 'condenser' }),
    ...slots([[6, -2, 34], [64, -2, 34]], [[6, -2, 116], [64, -2, 116]], 8, { on: 'condenser', face: '-y', id: 'condenser-rung' }),
    line(zigzag(10, 60, 36, 114, 9, (u, v) => [u, -2, v]), { on: 'condenser', face: '-y', tone: 'copper', id: 'condenser-tube' }),
    ...screws([[6, -2, 30], [64, -2, 120]], { on: 'condenser', face: '-y', id: 'condenser-screw' }),

    // Base: a dark plinth with a kick plate. Its back is open: the machine bay holds the compressor.
    box({ at: [0, 0, 3], size: [70, 60, 20], material: 'dark', id: 'base', open: ['-x', '-y'], wall: 2 }),
    ...slots([[10, 60, 7], [60, 60, 7]], [[10, 60, 19], [60, 60, 19]], 5, { on: 'base', face: 'y', id: 'kick-vent' }),
    ...slots([[70, 8, 7], [70, 52, 7]], [[70, 8, 19], [70, 52, 19]], 4, { on: 'base', face: 'x', id: 'side-vent' }),
    box({ at: [40, 6, 5], size: [24, 18, 4], material: 'white', inside: 'base', id: 'drain-pan' }),
    box({ at: [4, 4, 6], size: [22, 22, 14], round: true, material: 'dark', inside: 'base', id: 'compressor' }),
    disc([15, 15, 20], { on: 'compressor', face: 'top', r: 4, material: 'steel', id: 'compressor-cap' }),
    ...slots([[6, 26, 8], [22, 26, 8]], [[6, 26, 18], [22, 26, 18]], 5, { on: 'compressor', face: 'y', id: 'compressor-fin' }),

    // Fresh-food cabinet: open (a cutaway) with its doors swung out, or closed
    box({ at: [0, 0, 23], size: [70, 60, 108], material: 'steel', id: FR, rests: 'base', open: 'xy', wall: 3, when: 'open' }),
    box({ at: [0, 0, 23], size: [70, 60, 108], material: 'steel', id: FR, rests: 'base', when: 'closed' }),
    line([[70, 56, 23], [70, 56, 131]], { on: FR, face: 'x', id: 'fridge-side-seam', when: 'closed' }),
    panel([[0, 30, 40], [0, 46, 52]], { on: FR, face: '-x', material: 'white', id: 'rating-plate' }),
    ...screws([[0, 30, 40], [0, 46, 52]], { on: FR, face: '-x', inset: 1.5, r: 0.6, id: 'rating-screw' }),
    ...slots([[0, 33, 44], [0, 43, 44]], [[0, 33, 48], [0, 43, 48]], 3, { on: FR, face: '-x', id: 'rating-text' }),
    line([[0, 4, 23], [0, 4, 131]], { on: FR, face: '-x', id: 'fridge-seam' }),
    glow([35, 24, 126], { r: 16, inside: FR, id: 'lamp-glow' }),

    // Vent on the back wall with its temperature dial
    box({ at: [18, 3, 108], size: [34, 2, 14], material: 'white', inside: FR, id: 'vent' }),
    ...slots([[21, 5, 110], [41, 5, 110]], [[21, 5, 120], [41, 5, 120]], 5, { on: 'vent', face: 'y', id: 'vent-slot' }),
    disc([47, 5, 115], { on: 'vent', face: 'y', r: 2.5, material: 'steel', id: 'dial' }),
    line([[47, 5, 115], [47, 5, 119]], { on: 'vent', face: 'y', bold: true, id: 'dial-mark' }),
    // The moving part: cold air falls from the vent
    box({ at: [33, 8, 110], size: [6, 6, 6], material: 'blue', inside: FR, move: [0, 0, -34], id: 'cold-air' }),

    // Crisper drawer with vegetables; drawn after them so they show through the glass
    box({ at: [10, 16, 26], size: [14, 12, 10], material: 'green', inside: FR, id: 'lettuce' }),
    box({ at: [30, 18, 26], size: [8, 8, 8], round: true, material: 'red', inside: FR, id: 'tomato-1' }),
    box({ at: [42, 18, 26], size: [8, 8, 8], round: true, material: 'red', inside: FR, id: 'tomato-2' }),
    box({ at: [30, 32, 26], size: [22, 6, 6], round: 'x', material: 'amber', inside: FR, id: 'carrots' }),
    box({ at: [5, 8, 26], size: [60, 46, 22], material: 'glass', inside: FR, id: 'crisper' }),
    line([[20, 54, 40], [50, 54, 40]], { on: 'crisper', face: 'y', bold: true, id: 'crisper-handle' }),
    line([[7, 54, 28], [63, 54, 28]], { on: 'crisper', face: 'y', id: 'crisper-rail' }),
    line([[7, 12, 48], [63, 12, 48]], { on: 'crisper', face: 'top', id: 'crisper-lid' }),

    // Shelf 1 (top at z 59.5): milk, juice, pickles, leftovers, butter, a bowl of salad
    box({ at: [3, 3, 58], size: [64, 50, 1.5], material: 'glass', inside: FR, id: 'shelf-1' }),
    line([[4, 53, 59.5], [66, 53, 59.5]], { on: 'shelf-1', face: 'top', id: 'shelf-1-trim' }),
    box({ at: [8, 8, 59.5], size: [10, 10, 20], material: 'blue', ...onShelf('shelf-1'), id: 'milk' }),
    panel([[9, 18, 64], [17, 18, 72]], { on: 'milk', face: 'y', material: 'white', id: 'milk-label' }),
    box({ at: [24, 8, 59.5], size: [8, 8, 20], round: true, material: 'amber', ...onShelf('shelf-1'), id: 'juice' }),
    disc([28, 12, 79.5], { on: 'juice', face: 'top', r: 2, material: 'white', id: 'juice-cap' }),
    box({ at: [38, 10, 59.5], size: [10, 10, 12], round: true, material: 'green', ...onShelf('shelf-1'), id: 'pickles' }),
    disc([43, 15, 71.5], { on: 'pickles', face: 'top', r: 4, material: 'steel', id: 'pickles-lid' }),
    box({ at: [52, 8, 59.5], size: [12, 10, 8], material: 'red', ...onShelf('shelf-1'), id: 'leftovers' }),
    box({ at: [12, 30, 59.5], size: [12, 8, 5], material: 'amber', ...onShelf('shelf-1'), id: 'butter' }),
    box({ at: [32, 28, 59.5], size: [14, 14, 7], round: true, material: 'white', ...onShelf('shelf-1'), id: 'bowl' }),
    disc([39, 35, 66.5], { on: 'bowl', face: 'top', r: 5, material: 'green', id: 'salad' }),

    // Shelf 2 (top at z 81.5): bottles, eggs, a container, jam
    box({ at: [3, 3, 80], size: [64, 50, 1.5], material: 'glass', inside: FR, id: 'shelf-2' }),
    line([[4, 53, 81.5], [66, 53, 81.5]], { on: 'shelf-2', face: 'top', id: 'shelf-2-trim' }),
    line([[4, 4, 81.5], [66, 4, 81.5]], { on: 'shelf-2', face: 'top', id: 'shelf-2-back' }),
    ...repeat(3, (i) => [
      box({ at: [8 + i * 10, 8, 81.5], size: [6, 6, 20], round: true, material: 'green', ...onShelf('shelf-2'), id: `bottle-${i}` }),
      disc([11 + i * 10, 11, 101.5], { on: `bottle-${i}`, face: 'top', r: 1.5, material: 'steel', id: `bottle-cap-${i}` }),
    ]),
    box({ at: [44, 10, 81.5], size: [16, 12, 10], material: 'blue', ...onShelf('shelf-2'), id: 'container' }),
    line([[45, 22, 88], [59, 22, 88]], { on: 'container', face: 'y', id: 'container-lid' }),
    box({ at: [10, 30, 81.5], size: [20, 10, 6], material: 'amber', ...onShelf('shelf-2'), id: 'eggs' }),
    ...repeat(4, (i) => disc([13 + i * 4.6, 35, 87.5], { on: 'eggs', face: 'top', r: 1.7, material: 'white', id: `egg-${i}` })),
    box({ at: [44, 30, 81.5], size: [8, 8, 11], round: true, material: 'red', ...onShelf('shelf-2'), id: 'jam' }),
    disc([48, 34, 92.5], { on: 'jam', face: 'top', r: 3.2, material: 'steel', id: 'jam-lid' }),

    // Shelf 3 (top at z 103.5): water, cheese, yogurt
    box({ at: [3, 3, 102], size: [64, 50, 1.5], material: 'glass', inside: FR, id: 'shelf-3' }),
    line([[4, 53, 103.5], [66, 53, 103.5]], { on: 'shelf-3', face: 'top', id: 'shelf-3-trim' }),
    box({ at: [54, 10, 103.5], size: [8, 8, 18], round: true, material: 'blue', ...onShelf('shelf-3'), id: 'water' }),
    disc([58, 14, 121.5], { on: 'water', face: 'top', r: 1.8, material: 'white', id: 'water-cap' }),
    box({ at: [10, 30, 103.5], size: [12, 10, 6], material: 'amber', ...onShelf('shelf-3'), id: 'cheese' }),
    ...repeat(3, (i) => box({ at: [30 + i * 10, 32, 103.5], size: [6, 6, 7], round: true, material: 'white', ...onShelf('shelf-3'), id: `yogurt-${i}` })),

    // Freezer: open (a cutaway) or closed. The evaporator coil is on its back wall.
    box({ at: [0, 0, 131], size: [70, 60, 48], material: 'steel', id: FZ, rests: FR, open: 'xy', wall: 3, when: 'open' }),
    box({ at: [0, 0, 131], size: [70, 60, 48], material: 'steel', id: FZ, rests: FR, when: 'closed' }),
    line([[70, 56, 131], [70, 56, 179]], { on: FZ, face: 'x', id: 'freezer-side-seam', when: 'closed' }),
    line([[0, 4, 131], [0, 4, 179]], { on: FZ, face: '-x', id: 'freezer-seam' }),
    line([[4, 30, 179], [66, 30, 179]], { on: FZ, face: 'top', id: 'top-rib' }),
    line([[0, 4, 179], [70, 4, 179]], { on: FZ, face: 'top', id: 'top-seam' }),
    panel([[2, 52, 179], [12, 58, 179]], { on: FZ, face: 'top', material: 'dark', id: 'hinge-cover' }),
    box({ at: [6, 3, 134], size: [58, 2, 18], material: 'steel', inside: FZ, id: 'evaporator' }),
    line(zigzag(10, 60, 137, 149, 9, (u, v) => [u, 5, v]), { on: 'evaporator', face: 'y', tone: 'cold', id: 'evaporator-tube' }),
    ...slots([[8, 5, 136], [8, 5, 150]], [[62, 5, 136], [62, 5, 150]], 7, { on: 'evaporator', face: 'y', id: 'evaporator-fin' }),
    box({ at: [8, 44, 134], size: [18, 10, 4], material: 'white', inside: FZ, id: 'ice-tray' }),
    ...slots([[12, 45, 138], [12, 53, 138]], [[22, 45, 138], [22, 53, 138]], 3, { on: 'ice-tray', face: 'top', id: 'ice-cell' }),
    box({ at: [34, 40, 134], size: [22, 14, 7], material: 'blue', inside: FZ, id: 'frozen-box' }),
    panel([[38, 54, 137], [52, 54, 140]], { on: 'frozen-box', face: 'y', material: 'white', id: 'frozen-label' }),
    box({ at: [42, 20, 134], size: [10, 10, 8], round: true, material: 'amber', inside: FZ, id: 'ice-cream' }),
    disc([47, 25, 142], { on: 'ice-cream', face: 'top', r: 4, material: 'white', id: 'ice-cream-lid' }),

    // Doors swung open on their hinges (the liner, seal, bins and handle), or closed
    box({ at: [0, 60, 23], size: [3, 68, 108], material: 'steel', id: 'door', when: 'open' }),
    panel([[3, 64, 27], [3, 124, 127]], { on: 'door', face: 'x', material: 'white', id: 'door-liner', when: 'open' }),
    line([[3, 62, 25], [3, 126, 25], [3, 126, 129], [3, 62, 129], [3, 62, 25]], { on: 'door', face: 'x', bold: true, id: 'door-seal', when: 'open' }),
    line([[0, 120, 40], [0, 120, 92]], { on: 'door', face: '-x', bold: true, id: 'door-handle-out', when: 'open' }),
    ...repeat(3, (i) => [
      box({ at: [3, 68, 40 + i * 30], size: [7, 52, 4], material: 'white', id: `bin-${i}`, when: 'open' }),
      line([[10, 70, 42 + i * 30], [10, 118, 42 + i * 30]], { on: `bin-${i}`, face: 'x', id: `bin-rail-${i}`, when: 'open' }),
      ...repeat(3, (j) => box({
        at: [4, 74 + j * 14, 44 + i * 30], size: [6, 6, 14 + ((i + j) % 2) * 4], round: true,
        material: ['green', 'amber', 'blue'][(i + j) % 3], rests: `bin-${i}`, id: `bin-${i}-item-${j}`, when: 'open',
      })),
    ]),
    box({ at: [0, 60, 131], size: [3, 68, 48], material: 'steel', id: 'freezer-door', rests: 'door', when: 'open' }),
    panel([[3, 64, 135], [3, 124, 175]], { on: 'freezer-door', face: 'x', material: 'white', id: 'freezer-liner', when: 'open' }),
    line([[3, 62, 133], [3, 126, 133], [3, 126, 177], [3, 62, 177], [3, 62, 133]], { on: 'freezer-door', face: 'x', bold: true, id: 'freezer-seal', when: 'open' }),
    line([[0, 120, 140], [0, 120, 170]], { on: 'freezer-door', face: '-x', bold: true, id: 'freezer-handle-out', when: 'open' }),
    box({ at: [3, 70, 140], size: [7, 52, 4], material: 'white', id: 'freezer-bin', when: 'open' }),

    // The same doors closed
    box({ at: [0, 60, 23], size: [70, 3, 108], material: 'steel', id: 'door', when: 'closed' }),
    line([[8, 63, 48], [8, 63, 100]], { on: 'door', face: 'y', bold: true, id: 'door-handle', when: 'closed' }),
    panel([[40, 63, 100], [62, 63, 114]], { on: 'door', face: 'y', material: 'dark', id: 'display', when: 'closed' }),
    disc([46, 63, 107], { on: 'door', face: 'y', r: 2, material: 'steel', id: 'display-knob-1', when: 'closed' }),
    disc([56, 63, 107], { on: 'door', face: 'y', r: 2, material: 'steel', id: 'display-knob-2', when: 'closed' }),
    panel([[30, 63, 36], [40, 63, 40]], { on: 'door', face: 'y', material: 'white', id: 'badge', when: 'closed' }),
    box({ at: [0, 60, 131], size: [70, 3, 48], material: 'steel', id: 'freezer-door', rests: 'door', when: 'closed' }),
    line([[8, 63, 140], [8, 63, 170]], { on: 'freezer-door', face: 'y', bold: true, id: 'freezer-handle', when: 'closed' }),
  ];
}

const OPTS = { labels: LABELS, requiredParts: REQUIRED_PARTS, title: FIG_TITLE, states: ['open', 'closed'] };

/** The figure in both states, four views each. */
const states = renderStates(scene(), OPTS);

// Every label must show in at least one view of each state (a part hidden from the front shows when turned).
for (const name of Object.keys(states)) {
  for (const { text } of LABELS) {
    const seen = states[name].some((v) => v.model.labels.some((l) => l.text === text));
    if (!seen) throw new Error(`label "${text}" does not show in any view of state "${name}"`);
  }
}

const report = lintStates(states);
writeFileSync(join(HERE, 'lint-report.json'), JSON.stringify(report, null, 2) + '\n');

const frontOpen = states.open[0];
writeFileSync(join(HERE, `${SLUG}.svg`), frontOpen.svg + '\n');

/** The page: one reading column, tokens in one style, the orbit, one card per labelled part. */
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

const figure = orbitHtml(states, { label: 'Refrigerator', stateLabels: { open: 'Open it', closed: 'Close it' } });
writeFileSync(join(HERE, `${SLUG}.html`), page(figure));

const n = (xs) => xs.length;
console.log(`errors: ${n(report.errors)}  warnings: ${n(report.warnings)}`);
for (const e of report.errors) console.log(`  ERROR ${e.rule}: ${e.message}`);
for (const w of report.warnings) console.log(`  WARN  ${w.rule}: ${w.message}`);
console.log(`front view shapes: ${frontOpen.model.shapes.length}, labels shown: ${frontOpen.model.labels.length}`);
if (report.errors.length) process.exitCode = 1;
