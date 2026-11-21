/**
 * journey-mapper: lint is clean, evals pass on a reference answer and fail on bad ones, the real-agent recordings
 * are read-only and quote only the request, every map step has the seven slots, and the registry entry is what
 * Agentic-Harness reads (BA_ANALYST, keywords for the FEATURE_BA topic, not default, no engine).
 * @governed-by QA_AUDITOR
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runEvals } from '../src/factory/evals.mjs';
import { lintSkill } from '../src/factory/lint-skills.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'src', 'skills', 'journey-mapper');
const SLOTS = ['Loading', 'Empty', 'Error', 'Success', 'Validation', 'Reload and back', 'Permissions'];
const MISS = 'Tell me the feature goal in one or two sentences: who does what, and when it is done.';
const AC = 'journey-mapper maps the workflow; Given-When-Then acceptance criteria come from spec-writer.';
const DIFF = 'journey-mapper maps a new workflow from a goal; a regression checklist for a change or diff comes from test-planner.';
const FILE = 'journey-mapper writes no files; copy the map from this reply.';
const live = readdirSync(path.join(DIR, 'evals', 'live')).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(readFileSync(path.join(DIR, 'evals', 'live', f), 'utf8')));

const step = (n, src) => `${n}. The user acts. Source: "${src}"\n${SLOTS.map((s) => `   - ${s}: Q2`).join('\n')}`;
const map = (goal, srcs, extraQ = '') => `## Journey map: x\n\nGoal: "${goal}"\nActors: Not stated (Q1)\nEntry: Not stated (Q1)\nDone when: Not stated (Q1)\n\n### Steps\n${srcs.map((s, i) => step(i + 1, s)).join('\n')}\n\n### Cross-step checks\n- Reload or close mid-journey: Q2\n- Cancel and come back later: Q2\n- Permission change between steps: Q2\n- Related modules: None named.\n\n### Open business questions\n${extraQ}- Q1 [blocking] Entry (step 1): Who starts the journey, and where?\n- Q2 [minor] States (whole journey): What does the user see in each state?\n\n### Not in this map\n- Acceptance criteria: spec-writer can turn this map into Given-When-Then.\n- What to retest after a change: test-planner.\n- Screen design, copy and estimates.\n\nSources: the goal. Steps: ${srcs.length}. Blocking questions: 1.`;

function answersFor(cases) {
  const by = Object.fromEntries(cases.map((c) => [c.id, c.prompt]));
  return {
    'signup-short': map('new users sign up ...', ['at least 12 characters', 'confirm their email with a link', 'land on the dashboard']),
    'checkout-thin': map('a shopper pays ...', ['pays for the items in the cart', 'gets an order number']),
    'no-goal': MISS,
    'ac-boundary': `${AC}\n\n${map('team admins invite ...', ['team admins invite a member by email', 'the invite expires after 7 days'])}`,
    'retest-boundary': DIFF,
    'onboarding-roles-reload': map('the owner ...', ['Up to 5 teammates', 'at most 3 members', 'skip the plan step', 'continue where they left off'], '- Q0 [blocking] Conflict: "Up to 5 teammates" or "at most 3 members"? (steps 1-2)\n'),
    'save-file-read-only': `${FILE}\n\n${map('a user who forgot ...', ['the link works only once', 'the user sets a new password'])}`,
    _prompts: by,
  };
}

test('journey-mapper lint is clean (chk-layers, chk-portable, chk-frontmatter, chk-links)', async () => {
  assert.deepEqual(await lintSkill(DIR, { testsDir: path.join(ROOT, 'tests') }), []);
});

test('journey-mapper evals pass on reference answers and reject invented options, a missing slot and a map instead of a fixed sentence', () => {
  const cases = JSON.parse(readFileSync(path.join(DIR, 'evals', 'cases.json'), 'utf8'));
  const a = answersFor(cases);
  const byPrompt = Object.fromEntries(cases.map((c) => [c.prompt, a[c.id]]));
  const good = runEvals(DIR, (p) => ({ text: byPrompt[p] ?? '' }));
  assert.equal(good.failed, 0, JSON.stringify(good.results.filter((r) => !r.ok)));
  const bad = { ...a, 'checkout-thin': a['checkout-thin'].replace('What does the user see in each state?', 'Do you take PayPal, for example?'), 'signup-short': a['signup-short'].replace(/ {3}- Reload and back: Q2\n/g, ''), 'retest-boundary': `${DIFF}\n\n${a['signup-short']}`, 'onboarding-roles-reload': a['onboarding-roles-reload'].replace(/- Q0 .*\n/, '') };
  const byBad = Object.fromEntries(cases.map((c) => [c.prompt, bad[c.id]]));
  const r = runEvals(DIR, (p) => ({ text: byBad[p] ?? '' }));
  for (const id of ['checkout-thin', 'signup-short', 'retest-boundary', 'onboarding-roles-reload']) assert.equal(r.results.find((x) => x.id === id).ok, false, id);
});

test('journey-mapper live recordings: read-only agents, nothing written, every quote is in the request', () => {
  assert.ok(live.length >= 6);
  for (const rec of live) {
    assert.deepEqual(rec.files, [], `${rec.case}: wrote files`);
    for (const t of rec.tools ?? []) assert.ok(['Read', 'Glob', 'Grep'].includes(t), `${rec.case}: used ${t}`);
    for (const m of rec.output.matchAll(/Source: "([^"]+)"/g)) assert.ok(rec.prompt.includes(m[1]), `${rec.case}: source not in request: ${m[1]}`);
  }
});

test('journey-mapper live recordings: every step has the seven slots in order, every slot id exists, questions never suggest', () => {
  for (const rec of live.filter((r) => r.output.includes('## Journey map'))) {
    const steps = rec.output.split('### Steps')[1].split('### Cross-step checks')[0].split(/\n(?=\d+\. )/).filter((s) => /^\s*\d+\. /.test(s));
    assert.ok(steps.length >= 2, rec.case);
    for (const s of steps) {
      const names = [...s.matchAll(/^\s+- ([A-Za-z ]+):/gm)].map((m) => m[1]);
      assert.deepEqual(names, SLOTS, `${rec.case}: slots of "${s.split('\n')[0]}"`);
    }
    const qs = rec.output.split('### Open business questions')[1].split('### Not in this map')[0];
    const ids = new Set([...qs.matchAll(/^- (Q\d+) \[(?:blocking|minor)\]/gm)].map((m) => m[1]));
    for (const m of rec.output.matchAll(/\bQ\d+\b/g)) assert.ok(ids.has(m[0]), `${rec.case}: ${m[0]} used but not asked`);
    assert.doesNotMatch(qs, /for example|e\.g\.|such as/i, rec.case);
    const tags = [...qs.matchAll(/\[(blocking|minor)\]/g)].map((m) => m[1]);
    assert.ok(tags.indexOf('minor') === -1 || tags.lastIndexOf('blocking') < tags.indexOf('minor'), `${rec.case}: blocking first`);
  }
});

test('journey-mapper registry entry: BA_ANALYST only, FEATURE_BA keywords, not default, no engine, versions in step', () => {
  const v = /^version:\s*(\S+)/m.exec(readFileSync(path.join(DIR, 'SKILL.md'), 'utf8'))[1];
  assert.match(readFileSync(path.join(DIR, 'CHANGELOG.md'), 'utf8'), new RegExp(`## ${v} - \\d{4}-\\d{2}-\\d{2}`));
  const e = JSON.parse(readFileSync(path.join(ROOT, 'src', 'factory', 'registry.json'), 'utf8')).find((x) => x.name === 'journey-mapper');
  assert.equal(e.version, v);
  assert.deepEqual(e.roles, ['BA_ANALYST']);
  assert.equal(e.default, undefined);
  assert.equal(e.engine, undefined);
  const topic = 'feature user workflow journey spec acceptance criteria: add a team invite';
  for (const k of ['journey', 'workflow', 'feature']) assert.ok(e.keywords.includes(k) && topic.includes(k), k);
  for (const k of e.keywords) assert.ok(k.length >= 4, `${k} is at least 4 characters`);
});
