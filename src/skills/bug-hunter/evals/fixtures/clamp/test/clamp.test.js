import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clamp } from '../src/clamp.js';

test('clamp keeps a value inside the range', () => {
  assert.equal(clamp(5, 0, 10), 5);
});

test('clamp raises a low value to min', () => {
  assert.equal(clamp(-3, 0, 10), 0);
});

test('clamp lowers a high value to max', () => {
  assert.equal(clamp(42, 0, 10), 10);
});
