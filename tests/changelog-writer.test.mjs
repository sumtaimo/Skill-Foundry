/**
 * changelog-writer: lint is clean, evals pass on the worked examples, versions are in step.
 * @governed-by PO_ARCHITECT
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runEvals } from '../src/factory/evals.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'src', 'skills', 'changelog-writer');

const answers = {
  'new-behaviour-minor': '## 1.1.0 - 2026-11-14\n\n- Add a step.\n- Fix a link.\n\nBump: MINOR, new behaviour and no breaking change.',
  'breaking-major': '## 2.0.0 - 2026-11-20\n\n- Breaking: Rename the Output section.\n\nBump: MAJOR.',
  'missing-input-asks': 'Please give the skill name, current version, date and the list of changes.',
  'english-request-english-entry': '## 1.3.0 - 2026-11-14\n\n- Add an example for empty input.\n\nBump: MINOR, an example is new behaviour.',
  'we-are-at-current-version': '## 2.4.0 - 2026-11-14\n\n- Add dark mode.\n- Fix a crash on login.\n\nBump: MINOR (2.3.0 → 2.4.0).',
  'ambiguous-version-asks': 'Is 2.3.0 the current version (the entry would be 2.4.0) or the new version?',
  'no-added-qualifier': '## 1.2.1 - 2026-11-14\n\n- Fix a link in the references.\n\nBump: PATCH, a link fix is a fix.',
};

test('changelog-writer evals pass on reference answers', () => {
  const cases = JSON.parse(readFileSync(path.join(DIR, 'evals', 'cases.json'), 'utf8'));
  const byPrompt = Object.fromEntries(cases.map((c) => [c.prompt, answers[c.id]]));
  const r = runEvals(DIR, (p) => ({ text: byPrompt[p] }));
  assert.equal(r.failed, 0, JSON.stringify(r.results));
});

test('changelog-writer evals reject an invented entry for missing input', () => {
  const r = runEvals(DIR, () => ({ text: '## 1.0.0 - 2026-01-01\n\n- Add things.' }));
  assert.ok(r.results.find((x) => x.id === 'missing-input-asks').ok === false);
});

test('changelog-writer evals reject a non-English entry and an added qualifier', () => {
  const r = runEvals(DIR, () => ({ text: '## 1.3.0 - 2026-11-14\n\n- Add ការបន្ថែម example.\n\n## 1.2.1 - 2026-11-14\n\n- Fix a broken link.' }));
  assert.equal(r.results.find((x) => x.id === 'english-request-english-entry').ok, false);
  assert.equal(r.results.find((x) => x.id === 'no-added-qualifier').ok, false);
});

test('changelog-writer evals reject a current version used as the heading or an invented previous version', () => {
  const r = runEvals(DIR, () => ({ text: '## 2.3.0 - 2026-11-14\n\n- Add dark mode.\n\nBump: MINOR (2.2.0 → 2.3.0).' }));
  assert.equal(r.results.find((x) => x.id === 'we-are-at-current-version').ok, false);
  assert.equal(r.results.find((x) => x.id === 'ambiguous-version-asks').ok, false);
});

test('changelog-writer version matches CHANGELOG and registry', () => {
  const v = /^version:\s*(\S+)/m.exec(readFileSync(path.join(DIR, 'SKILL.md'), 'utf8'))[1];
  assert.match(readFileSync(path.join(DIR, 'CHANGELOG.md'), 'utf8'), new RegExp(`## ${v} - \\d{4}-\\d{2}-\\d{2}`));
  const reg = JSON.parse(readFileSync(path.join(ROOT, 'src', 'factory', 'registry.json'), 'utf8'));
  assert.equal(reg.find((x) => x.name === 'changelog-writer').version, v);
});
