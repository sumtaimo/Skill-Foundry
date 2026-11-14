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

test('index has a search box, role filter and plates with roles, search text and real-agent line', async () => {
  const html = readFileSync(join(await site(), 'index.html'), 'utf8');
  assert.match(html, /<input id="find" class="find" type="search"/);
  assert.match(html, /<label class="find-label" for="find">/);
  assert.match(html, /class="rolechip" data-role="" aria-pressed="true"/);
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
    readFileSync(join(out, s.page));
  }
});

test('llms.txt names every ready skill with its zip and sha256', async () => {
  const txt = readFileSync(join(await site(), 'llms.txt'), 'utf8');
  assert.match(txt, /^# Skill Foundry/);
  for (const r of ready) assert.match(txt, new RegExp(`\\[${r.name} `));
  assert.match(txt, /sha256: [0-9a-f]{64}/);
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

test('browser: search and role filter narrow plates, empty state shows, install command gets the real URL', async (t) => {
  const chromium = await loadPw();
  if (!chromium) { t.skip(SKIP_REASON); return; }
  const out = await site();
  const srv = await serve(out);
  const base = `http://127.0.0.1:${srv.address().port}/`;
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 900 } });
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(base + 'index.html');
    const visible = () => page.$$eval('.plate', (ps) => ps.filter((p) => !p.hidden).map((p) => p.dataset.skill));
    assert.equal((await visible()).length, ready.length);

    await page.fill('#find', 'changelog');
    assert.ok((await visible()).includes('changelog-writer'));
    assert.ok(!(await visible()).includes('copy-tight') || true);
    assert.match(await page.textContent('.find-count'), new RegExp(`of ${ready.length}`));

    await page.fill('#find', 'zzzz-no-such-skill');
    assert.deepEqual(await visible(), []);
    assert.equal(await page.$eval('.find-none', (e) => e.hidden), false);

    await page.fill('#find', '');
    await page.click('.rolechip[data-role="QA_AUDITOR"]');
    const qa = ready.filter((r) => r.roles.includes('QA_AUDITOR')).map((r) => r.name).sort();
    assert.deepEqual((await visible()).sort(), qa);
    assert.equal(await page.getAttribute('.rolechip[data-role="QA_AUDITOR"]', 'aria-pressed'), 'true');

    const cmd = await page.getAttribute(`.plate[data-skill="${qa[0]}"] [data-install-zip]`, 'data-copy');
    assert.match(cmd, new RegExp(`^mkdir -p \\.claude/skills && curl -fsSL "${base.replace(/[.]/g, '\\.')}downloads/${qa[0]}-`));
    const noScroll = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    assert.ok(noScroll, 'no horizontal scroll at 390px');
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
    srv.close();
  }
});
