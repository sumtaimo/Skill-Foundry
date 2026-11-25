/**
 * Pure HTML renderers for the showcase site. Same input gives identical output.
 * @governed-by PO_ARCHITECT
 */
import { DICTS } from './i18n.mjs';
import { ROLES } from './content.mjs';

const EN = DICTS.en;
const FONTS = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap';

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

/** Like t(), but the class attribute comes first so markup reads <tag class="…" data-i18n=…>. */
function tc(key, tag, cls, args = null) {
  if (typeof cls !== 'string' || !cls) throw new TypeError('tc: class required');
  return t(key, tag, '', args).replace(`<${tag} `, `<${tag} class="${esc(cls)}" `);
}

function need(obj, name) {
  if (!obj || typeof obj !== 'object') throw new TypeError(`${name}: object required`);
}

/** Public source repository (footer links). */
const REPO = 'https://github.com/sumtaimo/Skill-Foundry';

/** Section header: eyebrow, the section h2, optional lead. */
function secHead(titleKey, id, eyebrowKey, leadKey = '') {
  if (typeof id !== 'string' || !id) throw new TypeError('secHead: id required');
  return `<header class="sec-head">
${tc(eyebrowKey, 'p', 'eyebrow')}
${t(titleKey, 'h2', `id="${esc(id)}"`)}${leadKey ? `\n${tc(leadKey, 'p', 'sec-lead')}` : ''}
</header>`;
}

const pad = (n) => String(n).padStart(2, '0');

/** @param {number} bytes */
export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) throw new TypeError('formatBytes: bytes must be >= 0');
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/** Zip file name; build may set skill.zip to the file packAll actually wrote. */
export const zipName = (s) => (typeof s.zip === 'string' && s.zip ? s.zip : `${s.name}-${s.version}.zip`);
/** One command for any project: installs the skill, keeps it up to date with `check` / `update`, registers it in an agentic harness. */
export const npxCommand = (arg) => `npx github:sumtaimo/Skill-Foundry ${arg}`;
const npxBox = (arg) => `<div class="codebox"><pre><code class="npx-cmd">${esc(npxCommand(arg))}</code></pre>${copyButton(npxCommand(arg))}</div>`;
export const installCommand = (s) => `unzip ${zipName(s)} -d .claude/skills/`;

/**
 * One-line install: download, verify SHA-256, unzip into .claude/skills/. Works with curl, shasum and unzip
 * on macOS and Linux. url is the absolute zip URL; site.js fills it from the page address.
 */
export function installOneLiner(s, sha256, url) {
  const z = zipName(s);
  return `mkdir -p .claude/skills && curl -fsSL "${url}" -o "${z}" && echo "${sha256}  ${z}" | shasum -a 256 -c - && unzip -oq "${z}" -d .claude/skills && rm "${z}"`;
}

/**
 * Copy button for the install command. Portable skills copy the npx command (it stamps versions, wires harness roles and
 * protects the skill); factory-only skills have no npx path, so they copy the zip command, which site.js upgrades to the
 * full download-verify-unzip one-liner when served over http(s).
 */
function installButton(skill, sha256, cls = 'btn copy') {
  if (!skill.factoryOnly) return `<button type="button" class="${cls}" data-copy="${esc(npxCommand(`add ${skill.name}`))}" data-install-npx="${esc(skill.name)}">${t('install.copy')}</button>`;
  return zipButton(skill, sha256, cls, 'install.copy');
}

/** Copy button for the zip fallback command. */
function zipButton(skill, sha256, cls = 'btn copy', key = 'install.copyZip') {
  const zip = `downloads/${zipName(skill)}`;
  return `<button type="button" class="${cls}" data-copy="${esc(installCommand(skill))}" data-install-zip="${esc(zip)}" data-install-name="${esc(zipName(skill))}" data-sha256-install="${esc(sha256 ?? '')}">${t(key)}</button>`;
}

/** Plain-text search haystack for a plate. */
const haystack = (s) => [s.name, s.title, s.tagline, s.description, s.prompt, ...(s.tags || []), ...(s.outputs || [])].join(' ').toLowerCase().replace(/\s+/g, ' ');

function liveLine(skill) {
  const l = skill.live;
  return l && l.total > 0
    ? t('live.yes', 'p', `class="live live-yes" data-live="${l.passed}/${l.total}"`, { p: l.passed, t: l.total })
    : t('live.no', 'p', 'class="live live-no" data-live="none"');
}


/** Roles that get the skill, as quiet chips (registry roles field). */
function roleChips(skill) {
  const roles = (skill.roles || []).filter((r) => typeof r === 'string' && `chip.${r}` in EN);
  return roles.length ? `<li class="meta-roles">${roles.map((r) => t(`chip.${r}`, 'span', `class="role-chip" data-role="${esc(r)}"`)).join('')}</li>` : '';
}

/** One quiet meta row shared by cards and skill pages: version, cases passed, latest recording date, roles. Only real data. */
export function metaRow(skill, cls = 'meta-row') {
  need(skill, 'metaRow');
  const l = skill.live;
  const cases = l && l.total > 0
    ? t('meta.cases', 'li', `class="live live-yes" data-live="${l.passed}/${l.total}"`, { p: l.passed, t: l.total })
    : t('live.no', 'li', 'class="live live-no" data-live="none"');
  const updated = l && l.updated ? t('meta.updated', 'li', 'class="meta-updated"', { d: l.updated }) : '';
  return `<ul class="${cls}">
${t('card.version', 'li', 'class="plate-ver"', { v: String(skill.version ?? '') })}
${cases}
${updated}
${roleChips(skill)}
</ul>`;
}

function coverSvg(skill, bare = false) {
  const label = `${skill.title} cover`;
  return (bare && skill.coverSvgBare ? skill.coverSvgBare : skill.coverSvg).replace(/^<svg\b([^>]*)>/i, (m, attrs) => {
    const a = attrs.replace(/\s(role|aria-label|width|height)\s*=\s*("[^"]*"|'[^']*')/gi, '');
    return `<svg${a} role="img" aria-label="${esc(label)}" focusable="false">`;
  });
}

/** Every cover says what it is: real output (a recorded run or a real agent's answer) or a concept drawing. */
function coverTag(skill) {
  const kind = skill.coverKind ?? 'concept';
  return t(kind === 'concept' ? 'cover.concept' : 'cover.real', 'span', `class="cover-tag" data-kind="${esc(kind)}"`);
}

function cover(skill, cls, bare = false) {
  return `<div class="${cls}" data-cover="${esc(skill.coverKind ?? 'concept')}">${coverSvg(skill, bare)}${coverTag(skill)}</div>`;
}

/** The real answer a fresh agent gave, word for word, with the request it was given. */
/** design-system: where the swatches of the cover come from (the recorded run and the request it was given). */
function tokensBlock(skill) {
  const k = skill.tokens;
  if (!k) return '';
  return `<details class="acc tokens-acc">
<summary>${t('tokens.title')}</summary>
${t('tokens.note', 'p', 'class="run-note"')}
<figure class="tokens-proof" data-tokens-run="${esc(k.run)}" data-tokens-sha256="${esc(k.sha256)}">
<div class="tokens-figure">${coverSvg(skill)}</div>
<figcaption><code lang="en">${esc(k.run)}/output/tokens.css</code></figcaption>
</figure>
</details>`;
}

/** The full word-for-word answer, closed by default; it stays in the HTML so it reads without JavaScript. The request is not repeated: it sits beside the result. */
function answerAccordion(skill) {
  const p = skill.proof;
  if (!p) return '';
  return `<details class="acc answer-acc" id="answer" data-proof-source="${esc(p.source)}">
<summary>${t('answer.show')}</summary>
${t(p.source === 'portable' ? 'answer.note.portable' : 'answer.note.live', 'p', 'class="run-note"')}
${p.prompt === skill.prompt ? '' : `<p class="proof-ask">${t('answer.asked', 'span', 'class="proof-label"')} <code lang="en">${esc(p.prompt)}</code></p>\n`}<pre class="proof-answer" lang="en">${esc(p.answer)}</pre>
${copyButton(p.answer, 'answer.copy')}
</details>`;
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
  const local = o.local ?? {};
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' rx='6' fill='%231d1d1b'/%3E%3Cpath d='M5 8.5h11c0 2.2-1.4 3.4-3.2 3.7v2.3h2.2v2H7v-2h2.2v-2.3C7.2 11.9 5.5 10.6 5 8.5zm11.8.4 2.7-1.4v2.6l-2.7-1.2z' fill='%23f9f9f8'/%3E%3C/svg%3E">
<script>(function(){try{if('scrollRestoration' in history)history.scrollRestoration='manual';var nav=window.performance&&performance.getEntriesByType&&performance.getEntriesByType('navigation')[0];if(nav&&nav.type==='reload'&&location.hash)history.replaceState(null,'',location.pathname+location.search);if(!location.hash)window.scrollTo(0,0);var t=localStorage.getItem('sf-theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);var m=document.querySelector('meta[name="color-scheme"]');if(m)m.content=t;}}catch(e){}})();</script>
<title>${esc(o.title)}</title>
<meta name="description" content="${esc(desc)}">${o.image ? `
<meta property="og:title" content="${esc(o.title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${esc(o.image)}">
<meta name="twitter:card" content="summary_large_image">` : ''}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${esc(FONTS)}">
<link rel="stylesheet" href="${up}assets/site.css">
<script src="${up}assets/site.js" defer></script>
</head>
<body>
<a class="skip" href="#main">${t('skip')}</a>
<header class="top"><div class="top-in">
<a class="brand" href="${up}index.html"><svg class="mark" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" focusable="false"><rect width="24" height="24" rx="6" fill="currentColor"/><path class="mark-fg" d="M4.5 8.5h11.5c0 2.2-1.5 3.4-3.3 3.7v2.3h2.3v2H6.8v-2h2.2v-2.3C6.8 11.9 5 10.6 4.5 8.5zm12.2.4 2.8-1.4v2.8l-2.8-1.4z"/></svg><span class="brand-name">Skill Foundry</span></a>
<div class="top-actions">
<div class="top-tools">
<button type="button" class="tool-btn" data-action="theme" aria-pressed="false"><span class="tool-chip" aria-hidden="true"><svg class="i-moon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg><svg class="i-sun" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></span>${t('theme.toDark', 'span', 'class="sr"')}</button>
<button type="button" class="tool-btn lang-btn" data-action="lang" lang="km"><span class="tool-chip" aria-hidden="true"></span>${t('lang.toKh', 'span', 'class="sr"')}</button>
<a class="tool-btn gh-btn" href="${REPO}" target="_blank" rel="noopener noreferrer"><span class="tool-chip" aria-hidden="true"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg></span>${t('gh.label', 'span', 'class="sr"')}</a>
</div>
<a class="btn cta" href="${local.install ?? `${up}index.html#install-title`}">${t('cta.install')}</a>
</div>
</div></header>
<div class="wrap">
<main id="main" tabindex="-1">
${o.body}
</main>
</div>
<footer class="foot"><div class="wrap foot-in">
<div class="foot-about">
<p class="foot-brand"><svg class="mark" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><rect width="24" height="24" rx="6" fill="currentColor"/><path class="mark-fg" d="M4.5 8.5h11.5c0 2.2-1.5 3.4-3.3 3.7v2.3h2.3v2H6.8v-2h2.2v-2.3C6.8 11.9 5 10.6 4.5 8.5zm12.2.4 2.8-1.4v2.8l-2.8-1.4z"/></svg><span>Skill Foundry</span></p>
${t('foot.tagline', 'p', 'class="foot-tag"')}
</div>
<div class="foot-meta">
${o.version ? t('foot.version', 'p', 'class="foot-ver"', { v: o.version }) : ''}
<p class="foot-copy">${t('foot.license', 'span')}<span class="foot-sep" aria-hidden="true">·</span>${t('foot.year', 'span', '', { y: Number.isInteger(o.year) ? o.year : new Date().getUTCFullYear() })}</p>
</div>
</div></footer>
</body>
</html>
`;
}

/** @param {object} skill @param {{depth?:number, index?:number, sha256?:string}} [opts] */
export function renderCard(skill, opts = {}) {
  need(skill, 'renderCard');
  const up = '../'.repeat(opts.depth ?? 0);
  const hasPg = Array.isArray(skill.playgrounds) && skill.playgrounds.length > 0;
  const frame = skill.liveCover
    ? `<iframe class="cover-frame" sandbox="allow-scripts" tabindex="-1" aria-hidden="true" src="${up}skills/${esc(skill.name)}/example.html" title="${esc(skill.title)} live preview"></iframe>`
    : '';
  const pgBadge = hasPg ? t('pg.badge', 'span', 'class="pg-badge"') : '';
  return `<article class="plate" data-skill="${esc(skill.name)}" data-roles="${esc((skill.roles || []).join(' '))}" data-text="${esc(haystack(skill))}">
<div class="cover${skill.liveCover ? ' cover-live' : ''}" data-cover="${esc(skill.coverKind ?? 'concept')}">${coverSvg(skill, false)}${frame}${pgBadge}${coverTag(skill)}</div>
<h3 lang="en"><a href="${up}skills/${esc(skill.name)}/index.html">${esc(skill.title)}</a></h3>
<p class="plate-tag" lang="en">${esc(sentence(skill.tagline))}</p>
${metaRow(skill)}
<p class="plate-act"><a class="btn ghost" href="${up}skills/${esc(skill.name)}/index.html">${t('card.details')}</a></p>
</article>`;
}

/** Collection-wide zip link; class and href lead so tests can match it. */
function allLink(bytes) {
  const args = { size: formatBytes(bytes) };
  return `<a class="dl-all" href="downloads/all-skills.zip" download data-i18n="download.allLabel" data-i18n-args="${esc(JSON.stringify(args))}">${esc(fill(EN['download.allLabel'], args))}</a>`;
}

/** Search box, role filter and live count; filtering itself is done by site.js. Only roles a ready skill has are offered. */

/** The skill whose recorded result opens the landing page: a recorded figure run first, else a real answer drawn as a document. */
export function featuredSkill(skills) {
  return skills.find((s) => s.coverKind === 'run') ?? skills.find((s) => s.coverKind === 'proof') ?? skills[0];
}

function renderHero(skills, opts = {}) {
  if (!skills.length) return `<section class="hero">${t('hero.title', 'h1')}</section>`;
  const f = featuredSkill(skills);
  const cmd = esc(npxCommand('add --all'));
  return `<section class="hero" aria-labelledby="hero-title">
<p class="hero-pill-row"><a class="hero-pill" href="#collection"><span class="pill-tag" data-i18n="pill.new">${esc(EN['pill.new'])}</span><span class="pill-text" data-i18n="pill.text" data-i18n-args="${esc(JSON.stringify({ n: skills.length }))}">${esc(fill(EN['pill.text'], { n: skills.length }))}</span><span class="pill-arrow" aria-hidden="true">→</span></a></p>
<h1 id="hero-title">${t('hero.t1', 'span', 'class="h1-line"')} ${t('hero.t2', 'span', 'class="h1-line grad"')}</h1>
${t('hero.sub', 'p', 'class="lead"')}
<div class="hero-install">
${t('hero.installLabel', 'p', 'class="cmd-label"')}
<div class="codebox"><pre><code class="npx-cmd">${cmd}</code></pre><button type="button" class="btn primary copy" data-copy="${cmd}">${t('copy.copy')}</button></div>
</div>
<p class="sr">${opts.version ? tc('hero.version', 'span', 'ver', { v: opts.version }) : '<span class="ver"></span>'}</p>
</section>
<section id="result" class="real-result stage" aria-labelledby="result-title">
<div class="stage-bar" aria-hidden="true"><span class="stage-url" lang="en">skill-foundry / ${esc(f.name)}</span></div>
${cover(f, 'cover cover-lg')}
<div class="result-side">
<h2 id="result-title"><span data-i18n="result.title">${esc(EN['result.title'])}</span> <span lang="en">${esc(f.title)}</span></h2>
<p class="proof-ask">${t('answer.asked', 'span', 'class="proof-label"')} <code lang="en">${esc(f.prompt)}</code></p>
<p class="result-actions"><a class="btn" href="${fullResultHref(f)}">${t('result.full')}</a></p>
</div>
</section>`;
}

/**
 * Skills working together: one request, several skills, used by a real agent in the order shown. Real output only.
 * Collapsed by default on the landing page.
 * @param {{id:string,title:string,prompt:string,used:string[],answer:string,svg:string}[]} recipes @param {object[]} skills
 */
export function renderRecipes(recipes, skills) {
  if (!recipes.length) return '';
  const titleOf = (n) => skills.find((s) => s.name === n)?.title ?? n;
  const items = recipes.map((r) => `<article class="recipe" data-recipe="${esc(r.id)}">
<h3 lang="en">${esc(r.title)}</h3>
<p class="recipe-chain">${t('recipe.used', 'span', 'class="proof-label"')} ${r.used.map((n, i) => `${i ? '<span class="recipe-arrow" aria-hidden="true">→</span> ' : ''}<a class="chip" href="skills/${esc(n)}/index.html" lang="en">${esc(titleOf(n))}</a>`).join(' ')}</p>
<div class="recipe-body">
<div class="cover" data-cover="proof">${r.svg.replace(/^<svg\b/, '<svg aria-hidden="true" focusable="false"')}${t('cover.real', 'span', 'class="cover-tag" data-kind="proof"')}</div>
<figure class="proof" data-proof-source="recipe">
<p class="proof-ask">${t('answer.asked', 'span', 'class="proof-label"')} <code lang="en">${esc(r.prompt)}</code></p>
<pre class="proof-answer" lang="en">${esc(r.answer)}</pre>
${copyButton(r.answer, 'answer.copy')}
</figure>
</div>
</article>`).join('\n');
  return `<details id="together" class="acc">
<summary>${t('recipe.title')}</summary>
${t('recipe.note', 'p')}
${items}
</details>`;
}

/** Install panel: every command in workflow order, each with its own copy button. */
function npxRows() {
  return [
    ['install.one', 'add <skill>'],
    ['install.role', 'add --role QA_AUDITOR'],
    ['install.all', 'add --all'],
    ['install.doctor', 'doctor'],
    ['install.check', 'check'],
    ['install.update', 'update'],
    ['install.remove', 'remove <skill>'],
  ].map(([key, arg]) => `<li class="cmd-row">${t(key, 'p', 'class="cmd-label"')}<div class="codebox"><pre><code class="npx-cmd">${esc(npxCommand(arg))}</code></pre>${copyButton(npxCommand(arg))}</div></li>`).join('\n');
}

/** One install step card: number pill, title, sentence, one codebox per command (not primary: the hero keeps the only primary). */
function stepCard(n, key, args) {
  if (!Number.isInteger(n) || !Array.isArray(args)) throw new TypeError('stepCard: bad arguments');
  const boxes = args.map((a) => `<div class="codebox"><pre><code class="step-cmd">${esc(npxCommand(a))}</code></pre>${copyButton(npxCommand(a))}</div>`).join('\n');
  return `<li class="step"><span class="step-n" aria-hidden="true">${n}</span>
${t(`${key}.t`, 'h3')}
${t(`${key}.p`, 'p')}
<div class="step-cmds">
${boxes}
</div>
</li>`;
}

function qa(n, extra = '') {
  return `<details class="faq">
<summary>${t(`qa.${n}.q`)}<span class="faq-icon" aria-hidden="true"></span></summary>
<div class="faq-a">${t(`qa.${n}.a`, 'p')}${extra}</div>
</details>`;
}

/**
 * @param {object[]} skills ready skills
 * @param {{drafts?:string[], allBytes?:number, recipes?:object[], checksums?:object}} [opts]
 */
export function renderIndex(skills, opts = {}) {
  if (!Array.isArray(skills)) throw new TypeError('renderIndex: skills array required');
  const manifest = JSON.stringify({ ready: skills.map((s) => s.name), drafts: [...(opts.drafts ?? [])].sort() }).replace(/</g, '\\u003c');
  const sorted = [...skills].sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  const steps = (prefix, count) => Array.from({ length: count }, (_, i) => t(`${prefix}${i + 1}`, 'li')).join('\n');
  const sums = opts.checksums ?? {};
  const layers = Array.from({ length: 7 }, (_, i) => t(`proof.l${i + 1}`, 'li')).join('\n');
  const proofRows = sorted.map((s) => `<tr><th scope="row" lang="en"><a href="skills/${esc(s.name)}/index.html">${esc(s.name)}</a></th><td>${s.live && s.live.total > 0 ? `${s.live.passed} / ${s.live.total}` : t('proof.notyet')}</td><td>${s.rules.machine} / ${s.rules.total}</td></tr>`).join('\n');
  const live = sorted.reduce((a, s) => ({ p: a.p + (s.live ? s.live.passed : 0), t: a.t + (s.live ? s.live.total : 0) }), { p: 0, t: 0 });
  const roleCount = new Set(sorted.flatMap((s) => (Array.isArray(s.roles) ? s.roles : []))).size;
  const promptTemplate = EN['agents.prompt'];
  const promptPlain = promptTemplate.replace('Read {site}llms.txt', 'Read the llms.txt file on this site');
  const body = `${renderHero(sorted, { version: opts.version })}
<section id="collection" class="col collection" aria-labelledby="collection-title">
${secHead('collection.title', 'collection-title', 'eyebrow.collection', 'collection.lead')}
<div class="grid">
${sorted.map((s, i) => renderCard(s, { index: i + 1, sha256: sums[zipName(s)]?.sha256 })).join('\n')}
</div>
</section>
<section id="proof" class="col" aria-labelledby="proof-title">
${secHead('proof.title', 'proof-title', 'eyebrow.proof', 'proof.p')}
<div class="stats">
<div class="stat"><span class="stat-num">${sorted.length}</span>${tc('stat.skills', 'span', 'stat-label')}</div>
<div class="stat">${tc('stat.casesNum', 'span', 'stat-num', live)}${tc('stat.cases', 'span', 'stat-label')}</div>
<div class="stat"><span class="stat-num">${roleCount}</span>${tc('stat.roles', 'span', 'stat-label')}</div>
</div>
<div class="proof-box">
<div class="table-wrap"><table class="proof">
<thead><tr>${t('proof.skill', 'th', 'scope="col"')}${t('proof.real', 'th', 'scope="col"')}${t('proof.rules', 'th', 'scope="col"')}</tr></thead>
<tbody>
${proofRows}
</tbody>
</table></div>
<details class="acc">
<summary>${t('proof.layers')}</summary>
<ol class="layers">
${layers}
</ol>
</details>
${renderRecipes(opts.recipes ?? [], sorted)}
</div>
</section>
<section id="install" class="col" aria-labelledby="install-title">
${secHead('install.title', 'install-title', 'eyebrow.install', 'install.secLead')}
<ol class="steps">
${stepCard(1, 'step.all', ['add --all'])}
${stepCard(2, 'step.one', ['add <skill>'])}
${stepCard(3, 'step.keep', ['check', 'update'])}
</ol>
<div class="install-more">
${t('install.scope', 'p', 'class="note"')}
${t('install.time', 'p', 'class="note"')}
<details class="acc">
<summary>${t('install.more')}</summary>
<ol class="cmds">
${npxRows()}
</ol>
</details>
<details class="acc">
<summary>${t('install.fallback')}</summary>
${t('install.fallback.p', 'p')}
<ol class="zip-steps">
${steps('install.s', 3)}
</ol>
${Number.isFinite(opts.allBytes) && opts.allBytes > 0 ? `<p>${allLink(opts.allBytes)}</p>` : ''}
<p class="meta"><a href="downloads/checksums.json">${t('download.checksums')}</a></p>
</details>
</div>
</section>
<section id="agents" class="col" aria-labelledby="agents-title">
${secHead('agents.title', 'agents-title', 'eyebrow.agents', 'agents.lead')}
<div class="agent-card">
<div class="agent-info">
${t('agents.p', 'p')}
<ul class="agent-files">
<li><a class="file-pill" href="skills.json"><svg class="file-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path d="M7 3h7l5 5v13H7z M14 3v5h5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>${t('agents.json')}</a></li>
<li><a class="file-pill" href="llms.txt"><svg class="file-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path d="M7 3h7l5 5v13H7z M14 3v5h5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>${t('agents.txt')}</a></li>
</ul>
</div>
<div class="agent-prompt-box">
${t('agents.promptLabel', 'h3')}
<div class="codebox"><pre lang="en"><code class="agent-prompt">${esc(promptPlain)}</code></pre><button type="button" class="btn copy" data-copy="${esc(promptPlain)}" data-agent-prompt="${esc(promptTemplate)}">${t('agents.copyPrompt')}</button></div>
</div>
</div>
</section>
<section id="limits" class="col" aria-labelledby="limits-title">
${secHead('limits.title', 'limits-title', 'eyebrow.limits', 'limits.lead')}
<ul class="limit-grid">
<li class="limit"><svg class="limit-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 7.5v5.5M12 16.2v.3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>${t('limits.p1', 'p')}</li>
<li class="limit"><svg class="limit-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 7.5v5.5M12 16.2v.3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>${t('limits.p2', 'p')}</li>
<li class="limit"><svg class="limit-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 7.5v5.5M12 16.2v.3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>${t('limits.p3', 'p')}</li>
</ul>
</section>
<section id="questions" class="col" aria-labelledby="questions-title">
${secHead('questions.title', 'questions-title', 'eyebrow.questions')}
<div class="faq-box">
${qa('what')}
${qa('node')}
${qa('edit')}
${qa('made', `\n<ol class="made-steps">\n${steps('made.s', 5)}\n</ol>`)}
</div>
</section>
<script type="application/json" id="sf-manifest">${manifest}</script>`;
  return renderLayout({ title: 'Skill Foundry', depth: 0, body, version: opts.version });
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
    if (h) out.push(`<h3>${esc(h[1])}</h3>`);
    else if (line.trim()) out.push(`<p>${esc(line.trim())}</p>`);
  }
  if (list) out.push('</ul>');
  return out.join('\n');
}

/** One sentence ending in punctuation. */
const sentence = (s) => { const x = String(s).trim() || '-'; return /[.!?]$/.test(x) ? x : `${x}.`; };

/** Inline `code` spans in otherwise escaped text. */
const inline = (s) => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>');

/** Where "see the full result" goes: the recorded interactive run when there is one, else the word-for-word answer. */
export function fullResultHref(skill, up = '') {
  if (skill.example) return `${up}skills/${skill.name}/example.html`;
  return `${up}skills/${skill.name}/index.html${skill.proof ? '#answer' : ''}`;
}

const SECTIONS = [
  { id: 'what-it-does', key: 'sk.does' },
  { id: 'proven', key: 'sk.proven' },
  { id: 'rules', key: 'sk.rules' },
  { id: 'examples', key: 'sk.examples' },
  { id: 'limits', key: 'limits.title' },
  { id: 'questions', key: 'questions.title' },
];

function playgroundBlock(skill) {
  const list = Array.isArray(skill.playgrounds) ? skill.playgrounds : [];
  if (!list.length) return '';
  const first = list[0];
  const tabs = list.length > 1
    ? `<div class="pg-tabs" role="group" aria-label="${esc(skill.title)} demos">${list.map((pg, i) => `<button type="button" class="pg-tab" data-pg-src="${esc(pg.file)}" aria-pressed="${i === 0 ? 'true' : 'false'}" lang="en">${esc(pg.label)}</button>`).join('')}</div>`
    : `<span class="pg-name" lang="en">${esc(first.label)}</span>`;
  return `<div class="playground" data-playground="${esc(skill.name)}">
<div class="pg-bar">
<div class="pg-head">
${t('pg.title', 'span', 'class="pg-title"')}
${tabs}
</div>
<a class="btn pg-open" href="${esc(first.file)}" target="_blank" rel="noopener noreferrer">${t('pg.open')}</a>
</div>
<iframe class="pg-frame" sandbox="allow-scripts" src="${esc(first.file)}" title="${esc(skill.title)} interactive playground"></iframe>
</div>`;
}

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
  const toc = [`<a href="#install">${t('nav.install')}</a>`, ...SECTIONS.map((q, i) => `<a href="#${q.id}">${t(q.key)}</a>`)].join('\n');
  const parts = [];
  parts.push(`<header class="skill-head">
<p class="back"><a href="../../index.html#collection">${t('back')}</a></p>
<h1 lang="en">${esc(s.title)}</h1>
<p class="lead" lang="en">${esc(sentence(s.tagline))}</p>
<p class="hero-actions"><a class="btn primary" href="#install">${t('skill.cta')}</a></p>
${metaRow(s)}
</header>
<nav class="qbar" aria-label="${esc(EN['toc.label'])}" data-i18n-aria="toc.label">
<div class="qbar-tabs">
<span class="qbar-ind" aria-hidden="true"></span>
${toc}
</div>
<div class="qbar-progress" aria-hidden="true"></div>
</nav>
<section id="result" class="real-result${Array.isArray(s.playgrounds) && s.playgrounds.length ? ' has-playground' : ''}" aria-labelledby="result-title">
${t('result.skill', 'h2', 'id="result-title"')}
${cover(s, 'cover cover-lg', true)}
<div class="result-side">
<p class="proof-ask">${t('answer.asked', 'span', 'class="proof-label"')} <code lang="en">${esc(s.prompt)}</code></p>
<p class="result-actions">${copyButton(s.prompt)}${s.example ? ` <a class="btn" href="example.html">${t('result.full')}</a>` : ''}</p>
</div>
${playgroundBlock(s)}
${answerAccordion(s)}
</section>`);
  const factoryNote = s.factoryOnly ? t('install.factory', 'p', 'class="note"') : '';
  const zipBlock = `<ol class="steps">
${t('install.s1', 'li')}
${t('install.s2', 'li')}
${t('install.s3', 'li')}
</ol>
<div class="codebox"><pre><code class="install-cmd">${esc(installCommand(s))}</code></pre>${zipButton(s, dl.sha256)}</div>
<p>${downloadButton(s, '../../', 'btn')}</p>
<dl class="kv">
<div>${t('download.sha', 'dt')}<dd><code class="sha" data-sha256="${esc(dl.sha256)}">${esc(dl.sha256)}</code></dd></div>
</dl>
<p class="meta"><a href="../../downloads/checksums.json">${t('download.checksums')}</a></p>`;
  parts.push(`<section id="install" class="install-block" aria-labelledby="h-install">
${t('skill.install', 'h2', 'id="h-install"')}
${s.factoryOnly ? factoryNote : `${t('install.lead.skill', 'p')}
${npxBox(`add ${s.name}`)}
${t('install.npx', 'p', 'class="note"')}`}
${s.factoryOnly ? zipBlock : `<details class="acc">
<summary>${t('install.fallback')}</summary>
${t('install.fallback.p', 'p')}
${zipBlock}
</details>`}
</section>`);
  parts.push(`<section id="what-it-does" class="numbered" aria-labelledby="h-does">
${t('sk.does', 'h2', 'id="h-does"')}
<h3 data-i18n="sk.does.yes">${esc(EN['sk.does.yes'])}</h3>
<p lang="en">${esc(sentence(s.tagline))}</p>
<h3 data-i18n="sk.gets">${esc(EN['sk.gets'])}</h3>
<ul class="outputs" lang="en">${s.outputs.map((o) => `<li>${esc(o)}</li>`).join('')}</ul>
${s.notFor ? `<h3 data-i18n="sk.does.no">${esc(EN['sk.does.no'])}</h3>\n<p lang="en">${esc(s.notFor)}</p>` : ''}
</section>`);
  const runFacts = s.run ? `<p class="run-facts" data-run="${esc(s.run.key)}" lang="en"><code>${esc(s.name)} ${esc(s.version)}</code> <code>run ${esc(s.run.key)}</code></p>` : '';
  parts.push(`<section id="proven" class="numbered" aria-labelledby="h-know">
${t('sk.proven', 'h2', 'id="h-know"')}
${liveLine(s)}
${renderMeter(s)}
<dl class="stats">
<div>${t('rules.total', 'dt')}<dd>${s.rules.total}</dd></div>
<div>${t('rules.machine', 'dt')}<dd>${s.rules.machine}</dd></div>
<div>${t('rules.checklist', 'dt')}<dd>${s.rules.checklist}</dd></div>
${s.live && s.live.total > 0 ? `<div>${t('sk.cases', 'dt')}<dd>${s.live.passed} / ${s.live.total}</dd></div>` : ''}
</dl>
${runFacts}
${s.changelog ? `<details class="acc">
<summary>${t('skill.changelog')}</summary>
<div class="changelog" lang="en">
${renderChangelog(s.changelog)}
</div>
</details>` : ''}
</section>`);
  parts.push(`<section id="rules" class="numbered" aria-labelledby="h-rules">
${t('sk.rules', 'h2', 'id="h-rules"')}
<details class="acc">
<summary>${t('sk.layers')}</summary>
<ol class="steps" lang="en">
${s.procedure.map((p) => `<li>${inline(p)}</li>`).join('\n')}
</ol>
</details>
<details class="acc">
<summary>${t('sk.rulelist', 'span', '', { n: s.ruleList?.length ?? s.rules.total })}</summary>
<ul class="rule-list" lang="en">
${(s.ruleList ?? []).map((r) => `<li><code>${esc(r.id)}</code> ${esc(r.text)}</li>`).join('\n')}
</ul>
</details>
<details class="acc">
<summary>${t('skill.files')}</summary>
<ul class="files" lang="en">${s.files.map((f) => `<li><code>${esc(s.name)}/${esc(f)}</code></li>`).join('')}</ul>
</details>
</section>`);
  parts.push(`<section id="examples" class="numbered" aria-labelledby="h-examples">
${t('sk.examples', 'h2', 'id="h-examples"')}
${tokensBlock(s)}
${s.example ? `<details class="acc example-acc">
<summary>${t(s.run ? (s.run.reference ? 'ref.title' : 'run.title') : 'skill.example')}</summary>
${s.run ? t(s.run.reference ? 'ref.note' : 'run.note', 'p', 'class="run-note"') : ''}
${t('example.note', 'p')}
<iframe class="example" sandbox="allow-scripts" src="example.html" title="${esc(s.title)} example"></iframe>
${t('example.open', 'a', 'class="example-open" href="example.html"')}
</details>` : ''}
<details id="banner" class="acc">
<summary>${t('banner.title')}</summary>
${t('banner.note', 'p')}
<figure class="banner"><img src="banner.svg" width="1280" height="640" alt="${esc(`${s.title} ${s.version}: ${s.tagline}`)}" loading="lazy"></figure>
<p class="meta"><a href="banner.svg" download="${esc(s.name)}-banner.svg">${t('banner.svg')}</a>${opts.siteUrl ? ` · <a href="banner.png" download="${esc(s.name)}-banner.png">${t('banner.png')}</a>` : ''}</p>
</details>
</section>`);
  parts.push(`<section id="limits" class="numbered" aria-labelledby="h-limits">
${t('limits.title', 'h2', 'id="h-limits"')}
<ul class="limits">
<li>${t('limits.run')}</li>
<li>${t('limits.p1')}</li>
<li>${t('limits.p2')}</li>
</ul>
</section>
<section id="questions" class="numbered" aria-labelledby="h-questions">
${t('questions.title', 'h2', 'id="h-questions"')}
<div class="faq-box">
${qa('node')}
${qa('edit')}
</div>
</section>`);
  return renderLayout({
    title: `${s.title} | Skill Foundry`,
    description: s.tagline,
    depth: 2,
    local: { install: '#h-install' },
    version: typeof opts.version === 'string' && opts.version ? opts.version : undefined,
    image: opts.siteUrl ? `${String(opts.siteUrl).replace(/\/$/, '')}/skills/${s.name}/banner.png` : undefined,
    body: parts.join('\n'),
  });
}
