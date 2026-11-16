// usage: node prep.mjs <builtSiteDir> <outDir>  — page HTML (large svg/script removed), site.css, and the visible UI strings
import fs from 'fs';
import { DICTS } from '/home/user/Skill-Foundry/src/site/lib/i18n.mjs';
const [R, O] = process.argv.slice(2);
const css = fs.readFileSync(R + '/assets/site.css', 'utf8');
const strip = (h) => h.replace(/<svg[\s\S]*?<\/svg>/g, (m) => (m.length > 400 ? '<svg><!-- illustration svg removed for size --></svg>' : m)).replace(/<script[\s\S]*?<\/script>/g, '<script><!-- see site.js --></script>');
const pages = { landing: 'index.html', 'skill-ux-review': 'skills/ux-review/index.html' };
for (const [k, p] of Object.entries(pages)) {
  fs.mkdirSync(`${O}/${k}`, { recursive: true });
  const raw = fs.readFileSync(`${R}/${p}`, 'utf8');
  fs.writeFileSync(`${O}/${k}/page.html`, strip(raw));
  fs.writeFileSync(`${O}/${k}/site.css`, css);
  const keys = [...new Set([...raw.matchAll(/data-i18n="([^"]+)"/g)].map((m) => m[1]))];
  fs.writeFileSync(`${O}/${k}/strings.txt`, keys.map((key) => `${key}\t${DICTS.en[key]}`).join('\n') + '\n');
  console.log(k, strip(raw).length, keys.length, 'strings');
}
