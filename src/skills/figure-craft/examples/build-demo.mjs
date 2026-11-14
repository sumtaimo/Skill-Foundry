/**
 * figure-craft demo builder: produces the CDN edge cache demo page and the preview cover from the engine only.
 * Run directly to write examples/demo.html, preview/example.html and preview/cover.svg.
 * Node 24 ESM, stdlib only, zero deps.
 * @governed-by PO_ARCHITECT
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { box, dot, line, renderSvg } from '../engine/iso.mjs';
import { tokensCss } from '../engine/tokens.mjs';

const TITLE = 'How a CDN edge cache serves a request';
const FIG_TITLE = 'A request travels from the client to the edge cache, which answers it without asking the origin.';
/** Label font size in viewBox units, chosen so labels render at 11 CSS px or more on a 390px wide screen. */
export const DEMO_FONT_SIZE = 16;

/** @param {boolean} animated include the request motion */
function shapes(animated) {
  if (typeof animated !== 'boolean') throw new TypeError('shapes: animated must be boolean');
  const request = { at: [30, 26, 4], size: [8, 8, 8], id: 'request', rests: 'ground' };
  if (animated) Object.assign(request, { move: [26, 0, 0], delay: 0 });
  return [
    box({ at: [0, 0, 0], size: [160, 60, 4], r: 4, id: 'ground' }),
    box({ at: [8, 22, 4], size: [18, 18, 16], id: 'client', rests: 'ground' }),
    line([[26, 25, 16], [26, 37, 16]], { on: 'client', face: 'x', id: 'client-screen' }), // screen edge on the side facing the request
    box(request),
    box({ at: [64, 14, 4], size: [32, 32, 36], tone: 'ink', id: 'edge', rests: 'ground' }),
    box({ at: [128, 14, 4], size: [24, 32, 52], id: 'origin', rests: 'ground' }),
    line([[152, 18, 44], [152, 42, 44]], { on: 'origin', face: 'x', id: 'origin-bay-1' }), // drive bays
    line([[152, 18, 34], [152, 42, 34]], { on: 'origin', face: 'x', id: 'origin-bay-2' }),
    line([[152, 18, 24], [152, 42, 24]], { on: 'origin', face: 'x', id: 'origin-bay-3' }),
    line([[96, 20, 30], [96, 40, 30]], { on: 'edge', face: 'x', id: 'edge-vent' }), // vent slot
    dot([80, 30, 40], { face: 'top', on: 'edge', tone: 'ok' }),
  ];
}

const LABELS = {
  client: { at: [17, 31, 20], text: 'Client', side: 'l' },
  request: { at: [34, 30, 12], text: 'Request', side: 'l' },
  edge: { at: [80, 30, 40], text: 'Edge cache', side: 'r' },
  origin: { at: [140, 30, 56], text: 'Origin (skipped)', side: 'r' },
};

/** Demo page html for a rendered svg. @param {string} svg */
function page(svg) {
  if (typeof svg !== 'string' || !svg.startsWith('<svg')) throw new TypeError('page: svg string required');
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
dl{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin:0}
dl div{background:var(--surface2);border-radius:10px;padding:12px}
dt{color:var(--muted);font-size:.8rem}
dd{margin:0;font-weight:600}
@media (max-width:480px){figure{padding:8px}}
</style>
</head>
<body>
<main>
<header>
<div><p class="kicker">FIGURE</p><h1>${TITLE}</h1></div>
<button type="button" id="theme" aria-pressed="false">Dark theme</button>
</header>
<p>The edge cache sits close to the reader. When it already holds a copy, it answers at once and the origin is never asked.</p>
<figure id="fig">
${svg}
<figcaption>The request moves along one axis to the edge cache. The green light means a cache hit. Hover or tap a part to see its name.</figcaption>
<div class="controls"><button type="button" id="play" aria-pressed="true">Pause motion</button></div>
</figure>
<dl>
<div><dt>Client</dt><dd>Sends the request</dd></div>
<div><dt>Request</dt><dd>Travels to the nearest copy</dd></div>
<div><dt>Edge cache</dt><dd>Holds a nearby copy</dd></div>
<div><dt>Origin</dt><dd>Only asked on a miss</dd></div>
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

/** The animated demo figure: `{ svg, model }`, the model is what lint checks. */
export function demoRender() {
  return renderSvg(shapes(true), {
    labels: [LABELS.client, LABELS.request, LABELS.edge, LABELS.origin],
    title: FIG_TITLE,
    requiredParts: ['client', 'request', 'edge', 'origin'],
    fontSize: DEMO_FONT_SIZE,
  });
}

/**
 * Build the demo page and the preview cover from the engine.
 * @returns {{demoHtml:string, coverSvg:string}}
 */
export function buildDemo() {
  const demo = demoRender();
  const cover = renderSvg(shapes(false), {
    labels: [LABELS.client, LABELS.edge, LABELS.origin],
    padding: 16,
    idPrefix: 'cv',
    flat: true,
  });
  const coverSvg = cover.svg.replace('role="img">', 'role="img" aria-label="figure-craft cover: isometric CDN edge cache">') + '\n';
  return { demoHtml: page(demo.svg), coverSvg };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { demoHtml, coverSvg } = buildDemo();
  const at = (p) => fileURLToPath(new URL(p, import.meta.url));
  writeFileSync(at('./demo.html'), demoHtml);
  writeFileSync(at('../preview/example.html'), demoHtml);
  writeFileSync(at('../preview/cover.svg'), coverSvg);
}
