/**
 * Tests for figure-craft review fixes (leader anchors, reproducible demo).
 * @governed-by PO_ARCHITECT
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { box, dot, renderSvg } from '../src/skills/figure-craft/engine/iso.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'skills', 'figure-craft');
const count = (s, re) => (s.match(re) || []).length;
const labels = [
  { at: [10, 10, 40], text: 'Top', side: 'r' },
  { at: [0, 0, 0], text: 'Base', side: 'l' },
];
const leaderRe = /<(line|path)\b[^>]*class="[^"]*\bleader\b[^"]*"/g;

test('two labels produce leader elements and no circles without dots', () => {
  const { svg } = renderSvg([box({ at: [0, 0, 0], size: [20, 20, 40], id: 'a' })], { labels });
  assert.ok(count(svg, leaderRe) >= 2, 'expected >=2 leader elements');
  assert.equal(count(svg, /<circle\b/g), 0);
});

test('circle count equals dot() shapes passed', () => {
  const shapes = [
    box({ at: [0, 0, 0], size: [20, 20, 40], id: 'a' }),
    dot([10, 10, 40], { face: 'top', on: 'a' }),
    dot([5, 5, 40], { face: 'top', on: 'a' }),
  ];
  const { svg } = renderSvg(shapes, { labels });
  assert.ok(count(svg, leaderRe) >= 2);
  assert.equal(count(svg, /<circle\b/g), 2);
});

test('buildDemo output matches committed files byte for byte', async () => {
  const { buildDemo } = await import('../src/skills/figure-craft/examples/build-demo.mjs');
  const { demoHtml, coverSvg } = buildDemo();
  assert.equal(typeof demoHtml, 'string');
  assert.equal(typeof coverSvg, 'string');
  const lf = (s) => s.replace(/\r\n/g, '\n');
  assert.equal(demoHtml, lf(readFileSync(join(ROOT, 'examples', 'demo.html'), 'utf8')));
  assert.equal(demoHtml, lf(readFileSync(join(ROOT, 'preview', 'example.html'), 'utf8')));
  assert.equal(coverSvg, lf(readFileSync(join(ROOT, 'preview', 'cover.svg'), 'utf8')));
});

test('demo html has no leader-end dots or markers', () => {
  const html = readFileSync(join(ROOT, 'examples', 'demo.html'), 'utf8');
  assert.ok(!/leader-dot/.test(html), 'leader-dot found');
  assert.ok(!/marker-start\s*=/.test(html), 'marker-start found');
  assert.ok(!/marker-end\s*=/.test(html), 'marker-end found');
});
