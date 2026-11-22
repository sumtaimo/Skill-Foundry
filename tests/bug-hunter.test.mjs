/**
 * bug-hunter: lint is clean, evals pass on reference answers and fail on bad ones, the real-agent recordings changed
 * no source file and ran only the test command or read-only commands, every cited file:line holds the code it names,
 * and the registry entry is what Agentic-Harness reads (QA_AUDITOR, keywords that rank first on the HUNTER topic).
 * @governed-by QA_AUDITOR
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runEvals } from '../src/factory/evals.mjs';
import { lintSkill } from '../src/factory/lint-skills.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'src', 'skills', 'bug-hunter');
const cases = JSON.parse(readFileSync(path.join(DIR, 'evals', 'cases.json'), 'utf8'));
const live = readdirSync(path.join(DIR, 'evals', 'live')).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(readFileSync(path.join(DIR, 'evals', 'live', f), 'utf8')));
const NOTEST = 'No test command ran, so nothing below is confirmed: every finding is a suspect from reading the code.';
const RETEST = 'bug-hunter finds bugs in code; a regression checklist of what to retest after a change comes from test-planner.';
const STYLE = 'bug-hunter reports bugs only; code style is not a bug, and UI style and accessibility come from ui-polish and a11y-audit.';
const RO = 'bug-hunter is read-only and changes no file; the Red-Green plan below says which test to add and what to fix.';
const NONE = 'No bug found in this scope; this does not prove there are none.';
const NOCODE = 'No code found to hunt in. Tell me which files or which behaviour to check.';
/** The line each fixture bug lives on, and a piece of the code on it. */
const BUG_LINES = { 'src/cart.js:4': 'let i = 1', 'src/orders.js:9': 'orders.length', 'src/orders.js:14': 'order.status', 'src/slug.js:3': "replace(' ', '-')", 'src/week.js:4': 'day === 7', 'src/price.js:3': 'Math.floor' };

const finding = (file, status, extra = '') => `1. \`${file}\` wrong result.\n   - ${status === 'confirmed' ? 'Evidence: `x !== y`' : 'Reading: input gives wrong'}${extra}\n   - Expected: y (source: test)\n   - Red: the failing test.\n   - Green: fix it.`;
const report = ({ first = '', run = '2 passed, 1 failed', result = '1 confirmed, 0 suspect', conf = 'None.', sus = 'None.', none = false, cmd = '`npm test`' } = {}) =>
  `${first ? `${first}\n\n` : ''}## Bug hunt: x\n\nScope: \`src/x.js\`\nTest command: ${cmd}\nTest run: ${run}\nResult: ${result}\n${none ? `\n${NONE}\n` : ''}\n### Confirmed\n${conf}\n\n### Suspect\n${sus}\n\n### Not in this hunt\n- Code style.\n- test-planner.\n- Files outside the scope.\n\nEvidence: ${cmd}. Files read: \`src/x.js\`.`;
const good = {
  'cart-symptom': report({ conf: finding('src/cart.js:4', 'confirmed', ' "cartTotal adds every item" 25') }),
  'harness-hunter': report({ run: '3 passed, 1 failed', result: '1 confirmed, 1 suspect', conf: finding('src/orders.js:9', 'confirmed', ' "averageValue of no orders is 0" NaN'), sus: finding('src/orders.js:14', 'suspect') }),
  'uncovered-suspect': report({ run: '4 passed, 0 failed', result: '0 confirmed, 1 suspect', sus: finding('src/slug.js:3', 'suspect', " replace(' ', '-')") }),
  'no-test-command': report({ first: NOTEST, cmd: 'none found', run: 'did not run: no script', result: '0 confirmed, 1 suspect', sus: finding('src/week.js:4', 'suspect', ' Sunday') }),
  'clean-no-bug': report({ run: '3 passed, 0 failed', result: '0 confirmed, 0 suspect', none: true }),
  'style-boundary': report({ first: STYLE, conf: finding('src/price.js:3', 'confirmed', ' "toCents rounds to the nearest cent" Math.round') }),
  'retest-boundary': RETEST,
  'fix-read-only': report({ first: RO, conf: finding('src/cart.js:4', 'confirmed', ' let i = 0') }),
  'no-code': NOCODE,
  'json-format': JSON.stringify({ findings: [{ title: 'x', status: 'confirmed', file: 'src/orders.js', evidence: 'averageValue of no orders is 0', red: 'r', green: 'g' }, { status: 'suspect' }], summary: 's' }),
  'assigned-test-file': report({ first: 'Red tests added to `test/slug.test.js`', run: '4 passed, 1 failed', conf: finding('src/slug.js:3', 'confirmed') }),
};

test('bug-hunter lint is clean (chk-layers, chk-portable, chk-frontmatter, chk-links)', async () => {
  assert.deepEqual(await lintSkill(DIR, { testsDir: path.join(ROOT, 'tests') }), []);
});

test('bug-hunter evals pass on reference answers and reject a guessed confirm, a style finding and a report instead of a fixed sentence', () => {
  const by = Object.fromEntries(cases.map((c) => [c.prompt, c.id]));
  const files = { 'assigned-test-file': ['test/slug.test.js'] };
  const ok = runEvals(DIR, (p) => ({ text: good[by[p]] ?? '', files: files[by[p]] ?? [] }));
  assert.equal(ok.failed, 0, JSON.stringify(ok.results.filter((r) => !r.ok)));
  const bad = {
    ...good,
    'no-test-command': good['no-test-command'].replace(`${NOTEST}\n\n`, '').replace('0 confirmed, 1 suspect', '1 confirmed, 0 suspect'),
    'style-boundary': `${good['style-boundary']}\n2. Fix the indent and rename fmt.`,
    'retest-boundary': `${RETEST}\n\n${good['cart-symptom']}`,
    'clean-no-bug': good['clean-no-bug'].replace(NONE, 'The code is bug-free.'),
    'json-format': `## Bug hunt\n\n${good['json-format']}`,
  };
  const r = runEvals(DIR, (p) => ({ text: bad[by[p]] ?? '', files: files[by[p]] ?? [] }));
  for (const id of ['no-test-command', 'style-boundary', 'retest-boundary', 'clean-no-bug', 'json-format']) assert.equal(r.results.find((x) => x.id === id).ok, false, id);
});

test('bug-hunter live recordings: no source file changed, only the test command or read-only commands ran', () => {
  assert.equal(live.length, cases.length);
  for (const rec of live) {
    const c = cases.find((x) => x.id === rec.case);
    assert.deepEqual(rec.files, c.tools === 'write' ? ['test/slug.test.js'] : [], `${rec.case}: changed files`);
    for (const t of rec.tools) assert.ok(['Read', 'Glob', 'Grep', 'Bash', ...(c.tools === 'write' ? ['Write', 'Edit'] : [])].includes(t), `${rec.case}: used ${t}`);
    for (const { command } of rec.commands) {
      assert.doesNotMatch(command, /(^|[\s;&|])(rm|mv|cp|sed -i|tee|npm (i|install|run)|node -e|node -p|npx)\b|>(?!&|\/dev\/null)/, `${rec.case}: ${command}`);
      assert.match(command, /^(npm test|node --test|find |ls |cat |head )/, `${rec.case}: ${command}`);
    }
  }
  const written = path.join(DIR, 'evals', 'live', 'files', 'assigned-test-file', 'test', 'slug.test.js');
  assert.ok(existsSync(written), 'the assigned test file is kept as evidence');
  const before = readFileSync(path.join(DIR, 'evals', 'fixtures', 'slug', 'test', 'slug.test.js'), 'utf8');
  const after = readFileSync(written, 'utf8').split('\n');
  let i = 0;
  for (const line of after) if (line === before.split('\n')[i]) i++;
  assert.equal(i, before.split('\n').length, 'every existing line is kept, in order');
  const count = (t) => (t.match(/^test\(/gm) || []).length;
  assert.ok(count(after.join('\n')) > count(before), 'Red tests were added');
});

test('bug-hunter live recordings: every cited fixture line holds the code, confirmed needs a test run, no style finding', () => {
  for (const rec of live) {
    const c = cases.find((x) => x.id === rec.case);
    if (!c.fixture) continue;
    for (const m of rec.output.matchAll(/`(src\/[a-z]+\.js):(\d+)(?:[-–]\d+)?`/g)) {
      const lines = readFileSync(path.join(DIR, 'evals', 'fixtures', c.fixture, m[1]), 'utf8').split('\n');
      assert.ok(lines[Number(m[2]) - 1]?.trim(), `${rec.case}: ${m[1]}:${m[2]} is an empty or missing line`);
      const want = BUG_LINES[`${m[1]}:${m[2]}`];
      if (want) assert.ok(lines[Number(m[2]) - 1].includes(want), `${rec.case}: ${m[1]}:${m[2]} does not hold ${want}`);
    }
    if (!rec.commands.some((x) => /^(npm test|node --test)/.test(x.command))) assert.doesNotMatch(rec.output, /[1-9]\d* confirmed/, `${rec.case}: confirmed without a test run`);
    const body = rec.output.includes('### Confirmed') ? rec.output.split('### Confirmed')[1].split('### Not in this hunt')[0] : rec.output;
    assert.doesNotMatch(body, /\b(indent\w*|semicolons?|naming|rename)\b/i, `${rec.case}: style finding`);
  }
  const json = JSON.parse(live.find((r) => r.case === 'json-format').output);
  assert.ok(json.findings.length >= 1 && json.findings.every((f) => ['confirmed', 'suspect'].includes(f.status)), 'json-format: every finding keeps its status');
});

test('bug-hunter registry entry: QA_AUDITOR only, not default, no engine, keywords rank it first on the HUNTER topic', () => {
  const v = /^version:\s*(\S+)/m.exec(readFileSync(path.join(DIR, 'SKILL.md'), 'utf8'))[1];
  assert.match(readFileSync(path.join(DIR, 'CHANGELOG.md'), 'utf8'), new RegExp(`## ${v} - \\d{4}-\\d{2}-\\d{2}`));
  const e = JSON.parse(readFileSync(path.join(ROOT, 'src', 'factory', 'registry.json'), 'utf8')).find((x) => x.name === 'bug-hunter');
  assert.equal(e.version, v);
  assert.deepEqual(e.roles, ['QA_AUDITOR']);
  assert.equal(e.default, undefined);
  assert.equal(e.engine, undefined);
  // The same whole-word rule as Agentic-Harness keywordMatches (plural s/es allowed).
  const hits = (text, kws) => kws.filter((k) => new RegExp(`(?<![a-z0-9])${k.replace(/\s+/g, '\\s+')}(?:s|es)?(?![a-z0-9])`, 'i').test(text));
  const topic = 'bug hunt regression tests: src/auth/login.js';
  const mine = hits(topic, e.keywords);
  const champion = hits(topic, ['test', 'tests', 'coverage', 'regression', 'bug']);
  const longest = (h) => Math.max(0, ...h.map((k) => k.length));
  assert.ok(mine.length > champion.length || (mine.length === champion.length && longest(mine) > longest(champion)), `bug-hunter ${mine} vs test-champion ${champion}`);
  assert.deepEqual(hits('give me a regression checklist for this diff', e.keywords), [], 'a regression checklist is test-planner work');
  for (const k of e.keywords) assert.ok(k.length >= 4, `${k} is at least 4 characters`);
});
