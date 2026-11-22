import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../src/server.js';

test('home page answers 200', async () => {
  const s = createServer().listen(0);
  const r = await fetch(`http://localhost:${s.address().port}/`);
  assert.equal(r.status, 200);
  s.close();
});
