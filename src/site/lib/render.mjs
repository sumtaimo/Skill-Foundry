/**
 * Pure HTML renderers for the showcase site. Same input gives identical output.
 * @governed-by PO_ARCHITECT
 */
import { DICTS } from './i18n.mjs';
import { ROLES } from './content.mjs';

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

function rolesList(skill) {
  if (!skill.roles || !skill.roles.length) return '';
  return `<p class="roles">${t('plate.roles')} ${skill.roles.map((r) => t(`role.${r}`, 'span', `class="role" data-role="${esc(r)}"`)).join(' ')}</p>`;
}

function coverSvg(skill) {
  const label = `${skill.title} cover`;
  return skill.coverSvg.replace(/^<svg\b([^>]*)>/i, (m, attrs) => {
    const a = attrs.replace(/\s(role|aria-label|width|height)\s*=\s*("[^"]*"|'[^']*')/gi, '');
    return `<svg${a} role="img" aria-label="${esc(label)}" focusable="false">`;
  });
}

/** Every cover says what it is: real output (a recorded run or a real agent's answer) or a concept drawing. */
function coverTag(skill) {
  const kind = skill.coverKind ?? 'concept';
  return t(kind === 'concept' ? 'cover.concept' : 'cover.real', 'span', `class="cover-tag" data-kind="${esc(kind)}"`);
}

function cover(skill, cls) {
  return `<div class="${cls}" data-cover="${esc(skill.coverKind ?? 'concept')}">${coverSvg(skill)}${coverTag(skill)}</div>`;
}

/** The real answer a fresh agent gave, word for word, with the request it was given. */
/** design-system: where the swatches of the cover come from (the recorded run and the request it was given). */
function tokensBlock(skill) {
  const k = skill.tokens;
  if (!k) return '';
  return `${t('tokens.title', 'h3')}
${t('tokens.note', 'p', 'class="run-note"')}
<figure class="tokens-proof" data-tokens-run="${esc(k.run)}" data-tokens-sha256="${esc(k.sha256)}">
<div class="tokens-figure">${coverSvg(skill)}</div>
<figcaption><span class="proof-label" data-i18n="answer.asked">${esc(EN['answer.asked'])}</span> <code lang="en">${esc(k.prompt)}</code> <code lang="en">${esc(k.run)}/output/tokens.css</code></figcaption>
</figure>`;
}

function proofBlock(skill) {
  const p = skill.proof;
  if (!p) return '';
  return `${t('answer.title', 'h3')}
${t(p.source === 'portable' ? 'answer.note.portable' : 'answer.note.live', 'p', 'class="run-note"')}
<figure class="proof" id="answer" data-proof-source="${esc(p.source)}">
<p class="proof-ask">${t('answer.asked', 'span', 'class="proof-label"')} <code lang="en">${esc(p.prompt)}</code></p>
<pre class="proof-answer" lang="en">${esc(p.answer)}</pre>
${copyButton(p.answer, 'answer.copy')}
</figure>`;
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
<header class="top">
<a class="brand" href="${up}index.html">Skill Foundry</a>
<nav class="tools" aria-label="${esc(EN['nav.label'])}">
<a href="${up}index.html#collection">${t('nav.collection')}</a>
<a href="${local.proof ?? `${up}index.html#proof`}">${t('nav.proof')}</a>
<a href="${local.install ?? `${up}index.html#install`}">${t('nav.install')}</a>
<a href="${up}index.html#agents">${t('nav.agents')}</a>
<button type="button" class="btn ghost" data-action="theme" aria-pressed="false">${t('theme.toDark')}</button>
<button type="button" class="btn ghost" data-action="lang" lang="km">${t('lang.toKh')}</button>
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

/** @param {object} skill @param {{depth?:number, index?:number, sha256?:string}} [opts] */
export function renderCard(skill, opts = {}) {
  need(skill, 'renderCard');
  const up = '../'.repeat(opts.depth ?? 0);
  return `<article class="plate" data-skill="${esc(skill.name)}" data-roles="${esc((skill.roles || []).join(' '))}" data-text="${esc(haystack(skill))}">
${cover(skill, 'cover')}
<h3 lang="en"><a href="${up}skills/${esc(skill.name)}/index.html">${esc(skill.title)}</a></h3>
<p class="plate-tag" lang="en">${esc(sentence(skill.tagline))}</p>
${rolesList(skill)}
${liveLine(skill)}
<p class="plate-act">${installButton(skill, opts.sha256, 'btn ghost copy')}</p>
</article>`;
}

/** Collection-wide zip link; class and href lead so tests can match it. */
function allLink(bytes) {
  const args = { size: formatBytes(bytes) };
  return `<a class="dl-all" href="downloads/all-skills.zip" download data-i18n="download.allLabel" data-i18n-args="${esc(JSON.stringify(args))}">${esc(fill(EN['download.allLabel'], args))}</a>`;
}

/** Search box, role filter and live count; filtering itself is done by site.js. Only roles a ready skill has are offered. */
function renderFinder(skills) {
  const used = ROLES.filter((r) => skills.some((s) => (s.roles || []).includes(r)));
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

/** The skill whose recorded result opens the landing page: a recorded figure run first, else a real answer drawn as a document. */
export function featuredSkill(skills) {
  return skills.find((s) => s.coverKind === 'run') ?? skills.find((s) => s.coverKind === 'proof') ?? skills[0];
}

function renderHero(skills) {
  if (!skills.length) return `<section class="hero">${t('hero.title', 'h1')}</section>`;
  const live = skills.reduce((a, s) => ({ p: a.p + (s.live ? s.live.passed : 0), t: a.t + (s.live ? s.live.total : 0) }), { p: 0, t: 0 });
  const roles = new Set(skills.flatMap((s) => s.roles || [])).size;
  const f = featuredSkill(skills);
  const factsList = [t('chip.skills', 'li', '', { n: skills.length }), t('chip.cases', 'li', '', live), t('chip.roles', 'li', '', { n: roles })].join('\n');
  return `<section class="hero" aria-labelledby="hero-title">
${t('hero.title', 'h1', 'id="hero-title"')}
${t('hero.sub', 'p', 'class="lead"')}
${t('hero.who', 'p', 'class="hero-who"')}
<ul class="facts">
${factsList}
</ul>
<p class="hero-actions"><a class="btn primary" href="#install">${t('hero.cta')}</a></p>
</section>
<section id="result" class="real-result" aria-labelledby="result-title">
<h2 id="result-title"><span data-i18n="result.title">${esc(EN['result.title'])}</span> <span lang="en">${esc(f.title)}</span></h2>
${cover(f, 'cover cover-lg')}
<p class="proof-ask">${t('answer.asked', 'span', 'class="proof-label"')} <code lang="en">${esc(f.prompt)}</code></p>
<p><a class="btn" href="${fullResultHref(f)}">${t('result.full')}</a></p>
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

function qa(n, extra = '') {
  return `<details class="acc qa">
<summary>${t(`qa.${n}.q`)}</summary>
${t(`qa.${n}.a`, 'p')}${extra}
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
  const promptTemplate = EN['agents.prompt'];
  const promptPlain = promptTemplate.replace('Read {site}llms.txt', 'Read the llms.txt file on this site');
  const tocKeys = [['collection', 'nav.collection'], ['proof', 'nav.proof'], ['install', 'nav.install'], ['agents', 'nav.agents'], ['limits', 'limits.title'], ['questions', 'questions.title']];
  const toc = tocKeys.map(([id, key], i) => `<li><a href="#${id}"><span class="num" aria-hidden="true">${i + 1}</span>${t(key)}</a></li>`).join('\n');
  const body = `${renderHero(sorted)}
<nav class="toc" aria-label="${esc(EN['toc.label'])}">
<ol>
${toc}
</ol>
</nav>
<section id="collection" class="col collection numbered" aria-labelledby="collection-title">
${t('collection.title', 'h2', 'id="collection-title"')}
${renderFinder(sorted)}
<div class="grid">
${sorted.map((s, i) => renderCard(s, { index: i + 1, sha256: sums[zipName(s)]?.sha256 })).join('\n')}
</div>
${t('find.none', 'p', 'class="find-none" hidden')}
</section>
<section id="proof" class="col numbered" aria-labelledby="proof-title">
${t('proof.title', 'h2', 'id="proof-title"')}
${t('proof.p', 'p')}
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
</section>
<section id="install" class="col numbered" aria-labelledby="install-title">
${t('install.title', 'h2', 'id="install-title"')}
${t('install.lead', 'p')}
<ol class="cmds">
${npxRows()}
</ol>
${t('install.npx', 'p', 'class="note"')}
<details class="acc">
<summary>${t('install.fallback')}</summary>
${t('install.fallback.p', 'p')}
<ol class="steps">
${steps('install.s', 3)}
</ol>
${Number.isFinite(opts.allBytes) && opts.allBytes > 0 ? `<p>${allLink(opts.allBytes)}</p>` : ''}
<p class="meta"><a href="downloads/checksums.json">${t('download.checksums')}</a></p>
</details>
</section>
<section id="agents" class="col numbered" aria-labelledby="agents-title">
${t('agents.title', 'h2', 'id="agents-title"')}
${t('agents.p', 'p')}
<ul class="agent-files">
<li><a href="skills.json">${t('agents.json')}</a></li>
<li><a href="llms.txt">${t('agents.txt')}</a></li>
</ul>
${t('agents.promptLabel', 'h3')}
<div class="codebox"><pre lang="en"><code class="agent-prompt">${esc(promptPlain)}</code></pre><button type="button" class="btn copy" data-copy="${esc(promptPlain)}" data-agent-prompt="${esc(promptTemplate)}">${t('agents.copyPrompt')}</button></div>
</section>
<section id="limits" class="col numbered" aria-labelledby="limits-title">
${t('limits.title', 'h2', 'id="limits-title"')}
<ul class="limits">
<li>${t('limits.p1')}</li>
<li>${t('limits.p2')}</li>
<li>${t('limits.p3')}</li>
</ul>
</section>
<section id="questions" class="col numbered" aria-labelledby="questions-title">
${t('questions.title', 'h2', 'id="questions-title"')}
${qa('what')}
${qa('node')}
${qa('edit')}
${qa('made', `\n<ol class="steps">\n${steps('made.s', 5)}\n</ol>`)}
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
  return skill.example ? `${up}skills/${skill.name}/example.html` : `${up}skills/${skill.name}/index.html#answer`;
}

const SECTIONS = [
  { id: 'what-it-does', key: 'sk.does' },
  { id: 'how-to-ask', key: 'sk.ask' },
  { id: 'proven', key: 'sk.proven' },
  { id: 'rules', key: 'sk.rules' },
  { id: 'examples', key: 'sk.examples' },
  { id: 'limits', key: 'limits.title' },
  { id: 'questions', key: 'questions.title' },
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
  const toc = [`<a href="#install">${t('skill.install')}</a>`, ...SECTIONS.map((q, i) => `<a href="#${q.id}"><span class="num" aria-hidden="true">${i + 1}</span>${t(q.key)}</a>`)].join('\n');
  const facts = [`<li><span data-i18n="version">${esc(EN.version)}</span> <code class="ver">${esc(s.version)}</code></li>`,
    ...(s.roles || []).map((r) => t(`role.${r}`, 'li', `class="role" data-role="${esc(r)}"`))].join('\n');
  const parts = [];
  parts.push(`<header class="skill-head">
<p class="back"><a href="../../index.html#collection">${t('back')}</a></p>
<h1 lang="en">${esc(s.title)}</h1>
<p class="lead" lang="en">${esc(sentence(s.tagline))}</p>
<ul class="facts">
${facts}
</ul>
${liveLine(s)}
<p class="hero-actions"><a class="btn primary" href="#install">${t('skill.cta')}</a></p>
</header>
<nav class="qbar" aria-label="${esc(EN['toc.label'])}">
<div class="qbar-tabs">
${toc}
</div>
<div class="qbar-progress" aria-hidden="true"></div>
</nav>
<section id="result" class="real-result" aria-labelledby="result-title">
${t('result.skill', 'h2', 'id="result-title"')}
${cover(s, 'cover cover-lg')}
<p class="proof-ask">${t('answer.asked', 'span', 'class="proof-label"')} <code lang="en">${esc(s.prompt)}</code></p>
<p><a class="btn" href="${s.example ? 'example.html' : '#answer'}">${t('result.full')}</a></p>
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
  parts.push(`<section id="how-to-ask" class="numbered" aria-labelledby="h-ask">
${t('sk.ask', 'h2', 'id="h-ask"')}
${t('take.type', 'p')}
<div class="codebox"><pre lang="en"><code>${esc(s.prompt)}</code></pre>${copyButton(s.prompt)}</div>
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
${proofBlock(s)}
${s.example ? `${t(s.run ? (s.run.reference ? 'ref.title' : 'run.title') : 'skill.example', 'h3')}
${s.run ? t(s.run.reference ? 'ref.note' : 'run.note', 'p', 'class="run-note"') : ''}
${t('example.note', 'p')}
<iframe class="example" sandbox="allow-scripts" src="example.html" title="${esc(s.title)} example"></iframe>
${t('example.open', 'a', 'class="example-open" href="example.html"')}` : ''}
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
${qa('node')}
${qa('edit')}
</section>`);
  return renderLayout({
    title: `${s.title} | Skill Foundry`,
    description: s.tagline,
    depth: 2,
    local: { install: '#install', proof: '#proven' },
    image: opts.siteUrl ? `${String(opts.siteUrl).replace(/\/$/, '')}/skills/${s.name}/banner.png` : undefined,
    body: parts.join('\n'),
  });
}
