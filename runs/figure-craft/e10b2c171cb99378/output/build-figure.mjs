/**
 * figure-craft build: "How a front-loading washing machine washes clothes".
 * Writes front-loader-washing-machine.html, front-loader-washing-machine.svg and lint-report.json
 * from the figure-craft engine only. Deterministic: running it again gives the same bytes.
 *
 * Engine location: $FIGURE_CRAFT_ENGINE, or the figure-craft skill folder's engine/ directory.
 * Node ESM, stdlib only.
 */
import { writeFileSync } from 'node:fs';
import { pathToFileURL, fileURLToPath } from 'node:url';

const ENGINE = process.env.FIGURE_CRAFT_ENGINE ?? '/home/user/Skill-Foundry/src/skills/figure-craft/engine';
const load = (f) => import(pathToFileURL(`${ENGINE}/${f}`).href);
const { box, dot, line, panel, renderSvg, labelTarget } = await load('iso.mjs');
const { turnShapes, sortShapes, orbitHtml } = await load('orbit.mjs');
const { lintViews } = await load('lint.mjs');
const { tokensCss } = await load('tokens.mjs');

const SLUG = 'front-loader-washing-machine';
const TITLE = 'How a front-loading washing machine washes clothes';
const IDEA = 'The motor turns the drum, and the laundry inside is lifted and falls back as the machine washes it.';
const FIG_TITLE = `${TITLE}: the front door is open, so the drum and the laundry inside it are visible.`;
const REQUIRED = ['cabinet', 'door', 'console', 'drum', 'laundry', 'motor'];

/* ---------- the machine, in its real parts. Units are illustrative (about 1 unit = 1 cm). ---------- */
const shapes = [
  // ground plate and the four feet that carry the machine
  box({ at: [-6, -6, 0], size: [68, 72, 2], material: 'plain', r: 4, id: 'ground' }),
  box({ at: [3, 3, 2], size: [4, 4, 4], material: 'dark', id: 'foot-1', rests: 'ground' }),
  box({ at: [3, 53, 2], size: [4, 4, 4], material: 'dark', id: 'foot-2', rests: 'ground' }),
  box({ at: [49, 3, 2], size: [4, 4, 4], material: 'dark', id: 'foot-3', rests: 'ground' }),
  box({ at: [49, 53, 2], size: [4, 4, 4], material: 'dark', id: 'foot-4', rests: 'ground' }),

  // outer cabinet: white enamel, open on the front (x) so the drum can be seen
  box({ at: [0, 0, 6], size: [56, 60, 84], material: 'white', id: 'cabinet', open: 'x', wall: 1.5 }),
  line([[2, 30, 90], [54, 30, 90]], { on: 'cabinet', face: 'top', id: 'cabinet-top-seam' }),
  line([[4, 60, 78], [34, 60, 78]], { on: 'cabinet', face: 'y', id: 'cabinet-side-vent-1' }),
  line([[4, 60, 82], [34, 60, 82]], { on: 'cabinet', face: 'y', id: 'cabinet-side-vent-2' }),
  line([[0, 60, 12], [56, 60, 12]], { on: 'cabinet', face: 'y', id: 'cabinet-base-seam' }),
  line([[10, 0, 78], [40, 0, 78]], { on: 'cabinet', face: '-y', id: 'cabinet-far-side-vent' }),
  panel([[0, 20, 70], [0, 44, 80]], { on: 'cabinet', face: '-x', material: 'white', id: 'cabinet-rating-plate' }),
  line([[0, 50, 30], [0, 50, 14]], { on: 'cabinet', face: '-x', bold: true, id: 'cabinet-power-cable' }),
  line([[0, 14, 80], [0, 14, 70]], { on: 'cabinet', face: '-x', id: 'cabinet-water-hose' }),

  // motor under the drum, inside the cabinet
  box({ at: [36, 10, 8], size: [18, 40, 12], material: 'dark', id: 'motor', inside: 'cabinet' }),
  line([[54, 16, 11], [54, 44, 11]], { on: 'motor', face: 'x', id: 'motor-housing-rib' }),
  line([[54, 16, 16], [54, 44, 16]], { on: 'motor', face: 'x', id: 'motor-fin' }),

  // drum: steel, open toward the door, inside the cabinet
  box({ at: [18, 6, 22], size: [36, 48, 48], material: 'steel', id: 'drum', inside: 'cabinet', open: 'x', wall: 2 }),
  line([[22, 54, 30], [50, 54, 30]], { on: 'drum', face: 'y', id: 'drum-perforation-1' }),
  line([[22, 54, 40], [50, 54, 40]], { on: 'drum', face: 'y', id: 'drum-perforation-2' }),
  line([[22, 54, 50], [50, 54, 50]], { on: 'drum', face: 'y', id: 'drum-perforation-3' }),
  line([[20, 30, 70], [52, 30, 70]], { on: 'drum', face: 'top', id: 'drum-rim-seam' }),

  // contents that rest in the drum, and the laundry that moves
  box({ at: [22, 14, 24], size: [20, 20, 10], material: 'blue', id: 'laundry', inside: 'drum', anim: 'tumble', move: [0, 0, 14] }),

  // front door, swung open on its hinge at the back-right edge (y = 0), out of the reader's line of sight
  box({ at: [56, 0, 6], size: [60, 3, 84], material: 'white', id: 'door' }),
  panel([[70, 3, 28], [100, 3, 66]], { on: 'door', face: 'y', material: 'glass', id: 'door-porthole' }),
  line([[58, 3, 8], [114, 3, 8]], { on: 'door', face: 'y', id: 'door-rim' }),
  line([[58, 3, 80], [62, 3, 80]], { on: 'door', face: 'y', id: 'door-hinge-top' }),
  line([[58, 3, 14], [62, 3, 14]], { on: 'door', face: 'y', id: 'door-hinge-bottom' }),
  line([[116, 1.5, 46], [116, 1.5, 56]], { on: 'door', face: 'x', bold: true, id: 'door-handle' }),

  // control console on top of the cabinet, front half
  box({ at: [40, 0, 90], size: [16, 60, 8], material: 'steel', id: 'console', rests: 'cabinet' }),
  panel([[56, 6, 92], [56, 34, 96]], { on: 'console', face: 'x', material: 'dark', id: 'console-display' }),
  dot([56, 48, 94], { face: 'x', on: 'console', tone: 'ink', id: 'console-program-dial' }),
  dot([56, 54, 96], { face: 'x', on: 'console', tone: 'ok', id: 'console-power-light' }),
  panel([[42, 2, 98], [54, 24, 98]], { on: 'console', face: 'top', material: 'plain', id: 'console-detergent-drawer' }),
];

/* ---------- labels: one per labelled part; each anchor sits inside the part it names ---------- */
const labels = [
  { at: [8, 56, 80], text: 'Cabinet' },
  { at: [88, 1.5, 40], text: 'Door' },
  { at: [48, 30, 94], text: 'Control panel' },
  { at: [44, 30, 62], text: 'Drum' },
  { at: [32, 24, 30], text: 'Laundry' },
  { at: [45, 30, 14], text: 'Motor' },
];

/* ---------- the four views: the engine's renderViews, but a label is kept only in a view where its part is drawn ---------- */
const turnPoint = ([x, y, z]) => [y, -x, z]; // one quarter turn, as in engine/orbit.mjs
function turnPointK(p, k) { let q = p; for (let i = 0; i < k; i++) q = turnPoint(q); return q; }

function buildViews(opts) {
  return [0, 1, 2, 3].map((k) => {
    const turned = turnShapes(shapes, k);
    const ids = new Set(turned.map((s) => s.id));
    const kept = opts.labels
      .map((l) => ({ ...l, at: turnPointK(l.at, k) }))
      .filter((l) => labelTarget(l, turned) !== null); // a hidden part has no label in that view
    const r = renderSvg(k === 0 ? turned : sortShapes(turned), {
      ...opts,
      labels: kept,
      requiredParts: REQUIRED.filter((id) => k === 0 || ids.has(id)),
      idPrefix: `fc${k}`,
      title: `${FIG_TITLE} (view ${k + 1} of 4)`,
    });
    return { ...r, view: k };
  });
}

/* Smallest label size at which text renders at 11 CSS px or more on a 390px phone: 390 - 2*16 gutter - 2*16 figure padding = 326. */
const PHONE_AVAILABLE = 326;
let fontSize = 11;
let views = buildViews({ labels, padding: 12, fontSize });
for (let pass = 0; pass < 4; pass++) {
  const vbW = views[0].model.viewBox[2];
  const want = Math.ceil((11 * vbW) / PHONE_AVAILABLE);
  if (want === fontSize) break;
  fontSize = want;
  views = buildViews({ labels, padding: 12, fontSize });
}

/* ---------- lint: every rule on the front view, geometry rules on the other three ---------- */
const report = lintViews(views);
writeFileSync(new URL('./lint-report.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');

/* ---------- the page ---------- */
const CARDS = [
  ['Cabinet', 'The white outer body. It holds every other part, and its back has the power cable, water hose and rating plate.'],
  ['Door', 'Swung open on its hinge here. The glass porthole is how you see into the drum when the door is closed.'],
  ['Control panel', 'On top of the machine: the display, the program dial and the power light. The detergent drawer sits beside them.'],
  ['Drum', 'The steel drum holds the clothes. Its front is open toward the door, and rows of holes run along its wall.'],
  ['Laundry', 'The clothes. As the machine washes, they are lifted and fall back.'],
  ['Motor', 'Turns the drum. It sits under the drum, inside the cabinet.'],
];
const cardsHtml = CARDS.map(([name, text]) => `<div><dt>${name}</dt><dd>${text}</dd></div>`).join('\n');

const figure = orbitHtml(views, { label: TITLE });

function page() {
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
figure .fc-orbit{max-width:560px;margin:0 auto}
figcaption{color:var(--muted);font-size:.9rem;margin-top:8px}
.hint{color:var(--muted);font-size:.9rem;margin:8px 0 0}
.controls{display:flex;gap:8px;margin-top:12px}
.paused svg *{animation-play-state:paused!important}
dl{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin:0}
dl div{background:var(--surface2);border-radius:10px;padding:12px}
dt{font-weight:600}
dd{margin:4px 0 0;color:var(--muted);font-size:.9rem}
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
${figure}
<figcaption>The laundry is lifted and falls back in the drum, on a loop. Hover or tap a part to see its name.</figcaption>
<p class="hint">Hover or tap a part to see its name. Turn it to see every side.</p>
<div class="controls"><button type="button" id="play" aria-pressed="true">Pause motion</button></div>
</figure>
<h2 style="font-size:1.1rem">The parts</h2>
<dl>
${cardsHtml}
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

writeFileSync(new URL(`./${SLUG}.html`, import.meta.url), page());
writeFileSync(new URL(`./${SLUG}.svg`, import.meta.url), views[0].svg + '\n');

const summary = { errors: report.errors.length, warnings: report.warnings.length, fontSize, viewBox: views[0].model.viewBox };
process.stdout.write(JSON.stringify(summary) + '\n');
for (const e of report.errors) process.stdout.write(`ERROR ${e.rule}: ${e.message}\n`);
for (const w of report.warnings) process.stdout.write(`WARNING ${w.rule}: ${w.message}\n`);
if (fileURLToPath(import.meta.url) === process.argv[1] && report.errors.length) process.exitCode = 1;
