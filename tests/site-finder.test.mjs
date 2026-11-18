/**
 * Landing for agents and users: roles, search, real-agent results, machine index, install command.
 * Browser checks skip without playwright.
 * @governed-by PO_ARCHITECT
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { join, dirname, resolve, extname } from 'node:path';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { buildSite } from '../src/site/build.mjs';
import { installOneLiner } from '../src/site/lib/render.mjs';
import { ROLES } from '../src/site/lib/content.mjs';
import { DICTS } from '../src/site/lib/i18n.mjs';
import { SKIP_REASON } from '../src/factory/visual.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const registry = JSON.parse(readFileSync(join(ROOT, 'src/factory/registry.json'), 'utf8'));
const ready = registry.filter((s) => s.status === 'ready');
let built;
async function site() {
  if (!built) { built = mkdtempSync(join(tmpdir(), 'sf-finder-')); await buildSite({ root: ROOT, out: built }); }
  return built;
}

test('every ready skill declares at least one known agent role', () => {
  for (const r of ready) {
    assert.ok(Array.isArray(r.roles) && r.roles.length > 0, `${r.name} has no roles`);
    for (const role of r.roles) assert.ok(ROLES.includes(role), `${r.name}: unknown role ${role}`);
  }
});

test('index has plates with roles, search text and real-agent line (no search box or role filter: ten skills fit on a page)', async () => {
  const html = readFileSync(join(await site(), 'index.html'), 'utf8');
  assert.doesNotMatch(html, /<input id="find"|class="rolechip"/, 'the landing has no search box and no role filter');
  for (const r of ready) {
    const plate = new RegExp(`<article class="plate" data-skill="${r.name}" data-roles="${r.roles.join(' ')}" data-text="[^"]+">`);
    assert.match(html, plate, `plate for ${r.name}`);
  }
  assert.match(html, /class="live live-(yes|no)"/);
  assert.match(html, /href="skills\.json"/);
  assert.match(html, /href="llms\.txt"/);
});

test('real-agent line is honest: yes only with recordings, no for a skill without them', async () => {
  const html = readFileSync(join(await site(), 'index.html'), 'utf8');
  for (const r of ready) {
    const block = html.split(`<article class="plate" data-skill="${r.name}"`)[1].split('</article>')[0];
    let hasLive = false;
    try { readFileSync(join(ROOT, 'src/skills', r.name, 'evals/live', JSON.parse(readFileSync(join(ROOT, 'src/skills', r.name, 'evals/cases.json'), 'utf8'))[0].id + '.json')); hasLive = true; } catch { /* none */ }
    assert.match(block, hasLive ? /data-live="\d+\/\d+"/ : /data-live="none"/, r.name);
  }
});

test('skills.json lists every ready skill with zip, sha256 matching the file, roles and description', async () => {
  const out = await site();
  const idx = JSON.parse(readFileSync(join(out, 'skills.json'), 'utf8'));
  assert.deepEqual(idx.skills.map((s) => s.name).sort(), ready.map((r) => r.name).sort());
  for (const s of idx.skills) {
    const buf = readFileSync(join(out, s.zip));
    assert.equal(createHash('sha256').update(buf).digest('hex'), s.sha256, s.name);
    assert.equal(buf.length, s.bytes);
    assert.ok(s.description.length > 20 && s.roles.length > 0, s.name);
    const factoryOnly = /^scope:\s*factory/m.test(readFileSync(join(ROOT, 'src/skills', s.name, 'SKILL.md'), 'utf8'));
    assert.equal(s.npxInstallCommand, factoryOnly ? null : `npx github:sumtaimo/Skill-Foundry add ${s.name}`, `${s.name} npxInstallCommand is the primary install`);
    assert.equal(s.installCommand, s.npxInstallCommand, `${s.name} installCommand is the npx command`);
    assert.ok(s.zipInstallCommand.includes(`"{base}${s.zip}"`) && s.zipInstallCommand.includes(s.sha256), `${s.name} zipInstallCommand stays as the no-Node fallback`);
    readFileSync(join(out, s.page));
  }
});

test('llms.txt names every ready skill with its zip and sha256', async () => {
  const txt = readFileSync(join(await site(), 'llms.txt'), 'utf8');
  assert.match(txt, /^# Skill Foundry/);
  for (const r of ready) assert.match(txt, new RegExp(`\\[${r.name} `));
  assert.match(txt, /sha256: [0-9a-f]{64}/);
  assert.match(txt, /install: npx github:sumtaimo\/Skill-Foundry add [a-z0-9-]+/);
  assert.match(txt, /zip-fallback: mkdir -p \.claude\/skills && curl -fsSL "\{base\}downloads\//);
  assert.ok(txt.indexOf('npx github:sumtaimo/Skill-Foundry add') < txt.indexOf('zip-fallback:'), 'npx comes before the zip fallback');
  for (const c of ['doctor', 'check', 'update', 'remove']) assert.match(txt, new RegExp(`\\b${c}\\b`), `llms.txt names ${c}`);
});

test('installOneLiner downloads, verifies the sha256 and unzips into .claude/skills', () => {
  const cmd = installOneLiner({ name: 'x', version: '1.0.0' }, 'a'.repeat(64), 'https://e.test/downloads/x-1.0.0.zip');
  assert.match(cmd, /curl -fsSL "https:\/\/e\.test\/downloads\/x-1\.0\.0\.zip" -o "x-1\.0\.0\.zip"/);
  assert.match(cmd, /shasum -a 256 -c -/);
  assert.match(cmd, /unzip -oq "x-1\.0\.0\.zip" -d \.claude\/skills/);
});

async function loadPw() {
  try { const mod = 'playwright'; const pw = await import(mod); return pw.chromium ?? pw.default?.chromium; } catch { return null; }
}

function serve(dir) {
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.zip': 'application/zip', '.txt': 'text/plain' };
  const srv = createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    try { const b = readFileSync(join(dir, p)); res.writeHead(200, { 'content-type': types[extname(p)] || 'application/octet-stream' }); res.end(b); }
    catch { res.writeHead(404); res.end(); }
  });
  return new Promise((ok) => srv.listen(0, '127.0.0.1', () => ok(srv)));
}

test('browser: the hero copies the one install command, the agent prompt and the repo-only zip get the real URL', async (t) => {
  const chromium = await loadPw();
  if (!chromium) { t.skip(SKIP_REASON); return; }
  const out = await site();
  const srv = await serve(out);
  const base = `http://127.0.0.1:${srv.address().port}/`;
  let browser;
  try {
    browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 390, height: 900 } });
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(base + 'index.html');
    assert.equal(await page.$$eval('.plate', (ps) => ps.filter((p) => !p.hidden).length), ready.length, 'every ready skill has a card');
    const cmd = await page.getAttribute('.hero-install button[data-copy]', 'data-copy');
    assert.equal(cmd, 'npx github:sumtaimo/Skill-Foundry add --all', 'the hero copies the one install command');
    assert.equal(await page.$('.plate button[data-copy]'), null, 'no card has an install button');
    const prompt = await page.getAttribute('[data-agent-prompt]', 'data-copy');
    assert.ok(prompt.startsWith(`Read ${base}llms.txt.`) && !prompt.includes('{site}'), 'agent prompt gets the real address');
    await page.goto(base + 'skills/skill-smith/index.html');
    const zip = await page.getAttribute('[data-install-zip]', 'data-copy');
    assert.match(zip, new RegExp(`^mkdir -p \\.claude/skills && curl -fsSL "${base.replace(/[.]/g, '\\.')}downloads/skill-smith-`), 'factory-only skills copy the zip command with the real URL');
    const noScroll = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    assert.ok(noScroll, 'no horizontal scroll at 390px');
    assert.deepEqual(errors, []);
  } finally {
    await browser?.close();
    srv.close();
  }
});

test('landing order: hero, real result, skills, proof, install, agents, limits, questions', async () => {
  const html = readFileSync(join(await site(), 'index.html'), 'utf8');
  const at = (re) => { const m = re.exec(html); assert.ok(m, String(re)); return m.index; };
  const order = [/<section class="hero"/, /<section id="result"/, /<section id="collection"/, /<section id="proof"/, /<section id="install"/, /<section id="agents"/, /<section id="limits"/, /<section id="questions"/].map(at);
  assert.deepEqual([...order].sort((a, b) => a - b), order);
  assert.equal((html.match(/class="btn primary/g) || []).length, 1, 'one primary action on the landing page');
  assert.match(html, /<button type="button" class="btn primary copy" data-copy="npx github:sumtaimo\/Skill-Foundry add --all">/, 'the one primary action is the single install command in the hero');
  const hero = html.slice(html.indexOf('<section class="hero"'), html.indexOf('<section id="result"'));
  assert.equal((hero.match(/class="npx-cmd"/g) || []).length, 1, 'the hero shows exactly one npx command');
  assert.match(hero, /class="ver"[^>]*>Skill Foundry version \d+\.\d+\.\d+</, 'the project version is shown in the hero, labelled as the project');
  assert.doesNotMatch(html, /hero-chips|class="chip" data-skill/, 'no skill chips in the hero');
});

test('install panel: npx commands in workflow order, each with its own copy button, zip fallback labelled', async () => {
  const html = readFileSync(join(await site(), 'index.html'), 'utf8');
  const panel = html.slice(html.indexOf('<section id="install"'), html.indexOf('<section id="agents"'));
  const cmds = [...panel.matchAll(/<code class="npx-cmd">([^<]+)<\/code><\/pre><button type="button" class="btn copy" data-copy="([^"]+)"/g)];
  assert.deepEqual(cmds.map((m) => m[1].replace('npx github:sumtaimo/Skill-Foundry ', '')), ['add &lt;skill&gt;', 'add --role QA_AUDITOR', 'add --all', 'doctor', 'check', 'update', 'remove &lt;skill&gt;']);
  assert.match(panel, /<details class="acc">\s*<summary><span data-i18n="install\.more">/, 'the other commands are folded under one summary');
  assert.ok(panel.lastIndexOf('<summary>') > panel.lastIndexOf('npx-cmd'), 'the zip fallback comes after every npx command');
  assert.match(panel, /<summary><span data-i18n="install\.fallback">No Node\.js\? Use the zip instead<\/span><\/summary>/);
  assert.doesNotMatch(panel, /<details[^>]*\sopen/, 'fallback is closed by default');
});

test('the site knows all eight roles in both languages, and the UX designer has two ready skills', async () => {
  const html = readFileSync(join(await site(), 'index.html'), 'utf8');
  assert.deepEqual(ROLES, ['PO_ARCHITECT', 'BA_ANALYST', 'DEV_ENGINEER', 'QA_AUDITOR', 'UX_DESIGNER', 'REVIEWER', 'SECURITY', 'COORDINATOR']);
  for (const lang of ['en', 'kh']) for (const role of ROLES) assert.ok(DICTS[lang][`role.${role}`], `${lang} label for ${role}`);
  const byName = Object.fromEntries(ready.map((r) => [r.name, r.roles]));
  assert.ok(byName['design-system'].includes('UX_DESIGNER') && byName['ux-review'].includes('UX_DESIGNER'));
  assert.deepEqual(ready.filter((r) => r.roles.includes('UX_DESIGNER')).map((r) => r.name).sort(), ['design-system', 'ux-review']);
});

test('top bar links to skills, install and agents on the index (no proof link: the page has no per-page proof, and fewer links keep the bar short)', async () => {
  const html = readFileSync(join(await site(), 'index.html'), 'utf8');
  for (const id of ['collection', 'install', 'agents']) assert.match(html, new RegExp(`href="index\\.html#${id}"`));
  assert.doesNotMatch(html.slice(0, html.indexOf('</header>')), /href="index\.html#proof"/, 'the top bar has no Proof link on the index');
  assert.doesNotMatch(html, /<nav class="toc"/, 'no second contents strip that repeats the top bar');
});

test('proof table: one row per ready skill with real recorded numbers', async () => {
  const html = readFileSync(join(await site(), 'index.html'), 'utf8');
  const table = html.slice(html.indexOf('<table class="proof">'), html.indexOf('</table>'));
  for (const r of ready) assert.match(table, new RegExp(`skills/${r.name}/index\\.html`));
  assert.match(table, /\d+ \/ \d+/);
});

test('agent prompt gives npx first, the zip as fallback, and shows no raw placeholder without JavaScript', async () => {
  const html = readFileSync(join(await site(), 'index.html'), 'utf8');
  const shown = /<code class="agent-prompt">([^<]*)<\/code>/.exec(html)[1];
  assert.match(shown, /^Read the llms\.txt file on this site\./);
  assert.ok(shown.indexOf('npx') < shown.indexOf('zip-fallback'), 'npx before zip');
  assert.doesNotMatch(shown, /\{site\}/, 'no raw {site} in the visible text');
  assert.match(html, /data-agent-prompt="Read \{site\}llms\.txt\./);
});

test('skill page: hero Install jumps to its own install block, which holds the npx command and the zip fallback', async () => {
  const name = ready.find((r) => r.name === 'ux-review').name;
  const html = readFileSync(join(await site(), 'skills', name, 'index.html'), 'utf8');
  const h0 = html.indexOf('<header class="skill-head">');
  const head = html.slice(h0, html.indexOf('</header>', h0));
  assert.match(head, /<a class="btn primary" href="#install">/);
  const inst = html.slice(html.indexOf('<section id="install"'), html.indexOf('</section>', html.indexOf('<section id="install"')));
  assert.match(inst, new RegExp(`<code class="npx-cmd">npx github:sumtaimo/Skill-Foundry add ${name}</code></pre><button type="button" class="btn copy" data-copy="npx github:sumtaimo/Skill-Foundry add ${name}">`));
  assert.match(inst, /data-install-zip="downloads\//);
  assert.ok(inst.indexOf('npx-cmd') < inst.indexOf('data-install-zip'), 'npx first');
  const smith = readFileSync(join(await site(), 'skills', 'skill-smith', 'index.html'), 'utf8');
  assert.doesNotMatch(smith, /npx-cmd/, 'factory-only skills are zip-only');
});

test('the Install section says Skill Foundry installs only the skills and wires into an existing harness (en + kh); the For-agents section does not repeat it', async () => {
  const html = readFileSync(join(await site(), 'index.html'), 'utf8');
  const install = html.slice(html.indexOf('<section id="install"'), html.indexOf('<section id="agents"'));
  const agents = html.slice(html.indexOf('<section id="agents"'), html.indexOf('<section id="limits"'));
  assert.match(install, /data-i18n="install\.scope"/, 'install section carries the scope note');
  assert.doesNotMatch(agents, /data-i18n="install\.scope"/, 'the same note is not repeated under For agents');
  assert.match(DICTS.en['install.scope'], /only the skills/);
  assert.match(DICTS.en['install.scope'], /existing agentic harness/);
  assert.match(DICTS.en['install.scope'], /Agentic-Harness/);
  assert.match(DICTS.kh['install.scope'], /Agentic-Harness/);
  assert.match(DICTS.kh['install.scope'], /[ក-៿]/);
});
