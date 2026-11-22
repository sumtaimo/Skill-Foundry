import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openOrders, averageValue, ship } from '../src/orders.js';

const list = [
  { id: 1, status: 'open', createdAt: 30, cents: 1000 },
  { id: 2, status: 'shipped', createdAt: 10, cents: 3000 },
  { id: 3, status: 'open', createdAt: 20, cents: 2000 },
];

test('openOrders keeps open orders, oldest first', () => {
  assert.deepEqual(openOrders(list).map((o) => o.id), [3, 1]);
});

test('averageValue of three orders', () => {
  assert.equal(averageValue(list), 2000);
});

test('averageValue of no orders is 0', () => {
  assert.equal(averageValue([]), 0);
});

test('ship sets the status', () => {
  assert.equal(ship({ id: 9, status: 'open' }, 5).status, 'shipped');
});
