/**
 * Builds the static showcase site from the skill registry and skill folders, and checks it.
 * CLI: node src/site/build.mjs [--out dir] [--check]
 * @governed-by PO_ARCHITECT
 */
import { readFile, writeFile, mkdir, rm, readdir, copyFile, mkdtemp } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { join, resolve, dirname, relative, sep, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import vm from 'node:vm';
import { packAll } from '../factory/pack.mjs';
import { loadSkills, loadRecipeProofs } from './lib/content.mjs';
import { DICTS } from './lib/i18n.mjs';
import { renderIndex, renderSkillPage, zipName, installOneLiner } from './lib/render.mjs';

const HERE = fileURLToPath(import.meta.url);
const REPO_ROOT = resolve(dirname(HERE), '..', '..');
const ASSETS = join(dirname(HERE), 'assets');
const sha = (buf) => createHash('sha256').update(buf).digest('hex');
const toPosix = (p) => p.split(sep).join('/');

async function listAll(dir, base = dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await listAll(p, base)));
    else if (e.isFile()) out.push(toPosix(relative(base, p)));
  }
  return out.sort();
}

/**
 * @param {{root?:string, out?:string}} [opts]
 * @returns {Promise<{pages:string[], skills:number, downloads:string[]}>}
 */
export async function buildSite({ root = REPO_ROOT, out = join(REPO_ROOT, 'dist', 'site') } = {}) {
  if (typeof root !== 'string' || !root) throw new TypeError('buildSite: root must be a non-empty string');
  if (typeof out !== 'string' || !out) throw new TypeError('buildSite: out must be a non-empty string');
  root = resolve(root);
  out = resolve(out);
  const skillsRoot = join(root, 'src', 'skills');
  const registry = JSON.parse(await readFile(join(root, 'src', 'factory', 'registry.json'), 'utf8'));
  const skills = loadSkills(root);
  const drafts = registry.filter((r) => r && r.status !== 'ready').map((r) => r.name);

  for (const p of ['index.html', 'skills', 'assets', 'downloads', 'skills.json', 'llms.txt']) await rm(join(out, p), { recursive: true, force: true });
  await mkdir(join(out, 'assets'), { recursive: true });

  const checksums = await packAll({ skillsRoot, outDir: join(out, 'downloads') });
  const downloads = (await listAll(join(out, 'downloads'))).map((f) => `downloads/${f}`);

  const css = await readFile(join(ASSETS, 'site.css'), 'utf8');
  const jsSrc = await readFile(join(ASSETS, 'site.js'), 'utf8');
  const marker = /\/\*__DICTS__\*\/\s*\{ en: \{\}, kh: \{\} \}/;
  if (!marker.test(jsSrc)) throw new Error('buildSite: DICTS placeholder missing in site.js');
  const js = jsSrc.replace(marker, () => JSON.stringify(DICTS).replace(/</g, '\\u003c'));
  await writeFile(join(out, 'assets', 'site.css'), css);
  await writeFile(join(out, 'assets', 'site.js'), js);

  for (const s of skills) {
    if (checksums[zipName(s)]) continue;
    // pack.mjs names zips by the SKILL.md version; use that file if the registry version differs.
    const alt = Object.keys(checksums).filter((k) => k.startsWith(`${s.name}-`) && /^\d/.test(k.slice(s.name.length + 1))).sort();
    if (alt.length !== 1) throw new Error(`buildSite: no zip for ${s.name}`);
    s.zip = alt[0];
  }
  for (const s of skills) s.zipBytes = checksums[zipName(s)].bytes;
  const pages = ['index.html'];
  await writeFile(join(out, 'index.html'), renderIndex(skills, { drafts, allBytes: checksums['all-skills.zip']?.bytes, checksums, recipes: loadRecipeProofs(root) }));
  for (const s of skills) {
    const dl = checksums[zipName(s)];
    const dir = join(out, 'skills', s.name);
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, 'index.html'), renderSkillPage(s, { download: dl }));
    pages.push(`skills/${s.name}/index.html`);
    if (s.example) await copyFile(s.exampleSrc, join(dir, 'example.html'));
  }
  await writeFile(join(out, 'skills.json'), JSON.stringify(agentIndex(skills, checksums), null, 2) + '\n');
  await writeFile(join(out, 'llms.txt'), llmsTxt(skills, checksums));
  return { pages, skills: skills.length, downloads };
}

/** Machine index for agents: every ready skill with what an agent needs to choose, fetch and verify it. Paths are relative to the site root. */
export function agentIndex(skills, checksums) {
  return {
    name: 'Skill Foundry',
    install: 'Replace {base} in installCommand with the URL of the folder this file was fetched from (ending in /), run it in the project root, then restart the agent. The command stops if the SHA-256 does not match.',
    skills: skills.map((s) => ({
      name: s.name,
      title: s.title,
      version: s.version,
      description: s.description,
      roles: s.roles,
      tags: s.tags,
      prompt: s.prompt,
      outputs: s.outputs,
      page: `skills/${s.name}/index.html`,
      zip: `downloads/${zipName(s)}`,
      sha256: checksums[zipName(s)].sha256,
      bytes: checksums[zipName(s)].bytes,
      installCommand: installOneLiner(s, checksums[zipName(s)].sha256, `{base}downloads/${zipName(s)}`),
      liveEvals: s.live ? { passed: s.live.passed, total: s.live.total } : null,
    })),
  };
}

/** Plain-text index (llms.txt convention): one block per ready skill. */
export function llmsTxt(skills, checksums) {
  const lines = ['# Skill Foundry', '', '> Reusable AI agent skills. Each is a folder to unzip into .claude/skills/. Paths are relative to this file. In each install command, replace {base} with the URL of the folder this file came from (ending in /) and run it in the project root; it stops if the SHA-256 does not match.', '', '## Skills', ''];
  for (const s of skills) {
    lines.push(`- [${s.name} ${s.version}](skills/${s.name}/index.html): ${s.description}`);
    lines.push(`  install: ${installOneLiner(s, checksums[zipName(s)].sha256, `{base}downloads/${zipName(s)}`)}`);
    lines.push(`  roles: ${s.roles.join(', ') || '-'}; zip: downloads/${zipName(s)}; sha256: ${checksums[zipName(s)].sha256}; real-agent evals: ${s.live ? `${s.live.passed}/${s.live.total}` : 'not yet'}`);
  }
  lines.push('', '## Machine index', '', '- [skills.json](skills.json)', '');
  return lines.join('\n');
}

/** Removes the three allowed token blocks from css. */
export function stripTokenBlocks(css) {
  let s = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const heads = [
    /@media\s*\(prefers-color-scheme:\s*dark\)\s*\{\s*:root:not\(\[data-theme=light\]\)\s*\{[^{}]*\}\s*\}/g,
    /\[data-theme=dark\]\s*\{[^{}]*\}/g,
    /(^|\})\s*:root\s*\{[^{}]*\}/g,
  ];
  for (const re of heads) s = s.replace(re, (m, p1) => (typeof p1 === 'string' ? p1 : ''));
  return s;
}

/**
 * @param {string} out built site folder
 * @param {{root?:string}} [opts] optional repo root to cross-check the registry
 * @returns {Promise<{ok:boolean, problems:string[]}>}
 */
export async function checkSite(out, opts = {}) {
  if (typeof out !== 'string' || !out) throw new TypeError('checkSite: out must be a non-empty string');
  out = resolve(out);
  const problems = [];
  const files = await listAll(out);
  const fileSet = new Set(files);
  const html = files.filter((f) => f.endsWith('.html') && !f.endsWith('/example.html'));

  // manifest: ready vs draft
  let ready = [];
  let drafts = [];
  if (!fileSet.has('index.html')) problems.push('missing index.html');
  else {
    const m = /<script type="application\/json" id="sf-manifest">([\s\S]*?)<\/script>/.exec(await readFile(join(out, 'index.html'), 'utf8'));
    if (!m) problems.push('index.html: missing sf-manifest');
    else ({ ready, drafts } = JSON.parse(m[1]));
  }
  if (opts.root) {
    const reg = JSON.parse(readFileSync(join(resolve(opts.root), 'src', 'factory', 'registry.json'), 'utf8'));
    const r = reg.filter((x) => x.status === 'ready').map((x) => x.name).sort();
    if (JSON.stringify(r) !== JSON.stringify([...ready].sort())) problems.push('manifest ready list differs from registry');
    drafts = [...new Set([...drafts, ...reg.filter((x) => x.status !== 'ready').map((x) => x.name)])];
  }
  for (const n of ready) if (!fileSet.has(`skills/${n}/index.html`)) problems.push(`ready skill ${n} has no page`);
  for (const n of drafts) if (files.some((f) => f.startsWith(`skills/${n}/`))) problems.push(`draft skill ${n} has a page`);
  const pageDirs = new Set(files.filter((f) => f.startsWith('skills/')).map((f) => f.split('/')[1]));
  for (const d of pageDirs) if (!ready.includes(d)) problems.push(`skills/${d}/ is not a ready skill`);

  let checksums = {};
  try { checksums = JSON.parse(await readFile(join(out, 'downloads', 'checksums.json'), 'utf8')); }
  catch { problems.push('missing or invalid downloads/checksums.json'); }

  for (const page of html) {
    const text = await readFile(join(out, page), 'utf8');
    const base = posix.dirname(page);
    for (const m of text.matchAll(/<script\b[^>]*\ssrc="([^"]*)"/gi)) {
      if (/^(?:[a-z]+:)?\/\//i.test(m[1])) problems.push(`${page}: external script ${m[1]}`);
    }
    for (const m of text.matchAll(/\s(href|src)="([^"]*)"/g)) {
      const url = m[2].replace(/&amp;/g, '&');
      if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(url) || url.startsWith('#')) continue;
      let p = url.split(/[?#]/)[0];
      if (p === '') continue;
      if (p.endsWith('/')) p += 'index.html';
      const target = posix.normalize(posix.join(base, p));
      if (target.startsWith('..') || !fileSet.has(target)) problems.push(`${page}: broken link ${m[2]}`);
    }
    for (const m of text.matchAll(/<iframe\b[^>]*>/gi)) {
      const sb = /\ssandbox="([^"]*)"/.exec(m[0]);
      if (!sb || !sb[1].split(/\s+/).includes('allow-scripts') || /allow-same-origin/.test(sb[1])) problems.push(`${page}: iframe sandbox must be allow-scripts without allow-same-origin`);
    }
    if (page.startsWith('skills/')) {
      const shaM = /data-sha256="([0-9a-f]{64})"/.exec(text);
      const linkM = /href="[^"]*downloads\/([^"/]+\.zip)"/.exec(text);
      if (!shaM || !linkM) { problems.push(`${page}: missing data-sha256 or download link`); continue; }
      const file = linkM[1];
      if (!checksums[file] || checksums[file].sha256 !== shaM[1]) problems.push(`${page}: sha256 differs from checksums.json for ${file}`);
      if (!fileSet.has(`downloads/${file}`)) problems.push(`${page}: download ${file} missing`);
      else if (sha(await readFile(join(out, 'downloads', file))) !== shaM[1]) problems.push(`${page}: sha256 differs from actual ${file}`);
    }
  }

  if (fileSet.has('assets/site.css')) {
    const rest = stripTokenBlocks(await readFile(join(out, 'assets', 'site.css'), 'utf8'));
    const bad = rest.match(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/g);
    if (bad) problems.push(`site.css: raw colour outside token blocks: ${[...new Set(bad)].join(', ')}`);
  } else problems.push('missing assets/site.css');
  if (!fileSet.has('assets/site.js')) problems.push('missing assets/site.js');
  else {
    const filename = join(out, 'assets', 'site.js');
    try { new vm.Script(await readFile(filename, 'utf8'), { filename }); }
    catch (e) { problems.push(`site.js syntax error: ${e && e.message}`); }
  }

  const ek = Object.keys(DICTS.en).sort();
  const kk = Object.keys(DICTS.kh).sort();
  if (JSON.stringify(ek) !== JSON.stringify(kk)) problems.push('DICTS en and kh keys differ');
  for (const l of ['en', 'kh']) for (const [k, v] of Object.entries(DICTS[l])) {
    if (typeof v !== 'string' || !v.trim()) problems.push(`DICTS.${l}.${k} is empty`);
  }
  return { ok: problems.length === 0, problems };
}

async function sameTree(a, b) {
  const fa = await listAll(a);
  const fb = await listAll(b);
  const diffs = [];
  if (JSON.stringify(fa) !== JSON.stringify(fb)) diffs.push('file lists differ between builds');
  for (const f of fa) {
    if (!fb.includes(f)) continue;
    const [x, y] = [await readFile(join(a, f)), await readFile(join(b, f))];
    if (!x.equals(y)) diffs.push(`not deterministic: ${f}`);
  }
  return diffs;
}

if (process.argv[1] && resolve(process.argv[1]) === HERE) {
  const args = process.argv.slice(2);
  const oi = args.indexOf('--out');
  try {
    if (args.includes('--check')) {
      const tmp = await mkdtemp(join(tmpdir(), 'sf-site-'));
      const a = join(tmp, 'a');
      const b = join(tmp, 'b');
      await buildSite({ root: REPO_ROOT, out: a });
      await buildSite({ root: REPO_ROOT, out: b });
      const res = await checkSite(a, { root: REPO_ROOT });
      const problems = [...res.problems, ...(await sameTree(a, b))];
      await rm(tmp, { recursive: true, force: true });
      if (problems.length) {
        for (const p of problems) console.error(p);
        process.exitCode = 1;
      } else console.log('site check: ok');
    } else {
      const out = oi >= 0 && args[oi + 1] ? resolve(args[oi + 1]) : join(REPO_ROOT, 'dist', 'site');
      const r = await buildSite({ root: REPO_ROOT, out });
      console.log(`built ${r.pages.length} pages, ${r.skills} skills, ${r.downloads.length} downloads into ${out}`);
    }
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
  }
}

