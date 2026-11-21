#!/usr/bin/env node
/**
 * browser-check engine: opens a local page in a real browser (Playwright), runs the steps of one user flow,
 * takes screenshots and collects console errors, page errors and failed requests, then prints a Markdown
 * report to copy into the reply. It is the fallback when the agent has no Playwright MCP browser tools.
 *
 * Run as ONE plain command with the path of this file:
 *   node <skill>/engine/check.mjs --file <page.html> [--steps <steps.json>] [--out <dir>] [--widths 1280,390]
 *   node <skill>/engine/check.mjs --url http://localhost:3000/ [--steps <steps.json>] [--allow-host <host>]
 *
 * Steps file: a JSON array, e.g. [{"do":"fill","target":"label=Email","value":"a@example.test"},{"do":"click","target":"text=Sign in"},
 *   {"do":"expect-text","value":"Welcome"}]. Actions: goto, click, fill, press, select, check, expect-text, expect-no-text,
 *   expect-url, wait, screenshot. Targets: "text=...", "label=...", "role=button[name=...]", "placeholder=..." or a CSS selector.
 * Exit codes: 0 every step passed and no page error, 1 a step failed or the page threw, 2 the check could not run.
 * Node.js 18+; needs the playwright package in the project or installed globally. No other dependency.
 */
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { readFileSync, existsSync, mkdirSync, writeFileSync, statSync } from 'node:fs';
import { resolve, dirname, join, extname, basename, relative, sep } from 'node:path';

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '[::1]', '0.0.0.0']);
const ACTIONS = ['goto', 'click', 'fill', 'press', 'select', 'check', 'expect-text', 'expect-no-text', 'expect-url', 'wait', 'screenshot'];
const MIME = { '.html': 'text/html; charset=utf-8', '.htm': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8' };
const STEP_TIMEOUT = 5000;

/** Print the "could not run" report and exit 2. */
function cannotRun(reason, fix) {
  process.stdout.write([
    'BROWSER-CHECK: COULD NOT RUN',
    `Reason: ${reason}`,
    fix ? `What the user can do: ${fix}` : '',
    'First line of your reply: "I could not open the page in a browser, so nothing below was checked in a browser."',
    'Do not report any step as passed. Say what is needed in Open questions.',
  ].filter(Boolean).join('\n') + '\n');
  process.exit(2);
}

export function parseArgs(argv) {
  const o = { widths: [1280, 390], allowHosts: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]; const v = argv[i + 1];
    const need = () => { if (v === undefined || v.startsWith('--')) throw new Error(`${a} needs a value`); i++; return v; };
    if (a === '--url') o.url = need();
    else if (a === '--file') o.file = need();
    else if (a === '--steps') o.steps = need();
    else if (a === '--out') o.out = need();
    else if (a === '--allow-host') o.allowHosts.push(need().toLowerCase());
    else if (a === '--widths') o.widths = need().split(',').map((x) => Number(x.trim())).filter((n) => Number.isInteger(n) && n >= 240 && n <= 3840);
    else if (a === '--help' || a === '-h') o.help = true;
    else throw new Error(`unknown option ${a}`);
  }
  if (!o.widths.length) throw new Error('--widths needs numbers between 240 and 3840, e.g. 1280,390');
  return o;
}

/** Is this URL a page the skill may open? Local hosts always; another host only when named with --allow-host. */
export function hostAllowed(url, allowHosts = []) {
  let u; try { u = new URL(url); } catch { return { ok: false, why: `"${url}" is not a valid URL` }; }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return { ok: false, why: `only http and https pages can be checked, not ${u.protocol}` };
  const h = u.hostname.toLowerCase();
  if (LOCAL_HOSTS.has(h) || h.endsWith('.localhost')) return { ok: true };
  if (allowHosts.includes(h)) return { ok: true };
  return { ok: false, why: `${h} is not a local address (localhost or 127.0.0.1)` };
}

/** Read steps from a file path or inline JSON and validate them. */
export function loadSteps(arg) {
  if (!arg) return [];
  const text = existsSync(arg) ? readFileSync(arg, 'utf8') : arg;
  let steps; try { steps = JSON.parse(text); } catch (e) { throw new Error(`steps are not valid JSON: ${e.message}`); }
  if (!Array.isArray(steps)) throw new Error('steps must be a JSON array of {"do": ..., "target": ..., "value": ...}');
  steps.forEach((s, i) => {
    if (!s || !ACTIONS.includes(s.do)) throw new Error(`step ${i + 1}: "do" must be one of ${ACTIONS.join(', ')}`);
    if (['click', 'fill', 'select', 'check'].includes(s.do) && !s.target) throw new Error(`step ${i + 1} (${s.do}) needs "target"`);
    if (['fill', 'select', 'expect-text', 'expect-no-text', 'expect-url', 'press'].includes(s.do) && (s.value === undefined || s.value === '')) throw new Error(`step ${i + 1} (${s.do}) needs "value"`);
  });
  return steps;
}

/** Find the playwright package: the project first, then next to this script, then global (NODE_PATH). */
function loadPlaywright() {
  const bases = [join(process.cwd(), 'package.json'), import.meta.url];
  for (const p of (process.env.NODE_PATH || '').split(/[:;]/).filter(Boolean)) bases.push(join(p, '_'));
  for (const b of bases) for (const name of ['playwright', '@playwright/test', 'playwright-core']) {
    try { const m = createRequire(b)(name); if (m?.chromium) return { pw: m, name }; } catch { /* try next */ }
  }
  return null;
}

/** Serve one folder on 127.0.0.1 with a random port; returns { url, close }. */
function serveFolder(root, entry) {
  return new Promise((res, rej) => {
    const server = createServer((req, reply) => {
      const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      let file = resolve(root, '.' + path);
      if (file !== root && !file.startsWith(root + sep)) { reply.writeHead(403); reply.end(); return; }
      if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
      if (!existsSync(file)) { reply.writeHead(404); reply.end('not found'); return; }
      reply.writeHead(200, { 'content-type': MIME[extname(file).toLowerCase()] || 'application/octet-stream' });
      reply.end(readFileSync(file));
    });
    server.on('error', rej);
    server.listen(0, '127.0.0.1', () => res({ url: `http://127.0.0.1:${server.address().port}/${encodeURI(entry)}`, close: () => server.close() }));
  });
}

/** Turn a target string into a Playwright locator. */
function locate(page, target) {
  const t = String(target);
  const m = /^(text|label|placeholder|role)=(.*)$/s.exec(t);
  if (!m) return page.locator(t).first();
  const [, kind, rest] = m;
  if (kind === 'text') return page.getByText(rest, { exact: false }).first();
  if (kind === 'label') return page.getByLabel(rest).first();
  if (kind === 'placeholder') return page.getByPlaceholder(rest).first();
  const r = /^([a-z]+)(?:\[name=(.*)\])?$/.exec(rest);
  if (!r) throw new Error(`role target must look like role=button[name=Save], got "${t}"`);
  return page.getByRole(r[1], r[2] ? { name: r[2].replace(/^["']|["']$/g, '') } : {}).first();
}

const describe = (s) => [s.do, s.target ? `"${s.target}"` : '', s.value !== undefined && s.do !== 'fill' ? `"${s.value}"` : s.do === 'fill' ? `with "${s.value}"` : ''].filter(Boolean).join(' ');
const short = (e) => String(e?.message || e).split('\n')[0].replace(/\u001b\[[0-9;]*m/g, '').slice(0, 220);

async function runStep(page, s, base, shots, outDir) {
  switch (s.do) {
    case 'goto': {
      const to = new URL(s.value ?? s.target ?? '/', base).href;
      const g = hostAllowed(to, [new URL(base).hostname]);
      if (!g.ok) throw new Error(`refused: ${g.why}`);
      const r = await page.goto(to, { waitUntil: 'load', timeout: STEP_TIMEOUT * 2 });
      if (r && r.status() >= 400) throw new Error(`the page answered HTTP ${r.status()}`);
      return;
    }
    case 'click': return locate(page, s.target).click({ timeout: STEP_TIMEOUT });
    case 'fill': return locate(page, s.target).fill(String(s.value), { timeout: STEP_TIMEOUT });
    case 'select': return locate(page, s.target).selectOption(String(s.value), { timeout: STEP_TIMEOUT });
    case 'check': return locate(page, s.target).check({ timeout: STEP_TIMEOUT });
    case 'press': return (s.target ? locate(page, s.target) : page.locator('body')).press(String(s.value), { timeout: STEP_TIMEOUT });
    case 'expect-text': return page.getByText(String(s.value), { exact: false }).first().waitFor({ state: 'visible', timeout: STEP_TIMEOUT });
    case 'expect-no-text': {
      await page.waitForTimeout(300);
      if (await page.getByText(String(s.value), { exact: false }).first().isVisible()) throw new Error(`"${s.value}" is visible`);
      return;
    }
    case 'expect-url': {
      try { await page.waitForURL((u) => u.href.includes(String(s.value)), { timeout: STEP_TIMEOUT }); }
      catch { throw new Error(`the address is ${page.url()}, which does not contain "${s.value}"`); }
      return;
    }
    case 'wait': return page.waitForTimeout(Math.min(Number(s.value) || 500, STEP_TIMEOUT));
    case 'screenshot': {
      const name = `${String(s.value || `step-${shots.length + 1}`).replace(/[^a-z0-9-]+/gi, '-').toLowerCase()}.png`;
      await page.screenshot({ path: join(outDir, name), fullPage: true });
      shots.push(name);
      return;
    }
    default: throw new Error(`unknown action ${s.do}`);
  }
}

async function main() {
  let o;
  try { o = parseArgs(process.argv.slice(2)); } catch (e) { cannotRun(e.message, 'run the command again with valid options (see the top of engine/check.mjs)'); }
  if (o.help) { process.stdout.write(readFileSync(new URL(import.meta.url), 'utf8').split('*/')[0] + '*/\n'); return; }
  if (!o.url === !o.file) cannotRun('give exactly one of --url or --file', 'name the local address of the running app, or the HTML file to open');
  let steps; try { steps = loadSteps(o.steps); } catch (e) { cannotRun(e.message, 'fix the steps file'); }

  let target = o.url; let server = null;
  if (o.file) {
    const f = resolve(o.file);
    if (!existsSync(f) || !statSync(f).isFile()) cannotRun(`the file ${o.file} does not exist`, 'give the path of the HTML file to open');
    server = await serveFolder(dirname(f), basename(f));
    target = server.url;
  } else {
    const g = hostAllowed(o.url, o.allowHosts);
    if (!g.ok) cannotRun(`refused: ${g.why}`, 'start the app locally and give its localhost address, or name the preview address yourself so it can be passed with --allow-host');
  }

  const found = loadPlaywright();
  if (!found) { server?.close(); cannotRun('the playwright package is not installed in this project or globally', 'install it once with "npm install --save-dev playwright" and "npx playwright install chromium", then ask again'); }
  let browser;
  try { browser = await found.pw.chromium.launch(); }
  catch (e) { server?.close(); cannotRun(`the Chromium browser did not start (${short(e)})`, 'install the browser once with "npx playwright install chromium", then ask again'); }

  const outDir = resolve(o.out || 'browser-check-out');
  mkdirSync(outDir, { recursive: true });
  const consoleMsgs = []; const pageErrors = []; const badRequests = [];
  const context = await browser.newContext({ viewport: { width: o.widths[0], height: 900 } });
  const page = await context.newPage();
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') consoleMsgs.push(`${m.type()}: ${m.text().slice(0, 300)}`); });
  page.on('pageerror', (e) => pageErrors.push(short(e)));
  page.on('requestfailed', (r) => badRequests.push(`${r.method()} ${r.url()} failed (${r.failure()?.errorText || 'no answer'})`));
  page.on('response', (r) => { if (r.status() >= 400) badRequests.push(`${r.request().method()} ${r.url()} answered HTTP ${r.status()}`); });

  const results = []; const shots = [];
  let opened = true;
  try {
    const r = await page.goto(target, { waitUntil: 'load', timeout: STEP_TIMEOUT * 2 });
    if (r && r.status() >= 400) throw new Error(`the page answered HTTP ${r.status()}`);
  } catch (e) {
    opened = false;
    await browser.close(); server?.close();
    cannotRun(`the page ${o.url || o.file} did not open (${short(e)})`, 'start the app (for example "npm run dev") and check the address, then ask again');
  }
  let failed = false;
  for (const [i, s] of steps.entries()) {
    if (failed) { results.push({ n: i + 1, step: describe(s), status: 'NOT RUN', note: 'an earlier step failed' }); continue; }
    try { await runStep(page, s, page.url(), shots, outDir); results.push({ n: i + 1, step: describe(s), status: 'PASS', note: '' }); }
    catch (e) {
      failed = true;
      const name = `fail-step-${i + 1}.png`;
      try { await page.screenshot({ path: join(outDir, name), fullPage: true }); shots.push(name); } catch { /* page gone */ }
      results.push({ n: i + 1, step: describe(s), status: 'FAIL', note: short(e) });
    }
  }
  for (const w of o.widths) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.waitForTimeout(150);
    const name = `end-${w}.png`;
    await page.screenshot({ path: join(outDir, name), fullPage: true });
    shots.push(name);
  }
  const title = await page.title().catch(() => '');
  const finalUrl = page.url();
  await browser.close(); server?.close();

  const rel = (f) => relative(process.cwd(), join(outDir, f)).split(sep).join('/');
  const ok = opened && !failed && pageErrors.length === 0;
  const passed = results.filter((r) => r.status === 'PASS').length;
  const lines = [
    `BROWSER-CHECK: ${ok ? 'PASSED' : 'FAILED'}`,
    `Page: ${o.url || o.file} (opened as ${target}), title "${title}", ended at ${finalUrl}`,
    `Browser: Chromium via the ${found.name} package (script), widths ${o.widths.join(' and ')} px`,
    `Steps: ${passed} of ${results.length} passed${results.length ? '' : ' (no steps given: the page was only opened)'}`,
    '',
    '### Steps',
    ...(results.length ? results.map((r) => `${r.n}. ${r.status}: ${r.step}${r.note ? `. ${r.note}` : ''}`) : ['- No steps were given; the page was opened and photographed only.']),
    '',
    '### Console and page errors',
    ...(pageErrors.length || consoleMsgs.length ? [...pageErrors.map((e) => `- page error: ${e}`), ...consoleMsgs.map((m) => `- console ${m}`)] : ['- None.']),
    '',
    '### Failed requests',
    ...(badRequests.length ? [...new Set(badRequests)].map((b) => `- ${b}`) : ['- None.']),
    '',
    '### Screenshots',
    ...shots.map((s) => `- ${rel(s)}`),
    '',
    'This is the script\'s own result. Copy the steps, errors and screenshot paths as they are; do not add a step that is not listed here.',
  ];
  writeFileSync(join(outDir, 'report.json'), JSON.stringify({ ok, target: o.url || o.file, title, finalUrl, widths: o.widths, steps: results, pageErrors, console: consoleMsgs, requests: [...new Set(badRequests)], screenshots: shots.map(rel) }, null, 2) + '\n');
  process.stdout.write(lines.join('\n') + '\n');
  process.exit(ok ? 0 : 1);
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)) main().catch((e) => cannotRun(`unexpected error: ${short(e)}`, 'run the same command again; if it repeats, report the error'));
