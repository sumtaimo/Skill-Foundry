/**
 * Tests for the figure-craft kit helpers and the rule ids the skill maps to lint.
 * @governed-by PO_ARCHITECT
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slots, screws, repeat } from '../src/skills/figure-craft/engine/kit.mjs';
import { box, renderSvg } from '../src/skills/figure-craft/engine/iso.mjs';
import { lint } from '../src/skills/figure-craft/engine/lint.mjs';

test('slots: evenly spaced lines between the first and the last', () => {
  const s = slots([[10, 0, 0], [10, 10, 0]], [[10, 0, 8], [10, 10, 8]], 5, { on: 'b', face: 'x', id: 'v' });
  assert.equal(s.length, 5);
  assert.deepEqual(s[2].points, [[10, 0, 4], [10, 10, 4]]);
  assert.equal(s[4].id, 'v-4');
  assert.throws(() => slots([[0, 0, 0], [1, 0, 0]], [[0, 0, 1], [1, 0, 1]], 1, { on: 'b', face: 'x' }), /count/);
});

test('screws: four discs inset from the corners of a plate', () => {
  const s = screws([[10, 0, 0], [10, 20, 10]], { on: 'b', face: 'x', inset: 2 });
  assert.equal(s.length, 4);
  assert.deepEqual(s.map((d) => d.at), [[10, 2, 2], [10, 18, 2], [10, 18, 8], [10, 2, 8]]);
  assert.throws(() => screws([[0, 0, 0], [1, 1, 1]], { on: 'b', face: 'x' }), /rectangle/);
});

test('repeat: builds and flattens', () => {
  assert.equal(repeat(3, (i) => [i, i]).length, 6);
  assert.throws(() => repeat(0, () => 1), /count/);
});

test('helpers give a figure its micro detail: L19-sparse and L17-one-material pass', () => {
  const shapes = [
    box({ at: [0, 0, 0], size: [60, 60, 60], material: 'steel', id: 'body' }),
    ...slots([[60, 6, 10], [60, 54, 10]], [[60, 6, 50], [60, 54, 50]], 125, { on: 'body', face: 'x' }),
    box({ at: [70, 0, 0], size: [10, 10, 10], material: 'dark', id: 'a' }),
    box({ at: [90, 0, 0], size: [10, 10, 10], material: 'plain', id: 'b' }),
  ];
  const r = lint(renderSvg(shapes, { labels: [{ at: [30, 30, 30], text: 'Body' }], requiredParts: ['body'] }).model);
  assert.equal(r.errors.some((e) => e.rule === 'L19-sparse' || e.rule === 'L17-one-material'), false);
});
