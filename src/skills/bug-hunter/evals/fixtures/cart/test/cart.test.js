import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cartTotal, itemCount } from '../src/cart.js';

test('cartTotal adds every item', () => {
  assert.equal(cartTotal([{ price: 5, qty: 3 }, { price: 10, qty: 1 }]), 25);
});

test('cartTotal of an empty cart is 0', () => {
  assert.equal(cartTotal([]), 0);
});

test('itemCount counts units', () => {
  assert.equal(itemCount([{ price: 5, qty: 3 }, { price: 10, qty: 1 }]), 4);
});
