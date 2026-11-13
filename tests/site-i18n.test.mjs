/**
 * i18n dictionary parity tests.
 * @governed-by PO_ARCHITECT
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { DICTS } from '../src/site/lib/i18n.mjs';

test('en and kh have identical keys', () => {
  assert.deepEqual(Object.keys(DICTS.en).sort(), Object.keys(DICTS.kh).sort());
  assert.ok(Object.keys(DICTS.en).length > 0);
});

test('no empty strings', () => {
  for (const lang of ['en', 'kh']) {
    for (const [k, v] of Object.entries(DICTS[lang])) {
      assert.equal(typeof v, 'string', `${lang}.${k}`);
      assert.ok(v.trim().length > 0, `${lang}.${k} empty`);
    }
  }
});
