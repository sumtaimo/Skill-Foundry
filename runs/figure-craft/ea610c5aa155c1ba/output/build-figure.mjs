/**
 * Builds the refrigerator figure (door open, food and drinks inside) from the figure-craft engine.
 * Writes refrigerator.svg (front view), refrigerator.html (orbit page) and lint-report.json.
 * Run from this folder: node build-figure.mjs   (exit code 1 when lint reports errors)
 * The engine is read from the figure-craft skill folder; nothing in the engine is copied here.
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { box, line, panel } from '../../../../src/skills/figure-craft/engine/iso.mjs';
import { tokensCss } from '../../../../src/skills/figure-craft/engine/tokens.mjs';
import { renderViews, orbitHtml } from '../../../../src/skills/figure-craft/engine/orbit.mjs';
import { lint, lintViews } from '../../../../src/skills/figure-craft/engine/lint.mjs';

const OUT = fileURLToPath(new URL('.', import.meta.url));
const SLUG = 'refrigerator';
const TITLE = 'How a refrigerator keeps food cold';
const FIG_TITLE = 'A refrigerator with its door open: cold air moves from the vent across the shelves.';

/*
 * Units are centimetres of a typical household refrigerator (60 wide, 65 deep, 180 tall, the
 * cabinet 170 tall on a 10 cm base). Parts marked "larger than life" are drawn bigger so they can
 * be labelled; the report says which.
 * Axes: x runs down-right, y runs down-left, z up. The front (door side) is the y face; the cabinet
 * opening is on that face and the door swings out to the left, hinged on the front-left edge.
 */
const shapes = [
  // Base: kick plate at the front, compressor under the back of the cabinet (both on the floor).
  box({ at: [1, 34, 0], size: [58, 28, 10], material: 'dark', r: 2, id: 'kick' }),
  line([[12, 62, 3], [48, 62, 3]], { on: 'kick', face: 'y', id: 'kick-slot-1' }),
  line([[12, 62, 6], [48, 62, 6]], { on: 'kick', face: 'y', id: 'kick-slot-2' }),
  box({ at: [10, 0, 0], size: [40, 22, 10], material: 'dark', r: 2, id: 'compressor' }),

  // Cabinet: steel shell, opened on the front (y) so the inside shows. Its wall is 4 thick.
  box({ at: [0, 0, 10], size: [60, 65, 170], material: 'steel', open: 'y', wall: 4, rests: 'kick', id: 'body' }),
  line([[3, 65, 14], [3, 65, 176]], { on: 'body', face: 'y', id: 'seal-left' }),
  line([[57, 65, 14], [57, 65, 176]], { on: 'body', face: 'y', id: 'seal-right' }),
  line([[3, 65, 177], [57, 65, 177]], { on: 'body', face: 'y', id: 'seal-top' }),
  panel([[0.5, 65, 26], [2.5, 65, 40]], { on: 'body', face: 'y', material: 'dark', id: 'hinge-upper' }),
  panel([[0.5, 65, 140], [2.5, 65, 154]], { on: 'body', face: 'y', material: 'dark', id: 'hinge-lower' }),
  line([[0, 65, 12], [60, 65, 12]], { on: 'body', face: 'y', id: 'front-trim' }),
  line([[60, 0, 176], [60, 65, 176]], { on: 'body', face: 'x', id: 'side-top-seam' }),
  line([[60, 0, 12], [60, 65, 12]], { on: 'body', face: 'x', id: 'side-base-seam' }),
  line([[60, 62, 12], [60, 62, 176]], { on: 'body', face: 'x', id: 'side-front-edge' }),
  line([[0, 50, 180], [60, 50, 180]], { on: 'body', face: 'top', id: 'top-seam' }),

  // Door, swung open 90 degrees on its hinge at the front-left edge. Its inside faces the viewer.
  box({ at: [-6, 65, 10], size: [6, 60, 170], material: 'steel', id: 'door' }),
  panel([[0, 69, 22], [0, 121, 170]], { on: 'door', face: 'x', material: 'white', id: 'door-liner' }),
  line([[0, 69, 50], [0, 121, 50]], { on: 'door', face: 'x', id: 'door-bin-1' }),
  line([[0, 69, 90], [0, 121, 90]], { on: 'door', face: 'x', id: 'door-bin-2' }),
  line([[0, 69, 130], [0, 121, 130]], { on: 'door', face: 'x', id: 'door-bin-3' }),
  panel([[0, 110, 150], [0, 120, 160]], { on: 'door', face: 'x', material: 'dark', id: 'door-display' }),
  line([[-3, 125, 118], [-3, 125, 156]], { on: 'door', face: 'y', bold: true, id: 'door-handle' }),

  // Cold air vent on the inside wall of the cabinet (the left wall, which the opening shows at this angle).
  box({ at: [4, 20, 60], size: [3, 30, 108], material: 'white', inside: 'body', id: 'vent' }),
  line([[7, 24, 72], [7, 46, 72]], { on: 'vent', face: 'x', id: 'vent-slat-1' }),
  line([[7, 24, 92], [7, 46, 92]], { on: 'vent', face: 'x', id: 'vent-slat-2' }),
  line([[7, 24, 112], [7, 46, 112]], { on: 'vent', face: 'x', id: 'vent-slat-3' }),
  line([[7, 24, 132], [7, 46, 132]], { on: 'vent', face: 'x', id: 'vent-slat-4' }),
  line([[7, 24, 152], [7, 46, 152]], { on: 'vent', face: 'x', id: 'vent-slat-5' }),

  // Crisper drawer at the bottom, open toward the front, with vegetables inside.
  box({ at: [4, 8, 14], size: [48, 54, 30], material: 'white', open: 'y', wall: 2, inside: 'body', id: 'drawer' }),
  line([[4, 62, 42], [52, 62, 42]], { on: 'drawer', face: 'y', id: 'drawer-rim' }),
  line([[22, 62, 43], [38, 62, 43]], { on: 'drawer', face: 'y', bold: true, id: 'drawer-handle' }),
  line([[52, 14, 24], [52, 56, 24]], { on: 'drawer', face: 'x', id: 'drawer-runner' }),
  box({ at: [12, 14, 16], size: [14, 14, 14], round: true, material: 'green', inside: 'drawer', id: 'lettuce-1' }),
  box({ at: [32, 30, 16], size: [14, 14, 14], round: true, material: 'green', inside: 'drawer', id: 'lettuce-2' }),

  // Glass shelves, from the bottom up.
  box({ at: [5, 6, 50], size: [50, 56, 2], material: 'glass', inside: 'body', id: 'shelf-low' }),
  box({ at: [5, 6, 85], size: [50, 56, 2], material: 'glass', inside: 'body', id: 'shelf-mid' }),
  box({ at: [5, 6, 120], size: [50, 56, 2], material: 'glass', inside: 'body', id: 'shelf-top' }),

  // Low shelf: meat tray and yogurt.
  box({ at: [8, 14, 52], size: [22, 14, 5], material: 'red', inside: 'body', rests: 'shelf-low', id: 'meat' }),
  box({ at: [40, 38, 52], size: [9, 9, 8], round: true, material: 'white', inside: 'body', rests: 'shelf-low', id: 'yogurt' }),

  // Middle shelf: milk, cheese, leftovers.
  box({ at: [10, 14, 87], size: [10, 10, 24], material: 'blue', inside: 'body', rests: 'shelf-mid', id: 'milk' }),
  line([[10, 24, 104], [20, 24, 104]], { on: 'milk', face: 'y', id: 'milk-seam' }),
  box({ at: [34, 12, 87], size: [12, 10, 8], material: 'amber', inside: 'body', rests: 'shelf-mid', id: 'cheese' }),
  box({ at: [30, 40, 87], size: [14, 12, 10], material: 'plain', inside: 'body', rests: 'shelf-mid', id: 'leftovers' }),

  // Top shelf: drinks, kept clear of the lane the cold air takes.
  box({ at: [28, 14, 122], size: [12, 12, 28], round: true, material: 'amber', inside: 'body', rests: 'shelf-top', id: 'juice' }),
  box({ at: [42, 40, 122], size: [12, 12, 24], round: true, material: 'red', inside: 'body', rests: 'shelf-top', id: 'cranberry' }),
  box({ at: [26, 38, 122], size: [10, 10, 22], round: true, material: 'blue', inside: 'body', rests: 'shelf-top', id: 'water' }),

  // The one moving part: a puff of cold air that rests on the top shelf and moves forward (+y).
  box({ at: [14, 10, 122], size: [8, 8, 8], material: 'ink', inside: 'body', rests: 'shelf-top', move: [0, 40, 0], id: 'coldair' }),

  // Back side (seen when the reader turns the fridge): condenser coils, rating plate, power cord, compressor fins.
  ...[24, 36, 48, 60, 72, 84, 96, 108, 120, 132, 144, 156, 168].map((z) =>
    line([[2, 0, z], [58, 0, z]], { on: 'body', face: '-y', id: `coil-${z}` })),
  panel([[20, 0, 96], [40, 0, 110]], { on: 'body', face: '-y', material: 'white', id: 'rating-plate' }),
  line([[48, 0, 96], [48, 0, 14]], { on: 'body', face: '-y', bold: true, id: 'power-cord' }),
  line([[16, 0, 3], [44, 0, 3]], { on: 'compressor', face: '-y', id: 'compressor-fin-1' }),
  line([[16, 0, 5], [44, 0, 5]], { on: 'compressor', face: '-y', id: 'compressor-fin-2' }),
  line([[16, 0, 7], [44, 0, 7]], { on: 'compressor', face: '-y', id: 'compressor-fin-3' }),
  // Left side and the outside of the door (seen after one turn).
  line([[0, 0, 176], [0, 65, 176]], { on: 'body', face: '-x', id: 'left-top-seam' }),
  line([[0, 0, 12], [0, 65, 12]], { on: 'body', face: '-x', id: 'left-base-seam' }),
  line([[-6, 110, 118], [-6, 110, 156]], { on: 'door', face: '-x', bold: true, id: 'door-handle-outer' }),
  line([[-6, 66, 176], [-6, 124, 176]], { on: 'door', face: '-x', id: 'door-top-edge' }),
  line([[-6, 66, 14], [-6, 124, 14]], { on: 'door', face: '-x', id: 'door-bottom-edge' }),
];

// Labels: each anchor sits inside the part it names (the smallest box that holds it becomes the target).
// The glass shelves are not labelled: a full-width shelf is only about 40% visible through the opening
// from this angle, so a label on it would fail lint L16. Their food and drinks are named in the cards.
const labels = [
  { at: [30, 30, 178], text: 'Insulated cabinet' },
  { at: [-3, 95, 100], text: 'Door, swung open' },
  { at: [5.5, 30, 100], text: 'Cold air vent' },
  { at: [18, 14, 126], text: 'Cold air (moves forward)' },
  { at: [30, 56, 36], text: 'Crisper drawer: vegetables' },
];
const requiredParts = ['body', 'door', 'vent', 'coldair', 'drawer'];

// Copy for the card under the figure, keyed by part id.
const PART_COPY = {
  body: ['Insulated cabinet', 'Holds the food in a closed, insulated box. The steel shell and the white liner keep the cold inside.'],
  door: ['Door, swung open', 'Seals the cabinet with a rubber gasket. The inside of the door has bins for small items.'],
  vent: ['Cold air vent', 'Cold air comes out of this vent on the inside wall of the cabinet.'],
  coldair: ['Cold air', 'The moving part. It flows forward from the vent, over the shelves and the food.'],
  drawer: ['Crisper drawer: vegetables', 'A drawer near the bottom for vegetables. Its handle is on the front rim.'],
};
// Parts the figure draws without a label, named under the figure so nothing depends on hover.
const UNLABELLED_COPY = [
  ['Glass shelves: food and drinks', 'Milk, cheese and leftovers, meat and yogurt, and bottles of juice, cranberry and water.'],
];

const views = renderViews(shapes, { labels, requiredParts, title: FIG_TITLE });
const front = lintViews(views);
const perView = views.map((v) => ({ view: v.view + 1, ...lint(v.model) }));
const report = { errors: front.errors, warnings: front.warnings, perView };

const figure = orbitHtml(views, { label: 'Refrigerator with its door open' });
const cards = [...requiredParts.map((id) => PART_COPY[id]), ...UNLABELLED_COPY].map(([name, text]) =>
  `<div><dt>${name}</dt><dd>${text}</dd></div>`).join('');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${TITLE}</title>
<script>try{var t=localStorage.getItem('fc-theme');if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t);}catch(e){}</script>
<style>
${tokensCss()}*{box-sizing:border-box}
html,body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.5 system-ui,sans-serif}
main{max-width:720px;margin:0 auto;padding:24px 16px 48px}
header{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
h1{font-size:1.5rem;line-height:1.25;margin:0}
.kicker{color:var(--muted);font-size:.85rem;margin:0 0 4px;letter-spacing:.04em}
button{font:inherit;font-size:.9rem;color:var(--fg);background:var(--surface);border:1px solid var(--line-strong);border-radius:8px;padding:6px 12px;cursor:pointer}
button:focus-visible{outline:2px solid var(--ok);outline-offset:2px}
figure{margin:24px 0;padding:16px;background:var(--surface);border:1px solid var(--line);border-radius:12px}
figcaption{color:var(--muted);font-size:.9rem;margin-top:8px}
.hint{color:var(--muted);font-size:.85rem;margin:4px 0 0}
.controls{display:flex;gap:8px;margin-top:12px}
.paused .fc-orbit *{animation-play-state:paused!important}
dl{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin:0}
dl div{background:var(--surface2);border-radius:10px;padding:12px}
dt{font-weight:600}
dd{margin:4px 0 0;color:var(--muted);font-size:.92rem}
@media (max-width:480px){figure{padding:8px}}
</style>
</head>
<body>
<main>
<header>
<div><p class="kicker">FIGURE</p><h1>${TITLE}</h1></div>
<button type="button" id="theme" aria-pressed="false">Dark theme</button>
</header>
<p>Cold air from the vent moves across the shelves, so the food stays cold.</p>
<figure id="fig">
${figure}
<figcaption>Cold air comes out of the vent on the inside wall and moves forward over the food. Turn the refrigerator to see the coils at the back, which pump the heat out of the cabinet.</figcaption>
<p class="hint">Hover or tap a part to see its name. Turn it to see every side.</p>
<div class="controls"><button type="button" id="play" aria-pressed="true">Pause motion</button></div>
</figure>
<dl>${cards}</dl>
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

writeFileSync(OUT + SLUG + '.svg', views[0].svg);
writeFileSync(OUT + SLUG + '.html', html);
writeFileSync(OUT + 'lint-report.json', JSON.stringify(report, null, 2) + '\n');

const count = (list) => list.length;
console.log(`front view: ${count(front.errors)} errors, ${count(front.warnings)} warnings`);
for (const v of perView) console.log(`view ${v.view}: ${count(v.errors)} errors, ${count(v.warnings)} warnings`);
for (const e of front.errors) console.log(`ERROR ${e.rule}: ${e.message}`);
for (const w of front.warnings) console.log(`WARN ${w.rule}: ${w.message}`);
for (const v of perView.slice(1)) for (const w of v.warnings) console.log(`WARN (view ${v.view}) ${w.rule}: ${w.message}`);
if (front.errors.length) process.exitCode = 1;
