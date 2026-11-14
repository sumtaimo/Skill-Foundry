/**
 * Tests for figure-craft round bodies: cutaway and open top, details that wrap round the wall, parts attached to the
 * outside (lint L20), lids that lift, rounded top edges, cards that name where each part sits (R31-card-location).
 * @governed-by PO_ARCHITECT
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { box, line, renderSvg, openingPolys, boxOutline } from '../src/skills/figure-craft/engine/iso.mjs';
import { renderStates, orbitHtml, sortShapes, turnShapes } from '../src/skills/figure-craft/engine/orbit.mjs';
import { lint, lintStates } from '../src/skills/figure-craft/engine/lint.mjs';
import { ring, band, studs, attach, handle, spout, lid, topRing, surfacePoint } from '../src/skills/figure-craft/engine/kit.mjs';
import { cardsHtml, lintCards } from '../src/skills/figure-craft/engine/page.mjs';
import { runsIn, maskOfFaces, VISIBLE, visibleRuns, angleIsOpen } from '../src/skills/figure-craft/engine/round.mjs';

const has = (list, rule, re) => list.some((e) => e.rule === rule && (!re || re.test(e.message)));
const jug = (extra = {}) => box({ at: [10, 10, 10], size: [44, 44, 60], round: true, material: 'steel', id: 'jug', wall: 2.5, ...extra });

test('a round body opens: each open face removes a quarter of the wall, the inside is a clipped hollow', () => {
  const half = jug({ open: 'xy', mouth: true });
  const { svg, model } = renderSvg([half, box({ at: [14, 14, 12.5], size: [36, 36, 20], round: true, material: 'blue', inside: 'jug', id: 'water' })]);
  assert.match(svg, /<clipPath id="fc-open-jug">/);
  assert.match(svg, /var\(--mat-section\)/, 'the cut through the wall is drawn in the section tone');
  assert.match(svg, /id="fc-in-jug"/, 'the inside wall has its own shading');
  assert.equal(model.shapes.length, 2, 'the water is drawn, not shut away');
  const polys = openingPolys(half);
  assert.equal(polys.length, 2, 'a strip of wall plus the open top');
  assert.equal(openingPolys(jug()), null, 'a closed round body has no opening');
  const quarter = openingPolys(jug({ open: 'y' }));
  assert.equal(quarter.length, 1);
  assert.ok(quarter[0].length > 6);
});

test('a round body that is shut hides its contents; one with an open top shows them', () => {
  const water = box({ at: [14, 14, 12.5], size: [36, 36, 20], round: true, material: 'blue', inside: 'jug', id: 'water' });
  assert.equal(renderSvg([jug(), water]).model.shapes.length, 1, 'closed: contents are not drawn');
  assert.equal(renderSvg([jug({ mouth: true }), water]).model.shapes.length, 2, 'open top: contents show');
});

test('mouth and open are only for upright round bodies', () => {
  assert.throws(() => box({ at: [0, 0, 0], size: [20, 20, 20], mouth: true }), /mouth/);
  assert.throws(() => box({ at: [0, 0, 0], size: [40, 10, 10], round: 'x', open: 'x' }), /lying/);
  assert.throws(() => box({ at: [0, 0, 0], size: [20, 20, 20], round: true, mouth: true, wall: 12 }), /wall/);
});

test('L16 for round bodies: contents are seen through the cut-away wall, and a cover that shuts them in is an error', () => {
  const water = box({ at: [14, 14, 12.5], size: [36, 36, 20], round: true, material: 'blue', inside: 'jug', id: 'water', rests: 'jug' });
  const labels = [{ at: [32, 32, 20], text: 'Water' }];
  const open = lint(renderSvg([jug({ open: 'xy', mouth: true }), water], { labels, requiredParts: ['water'] }).model);
  assert.equal(has(open.errors, 'L16-hidden-part'), false, JSON.stringify(open.errors));
  const shut = lint(renderSvg([jug({ id: 'jug' }), water], { labels, requiredParts: ['water'] }).model);
  assert.ok(shut.errors.some((e) => e.rule === 'L16-hidden-part' || e.rule === 'L14-missing-part'));
});

test('L18 for round bodies: contents must fit the circle, not the bounding square', () => {
  const inCircle = box({ at: [20, 20, 12.5], size: [20, 20, 10], material: 'blue', inside: 'jug', id: 'cube' });
  const corner = box({ at: [10.5, 10.5, 12.5], size: [12, 12, 10], material: 'blue', inside: 'jug', id: 'corner' });
  const ok = lint(renderSvg([jug({ mouth: true }), inCircle]).model);
  assert.equal(has(ok.errors, 'L18-outside-container'), false);
  const bad = lint(renderSvg([jug({ mouth: true }), corner]).model);
  assert.ok(has(bad.errors, 'L18-outside-container', /round wall/));
});

test('openings follow the turn: the cut moves to the back and the body shuts', () => {
  const t = turnShapes([jug({ open: 'xy', mouth: true })], 2).find((s) => s.id === 'jug');
  assert.equal(t.open, undefined);
  assert.deepEqual(t.openBack, ['-x', '-y']);
  const runs = runsIn(maskOfFaces(['x', 'y']), VISIBLE);
  assert.equal(runs.length, 1);
  assert.equal(runs[0].cutStart, false, 'the run meets the silhouette on both sides');
  const one = runsIn(maskOfFaces(['y']), VISIBLE)[0];
  assert.deepEqual([one.from, one.to, one.cutStart, one.cutEnd], [45, 135, true, false]);
});

test('wrap details follow the wall: rings, bands and studs lie on it and show only on the near half', () => {
  const body = jug();
  const shapes = [body, ring(body, 30, { id: 'r1' }), band(body, 40, 55, { from: 60, to: 120, material: 'glass', id: 'win' }), ...studs(body, 20, 3, { id: 'st' })];
  const { svg, model } = renderSvg(shapes);
  assert.equal(lint(model).errors.filter((e) => e.rule === 'L2-face-detail').length, 0);
  assert.match(svg, /data-id="r1"/);
  // a ring at the back of the body shows after a turn, so this view counts it as a back detail, not as a drawn one
  const back = line(visibleRunsFor(body, 200, 250, 30), { on: 'jug', face: 'wrap', id: 'back' });
  const m2 = renderSvg([body, back]).model;
  assert.equal(m2.shapes.some((s) => s.id === 'back'), false);
  assert.equal(m2.backDetails.jug, 1);
  // off the wall is an error
  const off = line([[45, 45, 30], [50, 50, 30]], { on: 'jug', face: 'wrap', id: 'off' });
  assert.ok(has(lint(renderSvg([body, off]).model).errors, 'L2-face-detail', /not on the wall/));
  assert.ok(has(lint(renderSvg([box({ at: [0, 0, 0], size: [20, 20, 20], id: 'cube' }), line([[20, 5, 5], [20, 15, 5]], { on: 'cube', face: 'wrap', id: 'w' })]).model).errors, 'L2-face-detail', /upright round/));
  assert.throws(() => ring(box({ at: [0, 0, 0], size: [20, 20, 20], id: 'cube' }), 5), /round/);
  assert.equal(visibleRuns(body, [surfacePoint(body, 200, 5), surfacePoint(body, 210, 5)]).length, 0);
});
function visibleRunsFor(body, a0, a1, z) { return [surfacePoint(body, a0, z), surfacePoint(body, (a0 + a1) / 2, z), surfacePoint(body, a1, z)]; }

test('L20: a handle stays outside its body, touches it and sits where there is wall', () => {
  const body = jug();
  const good = lint(renderSvg([...handle(body, '-x', { id: 'h', z0: 25, z1: 62 }), body], {}).model);
  assert.equal(has(good.errors, 'L20-attach-outside'), false, JSON.stringify(good.errors));

  const floating = box({ at: [60, 28, 30], size: [6, 4, 20], id: 'slab', attach: 'jug' });
  assert.ok(has(lint(renderSvg([body, floating]).model).errors, 'L20-attach-outside', /floats/));

  const inside = box({ at: [20, 28, 30], size: [10, 6, 20], id: 'slab', attach: 'jug' });
  assert.ok(has(lint(renderSvg([body, inside]).model).errors, 'L20-attach-outside', /inside jug/));

  const cut = jug({ open: 'xy', mouth: true });
  const onCut = attach(cut, 'x', { reach: 8, width: 4, z: 30, height: 20, id: 'slab' });
  assert.ok(has(lint(renderSvg([cut, onCut]).model).errors, 'L20-attach-outside', /no wall/));
  const behind = attach(cut, '-x', { reach: 8, width: 4, z: 30, height: 20, id: 'slab' });
  assert.equal(has(lint(renderSvg([behind, cut]).model).errors, 'L20-attach-outside'), false);

  assert.ok(has(lint(renderSvg([body, ...handle(body, '-x', { id: 'h', z0: 25, z1: 62 })]).model).errors, 'L20-attach-outside', /behind jug but drawn after/));
  assert.ok(has(lint(renderSvg([...handle(body, 'x', { id: 'h', z0: 25, z1: 62 }), body]).model).errors, 'L20-attach-outside', /in front of jug but drawn before/));
  assert.ok(has(lint(renderSvg([body, box({ at: [0, 0, 0], size: [5, 5, 5], id: 's', attach: 'nope' })]).model).errors, 'L20-attach-outside', /unknown body/));
  assert.throws(() => attach({ kind: 'box' }, 'x', { reach: 1, width: 1, z: 0, height: 1, id: 'a' }), /id/);
});

test('L20 holds from every side: a handle that is fine in front is checked in the turned views too', () => {
  const body = jug();
  const states = renderStates([...handle(body, '-x', { id: 'h', z0: 25, z1: 62 }), body], { requiredParts: [], labels: [] });
  const r = lintStates(states);
  assert.equal(r.errors.some((e) => e.rule === 'L20-attach-outside'), false, JSON.stringify(r.errors.filter((e) => e.rule === 'L20-attach-outside')));
});

test('sortShapes draws an attached part before the body when it is behind it and after it when in front, contents following their container', () => {
  const body = jug({ mouth: true });
  const water = box({ at: [14, 14, 12.5], size: [36, 36, 20], round: true, material: 'blue', inside: 'jug', id: 'water' });
  const back = attach(body, '-x', { reach: 8, width: 4, z: 61, height: 5, id: 'back' });
  const front = attach(body, 'x', { reach: 8, width: 4, z: 61, height: 5, id: 'front' });
  const ids = sortShapes([body, water, front, back]).map((s) => s.id);
  assert.ok(ids.indexOf('back') < ids.indexOf('jug'));
  assert.ok(ids.indexOf('front') > ids.indexOf('jug'));
});

test('spout and handle give small parts with details; the lid lifts off and leaves a dashed axis', () => {
  const body = jug({ mouth: true });
  const h = handle(body, 'x', { id: 'handle', z0: 25, z1: 62 });
  assert.equal(h.filter((s) => s.kind === 'box').length, 3);
  assert.ok(h.filter((s) => s.kind === 'line').length >= 4);
  const sp = spout(body, '-x', { id: 'spout', z: 45 });
  assert.equal(sp.filter((s) => s.kind === 'box').length, 2);
  assert.equal(sp.find((s) => s.id === 'spout').round, 'x');
  const parts = lid(body, { id: 'lid' });
  const open = parts.filter((s) => s.when === 'open' && s.id === 'lid')[0];
  const closed = parts.filter((s) => s.when === 'closed' && s.id === 'lid')[0];
  assert.ok(open.at[2] > closed.at[2] + 30, 'the open lid is lifted well clear of the mouth');
  assert.equal(closed.at[2], 70);
  assert.equal(closed.rests, 'jug');
  assert.ok(parts.some((s) => s.dash === true && s.when === 'open'));
  const r = lint(renderSvg([body, ...parts.filter((s) => s.when !== 'closed')]).model);
  assert.equal(r.errors.some((e) => e.rule === 'L15-floating' && /lid/.test(e.message)), false, 'a lifted lid declares rests, so it is not floating');
  assert.equal(has(r.errors, 'L2-face-detail'), false, JSON.stringify(r.errors.filter((e) => e.rule === 'L2-face-detail')));
  assert.ok(topRing(body, 10).on === 'jug');
});

test('a lifted lid casts no shadow on the body and a round part casts a round shadow', () => {
  const body = jug({ mouth: true, id: 'jug' });
  const base = box({ at: [8, 8, 0], size: [48, 48, 10], round: true, id: 'base' });
  const { svg } = renderSvg([base, { ...body, rests: 'base' }, ...lid(body, { id: 'lid' }).filter((s) => s.when === 'open')]);
  assert.doesNotMatch(svg, /fc-clip-lid"/, 'the lifted lid casts nothing on the body');
  assert.match(svg, /fc-clip-jug"/, 'the jug casts one on its round base');
});

test('the top edge is rounded over: a lit ring and a lit strip, and edge: 0 keeps it sharp', () => {
  const soft = renderSvg([box({ at: [0, 0, 0], size: [40, 40, 30], r: 0, material: 'steel' })]).svg;
  assert.match(soft, /class="fc-bevel"[^>]*fill-rule="evenodd"/);
  const sharp = renderSvg([box({ at: [0, 0, 0], size: [40, 40, 30], r: 0, material: 'steel', edge: 0 })]).svg;
  assert.doesNotMatch(sharp, /fc-bevel/);
  const cyl = renderSvg([jug()]).svg;
  assert.match(cyl, /fill-rule="evenodd"/);
  assert.equal(renderSvg([box({ at: [0, 0, 0], size: [40, 40, 30], material: 'glass' })]).svg.includes('fc-bevel'), false, 'glass keeps no rim highlight');
  assert.throws(() => box({ at: [0, 0, 0], size: [4, 4, 4], edge: -1 }), /edge/);
});

test('a round body outlines as a cylinder, not as its bounding box', () => {
  const round = boxOutline(box({ at: [0, 0, 0], size: [40, 40, 30], round: true }));
  const sq = boxOutline(box({ at: [0, 0, 0], size: [40, 40, 30] }));
  const width = (o) => Math.max(...o.map((p) => p[0])) - Math.min(...o.map((p) => p[0]));
  assert.ok(width(round) < width(sq));
  assert.equal(angleIsOpen(jug({ open: 'y' }), 90), true);
  assert.equal(angleIsOpen(jug({ open: 'y' }), 200), false);
});

test('cards say where each part sits (R31-card-location): a card without a location or source is an error', () => {
  const good = [{ name: 'Lid', does: 'Closes the top of the jug.', where: 'On the open top of the jug body, lifting straight up.', source: 'The user said it is a lift-off lid.' }];
  assert.equal(lintCards(good, [{ text: 'Lid' }]).errors.length, 0);
  assert.ok(lintCards([{ ...good[0], where: '' }], []).errors.some((e) => e.rule === 'R31-card-location' && /where/.test(e.message)));
  assert.ok(lintCards([{ ...good[0], source: '' }], []).errors.some((e) => /source/.test(e.message)));
  assert.equal(lintCards([{ ...good[0], source: '', assumed: true }], []).errors.length, 0, 'a guess marked as assumed is allowed');
  assert.ok(lintCards(good, [{ text: 'Lid' }, { text: 'Spout' }]).errors.some((e) => /Spout/.test(e.message)));
  assert.throws(() => cardsHtml([{ name: 'Lid', does: 'Closes the top of the jug.' }]), /where/);
  const html = cardsHtml([{ ...good[0], assumed: true }]);
  assert.match(html, /Where it sits:/);
  assert.match(html, /Assumed/);
  assert.match(html, /Source: The user said/);
});

test('the orbit scrubs between true views while dragging and keeps four views', () => {
  const shapes = [box({ at: [0, 0, 0], size: [20, 20, 20], id: 'b' })];
  const html = orbitHtml(renderStates(shapes, {}), {});
  assert.match(html, /pointermove/);
  assert.equal((html.match(/data-view="/g) ?? []).length, 4);
  assert.match(html, /pointerup/);
});

test('a label of a part that is shut away is dropped, not moved onto the body around it', () => {
  const water = box({ at: [14, 14, 12.5], size: [36, 36, 20], round: true, material: 'blue', inside: 'jug', id: 'water' });
  const labels = [{ at: [32, 32, 20], text: 'Water' }];
  const shut = renderSvg([jug(), water], { labels });
  assert.equal(shut.model.labels.length, 0, 'closed: no chip says Water on the jug');
  assert.equal(renderSvg([jug({ mouth: true }), water], { labels }).model.labels.length, 1, 'open top: the chip stays');
});
