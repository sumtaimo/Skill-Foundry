/**
 * ui-polish: lint is clean, evals pass on reference answers and fail on bad ones, versions are in step.
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
const DIR = path.join(ROOT, 'src', 'skills', 'ui-polish');
const ASK = 'Paste the HTML and CSS of the finished screen you want polished.';
const NEW = 'This skill polishes a finished UI; it does not design new screens.';
const TEXT = 'This skill does not rewrite text; every word is kept as written.';
const shape = (body) => `## UI polish: x\n\n1 fix.\n\n### Fixes\n${body}\n\n### Contrast\n| a | b | c |\n\n### Polished code\n\`\`\`\n${body}\n\`\`\`\n\n### Not changed\n- All visible text, word for word.\n- Brand hue kept: blue.\n\n### Open questions\n- None.`;

const answers = {
  'settings-card': shape('1. **Spacing**: 13px. 2. **Contrast**: 2.32:1. 3. **Hierarchy**: (R-ui-polish-5) 4. **States**: focus-visible\nNotification settings Choose how we contact you about your account. Save changes Cancel'),
  'tailwind-jsx': shape('1. **Hierarchy**: one primary.\n<div className="p-3"><span>Unsaved draft</span><button onClick={onSave} className="focus-visible:outline">Save draft</button><button onClick={onDiscard}>Discard</button></div>'),
  'brand-hue-kept': shape('1. **Contrast**: 2.36:1. min-height: 44px; prefers-reduced-motion; focus-visible\nStart your free trial Get started'),
  'text-rewrite-declined': `${TEXT}\n\n${shape('1. **Contrast**: 2.73:1.\nClick here to download your monthly report in PDF format Download')}`,
  'already-polished': '## UI polish: Invite your team\n\nNo fixes needed.\n\n### Fixes\nNone.\n\n### Polished code\nUnchanged.\n\n### Not changed\n- All visible text.\n\n### Open questions\n- None.',
  'no-code': ASK,
  'description-only': ASK,
  'new-design-declined': NEW,
};

test('ui-polish lint is clean', async () => {
  const problems = await lintSkill(DIR, { testsDir: path.join(ROOT, 'tests') });
  assert.deepEqual(problems, []);
});

test('ui-polish evals pass on reference answers', () => {
  const cases = JSON.parse(readFileSync(path.join(DIR, 'evals', 'cases.json'), 'utf8'));
  assert.equal(cases.length, Object.keys(answers).length);
  const byPrompt = Object.fromEntries(cases.map((c) => [c.prompt, answers[c.id]]));
  const r = runEvals(DIR, (p) => ({ text: byPrompt[p] }));
  assert.equal(r.failed, 0, JSON.stringify(r.results.filter((x) => !x.ok)));
});

test('ui-polish evals reject fixes without code, code for a new design, and changed text', () => {
  const r = runEvals(DIR, () => ({ text: shape('<div>Polished pricing page</div>') }));
  for (const id of ['no-code', 'description-only', 'new-design-declined', 'settings-card', 'text-rewrite-declined']) assert.equal(r.results.find((x) => x.id === id).ok, false, id);
  const reworded = runEvals(DIR, () => ({ text: `${TEXT}\n${shape('2.73:1 Download your monthly PDF report Download')}` }));
  assert.equal(reworded.results.find((x) => x.id === 'text-rewrite-declined').ok, false);
});

test('ui-polish rejects inline style objects in utility-class code', () => {
  const r = runEvals(DIR, () => ({ text: shape('**Hierarchy** className= p-3 focus-visible: onClick={onSave} onClick={onDiscard} Unsaved draft Save draft Discard style={{ padding: 12 }}') }));
  assert.equal(r.results.find((x) => x.id === 'tailwind-jsx').ok, false);
});

test('ui-polish version matches CHANGELOG and registry', () => {
  const v = /^version:\s*(\S+)/m.exec(readFileSync(path.join(DIR, 'SKILL.md'), 'utf8'))[1];
  assert.equal(v, '1.0.0');
  assert.match(readFileSync(path.join(DIR, 'CHANGELOG.md'), 'utf8'), new RegExp(`## ${v} - \\d{4}-\\d{2}-\\d{2}`));
  const reg = JSON.parse(readFileSync(path.join(ROOT, 'src', 'factory', 'registry.json'), 'utf8'));
  assert.equal(reg.find((x) => x.name === 'ui-polish').version, v);
});
