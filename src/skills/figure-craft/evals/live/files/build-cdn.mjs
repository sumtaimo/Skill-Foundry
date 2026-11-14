import { writeFileSync } from 'node:fs';
const E='/home/user/Skill-Foundry/src/skills/figure-craft/engine/';
const { box, dot, renderSvg } = await import(E+'iso.mjs');
const { tokensCss } = await import(E+'tokens.mjs');
const { lint } = await import(E+'lint.mjs');
const shapes = [
  box({ at:[0,0,0], size:[170,60,4], r:4, id:'ground' }),
  box({ at:[8,22,4], size:[18,18,16], id:'client', rests:'ground' }),
  box({ at:[30,26,4], size:[8,8,8], id:'request', rests:'ground', anim:'travel', move:[28,0,0] }),
  box({ at:[66,14,4], size:[32,32,36], tone:'ink', id:'edge', rests:'ground' }),
  box({ at:[136,14,4], size:[24,32,52], id:'origin', rests:'ground' }),
  dot([82,30,40], { face:'top', on:'edge', tone:'ok', id:'hit' }),
];
const labels = [
  { at:[17,31,20], text:'Client', side:'l' },
  { at:[34,30,12], text:'Request', side:'l' },
  { at:[82,30,48], text:'Edge cache', side:'r' },
  { at:[148,30,56], text:'Origin (skipped)', side:'r' },
];
const { svg, model } = renderSvg(shapes, { labels, fontSize:20, title:'A request travels from the client to the edge cache, which answers from its copy without asking the origin.' });
const res = lint(model);
console.log(JSON.stringify(res));
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>CDN Edge Cache</title>
<style>${tokensCss()}*{box-sizing:border-box}html,body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.5 system-ui,sans-serif}
main{max-width:720px;margin:0 auto;padding:24px 16px 48px}header{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
h1{font-size:1.5rem;margin:0}.kicker{color:var(--muted);font-size:.85rem;margin:0 0 4px}
button{font:inherit;font-size:.9rem;color:var(--fg);background:var(--surface);border:1px solid var(--line-strong);border-radius:8px;padding:6px 12px;cursor:pointer}
button:focus-visible{outline:2px solid var(--ok);outline-offset:2px}
figure{margin:24px 0;padding:16px;background:var(--surface);border:1px solid var(--line);border-radius:12px}
figure svg{display:block;width:100%;max-width:560px;height:auto;margin:0 auto}figcaption{color:var(--muted);font-size:.9rem;margin-top:8px}
.controls{display:flex;gap:8px;margin-top:12px}.paused svg *{animation-play-state:paused!important}
dl{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin:0}dl div{background:var(--surface2);border-radius:10px;padding:12px}
dt{color:var(--muted);font-size:.8rem}dd{margin:0;font-weight:600}@media (max-width:480px){figure{padding:8px}}</style></head><body><main>
<header><div><p class="kicker">FIGURE</p><h1>How a CDN edge cache serves a request</h1></div><button type="button" id="theme" aria-pressed="false">Dark theme</button></header>
<p>The edge cache sits close to the reader. When it already holds a copy, it answers at once. The origin is not asked.</p>
<figure id="fig">${svg}<figcaption>The request moves along one axis to the edge cache. The green light means a cache hit.</figcaption>
<div class="controls"><button type="button" id="play" aria-pressed="true">Pause motion</button></div></figure>
<dl><div><dt>Client</dt><dd>Sends the request</dd></div><div><dt>Edge cache</dt><dd>Holds a nearby copy</dd></div><div><dt>Origin</dt><dd>Only asked on a miss</dd></div></dl>
</main><script>(function(){var r=document.documentElement,tb=document.getElementById('theme'),pb=document.getElementById('play'),f=document.getElementById('fig'),mq=matchMedia('(prefers-color-scheme: dark)');
function d(){var t=r.getAttribute('data-theme');return t?t==='dark':mq.matches}function s(){var x=d();tb.textContent=x?'Light theme':'Dark theme';tb.setAttribute('aria-pressed',String(x))}
tb.onclick=function(){r.setAttribute('data-theme',d()?'light':'dark');s()};if(mq.addEventListener)mq.addEventListener('change',s);
if(matchMedia('(prefers-reduced-motion: reduce)').matches)pb.hidden=true;
pb.onclick=function(){var p=f.classList.toggle('paused');pb.textContent=p?'Play motion':'Pause motion';pb.setAttribute('aria-pressed',String(!p))};s()})();</script></body></html>`;
writeFileSync(new URL('./cdn-edge-cache.html', import.meta.url), html);
