/**
 * Visual check of the figure-craft demo page.
 * @governed-by PO_ARCHITECT
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { checkPage, SKIP_REASON } from '../src/factory/visual.mjs';

const demo = fileURLToPath(new URL('../src/skills/figure-craft/examples/demo.html', import.meta.url));

test('figure-craft demo renders cleanly at 1440/390, light/dark, reduced motion', async (t) => {
  const res = await checkPage(demo, { widths: [1440, 390], themes: ['light', 'dark'], reducedMotion: true });
  if (res.skipped === SKIP_REASON) {
    assert.equal(res.ok, null);
    t.skip(`visual check skipped: ${SKIP_REASON}`);
    return;
  }
  const bad = (res.problems || []).filter((p) => ['console-error', 'horizontal-scroll', 'text-outside-svg'].includes(p.kind));
  assert.deepEqual(bad, [], JSON.stringify(bad));
});
