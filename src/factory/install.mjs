/**
 * Installs a registered skill into <projectRoot>/.claude/skills/<name>.
 * CLI: node src/factory/install.mjs <name> [--force]
 * @governed-by PO_ARCHITECT
 */
import { readFile, cp, stat, rm, readdir } from 'node:fs/promises';
import { join, resolve, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = fileURLToPath(import.meta.url);
const REPO_ROOT = resolve(dirname(HERE), '..', '..');

async function exists(p) {
  try { await stat(p); return true; } catch { return false; }
}

async function listRel(dir, base = dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await listRel(p, base)));
    else out.push(relative(base, p).split(sep).join('/'));
  }
  return out.sort();
}

/**
 * @param {string} name
 * @param {{projectRoot?:string,skillsRoot?:string,registryPath?:string,force?:boolean}} [opts]
 * @returns {Promise<string[]>} copied paths relative to the target folder
 */
export async function installSkill(name, { projectRoot, skillsRoot, registryPath, force = false } = {}) {
  if (typeof name !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(name)) throw new TypeError(`installSkill: invalid skill name ${name}`);
  const regPath = resolve(registryPath ?? join(REPO_ROOT, 'src', 'factory', 'registry.json'));
  const registry = JSON.parse(await readFile(regPath, 'utf8'));
  if (!Array.isArray(registry) || !registry.some((r) => r && r.name === name)) {
    throw new Error(`skill ${name} is not in registry`);
  }
  const src = join(resolve(skillsRoot ?? join(REPO_ROOT, 'src', 'skills')), name);
  if (!(await exists(src))) throw new Error(`skill source ${src} not found`);
  const target = join(resolve(projectRoot ?? process.cwd()), '.claude', 'skills', name);
  if (await exists(target)) {
    if (!force) throw new Error(`target ${target} already exists (use --force)`);
    await rm(target, { recursive: true, force: true });
  }
  await cp(src, target, { recursive: true });
  return listRel(target);
}

if (process.argv[1] && resolve(process.argv[1]) === HERE) {
  const args = process.argv.slice(2);
  const name = args.find((a) => !a.startsWith('--'));
  try {
    if (!name) throw new Error('usage: install.mjs <name> [--force]');
    const files = await installSkill(name, { force: args.includes('--force') });
    console.log(`installed ${name} (${files.length} files) into .claude/skills/${name}/; restart Claude Code`);
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
  }
}
