/**
 * spec-writer: lint is clean, evals pass on reference answers and fail on bad ones, versions are in step,
 * and every source phrase in the real-agent recordings is in the request the agent was given.
 * @governed-by PO_ARCHITECT
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runEvals } from '../src/factory/evals.mjs';
import { lintSkill } from '../src/factory/lint-skills.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'src', 'skills', 'spec-writer');
const CODE = 'This skill does not write test code.';
const DIFF = 'This skill does not write regression checklists for a change or diff; use test-planner for that.';
const EST = 'This skill does not design screens, rewrite copy, estimate or prioritise.';
const END = '\n\n### Open questions\n- Empty, loading and disabled states: What is shown while waiting?\n\n### Out of scope\nNone stated.';

// Hand-written reference answers: they only prove the eval cases can pass and can fail. Proof of the skill is in evals/live/.
const answers = {
  'password-reset-story': '## Acceptance criteria: password reset\n\nRequirement: reset by email.\n\n### Main path\nAC-1. Given a registered user, when the user resets the password by email, then the user is back in the account. _I want to reset my password by email_\n\n### Validation and errors\nAC-2. Given a new password of 11 characters, when the user submits it, then it is refused. _The new password must have at least 12 characters._\nAC-3. Given an email that is not registered, when it is submitted, then the page shows "If this email is registered, we sent a link." _If the email is not registered_\n\n### Limits\nAC-4. Given a link older than 30 minutes, when it is opened, then it is refused. _The reset link expires after 30 minutes._\n\n### Open questions\n- Persistence after reload: What is shown after a reload?\n\n### Out of scope\n- Single sign-on accounts. _Single sign-on accounts are out of scope._',
  'vague-words': '## Acceptance criteria: search page\n\nRequirement: search.\n\n### Main path\nAC-1. Given results, when the user views them, then each shows the product name. _Results show the product name_\n\n### Open questions\n- Limits: What measurable value defines "fast" for the search page?\n- Main path: What measurable value defines "easy to use" for the search page?\n\n### Out of scope\nNone stated.',
  'roles-states-reload': '## Acceptance criteria: delete a project\n\nRequirement: delete.\n\n### Permissions and roles\nAC-1. Given an admin, when the admin deletes a project, then it is deleted. _Only admins can delete a project._\nAC-2. Given a member, when the member views the Delete button, then it is disabled. _Members see the Delete button disabled_\nAC-3. Given a member, when the member views the Delete button, then the tooltip "Only admins can delete projects." is shown. _with the tooltip "Only admins can delete projects."_\n\n### Persistence after reload\nAC-4. Given a deleted project, when the page is reloaded, then the list does not show it. _After a page reload the project list still does not show the deleted project._\n\n### Limits\nAC-5. Given a project deleted fewer than 30 days ago, when Trash is viewed, then it is there. _A deleted project stays in Trash for 30 days._' + END,
  'thin-text-nothing-invented': '## Acceptance criteria: profile photo\n\nRequirement: upload.\n\n### Main path\nAC-1. Given a user, when the user uploads a profile photo, then it is uploaded. _Users can upload a profile photo._\n\n### Open questions\n- Validation and errors: Which file formats are accepted?\n- Limits: What is the largest file a user can upload?\n\n### Out of scope\nNone stated.',
  'conflicting-limit': '## Acceptance criteria: promo codes\n\nRequirement: promo codes.\n\n### Main path\nAC-1. Given an order, when a code is applied, then it is listed under the order total. _An applied code is listed under the order total._\n\n### Open questions\n- Conflict: Which is right, "up to 5 promo codes per order" or "at most 3 promo codes"?\n\n### Out of scope\n- Gift cards. _Gift cards are not part of this work._',
  'no-requirement-text': 'Paste the feature request, user story or requirement you want acceptance criteria for.',
  'title-only': 'Describe the requirement for the new export feature: who uses it, what they do and what must happen.',
  'negative-test-code': `${CODE}\n\n## Acceptance criteria: wishlist\n\n### Main path\nAC-1. Given a shopper on the product page, when the shopper saves an item, then it is in the wishlist. _save an item to my wishlist_\nAC-2. Given a saved item, when it is shown, then it shows a filled heart icon. _A saved item shows a filled heart icon._${END}`,
  'negative-regression-diff': DIFF,
  'many-blocking-questions': '## Acceptance criteria: expense reports\n\nRequirement: expense approval.\n\n### Permissions and roles\nAC-1. Given an expense report above the approval limit, when it is submitted, then it goes to the finance team. _A report above the approval limit goes to the finance team._\n\n### Limits\nAC-2. Given an expense above the receipt threshold, when the report is submitted, then a receipt is required. _Receipts are required for expenses above the receipt threshold._\n\n### Open questions\n- [blocking] Permissions and roles: What amount is the approval limit? Blocks: AC-1\n- [blocking] Limits: What amount is the receipt threshold? Blocks: AC-2\n- [blocking] Limits: How much time passes before a report is escalated? Blocks: "A report that is not approved in time is escalated to the next manager"\n- [blocking] Limits: When is the next payment run? Blocks: "Approved reports are paid in the next payment run"\n\n### Out of scope\nNone stated.',
  'minor-questions-merged': '## Acceptance criteria: newsletter\n\nRequirement: subscribe.\n\n### Main path\nAC-1. Given a visitor, when the visitor subscribes from the footer, then the footer shows "Thanks for subscribing." _After subscribing, the footer shows "Thanks for subscribing."_\nAC-2. Given a newsletter, when it is opened, then it has an unsubscribe link. _Every newsletter has an unsubscribe link._\n\n### Open questions\n- [minor] Validation and errors: What happens with an invalid email? Validation and errors: What happens with an email already subscribed?\n\n### Out of scope\nNone stated.',
  'negative-estimate-priority': `${EST}\n\n## Acceptance criteria: export\n\n### Main path\nAC-1. Given a user on the invoice list, when the user exports it, then the user receives a CSV. _Users can export the invoice list as CSV._\nAC-2. Given visible columns, when the user exports, then the export contains them. _The export contains the columns the user currently sees._${END}`,
};

test('spec-writer lint is clean (chk-layers, chk-portable, chk-frontmatter, chk-links)', async () => {
  const problems = await lintSkill(DIR, { testsDir: path.join(ROOT, 'tests') });
  assert.deepEqual(problems, []);
});

test('spec-writer evals pass on reference answers', () => {
  const cases = JSON.parse(readFileSync(path.join(DIR, 'evals', 'cases.json'), 'utf8'));
  assert.equal(cases.length, Object.keys(answers).length);
  const byPrompt = Object.fromEntries(cases.map((c) => [c.prompt, answers[c.id]]));
  const r = runEvals(DIR, (p) => ({ text: byPrompt[p] }));
  assert.equal(r.failed, 0, JSON.stringify(r.results.filter((x) => !x.ok)));
});

test('spec-writer evals reject criteria where a fixed sentence is required, and refused work', () => {
  const bad = runEvals(DIR, () => ({ text: '### Main path\nAC-1. Given x, when y, then z. _x_' }));
  for (const id of ['no-requirement-text', 'title-only', 'negative-test-code', 'negative-regression-diff', 'negative-estimate-priority']) assert.equal(bad.results.find((x) => x.id === id).ok, false, id);
  const code = runEvals(DIR, () => ({ text: `${answers['negative-test-code']}\n\`\`\`\ndescribe("x", () => { it("y", () => cy.get("a")); });\n\`\`\`` }));
  assert.equal(code.results.find((x) => x.id === 'negative-test-code').ok, false);
  const checklist = runEvals(DIR, () => ({ text: `${DIFF}\n### cart\n1. [ ] Check the limit is 20.` }));
  assert.equal(checklist.results.find((x) => x.id === 'negative-regression-diff').ok, false);
  const points = runEvals(DIR, () => ({ text: `${answers['negative-estimate-priority']}\nEstimate: 3 story points.` }));
  assert.equal(points.results.find((x) => x.id === 'negative-estimate-priority').ok, false);
});

test('spec-writer evals reject a made-up number for a vague word, an invented limit and a clause on a conflict', () => {
  const vague = runEvals(DIR, () => ({ text: answers['vague-words'].replace('### Open questions', 'AC-2. Given a search, when it runs, then results show within 2 seconds. _fast_\n\n### Open questions') }));
  assert.equal(vague.results.find((x) => x.id === 'vague-words').ok, false);
  const invented = runEvals(DIR, () => ({ text: answers['thin-text-nothing-invented'].replace('### Open questions', '### Limits\nAC-2. Given a file over 5 MB, when it is uploaded, then it is refused. _upload_\n\n### Open questions') }));
  assert.equal(invented.results.find((x) => x.id === 'thin-text-nothing-invented').ok, false);
  const conflict = runEvals(DIR, () => ({ text: answers['conflicting-limit'].replace('### Open questions', '### Limits\nAC-2. Given 5 codes, when a sixth is applied, then it is refused. _up to 5 promo codes per order_\n\n### Open questions') }));
  assert.equal(conflict.results.find((x) => x.id === 'conflicting-limit').ok, false);
});

test('spec-writer live recordings: every clause is Given-When-Then with an id in one run, and its source phrase is in the request', () => {
  const cases = JSON.parse(readFileSync(path.join(DIR, 'evals', 'cases.json'), 'utf8'));
  const norm = (s) => s.toLowerCase().replace(/\s+/g, ' ').replace(/[.,;:]+$/, '').trim();
  let clauses = 0;
  for (const c of cases) {
    const p = path.join(DIR, 'evals', 'live', `${c.id}.json`);
    assert.ok(existsSync(p), `${c.id}: no live recording`);
    const rec = JSON.parse(readFileSync(p, 'utf8'));
    const lines = rec.output.split('\n').map((l) => l.trim()).filter((l) => /^AC-\d+/.test(l));
    lines.forEach((l, i) => {
      assert.match(l, new RegExp(`^AC-${i + 1}\\. Given .+, when .+, then .+ _[^_]+_$`), `${c.id}: "${l}" is not AC-${i + 1} in Given-When-Then form with a source phrase`);
      const phrase = /_([^_]+)_$/.exec(l)[1];
      assert.ok(norm(rec.prompt).includes(norm(phrase)), `${c.id}: source phrase "${phrase}" is not in the request`);
      clauses++;
    });
    const scope = rec.output.split('### Out of scope')[1];
    for (const l of (scope ?? '').split('\n').filter((x) => x.trim().startsWith('- '))) {
      const m = /_([^_]+)_\s*$/.exec(l);
      assert.ok(m && norm(rec.prompt).includes(norm(m[1])), `${c.id}: out-of-scope line "${l}" has no source phrase from the request`);
    }
  }
  assert.ok(clauses >= 15, `clauses checked: ${clauses}`);
});

test('spec-writer live recordings: open questions are tagged, blocking first, each blocking one names what it blocks, minor lines are few', () => {
  const cases = JSON.parse(readFileSync(path.join(DIR, 'evals', 'cases.json'), 'utf8'));
  const norm = (s) => s.toLowerCase().replace(/\s+/g, ' ').trim();
  let blocking = 0; let minor = 0;
  for (const c of cases) {
    const rec = JSON.parse(readFileSync(path.join(DIR, 'evals', 'live', `${c.id}.json`), 'utf8'));
    const part = rec.output.split('### Open questions')[1]?.split('### Out of scope')[0];
    if (part === undefined) continue;
    const ids = new Set([...rec.output.matchAll(/^(AC-\d+)\./gm)].map((m) => m[1]));
    const lines = part.split('\n').map((l) => l.trim()).filter((l) => l.startsWith('- '));
    let seenMinor = false; let minorLines = 0;
    for (const l of lines) {
      if (l.startsWith('- [minor] ')) {
        seenMinor = true; minorLines++; minor++;
        assert.ok((l.match(/\?/g) ?? []).length <= 2, `${c.id}: minor line has more than two questions: ${l}`);
      } else {
        assert.ok(l.startsWith('- [blocking] '), `${c.id}: untagged question: ${l}`);
        assert.ok(!seenMinor, `${c.id}: blocking question after a minor one: ${l}`);
        const m = /Blocks: (.+)$/.exec(l);
        assert.ok(m, `${c.id}: no Blocks: in ${l}`);
        const refs = m[1].match(/AC-\d+/g) ?? [];
        const quotes = [...m[1].matchAll(/"([^"]+)"/g)].map((q) => q[1]);
        assert.ok(refs.length + quotes.length > 0, `${c.id}: blocks nothing: ${l}`);
        for (const r of refs) assert.ok(ids.has(r), `${c.id}: ${r} is not a clause`);
        for (const q of quotes) assert.ok(norm(rec.prompt).includes(norm(q)), `${c.id}: blocked phrase "${q}" is not in the request`);
        blocking++;
      }
    }
    assert.ok(minorLines <= 3, `${c.id}: more than three minor lines`);
  }
  assert.ok(blocking >= 6 && minor >= 1);
  const many = JSON.parse(readFileSync(path.join(DIR, 'evals', 'live', 'many-blocking-questions.json'), 'utf8')).output;
  assert.ok((many.match(/^- \[blocking\]/gm) ?? []).length >= 4, 'many-blocking-questions keeps many blocking questions');
});

test('spec-writer version matches CHANGELOG and registry, with the BA and PO roles', () => {
  const v = /^version:\s*(\S+)/m.exec(readFileSync(path.join(DIR, 'SKILL.md'), 'utf8'))[1];
  assert.equal(v, '1.0.0');
  assert.match(readFileSync(path.join(DIR, 'CHANGELOG.md'), 'utf8'), new RegExp(`## ${v} - \\d{4}-\\d{2}-\\d{2}`));
  const reg = JSON.parse(readFileSync(path.join(ROOT, 'src', 'factory', 'registry.json'), 'utf8'));
  const entry = reg.find((x) => x.name === 'spec-writer');
  assert.equal(entry.version, v);
  assert.deepEqual(entry.roles, ['BA_ANALYST', 'PO_ARCHITECT']);
});
