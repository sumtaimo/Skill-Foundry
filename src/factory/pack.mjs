/**
 * Packs skill folders into deterministic zips with sha256 checksums.
 * CLI: node src/factory/pack.mjs <skill> | --all [--out dir]
 * @governed-by PO_ARCHITECT
 */
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { join, resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { makeZip } from './zip.mjs';

const HERE = fileURLToPath(import.meta.url);
const REPO_ROOT = resolve(dirname(HERE), '..', '..');
const EXCLUDE = new Set(['.DS_Store', 'Thumbs.db', 'node_modules', '.git']);

async function collect(dir, prefix) {
  const out = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if (EXCLUDE.has(e.name)) continue;
    const p = join(dir, e.name);
    const rel = `${prefix}/${e.name}`;
    // Evals (cases and recordings) are the lab's tests, not shipped: they would only lead a user's agent to read test data.
    if (/^[^/]+\/evals$/.test(rel)) continue;
    if (e.isDirectory()) out.push(...(await collect(p, rel)));
    else if (e.isFile()) out.push({ path: rel, data: await readFile(p) });
  }
  return out;
}

async function readVersion(skillDir) {
  const text = await readFile(join(skillDir, 'SKILL.md'), 'utf8');
  const m = /^version:\s*["']?([^"'\s]+)/m.exec(text);
  if (!m) throw new Error(`pack: no version in ${join(skillDir, 'SKILL.md')}`);
  return m[1];
}

function installText(name) {
  return [
    `Install ${name}`,
    '',
    `1. Copy the ${name}/ folder into your project at .claude/skills/${name}/`,
    '2. Restart Claude Code so it loads the skill.',
    '',
  ].join('\n');
}

async function skillEntries(skillDir) {
  const name = basename(resolve(skillDir));
  const entries = await collect(resolve(skillDir), name);
  entries.push({ path: `${name}/INSTALL.txt`, data: Buffer.from(installText(name), 'utf8') });
  return { name, entries };
}

const sha = (buf) => createHash('sha256').update(buf).digest('hex');

/**
 * @param {string} skillDir
 * @param {string} outDir
 * @returns {Promise<{file:string,sha256:string,bytes:number}>}
 */
export async function packSkill(skillDir, outDir) {
  if (typeof skillDir !== 'string' || !skillDir) throw new TypeError('packSkill: skillDir required');
  if (typeof outDir !== 'string' || !outDir) throw new TypeError('packSkill: outDir required');
  const { name, entries } = await skillEntries(skillDir);
  const version = await readVersion(resolve(skillDir));
  const buf = makeZip(entries);
  await mkdir(outDir, { recursive: true });
  const file = join(resolve(outDir), `${name}-${version}.zip`);
  await writeFile(file, buf);
  return { file, sha256: sha(buf), bytes: buf.length };
}

/**
 * @param {{skillsRoot?:string,outDir?:string}} [opts]
 * @returns {Promise<Record<string,{sha256:string,bytes:number}>>}
 */
export async function packAll({ skillsRoot, outDir, ready } = {}) {
  const root = resolve(skillsRoot ?? join(REPO_ROOT, 'src', 'skills'));
  const out = resolve(outDir ?? join(REPO_ROOT, 'dist'));
  const readySet = Array.isArray(ready) ? new Set(ready) : null;
  const names = (await readdir(root, { withFileTypes: true }))
    .filter((e) => e.isDirectory() && e.name !== '_template' && !EXCLUDE.has(e.name) && (!readySet || readySet.has(e.name)))
    .map((e) => e.name)
    .sort();
  const checksums = {};
  const allEntries = [];
  for (const n of names) {
    const r = await packSkill(join(root, n), out);
    checksums[basename(r.file)] = { sha256: r.sha256, bytes: r.bytes };
    allEntries.push(...(await skillEntries(join(root, n))).entries);
  }
  const allBuf = makeZip(allEntries);
  await writeFile(join(out, 'all-skills.zip'), allBuf);
  checksums['all-skills.zip'] = { sha256: sha(allBuf), bytes: allBuf.length };
  await writeFile(join(out, 'checksums.json'), JSON.stringify(checksums, null, 2) + '\n');
  return checksums;
}

if (process.argv[1] && resolve(process.argv[1]) === HERE) {
  const args = process.argv.slice(2);
  const oi = args.indexOf('--out');
  if (oi >= 0 && (!args[oi + 1] || args[oi + 1].startsWith('--'))) { console.error('--out requires a directory'); process.exitCode = 1; }
  else {
    const outDir = oi >= 0 ? args[oi + 1] : join(REPO_ROOT, 'dist');
    try {
      if (args.includes('--all')) console.log(JSON.stringify(await packAll({ outDir }), null, 2));
      else {
        const name = args.find((a, i) => !a.startsWith('--') && (oi < 0 || i !== oi + 1));
        if (!name) throw new Error('usage: pack.mjs <skill> | --all [--out dir]');
        const r = await packSkill(join(REPO_ROOT, 'src', 'skills', name), outDir);
        console.log(`${r.file} ${r.sha256} ${r.bytes}`);
      }
    } catch (err) {
      console.error(err.message);
      process.exitCode = 1;
    }
  }
}
