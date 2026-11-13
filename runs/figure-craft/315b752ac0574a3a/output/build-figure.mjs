/**
 * Builds the load-balancer figure with the figure-craft engine.
 * Writes: load-balancer.html (self-contained page), load-balancer.svg (standalone figure),
 * lint-report.json (lint result). Run: node build-figure.mjs
 * Node ESM, stdlib only. The engine is read from the skill folder and never modified.
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { box, dot, renderSvg } from '/home/user/Skill-Foundry/src/skills/figure-craft/engine/iso.mjs';
import { lint } from '/home/user/Skill-Foundry/src/skills/figure-craft/engine/lint.mjs';
import { tokensCss } from '/home/user/Skill-Foundry/src/skills/figure-craft/engine/tokens.mjs';

const OUT = fileURLToPath(new URL('.', import.meta.url));
const TITLE = 'How a load balancer spreads requests across servers';
const IDEA = 'A load balancer receives each request and sends it to one of three servers.';
const CAPTION = 'The request moves from the load balancer to Server 2. The green dot marks the server that got it.';
const FONT_SIZE = 16; // viewBox units; renders at about 12.6 CSS px on a 390px phone (see report)

const SERVER = [24, 20, 40];
const SERVER_Z = 4;

/** Shapes in draw order: supports first, farther before nearer, the moving request last. */
function shapes(animated) {
  const request = { at: [54, 40, 4], size: [8, 8, 8], id: 'request', rests: 'ground' };
  if (animated) Object.assign(request, { anim: 'travel', move: [-18, 0, 0], delay: 0 });
  return [
    box({ at: [0, 0, 0], size: [110, 84, 4], r: 4, id: 'ground' }),
    box({ at: [12, 8, SERVER_Z], size: SERVER, id: 'server1', rests: 'ground' }),
    box({ at: [12, 32, SERVER_Z], size: SERVER, id: 'server2', rests: 'ground' }),
    box({ at: [12, 56, SERVER_Z], size: SERVER, id: 'server3', rests: 'ground' }),
    dot([24, 42, SERVER_Z + SERVER[2]], { face: 'top', on: 'server2', tone: 'ok', r: 4, id: 'chosen' }),
    box({ at: [70, 30, SERVER_Z], size: [24, 24, 22], tone: 'ink', id: 'balancer', rests: 'ground' }),
    box(request),
  ];
}

const LABELS = [
  { at: [24, 18, SERVER_Z + SERVER[2]], text: 'Server 1', side: 'r' },
  { at: [24, 42, SERVER_Z + SERVER[2]], text: 'Server 2', side: 'l' },
  { at: [24, 66, SERVER_Z + SERVER[2]], text: 'Server 3', side: 'l' },
  { at: [82, 42, 26], text: 'Load balancer', side: 'r' },
];

const { svg: figureSvg, model } = renderSvg(shapes(true), { labels: LABELS, fontSize: FONT_SIZE, title: IDEA, idPrefix: 'lb' });
const report = lint(model);
if (report.errors.length) {
  throw new Error(`lint errors: ${JSON.stringify(report.errors)}`);
}
writeFileSync(OUT + 'lint-report.json', JSON.stringify({ errors: report.errors, warnings: report.warnings, viewBox: model.viewBox }, null, 2) + '\n');

// Standalone SVG: tokens inlined so it opens on its own in light and dark.
const standaloneSvg = figureSvg.replace('role="img">', `role="img" aria-label="${IDEA}"><style>${tokensCss()}</style>`) + '\n';
writeFileSync(OUT + 'load-balancer.svg', standaloneSvg);

const page = `<!doctype html>
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
<p>${IDEA}</p>
<figure id="fig">
${figureSvg.replace('role="img">', 'role="img" aria-label="' + IDEA + '">')}
<figcaption>${CAPTION}</figcaption>
<div class="controls"><button type="button" id="play" aria-pressed="true">Pause motion</button></div>
</figure>
<dl>
<div><dt>Load balancer</dt><dd>Receives every request</dd></div>
<div><dt>Servers</dt><dd>Each one answers the requests sent to it</dd></div>
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
writeFileSync(OUT + 'load-balancer.html', page);

console.log(`lint: ${report.errors.length} errors, ${report.warnings.length} warnings`);
for (const w of report.warnings) console.log(`warning ${w.rule}: ${w.message}`);
console.log(`viewBox: ${model.viewBox.join(' ')}`);
