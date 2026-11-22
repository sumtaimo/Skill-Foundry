import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toCents, fmt } from '../src/price.js';

test('toCents converts whole dollars', () => {
  assert.equal(toCents(3), 300);
});

test('toCents rounds to the nearest cent', () => {
  assert.equal(toCents(19.99), 1999);
});

test('fmt shows dollars and cents', () => {
  assert.equal(fmt(1999), '$19.99');
});
