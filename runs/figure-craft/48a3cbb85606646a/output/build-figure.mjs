/**
 * Builds the refrigerator cutaway figure from the figure-craft engine: the SVG, the HTML page and the lint report.
 * Run from this folder: node build-figure.mjs
 * Same inputs, same bytes. Node ESM, stdlib only, zero deps.
 *
 * Units are centimetres of a real household fridge, drawn about 1.5x its real height in the figure.
 * Axes (engine): x runs down-right, y runs down-left, z runs up. Higher x + y is nearer the reader.
 * The fridge is cut away on its top and its right side (x = 60) so the parts inside are visible.
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { box, dot, line, renderSvg } from '../../../../src/skills/figure-craft/engine/iso.mjs';
import { lint } from '../../../../src/skills/figure-craft/engine/lint.mjs';
import { tokensCss } from '../../../../src/skills/figure-craft/engine/tokens.mjs';

const SLUG = 'refrigerator-cooling';
const TITLE = 'How a refrigerator keeps food cold';
/** The idea sentence, from the user's request: "Show my customers how a refrigerator keeps food cold." */
const IDEA = 'A refrigerator keeps food cold by pumping heat out of the cabinet: the compressor drives a refrigerant loop that takes heat in at the evaporator and gives it out at the condenser.';
/** Label font size in viewBox units. Checked below: at 390px wide it renders at 11 CSS px or more. */
const FONT_SIZE = 16;

/** The drawing: one fridge, cut away on top and on the right side. Ids are the part names used everywhere. */
function shapes() {
  return [
    // Insulated base. Solid: the machine space the compressor and condenser sit on.
    box({ at: [0, 0, 0], size: [60, 60, 20], id: 'base' }),
    // Thin cabinet walls at the back and the left. The door closes the front; the top and right side are open.
    box({ at: [0, 0, 20], size: [60, 4, 130], id: 'back-wall', rests: 'base' }),
    box({ at: [0, 4, 20], size: [4, 56, 130], id: 'left-wall', rests: 'base' }),

    // Compressor: a sealed motor-pump on the base. Shell seam on its visible side, terminal cluster on top.
    box({ at: [8, 8, 20], size: [28, 22, 22], id: 'compressor', rests: 'base' }),
    line([[36, 8, 31], [36, 30, 31]], { on: 'compressor', face: 'x', id: 'comp-seam' }),
    dot([20, 16, 42], { face: 'top', on: 'compressor', tone: 'ink', id: 'comp-terminals' }),

    // Condenser coil: tubing with fins, zigzagging across its side, with its top edge.
    box({ at: [8, 38, 20], size: [36, 8, 26], id: 'condenser', rests: 'base' }),
    line([[44, 40, 24], [44, 44, 27], [44, 40, 30], [44, 44, 33], [44, 40, 36], [44, 44, 39], [44, 40, 42]], { on: 'condenser', face: 'x', id: 'cond-coil' }),
    line([[44, 38, 45], [44, 46, 45]], { on: 'condenser', face: 'x', id: 'cond-top-edge' }),

    // Expansion device, drawn as a block (larger than the real narrow tube or valve). Tube port on top.
    box({ at: [44, 28, 20], size: [14, 18, 26], id: 'valve', rests: 'base' }),
    line([[47, 33, 46], [55, 33, 46]], { on: 'valve', face: 'top', bold: true, id: 'valve-port' }),

    // Cold-air marker: a moving stand-in for the cold air, not a part. Moves along x on the floor of the food space.
    box({ at: [10, 46, 20], size: [12, 12, 8], tone: 'ink', id: 'cold-air', rests: 'base', anim: 'travel', move: [30, 0, 0] }),

    // Evaporator coil in the freezer at the back, with a zigzag of tubing and a header tube.
    box({ at: [8, 4, 104], size: [44, 10, 40], id: 'evaporator' }),
    line([[52, 6, 108], [52, 12, 112], [52, 6, 116], [52, 12, 120], [52, 6, 124], [52, 12, 128], [52, 6, 132], [52, 12, 136], [52, 6, 140]], { on: 'evaporator', face: 'x', id: 'evap-coil' }),
    line([[52, 4, 104.5], [52, 14, 104.5]], { on: 'evaporator', face: 'x', id: 'evap-header' }),

    // Evaporator fan on top of the coil, with two grille slots on its front.
    box({ at: [12, 4, 144], size: [34, 10, 12], id: 'evap-fan', rests: 'evaporator' }),
    line([[46, 6, 146], [46, 12, 146]], { on: 'evap-fan', face: 'x', id: 'fan-slot-1' }),
    line([[46, 6, 150], [46, 12, 150]], { on: 'evap-fan', face: 'x', id: 'fan-slot-2' }),

    // Door, last: it is the nearest part. Gasket loop, handle and the hinge pin at the top left.
    box({ at: [0, 60, 20], size: [60, 4, 130], id: 'door' }),
    line([[3, 64, 26], [57, 64, 26], [57, 64, 144], [3, 64, 144], [3, 64, 26]], { on: 'door', face: 'y', id: 'door-gasket' }),
    line([[50, 64, 62], [50, 64, 104]], { on: 'door', face: 'y', bold: true, id: 'door-handle' }),
    dot([5, 64, 140], { face: 'y', on: 'door', tone: 'ink', id: 'door-hinge' }),
  ];
}

/** One label per named part. The anchor sits inside the part it names. */
const LABELS = [
  { at: [30, 62, 90], text: 'Door and seal', side: 'l' },
  { at: [30, 9, 124], text: 'Evaporator coil', side: 'r' },
  { at: [30, 9, 149], text: 'Evaporator fan', side: 'r' },
  { at: [30, 26, 40], text: 'Compressor', side: 'r' },
  { at: [24, 42, 34], text: 'Condenser coil', side: 'l' },
  { at: [50, 37, 33], text: 'Expansion device', side: 'r' },
  { at: [16, 54, 24], text: 'Cold air', side: 'l' },
];

/** Parts the idea cannot be understood without. Lint L14 checks each is drawn and labelled. */
const REQUIRED_PARTS = ['door', 'evaporator', 'evap-fan', 'compressor', 'condenser', 'valve', 'cold-air'];

/** Card text for each labelled part: what it does, in one or two plain sentences. */
const CARDS = [
  ['Door and seal', 'Closes the cold box. The gasket seals the edge so warm room air stays out, and the handle opens it. The dark dot at the top left is the hinge pin.'],
  ['Evaporator coil', 'Tubing inside the freezer. Cold liquid refrigerant boils here and takes heat from the air around it.'],
  ['Evaporator fan', 'Blows air across the evaporator coil so the cold air spreads into the cabinet. Drawn larger than real.'],
  ['Compressor', 'A sealed motor-pump. It squeezes the refrigerant gas, which makes it hot and pushes it round the loop. The dark dot on top marks its electrical terminals.'],
  ['Condenser coil', 'Gives the refrigerant\'s heat to the room. Drawn in the base; on many fridges it sits at the back.'],
  ['Expansion device', 'A narrow restriction, often a capillary tube. It drops the pressure so the refrigerant turns cold and liquid before the evaporator. The bold line on top is its tube port. Drawn larger than real.'],
  ['Cold air', 'A moving marker for the cold air across the food. It is not a part.'],
];

/** Page html for the figure. Labels, leaders and motion come from the engine; the page only names every part in cards. */
function page(svg) {
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
@media (max-width:480px){figure{padding:8px}}
</style>
</head>
<body>
<main>
<header>
<div><p class="kicker">FIGURE</p><h1>${TITLE}</h1></div>
<button type="button" id="theme" aria-pressed="false">Dark theme</button>
</header>
<p>${IDEA}</p>
<figure id="fig">
${svg}
<figcaption>The top and right side are cut away. The compressor drives one refrigerant loop: it takes heat in at the evaporator and gives it out at the condenser. Hover or tap a part to see its name.</figcaption>
<div class="controls"><button type="button" id="play" aria-pressed="true">Pause motion</button></div>
</figure>
<h2>The parts</h2>
<dl>
${cards}
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

export function buildFigure() {
  const { svg, model } = renderSvg(shapes(), {
    labels: LABELS,
    title: IDEA,
    requiredParts: REQUIRED_PARTS,
    fontSize: FONT_SIZE,
  });
  const result = lint(model);
  // Label size at phone width: 390px, 16px gutter on each side, 8px figure padding at small widths, 342px drawing width.
  const [, , vbW] = model.viewBox;
  const renderedPx = (FONT_SIZE * 342) / vbW;
  return { svg: svg + '\n', html: page(svg), lint: result, viewBoxWidth: vbW, labelPxAt390: Math.round(renderedPx * 10) / 10 };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const dir = new URL('.', import.meta.url);
  const at = (name) => fileURLToPath(new URL(name, dir));
  const out = buildFigure();
  writeFileSync(at(`./${SLUG}.svg`), out.svg);
  writeFileSync(at(`./${SLUG}.html`), out.html);
  writeFileSync(at('./lint-report.json'), JSON.stringify({ errors: out.lint.errors, warnings: out.lint.warnings }, null, 2) + '\n');
  console.log(`errors: ${out.lint.errors.length}, warnings: ${out.lint.warnings.length}`);
  for (const e of out.lint.errors) console.log(`ERROR ${e.rule}: ${e.message}`);
  for (const w of out.lint.warnings) console.log(`WARN ${w.rule}: ${w.message}`);
  console.log(`viewBox width ${out.viewBoxWidth}; label text at 390px: ${out.labelPxAt390} CSS px`);
}
