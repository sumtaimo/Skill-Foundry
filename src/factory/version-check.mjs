#!/usr/bin/env node
/**
 * Release tracking gate: ensures shipped changes never go to master without updating CHANGELOG.md
 * (and skill CHANGELOG.md files), and that adding new ready/default skills bumps package.json.
 * @governed-by PO_ARCHITECT
 */
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = fileURLToPath(import.meta.url);
const REPO_ROOT = resolve(dirname(HERE), '..', '..');

function git(args, cwd) {
  return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function gitShowJson(refPath, cwd) {
  try { return JSON.parse(git(['show', refPath], cwd)); } catch { return null; }
}

function cmpSemver(a, b) {
  const pa = String(a).split('-')[0].split('.').map(Number);
  const pb = String(b).split('-')[0].split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    const d = (pa[i] || 0) - (pb[i] || 0);
    if (d !== 0) return d;
  }
  return 0;
}

/**
 * Checks version & changelog tracking relative to `base` (defaults to `master`).
 * @param {{root?:string, base?:string}} [opts]
 * @returns {{ok:boolean, problems:string[], notes:string[]}}
 */
export function checkVersionTracking({ root = REPO_ROOT, base = 'master' } = {}) {
  const problems = [];
  const notes = [];
  const pkgPath = join(root, 'package.json');
  const chgPath = join(root, 'CHANGELOG.md');
  const regPath = join(root, 'src', 'factory', 'registry.json');

  if (!existsSync(pkgPath) || !existsSync(chgPath) || !existsSync(regPath)) {
    problems.push('missing package.json, CHANGELOG.md, or src/factory/registry.json');
    return { ok: false, problems, notes };
  }

  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  const ver = String(pkg.version || '').trim();
  const chg = readFileSync(chgPath, 'utf8');
  if (!/^\d+\.\d+\.\d+/.test(ver)) problems.push(`package.json version "${ver}" is not semver`);
  else if (!new RegExp(`^## ${ver.replace(/\./g, '\\.')} - \\d{4}-\\d{2}-\\d{2}\\b`, 'm').test(chg)) {
    problems.push(`CHANGELOG.md is missing heading "## ${ver} - YYYY-MM-DD"`);
  }

  // Resolve git base if available.
  let hasBase = false;
  try {
    git(['rev-parse', '--verify', base], root);
    hasBase = true;
  } catch {
    try {
      git(['rev-parse', '--verify', `origin/${base}`], root);
      base = `origin/${base}`;
      hasBase = true;
    } catch { hasBase = false; }
  }
  if (!hasBase) {
    notes.push(`git ref "${base}" unavailable; skipped base diff comparison`);
    return { ok: problems.length === 0, problems, notes };
  }

  const files = new Set();
  for (const args of [['diff', '--name-only', `${base}...HEAD`], ['diff', '--name-only', 'HEAD'], ['ls-files', '--others', '--exclude-standard']]) {
    try {
      for (const l of git(args, root).split(/\r?\n/)) if (l.trim()) files.add(l.trim().replace(/\\/g, '/'));
    } catch { /* ignore outside clean HEAD */ }
  }

  const changedSkills = new Set();
  let shippedChanged = false;
  for (const f of files) {
    const sm = /^src\/skills\/([a-z0-9][a-z0-9-]*)\//.exec(f);
    if (sm && sm[1] !== '_template') {
      changedSkills.add(sm[1]);
      if (sm[1] !== 'skill-smith') shippedChanged = true;
    }
    if (/^src\/factory\/(?:foundry\.mjs|registry\.json)$/.test(f) || /^src\/site\//.test(f)) {
      shippedChanged = true;
    }
  }

  for (const s of [...changedSkills].sort()) {
    if (!files.has(`src/skills/${s}/CHANGELOG.md`)) {
      problems.push(`skill "${s}" changed since ${base} without updating src/skills/${s}/CHANGELOG.md`);
    }
  }

  if (shippedChanged && !files.has('CHANGELOG.md')) {
    problems.push(`shipped code/site/skills changed since ${base} without updating root CHANGELOG.md`);
  }

  const basePkg = gitShowJson(`${base}:package.json`, root);
  if (basePkg?.version && /^\d+\.\d+\.\d+/.test(ver) && cmpSemver(ver, basePkg.version) < 0) {
    problems.push(`package.json version ${ver} is older than ${base} version ${basePkg.version}`);
  }

  const baseReg = gitShowJson(`${base}:src/factory/registry.json`, root);
  const curReg = JSON.parse(readFileSync(regPath, 'utf8'));
  if (Array.isArray(baseReg)) {
    const baseReady = new Map(baseReg.filter((r) => r.status === 'ready').map((r) => [r.name, r]));
    const addedReady = curReg.filter((r) => r.status === 'ready' && !baseReady.has(r.name)).map((r) => r.name);
    const addedDefault = curReg.filter((r) => r.status === 'ready' && r.default === true && baseReady.get(r.name)?.default !== true).map((r) => r.name);
    if ((addedReady.length || addedDefault.length) && basePkg?.version === ver) {
      const what = [...(addedReady.length ? [`ready skill(s): ${addedReady.join(', ')}`] : []), ...(addedDefault.length ? [`default skill(s): ${addedDefault.join(', ')}`] : [])].join('; ');
      problems.push(`new ${what} added since ${base} — bump package.json version above ${ver} and add its CHANGELOG.md heading`);
    }
  }

  return { ok: problems.length === 0, problems, notes };
}

if (process.argv[1] && resolve(process.argv[1]) === HERE) {
  const i = process.argv.indexOf('--base');
  const base = i > 0 && process.argv[i + 1] ? process.argv[i + 1] : 'master';
  const r = checkVersionTracking({ base });
  if (r.ok) {
    console.log(`version-check: ok${r.notes.length ? ` (${r.notes.join('; ')})` : ''}`);
  } else {
    for (const p of r.problems) console.error(`FAIL version-check: ${p}`);
    process.exitCode = 1;
  }
}
