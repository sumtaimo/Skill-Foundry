/**
 * Tests for figure-craft lint rules L1-L8: one clean pass, one seeded mistake each.
 * @governed-by PO_ARCHITECT
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { box, dot, renderSvg } from '../src/skills/figure-craft/engine/iso.mjs';
import { lint } from '../src/skills/figure-craft/engine/lint.mjs';

function clean() {
  const shapes = [
    box({ at: [0, 0, 0], size: [20, 20, 40], id: 'postA' }),
    box({ at: [60, 0, 0], size: [20, 20, 40], id: 'postB' }),
    box({ at: [0, 0, 40], size: [80, 20, 10], id: 'beam', rests: 'postA' }),
    dot([40, 10, 50], { face: 'top', on: 'beam', tone: 'ok' }),
    box({ at: [0, 40, 0], size: [10, 10, 10], id: 'mover', anim: 'slide', move: [20, 0, 0] }),
  ];
  return renderSvg(shapes, { labels: [
    { at: [40, 10, 50], text: 'Beam', side: 'r' },
    { at: [70, 10, 0], text: 'Post B', side: 'r' },
  ] }).model;
}
const copy = (m) => structuredClone(m);
const has = (list, id) => list.some((e) => e.rule === id);
const byId = (m, id) => m.shapes.find((s) => s.id === id);

test('clean model passes every rule', () => {
  const r = lint(clean());
  assert.deepEqual(r.errors, [], JSON.stringify(r.errors));
  assert.equal(has(r.warnings, 'L4-leader-crosses-solid'), false);
});

const cases = {
  'L1-painter-order': (m) => {
    // beam drawn before the posts it rests on
    const beam = byId(m, 'beam');
    m.shapes = [beam, ...m.shapes.filter((s) => s !== beam)];
    m.shapes.forEach((s, i) => { s.drawIndex = i; });
  },
  'L2-face-detail': (m) => {
    // status dot outside its face and off its plane
    const d = m.shapes.find((s) => s.kind === 'dot');
    d.at = [200, 200, 99];
  },
  'L3-label-overlap': (m) => {
    // labels too close in the same column
    const [a, b] = m.labels;
    b.side = a.side; b.tx = a.tx; b.x = a.x; b.ty = a.ty + 2; b.y = a.y + 2;
  },
  'L5-outside-viewbox': (m) => {
    // shape outside the viewBox
    const s = byId(m, 'postB');
    s.at = [5000, -5000, 0];
    m.labels[0].tx = m.viewBox[0] + m.viewBox[2] + 500;
  },
  'L6-raw-colour': (m) => { m.fills.push('#ff0000'); },
  'L7-motion-no-reduced': (m) => {
    m.animations = m.animations.length ? m.animations : [{ id: 'mover', reducedFallback: true }];
    m.animations[0].reducedFallback = false;
  },
  'L8-motion-off-axis': (m) => { byId(m, 'mover').move = [20, 20, 0]; },
};

for (const [id, seed] of Object.entries(cases)) {
  test(`${id}: seeded mistake fails with that id`, () => {
    assert.equal(has(lint(clean()).errors, id), false, 'clean model must pass');
    const m = copy(clean());
    seed(m);
    assert.ok(has(lint(m).errors, id), `expected error ${id}`);
  });
}

test('L8-motion-off-axis: lifting in z while resting fails', () => {
  const m = copy(clean());
  const mv = byId(m, 'mover');
  mv.rests = 'postA'; mv.move = [0, 0, 10];
  assert.ok(has(lint(m).errors, 'L8-motion-off-axis'));
});

test('L4-leader-crosses-solid: leader crossing a box is a warning', () => {
  const base = clean();
  assert.equal(has(lint(base).warnings, 'L4-leader-crosses-solid'), false);
  const m = copy(base);
  // leader from far left to far right passes straight through the posts
  const l = m.labels[0];
  const [x, y, w, h] = m.viewBox;
  const mid = y + h / 2;
  l.x = x + 1; l.y = mid; l.tx = x + w - 1; l.ty = mid;
  // also run across the beam's projected centre
  const beamCentre = [40 * 0.866 - 10 * 0.866, (40 + 10) * 0.5 - 45];
  l.x = beamCentre[0] - 200; l.y = beamCentre[1]; l.tx = beamCentre[0] + 200; l.ty = beamCentre[1];
  const r = lint(m);
  assert.ok(has(r.warnings, 'L4-leader-crosses-solid'), 'expected warning');
  assert.equal(has(r.errors, 'L4-leader-crosses-solid'), false, 'L4 must be a warning, not an error');
});
