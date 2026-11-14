/**
 * Pure HTML renderers for the showcase site. Same input gives identical output.
 * @governed-by PO_ARCHITECT
 */
import { DICTS } from './i18n.mjs';

const EN = DICTS.en;
const FONTS = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap';

/** @param {unknown} s */
export function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/** Fill {name} placeholders. */
function fill(s, args) {
  return String(s).replace(/\{(\w+)\}/g, (m, k) => (args && k in args ? String(args[k]) : m));
}

/** Element whose text comes from DICTS[key]; args fill {placeholders} (site.js repeats this on language switch). */
function t(key, tag = 'span', attrs = '', args = null) {
  if (typeof key !== 'string' || !(key in EN)) throw new Error(`render: unknown i18n key ${key}`);
  const a = args ? ` data-i18n-args="${esc(JSON.stringify(args))}"` : '';
  return `<${tag} data-i18n="${esc(key)}"${a}${attrs ? ' ' + attrs : ''}>${esc(fill(EN[key], args))}</${tag}>`;
}

function need(obj, name) {
  if (!obj || typeof obj !== 'object') throw new TypeError(`${name}: object required`);
}

const pad = (n) => String(n).padStart(2, '0');

/** @param {number} bytes */
export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) throw new TypeError('formatBytes: bytes must be >= 0');
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/** Zip file name; build may set skill.zip to the file packAll actually wrote. */
export const zipName = (s) => (typeof s.zip === 'string' && s.zip ? s.zip : `${s.name}-${s.version}.zip`);
export const installCommand = (s) => `unzip ${zipName(s)} -d .claude/skills/`;

/**
 * One-line install: download, verify SHA-256, unzip into .claude/skills/. Works with curl, shasum and unzip
 * on macOS and Linux. url is the absolute zip URL; site.js fills it from the page address.
 */
export function installOneLiner(s, sha256, url) {
  const z = zipName(s);
  return `mkdir -p .claude/skills && curl -fsSL "${url}" -o "${z}" && echo "${sha256}  ${z}" | shasum -a 256 -c - && unzip -oq "${z}" -d .claude/skills && rm "${z}"`;
}

/** Copy button for the install command; site.js upgrades data-copy to the one-liner when served over http(s). */
function installButton(skill, sha256, cls = 'btn copy') {
  const zip = `downloads/${zipName(skill)}`;
  return `<button type="button" class="${cls}" data-copy="${esc(installCommand(skill))}" data-install-zip="${esc(zip)}" data-install-name="${esc(zipName(skill))}" data-sha256-install="${esc(sha256 ?? '')}">${t('install.copy')}</button>`;
}

/** Plain-text search haystack for a plate. */
const haystack = (s) => [s.name, s.title, s.tagline, s.description, s.prompt, ...(s.tags || []), ...(s.outputs || [])].join(' ').toLowerCase().replace(/\s+/g, ' ');

function liveLine(skill) {
  const l = skill.live;
  return l && l.total > 0
    ? t('live.yes', 'p', `class="live live-yes" data-live="${l.passed}/${l.total}"`, { p: l.passed, t: l.total })
    : t('live.no', 'p', 'class="live live-no" data-live="none"');
}

function rolesList(skill) {
  if (!skill.roles || !skill.roles.length) return '';
  return `<p class="roles">${t('plate.roles')} ${skill.roles.map((r) => t(`role.${r}`, 'span', `class="role" data-role="${esc(r)}"`)).join(' ')}</p>`;
}

const SKIP_PART = /^<(defs|title|desc|style)\b/i;

/**
 * Wraps each top-level element inside the svg root in <g class="hero-part">, numbered for staggered delays.
 * @param {string} svg sanitized svg markup
 */
export function heroParts(svg) {
  if (typeof svg !== 'string') throw new TypeError('heroParts: svg string required');
  const open = /^<svg\b[^>]*>/i.exec(svg);
  const close = svg.lastIndexOf('</svg>');
  if (!open || close < open[0].length) return svg;
  const inner = svg.slice(open[0].length, close);
  const parts = [];
  let depth = 0;
  let start = -1;
  const re = /<(\/?)([a-zA-Z][\w:-]*)\b[^>]*?(\/?)>/g;
  let m;
  while ((m = re.exec(inner))) {
    if (m[1]) {
      depth--;
      if (depth === 0) { parts.push(inner.slice(start, re.lastIndex)); start = -1; }
    } else if (m[3]) {
      if (depth === 0) parts.push(m[0]);
    } else {
      if (depth === 0) start = m.index;
      depth++;
    }
  }
  if (depth !== 0) return svg;
  let i = 0;
  const body = parts
    .map((p) => (SKIP_PART.test(p) ? p : `<g class="hero-part axis-${i % 3}" style="--i:${i++}">${p}</g>`))
    .join('');
  return `${open[0]}${body}</svg>`;
}

function coverSvg(skill) {
  const label = `${skill.title} cover`;
  return skill.coverSvg.replace(/^<svg\b([^>]*)>/i, (m, attrs) => {
    const a = attrs.replace(/\s(role|aria-label|width|height)\s*=\s*("[^"]*"|'[^']*')/gi, '');
    return `<svg${a} role="img" aria-label="${esc(label)}" focusable="false">`;
  });
}

function cover(skill, cls) {
  return `<div class="${cls}">${coverSvg(skill)}</div>`;
}

function copyButton(text, key = 'copy.copy') {
  return `<button type="button" class="btn copy" data-copy="${esc(text)}">${t(key)}</button>`;
}

/** @param {{rules:{machine:number,total:number}}} skill */
export function renderMeter(skill) {
  need(skill, 'renderMeter');
  const r = skill.rules ?? { machine: 0, total: 0 };
  const m = Number(r.machine) || 0;
  const tot = Number(r.total) || 0;
  const pct = tot > 0 ? Math.round((m / tot) * 100) : 0;
  return `<div class="meter" data-machine="${m}" data-total="${tot}">
<div class="meter-bar" aria-hidden="true"><span class="meter-fill" style="width:${pct}%"></span></div>
${t('meter.text', 'p', 'class="meter-text"', { m, t: tot })}
</div>`;
}

function downloadButton(skill, up, cls = 'btn primary') {
  const size = formatBytes(Number(skill.zipBytes) || 0);
  return `<a class="${cls}" href="${up}downloads/${esc(zipName(skill))}" download data-i18n="download.label" data-i18n-args="${esc(JSON.stringify({ name: skill.name, version: skill.version, size }))}">${esc(fill(EN['download.label'], { name: skill.name, version: skill.version, size }))}</a>`;
}

/**
 * @param {{title:string, depth:number, body:string, description?:string}} o
 */
export function renderLayout(o) {
  need(o, 'renderLayout');
  if (typeof o.title !== 'string' || typeof o.body !== 'string') throw new TypeError('renderLayout: title and body strings required');
  if (!Number.isInteger(o.depth) || o.depth < 0) throw new TypeError('renderLayout: depth must be an integer >= 0');
  const up = '../'.repeat(o.depth);
  const desc = o.description ?? EN['hero.sub'];
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(o.title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${esc(FONTS)}">
<link rel="stylesheet" href="${up}assets/site.css">
<script src="${up}assets/site.js" defer></script>
</head>
<body>
<a class="skip" href="#main">${t('skip')}</a>
<header class="top">
<a class="brand" href="${up}index.html">Skill Foundry</a>
<nav class="tools">
<a href="${up}index.html#collection">${t('nav.collection')}</a>
<a href="${up}index.html#install">${t('nav.install')}</a>
<a href="${up}index.html#agents">${t('nav.agents')}</a>
<a href="${up}index.html#proof">${t('nav.proof')}</a>
<button type="button" class="btn ghost" data-action="theme" aria-pressed="false">${t('theme.toDark')}</button>
<button type="button" class="btn ghost" data-action="lang">${t('lang.toKh')}</button>
</nav>
</header>
<div class="wrap">
<main id="main" tabindex="-1">
${o.body}
</main>
</div>
<footer class="foot">${t('footer', 'p')}</footer>
</body>
</html>
`;
}

/** @param {object} skill @param {{depth?:number, index?:number}} [opts] */
export function renderCard(skill, opts = {}) {
  need(skill, 'renderCard');
  const up = '../'.repeat(opts.depth ?? 0);
  const idx = Number.isInteger(opts.index) ? opts.index : 1;
  const tags = skill.tags.map((x) => `<li>${esc(x)}</li>`).join('');
  return `<article class="plate" data-skill="${esc(skill.name)}" data-roles="${esc((skill.roles || []).join(' '))}" data-text="${esc(haystack(skill))}">
<div class="plate-head"><span class="plate-index">No. ${pad(idx)}</span><ul class="tags" lang="en">${tags}</ul></div>
${cover(skill, 'cover')}
<h3 lang="en"><a href="${up}skills/${esc(skill.name)}/index.html">${esc(skill.title)}</a></h3>
<p class="plate-type">${esc(EN['plate.type'])} <code>${esc(skill.prompt.replace(/\s+/g, ' ').trim())}</code></p>
<p class="plate-get">${esc(EN['plate.get'])} ${esc(skill.outputs.join(', ') || '-')}</p>
${rolesList(skill)}
${liveLine(skill)}
${renderMeter(skill)}
<footer><code class="ver">${esc(skill.version)}</code>${installButton(skill, opts.sha256, 'btn primary copy')}${downloadButton(skill, up, 'btn ghost')}</footer>
</article>`;
}

/** Collection-wide zip link; class and href lead so tests can match it. */
function allLink(bytes) {
  const args = { size: formatBytes(bytes) };
  return `<a class="dl-all" href="downloads/all-skills.zip" download data-i18n="download.allLabel" data-i18n-args="${esc(JSON.stringify(args))}">${esc(fill(EN['download.allLabel'], args))}</a>`;
}

/** Search box, role filter and live count; filtering itself is done by site.js. */
function renderFinder(skills) {
  const used = ['PO_ARCHITECT', 'BA_ANALYST', 'DEV_ENGINEER', 'QA_AUDITOR'].filter((r) => skills.some((s) => (s.roles || []).includes(r)));
  const roles = [`<button type="button" class="rolechip" data-role="" aria-pressed="true">${t('role.all')}</button>`,
    ...used.map((r) => `<button type="button" class="rolechip" data-role="${esc(r)}" aria-pressed="false">${t(`role.${r}`)}</button>`)].join('\n');
  return `<div class="finder">
<label class="find-label" for="find">${esc(EN['find.label'])}</label>
<input id="find" class="find" type="search" autocomplete="off" spellcheck="false" placeholder="${esc(EN['find.placeholder'])}" data-i18n-placeholder="find.placeholder">
<div class="roles-filter" role="group" aria-label="${esc(EN['role.label'])}">
${roles}
</div>
${t('find.count', 'p', 'class="find-count" aria-live="polite"', { n: skills.length, t: skills.length })}
</div>`;
}

function renderHero(skills) {
  if (!skills.length) return `<section class="hero">${t('hero.title', 'h1')}</section>`;
  const finder = renderFinder(skills);
  const first = skills[0];
  const chips = skills
    .map((s, i) => `<button type="button" class="chip" data-skill="${esc(s.name)}" data-prompt="${esc(s.prompt)}" aria-pressed="${i === 0}">${esc(s.title)}</button>`)
    .join('\n');
  const templates = skills.map((s) => `<template data-cover="${esc(s.name)}">${heroParts(coverSvg(s))}</template>`).join('\n');
  return `<section class="hero">
<div class="hero-copy">
${t('hero.title', 'h1')}
${t('hero.sub', 'p', 'class="hero-sub"')}
${finder}
${t('hero.label', 'p', 'class="hero-label"')}
<div class="hero-prompt"><code lang="en" data-full="${esc(first.prompt)}">${esc(first.prompt)}</code></div>
</div>
<div class="hero-figure" data-skill="${esc(first.name)}">${heroParts(coverSvg(first))}</div>
<div class="hero-chips" role="group" aria-label="${esc(EN['hero.chips'])}">
${chips}
</div>
${templates}
</section>`;
}

/**
 * @param {object[]} skills ready skills
 * @param {{drafts?:string[], allBytes?:number}} [opts]
 */
export function renderIndex(skills, opts = {}) {
  if (!Array.isArray(skills)) throw new TypeError('renderIndex: skills array required');
  const manifest = JSON.stringify({ ready: skills.map((s) => s.name), drafts: [...(opts.drafts ?? [])].sort() }).replace(/</g, '\\u003c');
  const sorted = [...skills].sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  const steps = (prefix, count) => Array.from({ length: count }, (_, i) => t(`${prefix}${i + 1}`, 'li')).join('\n');
  const sums = opts.checksums ?? {};
  const layers = Array.from({ length: 7 }, (_, i) => t(`proof.l${i + 1}`, 'li')).join('\n');
  const proofRows = sorted.map((s) => `<tr><th scope="row" lang="en"><a href="skills/${esc(s.name)}/index.html">${esc(s.name)}</a></th><td>${s.live && s.live.total > 0 ? `${s.live.passed} / ${s.live.total}` : t('proof.notyet')}</td><td>${s.rules.machine} / ${s.rules.total}</td></tr>`).join('\n');
  const agentPromptText = fill(EN['agents.prompt'], { site: '{site}' });
  const body = `${renderHero(sorted)}
<section id="collection" class="collection" aria-labelledby="collection-title">
<div class="collection-bar">${t('collection.title', 'h2', 'id="collection-title"')}</div>
<div class="grid">
${sorted.map((s, i) => renderCard(s, { index: i + 1, sha256: sums[zipName(s)]?.sha256 })).join('\n')}
</div>
${t('find.none', 'p', 'class="find-none" hidden')}
</section>
<section id="install" class="col" aria-labelledby="install-title">
${t('install.title', 'h2', 'id="install-title"')}
<ol class="steps">
${steps('install.s', 3)}
</ol>
${t('install.cmd', 'p')}
${Number.isFinite(opts.allBytes) && opts.allBytes > 0 ? `<p>${allLink(opts.allBytes)}</p>` : ''}
<p class="meta"><a href="downloads/checksums.json">${t('download.checksums')}</a></p>
</section>
<section id="agents" class="col" aria-labelledby="agents-title">
${t('agents.title', 'h2', 'id="agents-title"')}
${t('agents.p', 'p')}
<ul class="agent-files">
<li><a href="skills.json">${t('agents.json')}</a></li>
<li><a href="llms.txt">${t('agents.txt')}</a></li>
</ul>
${t('agents.promptLabel', 'h3')}
<div class="codebox"><pre lang="en"><code class="agent-prompt">${esc(agentPromptText)}</code></pre><button type="button" class="btn copy" data-copy="${esc(agentPromptText)}" data-agent-prompt="${esc(EN['agents.prompt'])}">${t('agents.copyPrompt')}</button></div>
</section>
<section id="proof" class="col" aria-labelledby="proof-title">
${t('proof.title', 'h2', 'id="proof-title"')}
${t('proof.p', 'p')}
<ol class="layers">
${layers}
</ol>
<div class="table-wrap"><table class="proof">
<thead><tr>${t('proof.skill', 'th', 'scope="col"')}${t('proof.real', 'th', 'scope="col"')}${t('proof.rules', 'th', 'scope="col"')}</tr></thead>
<tbody>
${proofRows}
</tbody>
</table></div>
</section>
<section class="col" aria-labelledby="made">
${t('made.title', 'h2', 'id="made"')}
<ol class="steps">
${steps('made.s', 5)}
</ol>
</section>
<section class="col" aria-labelledby="limits">
${t('limits.title', 'h2', 'id="limits"')}
${t('limits.p1', 'p')}
${t('limits.p2', 'p')}
${t('limits.p3', 'p')}
</section>
<script type="application/json" id="sf-manifest">${manifest}</script>`;
  return renderLayout({ title: 'Skill Foundry', depth: 0, body });
}

function renderChangelog(md) {
  const out = [];
  let list = false;
  for (const line of md.split('\n')) {
    const h = /^#{2,3}\s+(.*)$/.exec(line);
    const li = /^\s*[-*]\s+(.*)$/.exec(line);
    if (li) {
      if (!list) { out.push('<ul>'); list = true; }
      out.push(`<li>${esc(li[1])}</li>`);
      continue;
    }
    if (list) { out.push('</ul>'); list = false; }
    if (/^#\s/.test(line)) continue;
    if (h) out.push(`<h4>${esc(h[1])}</h4>`);
    else if (line.trim()) out.push(`<p>${esc(line.trim())}</p>`);
  }
  if (list) out.push('</ul>');
  return out.join('\n');
}

/** One sentence ending in punctuation. */
const sentence = (s) => { const x = String(s).trim() || '-'; return /[.!?]$/.test(x) ? x : `${x}.`; };

/** Inline `code` spans in otherwise escaped text. */
const inline = (s) => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>');

const QUESTIONS = [
  { id: 'what-it-does', key: 'q.does' },
  { id: 'what-you-type', key: 'q.type' },
  { id: 'what-you-get', key: 'q.get' },
  { id: 'how-you-know', key: 'q.know' },
];

/**
 * @param {object} skill
 * @param {{download:{sha256:string,bytes:number}}} opts
 */
export function renderSkillPage(skill, opts) {
  need(skill, 'renderSkillPage');
  need(opts, 'renderSkillPage opts');
  const dl = opts.download;
  if (!dl || typeof dl.sha256 !== 'string' || !Number.isFinite(dl.bytes)) throw new TypeError('renderSkillPage: download {sha256, bytes} required');
  const s = { ...skill, zipBytes: Number.isFinite(skill.zipBytes) && skill.zipBytes > 0 ? skill.zipBytes : dl.bytes };
  const tabs = QUESTIONS.map((q, i) => `<a href="#${q.id}"${i === 0 ? ' aria-current="true"' : ''}>${t(q.key)}</a>`).join('\n');
  const take = (inner) => `<p class="takeaway"><strong>${inner}</strong></p>`;
  const parts = [];
  parts.push(`<p class="back"><a href="../../index.html">${t('back')}</a></p>
<header class="skill-head">
${cover(s, 'cover cover-lg')}
<h1 lang="en">${esc(s.title)}</h1>
<p class="meta">${t('version')} <code class="ver">${esc(s.version)}</code></p>
<ul class="tags" lang="en">${s.tags.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
${rolesList(s)}
${liveLine(s)}
<p class="head-actions">${installButton(s, dl.sha256, 'btn primary copy')}</p>
</header>
<nav class="qbar" aria-label="${esc(EN['q.nav'])}">
<div class="qbar-tabs">
${tabs}
</div>
<div class="qbar-progress" aria-hidden="true"></div>
</nav>`);
  parts.push(`<section id="what-it-does" aria-labelledby="h-does">
${take(esc(sentence(s.tagline)))}
${t('q.does', 'h2', 'id="h-does"')}
<ol class="steps" lang="en">
${s.procedure.map((p) => `<li>${inline(p)}</li>`).join('\n')}
</ol>
</section>`);
  parts.push(`<section id="what-you-type" aria-labelledby="h-type">
${take(esc(EN['take.type']))}
${t('q.type', 'h2', 'id="h-type"')}
<div class="codebox"><pre lang="en"><code>${esc(s.prompt)}</code></pre>${copyButton(s.prompt)}</div>
</section>`);
  parts.push(`<section id="what-you-get" aria-labelledby="h-get">
${take(esc(EN['take.get']))}
${t('q.get', 'h2', 'id="h-get"')}
${s.example ? '' : cover(s, 'get-cover')}
<ul class="outputs" lang="en">${s.outputs.map((o) => `<li>${esc(o)}</li>`).join('')}</ul>
${t('skill.files', 'h3')}
<ul class="files" lang="en">${s.files.map((f) => `<li><code>${esc(s.name)}/${esc(f)}</code></li>`).join('')}</ul>
${s.example ? `${t('skill.example', 'h3')}
${t('example.note', 'p')}
<iframe class="example" sandbox="allow-scripts" src="example.html" title="${esc(s.title)} example"></iframe>
${t('example.open', 'a', 'class="example-open" href="example.html"')}` : ''}
</section>`);
  parts.push(`<section id="how-you-know" aria-labelledby="h-know">
${take(esc(EN['take.know']))}
${t('q.know', 'h2', 'id="h-know"')}
${liveLine(s)}
${renderMeter(s)}
<dl class="stats">
<div>${t('rules.total', 'dt')}<dd>${s.rules.total}</dd></div>
<div>${t('rules.machine', 'dt')}<dd>${s.rules.machine}</dd></div>
<div>${t('rules.checklist', 'dt')}<dd>${s.rules.checklist}</dd></div>
</dl>
${s.changelog ? `${t('skill.changelog', 'h3')}
<div class="changelog" lang="en">
${renderChangelog(s.changelog)}
</div>` : ''}
</section>`);
  parts.push(`<section id="download" aria-labelledby="h-download">
${t('skill.download', 'h2', 'id="h-download"')}
<p>${downloadButton(s, '../../')}</p>
<dl class="kv">
<div>${t('download.sha', 'dt')}<dd><code class="sha" data-sha256="${esc(dl.sha256)}">${esc(dl.sha256)}</code></dd></div>
</dl>
<p class="meta"><a href="../../downloads/checksums.json">${t('download.checksums')}</a></p>
</section>`);
  parts.push(`<section id="install" aria-labelledby="h-install">
${t('skill.install', 'h2', 'id="h-install"')}
<ol class="steps">
${t('install.s1', 'li')}
${t('install.s2', 'li')}
${t('install.s3', 'li')}
</ol>
${t('install.cmd', 'p')}
<div class="codebox"><pre><code class="install-cmd">${esc(installCommand(s))}</code></pre>${installButton(s, dl.sha256)}</div>
</section>`);
  return renderLayout({
    title: `${s.title} | Skill Foundry`,
    description: s.tagline,
    depth: 2,
    body: parts.join('\n'),
  });
}
