/**
 * Skill folder linter. Reports problems as { file, line, code, message }.
 * CLI: node src/factory/lint-skills.mjs [skill]
 * @governed-by PO_ARCHITECT
 */
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, resolve, relative, dirname, basename, isAbsolute, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = fileURLToPath(import.meta.url);
export const REPO_ROOT = resolve(dirname(HERE), '..', '..');

export const CHECK_IDS = [
  'chk-required-files', 'chk-frontmatter', 'chk-name-match', 'chk-size', 'chk-rules-mapped',
  'chk-check-tested', 'chk-links', 'chk-preview-json', 'chk-cover-svg',
];

export const REQUIRED_FILES = [
  'SKILL.md', 'references/README.md', 'examples/README.md', 'evals/cases.json',
  'RULES.json', 'CHANGELOG.md', 'preview/cover.svg', 'preview.json',
];

const SECTIONS = ['When to use', 'Procedure', 'Rules', 'Checks', 'Review', 'Output'];
const SEMVER = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;
const EXPECT_TYPES = ['contains', 'notContains', 'maxLines', 'fileExists'];

async function readText(p) {
  try { return await readFile(p, 'utf8'); } catch { return null; }
}

async function exists(p) {
  try { await stat(p); return true; } catch { return false; }
}

async function listFiles(dir) {
  const out = [];
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === '.git') continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await listFiles(p)));
    else if (e.isFile()) out.push(p);
  }
  return out;
}

function lineOf(text, index) {
  return text.slice(0, index).split('\n').length;
}

function parseJson(text) {
  try { return { value: JSON.parse(text) }; } catch (err) { return { error: err.message }; }
}

/**
 * @param {string} skillDir
 * @param {{testsDir?:string}} [opts]
 * @returns {Promise<{file:string,line:number,code:string,message:string}[]>}
 */
export async function lintSkill(skillDir, { testsDir } = {}) {
  if (typeof skillDir !== 'string' || !skillDir) throw new TypeError('lintSkill: skillDir required');
  const dir = resolve(skillDir);
  const name = basename(dir);
  const tdir = resolve(testsDir ?? join(REPO_ROOT, 'tests'));
  const problems = [];
  const add = (file, line, code, message) => problems.push({ file: `${name}/${file}`, line, code, message });

  for (const f of REQUIRED_FILES) {
    if (!(await exists(join(dir, f)))) add(f, 1, 'chk-required-files', `missing required file ${f}`);
  }

  // SKILL.md
  const skill = await readText(join(dir, 'SKILL.md'));
  if (skill !== null) {
    const lines = skill.replace(/\r\n/g, '\n').split('\n');
    const count = lines[lines.length - 1] === '' ? lines.length - 1 : lines.length;
    if (count > 150) add('SKILL.md', 151, 'chk-size', `SKILL.md has ${count} lines (max 150)`);
    if (lines[0].trim() !== '---') {
      add('SKILL.md', 1, 'chk-frontmatter', 'SKILL.md must start with --- frontmatter');
    } else {
      const end = lines.indexOf('---', 1);
      if (end < 0) add('SKILL.md', 1, 'chk-frontmatter', 'frontmatter is not closed with ---');
      else {
        const fm = {};
        for (let i = 1; i < end; i++) {
          const m = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(lines[i]);
          if (m) fm[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
        }
        for (const k of ['name', 'description', 'version']) {
          if (!fm[k]) add('SKILL.md', 1, 'chk-frontmatter', `frontmatter key ${k} missing`);
        }
        if (fm.version && !SEMVER.test(fm.version)) add('SKILL.md', 1, 'chk-frontmatter', `version ${fm.version} is not semver`);
        if (fm.name && fm.name !== name) add('SKILL.md', 1, 'chk-name-match', `name ${fm.name} does not equal folder ${name}`);
      }
    }
    for (const s of SECTIONS) {
      if (!lines.some((l) => l.trim() === `## ${s}`)) add('SKILL.md', 1, 'chk-frontmatter', `missing section ## ${s}`);
    }
  }

  // Links in markdown files
  for (const file of await listFiles(dir)) {
    if (!file.endsWith('.md')) continue;
    const text = await readText(file);
    if (text === null) continue;
    const rel = relative(dir, file).split(sep).join('/');
    const re = /!?\[[^\]]*\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g;
    let m;
    while ((m = re.exec(text))) {
      const target = m[1];
      if (/^(https?:|mailto:|#)/i.test(target)) continue;
      const clean = decodeURIComponent(target.split('#')[0].split('?')[0]);
      if (!clean) continue;
      const line = lineOf(text, m.index);
      if (/^[a-z]+:/i.test(clean) || isAbsolute(clean) || clean.startsWith('//')) {
        add(rel, line, 'chk-links', `link ${target} must be relative inside the skill folder`);
        continue;
      }
      const abs = resolve(dirname(file), clean);
      const inside = relative(dir, abs);
      if (inside.startsWith('..') || isAbsolute(inside)) add(rel, line, 'chk-links', `link ${target} leaves the skill folder`);
      else if (!(await exists(abs))) add(rel, line, 'chk-links', `link ${target} points to a missing file`);
    }
  }

  // RULES.json
  const rulesText = await readText(join(dir, 'RULES.json'));
  if (rulesText !== null) {
    const { value: rules, error } = parseJson(rulesText);
    if (error || !Array.isArray(rules)) add('RULES.json', 1, 'chk-rules-mapped', `RULES.json must be a JSON array${error ? `: ${error}` : ''}`);
    else {
      const idRe = new RegExp(`^R-${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-\\d+$`);
      const testText = (await Promise.all((await listFiles(tdir)).map(readText))).filter(Boolean).join('\n');
      rules.forEach((r, i) => {
        const where = `rule ${r?.id ?? `#${i + 1}`}`;
        if (!r || typeof r !== 'object') return add('RULES.json', 1, 'chk-rules-mapped', `rule #${i + 1} is not an object`);
        if (typeof r.id !== 'string' || !idRe.test(r.id)) add('RULES.json', 1, 'chk-rules-mapped', `${where} id must match R-${name}-<n>`);
        if (typeof r.text !== 'string' || !r.text.trim()) add('RULES.json', 1, 'chk-rules-mapped', `${where} needs text`);
        const hasCheck = typeof r.check === 'string' && r.check.trim() !== '';
        const hasList = typeof r.checklist === 'string' ? r.checklist.trim() !== '' : Array.isArray(r.checklist) && r.checklist.length > 0;
        if (!hasCheck && !hasList) add('RULES.json', 1, 'chk-rules-mapped', `${where} needs a check or checklist`);
        if (hasCheck && !testText.includes(r.check)) add('RULES.json', 1, 'chk-check-tested', `${where} check ${r.check} is not named in any test file`);
      });
    }
  }

  // evals/cases.json
  const casesText = await readText(join(dir, 'evals', 'cases.json'));
  if (casesText !== null) {
    const { value: cases, error } = parseJson(casesText);
    const bad = error || !Array.isArray(cases) || cases.some((c) => !c || typeof c.id !== 'string' || typeof c.prompt !== 'string'
      || !Array.isArray(c.expect) || c.expect.some((e) => !e || !EXPECT_TYPES.includes(e.type) || e.value === undefined));
    if (bad) add('evals/cases.json', 1, 'chk-required-files', 'evals/cases.json must be [{ id, prompt, expect: [{ type, value }] }]');
  }

  // preview.json
  const prevText = await readText(join(dir, 'preview.json'));
  if (prevText !== null) {
    const { value: p, error } = parseJson(prevText);
    if (error || !p || typeof p !== 'object' || Array.isArray(p)) add('preview.json', 1, 'chk-preview-json', 'preview.json must be a JSON object');
    else {
      for (const k of ['title', 'tagline', 'prompt']) {
        if (typeof p[k] !== 'string' || !p[k].trim()) add('preview.json', 1, 'chk-preview-json', `preview.json ${k} must be a non-empty string`);
      }
      if (typeof p.tagline === 'string' && p.tagline.length > 90) add('preview.json', 1, 'chk-preview-json', `tagline is ${p.tagline.length} chars (max 90)`);
      if (p.outputs === undefined || p.outputs === null || p.outputs === '') add('preview.json', 1, 'chk-preview-json', 'preview.json outputs missing');
      if (!Array.isArray(p.tags) || p.tags.length > 5) add('preview.json', 1, 'chk-preview-json', 'preview.json tags must be an array of at most 5');
    }
  }

  // preview/cover.svg
  const coverPath = join(dir, 'preview', 'cover.svg');
  const svg = await readText(coverPath);
  if (svg !== null) {
    const bytes = Buffer.byteLength(svg);
    if (bytes > 40 * 1024) add('preview/cover.svg', 1, 'chk-size', `cover.svg is ${bytes} bytes (max 40 KB)`);
    const root = /<svg\b[^>]*>/i.exec(svg);
    if (!root) add('preview/cover.svg', 1, 'chk-cover-svg', 'no <svg> root element');
    else if (!/\sviewBox\s*=/.test(root[0])) add('preview/cover.svg', lineOf(svg, root.index), 'chk-cover-svg', 'svg root needs a viewBox');
    const scan = (re, msg) => { let m; while ((m = re.exec(svg))) add('preview/cover.svg', lineOf(svg, m.index), 'chk-cover-svg', msg(m)); };
    scan(/<script/gi, () => 'cover.svg must not contain <script');
    scan(/<foreignObject/gi, () => 'cover.svg must not contain <foreignObject');
    scan(/\s(?:xlink:)?href\s*=\s*["']\s*(?:https?:|\/\/)/gi, () => 'cover.svg must not reference external URLs');
    scan(/\s(fill|stroke|stop-color|color)\s*=\s*["']([^"']*)["']/gi, (m) => {
      const v = m[2].trim();
      return /^(var\(--[\w-]+(?:\s*,[^)]*)?\)|currentColor|none)$/.test(v) ? null : `${m[1]}="${v}" must be var(--...), currentColor or none`;
    });
  }

  return problems.filter((p) => p.message !== null);
}

/**
 * @param {{skillsRoot?:string,testsDir?:string,only?:string}} [opts]
 */
export async function lintAll({ skillsRoot, testsDir, only } = {}) {
  const root = resolve(skillsRoot ?? join(REPO_ROOT, 'src', 'skills'));
  if (only !== undefined && (typeof only !== 'string' || !only)) throw new TypeError('lintAll: only must be a skill name');
  let names;
  if (only) names = [only];
  else {
    const entries = await readdir(root, { withFileTypes: true });
    names = entries.filter((e) => e.isDirectory() && e.name !== '_template').map((e) => e.name).sort();
  }
  const all = [];
  for (const n of names) {
    const dir = join(root, n);
    try {
      if (!(await stat(dir)).isDirectory()) continue;
    } catch {
      all.push({ file: n, line: 1, code: 'chk-required-files', message: `skill folder ${n} not found` });
      continue;
    }
    all.push(...(await lintSkill(dir, { testsDir })));
  }
  return all;
}

const invokedDirectly = process.argv[1] && resolve(process.argv[1]) === HERE;
if (invokedDirectly) {
  const only = process.argv[2];
  const problems = await lintAll({ only });
  for (const p of problems) console.log(`${p.file}:${p.line} ${p.code} ${p.message}`);
  if (problems.length === 0) console.log('lint-skills: no problems');
  process.exitCode = problems.length === 0 ? 0 : 1;
}
