import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { recordRun, commandRunner, runKey, skillHash, checkExpectations } from '../src/factory/run-skill.mjs';

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'run-skill-'));
  const skillsRoot = join(root, 'skills');
  const dir = join(skillsRoot, 'demo');
  await mkdir(join(dir, 'evals'), { recursive: true });
  await writeFile(join(dir, 'SKILL.md'), '---\nname: demo\ndescription: d\nversion: 1.2.3\n---\n# demo\n');
  await writeFile(join(dir, 'evals', 'cases.json'), JSON.stringify([
    { id: 'ok', prompt: 'draw a box', expect: [{ type: 'contains', value: 'var(--' }, { type: 'fileExists', value: 'figure.svg' }] },
    { id: 'strict', prompt: 'draw a dot', expect: [{ type: 'notContains', value: '#fff' }] },
  ]));
  return { root, skillsRoot, outRoot: join(root, 'runs'), dir };
}

/** A runner that writes real files, counting how often it ran. */
function writer(svg) {
  const r = async ({ outputDir, prompt }) => {
    r.calls += 1;
    r.prompt = prompt;
    await writeFile(join(outputDir, 'figure.svg'), svg);
    return { code: 0, report: 'done', costUsd: 0.01 };
  };
  r.calls = 0;
  return r;
}

test('records a real run with files, hashes and a passing manifest', async () => {
  const f = await fixture();
  const runner = writer('<svg><rect fill="var(--iso-top)"/></svg>');
  const r = await recordRun({ skill: 'demo', caseId: 'ok', runner, skillsRoot: f.skillsRoot, outRoot: f.outRoot });
  assert.equal(r.cached, false);
  assert.equal(r.manifest.status, 'pass');
  assert.equal(r.manifest.version, '1.2.3');
  assert.equal(r.manifest.files.length, 1);
  assert.equal(r.manifest.files[0].path, 'figure.svg');
  assert.match(r.manifest.files[0].sha256, /^[0-9a-f]{64}$/);
  assert.equal(r.manifest.costUsd, 0.01);
  assert.match(runner.prompt, /draw a box/);
  assert.ok(existsSync(join(r.runDir, 'manifest.json')));
  assert.equal(await readFile(join(r.runDir, 'input.md'), 'utf8'), 'draw a box\n');
});

test('second run with the same input and skill is cached and spends nothing', async () => {
  const f = await fixture();
  const runner = writer('<svg fill="var(--a)"></svg>');
  const opts = { skill: 'demo', caseId: 'ok', runner, skillsRoot: f.skillsRoot, outRoot: f.outRoot };
  await recordRun(opts);
  const again = await recordRun(opts);
  assert.equal(again.cached, true);
  assert.equal(runner.calls, 1);
  const forced = await recordRun({ ...opts, force: true });
  assert.equal(forced.cached, false);
  assert.equal(runner.calls, 2);
});

test('changing the skill changes the key, so the run is redone', async () => {
  const f = await fixture();
  const before = runKey('x', await skillHash(f.dir));
  await writeFile(join(f.dir, 'SKILL.md'), '---\nname: demo\ndescription: d\nversion: 1.2.4\n---\n# demo\n');
  assert.notEqual(runKey('x', await skillHash(f.dir)), before);
  assert.notEqual(runKey('x', 'h'), runKey('y', 'h'));
});

test('a run that breaks an expectation or produces nothing is recorded as fail', async () => {
  const f = await fixture();
  const bad = await recordRun({ skill: 'demo', caseId: 'strict', runner: writer('<svg fill="#fff"/>'), skillsRoot: f.skillsRoot, outRoot: f.outRoot });
  assert.equal(bad.manifest.status, 'fail');
  assert.deepEqual(bad.manifest.checks.failures, ['unexpected text: #fff']);
  const empty = await recordRun({ skill: 'demo', inputText: 'nothing', runner: async () => ({ code: 3 }), skillsRoot: f.skillsRoot, outRoot: f.outRoot });
  assert.equal(empty.manifest.status, 'fail');
  assert.ok(empty.manifest.checks.failures.includes('no output files produced'));
  assert.ok(empty.manifest.checks.failures.includes('runner exited with code 3'));
});

test('command runner gets the prompt file and output dir', async () => {
  const f = await fixture();
  const runner = commandRunner('grep -q "draw a box" "$RUN_PROMPT_FILE" && printf \'<svg fill="var(--x)"/>\' > "$RUN_OUTPUT_DIR/figure.svg"');
  const r = await recordRun({ skill: 'demo', caseId: 'ok', runner, skillsRoot: f.skillsRoot, outRoot: f.outRoot });
  assert.equal(r.manifest.status, 'pass', r.manifest.checks.failures.join('; '));
});

test('rejects unknown skills, unknown cases and missing input', async () => {
  const f = await fixture();
  const base = { runner: writer(''), skillsRoot: f.skillsRoot, outRoot: f.outRoot };
  await assert.rejects(recordRun({ ...base, skill: 'nope', inputText: 'x' }), /not found/);
  await assert.rejects(recordRun({ ...base, skill: 'demo', caseId: 'missing' }), /not in/);
  await assert.rejects(recordRun({ ...base, skill: 'demo' }), /required/);
  await assert.rejects(recordRun({ ...base, skill: '../x', inputText: 'x' }), /valid skill/);
});

test('checkExpectations covers contains, notContains and fileExists', () => {
  const ex = [{ type: 'contains', value: 'a' }, { type: 'notContains', value: 'b' }, { type: 'fileExists', value: 'f.svg' }];
  assert.deepEqual(checkExpectations(ex, ['f.svg'], 'a'), []);
  assert.equal(checkExpectations(ex, [], 'b').length, 3);
});
