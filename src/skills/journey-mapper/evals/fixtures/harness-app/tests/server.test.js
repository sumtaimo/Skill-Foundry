import test from 'node:test';
import assert from 'node:assert/strict';
import { server } from '../src/server.js';

test('the home page and the notes list answer', async () => {
  await new Promise((r) => server.listen(0, r));
  const base = `http://127.0.0.1:${server.address().port}`;
  assert.equal((await fetch(`${base}/`)).status, 200);
  assert.deepEqual(await (await fetch(`${base}/notes`)).json(), []);
  server.close();
});
