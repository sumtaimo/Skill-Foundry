/**
 * Loads ready skills from the factory registry and skill folders for the showcase site.
 * @governed-by PO_ARCHITECT
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { sanitizeSvg } from './svg.mjs';
import { scoreLive } from '../../factory/live-evals.mjs';

/** Agent roles a skill may declare; they match .harness/roles/. */
export const ROLES = ['PO_ARCHITECT', 'BA_ANALYST', 'DEV_ENGINEER', 'QA_AUDITOR'];

/** Real-agent eval result from evals/live/ recordings; null when the skill has none. */
function liveResult(dir) {
  if (!existsSync(join(dir, 'evals', 'live'))) return null;
  const s = scoreLive(dir);
  return { passed: s.passed, total: s.passed + s.failed };
}

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
    if (m) steps.push(m[1].trim());
    else if (steps.length && /^\s{2,}\S/.test(l)) steps[steps.length - 1] += ' ' + l.trim();
  }
  return steps;
}

/**
 * @param {string} root repo root
 * @param {{registryPath?:string, skillsRoot?:string}} [opts]
 */
export function loadSkills(root, opts = {}) {
  if (typeof root !== 'string' || !root) throw new TypeError('loadSkills: root must be a non-empty string');
  if (opts === null || typeof opts !== 'object') throw new TypeError('loadSkills: opts must be an object');
  const registryPath = resolve(opts.registryPath ?? join(root, 'src', 'factory', 'registry.json'));
  const skillsRoot = resolve(opts.skillsRoot ?? join(root, 'src', 'skills'));
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
      const roles = Array.isArray(r.roles) ? r.roles.map(String) : [];
      for (const role of roles) if (!ROLES.includes(role)) throw new Error(`loadSkills: ${r.name} has unknown role ${role}`);
      const md = read('SKILL.md');
      return {
        name: r.name,
        roles,
        description: (/^description:\s*(.*)$/m.exec(md)?.[1] ?? '').trim(),
        live: liveResult(dir),
        version: String(r.version),
        status: r.status,
        title: String(preview.title ?? r.name),
        tagline: String(preview.tagline ?? ''),
        prompt: String(preview.prompt ?? ''),
        outputs: Array.isArray(preview.outputs) ? preview.outputs.map(String) : [],
        tags: Array.isArray(preview.tags) ? preview.tags.map(String) : [],
        coverSvg: sanitizeSvg(read('preview/cover.svg')),
        procedure: parseProcedure(md),
        rules: { total: rules.length, machine, checklist },
        changelog: existsSync(join(dir, 'CHANGELOG.md')) ? read('CHANGELOG.md').replace(/\r\n?/g, '\n') : '',
        files: listFiles(dir).sort(),
        example: existsSync(join(dir, 'preview', 'example.html')),
        zipBytes: 0, // size of the packed zip; buildSite fills it after packAll
      };
    })
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
}
