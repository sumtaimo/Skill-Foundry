/**
 * Tests for figure-craft open boxes, contents and the four-view orbit.
 * @governed-by PO_ARCHITECT
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { box, line, panel, renderSvg } from '../src/skills/figure-craft/engine/iso.mjs';
import { lint, lintViews, lintStates } from '../src/skills/figure-craft/engine/lint.mjs';
import { turnShapes, sortShapes, renderViews, renderStates, orbitHtml } from '../src/skills/figure-craft/engine/orbit.mjs';

const has = (list, id) => list.some((e) => e.rule === id);
function scene(extra = {}) {
  return [
    box({ at: [0, 0, 0], size: [130, 120, 3], id: 'ground' }),
    box({ at: [20, 20, 3], size: [50, 50, 120], material: 'steel', id: 'cab', rests: 'ground', open: 'x', wall: 3, ...extra }),
    box({ at: [23, 23, 60], size: [47, 44, 2], material: 'glass', inside: 'cab', id: 'shelf' }),
    box({ at: [50, 30, 62], size: [10, 10, 18], round: true, material: 'green', inside: 'cab', id: 'bottle', rests: 'shelf' }),
    line([[55, 32, 80], [55, 38, 80]], { on: 'bottle', face: 'top', id: 'cap' }),
    panel([[20, 26, 10], [20, 64, 50]], { on: 'cab', face: '-x', material: 'dark', id: 'grille' }),
    box({ at: [70, 20, 3], size: [46, 3, 120], material: 'steel', id: 'door', rests: 'ground' }),
  ];
}
const labels = [{ at: [55, 35, 70], text: 'Bottle' }];

test('open box: the inside is drawn and contents are clipped to the opening', () => {
  const { svg, model } = renderSvg(scene(), { labels, requiredParts: ['bottle'] });
  assert.match(svg, /<clipPath id="fc-open-cab">/);
  assert.match(svg, /<g clip-path="url\(#fc-open-cab\)"><g data-id="shelf"/);
  assert.match(svg, /var\(--mat-cavity\)/);
  assert.equal(model.shapes.some((s) => s.id === 'grille'), false, 'back-side details are not drawn in the front view');
  assert.equal(has(lint(model).errors, 'L16-hidden-part'), false);
  assert.throws(() => box({ at: [0, 0, 0], size: [4, 4, 4], open: 'top' }), /open/);
});

test('L16: contents of a closed box are hidden; L18: contents must stay inside', () => {
  const closed = scene().map((s) => (s.id === 'cab' ? (({ open, wall, ...r }) => r)(s) : s));
  const shut = renderSvg(closed, { labels, requiredParts: ['bottle'] });
  assert.doesNotMatch(shut.svg, /data-id="bottle"/, 'contents of a closed body are not drawn');
  assert.ok(lint(shut.model).errors.some((e) => e.rule === 'L16-hidden-part' && /no open side/.test(e.message)));
  const out = scene(); out[3] = box({ at: [80, 30, 62], size: [10, 10, 18], inside: 'cab', id: 'bottle' });
  assert.ok(has(lint(renderSvg(out).model).errors, 'L18-outside-container'));
});

test('turnShapes: a quarter turn swaps width and depth, moves details to their new side and hides what faces away', () => {
  const t1 = turnShapes(scene(), 1);
  const cab = t1.find((s) => s.id === 'cab');
  assert.deepEqual(cab.size, [50, 50, 120]);
  assert.equal(cab.open, undefined, 'the open side now faces away');
  assert.equal(t1.some((s) => s.id === 'bottle' || s.id === 'shelf' || s.id === 'cap'), false, 'contents are hidden with it');
  assert.equal(t1.find((s) => s.id === 'grille').face, 'y');
  const door = t1.find((s) => s.id === 'door');
  assert.deepEqual(door.size, [3, 46, 120]);
  assert.equal(turnShapes(scene(), 0).length, scene().length);
  assert.throws(() => turnShapes(scene(), 4), /k must/);
});

test('sortShapes: farther solids first, contents after their container, details after their solid', () => {
  const order = sortShapes(turnShapes(scene(), 0)).map((s) => s.id);
  assert.ok(order.indexOf('ground') < order.indexOf('cab'));
  assert.ok(order.indexOf('cab') < order.indexOf('shelf'));
  assert.ok(order.indexOf('shelf') < order.indexOf('bottle'));
  assert.equal(order.indexOf('cap'), order.indexOf('bottle') + 1);
});

test('renderViews and orbitHtml: four views with separate ids, controls and a no-script fallback', () => {
  const views = renderViews(scene(), { labels, requiredParts: ['bottle'], title: 'Cabinet' });
  assert.equal(views.length, 4);
  views.forEach((v, i) => assert.match(v.svg, new RegExp(`class="fc${i}-fig"`)));
  assert.match(views[1].svg, /data-id="grille"/, 'the back side shows after a turn');
  assert.doesNotMatch(views[1].svg, /data-id="bottle"/);
  const html = orbitHtml(views, { label: 'Cabinet' });
  assert.match(html, /data-view="0">/);
  assert.match(html, /data-view="1" hidden>/);
  assert.match(html, /aria-label="Turn left"/);
  assert.match(html, /ArrowRight/);
  assert.doesNotMatch(html, /<script src=/);
  const r = lintViews(views);
  assert.deepEqual(r.errors.filter((e) => /^view /.test(e.message)), []);
  assert.throws(() => orbitHtml(views.slice(0, 2)), /four/);
});

test('cutaway: open xy shows the whole inside and turns with the body', () => {
  const sc = scene({ open: 'xy' });
  const { model } = renderSvg(sc, { labels });
  assert.equal(has(lint(model).errors, 'L16-hidden-part'), false);
  assert.equal(turnShapes(sc, 1).find((s) => s.id === 'cab').open, 'x');
  assert.equal(turnShapes(sc, 3).find((s) => s.id === 'cab').open, 'y');
  assert.equal(turnShapes(sc, 2).find((s) => s.id === 'cab').open, undefined);
});

test('states: shapes with when are drawn only in their state, and the orbit gets a state button', () => {
  const sc = scene().filter((s) => s.id !== 'door').concat([
    box({ at: [70, 20, 3], size: [46, 3, 120], material: 'steel', id: 'door', when: 'open' }),
    box({ at: [70, 20, 3], size: [3, 50, 120], material: 'steel', id: 'door', when: 'closed' }),
  ]);
  const states = renderStates(sc, { labels, requiredParts: ['bottle'], states: ['open', 'closed'] });
  assert.deepEqual(Object.keys(states), ['open', 'closed']);
  assert.deepEqual(states.open[0].model.shapes.find((s) => s.id === 'door').size, [46, 3, 120]);
  assert.deepEqual(states.closed[0].model.shapes.find((s) => s.id === 'door').size, [3, 50, 120]);
  assert.notEqual(states.open[0].svg.match(/class="(\w+)-fig"/)[1], states.closed[0].svg.match(/class="(\w+)-fig"/)[1]);
  const html = orbitHtml(states, { label: 'Cabinet' });
  assert.match(html, /data-state="open" data-view="0">/);
  assert.match(html, /data-state="closed" data-view="0" hidden>/);
  assert.match(html, /data-orbit-toggle[^>]*>Closed</);
  assert.match(html, /max-height:min\(70vh,640px\)/, 'the figure never grows taller than the screen');
  assert.ok(Array.isArray(lintStates(states).errors));
  assert.deepEqual(Object.keys(renderStates(scene(), { labels })), ['default']);
});

test('lintViews: a part hidden from the front passes when another side shows it', () => {
  const sc = [
    box({ at: [20, -12, 0], size: [20, 12, 20], material: 'dark', id: 'motor' }), // behind the body: drawn first
    panel([[22, -12, 4], [38, -12, 16]], { on: 'motor', face: '-y', material: 'steel', id: 'motor-plate' }),
    box({ at: [0, 0, 0], size: [60, 60, 80], material: 'steel', id: 'body' }),
    box({ at: [70, 0, 0], size: [10, 10, 10], material: 'plain', id: 'stool' }),
  ];
  const lab = [{ at: [30, -6, 10], text: 'Motor' }];
  assert.ok(has(lint(renderSvg(sc, { labels: lab }).model).errors, 'L16-hidden-part'));
  assert.equal(has(lintViews(renderViews(sc, { labels: lab })).errors, 'L16-hidden-part'), false);
});

test('a cutaway reads as a solid hollow: section band through the walls, inside lined like the body and shaded', () => {
  const steel = renderSvg([box({ at: [0, 0, 0], size: [60, 60, 80], material: 'steel', id: 'body', open: 'xy', wall: 4 })]).svg;
  assert.match(steel, /fill="var\(--mat-section\)"/, 'the cut through the walls is drawn');
  assert.match(steel, /class="fc-shade" d="[^"]+" fill="var\(--mat-shadow\)" opacity="0\.1"/, 'the inside sits in shade');
  assert.match(steel, /fill="var\(--mat-white-b\)"/, 'a light body has a light liner');
  const dark = renderSvg([box({ at: [0, 0, 0], size: [60, 60, 30], material: 'dark', id: 'bay', open: 'xy', wall: 3 })]).svg;
  assert.match(dark, /fill="var\(--iso-ink-b\)"/, 'a dark body is dark inside');
  assert.doesNotMatch(dark, /fill="var\(--mat-white-b\)"/);
  const one = renderSvg([box({ at: [0, 0, 0], size: [60, 60, 80], material: 'steel', id: 'body', open: 'y', wall: 4 })]).svg;
  assert.doesNotMatch(one, /--mat-section\)"/, 'one open side keeps its frame in the body material');
});
