/**
 * browser-check engine: argument parsing, the local-address guard, step validation, and a real run on a local file.
 * @governed-by QA_AUDITOR
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { parseArgs, hostAllowed, loadSteps, rankMatches } from '../src/skills/browser-check/engine/check.mjs';

const ENGINE = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'skills', 'browser-check', 'engine', 'check.mjs');

test('only local addresses are allowed, another host only by --allow-host', () => {
  for (const u of ['http://localhost:3000/', 'http://127.0.0.1:8080/x', 'http://app.localhost/', 'http://[::1]:5173/']) assert.ok(hostAllowed(u).ok, u);
  for (const u of ['https://www.amazon.com/', 'http://10.0.0.5/', 'file:///etc/passwd', 'javascript:alert(1)', 'not a url']) assert.equal(hostAllowed(u).ok, false, u);
  assert.ok(hostAllowed('https://preview.example.dev/', ['preview.example.dev']).ok);
});

test('arguments and steps are validated with a clear message', () => {
  assert.deepEqual(parseArgs(['--file', 'a.html', '--widths', '1024,390']).widths, [1024, 390]);
  assert.throws(() => parseArgs(['--url']), /needs a value/);
  assert.throws(() => parseArgs(['--bogus', 'x']), /unknown option/);
  assert.throws(() => loadSteps('{"do":"click"}'), /JSON array/);
  assert.throws(() => loadSteps('[{"do":"hover"}]'), /"do" must be one of/);
  assert.throws(() => loadSteps('[{"do":"fill","target":"label=Email"}]'), /needs "value"/);
  assert.equal(loadSteps('[{"do":"click","target":"text=Go"},{"do":"expect-text","value":"Done"}]').length, 2);
});

test('elements are ranked from the user words, best first, and unrelated ones are left out', () => {
  const controls = [{ kind: 'link', name: 'Join now' }, { kind: 'button', name: 'Join' }, { kind: 'field', name: 'Work email' }, { kind: 'button', name: 'Cancel' }];
  assert.deepEqual(rankMatches(controls, 'Join').map((c) => c.name), ['Join', 'Join now']);
  assert.deepEqual(rankMatches(controls, 'email field').map((c) => c.name), ['Work email']);
  assert.deepEqual(rankMatches(controls, 'Pay'), []);
});

test('a public address is refused with exit 2 and the could-not-run sentence, before any browser starts', () => {
  const r = spawnSync(process.execPath, [ENGINE, '--url', 'https://www.amazon.com/'], { encoding: 'utf8' });
  assert.equal(r.status, 2);
  assert.match(r.stdout, /COULD NOT RUN/);
  assert.match(r.stdout, /I could not open the page in a browser, so nothing below was checked in a browser\./);
});

let hasPlaywright = false;
try { hasPlaywright = !!createRequire(join(process.cwd(), 'package.json'))('playwright').chromium; } catch { /* not installed */ }

test('a real run on a local file reports PASS, FAIL, NOT RUN, errors and screenshots', { skip: !hasPlaywright && 'playwright is not installed here' }, () => {
  const dir = mkdtempSync(join(tmpdir(), 'bc-test-'));
  writeFileSync(join(dir, 'index.html'), '<!doctype html><html lang="en"><head><title>T</title></head><body><button onclick="document.getElementById(\'m\').textContent=\'Saved\';console.error(\'boom\')">Save</button><p id="m"></p></body></html>');
  const steps = JSON.stringify([{ do: 'click', target: 'role=button[name=Save]' }, { do: 'expect-text', value: 'Saved' }, { do: 'expect-text', value: 'Nope', }, { do: 'click', target: 'text=Save' }]);
  const r = spawnSync(process.execPath, [ENGINE, '--file', 'index.html', '--steps', steps], { cwd: dir, encoding: 'utf8', timeout: 120000 });
  assert.equal(r.status, 1, r.stdout + r.stderr);
  assert.match(r.stdout, /1\. PASS: click "role=button\[name=Save\]"\. used button "Save"/);
  assert.match(r.stdout, /3\. FAIL: expect-text "Nope"/);
  assert.match(r.stdout, /4\. NOT RUN/);
  assert.match(r.stdout, /console error: boom/);
  for (const f of ['fail-step-3.png', 'end-1280.png', 'end-390.png', 'report.json']) assert.ok(existsSync(join(dir, 'browser-check-out', f)), f);
});
