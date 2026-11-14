/**
 * The showcase shows real output, never a mock (L3, docs/PROJECT.md section 4):
 * every ready skill's cover is a recorded figure run or a real agent's answer drawn as a document, the answer on its
 * page is word for word the recording, and a hand-drawn cover can only appear with a visible "concept" label.
 * @governed-by PO_ARCHITECT
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, cpSync, writeFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { buildSite } from '../src/site/build.mjs';
import { loadSkills } from '../src/site/lib/content.mjs';
import { loadProof, docFigure, figureLines, wrap } from '../src/site/lib/proof.mjs';
import { sanitizeSvg } from '../src/site/lib/svg.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const registry = JSON.parse(readFileSync(join(ROOT, 'src', 'factory', 'registry.json'), 'utf8'));
const ready = registry.filter((s) => s.status === 'ready').map((s) => s.name).sort();
const unesc = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');

let built;
async function site() {
  if (!built) { const out = mkdtempSync(join(tmpdir(), 'sf-real-')); await buildSite({ root: ROOT, out }); built = out; }
  return built;
}

test('every ready skill shows real output on the collection page, never an unlabelled drawing', async () => {
  const html = readFileSync(join(await site(), 'index.html'), 'utf8');
  for (const name of ready) {
    const plate = new RegExp(`<article class="plate" data-skill="${name}"[\\s\\S]*?</article>`).exec(html);
    assert.ok(plate, `${name}: plate missing`);
    const kind = /data-cover="(\w+)"/.exec(plate[0])?.[1];
    assert.ok(['run', 'proof'].includes(kind), `${name}: cover is "${kind}"; a ready skill must show a recorded run or a real agent answer`);
    assert.match(plate[0], /class="cover-tag" data-kind="(run|proof)"/, `${name}: the cover says it is real output`);
  }
});

test('the answer on each skill page is the recording, word for word, with the request it was given', async () => {
  const out = await site();
  for (const name of ready) {
    const proof = loadProof(join(ROOT, 'src', 'skills', name), { showcase: registry.find((r) => r.name === name).showcase });
    const page = readFileSync(join(out, 'skills', name, 'index.html'), 'utf8');
    if (!proof) { assert.match(page, /data-cover="run"/, `${name}: no real answer and no recorded run`); continue; }
    const shown = /<pre class="proof-answer" lang="en">([\s\S]*?)<\/pre>/.exec(page);
    assert.ok(shown, `${name}: the real answer is not on the page`);
    assert.equal(unesc(shown[1]), proof.answer, `${name}: the answer on the page differs from the recording`);
    assert.ok(page.includes(`<code lang="en">${proof.prompt.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')}</code>`), `${name}: the request is not shown`);
    assert.match(page, /data-proof-source="(portable|live)"/);
    const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    assert.ok(page.includes(`<button type="button" class="btn copy" data-copy="${esc(proof.answer)}"><span data-i18n="answer.copy">`), `${name}: the copy button does not copy the exact answer`);
  }
});

test('the "You type" prompt and the shown answer come from the same recording', async () => {
  for (const s of loadSkills(ROOT)) {
    if (s.coverKind === 'proof') assert.equal(s.prompt, s.proof.prompt, `${s.name}: prompt and answer come from different sources`);
  }
});

test('a skill without real output gets a visibly labelled concept cover', async () => {
  const fake = mkdtempSync(join(tmpdir(), 'sf-concept-'));
  cpSync(join(ROOT, 'src', 'skills', 'copy-tight'), join(fake, 'skills', 'copy-tight'), { recursive: true });
  // remove every real recording, so only the hand-drawn preview cover is left
  for (const f of ['evals/portable.json']) writeFileSync(join(fake, 'skills', 'copy-tight', f), '{}');
  const reg = join(fake, 'registry.json');
  writeFileSync(reg, JSON.stringify([{ name: 'copy-tight', version: '0.2.0', status: 'ready' }]));
  const live = join(fake, 'skills', 'copy-tight', 'evals', 'live');
  for (const f of ['button-name-kept', 'error-message', 'legal-unchanged', 'already-tight', 'length-limit-not-met', 'mixed-legal', 'placeholders-kept', 'error-no-new-step']) writeFileSync(join(live, `${f}.json`), '{"prompt":"x","output":""}');
  const [s] = loadSkills(ROOT, { registryPath: reg, skillsRoot: join(fake, 'skills'), runsRoot: join(fake, 'runs') });
  assert.equal(s.coverKind, 'concept');
  const { renderCard } = await import('../src/site/lib/render.mjs');
  const card = renderCard(s, { index: 1 });
  assert.match(card, /data-cover="concept"/);
  assert.match(card, /class="cover-tag" data-kind="concept"[^>]*>Concept drawing, not real output</);
});

test('the document figure is safe, uses only tokens, and keeps the text of the answer', () => {
  const svg = docFigure({ prompt: 'shorten: "Click here <now>"', answer: '```\nRewritten copy:\nSave & go\n```\n' + 'word '.repeat(200) });
  assert.equal(sanitizeSvg(svg), svg.trim());
  assert.doesNotMatch(svg, /fill="#|stroke="#/);
  assert.match(svg, /Rewritten copy:/);
  assert.match(svg, /Save &amp; go/);
  assert.match(svg, /&lt;now&gt;/);
  assert.doesNotMatch(svg, /```/, 'fence markers are formatting, not content');
  assert.match(svg, /continues on the page/, 'a long answer says it continues');
  assert.deepEqual(wrap('aa bb cc', 5), ['aa bb', 'cc']);
  assert.equal(figureLines('a\n\n\nb').lines.join('|'), 'a||b');
});

test('no line of the document figure is wider than its text column', () => {
  const long = 'Supercalifragilistic expialidocious words and a very long request that goes on and on and on for a while';
  const svg = docFigure({ prompt: long, answer: Array.from({ length: 30 }, () => long).join('\n') });
  const texts = [...svg.matchAll(/<text [^>]*>([^<]*)<\/text>/g)].map((m) => unesc(m[1]));
  // 42 characters of 11px monospace is about 277 units; the text column is 292 units (360 wide, 22 margin, 16 inset, 8 right).
  for (const t of texts) assert.ok(t.length <= 42, `"${t}" is ${t.length} characters`);
});

test('text skills are drawn as objects, and every word in an object is cut from the recording', async () => {
  const { objectFigure, KINDS, DEFAULT_LABELS } = await import('../src/site/lib/objects.mjs');
  const flat = (s) => s.replace(/\s+/g, ' ');
  const check = (name, kinds, proof) => {
    const svg = objectFigure(kinds, proof);
    assert.ok(svg, `${name}: no object could be drawn from the real answer`);
    assert.equal(sanitizeSvg(svg), svg.trim(), `${name}: object figure is not safe`);
    const source = flat(proof.prompt + ' ' + proof.answer);
    for (const m of svg.matchAll(/<text [^>]*class="([^"]+)"[^>]*>([^<]*)<\/text>/g)) {
      if (m[1] === 'obj-label') continue;
      const t = unesc(m[2]).replace(/…$/, '');
      assert.ok(source.includes(t), `${name}: "${t}" is not in the recording`);
    }
    return svg;
  };
  for (const s of loadSkills(ROOT)) {
    if (s.coverKind !== 'proof' || !KINDS[s.name]) continue;
    check(s.name, KINDS[s.name], s.proof);
    assert.match(s.coverSvg, /class="obj doc-figure"/, `${s.name}: cover is not the object`);
  }
  const { loadRecipeProofs } = await import('../src/site/lib/content.mjs');
  for (const r of loadRecipeProofs(ROOT)) check(r.id, r.used.flatMap((u) => KINDS[u] ?? []), r);
  assert.ok(Object.values(DEFAULT_LABELS).every((l) => l.length < 12), 'captions stay short');
});

test('every skill page has a banner drawn from its real output, safe and self-contained', async () => {
  const out = await site();
  const { bannerSvg } = await import('../src/site/lib/banner.mjs');
  for (const s of loadSkills(ROOT)) {
    const svg = readFileSync(join(out, 'skills', s.name, 'banner.svg'), 'utf8');
    assert.equal(sanitizeSvg(svg), svg.trim(), `${s.name}: banner is not safe`);
    assert.match(svg, /viewBox="0 0 1280 640"/);
    assert.ok(svg.includes(`>${s.version}<`), `${s.name}: version`);
    assert.match(svg, /\.sf-banner\{--bg:/, `${s.name}: standalone banner defines its colours`);
    const inner = /^<svg\b[^>]*>([\s\S]*)<\/svg>$/.exec(s.coverSvg.trim())[1];
    assert.ok(svg.includes(inner), `${s.name}: the banner must contain the real cover unchanged`);
    assert.match(svg, s.coverKind === 'concept' ? /Concept drawing, not real output/ : /Real output from an agent/);
    assert.ok(svg.includes(s.factoryOnly ? 'Works inside the Skill Foundry repository' : `npx github:sumtaimo/Skill-Foundry add ${s.name}`));
    assert.match(readFileSync(join(out, 'skills', s.name, 'index.html'), 'utf8'), /<img src="banner\.svg"/);
    assert.doesNotMatch(bannerSvg(s), /\.sf-banner\{--bg:/, 'inline banners use the page theme');
  }
});

test('banner text fits its column even with wide fallback fonts', async () => {
  const { bannerSvg, TEXT_MAX } = await import('../src/site/lib/banner.mjs');
  for (const s of loadSkills(ROOT)) {
    const svg = bannerSvg(s);
    for (const m of svg.matchAll(/<text x="(\d+)"[^>]*class="bn-([tm])"[^>]*font-size="([\d.]+)"[^>]*>([^<]*)<\/text>/g)) {
      const [, x, kind, size, raw] = m;
      if (Number(x) >= 680) continue; // inside the cover panel
      const t = raw.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
      const w = t.length * Number(size) * (kind === 'm' ? 0.62 : 0.68);
      assert.ok(Number(x) + w <= 72 + TEXT_MAX + 36, `${s.name}: "${t}" may run into the cover (${Math.round(Number(x) + w)})`);
    }
  }
});
