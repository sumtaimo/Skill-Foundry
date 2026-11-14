/**
 * Refrigerator cooling figure: builds refrigerator-cooling.svg and refrigerator-cooling.html from the
 * figure-craft engine, and writes lint-report.json. Running it again gives the same bytes.
 * Run from this folder: node build-figure.mjs
 * Node 22+ ESM, stdlib only. The engine is read from the figure-craft skill folder.
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { box, line, panel, renderSvg } from '../../../../src/skills/figure-craft/engine/iso.mjs';
import { lint } from '../../../../src/skills/figure-craft/engine/lint.mjs';
import { tokensCss } from '../../../../src/skills/figure-craft/engine/tokens.mjs';

const SLUG = 'refrigerator-cooling';
const TITLE = 'How a refrigerator keeps food cold';
const FIG_TITLE = 'A refrigerator keeps food cold by moving heat out of the cabinet with a sealed refrigerant loop.';
/** Label font size in viewBox units. Chosen so labels render at 11 CSS px or more on a 390px wide screen. */
export const FONT_SIZE = 12;

/**
 * The figure's shapes. Units are approximate centimetres (the real cabinet is about 60 x 60 x 150).
 * Order: each support before what rests on it, farther shapes before nearer ones, face details right after their box.
 * @param {boolean} animated include the heat marker's motion
 */
export function shapes(animated) {
  if (typeof animated !== 'boolean') throw new TypeError('shapes: animated must be boolean');
  const heat = box({ at: [62, 0, 0], size: [8, 8, 6], material: 'ink', id: 'heat' });
  if (animated) Object.assign(heat, { move: [60, 0, 0], delay: 0 });
  return [
    // Base kick plate with its grille slats (dark plastic, at the front of the cabinet).
    box({ at: [0, 0, 0], size: [60, 60, 8], material: 'dark', id: 'plinth' }),
    line([[6, 60, 2.5], [54, 60, 2.5]], { on: 'plinth', face: 'y', id: 'grille-slat-1' }),
    line([[6, 60, 5.5], [54, 60, 5.5]], { on: 'plinth', face: 'y', id: 'grille-slat-2' }),

    // The cabinet: steel body, freezer door above, fresh-food door below.
    box({ at: [0, 0, 8], size: [60, 60, 142], material: 'steel', id: 'cabinet', rests: 'plinth' }),
    line([[0, 60, 101], [60, 60, 101]], { on: 'cabinet', face: 'y', id: 'door-seam' }),
    line([[3, 60, 104], [57, 60, 104], [57, 60, 146], [3, 60, 146], [3, 60, 104]], { on: 'cabinet', face: 'y', id: 'gasket-upper' }),
    line([[3, 60, 13], [57, 60, 13], [57, 60, 97], [3, 60, 97], [3, 60, 13]], { on: 'cabinet', face: 'y', id: 'gasket-lower' }),
    line([[52, 60, 116], [52, 60, 134]], { on: 'cabinet', face: 'y', bold: true, id: 'handle-upper' }),
    line([[52, 60, 62], [52, 60, 84]], { on: 'cabinet', face: 'y', bold: true, id: 'handle-lower' }),
    panel([[5, 60, 122], [19, 60, 140]], { on: 'cabinet', face: 'y', material: 'dark', id: 'control-panel' }),
    line([[60, 55, 16], [60, 55, 30]], { on: 'cabinet', face: 'x', id: 'hinge-lower' }),
    line([[60, 55, 108], [60, 55, 122]], { on: 'cabinet', face: 'x', id: 'hinge-upper' }),

    // The moving marker: a diagram device showing the direction heat travels, not a part.
    heat,

    // Evaporator: the cold coil (inside the cabinet in a real fridge; drawn beside it here so it can be seen).
    box({ at: [74, 8, 0], size: [40, 32, 56], material: 'steel', id: 'evaporator' }),
    line([[114, 10, 4], [114, 16, 52], [114, 22, 4], [114, 28, 52], [114, 34, 4]], { on: 'evaporator', face: 'x', id: 'evap-coil' }),
    line([[74, 40, 2], [114, 40, 2]], { on: 'evaporator', face: 'y', id: 'drain-pan' }),

    // Evaporator fan: a round fan on top of the coil, moving cold air over it.
    box({ at: [79, 9, 56], size: [30, 30, 14], material: 'dark', round: true, id: 'fan', rests: 'evaporator' }),
    line([[88, 24, 70], [100, 24, 70]], { on: 'fan', face: 'top', id: 'fan-guard' }),

    // Condenser: the hot-side coil that releases the heat to the room.
    box({ at: [126, 4, 0], size: [44, 8, 60], material: 'steel', id: 'condenser' }),
    line([[129, 12, 5], [134, 12, 55], [139, 12, 5], [144, 12, 55], [149, 12, 5], [154, 12, 55], [159, 12, 5], [164, 12, 55]], { on: 'condenser', face: 'y', id: 'condenser-coil' }),

    // Compressor: a sealed dark dome that pumps the refrigerant.
    box({ at: [100, 46, 0], size: [30, 30, 26], material: 'dark', round: true, id: 'compressor' }),
    line([[108, 56, 26], [116, 56, 26]], { on: 'compressor', face: 'top', id: 'terminal-cover' }),

    // Refrigerant pipes: hot gas out of the compressor, liquid through the capillary tube, cold gas back.
    line([[115, 61, 26], [115, 61, 46], [148, 61, 46], [148, 16, 46]], { tone: 'warm', id: 'discharge-pipe' }),
    line([[126, 8, 40], [120, 8, 40], [120, 20, 40], [114, 20, 40]], { tone: 'copper', id: 'capillary-tube' }),
    line([[104, 40, 6], [104, 43, 6], [92, 43, 6], [92, 61, 6], [100, 61, 6]], { tone: 'cold', id: 'suction-pipe' }),
  ];
}

/** Labels: one per labelled part. Each anchor sits inside the part it names. */
export const LABELS = [
  { at: [30, 30, 80], text: 'Food cabinet' },
  { at: [80, 28, 30], text: 'Evaporator (cold coil)' },
  { at: [94, 24, 62], text: 'Evaporator fan' },
  { at: [115, 61, 12], text: 'Compressor' },
  { at: [150, 8, 30], text: 'Condenser coil' },
  { at: [66, 4, 3], text: 'Heat moving out' },
];

export const REQUIRED_PARTS = ['cabinet', 'evaporator', 'fan', 'compressor', 'condenser'];

/** The figure: `{ svg, model }`. Labels show on hover, focus or tap. */
export function figureRender(fontSize = FONT_SIZE) {
  return renderSvg(shapes(true), {
    labels: LABELS,
    title: FIG_TITLE,
    requiredParts: REQUIRED_PARTS,
    fontSize,
    idPrefix: 'rc',
  });
}

/** Cards under the figure: one per labelled part, in plain words. */
const CARDS = [
  ['Food cabinet', 'The insulated box that holds the food. The refrigerant loop keeps the air inside it cold. The door seals with a rubber gasket.'],
  ['Evaporator (cold coil)', 'Refrigerant boils in this coil and takes heat from the air around it. In a real refrigerator it sits inside the cabinet; here it is drawn beside the cabinet so you can see it.'],
  ['Evaporator fan', 'Moves air across the cold coil and into the cabinet. Its exact position varies between models; here it sits on top of the coil.'],
  ['Compressor', 'The sealed motor that squeezes the refrigerant gas. Squeezing it makes it hot.'],
  ['Condenser coil', 'The hot-side coil. The refrigerant gives up its heat here to the room air. In a real refrigerator it is at the back or the base.'],
  ['Heat moving out', 'A marker that shows the direction heat travels: out of the cabinet and toward the condenser. It is not a part.'],
];

/** The page around the figure. @param {string} svg */
export function page(svg) {
  if (typeof svg !== 'string' || !svg.startsWith('<svg')) throw new TypeError('page: svg string required');
  const cards = CARDS.map(([name, what]) => `<div><dt>${name}</dt><dd>${what}</dd></div>`).join('\n');
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
main{max-width:720px;margin:0 auto;padding:24px 16px 48px}
header{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
h1{font-size:1.5rem;line-height:1.25;margin:0}
h2{font-size:1.1rem;margin:32px 0 8px}
.kicker{color:var(--muted);font-size:.85rem;margin:0 0 4px;letter-spacing:.04em}
button{font:inherit;font-size:.9rem;color:var(--fg);background:var(--surface);border:1px solid var(--line-strong);border-radius:8px;padding:6px 12px;cursor:pointer}
button:focus-visible{outline:2px solid var(--ok);outline-offset:2px}
figure{margin:24px 0;padding:16px;background:var(--surface);border:1px solid var(--line);border-radius:12px}
figure svg{display:block;width:100%;max-width:560px;height:auto;margin:0 auto}
figcaption{color:var(--muted);font-size:.9rem;margin-top:8px}
.controls{display:flex;gap:8px;margin-top:12px}
.paused svg *{animation-play-state:paused!important}
dl{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin:0}
dl div{background:var(--surface2);border-radius:10px;padding:12px}
dt{font-weight:600}
dd{margin:4px 0 0;color:var(--muted);font-size:.92rem}
.note{color:var(--muted);font-size:.9rem}
@media (max-width:480px){figure{padding:8px}}
</style>
</head>
<body>
<main>
<header>
<div><p class="kicker">FIGURE</p><h1>${TITLE}</h1></div>
<button type="button" id="theme" aria-pressed="false">Dark theme</button>
</header>
<p>A refrigerator moves heat out of the food cabinet. A liquid refrigerant takes heat in at the cold coil, and gives it up at the coil outside the cabinet.</p>
<figure id="fig">
${svg}
<figcaption>The compressor pushes the refrigerant around the loop. The warm pipe carries hot gas to the condenser, the copper pipe carries liquid to the cold coil, and the blue pipe carries cold gas back. Hover or tap a part to see its name.</figcaption>
<div class="controls"><button type="button" id="play" aria-pressed="true">Pause motion</button></div>
</figure>
<h2>The parts</h2>
<dl>
${cards}
</dl>
<p class="note">Proportions are approximate. Some parts are drawn beside the cabinet so that each one can be seen; in a real refrigerator the evaporator and its fan sit inside the cabinet, and the condenser sits at the back or the base.</p>
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

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const at = (p) => fileURLToPath(new URL(p, import.meta.url));
  const { svg, model } = figureRender();
  const report = lint(model);
  writeFileSync(at(`./${SLUG}.svg`), svg + '\n');
  writeFileSync(at(`./${SLUG}.html`), page(svg));
  writeFileSync(at('./lint-report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(`errors: ${report.errors.length}, warnings: ${report.warnings.length}`);
  for (const e of report.errors) console.log(`ERROR ${e.rule}: ${e.message}`);
  for (const w of report.warnings) console.log(`WARN ${w.rule}: ${w.message}`);
  console.log(`viewBox: ${model.viewBox.join(' ')}`);
}
