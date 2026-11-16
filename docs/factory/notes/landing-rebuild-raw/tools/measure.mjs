// usage: node measure.mjs <siteDir> <prefix: before|after> <outJson> [maxSlices] [pages comma list]
import { createRequire } from 'module';
const require = createRequire('/home/user/Skill-Foundry/');
const { chromium } = require('playwright');
import fs from 'fs'; import http from 'http'; import path from 'path';
const [ROOT, PREFIX, OUTJSON, MAXS='3', PAGES='index.html,skills/ux-review/index.html'] = process.argv.slice(2);
const SHOTS='/home/user/Skill-Foundry/docs/factory/notes/landing-rebuild-shots';
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.txt':'text/plain','.zip':'application/zip'};
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';const f=path.join(ROOT,p);fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return}r.writeHead(200,{'content-type':mime[path.extname(f)]||'application/octet-stream'});r.end(d)})}).listen(0);
await new Promise(r=>srv.on('listening',r));const port=srv.address().port;
const b=await chromium.launch();const res={};
for(const pg of PAGES.split(','))for(const theme of ['light','dark'])for(const w of [1440,390]){
  const ctx=await b.newContext({viewport:{width:w,height:w==1440?900:844},deviceScaleFactor:1,colorScheme:theme,hasTouch:w==390});
  await ctx.addInitScript(t=>{try{localStorage.setItem('sf-theme',t)}catch(e){}},theme);
  const page=await ctx.newPage();
  await page.addInitScript(()=>{window.__cls=0;new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.__cls+=e.value}).observe({type:'layout-shift',buffered:true})});
  await page.goto(`http://localhost:${port}/${pg}`,{waitUntil:'load'});await page.waitForTimeout(2500);
  const slug=pg.replace(/\/index\.html|\.html/g,'').replace(/\//g,'_').replace(/^index$/,'landing');
  const m=await page.evaluate(()=>{
    const vh=innerHeight;const de=document.documentElement;
    const vis=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none'&&s.opacity!=='0'};
    const lum=c=>{const a=c.match(/[\d.]+/g).map(Number);const f=v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4};return .2126*f(a[0])+.7152*f(a[1])+.0722*f(a[2])};
    const alpha=c=>{const a=c.match(/[\d.]+/g).map(Number);return a.length>3?a[3]:1};
    const bgOf=e=>{let n=e;while(n){const c=getComputedStyle(n).backgroundColor;if(alpha(c)>0.9)return c;n=n.parentElement}return 'rgb(255,255,255)'};
    const small=[],tap=[],contrast=[],cta=[];
    for(const e of document.querySelectorAll('body *')){
      if(!vis(e))continue;
      if(e.closest('svg')&&e.tagName!=='svg'&&!e.matches('text'))continue;
      const s=getComputedStyle(e);
      const hasText=[...e.childNodes].some(n=>n.nodeType==3&&n.textContent.trim());
      if(hasText){const fs=parseFloat(s.fontSize);
        if(fs<16)small.push({tag:e.tagName,fs,t:e.textContent.trim().slice(0,40),svg:!!e.closest('svg')});
        if(!e.closest('svg')){const fg=s.color;if(alpha(fg)>0.9){const bg=bgOf(e);const l1=lum(fg),l2=lum(bg);const cr=(Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);const large=fs>=24||(fs>=18.66&&parseInt(s.fontWeight)>=700);if(cr<(large?3:4.5))contrast.push({t:e.textContent.trim().slice(0,40),cr:+cr.toFixed(2),fs})}}}
      if(e.matches('a,button,input,select,textarea,summary')){const r=e.getBoundingClientRect();
        if(r.width<44||r.height<44)tap.push({tag:e.tagName,w:Math.round(r.width),h:Math.round(r.height),t:(e.textContent||e.getAttribute('aria-label')||'').trim().slice(0,30)});
        if(r.top<vh&&r.bottom>0&&r.width>0&&e.matches('a,button,summary,input'))cta.push((e.textContent||e.getAttribute('aria-label')||'').trim().replace(/\s+/g,' ').slice(0,30));}
    }
    const h1=document.querySelector('h1');
    const sec={};for(const h of document.querySelectorAll('main h2[id]'))sec[h.id]=Math.round(h.getBoundingClientRect().top+scrollY);
    return {docH:de.scrollHeight,screens:+(de.scrollHeight/vh).toFixed(1),hScroll:de.scrollWidth>innerWidth+1,h1Top:h1?Math.round(h1.getBoundingClientRect().top):null,
      controlsAboveFold:cta.length,ctaList:cta,primaryBtns:document.querySelectorAll('.btn.primary').length,
      smallText:small.filter(x=>!x.svg).length,smallSvgText:small.filter(x=>x.svg).length,smallSizes:[...new Set(small.filter(x=>!x.svg).map(x=>x.fs))].sort(),
      tapUnder44:tap.length,tapEx:tap.slice(0,6),contrastFails:contrast.length,contrastEx:contrast.slice(0,5),sections:sec};
  });
  m.cls=+(await page.evaluate(()=>window.__cls)).toFixed(4);
  res[`${slug}-${theme}-${w}`]=m;
  const H=m.docH;const n=Math.min(Math.ceil(H/2400),+MAXS);
  for(let i=0;i<n;i++)await page.screenshot({path:`${SHOTS}/${PREFIX}-${slug}-${theme}-${w}-${i+1}.png`,clip:{x:0,y:i*2400,width:w,height:Math.min(2400,H-i*2400)},fullPage:true});
  await ctx.close();console.error('done',slug,theme,w,H);
}
fs.writeFileSync(OUTJSON,JSON.stringify(res,null,1));
await b.close();srv.close();
