/**
 * Tests for figure-craft lint rules L1-L8: one clean pass, one seeded mistake each.
 * @governed-by PO_ARCHITECT
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { box, dot, line, renderSvg } from '../src/skills/figure-craft/engine/iso.mjs';
import { lint } from '../src/skills/figure-craft/engine/lint.mjs';

function clean() {
  const shapes = [
    box({ at: [0, 0, 0], size: [20, 20, 40], id: 'postA' }),
    box({ at: [60, 0, 0], size: [20, 20, 40], id: 'postB' }),
    box({ at: [0, 0, 40], size: [80, 20, 10], id: 'beam', rests: 'postA' }),
    dot([40, 10, 50], { face: 'top', on: 'beam', tone: 'ok' }),
    line([[64, 10, 40], [76, 10, 40]], { on: 'postB', face: 'top', id: 'postB-seam' }),
    box({ at: [0, 40, 0], size: [10, 10, 10], id: 'mover', anim: 'slide', move: [20, 0, 0] }),
  ];
  return renderSvg(shapes, { labels: [
    { at: [40, 10, 50], text: 'Beam', side: 'r' },
    { at: [70, 10, 0], text: 'Post B', side: 'r' },
    { at: [5, 45, 5], text: 'Mover', side: 'l' },
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

test('L1: a box sitting on another without declaring rests is an error', () => {
  const m = renderSvg([box({ at: [0, 0, 0], size: [40, 40, 4], id: 'ground' }), box({ at: [4, 4, 4], size: [10, 10, 10], id: 'part' })]).model;
  assert.ok(lint(m).errors.some((e) => e.rule === 'L1-painter-order' && /does not declare rests/.test(e.message)));
});

test('L2: a line detail must lie in its face', () => {
  const ok = clean();
  assert.equal(has(lint(ok).errors, 'L2-face-detail'), false);
  const m = copy(ok);
  byId(m, 'postB-seam').points[1] = [90, 10, 40];
  assert.ok(has(lint(m).errors, 'L2-face-detail'));
});

test('L9-moving-unlabelled: the moving part must be labelled', () => {
  const m = copy(clean());
  m.labels = m.labels.filter((l) => l.text !== 'Mover');
  assert.ok(has(lint(m).errors, 'L9-moving-unlabelled'));
});

test('L10-crowded: parts too close, or huddled on a big base, are warned', () => {
  const g = box({ at: [0, 0, 0], size: [100, 100, 4], id: 'ground' });
  const part = (id, x, y) => box({ at: [x, y, 4], size: [10, 10, 20], id, rests: 'ground' });
  const tight = lint(renderSvg([g, part('a', 0, 0), part('b', 11, 0)]).model).warnings.filter((w) => w.rule === 'L10-crowded');
  assert.equal(tight.length, 2, 'too close and spanning too little');
  const spread = lint(renderSvg([g, part('a', 5, 5), part('b', 70, 70)]).model).warnings;
  assert.equal(has(spread, 'L10-crowded'), false);
});

test('L11-no-detail: a labelled part needs an identifying face detail', () => {
  const m = copy(clean());
  m.shapes = m.shapes.filter((s) => s.id !== 'postB-seam');
  const r = lint(m);
  assert.ok(r.errors.some((e) => e.rule === 'L11-no-detail' && /Post B/.test(e.message)));
});

test('the skill demo passes its own lint with no errors and no warnings', async () => {
  const { demoRender } = await import('../src/skills/figure-craft/examples/build-demo.mjs');
  assert.deepEqual(lint(demoRender().model), { errors: [], warnings: [] });
});
