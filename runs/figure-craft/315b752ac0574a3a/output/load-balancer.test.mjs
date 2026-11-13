/**
 * Checks on the generated load-balancer figure. Run: node --test load-balancer.test.mjs
 * Reads the generated files only; it does not change them.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const at = (f) => fileURLToPath(new URL(f, import.meta.url));
const html = readFileSync(at('./load-balancer.html'), 'utf8');
const svg = readFileSync(at('./load-balancer.svg'), 'utf8');
const report = JSON.parse(readFileSync(at('./lint-report.json'), 'utf8'));

test('lint report has zero errors and zero warnings', () => {
  assert.deepEqual(report.errors, []);
  assert.deepEqual(report.warnings, []);
});

test('every fill and stroke in the figure is a token, none or url(#...)', () => {
  const body = svg.replace(/<style>[\s\S]*?<\/style>/g, '');
  const values = [...body.matchAll(/\b(fill|stroke)="([^"]*)"/g)].map((m) => m[2]);
  assert.ok(values.length > 0);
  for (const v of values) {
    assert.ok(/^var\(--[\w-]+\)$/.test(v) || v === 'none' || /^url\(#[\w-]+\)$/.test(v), `raw colour: ${v}`);
  }
});

test('no raw colour literal appears in the page figure markup', () => {
  assert.doesNotMatch(html.slice(html.indexOf('<figure')), /(fill|stroke|color)="?#|rgb\(/);
});

test('motion has a prefers-reduced-motion fallback that stops the animation', () => {
  assert.match(svg, /@media \(prefers-reduced-motion: reduce\)\{\.lb-anim-request\{animation:none\}\}/);
});

test('the only animated shape moves along the x axis only', () => {
  const block = svg.match(/@keyframes lb-anim-request\{.*?\}\}/);
  assert.ok(block, 'keyframes block found');
  const tr = block[0].match(/translate\(([-\d.]+)px,([-\d.]+)px\)/);
  assert.ok(tr, 'translate found in keyframes');
  assert.notEqual(Number(tr[1]), 0, 'moves on screen');
  // An x-axis move in the engine projects to screen (dx*C, dx*0.5): both non-zero; a y-axis move would also be non-zero.
  // Check the sign and ratio that identify a pure x move: screen dy / screen dx = 0.5 / 0.866.
  assert.ok(Math.abs(Number(tr[2]) / Number(tr[1]) - 0.5 / 0.866) < 0.02, 'screen ratio matches an iso x-axis move');
});

test('page has no external scripts, stylesheets or fonts', () => {
  assert.doesNotMatch(html, /<script[^>]+src=/i);
  assert.doesNotMatch(html, /<link[^>]+href=/i);
  assert.doesNotMatch(html, /@import|url\(https?:/i);
});

test('page states the idea and names the green dot in the caption', () => {
  assert.match(html, /A load balancer receives each request and sends it to one of three servers\./);
  assert.match(html, /The green dot marks the server that got it\./);
});

test('label text renders at least 11 CSS px on a 390px phone', () => {
  const fontSize = Number(svg.match(/font-size="([\d.]+)"/)[1]);
  const vbW = Number(report.viewBox[2]);
  const available = 390 - 2 * 16 - 2 * 16 - 2; // gutter, figure padding, figure border
  assert.ok(fontSize * available / vbW >= 11, `rendered ${(fontSize * available / vbW).toFixed(2)}px`);
});

test('page has a theme toggle whose text names the theme it switches to', () => {
  assert.match(html, /id="theme" aria-pressed="false">Dark theme</);
  assert.match(html, /tb\.textContent=d\?'Light theme':'Dark theme'/);
});

test('page declares tokens for light, dark attribute and prefers-color-scheme', () => {
  assert.match(html, /:root\{--bg:/);
  assert.match(html, /\[data-theme="dark"\]\{/);
  assert.match(html, /@media \(prefers-color-scheme: dark\)\{:root:not\(\[data-theme="light"\]\)/);
});
