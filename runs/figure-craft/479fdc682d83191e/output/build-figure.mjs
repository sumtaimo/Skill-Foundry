/**
 * Builds the "How a refrigerator keeps food cold" figure from the figure-craft engine only.
 * Writes refrigerator-cooling.svg, refrigerator-cooling.html and lint-report.json into this folder.
 * Run: node build-figure.mjs   (Node 22+ ESM, stdlib only, zero deps)
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { box, line, renderSvg } from '../../../../src/skills/figure-craft/engine/iso.mjs';
import { tokensCss } from '../../../../src/skills/figure-craft/engine/tokens.mjs';
import { lint } from '../../../../src/skills/figure-craft/engine/lint.mjs';

const SLUG = 'refrigerator-cooling';
const TITLE = 'How a refrigerator keeps food cold';
const FIG_TITLE = 'Cutaway of a household refrigerator: refrigerant carries heat from the cabinet to the condenser coil outside.';
/** Label size in viewBox units; checked in the report so labels render at 11 CSS px or more at 390px wide. */
export const FONT_SIZE = 16;

/**
 * The drawing, in arbitrary units (not to scale). Cabinet is a cutaway: no top, no right-hand side.
 * Higher x + y is nearer the reader; the door is on the y face (lower left on screen).
 */
export function shapes() {
  return [
    box({ at: [0, 0, 0], size: [120, 100, 2], r: 4, id: 'ground' }),
    // cabinet: floor, back wall and left wall (the cutaway), then the door at the front
    box({ at: [10, 20, 2], size: [60, 60, 4], id: 'floor', rests: 'ground' }),
    box({ at: [10, 20, 6], size: [60, 4, 164], id: 'back-wall', rests: 'floor' }),
    box({ at: [10, 24, 6], size: [4, 52, 164], id: 'left-wall', rests: 'floor' }),
    // evaporator coil: cools the air, mounted on the back wall at the top
    box({ at: [16, 24, 118], size: [50, 8, 30], id: 'evaporator' }),
    line([[20, 32, 122], [27, 32, 144], [34, 32, 122], [41, 32, 144], [48, 32, 122], [55, 32, 144], [62, 32, 122]],
      { on: 'evaporator', face: 'y', id: 'evaporator-coil' }),
    box({ at: [14, 30, 78], size: [52, 40, 3], id: 'shelf' }),
    // cold air: the one moving marker, sinks from the evaporator past the food
    box({ at: [36, 44, 104], size: [8, 8, 8], tone: 'ink', anim: 'cold-air', move: [0, 0, -14], id: 'cold-air' }),
    box({ at: [10, 76, 6], size: [60, 4, 164], id: 'door', rests: 'floor' }),
    line([[13, 80, 9], [67, 80, 9], [67, 80, 165], [13, 80, 165], [13, 80, 9]], { on: 'door', face: 'y', id: 'door-gasket' }),
    line([[18, 80, 100], [18, 80, 130]], { on: 'door', face: 'y', bold: true, id: 'door-handle' }),
    // machine parts: compressor and condenser coil, beside the cabinet so both stay visible
    box({ at: [76, 4, 2], size: [20, 14, 12], id: 'compressor', rests: 'ground' }),
    line([[86, 4, 14], [86, 18, 14]], { on: 'compressor', face: 'top', id: 'compressor-seam' }),
    box({ at: [84, 60, 2], size: [6, 22, 40], id: 'condenser', rests: 'ground' }),
    line([[90, 62, 6], [90, 66, 38], [90, 70, 6], [90, 74, 38], [90, 78, 6]], { on: 'condenser', face: 'x', id: 'condenser-coil' }),
    // refrigerant pipes, drawn last so they sit over the parts they run past
    line([[86, 11, 14], [86, 11, 46], [87, 66, 46], [87, 66, 42]], { bold: true, id: 'discharge-pipe' }),
    line([[87, 74, 42], [87, 74, 126], [87, 28, 126], [66, 28, 126]], { id: 'capillary-pipe' }),
    line([[66, 30, 120], [72, 30, 120], [72, 30, 30], [72, 10, 30], [76, 10, 8]], { bold: true, id: 'suction-pipe' }),
  ];
}

export const LABELS = [
  { at: [12, 78, 100], text: 'Door gasket', side: 'l' },
  { at: [40, 48, 108], text: 'Cold air', side: 'r' },
  { at: [58, 28, 133], text: 'Evaporator coil', side: 'r' },
  { at: [86, 11, 8], text: 'Compressor', side: 'r' },
  { at: [87, 72, 22], text: 'Condenser coil', side: 'r' },
];

const IDEA = 'A refrigerator keeps food cold by moving heat out of the cabinet, with refrigerant pumped around a closed loop.';

/** Page copy: one idea per sentence, facts the drawing shows. */
const CARDS = [
  ['Compressor', 'Pumps the refrigerant around the loop and raises its pressure.'],
  ['Evaporator coil', 'The refrigerant boils here and absorbs heat from the air in the cabinet.'],
  ['Condenser coil', 'The refrigerant gives up that heat to the room air outside the cabinet.'],
  ['Cold air', 'Cooled air sinks past the food on the shelves.'],
  ['Door gasket', 'The seal around the door keeps warm room air out.'],
];

function page(svg) {
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
nav ol{list-style:none;padding:0;margin:16px 0 0;display:flex;flex-wrap:wrap;gap:8px}
nav a{display:inline-block;font-size:.9rem;color:var(--fg);text-decoration:none;border:1px solid var(--line);border-radius:999px;padding:4px 12px}
nav a[aria-current="true"]{border-color:var(--ok);color:var(--ok)}
nav span{color:var(--muted);margin-right:4px}
button{font:inherit;font-size:.9rem;color:var(--fg);background:var(--surface);border:1px solid var(--line-strong);border-radius:8px;padding:6px 12px;cursor:pointer}
button:focus-visible,nav a:focus-visible{outline:2px solid var(--ok);outline-offset:2px}
figure{margin:24px 0;padding:16px;background:var(--surface);border:1px solid var(--line);border-radius:12px}
figure svg{display:block;width:100%;max-width:560px;height:auto;margin:0 auto}
figcaption{color:var(--muted);font-size:.9rem;margin-top:8px}
.controls{display:flex;gap:8px;margin-top:12px}
.paused svg *{animation-play-state:paused!important}
dl{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin:0}
dl div{background:var(--surface2);border-radius:10px;padding:12px}
dt{font-weight:600}
dd{margin:4px 0 0;color:var(--muted);font-size:.95rem}
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
<nav aria-label="Contents"><ol>
<li><a href="#figure" aria-current="true"><span>01</span>Figure</a></li>
<li><a href="#parts"><span>02</span>Parts</a></li>
<li><a href="#notes"><span>03</span>Drawing notes</a></li>
</ol></nav>
<h2 id="figure"><span class="note">01</span> The cooling loop</h2>
<p>${IDEA}</p>
<figure id="fig">
${svg}
<figcaption>Refrigerant circulates in a closed loop: it absorbs heat inside the cabinet at the evaporator coil and releases it outside at the condenser coil. The cold air marker shows cooled air sinking past the food.</figcaption>
<div class="controls"><button type="button" id="play" aria-pressed="true">Pause motion</button></div>
</figure>
<h2 id="parts"><span class="note">02</span> The parts</h2>
<dl>
${CARDS.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('\n')}
</dl>
<p class="note">The thin pipes between these parts carry the refrigerant. The capillary tube drops its pressure before the evaporator coil.</p>
<h2 id="notes"><span class="note">03</span> Drawing notes</h2>
<p class="note">This is a simplified cutaway. Parts are placed for clarity, are not to scale, and their position varies by model.</p>
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

export function build() {
  const { svg, model } = renderSvg(shapes(), { labels: LABELS, title: FIG_TITLE, fontSize: FONT_SIZE });
  const { errors, warnings } = lint(model);
  return { svg: svg + '\n', model, errors, warnings, html: page(svg) };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const here = (p) => fileURLToPath(new URL(p, import.meta.url));
  const { svg, errors, warnings, html, model } = build();
  writeFileSync(here(`./${SLUG}.svg`), svg);
  writeFileSync(here(`./${SLUG}.html`), html);
  writeFileSync(here('./lint-report.json'), JSON.stringify({ errors, warnings }, null, 2) + '\n');
  console.log(`viewBox ${model.viewBox.join(' ')} | errors ${errors.length} | warnings ${warnings.length}`);
  for (const e of errors) console.log(`ERROR ${e.rule}: ${e.message}`);
  for (const w of warnings) console.log(`WARN ${w.rule}: ${w.message}`);
  if (errors.length) process.exitCode = 1;
}
