import { createRequire } from 'module';
const require = createRequire('/home/user/Skill-Foundry/');
const { chromium } = require('playwright');
import fs from 'fs'; import http from 'http'; import path from 'path';
const ROOT='/home/user/Skill-Foundry/dist/site', OUT=process.argv[2];
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.txt':'text/plain','.zip':'application/zip'};
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';const f=path.join(ROOT,p);fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return}r.writeHead(200,{'content-type':mime[path.extname(f)]||'application/octet-stream'});r.end(d)})}).listen(0);
await new Promise(r=>srv.on('listening',r));const port=srv.address().port;
const pages=['index.html',...fs.readdirSync(ROOT+'/skills').map(s=>`skills/${s}/index.html`),'skills/figure-craft/example.html'];
const b=await chromium.launch();const res={};
for(const pg of pages)for(const theme of ['light','dark'])for(const w of [1440,390]){
  const ctx=await b.newContext({viewport:{width:w,height:w==1440?900:844},deviceScaleFactor:1,colorScheme:theme,hasTouch:w==390});
  await ctx.addInitScript(t=>{try{localStorage.setItem('sf-theme',t)}catch(e){}},theme);
  const page=await ctx.newPage();
  await page.addInitScript(()=>{window.__cls=0;new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.__cls+=e.value}).observe({type:'layout-shift',buffered:true})});
  await page.goto(`http://localhost:${port}/${pg}`,{waitUntil:'load'});await page.waitForTimeout(1500);
  const slug=pg.replace(/\/index\.html|\.html/g,'').replace(/\//g,'_').replace(/^index$/,'landing');
  const tag=`${slug}-${theme}-${w}`;
  const m=await page.evaluate((w)=>{
    const vh=innerHeight;const de=document.documentElement;
    const vis=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none'&&s.opacity!=='0'};
    const lum=c=>{const a=c.match(/[\d.]+/g).map(Number);const f=v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4};return .2126*f(a[0])+.7152*f(a[1])+.0722*f(a[2])};
    const alpha=c=>{const a=c.match(/[\d.]+/g).map(Number);return a.length>3?a[3]:1};
    const bgOf=e=>{let n=e;while(n){const c=getComputedStyle(n).backgroundColor;if(alpha(c)>0.9)return c;n=n.parentElement}return 'rgb(255,255,255)'};
    const small=[],tap=[],contrast=[];const seenT=new Set();
    const cta=[];
    for(const e of document.querySelectorAll('body *')){
      if(!vis(e))continue;
      const s=getComputedStyle(e);
      const hasText=[...e.childNodes].some(n=>n.nodeType==3&&n.textContent.trim());
      if(hasText){const fs=parseFloat(s.fontSize);
        if(fs<16){small.push({tag:e.tagName,fs,t:e.textContent.trim().slice(0,40)})}
        const fg=s.color;if(alpha(fg)>0.9){const bg=bgOf(e);const l1=lum(fg),l2=lum(bg);const cr=(Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);const large=fs>=24||(fs>=18.66&&parseInt(s.fontWeight)>=700);if(cr<(large?3:4.5))contrast.push({t:e.textContent.trim().slice(0,40),cr:+cr.toFixed(2),fs,fg,bg})}}
      if(e.matches('a,button,input,select,textarea,[role=button],summary')){const r=e.getBoundingClientRect();
        if(r.width<44||r.height<44){tap.push({tag:e.tagName,w:Math.round(r.width),h:Math.round(r.height),t:(e.textContent||e.getAttribute('aria-label')||'').trim().slice(0,30)})}
        const r2=e.getBoundingClientRect();if(r2.top<vh&&r2.bottom>0&&e.matches('a,button,summary')&&r2.width>0)cta.push({tag:e.tagName,t:(e.textContent||e.getAttribute('aria-label')||'').trim().replace(/\s+/g,' ').slice(0,50),y:Math.round(r2.top),w:Math.round(r2.width),h:Math.round(r2.height),prim:/btn|primary|button|cta/i.test(e.className)||e.tagName=='BUTTON'})}
    }
    // above-fold largest elements
    const big=[...document.querySelectorAll('body *')].filter(vis).map(e=>{const r=e.getBoundingClientRect();return{tag:e.tagName,cls:(e.className&&e.className.baseVal===undefined?e.className:'').toString().slice(0,30),t:(e.textContent||'').trim().replace(/\s+/g,' ').slice(0,50),top:Math.round(r.top),area:Math.round(Math.max(0,Math.min(r.bottom,vh)-Math.max(r.top,0))*Math.max(0,Math.min(r.right,innerWidth)-Math.max(r.left,0))),fs:parseFloat(getComputedStyle(e).fontSize)}}).filter(x=>x.area>0&&x.t).sort((a,b)=>b.fs-a.fs).slice(0,6);
    const h1=document.querySelector('h1');
    return {docH:de.scrollHeight,docW:de.scrollWidth,innerW:innerWidth,hScroll:de.scrollWidth>innerWidth+1,vhScreens:+(de.scrollHeight/vh).toFixed(1),h1:h1?{t:h1.textContent.trim().slice(0,60),fs:parseFloat(getComputedStyle(h1).fontSize),top:Math.round(h1.getBoundingClientRect().top)}:null,
      small:small.length,smallEx:small.slice(0,8),smallSizes:[...new Set(small.map(x=>x.fs))],tap:tap.length,tapEx:tap.slice(0,10),contrast:contrast.length,contrastEx:contrast.slice(0,8),ctaAboveFold:cta,biggestText:big};
  },w);
  m.cls=+(await page.evaluate(()=>window.__cls)).toFixed(4);
  res[tag]=m;
  // screenshots: full page in <=2400 slices
  const H=m.docH;const n=Math.ceil(H/2400);
  const maxSlices=(theme==='light'||w===390)?n:1; // dark: keep first slice only unless 390
  for(let i=0;i<Math.min(n,6);i++){await page.screenshot({path:`${OUT}/${tag}-${i+1}.png`,clip:{x:0,y:i*2400,width:w,height:Math.min(2400,H-i*2400)},fullPage:true})}
  await ctx.close();console.error('done',tag,H);
}
fs.writeFileSync(`${OUT}/../measure/measure.json`,JSON.stringify(res,null,1));
await b.close();srv.close();
