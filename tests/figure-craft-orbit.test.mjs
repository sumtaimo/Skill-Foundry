/**
 * Tests for figure-craft open boxes, contents and the four-view orbit.
 * @governed-by PO_ARCHITECT
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { box, line, panel, renderSvg } from '../src/skills/figure-craft/engine/iso.mjs';
import { lint, lintViews } from '../src/skills/figure-craft/engine/lint.mjs';
import { turnShapes, sortShapes, renderViews, orbitHtml } from '../src/skills/figure-craft/engine/orbit.mjs';

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
  assert.ok(lint(renderSvg(closed, { labels }).model).errors.some((e) => e.rule === 'L16-hidden-part' && /no open side/.test(e.message)));
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
