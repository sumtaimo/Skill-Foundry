import { writeFileSync } from 'node:fs';
const E='/home/user/Skill-Foundry/src/skills/figure-craft/engine/';
const { box, renderSvg } = await import(E+'iso.mjs');
const { tokensCss } = await import(E+'tokens.mjs');
const { lint } = await import(E+'lint.mjs');
const D=process.argv[2];
const shapes=[
 box({at:[0,0,0],size:[110,150,4],r:4,id:'ground'}),
 box({at:[8,8,4],size:[24,24,40],id:'server-a'}),
 box({at:[43,8,4],size:[24,24,40],id:'server-b'}),
 box({at:[78,8,4],size:[24,24,40],id:'server-c'}),
 box({at:[51,88,4],size:[8,8,8],id:'request',rests:'ground',move:[0,-52,0]}),
 box({at:[40,100,4],size:[30,28,20],tone:'ink',id:'balancer'}),
];
for (const s of shapes.slice(1)) s.rests ??= 'ground';
const labels=[
 {at:[8,20,40],text:'Server 1',side:'l'},
 {at:[55,8,44],text:'Server 2',side:'r'},
 {at:[90,8,44],text:'Server 3',side:'r'},
 {at:[51,92,8],text:'Request',side:'l'},
 {at:[40,114,14],text:'Load balancer',side:'l'},
];
const { svg, model } = renderSvg(shapes,{labels,fontSize:16,title:'A load balancer passes each request to one of three servers.'});
const res=lint(model); console.log(JSON.stringify(res), model.viewBox);
writeFileSync(D+'/load-balancer.svg',svg);
writeFileSync(D+'/load-balancer.html',`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Load balancer</title><style>${tokensCss()}*{box-sizing:border-box}html,body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.5 system-ui,sans-serif}main{max-width:720px;margin:0 auto;padding:24px 16px}figure{margin:16px 0;padding:16px;background:var(--surface);border:1px solid var(--line);border-radius:12px}figure svg{display:block;width:100%;max-width:560px;height:auto;margin:0 auto}figcaption{color:var(--muted);font-size:.9rem}</style></head><body><main><h1>How a load balancer spreads requests</h1><p>A load balancer stands in front of the servers. It passes each request to one of them.</p><figure>${svg}<figcaption>The request moves from the load balancer to Server 2. Next time it may go to another server.</figcaption></figure></main></body></html>`);
