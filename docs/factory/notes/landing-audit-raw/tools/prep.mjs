import fs from 'fs';
const R='/home/user/Skill-Foundry/dist/site', O=process.argv[2];
const css=fs.readFileSync(R+'/assets/site.css','utf8');
const strip=h=>h.replace(/<svg[\s\S]*?<\/svg>/g,m=>m.length>400?'<svg><!-- decorative/illustration svg removed for size: '+m.length+' bytes --></svg>':m)
 .replace(/<script[\s\S]*?<\/script>/g,'<script><!-- see site.js --></script>')
 .replace(/data:[a-z/+]+;base64,[A-Za-z0-9+/=]{200,}/g,'data:...removed');
const pages={landing:'index.html'};
for(const s of fs.readdirSync(R+'/skills'))pages['skill-'+s]=`skills/${s}/index.html`;
for(const [k,p] of Object.entries(pages)){
  fs.mkdirSync(`${O}/${k}`,{recursive:true});
  const h=strip(fs.readFileSync(`${R}/${p}`,'utf8'));
  fs.writeFileSync(`${O}/${k}/page.html`,h);
  fs.writeFileSync(`${O}/${k}/site.css`,css);
  console.log(k,h.length);
}
