import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slugify, excerpt } from '../src/slug.js';

test('slugify lower-cases one word', () => {
  assert.equal(slugify('Hello'), 'hello');
});

test('slugify joins two words', () => {
  assert.equal(slugify('Hello World'), 'hello-world');
});

test('slugify joins three words', () => {
  assert.equal(slugify('Hello Big World'), 'hello-big-world');
});

test('excerpt keeps a short text', () => {
  assert.equal(excerpt('short', 10), 'short');
});

test('excerpt cuts a long text', () => {
  assert.equal(excerpt('abcdefghij', 4), 'abcd...');
});
