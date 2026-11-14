/**
 * Builds the "How a refrigerator keeps food cold" figure from the figure-craft engine:
 * refrigerator.svg, refrigerator.html and lint-report.json. Run from this folder: node build-figure.mjs
 * The engine is imported from the figure-craft skill folder (relative path below); nothing is drawn by hand.
 * Node ESM, stdlib only, zero deps.
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { box, line, renderSvg } from '../../../../src/skills/figure-craft/engine/iso.mjs';
import { lint } from '../../../../src/skills/figure-craft/engine/lint.mjs';
import { tokensCss } from '../../../../src/skills/figure-craft/engine/tokens.mjs';

const at = (p) => fileURLToPath(new URL(p, import.meta.url));
const SLUG = 'refrigerator';
const TITLE = 'How a refrigerator keeps food cold';
const IDEA = 'A refrigerator keeps food cold by moving heat out of the cabinet; cold air made at the evaporator passes over the food.';
const FIG_TITLE = IDEA;
/** Label size in viewBox units. At 342 CSS px (390px phone minus gutters and figure padding) it renders at >= 11px. */
const FONT_SIZE = 14;
const PHONE_SVG_PX = 390 - 2 * 16 - 2 * 8;
const MIN_LABEL_CSS_PX = 11;

/** Evaporator coil: a serpentine of four passes on the x face at x = 7, inside y 8..52 and z 118..152. */
const coil = [];
[120, 128, 136, 144].forEach((z, k) => {
  const [a, b] = k % 2 === 0 ? [8, 52] : [52, 8];
  coil.push([7, a, z], [7, b, z]);
});

// Units are schematic (cabinet 60 wide, 60 deep, 170 tall). The cutaway keeps only the back wall:
// top, side and front are open. The door is drawn swung open 90 degrees on the left, hinged at the front-back corner.
// Shapes are listed farther first (lower x + y) so nearer shapes paint over them.
const SHAPES = [
  box({ at: [-6, -6, 0], size: [72, 132, 3], r: 4, id: 'ground' }),
  box({ at: [0, 0, 3], size: [3, 60, 167], id: 'back-wall', rests: 'ground' }),
  // Compressor sits in the machine well at the back-bottom. Drawn larger than to scale so its details read.
  box({ at: [7, 8, 3], size: [26, 30, 16], tone: 'ink', id: 'compressor', rests: 'ground' }),
  line([[33, 12, 9], [33, 34, 9]], { on: 'compressor', face: 'x', id: 'suction-pipe' }),
  line([[12, 38, 13], [28, 38, 13]], { on: 'compressor', face: 'y', bold: true, id: 'discharge-pipe' }),
  // Evaporator: the cold coil on the back wall, where refrigerant boils and takes heat from the air.
  box({ at: [3, 6, 116], size: [4, 48, 38], id: 'evaporator' }),
  line(coil, { on: 'evaporator', face: 'x', id: 'evaporator-coil' }),
  line([[7, 8, 151], [7, 52, 151]], { on: 'evaporator', face: 'x', bold: true, id: 'evaporator-inlet' }),
  // Food shelf. Food sits on it; the cold air travels over it.
  box({ at: [3, 3, 110], size: [57, 54, 3], id: 'shelf' }),
  line([[60, 6, 111.5], [60, 54, 111.5]], { on: 'shelf', face: 'x', id: 'shelf-edge' }),
  // The one motion story: the cold-air puff moves along x, one iso axis, over the shelf it rests on.
  box({ at: [18, 6, 113], size: [8, 20, 8], anim: 'travel', move: [24, 0, 0], rests: 'shelf', id: 'cold-air' }),
  // Door, swung open 90 degrees. Its outer face now faces +x, so the details sit on the x face.
  box({ at: [-3, 60, 3], size: [3, 60, 167], id: 'door', rests: 'ground' }),
  line([[0, 62, 95], [0, 118, 95]], { on: 'door', face: 'x', id: 'door-seam' }),
  line([[0, 112, 70], [0, 112, 120]], { on: 'door', face: 'x', bold: true, id: 'door-handle' }),
  line([[0, 63, 20], [0, 63, 150]], { on: 'door', face: 'x', id: 'door-hinge' }),
];

/** Labels: five at most. Each anchor is a point inside the part it names. */
const LABELS = [
  { at: [20, 16, 9], text: 'Compressor', side: 'r' },
  { at: [5, 30, 134], text: 'Evaporator', side: 'r' },
  { at: [22, 16, 117], text: 'Cold air', side: 'r' },
  { at: [50, 30, 111.5], text: 'Food shelf', side: 'r' },
  { at: [-1.5, 90, 100], text: 'Door', side: 'l' },
];

const { svg, model } = renderSvg(SHAPES, { labels: LABELS, title: FIG_TITLE, fontSize: FONT_SIZE });
const report = lint(model);
const vw = model.viewBox[2];
const labelCssPx = (FONT_SIZE * PHONE_SVG_PX) / vw;
if (labelCssPx < MIN_LABEL_CSS_PX) throw new RangeError(`labels render at ${labelCssPx.toFixed(1)}px on a phone; raise FONT_SIZE`);

const CARDS = [
  ['Compressor', 'Pumps refrigerant around the loop. The heat it moves leaves through the condenser coils, usually at the back, which this view does not show.'],
  ['Evaporator', 'The cold coil on the back wall. Refrigerant boils inside it and takes heat from the air around it, so the air turns cold.'],
  ['Cold air', 'Air chilled at the evaporator. It moves across the food shelf.'],
  ['Food shelf', 'Holds the food in the cold air.'],
  ['Door', 'Shown swung open. Its seam, handle and hinge are the features drawn on it.'],
];

function page(figureSvg) {
  const cards = CARDS.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('\n');
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
<p>A refrigerator keeps food cold by moving heat out of the cabinet. Cold air made at the evaporator passes over the food.</p>
<figure id="fig">
${figureSvg}
<figcaption>Cutaway: only the back wall is kept. The cold air moves across the food shelf, and the door is shown swung open on the left.</figcaption>
<div class="controls"><button type="button" id="play" aria-pressed="true">Pause motion</button></div>
</figure>
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

writeFileSync(at(`./${SLUG}.svg`), svg + '\n');
writeFileSync(at(`./${SLUG}.html`), page(svg));
writeFileSync(at('./lint-report.json'), JSON.stringify({ errors: report.errors, warnings: report.warnings }, null, 2) + '\n');
console.log(JSON.stringify({ errors: report.errors.length, warnings: report.warnings.length, labelCssPx: Number(labelCssPx.toFixed(1)), viewBox: model.viewBox }));
for (const e of report.errors) console.log('ERROR', e.rule, e.message);
for (const w of report.warnings) console.log('WARN', w.rule, w.message);
if (report.errors.length) process.exitCode = 1;
