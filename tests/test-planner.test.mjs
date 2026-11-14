/**
 * test-planner: lint is clean, evals pass on reference answers and fail on bad ones, versions are in step.
 * @governed-by PO_ARCHITECT
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runEvals } from '../src/factory/evals.mjs';
import { lintSkill } from '../src/factory/lint-skills.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'src', 'skills', 'test-planner');
const FIX = 'This skill does not write test code or review code for bugs.';

const answers = {
  'checkout-promo-description': '## Regression checklist: promo codes\n\nChange: promo code field.\n\n### Checkout\n1. [ ] Enter a valid code. _A valid code lowers the order total before tax._\n2. [ ] Enter an invalid code and check "This code is not valid." shows. _An invalid code shows "This code is not valid."_\n3. [ ] Check the field is on the cart review step. _promo code field_\n\n### Orders\n4. [ ] Place an order and check it stores the code. _Orders store the code that was applied._\n\n### footer\n5. [ ] Check the "Coupon" link no longer appears. _The old "Coupon" link in the footer is removed._\n\n### Possible impact, not stated\n- Do refunds keep the discount?\n\n### Open questions\n- None.',
  'cart-limit-diff': '## Regression checklist: cart\n\nChange: limit 20.\n\n### cart\n1. [ ] Check the limit is 20. _const MAX_ITEMS = 20;_\n2. [ ] Check "Your cart is full" shows. _showMessage("Your cart is full")_\n\n### Possible impact, not stated\n- None.\n\n### Open questions\n- Does the diff match the intended change?',
  'removed-behaviour': '## Regression checklist: reports\n\nChange: PDF export removed.\n\n### Reports page\n1. [ ] Check the Export to PDF button no longer appears. _The Export to PDF button is removed_\n\n### Possible impact, not stated\n- None.\n\n### Open questions\n- Does CSV export replace it?',
  'user-named-area-not-in-change': '## Regression checklist: footer\n\nChange: Help link opens in a new tab.\n\n### footer\n1. [ ] Click the Help link and check it opens in a new tab. _The footer Help link now opens in a new tab_\n\n### Possible impact, not stated\n- Does login change? The change text does not name it.\n\n### Open questions\n- None.',
  'description-diff-conflict': '## Regression checklist: cart limit\n\nChange: limit.\n\n### cart\n1. [ ] Check the limit is 20. _the cart limit is now 20 items_\n2. [ ] Check the limit is 25. _const MAX_ITEMS = 25;_\n\n### Possible impact, not stated\n- None.\n\n### Open questions\n- Conflict: the description says 20 and the diff says 25.',
  'negative-write-test-code': `${FIX}\n\n## Regression checklist: promo check\n\n### promotions service\n1. [ ] Enter a code and check the service is called. _checked by calling the promotions service_\n\n### Possible impact, not stated\n- None.\n\n### Open questions\n- None.`,
  'negative-bug-review': `${FIX}\n\n## Regression checklist: cart\n\n### cart\n1. [ ] Check the limit is 20. _const MAX_ITEMS = 20;_\n\n### Possible impact, not stated\n- None.\n\n### Open questions\n- None.`,
  'no-change-text': 'Paste the change description or the diff you want the checklist for.',
  'title-only': 'Describe what changed in the new checkout release.',
};

test('test-planner lint is clean', async () => {
  const problems = await lintSkill(DIR, { testsDir: path.join(ROOT, 'tests') });
  assert.deepEqual(problems, []);
});

test('test-planner evals pass on reference answers', () => {
  const cases = JSON.parse(readFileSync(path.join(DIR, 'evals', 'cases.json'), 'utf8'));
  assert.equal(cases.length, Object.keys(answers).length);
  const byPrompt = Object.fromEntries(cases.map((c) => [c.prompt, answers[c.id]]));
  const r = runEvals(DIR, (p) => ({ text: byPrompt[p] }));
  assert.equal(r.failed, 0, JSON.stringify(r.results.filter((x) => !x.ok)));
});

test('test-planner evals reject a checklist for missing change text and test code for a test request', () => {
  const bad = '1. [ ] Test everything. _x_\n### Checkout';
  const r = runEvals(DIR, () => ({ text: bad }));
  for (const id of ['no-change-text', 'title-only', 'negative-write-test-code', 'negative-bug-review']) assert.equal(r.results.find((x) => x.id === id).ok, false, id);
  const code = runEvals(DIR, () => ({ text: `${FIX}\ndescribe("x", () => { it("y", () => expect(1).toBe(1)); });` }));
  assert.equal(code.results.find((x) => x.id === 'negative-write-test-code').ok, false);
});

test('test-planner evals reject identifier headings for a diff and an invented area', () => {
  const r = runEvals(DIR, () => ({ text: '### MAX_ITEMS\n1. [ ] x\n### Login\n### Possible impact, not stated\n### Open questions' }));
  assert.equal(r.results.find((x) => x.id === 'cart-limit-diff').ok, false);
  assert.equal(r.results.find((x) => x.id === 'user-named-area-not-in-change').ok, false);
});

test('test-planner version matches CHANGELOG and registry', () => {
  const v = /^version:\s*(\S+)/m.exec(readFileSync(path.join(DIR, 'SKILL.md'), 'utf8'))[1];
  assert.equal(v, '1.0.0');
  assert.match(readFileSync(path.join(DIR, 'CHANGELOG.md'), 'utf8'), new RegExp(`## ${v} - \\d{4}-\\d{2}-\\d{2}`));
  const reg = JSON.parse(readFileSync(path.join(ROOT, 'src', 'factory', 'registry.json'), 'utf8'));
  assert.equal(reg.find((x) => x.name === 'test-planner').version, v);
});
