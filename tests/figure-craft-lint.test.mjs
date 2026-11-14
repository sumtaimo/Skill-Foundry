/**
 * Tests for figure-craft lint rules L1-L8: one clean pass, one seeded mistake each.
 * @governed-by PO_ARCHITECT
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { box, dot, line, panel, disc, glow, renderSvg } from '../src/skills/figure-craft/engine/iso.mjs';
import { lint } from '../src/skills/figure-craft/engine/lint.mjs';

function clean() {
  const shapes = [
    box({ at: [0, 0, 0], size: [20, 20, 40], id: 'postA' }),
    box({ at: [60, 0, 0], size: [20, 20, 40], id: 'postB' }),
    box({ at: [0, 0, 40], size: [80, 20, 10], id: 'beam', rests: 'postA', material: 'steel' }),
    dot([40, 10, 50], { face: 'top', on: 'beam', tone: 'ok' }),
    line([[64, 10, 40], [76, 10, 40]], { on: 'postB', face: 'top', id: 'postB-seam' }),
    line([[20, 4, 10], [20, 16, 10]], { on: 'postA', face: 'x', id: 'postA-band' }),
    line([[80, 4, 10], [80, 16, 10]], { on: 'postB', face: 'x', id: 'postB-band' }),
    line([[10, 20, 44], [70, 20, 44]], { on: 'beam', face: 'y', id: 'beam-joint' }),
    line([[80, 4, 42], [80, 16, 42]], { on: 'beam', face: 'x', id: 'beam-end' }),
    ...Array.from({ length: 7 }, (_, i) => line([[4 + i * 10, 20, 46], [8 + i * 10, 20, 46]], { on: 'beam', face: 'y', id: `beam-rivet-${i}` })),
    box({ at: [0, 40, 0], size: [10, 10, 10], id: 'mover', anim: 'slide', move: [20, 0, 0] }),
  ];
  return renderSvg(shapes, { labels: [
    { at: [40, 10, 50], text: 'Beam', side: 'r' },
    { at: [70, 10, 0], text: 'Post B', side: 'r' },
    { at: [5, 45, 5], text: 'Mover', side: 'l' },
  ], requiredParts: ['beam', 'postB', 'mover'], labelMode: 'always' }).model;
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
  const touching = lint(renderSvg([g, part('a', 5, 5), part('b', 15, 5), part('c', 70, 70)]).model).warnings;
  assert.equal(touching.some((w) => /a and b/.test(w.message)), false, 'touching parts are one structure');
  const tight = lint(renderSvg([g, part('a', 0, 0), part('b', 12, 0)]).model).warnings.filter((w) => w.rule === 'L10-crowded');
  assert.equal(tight.length, 2, 'too close and spanning too little');
  const spread = lint(renderSvg([g, part('a', 5, 5), part('b', 70, 70)]).model).warnings;
  assert.equal(has(spread, 'L10-crowded'), false);
});

test('L11-no-detail: a labelled part needs an identifying face detail', () => {
  const m = copy(clean());
  m.shapes = m.shapes.filter((s) => s.id !== 'postB-seam' && s.id !== 'postB-band');
  const r = lint(m);
  assert.ok(r.errors.some((e) => e.rule === 'L11-no-detail' && /Post B/.test(e.message)));
});

test('the skill reference figure passes its own lint in every state and view, with no errors and no warnings', async () => {
  const { demoLint, demoStates, REQUIRED_PARTS } = await import('../src/skills/figure-craft/examples/build-demo.mjs');
  assert.deepEqual(demoLint(), { errors: [], warnings: [] });
  const states = demoStates();
  assert.deepEqual(Object.keys(states), ['open', 'closed']);
  assert.equal(states.open.length, 4);
  assert.ok(states.open[0].model.shapes.length >= 100, 'the reference figure is drawn in micro detail');
  assert.deepEqual(states.open[0].model.requiredParts, REQUIRED_PARTS);
});

test('L11: a large labelled part needs more than one detail', () => {
  const shapes = [box({ at: [0, 0, 0], size: [40, 40, 80], id: 'cab' }), line([[40, 5, 70], [40, 35, 70]], { on: 'cab', face: 'x', id: 'seam' })];
  const labels = [{ at: [40, 20, 40], text: 'Cabinet', side: 'r' }];
  const r = lint(renderSvg(shapes, { labels }).model);
  assert.ok(r.errors.some((e) => e.rule === 'L11-no-detail' && /needs 3/.test(e.message)));
});

test('L12-part-too-small: a tiny labelled part is an error', () => {
  const shapes = [box({ at: [0, 0, 0], size: [200, 200, 4], id: 'ground' }), box({ at: [10, 10, 4], size: [4, 4, 4], id: 'tiny', rests: 'ground' }), dot([12, 12, 8], { on: 'tiny', r: 0.5 })];
  const r = lint(renderSvg(shapes, { labels: [{ at: [12, 12, 8], text: 'Tiny', side: 'r' }] }).model);
  assert.ok(has(r.errors, 'L12-part-too-small'));
});

test('L13-no-solid-body: thin slabs alone are an error', () => {
  const slabs = [box({ at: [0, 0, 0], size: [60, 60, 2], id: 'floor' }), box({ at: [0, 0, 2], size: [60, 3, 120], id: 'wall', rests: 'floor' })];
  assert.ok(has(lint(renderSvg(slabs).model).errors, 'L13-no-solid-body'));
  const full = [box({ at: [0, 0, 0], size: [60, 60, 120], id: 'cabinet' })];
  assert.equal(has(lint(renderSvg(full).model).errors, 'L13-no-solid-body'), false);
});

test('L14-missing-part: required parts must be declared, drawn and labelled', () => {
  const shapes = [box({ at: [0, 0, 0], size: [40, 40, 40], id: 'body' })];
  const labels = [{ at: [20, 20, 20], text: 'Body', side: 'r' }];
  assert.ok(lint(renderSvg(shapes, { labels }).model).errors.some((e) => e.rule === 'L14-missing-part' && /not declared/.test(e.message)));
  assert.ok(lint(renderSvg(shapes, { labels, requiredParts: ['body', 'coil'] }).model).errors.some((e) => /coil is not drawn/.test(e.message)));
  assert.ok(lint(renderSvg(shapes, { requiredParts: ['body'] }).model).errors.some((e) => /body has no label/.test(e.message)));
  assert.equal(has(lint(renderSvg(shapes, { labels, requiredParts: ['body'] }).model).errors, 'L14-missing-part'), false);
});

test('L15-floating: a part in the air that touches nothing is an error', () => {
  const g = box({ at: [0, 0, 0], size: [60, 60, 40], id: 'body' });
  const floating = lint(renderSvg([g, box({ at: [10, 10, 70], size: [20, 20, 4], id: 'shelf' })]).model);
  assert.ok(has(floating.errors, 'L15-floating'));
  const attached = lint(renderSvg([g, box({ at: [10, 10, 40], size: [20, 20, 4], id: 'shelf', rests: 'body' })]).model);
  assert.equal(has(attached.errors, 'L15-floating'), false);
});

test('L3: label count limit is 5 when always shown and 9 on hover', () => {
  const body = box({ at: [0, 0, 0], size: [100, 100, 100], id: 'body' });
  const labels = Array.from({ length: 6 }, (_, i) => ({ at: [50, 50, 10 + i * 15], text: `P${i}`, side: i % 2 ? 'l' : 'r' }));
  assert.ok(lint(renderSvg([body], { labels, labelMode: 'always' }).model).errors.some((e) => /6 labels \(max 5\)/.test(e.message)));
  assert.equal(lint(renderSvg([body], { labels }).model).errors.some((e) => /labels \(max/.test(e.message)), false);
});

test('hover labels: chips hidden until the part is hovered or focused, no side columns, reduced-motion fallback', () => {
  const shapes = [box({ at: [0, 0, 0], size: [40, 40, 80], id: 'cab' }), line([[40, 5, 70], [40, 35, 70]], { on: 'cab', face: 'x', id: 'seam' })];
  const labels = [{ at: [40, 20, 40], text: 'Cabinet', side: 'r' }];
  const { svg, model } = renderSvg(shapes, { labels });
  assert.equal(model.labelMode, 'hover');
  assert.match(svg, /class="fc-fig"/);
  assert.match(svg, /data-id="cab" data-part="cab" tabindex="0" aria-label="Cabinet"/);
  assert.match(svg, /data-id="seam" data-part="cab"/);
  assert.match(svg, /<g class="fc-label" data-for="cab"><line class="leader"[^>]*\/><rect /);
  assert.match(svg, /\.fc-label\[data-for\]\{opacity:0/);
  assert.match(svg, /:has\(\[data-part="cab"\]:hover\) \.fc-label\[data-for="cab"\]/);
  assert.match(svg, /prefers-reduced-motion: reduce\)\{\.fc-fig \.fc-label/);
  const always = renderSvg(shapes, { labels, labelMode: 'always' });
  assert.doesNotMatch(always.svg, /data-for=/);
  assert.ok(model.viewBox[2] < always.model.viewBox[2], 'hover mode reserves no label column, so the object fills more of the frame');
});

test('materials, light and shadow: tokens inside the svg, gradients per material, soft cast shadow', () => {
  const { svg, model } = renderSvg([
    box({ at: [0, 0, 0], size: [80, 80, 4], id: 'ground' }),
    box({ at: [10, 10, 4], size: [40, 40, 60], material: 'steel', id: 'cab', rests: 'ground' }),
    panel([[50, 14, 10], [50, 46, 60]], { on: 'cab', face: 'x', material: 'glass', id: 'window' }),
    box({ at: [56, 56, 4], size: [16, 16, 20], round: true, material: 'dark', id: 'tank', rests: 'ground' }),
    line([[64, 64, 24], [64, 64, 40]], { tone: 'copper', id: 'pipe' }),
  ]);
  assert.match(svg, /\.fc-fig\{[^}]*--mat-steel-top:/, 'standalone svg carries its tokens');
  assert.match(svg, /id="fc-steel-a"/);
  assert.match(svg, /id="fc-dark-cyl"/);
  assert.match(svg, /<g class="fc-shadow" clip-path="url\(#fc-clip-cab\)"><path [^>]*filter="url\(#fc-soft\)"\/><path [^>]*filter="url\(#fc-touch\)"/);
  assert.match(svg, /<ellipse /, 'round box draws an elliptical top');
  assert.match(svg, /fill="var\(--mat-glass\)" fill-opacity="0\.38"/);
  assert.match(svg, /stroke="var\(--mat-copper\)"/);
  assert.deepEqual(lint(model).errors.filter((e) => e.rule === 'L6-raw-colour'), []);
  assert.throws(() => box({ at: [0, 0, 0], size: [1, 1, 1], material: 'gold' }), /material/);
  assert.throws(() => box({ at: [0, 0, 0], size: [2, 1, 1], round: true }), /round/);
});

test('L16-hidden-part: a labelled part behind a solid is an error, behind glass it is not', () => {
  const scene = (material) => renderSvg([
    box({ at: [0, 0, 0], size: [20, 20, 20], id: 'inside' }),
    dot([10, 10, 20], { on: 'inside' }),
    box({ at: [-5, 25, 0], size: [60, 6, 60], material, id: 'cover' }),
    box({ at: [25, -5, 0], size: [6, 30, 60], material, id: 'side' }),
  ], { labels: [{ at: [10, 10, 10], text: 'Inside' }] }).model;
  assert.ok(has(lint(scene('steel')).errors, 'L16-hidden-part'));
  assert.equal(has(lint(scene('glass')).errors, 'L16-hidden-part'), false);
});

test('L17-one-material: several solids of one material are an error', () => {
  const mk = (m) => renderSvg([0, 30, 60].map((x, i) => box({ at: [x, 0, 0], size: [20, 20, 20], id: `b${i}`, material: i === 2 ? m : 'plain' }))).model;
  assert.ok(has(lint(mk('plain')).errors, 'L17-one-material'));
  assert.equal(has(lint(mk('steel')).errors, 'L17-one-material'), false);
});

test('L2: a panel must lie in its face', () => {
  const ok = renderSvg([box({ at: [0, 0, 0], size: [40, 40, 40], id: 'b' }), panel([[40, 5, 5], [40, 35, 35]], { on: 'b', face: 'x' })]).model;
  assert.equal(has(lint(ok).errors, 'L2-face-detail'), false);
  const bad = renderSvg([box({ at: [0, 0, 0], size: [40, 40, 40], id: 'b' }), panel([[40, 5, 5], [40, 55, 35]], { on: 'b', face: 'x' })]).model;
  assert.ok(has(lint(bad).errors, 'L2-face-detail'));
});

test('L19-sparse: a figure with named parts needs at least 12 face details', () => {
  const shapes = [box({ at: [0, 0, 0], size: [60, 60, 60], id: 'body' }), line([[60, 5, 50], [60, 55, 50]], { on: 'body', face: 'x' })];
  const opts = { labels: [{ at: [30, 30, 30], text: 'Body' }], requiredParts: ['body'] };
  assert.ok(lint(renderSvg(shapes, opts).model).errors.some((e) => e.rule === 'L19-sparse' && /min 12/.test(e.message)));
  const rich = shapes.concat(Array.from({ length: 11 }, (_, i) => line([[60, 5, 4 + i * 4], [60, 55, 4 + i * 4]], { on: 'body', face: 'x' })));
  assert.equal(has(lint(renderSvg(rich, opts).model).errors, 'L19-sparse'), false);
});

test('round solids along x or y, discs and glow render and validate', () => {
  const shapes = [
    box({ at: [0, 0, 0], size: [60, 60, 40], material: 'steel', id: 'body' }),
    box({ at: [10, 20, 40], size: [40, 12, 12], round: 'x', material: 'dark', id: 'drum', rests: 'body' }),
    disc([60, 30, 20], { on: 'body', face: 'x', r: 6, material: 'glass', id: 'porthole' }),
    glow([30, 30, 60], { r: 10, id: 'lamp' }),
  ];
  const { svg, model } = renderSvg(shapes);
  assert.match(svg, /id="fc-dark-lie"/);
  assert.match(svg, /filter="url\(#fc-glow\)"/);
  assert.equal(has(lint(model).errors, 'L2-face-detail'), false);
  const bad = renderSvg([shapes[0], disc([60, 58, 20], { on: 'body', face: 'x', r: 6 })]).model;
  assert.ok(has(lint(bad).errors, 'L2-face-detail'), 'a disc must stay inside its face');
  assert.throws(() => box({ at: [0, 0, 0], size: [10, 4, 6], round: 'x' }), /round/);
  assert.throws(() => disc([0, 0, 0], { on: 'b', r: 0 }), /r must/);
});

test('L19-sparse scales with the object: one detail per solid on average, and no large bare solid', () => {
  const body = box({ at: [0, 0, 0], size: [60, 60, 60], material: 'steel', id: 'body' });
  const side = box({ at: [70, 0, 0], size: [40, 60, 60], material: 'white', id: 'side' });
  const lines = (id, x, n) => Array.from({ length: n }, (_, i) => line([[x, 5, 4 + i * 4], [x, 55, 4 + i * 4]], { on: id, face: 'x' }));
  const opts = { labels: [{ at: [30, 30, 30], text: 'Body' }], requiredParts: ['body'] };
  const bare = lint(renderSvg([body, ...lines('body', 60, 12), side], opts).model);
  assert.ok(bare.errors.some((e) => e.rule === 'L19-sparse' && /side covers/.test(e.message)));
  const ok = lint(renderSvg([body, ...lines('body', 60, 12), side, ...lines('side', 110, 2)], opts).model);
  assert.equal(has(ok.errors, 'L19-sparse'), false);
  const many = [body, ...lines('body', 60, 12), ...Array.from({ length: 14 }, (_, i) => box({ at: [70 + i * 6, 0, 0], size: [4, 4, 4], material: 'dark', id: `bit-${i}` }))];
  assert.ok(lint(renderSvg(many, opts).model).errors.some((e) => e.rule === 'L19-sparse' && /min 15 for 15 solids/.test(e.message)));
});

test('a labelled moving part gets an unseen hit area along its path, and solids get a contact shadow', () => {
  const { svg } = renderSvg([
    box({ at: [0, 0, 0], size: [80, 80, 4], id: 'ground' }),
    box({ at: [10, 10, 4], size: [8, 8, 8], material: 'blue', id: 'puck', rests: 'ground', move: [40, 0, 0] }),
  ], { labels: [{ at: [14, 14, 8], text: 'Puck' }] });
  assert.match(svg, /data-id="puck"[^>]*><path d="[^"]+" fill="none" stroke="none" pointer-events="all"/);
  assert.match(svg, /filter="url\(#fc-touch\)"/);
});

test('line weight follows the size of the drawing: a small scene gets a thinner stroke than a large one', () => {
  const w = (size) => Number(/stroke-width="([\d.]+)" stroke-linejoin/.exec(renderSvg([box({ at: [0, 0, 0], size, r: 0 })]).svg)[1]);
  const small = w([30, 30, 30]); const large = w([300, 300, 300]);
  assert.ok(small < large, `${small} < ${large}`);
  assert.ok(small >= 0.25 && large <= 1);
});
