/**
 * Site own style: Inter only, no rail/numbering, plates, meter, four questions, download labels, reduced motion.
 * @governed-by PO_ARCHITECT
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { buildSite } from '../src/site/build.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const registry = JSON.parse(readFileSync(join(ROOT, 'src/factory/registry.json'), 'utf8'));
const ready = registry.filter((s) => s.status === 'ready').sort((a, b) => a.name.localeCompare(b.name));

/** @param {string} dir @returns {string[]} */
function htmlFiles(dir) {
  if (typeof dir !== 'string') throw new TypeError('dir required');
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...htmlFiles(p));
    else if (p.endsWith('.html')) out.push(p);
  }
  return out.sort();
}

let built;
async function site() {
  if (!built) {
    const out = mkdtempSync(join(tmpdir(), 'sf-style-'));
    await buildSite({ root: ROOT, out });
    built = out;
  }
  return built;
}

const text = (s) => s.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
function rules(name) {
  const r = JSON.parse(readFileSync(join(ROOT, 'src/skills', name, 'RULES.json'), 'utf8'));
  return { total: r.length, machine: r.filter((x) => x.check).length };
}

test('site.css: no serif fonts and no italics', async () => {
  const css = readFileSync(join(await site(), 'assets', 'site.css'), 'utf8');
  for (const m of css.matchAll(/font(?:-family)?\s*:([^;}]*)/gi)) {
    assert.doesNotMatch(m[1], /(^|[\s,"'])serif\b|Newsreader|Georgia|Times/i, m[0]);
  }
  assert.doesNotMatch(css, /font-style\s*:\s*italic/i);
});

test('no rail, no 01 / 05 numbering in any page', async () => {
  for (const f of htmlFiles(await site())) {
    const html = readFileSync(f, 'utf8');
    assert.doesNotMatch(html, /<[a-z0-9-]*rail[a-z0-9-]*[\s>]/i, f);
    for (const m of html.matchAll(/class="([^"]*)"/g)) assert.doesNotMatch(m[1], /rail/i, f);
    assert.doesNotMatch(text(html), /\b0\d\s*\/\s*0\d\b/, f);
  }
});

test('cards: plate index, type, get and honest meter', async () => {
  const html = readFileSync(join(await site(), 'index.html'), 'utf8');
  const plates = [...html.matchAll(/<article class="plate[^"]*" data-skill="([^"]+)"[\s\S]*?<\/article>/g)];
  assert.equal(plates.length, ready.length);
  const names = plates.map((p) => p[1]);
  for (const [i, s] of ready.entries()) {
    const idx = names.indexOf(s.name);
    assert.ok(idx >= 0, s.name);
    const p = plates[idx][0];
    const ix = p.match(/<span class="plate-index">([^<]*)<\/span>/);
    assert.ok(ix && /^No\. \d\d$/.test(ix[1].trim()), s.name);
    assert.equal(ix[1].trim(), `No. ${String(i + 1).padStart(2, '0')}`);
    assert.match(p, /<p class="plate-type">You type: <code>[^<]+<\/code><\/p>/, s.name);
    assert.match(p, /<p class="plate-get">You get: [^<]/, s.name);
    const r = rules(s.name);
    const m = p.match(/<div class="meter" data-machine="(\d+)" data-total="(\d+)"[^>]*>/);
    assert.ok(m, `${s.name} meter`);
    assert.equal(Number(m[1]), r.machine);
    assert.equal(Number(m[2]), r.total);
    assert.ok(text(p).includes(`${r.machine} of ${r.total} rules machine-checked`), s.name);
  }
});

test('skill pages: four questions in order with takeaways', async () => {
  const out = await site();
  const ids = ['what-it-does', 'what-you-type', 'what-you-get', 'how-you-know'];
  for (const s of ready) {
    const html = readFileSync(join(out, 'skills', s.name, 'index.html'), 'utf8');
    assert.match(html, /<nav class="qbar[^"]*"/, s.name);
    assert.match(html, /class="qbar-progress"/, s.name);
    let last = -1;
    for (const id of ids) {
      const at = html.search(new RegExp(`<section[^>]*id="${id}"[^>]*>`));
      assert.ok(at > last, `${s.name} #${id} order`);
      last = at;
      const after = html.slice(at).replace(/^<section[^>]*>\s*/, '');
      assert.match(after, /^<p class="takeaway"><strong>[^<]+[.!?]<\/strong><\/p>/, `${s.name} #${id} takeaway`);
    }
    const r = rules(s.name);
    const hk = html.slice(html.indexOf('id="how-you-know"'));
    assert.match(hk.slice(0, hk.indexOf('</section>')), new RegExp(`data-machine="${r.machine}" data-total="${r.total}"`));
  }
});

test('download buttons name skill, version and size in KB', async () => {
  const out = await site();
  let seen = 0;
  for (const f of htmlFiles(out)) {
    const html = readFileSync(f, 'utf8');
    for (const m of html.matchAll(/<a\b[^>]*href="([^"]*downloads\/[^"#?]+\.zip)"[^>]*>([\s\S]*?)<\/a>/g)) {
      const bytes = statSync(resolve(dirname(f), m[1])).size;
      const kb = `${Math.max(1, Math.round(bytes / 1024))} KB`;
      const t = text(m[2]);
      if (/class="dl-all"/.test(m[0])) { assert.equal(t, `Download all skills (.zip, ${kb})`, f); continue; }
      const s = registry.find((x) => t.startsWith(`Download ${x.name} `));
      assert.ok(s, `${f}: ${t}`);
      assert.equal(t, `Download ${s.name} ${s.version} (.zip, ${kb})`, f);
      seen++;
    }
  }
  assert.ok(seen >= ready.length);
});

test('site.css: reduced motion disables hero animation', async () => {
  const css = readFileSync(join(await site(), 'assets', 'site.css'), 'utf8');
  const blocks = [...css.matchAll(/@media[^{]*prefers-reduced-motion:\s*reduce[^{]*\{/g)];
  assert.ok(blocks.length > 0);
  const ok = blocks.some((b) => {
    let i = b.index + b[0].length, depth = 1;
    while (i < css.length && depth) { if (css[i] === '{') depth++; else if (css[i] === '}') depth--; i++; }
    const body = css.slice(b.index, i);
    return body.includes('.hero-part') && body.includes('.hero-prompt') && /animation\s*:\s*none/.test(body);
  });
  assert.ok(ok, 'reduced-motion block covering .hero-part and .hero-prompt with animation: none');
});

/** @param {string} html @param {string} id @returns {string} */
function section(html, id) {
  if (typeof html !== 'string' || typeof id !== 'string') throw new TypeError('html and id required');
  const at = html.search(new RegExp(`<section[^>]*id="${id}"`));
  if (at < 0) return '';
  const rest = html.slice(at);
  return rest.slice(0, rest.indexOf('</section>'));
}

test('dl-all: one all-skills link on index with KB size', async () => {
  const out = await site();
  const html = readFileSync(join(out, 'index.html'), 'utf8');
  const m = html.match(/<a\b[^>]*class="dl-all"[^>]*>([\s\S]*?)<\/a>/);
  assert.ok(m, 'a.dl-all on index');
  assert.match(m[0], /href="downloads\/all-skills\.zip"/);
  const bytes = statSync(join(out, 'downloads', 'all-skills.zip')).size;
  assert.equal(text(m[1]), `Download all skills (.zip, ${Math.max(1, Math.round(bytes / 1024))} KB)`);
  for (const f of htmlFiles(out)) {
    const h = readFileSync(f, 'utf8');
    for (const z of h.matchAll(/<a\b[^>]*href="([^"]*downloads\/[^"#?]+\.zip)"[^>]*>([\s\S]*?)<\/a>/g)) {
      if (/class="dl-all"/.test(z[0])) assert.match(z[1], /all-skills\.zip$/, f);
      else assert.ok(registry.some((x) => text(z[2]).startsWith(`Download ${x.name} `)), `${f}: ${text(z[2])}`);
    }
  }
});

test('example frame: no lazy loading, sandbox allow-scripts, open link', async () => {
  const out = await site();
  const withEx = ready.filter((s) => statSync(join(ROOT, 'src/skills', s.name, 'preview'), { throwIfNoEntry: false }) && (() => { try { statSync(join(ROOT, 'src/skills', s.name, 'preview', 'example.html')); return true; } catch { return false; } })());
  assert.ok(withEx.length > 0, 'at least one skill with an example');
  for (const s of withEx) {
    const html = readFileSync(join(out, 'skills', s.name, 'index.html'), 'utf8');
    const f = html.match(/<iframe\b[^>]*>/);
    assert.ok(f, s.name);
    assert.doesNotMatch(f[0], /\sloading=/, s.name);
    assert.match(f[0], /\ssandbox="allow-scripts"/, s.name);
    assert.match(html, /<a\b[^>]*class="example-open"[^>]*href="example\.html"|<a\b[^>]*href="example\.html"[^>]*class="example-open"/, s.name);
  }
});

test('what you get: skills without example show get-cover svg', async () => {
  const out = await site();
  for (const s of ready) {
    let hasEx = true;
    try { statSync(join(ROOT, 'src/skills', s.name, 'preview', 'example.html')); } catch { hasEx = false; }
    if (hasEx) continue;
    const sec = section(readFileSync(join(out, 'skills', s.name, 'index.html'), 'utf8'), 'what-you-get');
    assert.match(sec, /<svg\b[^>]*class="[^"]*get-cover|class="[^"]*get-cover[^"]*"[^>]*>\s*<svg\b/, s.name);
  }
});

test('theme and language buttons say what they do', async () => {
  const pattern = (a) => new RegExp(String.raw`<button\b[^>]*data-action="${a}"[^>]*>([\s\S]*?)<\/button>`);
  let checked = 0;
  for (const f of htmlFiles(await site())) {
    const html = readFileSync(f, 'utf8');
    if (/[\\/]example\.html$/.test(f)) continue; // the skill's own demo page, not a site page
    const theme = html.match(pattern('theme'));
    const lang = html.match(pattern('lang'));
    assert.ok(theme && lang, `${f}: theme and lang buttons present`);
    const tt = text(theme[1]);
    assert.ok(/^Switch to (dark|light) theme$/.test(tt), `${f} theme: ${tt}`);
    // Pages are built in English; the language button names its target in that language's own script.
    assert.equal(text(lang[1]), 'អានជាភាសាខ្មែរ', `${f} lang`);
    checked++;
  }
  assert.ok(checked > 0, 'checked at least one page');
});

test('language button labels: Khmer label in Khmer script, English label in English', async () => {
  const { DICTS } = await import('../src/site/lib/i18n.mjs');
  assert.equal(DICTS.en['lang.toKh'], 'អានជាភាសាខ្មែរ');
  assert.equal(DICTS.kh['lang.toKh'], 'អានជាភាសាខ្មែរ');
  assert.equal(DICTS.en['lang.toEn'], 'Read in English');
  assert.equal(DICTS.kh['lang.toEn'], 'Read in English');
});

test('site.css: var(--ok) only in qbar, progress, meter or focus-visible rules', async () => {
  const css = readFileSync(join(await site(), 'assets', 'site.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  for (const m of css.matchAll(/([^{}]*)\{([^{}]*)\}/g)) {
    if (!m[2].includes('var(--ok)')) continue;
    assert.match(m[1], /qbar|progress|meter|focus-visible/, `var(--ok) in rule: ${m[1].trim()}`);
  }
});

test('plate covers do not repeat the skill title', async () => {
  const html = readFileSync(join(await site(), 'index.html'), 'utf8');
  for (const p of html.matchAll(/<article class="plate[^"]*" data-skill="([^"]+)"[\s\S]*?<\/article>/g)) {
    const s = registry.find((x) => x.name === p[1]);
    const svg = p[0].match(/<svg\b[\s\S]*?<\/svg>/);
    if (!svg) continue;
    for (const t of svg[0].matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/g)) {
      const v = text(t[1]).toLowerCase();
      assert.notEqual(v, s.name.toLowerCase(), s.name);
      if (s.title) assert.notEqual(v, String(s.title).toLowerCase(), s.name);
    }
  }
});
