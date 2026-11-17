/**
 * a11y-audit: lint is clean; the script finds each problem and stays quiet on good markup; every finding's element is in the
 * input; the check table in the references is the script's; the eval cases pass on answers built from the script and fail on
 * bad ones; every recorded real answer cites elements that are in its prompt and criteria that are the script's.
 * @governed-by PO_ARCHITECT
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runEvals } from '../src/factory/evals.mjs';
import { lintSkill } from '../src/factory/lint-skills.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'src', 'skills', 'a11y-audit');
const E = await import(path.join(DIR, 'engine', 'audit.mjs'));
const NOCODE = 'Paste the HTML or JSX you want audited.';
const VISUAL = 'Contrast, focus-ring style, spacing and target size are checked by ui-polish, not by this skill.';
const FLOW = 'This skill does not judge the flow or usability; it checks only what users cannot see.';
const TEXT = 'This skill does not rewrite visible text; fixes change only code, never the words users see.';
const CERT = 'This audit cannot certify conformance with WCAG 2.2; it lists the checks that ran and the checks that need a manual test with assistive technology.';
const cases = JSON.parse(readFileSync(path.join(DIR, 'evals', 'cases.json'), 'utf8'));
const ids = (html) => E.audit(html).findings.map((f) => f.rule);
const page = (inner, head = '<title>T</title>') => `<!doctype html><html lang="en"><head>${head}</head><body><main>${inner}</main></body></html>`;
const collapse = (s) => s.replace(/\s+/g, ' ');
const codeOf = (c) => c.prompt.split('\n\n').slice(1).join('\n\n');

test('a11y-audit lint is clean', async () => {
  assert.deepEqual(await lintSkill(DIR, { testsDir: path.join(ROOT, 'tests') }), []);
});

/** [rule id, markup that must trigger it, markup that must not] */
const PAIRS = [
  ['html-lang', '<!doctype html><html><head><title>T</title></head><body><main></main></body></html>', page('')],
  ['page-title', '<!doctype html><html lang="en"><head></head><body><main></main></body></html>', page('')],
  ['viewport-zoom', page('', '<title>T</title><meta name="viewport" content="width=device-width, user-scalable=no">'), page('', '<title>T</title><meta name="viewport" content="width=device-width, initial-scale=1">')],
  ['main-landmark', '<!doctype html><html lang="en"><head><title>T</title></head><body><div>x</div></body></html>', page('x')],
  ['landmark-name', '<nav><a href="/a">A</a></nav><nav><a href="/b">B</a></nav>', '<nav aria-label="Main"><a href="/a">A</a></nav><nav aria-label="Footer"><a href="/b">B</a></nav>'],
  ['heading-order', '<h1>A</h1><h3>B</h3>', '<h1>A</h1><h2>B</h2><h3>C</h3>'],
  ['heading-empty', '<h2></h2>', '<h2>Plans</h2>'],
  ['img-alt', '<img src="a.png">', '<img src="a.png" alt=""><img src="b.png" alt="Team photo">'],
  ['img-alt-bad', '<img src="a.png" alt="photo.jpg">', '<img src="a.png" alt="Team at the 2026 retreat">'],
  ['control-name', '<button><svg></svg></button>', '<button aria-label="Close"><svg></svg></button><button>Save</button>'],
  ['form-label', '<input type="text" name="q" placeholder="Search">', '<label for="q">Search</label><input id="q" type="text">'],
  ['label-orphan', '<label for="nope">Name</label><input id="n">', '<label for="n">Name</label><input id="n">'],
  ['required-state', '<label for="n">Name *</label><input id="n">', '<label for="n">Name *</label><input id="n" required>'],
  ['error-link', '<label for="n">Age</label><input id="n" aria-invalid="true">', '<label for="n">Age</label><input id="n" aria-invalid="true" aria-describedby="e"><p id="e">Enter a number</p>'],
  ['lang-parts', '<!doctype html><html lang="en"><head><title>T</title></head><body><main><button type="button">ចុះឈ្មោះ</button></main></body></html>', '<!doctype html><html lang="en"><head><title>T</title></head><body><main><button type="button" lang="km">ចុះឈ្មោះ</button></main></body></html>'],
  ['autocomplete', '<label for="e">Email</label><input id="e" type="email">', '<label for="e">Email</label><input id="e" type="email" autocomplete="email">'],
  ['group-name', '<input type="radio" name="s" aria-label="S"><input type="radio" name="s" aria-label="M">', '<fieldset><legend>Size</legend><input type="radio" name="s" aria-label="S"><input type="radio" name="s" aria-label="M"></fieldset>'],
  ['click-no-keyboard', '<div onclick="go()">Go</div>', '<button type="button" onclick="go()">Go</button>'],
  ['link-no-href', '<a onclick="go()">Go</a>', '<a href="/go">Go</a>'],
  ['tabindex-positive', '<div tabindex="2">x</div>', '<div tabindex="0">x</div><div tabindex="-1">y</div>'],
  ['native-element', '<div role="button" tabindex="0">Go</div>', '<button type="button">Go</button>'],
  ['redundant-role', '<button role="button">Go</button>', '<button>Go</button>'],
  ['aria-hidden-focusable', '<div aria-hidden="true"><a href="/x">x</a></div>', '<div aria-hidden="true"><span>x</span></div>'],
  ['aria-invalid-use', '<div role="buttn">x</div><p aria-lable="x">y</p>', '<div role="status">x</div>'],
  ['aria-ref-missing', '<input aria-labelledby="ghost">', '<span id="g">Name</span><input aria-labelledby="g">'],
  ['aria-label-ignored', '<div aria-label="Panel">x</div>', '<section aria-label="Panel">x</section>'],
  ['aria-state-missing', '<div role="checkbox" tabindex="0">x</div>', '<div role="checkbox" tabindex="0" aria-checked="false">x</div>'],
  ['dialog-name', '<div role="dialog"><p>Sure?</p></div>', '<div role="dialog" aria-label="Confirm"><p>Sure?</p></div>'],
  ['status-message', '<div class="toast"></div>', '<div class="toast" role="status"></div>'],
  ['link-purpose', '<a href="/p">Read more</a>', '<a href="/p">Read the 2026 pricing guide</a>'],
  ['label-in-name', '<button aria-label="Submit order">Pay</button>', '<button aria-label="Pay for the order">Pay</button>'],
  ['table-header', '<table><tr><td>a</td></tr></table>', '<table><tr><th scope="col">a</th></tr></table>'],
  ['video-captions', '<video src="a.mp4" controls></video>', '<video src="a.mp4" controls><track kind="captions" src="a.vtt"></video>'],
  ['audio-transcript', '<audio src="a.mp3" controls></audio>', '<audio src="a.mp3" controls></audio><a href="/t">Transcript</a>'],
  ['media-autoplay', '<video src="a.mp4" autoplay controls><track kind="captions"></video>', '<video src="a.mp4" autoplay muted controls><track kind="captions"></video>'],
  ['iframe-title', '<iframe src="/m"></iframe>', '<iframe src="/m" title="Office map"></iframe>'],
  ['nested-interactive', '<a href="/a"><button>x</button></a>', '<a href="/a">x</a><button>y</button>'],
  ['focus-trap', '<script>document.onkeydown = (e) => { if (e.key === "Tab") { e.preventDefault(); } };</script>', '<script>document.onkeydown = (e) => { if (e.key === "Tab") { e.preventDefault(); } if (e.key === "Escape") close(); };</script>'],
  ['duplicate-id', '<label for="a">A</label><input id="a"><input id="a">', '<label for="a">A</label><input id="a"><input id="b" aria-label="B">'],
];

test('the script has a trigger and a quiet case for every check, and nothing else fires on those inputs', () => {
  assert.deepEqual(PAIRS.map((p) => p[0]).sort(), E.RULES.map((r) => r.id).sort(), 'one pair per rule');
  for (const [id, bad, good] of PAIRS) {
    assert.ok(ids(bad).includes(id), `${id} must fire`);
    assert.ok(!ids(good).includes(id), `${id} must stay quiet on good markup (got ${ids(good)})`);
  }
});

const KM = 'ចុះឈ្មោះ';
test('lang-parts (SC 3.1.2): a foreign script without lang is a finding with a lang fix; the same text under lang, or in the page language, is quiet', () => {
  const f = E.audit(page(`<button type="button">${KM}</button>`)).findings.filter((x) => x.rule === 'lang-parts');
  assert.equal(f.length, 1);
  assert.equal(f[0].sc, '3.1.2'); assert.equal(f[0].level, 'AA'); assert.equal(f[0].scName, 'Language of Parts');
  assert.equal(f[0].element, '<button type="button">');
  assert.match(f[0].fix, new RegExp(`\\+ <button type="button" lang="km">`));
  // a parent with lang covers its children; the html element's own lang does not cover a different script
  assert.ok(!ids(page(`<p lang="km"><button>${KM}</button></p>`)).includes('lang-parts'));
  assert.ok(!ids(page(`<button lang="km">${KM}</button>`)).includes('lang-parts'));
  // a page whose parts all have lang is quiet, also with several languages
  assert.ok(!ids(page(`<h1>Welcome</h1><p lang="km">${KM}</p><p lang="ar">مرحبا بك</p><p lang="ja">こんにちは</p>`)).includes('lang-parts'));
  // the page language is read from html: a Khmer page needs no lang on Khmer text, English text then has none either (fewer than three words)
  assert.ok(!ids(`<!doctype html><html lang="km"><head><title>T</title></head><body><main><h1>${KM}</h1><p>OK</p></main></body></html>`).includes('lang-parts'));
  assert.ok(ids(`<!doctype html><html lang="km"><head><title>T</title></head><body><main><p>Create your account today</p></main></body></html>`).includes('lang-parts'));
  // a Khmer attribute value is covered too, and fix keeps every word
  assert.ok(ids(page(`<button aria-label="${KM}">Register</button>`)).includes('lang-parts'));
  // mixed text: the fix wraps only the foreign words and keeps the page-language words
  const m = E.audit(page(`<p>Press ${KM} to start</p>`)).findings.find((x) => x.rule === 'lang-parts');
  assert.ok(m.fix.includes(`<span lang="km">${KM}</span>`));
  // fragments: no html element, so the writing system most of the text uses is taken as the page language, and the note says so
  const frag = E.audit(`<button>${KM}</button><p>Create your account today</p><p>Name</p>`).findings.find((x) => x.rule === 'lang-parts');
  assert.ok(frag && /taken from the script most of the text uses/.test(frag.note));
  // proper names and code stay quiet: a few Latin words on a Khmer page, a code element
  assert.ok(!ids(`<!doctype html><html lang="km"><head><title>T</title></head><body><main><p>${KM} Skill Foundry</p><code>${KM}</code></main></body></html>`).includes('lang-parts'));
});

test('lang-parts keeps the JSX spelling and finds text in JSX', () => {
  const r = E.audit(`export const Register = () => (<main><h1>Join us today and register now</h1><button className="cta" onClick={go}>${KM}</button><p lang="km">${KM}</p></main>);`);
  assert.equal(r.mode, 'jsx');
  const f = r.findings.filter((x) => x.rule === 'lang-parts');
  assert.equal(f.length, 1);
  assert.match(f[0].fix, /<button className="cta" onClick=\{go\} lang="km">/);
  assert.ok(!/xml:lang/.test(f[0].fix));
  assert.ok(!ids(`export const R = () => (<main><h1>Join us today and register now</h1><button className="cta" lang="km">${KM}</button></main>);`).includes('lang-parts'));
});

test('the script prints the reply header with the skipped-by-rule sentence, and tells the agent how to reply and what to do on an error', () => {
  const run = (args, input) => spawnSync('node', [path.join(DIR, 'engine', 'audit.mjs'), ...args], { encoding: 'utf8', input });
  const clean = run(['-'], cases.find((c) => c.id === 'clean-page').prompt.split('\n\n').slice(1).join('\n\n'));
  assert.match(clean.stdout, /found 0 \(0 failure, 0 advisory\)/);
  assert.ok(clean.stdout.includes(E.SKIPPED_BY_RULE), 'the sentence is in the header even at 0 findings');
  assert.match(clean.stdout, /does not mean the page is clean/);
  assert.match(clean.stdout, /This run is the script's own result/);
  assert.match(clean.stdout, /Do not add that anything was made by hand/);
  const h = E.header(E.audit('<img src="a.png">'));
  assert.equal(h.length, 2); assert.equal(h[1], E.SKIPPED_BY_RULE);
  const bad = run(['--file', '/no/such/file.html']);
  assert.equal(bad.status, 2);
  assert.match(bad.stderr, /ONE plain command/);
  assert.match(bad.stderr, /no cd, no shell variable, no pipe/);
  assert.ok(bad.stderr.includes('The script could not run ('));
  assert.ok(bad.stderr.includes('The script did not run; these checks were made by reading, so run it to confirm.'));
  assert.match(run([]).stderr, /What to do:/);
});

test('the skill tells the agent to run the script as one plain command and to say so on the first line when it cannot', () => {
  const read = (f) => readFileSync(path.join(DIR, f), 'utf8');
  assert.match(read('layers/04-flow.md'), /ONE plain command/);
  assert.match(read('layers/04-flow.md'), /No `cd` before it, no shell variable/);
  assert.match(read('layers/06-states.md'), /first line of the reply[^]*The script could not run \(<say plainly why>\)/);
  assert.ok(read('layers/06-states.md').includes(E.COULD_NOT_RUN));
  assert.match(read('layers/06-states.md'), /hex code[^]*Not checked here/i);
  assert.match(read('layers/08-output.md'), /Not checked here[^]*hex colour values/i);
  assert.ok(read('layers/08-output.md').includes(E.SKIPPED_BY_RULE));
  const rules = JSON.parse(read('RULES.json'));
  for (const id of ['R-a11y-audit-17', 'R-a11y-audit-18', 'R-a11y-audit-19']) assert.ok(rules.some((r) => r.id === id), id);
});

test('the script reports nothing on a clean page and runs the page-level checks only on a full page', () => {
  const clean = E.audit(readFileSync(path.join(ROOT, 'src', 'skills', 'a11y-audit', 'evals', 'cases.json'), 'utf8') && cases.find((c) => c.id === 'clean-page').prompt.split('\n\n').slice(1).join('\n\n'));
  assert.deepEqual(clean.findings, []);
  assert.equal(clean.page, true);
  const frag = E.audit('<img src="a.png">');
  assert.equal(frag.page, false);
  assert.deepEqual(frag.skipped.map((s) => s.id).sort(), ['html-lang', 'main-landmark', 'page-title', 'viewport-zoom']);
  assert.ok(frag.manual.some((m) => /fragment/.test(m)));
});

test('every finding names an element that is in the input, with a real line number', () => {
  for (const c of cases) {
    if (c.id === 'no-code') continue;
    const code = codeOf(c);
    const flat = collapse(code);
    for (const f of E.audit(code).findings) {
      assert.ok(flat.includes(f.element.replace(/…$/, '')), `${c.id} ${f.rule}: "${f.element}" is not in the input`);
      assert.ok(f.line >= 1 && f.line <= code.split('\n').length, `${c.id} ${f.rule}: line ${f.line}`);
      assert.match(f.sc, /^\d\.\d\.\d+$/);
      assert.ok(['A', 'AA'].includes(f.level));
      assert.ok(f.fix.includes('\n') || f.fix.startsWith('+') || f.fix.startsWith('-'), `${c.id} ${f.rule}: fix is a code change`);
    }
  }
});

test('JSX: names stay in JSX spelling, components and run-time values are listed as not checked', () => {
  const r = E.audit('export const A = () => (<><label htmlFor="x">Name</label><input id="y" tabIndex={3} />{items.map((i) => <li key={i} onClick={go}>{i}</li>)}<Icon /></>);');
  assert.equal(r.mode, 'jsx');
  assert.ok(r.findings.some((f) => f.rule === 'label-orphan' && f.fix.includes('htmlFor') && !/\bfor="/.test(f.fix)));
  assert.ok(r.findings.some((f) => f.rule === 'tabindex-positive' && !/tabindex/i.test(f.fix.split('\n')[1])));
  assert.ok(r.findings.some((f) => f.rule === 'click-no-keyboard'));
  assert.ok(r.manual.some((m) => /component/.test(m)));
  assert.deepEqual(ids('<button {...props}></button><Button />'), [], 'spread props and components are not guessed');
});

test('the check table in the references is the script table, with the same criterion, level and status', () => {
  const ref = readFileSync(path.join(DIR, 'references', 'README.md'), 'utf8');
  for (const r of E.RULES) {
    const row = ref.split('\n').find((l) => l.startsWith(`| \`${r.id}\` |`));
    assert.ok(row, `${r.id} is in the references`);
    assert.ok(row.includes(`| ${r.sc} ${r.scName} | ${r.level} | ${r.who.join(', ')} | ${r.status}`), `${r.id}: row differs from the script`);
  }
  assert.equal(ref.split('\n').filter((l) => l.startsWith('| `')).length, E.RULES.length);
  assert.match(readFileSync(path.join(DIR, 'SKILL.md'), 'utf8'), new RegExp(`The ${E.RULES.length} checks`));
});

test('the script never reports what the polish skill owns: no contrast, focus style, spacing or target size check exists', () => {
  const text = JSON.stringify(E.RULES);
  assert.doesNotMatch(text, /contrast|focus-?visible|spacing|target-?size|2\.5\.8|1\.4\.3|2\.4\.7/i);
  const r = E.audit('<div class="card" style="color:#aaa;padding:13px"><a href="/buy" style="outline:none;width:10px;height:10px">Buy now</a></div>');
  assert.deepEqual(r.findings, []);
});

test('the command line reads a file, a string and standard input, and exits 2 with no input', () => {
  const run = (args, input) => spawnSync('node', [path.join(DIR, 'engine', 'audit.mjs'), ...args], { encoding: 'utf8', input });
  const a = run(['--html', '<img src="a.png">']);
  assert.equal(a.status, 0);
  assert.match(a.stdout, /\[img-alt\] SC 1\.1\.1 Non-text Content \(A\), failure/);
  assert.match(a.stdout, /manual tests needed/);
  assert.match(run(['-'], '<button></button>').stdout, /\[control-name\]/);
  assert.equal(JSON.parse(run(['--html', '<img src="a.png">', '--json']).stdout).findings[0].rule, 'img-alt');
  assert.equal(run([]).status, 2);
  assert.equal(run(['--html', '  ']).status, 2);
});

/** What the skill's layer 08 says a reply looks like, built from the script, with the fixed sentences in front. */
function answer(id) {
  const c = cases.find((x) => x.id === id);
  if (id === 'no-code') return NOCODE;
  const r = E.audit(codeOf(c));
  const byReading = id === 'engine-unavailable';
  const first = { 'contrast-request': [VISUAL], 'usability-request': [FLOW], 'rewrite-request': [TEXT], 'certificate-request': [CERT], 'engine-unavailable': [E.COULD_NOT_RUN.replace('<say plainly why>', 'this session does not allow running commands')] }[id] ?? [];
  const head = byReading ? ['Input: HTML. The checks were made by reading; no script counts. Not a conformance claim: only the checks listed here ran.', E.SKIPPED_BY_RULE] : E.header(r);
  const fixes = r.findings.map((f) => `${f.n}. **${f.rule}** · SC ${f.sc} ${f.scName} (${f.level}) · ${f.status}\n   Element: \`${f.element}\` (line ${f.line})\n   Affects: ${f.who.join(', ')}\n   Problem: ${f.problem}\n   Fix:\n   \`\`\`diff\n${f.fix}\n   \`\`\``);
  return [...first, '', '## Accessibility audit: x', '', ...head, `Visible words kept: ${codeOf(c).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()}`, '', '### Findings', fixes.length ? fixes.join('\n\n') : 'None.', '', '### Needs a manual test', ...r.manual.map((m) => `- ${m}`), '', '### Not checked here', '- Contrast, focus-ring style, spacing and target size: not checked; ui-polish owns them.', '', '### Open questions', byReading ? '- The script did not run; these checks were made by reading, so run it to confirm.' : '- None.'].join('\n');
}

test('a11y-audit eval cases pass on answers built from the script and the fixed sentences', () => {
  const byPrompt = Object.fromEntries(cases.map((c) => [c.prompt, answer(c.id)]));
  const r = runEvals(DIR, (p) => ({ text: byPrompt[p] }));
  assert.equal(r.failed, 0, JSON.stringify(r.results.filter((x) => !x.ok)));
  assert.equal(cases.length, 16);
});

test('a11y-audit evals reject findings without code, a missing boundary sentence, contrast values, a rewritten label and a conformance claim', () => {
  const bad = (id, text) => assert.equal(runEvals(DIR, (p) => ({ text: p === cases.find((c) => c.id === id).prompt ? text : answer(cases.find((c) => c.prompt === p).id) })).results.find((x) => x.id === id).ok, false, id);
  bad('no-code', `${NOCODE}\n\n### Findings`);
  bad('contrast-request', answer('contrast-request').replace(VISUAL, ''));
  bad('contrast-request', `${answer('contrast-request')}\nThe grey #aaa text is 2.3:1.`);
  bad('usability-request', answer('usability-request').replace(FLOW, ''));
  bad('rewrite-request', answer('rewrite-request').replace('Proceed to the next step of the registration', 'Continue'));
  bad('certificate-request', `${answer('certificate-request')}\nYour page is compliant.`);
  bad('certificate-request', answer('certificate-request').replace(CERT, ''));
  bad('signin-page', answer('signin-page').replace('**html-lang**', '**lang**'));
  bad('clean-page', `${answer('clean-page')}\nThe page is accessible.`);
});

test('recorded real answers cite only elements that are in their prompt and criteria that are the script\'s', () => {
  let n = 0;
  for (const c of cases) {
    const p = path.join(DIR, 'evals', 'live', `${c.id}.json`);
    if (!existsSync(p) || c.id === 'no-code') continue;
    const rec = JSON.parse(readFileSync(p, 'utf8'));
    const flat = collapse(rec.prompt);
    const code = codeOf(c);
    const table = Object.fromEntries(E.RULES.map((r) => [r.id, r]));
    for (const m of rec.output.matchAll(/Element:\s*`([^`]+)`/g)) { assert.ok(flat.includes(collapse(m[1]).replace(/…$/, '')), `${c.id}: element ${m[1]} is not in the input`); n++; }
    for (const m of rec.output.matchAll(/\*\*([a-z-]+)\*\*\s*·\s*SC (\d\.\d\.\d+) ([^(]+)\((A+)\)/g)) {
      assert.ok(table[m[1]], `${c.id}: unknown rule ${m[1]}`);
      assert.equal(m[2], table[m[1]].sc, `${c.id}: ${m[1]} criterion`);
      assert.equal(m[4], table[m[1]].level, `${c.id}: ${m[1]} level`);
    }
    // the reply reports exactly the findings the script finds, no more and no fewer
    const reported = [...rec.output.matchAll(/^\d+\.\s+\*\*([a-z-]+)\*\*/gm)].map((m) => m[1]);
    assert.deepEqual([...reported].sort(), E.audit(code).findings.map((f) => f.rule).sort(), `${c.id}: findings differ from the script`);
  }
  if (existsSync(path.join(DIR, 'evals', 'live', 'signin-page.json'))) assert.ok(n >= 8, 'elements were checked');
});

test('a11y-audit version matches CHANGELOG and registry', () => {
  const v = /^version:\s*(\S+)/m.exec(readFileSync(path.join(DIR, 'SKILL.md'), 'utf8'))[1];
  assert.equal(v, '1.0.0');
  assert.match(readFileSync(path.join(DIR, 'CHANGELOG.md'), 'utf8'), new RegExp(`## ${v} - \\d{4}-\\d{2}-\\d{2}`));
  const reg = JSON.parse(readFileSync(path.join(ROOT, 'src', 'factory', 'registry.json'), 'utf8'));
  assert.equal(reg.find((x) => x.name === 'a11y-audit').version, v);
  assert.deepEqual(reg.find((x) => x.name === 'a11y-audit').roles, ['QA_AUDITOR', 'DEV_ENGINEER']);
});
