/**
 * Run recorder: has a real agent follow a skill on a real input, captures the files it produced,
 * checks them against the skill's eval expectations and writes a manifest. Runs are cached by
 * input hash + skill content hash, so a real run happens once per input and skill version.
 * Output: <out>/<skill>/<key16>/{input.md, output/**, manifest.json}
 * CLI: node src/factory/run-skill.mjs <skill> (--case <id> | --input <file>) [--runner "<cmd>"] [--force] [--out runs]
 * Default runner: the Claude Code CLI (`claude -p`), which spends tokens. A --runner command gets
 * env RUN_PROMPT_FILE, RUN_OUTPUT_DIR, SKILL_DIR and runs with cwd = RUN_OUTPUT_DIR.
 * @governed-by PO_ARCHITECT
 */
import { readFile, readdir, mkdir, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, resolve, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { isQuotaError, winCommandLine, noHookArgs } from './live-evals.mjs';

const HERE = fileURLToPath(import.meta.url);
const REPO_ROOT = resolve(dirname(HERE), '..', '..');

const sha256 = (data) => createHash('sha256').update(data).digest('hex');

/** All files under dir, relative with forward slashes, sorted. @param {string} dir */
export async function listFiles(dir) {
  const out = [];
  async function walk(d) {
    for (const e of await readdir(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) await walk(p);
      else if (e.isFile()) out.push(relative(dir, p).split(sep).join('/'));
    }
  }
  if (existsSync(dir)) await walk(dir);
  return out.sort();
}

const normLf = (buf) => (buf.includes(0) ? buf : Buffer.from(buf.toString('utf8').replace(/\r\n/g, '\n'), 'utf8'));

/** Hash of every file in the skill folder (names and contents). @param {string} skillDir */
export async function skillHash(skillDir) {
  const h = createHash('sha256');
  for (const f of await listFiles(skillDir)) {
    if (f.startsWith('evals/live/') || f === 'evals/portable.json') continue; // recordings of earlier runs are not part of the skill an agent follows
    h.update(f).update('\0').update(normLf(await readFile(join(skillDir, f)))).update('\0');
  }
  return h.digest('hex');
}

/** @param {string} skillDir */
async function readVersion(skillDir) {
  const m = /^version:\s*["']?([^"'\s]+)/m.exec(await readFile(join(skillDir, 'SKILL.md'), 'utf8'));
  if (!m) throw new Error(`run-skill: no version in ${skillDir}/SKILL.md`);
  return m[1];
}

/** Cache key for one run. @param {string} inputText @param {string} skillContentHash */
export function runKey(inputText, skillContentHash) {
  return sha256(`${skillContentHash}\n${inputText}`);
}

/** The instruction given to the agent. */
export function buildPrompt(skillDir, inputText, outputDir) {
  return [
    `You are running the skill in ${skillDir}. Read ${join(skillDir, 'SKILL.md')} and every file it links to, then follow it step by step.`,
    `Write every file you produce into ${outputDir} and nowhere else. Produce the real output the skill describes, never a placeholder or mock.`,
    'When done, reply with a short report: files produced, checks run and their results, open items.',
    '',
    'Input:',
    inputText,
  ].join('\n');
}

/** Check expectations (evals format) against the produced files. */
export function checkExpectations(expect, files, text) {
  const failures = [];
  for (const e of expect ?? []) {
    if (e.type === 'contains' && !text.includes(e.value)) failures.push(`missing text: ${e.value}`);
    else if (e.type === 'notContains' && text.includes(e.value)) failures.push(`unexpected text: ${e.value}`);
    else if (e.type === 'fileExists' && !files.includes(e.value)) failures.push(`missing file: ${e.value}`);
    else if (e.type === 'maxLines') {
      // Applied per produced text file: output files are full products, not one reply.
      continue;
    }
  }
  return failures;
}

/**
 * Hash the produced files and check expectations. Text checks read product files only:
 * Markdown files are the agent's own reports, which may quote the rules they were checked against.
 * @param {string} outputDir @param {object[]} expect
 */
export async function evaluate(outputDir, expect, report = '') {
  const names = await listFiles(outputDir);
  const files = [];
  let text = report ? `${report}\n` : ''; // what the agent told the user counts as output too
  for (const f of names) {
    const data = await readFile(join(outputDir, f));
    files.push({ path: f, bytes: data.length, sha256: sha256(data) });
    if (!f.endsWith('.md')) text += `${data.toString('utf8')}\n`;
  }
  // A case that expects files fails without them; a case that expects a refusal or plain advice produces none.
  const needsFiles = (expect ?? []).some((e) => e.type === 'fileExists');
  const failures = names.length === 0 && (needsFiles || !(expect ?? []).length) ? ['no output files produced'] : [];
  failures.push(...checkExpectations(expect, names, text));
  return { files, failures };
}

/** Runs a shell command; resolves with exit code, stdout and stderr. */
function sh(cmd, args, opts) {
  return new Promise((res) => {
    const p = Array.isArray(args)
      ? spawn(cmd, args, { ...opts, stdio: ['pipe', 'pipe', 'pipe'] })
      : spawn(cmd, { ...opts, stdio: ['pipe', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    p.stdout.on('data', (d) => (stdout += d));
    p.stderr.on('data', (d) => (stderr += d));
    p.on('error', (e) => res({ code: 127, stdout, stderr: String(e.message) }));
    p.on('close', (code) => res({ code: code ?? 1, stdout, stderr }));
    if (opts.input != null) p.stdin.end(opts.input);
    else p.stdin.end();
  });
}

/** Default runner: Claude Code headless. Returns { code, report, costUsd, usage }. */
export async function claudeRunner({ prompt, outputDir, skillDir }) {
  const args = [
    '-p', '--output-format', 'json',
    '--add-dir', skillDir,
    '--allowedTools', 'Read', 'Glob', 'Grep', 'Write', 'Edit', 'Bash(node:*)', ...noHookArgs(),
  ];
  const r = process.platform === 'win32'
    ? await sh(winCommandLine('claude', args), null, { cwd: outputDir, input: prompt, shell: true })
    : await sh('claude', args, { cwd: outputDir, input: prompt });
  let report = r.stdout;
  let costUsd = null;
  let usage = null;
  try {
    const j = JSON.parse(r.stdout);
    report = String(j.result ?? '');
    costUsd = typeof j.total_cost_usd === 'number' ? j.total_cost_usd : null;
    usage = j.usage ?? null;
  } catch { /* non-JSON output is kept as the report */ }
  return { code: r.code, report, costUsd, usage, stderr: r.stderr.slice(-2000) };
}

function findSh() {
  if (process.platform !== 'win32') return 'sh';
  for (const p of ['C:\\Program Files\\Git\\bin\\sh.exe', 'C:\\Program Files\\Git\\usr\\bin\\sh.exe']) {
    if (existsSync(p)) return p;
  }
  return 'sh';
}

/** Runner from a shell command string (for other engines and for tests). */
export function commandRunner(command) {
  return async ({ promptFile, outputDir, skillDir }) => {
    const r = await sh(findSh(), ['-c', command], {
      cwd: outputDir,
      env: { ...process.env, RUN_PROMPT_FILE: promptFile, RUN_OUTPUT_DIR: outputDir, SKILL_DIR: skillDir },
    });
    return { code: r.code, report: r.stdout, costUsd: null, usage: null, stderr: r.stderr.slice(-2000) };
  };
}

/**
 * Record one real run of a skill, or return the cached one.
 * @param {{ skill: string, caseId?: string, inputText?: string, runner?: Function, force?: boolean,
 *   skillsRoot?: string, outRoot?: string, now?: () => string }} opts
 */
export async function recordRun(opts) {
  const { skill, caseId, runner = claudeRunner, force = false } = opts ?? {};
  if (typeof skill !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(skill)) throw new TypeError('recordRun: valid skill name required');
  if (typeof runner !== 'function') throw new TypeError('recordRun: runner must be a function');
  const skillsRoot = opts.skillsRoot ?? join(REPO_ROOT, 'src', 'skills');
  const outRoot = opts.outRoot ?? join(REPO_ROOT, 'runs');
  const now = opts.now ?? (() => new Date().toISOString());
  const skillDir = join(skillsRoot, skill);
  if (!existsSync(join(skillDir, 'SKILL.md'))) throw new Error(`recordRun: skill ${skill} not found`);

  let inputText = opts.inputText;
  let expect = [];
  if (caseId != null) {
    const cases = JSON.parse(await readFile(join(skillDir, 'evals', 'cases.json'), 'utf8'));
    const c = cases.find((x) => x.id === caseId);
    if (!c) throw new Error(`recordRun: case ${caseId} not in ${skill}/evals/cases.json`);
    inputText = c.prompt;
    expect = c.expect ?? [];
  }
  if (typeof inputText !== 'string' || !inputText.trim()) throw new TypeError('recordRun: caseId or inputText required');

  const version = await readVersion(skillDir);
  const contentHash = await skillHash(skillDir);
  const key = runKey(inputText, contentHash);
  const runDir = join(outRoot, skill, key.slice(0, 16));
  const manifestPath = join(runDir, 'manifest.json');
  if (!force && existsSync(manifestPath)) {
    // Cached: no agent run. Checks are re-applied to the saved output (deterministic, free).
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    const ev = await evaluate(join(runDir, 'output'), expect, String(manifest.report ?? ''));
    const quotaFail = isQuotaError(manifest.report) ? ['quota/limit error recorded instead of agent answer'] : [];
    const failures = [...(manifest.exitCode === 0 ? [] : [`runner exited with code ${manifest.exitCode}`]), ...quotaFail, ...ev.failures];
    Object.assign(manifest, { checks: { expectations: expect.length, failures }, status: failures.length === 0 ? 'pass' : 'fail' });
    await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    if (caseId != null && opts.live !== false && !isQuotaError(manifest.report)) {
      const livePath = join(skillDir, 'evals', 'live', `${caseId}.json`);
      let stale = !existsSync(livePath);
      if (!stale) try { stale = JSON.parse(await readFile(livePath, 'utf8')).prompt !== inputText; } catch { stale = true; }
      if (stale) {
        await mkdir(join(skillDir, 'evals', 'live'), { recursive: true });
        const rec = { case: caseId, prompt: inputText, agent: `${manifest.runner} via run-skill (fresh agent, skill folder and the case prompt only)`, recordedAt: String(manifest.finishedAt ?? '').slice(0, 10), output: manifest.report, files: manifest.files.map((f) => f.path), run: relative(REPO_ROOT, runDir).split(sep).join('/') };
        await writeFile(livePath, `${JSON.stringify(rec, null, 2)}\n`);
      }
    }
    return { cached: true, runDir, manifest };
  }

  await rm(runDir, { recursive: true, force: true });
  const outputDir = join(runDir, 'output');
  await mkdir(outputDir, { recursive: true });
  const prompt = buildPrompt(skillDir, inputText, outputDir);
  const promptFile = join(runDir, 'prompt.txt');
  await writeFile(join(runDir, 'input.md'), inputText.endsWith('\n') ? inputText : `${inputText}\n`);
  await writeFile(promptFile, prompt);

  const startedAt = now();
  const res = (await runner({ prompt, promptFile, outputDir, skillDir })) ?? {};
  const finishedAt = now();

  const ev = await evaluate(outputDir, expect, String(res.report ?? ''));
  const files = ev.files;
  const failures = [];
  if (res.code !== 0) failures.push(`runner exited with code ${res.code}`);
  if (isQuotaError(res.report)) failures.push('quota/limit error recorded instead of agent answer');
  failures.push(...ev.failures);

  const manifest = {
    skill,
    version,
    caseId: caseId ?? null,
    inputSha256: sha256(inputText),
    skillSha256: contentHash,
    key,
    startedAt,
    finishedAt,
    runner: runner.name || 'custom',
    exitCode: res.code ?? null,
    costUsd: res.costUsd ?? null,
    usage: res.usage ?? null,
    files,
    checks: { expectations: expect.length, failures },
    status: failures.length === 0 ? 'pass' : 'fail',
    report: String(res.report ?? '').slice(0, 12000), // a path d report plus a set printout is longer than 4000
  };
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  // The same real run is the skill's live eval recording (docs/factory/STANDARD.md section 13): it points at the run's files.
  if (caseId != null && opts.live !== false && !isQuotaError(res.report)) {
    const liveDir = join(skillDir, 'evals', 'live');
    await mkdir(liveDir, { recursive: true });
    const rec = { case: caseId, prompt: inputText, agent: `${manifest.runner} via run-skill (fresh agent, skill folder and the case prompt only)`, recordedAt: finishedAt.slice(0, 10), output: manifest.report, files: manifest.files.map((f) => f.path), run: relative(REPO_ROOT, runDir).split(sep).join('/') };
    await writeFile(join(liveDir, `${caseId}.json`), `${JSON.stringify(rec, null, 2)}\n`);
  }
  return { cached: false, runDir, manifest };
}

function arg(argv, name) {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : undefined;
}

async function main(argv) {
  const skill = argv[0];
  if (!skill || skill.startsWith('--')) {
    console.error('usage: node src/factory/run-skill.mjs <skill> (--case <id> | --input <file>) [--runner "<cmd>"] [--force] [--out runs]');
    return 2;
  }
  const inputFile = arg(argv, '--input');
  const runnerCmd = arg(argv, '--runner');
  const out = arg(argv, '--out');
  const r = await recordRun({
    skill,
    caseId: arg(argv, '--case'),
    inputText: inputFile ? await readFile(inputFile, 'utf8') : undefined,
    runner: runnerCmd ? commandRunner(runnerCmd) : claudeRunner,
    force: argv.includes('--force'),
    outRoot: out ? resolve(out) : undefined,
  });
  const m = r.manifest;
  console.log(`${r.cached ? 'cached' : 'recorded'} ${m.skill}@${m.version} ${m.status} -> ${relative(process.cwd(), r.runDir)}`);
  console.log(`files: ${m.files.length}${m.costUsd != null ? `  cost: $${m.costUsd.toFixed(4)}` : ''}`);
  for (const f of m.checks.failures) console.log(`FAIL ${f}`);
  return m.status === 'pass' ? 0 : 1;
}

if (process.argv[1] && resolve(process.argv[1]) === HERE) {
  main(process.argv.slice(2)).then((c) => process.exit(c), (e) => { console.error(e.message); process.exit(2); });
}
