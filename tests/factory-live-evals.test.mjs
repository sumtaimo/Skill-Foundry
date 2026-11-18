/**
 * Gate: every ready skill must have a real-agent recording for each eval case, and all must pass.
 * A skill whose evals only pass on hand-written answers is not shippable.
 * @governed-by PO_ARCHITECT
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scoreLive, agentPrompt, isQuotaError, selectCases, runLive, parseLiveArgs, winCommandLine } from '../src/factory/live-evals.mjs';
import { loadLocks } from '../src/factory/skill-guard.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const registry = JSON.parse(readFileSync(path.join(ROOT, 'src', 'factory', 'registry.json'), 'utf8'));

const locks = loadLocks(ROOT);
for (const r of registry.filter((x) => x.status === 'ready')) {
  if (locks[r.name]) { test(`live evals: ${r.name} is locked (owner: ${locks[r.name].owner}); skipped here`, { skip: 'locked skill' }, () => {}); continue; }
  test(`live evals: ${r.name} passes on real agent recordings`, () => {
    const s = scoreLive(path.join(ROOT, 'src', 'skills', r.name));
    assert.deepEqual(s.missing, [], `missing live recordings: ${s.missing.join(', ')} (run: node src/factory/live-evals.mjs ${r.name} --run)`);
    assert.equal(s.failed, 0, JSON.stringify(s.results.filter((x) => !x.ok)));
  });
}

function fixture(recPrompt) {
  const dir = mkdtempSync(path.join(tmpdir(), 'live-'));
  mkdirSync(path.join(dir, 'evals', 'live'), { recursive: true });
  writeFileSync(path.join(dir, 'evals', 'cases.json'), JSON.stringify([{ id: 'a', prompt: 'p1', expect: [{ type: 'contains', value: 'ok' }] }]));
  if (recPrompt) writeFileSync(path.join(dir, 'evals', 'live', 'a.json'), JSON.stringify({ prompt: recPrompt, output: 'ok' }));
  return dir;
}

test('scoreLive fails a case with no recording', () => {
  const s = scoreLive(fixture(null));
  assert.deepEqual(s.missing, ['a']);
  assert.equal(s.failed, 1);
});

test('scoreLive fails a stale recording whose prompt no longer matches', () => {
  const s = scoreLive(fixture('old prompt'));
  assert.deepEqual(s.stale, ['a']);
  assert.equal(s.failed, 1);
});

test('scoreLive passes a fresh matching recording', () => {
  assert.equal(scoreLive(fixture('p1')).failed, 0);
});

test('agentPrompt gives the agent only the skill path and the request', () => {
  const p = agentPrompt('/x/skill', 'do it');
  assert.match(p, /\/x\/skill/);
  assert.match(p, /User request: do it/);
});

test('runText: a recording that points at a run adds the text of the files the agent produced', async () => {
  const { runText } = await import('../src/factory/live-evals.mjs');
  assert.equal(runText({}), '');
  assert.equal(runText({ run: '../etc' }), '', 'only runs/<skill>/<hex id> is read');
  assert.equal(runText({ run: 'runs/none/0000000000000000' }), '');
});

test('scoreLive: maxLines counts the agent reply only, not the files of a recorded run', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'live-'));
  mkdirSync(path.join(dir, 'evals', 'live'), { recursive: true });
  writeFileSync(path.join(dir, 'evals', 'cases.json'), JSON.stringify([{ id: 'a', prompt: 'p1', expect: [{ type: 'maxLines', value: 2 }] }]));
  writeFileSync(path.join(dir, 'evals', 'live', 'a.json'), JSON.stringify({ prompt: 'p1', output: 'one\ntwo' }));
  assert.equal(scoreLive(dir).failed, 0);
  writeFileSync(path.join(dir, 'evals', 'live', 'a.json'), JSON.stringify({ prompt: 'p1', output: 'one\ntwo\nthree' }));
  assert.equal(scoreLive(dir).failed, 1);
});

test('isQuotaError catches short CLI limit banners and scoreLive fails them even on notContains cases', () => {
  assert.equal(isQuotaError("You've hit your 5-hour limit · resets 4:20am (UTC)"), true);
  assert.equal(isQuotaError('API Error: Rate limit reached'), true);
  assert.equal(isQuotaError('Credit balance is too low'), true);
  assert.equal(isQuotaError('Your audit passed. ' + 'x'.repeat(600)), false);
  const dir = mkdtempSync(path.join(tmpdir(), 'live-quota-'));
  mkdirSync(path.join(dir, 'evals', 'live'), { recursive: true });
  writeFileSync(path.join(dir, 'evals', 'cases.json'), JSON.stringify([{ id: 'a', prompt: 'p1', expect: [{ type: 'notContains', value: 'forbidden' }] }]));
  writeFileSync(path.join(dir, 'evals', 'live', 'a.json'), JSON.stringify({ prompt: 'p1', output: "You've hit your 5-hour limit · resets 4:20am (UTC)" }));
  const s = scoreLive(dir);
  assert.deepEqual(s.quota, ['a']);
  assert.equal(s.failed, 1);
});

test('runLive: --case runs only selected cases, rejects typos upfront, and refuses to overwrite on quota errors', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'live-run-'));
  mkdirSync(path.join(dir, 'evals', 'live'), { recursive: true });
  writeFileSync(path.join(dir, 'evals', 'cases.json'), JSON.stringify([
    { id: 'c1', prompt: 'p1', expect: [] },
    { id: 'c2', prompt: 'p2', expect: [] },
  ]));
  const existing = { case: 'c1', prompt: 'p1', agent: 'claude', recordedAt: '2026-11-16', output: 'kept c1', files: [] };
  writeFileSync(path.join(dir, 'evals', 'live', 'c1.json'), JSON.stringify(existing));

  let calls = 0;
  assert.throws(() => runLive(dir, {
    cases: ['missing-id'],
    spawn: () => { calls++; return { status: 0, stdout: 'ok' }; },
  }), /unknown case id/);
  assert.equal(calls, 0, 'unknown --case fails before spending tokens');

  assert.throws(() => runLive(dir, {
    cases: ['c1'],
    spawn: () => ({ status: 0, stdout: "You've hit your 5-hour limit · resets 4:20am (UTC)" }),
  }), /usage\/quota limit/);
  assert.equal(JSON.parse(readFileSync(path.join(dir, 'evals', 'live', 'c1.json'), 'utf8')).output, 'kept c1');

  const ran = runLive(dir, {
    cases: ['c2'],
    spawn: () => ({ status: 0, stdout: 'fresh c2 answer' }),
  });
  assert.deepEqual(ran, ['c2']);
  assert.equal(JSON.parse(readFileSync(path.join(dir, 'evals', 'live', 'c1.json'), 'utf8')).output, 'kept c1');
  assert.equal(JSON.parse(readFileSync(path.join(dir, 'evals', 'live', 'c2.json'), 'utf8')).output, 'fresh c2 answer');
});

test('selectCases and parseLiveArgs support comma-separated and repeated --case flags', () => {
  const cases = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
  assert.deepEqual(selectCases(cases, ['c,a']).map((x) => x.id), ['a', 'c']);
  const parsed = parseLiveArgs(['a11y-audit', '--run', '--case', 'a,b', '--case=c', '--engine=claude']);
  assert.deepEqual(parsed, { name: 'a11y-audit', run: true, engine: 'claude', cases: ['a,b', 'c'] });
  assert.throws(() => parseLiveArgs(['a11y-audit', '--bogus']), /unknown option/);
});

test('winCommandLine quotes spaces, parens and empty strings safely', () => {
  assert.equal(
    winCommandLine('claude', ['-p', '--add-dir', 'C:\\Users\\x\\Skill Foundry', '--allowedTools', 'Bash(node:*)', '']),
    'claude -p --add-dir "C:\\Users\\x\\Skill Foundry" --allowedTools "Bash(node:*)" ""',
  );
});
