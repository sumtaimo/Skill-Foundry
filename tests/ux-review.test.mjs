/**
 * ux-review: lint is clean, the eval cases accept good answers and reject answers that break the boundary,
 * the fixed sentences are the ones in the skill, and versions are in step.
 * @governed-by PO_ARCHITECT
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runEvals } from '../src/factory/evals.mjs';
import { lintSkill } from '../src/factory/lint-skills.mjs';
import { scoreLive } from '../src/factory/live-evals.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'src', 'skills', 'ux-review');
const read = (p) => readFileSync(path.join(DIR, p), 'utf8');
const NOTHING = "Paste the screen's code or describe the flow step by step.";
const FIX = 'This skill reviews usability; it does not change code.';
const DESIGN = 'This skill reviews an existing screen or flow; it does not design new screens.';

test('ux-review lint is clean', async () => {
  assert.deepEqual(await lintSkill(DIR, { testsDir: path.join(ROOT, 'tests') }), []);
});

test('ux-review fixed sentences appear word for word in the skill layers', () => {
  assert.ok(read('layers/03-inputs.md').includes(NOTHING));
  assert.ok(read('layers/06-states.md').includes(FIX));
  assert.ok(read('layers/06-states.md').includes(DESIGN));
  assert.ok(read('SKILL.md').includes(FIX) && read('SKILL.md').includes(NOTHING.replace("'", "'")));
});

test('ux-review has a severity scale of four levels and thirteen usability rules', () => {
  for (const s of ['S1 Blocker', 'S2 Major', 'S3 Minor', 'S4 Note']) assert.ok(read('layers/08-output.md').includes(s));
  const rules = JSON.parse(read('RULES.json'));
  for (let i = 1; i <= 13; i++) assert.ok(rules.some((r) => r.id === `R-ux-review-${i}`), `rule ${i}`);
  for (let i = 26; i <= 32; i++) assert.ok(rules.some((r) => r.id === `R-ux-review-${i}`), `shape or cap rule ${i}`);
});

test('ux-review live recordings from real agents pass every case', () => {
  const s = scoreLive(DIR);
  assert.equal(s.failed, 0, JSON.stringify(s.results.filter((x) => !x.ok)));
  assert.deepEqual([s.missing, s.stale], [[], []]);
});

test('ux-review evals reject answers that break the boundary', () => {
  const cases = JSON.parse(read('evals/cases.json'));
  const bad = (id, text) => runEvals(DIR, () => ({ text })).results.find((x) => x.id === id).ok;
  assert.equal(bad('nothing-to-review', '## UX review: x\n1. **a** | S1 Blocker | R-ux-review-5'), false, 'a review with nothing to review');
  assert.equal(bad('design-request', `${DESIGN}\n### Findings`), false, 'a design with the sentence');
  assert.equal(bad('fix-request', `${FIX}\n\`\`\`html\n<button>x</button>\n\`\`\``), false, 'code in a fix request');
  assert.equal(bad('contrast-and-aria-out-of-scope', 'aria-label ratio 4.5'), false, 'contrast and ARIA reported');
  assert.equal(bad('rewrite-text-request', 'Suggested wording: Rewritten'), false, 'rewritten text');
  assert.ok(cases.length >= 14);
  for (const id of ['shape-rules-measurement-sheet', 'missing-script-capped-at-s3', 'template-repeated-reported-once']) assert.ok(cases.some((c) => c.id === id), id);
  assert.equal(bad('missing-script-capped-at-s3', '## UX review: x\nLayout input: none site.js\n1. **a** | S2 Major | R-ux-review-10'), false, 'S2 on a missing script');
});

test('ux-review version matches CHANGELOG and registry', () => {
  const v = /^version:\s*(\S+)/m.exec(read('SKILL.md'))[1];
  assert.equal(v, '1.0.0');
  assert.match(read('CHANGELOG.md'), new RegExp(`## ${v} - \\d{4}-\\d{2}-\\d{2}`));
  const reg = JSON.parse(readFileSync(path.join(ROOT, 'src', 'factory', 'registry.json'), 'utf8'));
  const e = reg.find((x) => x.name === 'ux-review');
  assert.equal(e.version, v);
  assert.deepEqual(e.roles, ['BA_ANALYST', 'QA_AUDITOR', 'UX_DESIGNER']);
});
