/**
 * Tests for the figure-craft iso engine.
 * @governed-by PO_ARCHITECT
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { C, project, box, line, dot, renderSvg, layoutLabels } from '../src/skills/figure-craft/engine/iso.mjs';

const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} != ${b}`);

test('C equals 0.866', () => { assert.equal(C, 0.866); });

test('project maths for known points', () => {
  const p0 = project([0, 0, 0]); close(p0[0], 0); close(p0[1], 0);
  const p1 = project([10, 0, 0]); close(p1[0], 8.66); close(p1[1], 5);
  const p2 = project([0, 10, 0]); close(p2[0], -8.66); close(p2[1], 5);
  const p3 = project([0, 0, 10]); close(p3[0], 0); close(p3[1], -10);
  const p4 = project([4, 2, 3]); close(p4[0], 2 * 0.866); close(p4[1], 0);
});

function scene() {
  return [
    box({ at: [0, 0, 0], size: [20, 20, 40], id: 'postA' }),
    box({ at: [60, 0, 0], size: [20, 20, 40], id: 'postB' }),
    box({ at: [0, 0, 40], size: [80, 20, 10], id: 'beam', rests: 'postA' }),
    dot([10, 10, 50], { face: 'top', on: 'beam', tone: 'ok' }),
    line([[0, 40, 0], [80, 40, 0]], { bold: true }),
  ];
}
const labels = [
  { at: [10, 10, 50], text: 'Beam', side: 'r' },
  { at: [10, 10, 40], text: 'Post A', side: 'r' },
  { at: [70, 10, 40], text: 'Post B', side: 'r' },
  { at: [0, 0, 0], text: 'Ground', side: 'l' },
];

test('renderSvg draws in array order with drawIndex', () => {
  const { svg, model } = renderSvg(scene(), { labels });
  assert.equal(typeof svg, 'string');
  assert.ok(svg.includes('<svg'));
  model.shapes.forEach((s, i) => assert.equal(s.drawIndex, i));
  assert.deepEqual(model.shapes.slice(0, 3).map((s) => s.id), ['postA', 'postB', 'beam']);
  assert.ok(model.shapes.every((s) => typeof s.id === 'string' && s.id.length));
});

test('renderSvg draws dots and face ellipses', () => {
  const { svg, model } = renderSvg(scene(), { labels });
  assert.ok(model.shapes.some((s) => s.kind === 'dot'));
  assert.match(svg, /<(ellipse|circle)\b/);
});

test('layoutLabels: no overlaps (min gap 13 per column) and text inside viewBox', () => {
  const { model } = renderSvg(scene(), { labels });
  assert.equal(model.labels.length, labels.length);
  for (const side of ['l', 'r']) {
    const col = model.labels.filter((l) => l.side === side).sort((a, b) => a.ty - b.ty);
    for (let i = 1; i < col.length; i++) assert.ok(col[i].ty - col[i - 1].ty >= 13 - 1e-9, 'gap < 13');
  }
  const [x, y, w, h] = model.viewBox;
  for (const l of model.labels) {
    assert.ok(l.tx >= x && l.tx <= x + w, `label ${l.text} x outside`);
    assert.ok(l.ty >= y && l.ty <= y + h, `label ${l.text} y outside`);
  }
});

test('layoutLabels direct: crowded labels pushed apart', () => {
  const out = layoutLabels(
    [{ at: [0, 0, 0], text: 'a', side: 'r' }, { at: [0, 0, 1], text: 'b', side: 'r' }, { at: [0, 0, 2], text: 'c', side: 'r' }],
    { minX: -50, minY: -50, maxX: 50, maxY: 50 },
  );
  assert.equal(out.length, 3);
  const ys = out.map((l) => l.ty).sort((a, b) => a - b);
  for (let i = 1; i < ys.length; i++) assert.ok(ys[i] - ys[i - 1] >= 13 - 1e-9);
  for (const l of out) for (const k of ['x', 'y', 'tx', 'ty']) assert.equal(typeof l[k], 'number');
});

test('determinism: same input gives identical svg', () => {
  assert.equal(renderSvg(scene(), { labels }).svg, renderSvg(scene(), { labels }).svg);
});

test('all fills and strokes use var(--', () => {
  const { svg, model } = renderSvg(scene(), { labels });
  const ok = (v) => v.startsWith('var(--') || v === 'none' || v.startsWith('url(#');
  for (const f of model.fills) assert.ok(ok(f), `fill ${f}`);
  for (const s of model.strokes) assert.ok(ok(s), `stroke ${s}`);
  assert.ok(model.fills.some((f) => f.startsWith('var(--')));
  assert.doesNotMatch(svg, /(fill|stroke)="#[0-9a-fA-F]{3,8}"/);
});

test('animation emits reduced-motion fallback', () => {
  const { svg, model } = renderSvg([box({ at: [0, 0, 0], size: [10, 10, 10], anim: 'rise', move: [10, 0, 0], id: 'm' })]);
  assert.ok(svg.includes('prefers-reduced-motion: reduce'));
  assert.ok(model.animations.length >= 1);
  assert.ok(model.animations.every((a) => a.reducedFallback === true));
});
