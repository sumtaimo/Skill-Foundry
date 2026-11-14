/**
 * Loads ready skills from the factory registry and skill folders for the showcase site.
 * @governed-by PO_ARCHITECT
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { sanitizeSvg } from './svg.mjs';

const EXCLUDE = new Set(['.DS_Store', 'Thumbs.db', 'node_modules', '.git']);

function listFiles(dir, prefix = '') {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (EXCLUDE.has(e.name)) continue;
    const rel = prefix ? `${prefix}/${e.name}` : e.name;
    if (e.isDirectory()) out.push(...listFiles(join(dir, e.name), rel));
    else if (e.isFile()) out.push(rel);
  }
  return out;
}

/**
 * The newest recorded real run of a skill at this version that passed its checks, or null.
 * Runs are written by src/factory/run-skill.mjs. Only real, passing, current-version output is shown.
 * @param {string} runsRoot @param {string} name @param {string} version @param {string} [caseId] only runs of this eval case
 */
export function latestRun(runsRoot, name, version, caseId) {
  const dir = join(runsRoot, name);
  if (!existsSync(dir)) return null;
  const runs = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const mp = join(dir, e.name, 'manifest.json');
    if (!e.isDirectory() || !existsSync(mp)) continue;
    const m = JSON.parse(readFileSync(mp, 'utf8'));
    if (m.status !== 'pass' || String(m.version) !== String(version) || !Array.isArray(m.files)) continue;
    if (caseId && m.caseId !== caseId) continue; // the registry pins the one case this skill showcases
    runs.push({ m, runDir: join(dir, e.name) });
  }
  runs.sort((a, b) => (a.m.finishedAt < b.m.finishedAt ? 1 : a.m.finishedAt > b.m.finishedAt ? -1 : 0));
  for (const { m, runDir } of runs) {
    const html = m.files.map((f) => f.path).find((f) => f.endsWith('.html'));
    const svgFile = m.files.map((f) => f.path).find((f) => f.endsWith('.svg'));
    if (!html) continue;
    let svg = null;
    if (svgFile) { try { svg = sanitizeSvg(readFileSync(join(runDir, 'output', svgFile), 'utf8')); } catch { svg = null; } }
    const inputPath = join(runDir, 'input.md');
    return {
      key: String(m.key).slice(0, 8),
      input: existsSync(inputPath) ? readFileSync(inputPath, 'utf8').trim().replace(/\s+/g, ' ') : '',
      htmlPath: join(runDir, 'output', html),
      svg,
      files: m.files.map((f) => f.path).sort(),
    };
  }
  return null;
}

/** @param {string} md */
export function parseProcedure(md) {
  const lines = md.replace(/\r\n?/g, '\n').split('\n');
  const start = lines.findIndex((l) => /^##\s+Procedure\s*$/.test(l));
  if (start < 0) return [];
  const steps = [];
  for (let i = start + 1; i < lines.length; i++) {
    const l = lines[i];
    if (/^#{1,2}\s/.test(l)) break;
    const m = /^\s*\d+\.\s+(.*)$/.exec(l);
    if (m) steps.push(m[1].replace(/\s*\[[^\]]*\]\([^)]*\)/g, '').trim()); // layer links are for agents, not the site
    else if (steps.length && /^\s{2,}\S/.test(l)) steps[steps.length - 1] += ' ' + l.trim();
  }
  return steps;
}

/**
 * @param {string} root repo root
 * @param {{registryPath?:string, skillsRoot?:string, runsRoot?:string}} [opts]
 */
export function loadSkills(root, opts = {}) {
  if (typeof root !== 'string' || !root) throw new TypeError('loadSkills: root must be a non-empty string');
  if (opts === null || typeof opts !== 'object') throw new TypeError('loadSkills: opts must be an object');
  const registryPath = resolve(opts.registryPath ?? join(root, 'src', 'factory', 'registry.json'));
  const skillsRoot = resolve(opts.skillsRoot ?? join(root, 'src', 'skills'));
  const runsRoot = resolve(opts.runsRoot ?? join(root, 'runs'));
  const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
  if (!Array.isArray(registry)) throw new Error('loadSkills: registry must be an array');
  return registry
    .filter((r) => r && r.status === 'ready')
    .map((r) => {
      if (typeof r.name !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(r.name)) throw new Error(`loadSkills: bad name ${r.name}`);
      const dir = join(skillsRoot, r.name);
      const read = (f) => readFileSync(join(dir, f), 'utf8');
      const preview = JSON.parse(read('preview.json'));
      const rules = JSON.parse(read('RULES.json'));
      if (!Array.isArray(rules)) throw new Error(`loadSkills: RULES.json of ${r.name} must be an array`);
      const machine = rules.filter((x) => x && x.check).length;
      const checklist = rules.filter((x) => x && x.checklist && !x.check).length;
      const run = latestRun(runsRoot, r.name, String(r.version), typeof r.showcase === 'string' ? r.showcase : undefined);
      const previewExample = join(dir, 'preview', 'example.html');
      return {
        name: r.name,
        version: String(r.version),
        status: r.status,
        title: String(preview.title ?? r.name),
        tagline: String(preview.tagline ?? ''),
        prompt: run?.input || String(preview.prompt ?? ''),
        outputs: Array.isArray(preview.outputs) ? preview.outputs.map(String) : [],
        tags: Array.isArray(preview.tags) ? preview.tags.map(String) : [],
        coverSvg: run?.svg ?? sanitizeSvg(read('preview/cover.svg')),
        procedure: parseProcedure(read('SKILL.md')),
        rules: { total: rules.length, machine, checklist },
        changelog: existsSync(join(dir, 'CHANGELOG.md')) ? read('CHANGELOG.md').replace(/\r\n?/g, '\n') : '',
        files: listFiles(dir).sort(),
        example: !!run || existsSync(previewExample),
        exampleSrc: run ? run.htmlPath : existsSync(previewExample) ? previewExample : null,
        run: run ? { key: run.key, files: run.files } : null, // a recorded real run; null means the cover and example are the skill's own demo
        zipBytes: 0, // size of the packed zip; buildSite fills it after packAll
      };
    })
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
}
