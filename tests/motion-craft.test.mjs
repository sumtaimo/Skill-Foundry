/**
 * motion-craft: what contains-checks cannot see in the recorded plans (ranges, prompt shape, brand, contrast, Two-Tier stacks).
 * @governed-by PO_ARCHITECT
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scoreLive } from '../src/factory/live-evals.mjs';
import { REPO_MARKERS } from '../src/factory/portable-check.mjs';

const DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'skills', 'motion-craft');
const read = (p) => readFileSync(join(DIR, p), 'utf8');
const LABELS = ['GOAL', 'CONTENT', 'SCENES', 'MOTION', 'LOOK', 'LAYOUT', 'ASSETS', 'FALLBACKS', 'AVOID', 'DONE WHEN'];
const plans = JSON.parse(read('evals/cases.json')).filter((c) => c.expect.some((e) => e.type === 'contains' && e.value === '## Prompt'));
const output = (id) => JSON.parse(read(`evals/live/${id}.json`)).output;
const promptOf = (id) => /```text\r?\n([\s\S]*?)```/.exec(output(id))[1];

const lum = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);

test('motion-craft: every palette keeps text and accent at 4.5:1 or more on its ground', () => {
  const rows = [...read('references/directions.md').matchAll(/\| (#\w{6}) \| (#\w{6}) \| (#\w{6}) \|/g)];
  assert.equal(rows.length, 6);
  for (const [, ground, ...fore] of rows) for (const f of fore) {
    const [hi, lo] = [lum(ground), lum(f)].sort((a, b) => b - a);
    assert.ok((hi + 0.05) / (lo + 0.05) >= 4.5, `${f} on ${ground}`);
  }
});

test('motion-craft: RULES.json and SKILL.md state the same rules', () => {
  const md = read('SKILL.md').replace(/\r\n/g, '\n');
  for (const r of JSON.parse(read('RULES.json'))) assert.ok(md.includes(`- ${r.id}: ${r.text}`), r.id);
});

test('motion-craft: recorded live evals pass', () => {
  const s = scoreLive(DIR);
  assert.equal(s.failed, 0, JSON.stringify(s.results.filter((r) => !r.ok)));
});

for (const { id } of plans) {
  test(`motion-craft ${id}: contiguous scenes, the same in the prompt, and one ordered prompt`, () => {
    const out = output(id);
    const table = out.split('## Scene plan')[1].split('## Prompt')[0];
    const ranges = [...table.matchAll(/^\|\s*\d+\s*\|\s*(\d+)-(\d+)%/gm)].map((m) => [Number(m[1]), Number(m[2])]);
    assert.ok(ranges.length >= 3 && ranges.length <= 6, `${ranges.length} scenes`);
    assert.equal(ranges[0][0], 0);
    assert.equal(ranges.at(-1)[1], 100);
    ranges.forEach(([from, to], i) => {
      assert.ok(to > from);
      if (i) assert.equal(from, ranges[i - 1][1]);
      assert.ok(promptOf(id).includes(`${from}-${to}%`), `${from}-${to}% is not in the prompt`);
    });
    assert.equal(out.match(/^```/gm).length, 2, 'exactly one code block');
    const at = LABELS.map((l) => promptOf(id).search(new RegExp(`^${l}:`, 'm')));
    assert.ok(at.every((v, i) => v >= 0 && (!i || v > at[i - 1])), `labels: ${at}`);
  });
}

test('motion-craft: a reference brand stays out of the prompt', () => {
  assert.doesNotMatch(promptOf('has-video'), /\bApple\b(?!-system)/);
});

test('motion-craft: a Khmer request is explained in Khmer', () => {
  assert.match(/\*\*Why:\*\*(.*)/.exec(output('khmer'))[1], /[\u1780-\u17ff]/);
});

test('motion-craft: an override drops that exclusion and never reduced motion', () => {
  const p = promptOf('override');
  assert.doesNotMatch(/^AVOID:([\s\S]*?)^DONE WHEN:/m.exec(p)[1], /progress bar/i);
  assert.match(p, /reduced.motion/i);
});

test('motion-craft: no recorded plan carries a name from the machine it ran on', () => {
  for (const { id } of plans) assert.doesNotMatch(output(id), REPO_MARKERS, id);
});

test('motion-craft: a subject with no name still gives a page with words on it', () => {
  const content = /^CONTENT:([\s\S]*?)^SCENES:/m.exec(promptOf('no-facts'))[1];
  assert.match(content, /"[^"[\]]{4,}"/, 'CONTENT is only slots');
});

test('motion-craft: a page with no name still has words on its first screen', () => {
  const first = /Scene 1:([\s\S]*?)Scene 2:/.exec(/^CONTENT:([\s\S]*?)^SCENES:/m.exec(promptOf('no-facts'))[1])[1];
  assert.match(first.replace(/"?\[ADD:[^\]]*\]"?/g, ''), /bottle/i);
});

test('motion-craft: drawn plans carry the detail, containment, display-size and closing lines', () => {
  for (const id of ['khmer', 'no-assets', 'no-facts', 'build-boundary']) {
    for (const line of ['closed, filled, curved paths', 'overflow hidden', 'is display type', 'closing lockup']) assert.ok(promptOf(id).includes(line), `${id}: ${line}`);
  }
});

test('motion-craft: M5 editorial keeps natural height and M6 spatial canvas avoids a scroll track and closing lockup', () => {
  const m5 = promptOf('editorial');
  assert.match(m5, /natural/i);
  assert.doesNotMatch(m5, /centred closing lockup|top 64% of the stage/i);
  assert.doesNotMatch(m5, /Track \d+vh/i);
  const m6 = promptOf('spatial-canvas');
  assert.match(m6, /pan|zoom/i);
  assert.match(m6, /Tab|keyboard/i);
  assert.doesNotMatch(m6, /centred closing lockup|top 64% of the stage/i);
  assert.doesNotMatch(m6, /Track \d+vh/i);
});

test('motion-craft: Tier 2 production stack plans include GSAP 3.12.5 ScrollTrigger, Lenis ticker sync, matchMedia and Three.js WebGL safety', () => {
  const gl = promptOf('gsap-lenis-saas');
  assert.match(gl, /3\.12\.5/);
  assert.match(gl, /ScrollTrigger/);
  assert.match(gl, /Lenis/);
  assert.match(gl, /lagSmoothing\(0\)/);
  assert.match(gl, /matchMedia/);
  assert.match(gl, /reduced.motion/i);

  const webgl = promptOf('threejs-webgl-backdrop');
  assert.match(webgl, /Three\.js/i);
  assert.match(webgl, /WebGL/i);
  assert.match(webgl, /CatmullRomCurve3|Catmull-Rom/i);
  assert.match(webgl, /ScrollTrigger/);
  assert.match(webgl, /Lenis/);
  assert.match(webgl, /webglcontextlost/i);
  assert.match(webgl, /IntersectionObserver/i);
});
