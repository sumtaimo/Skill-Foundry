/**
 * Recipes: one request that needs several skills working together. A recipe run installs all of its skills into one
 * empty project outside this repository and has a real agent answer the request; the recording says which skills the
 * agent used and in which order, and keeps its answer word for word.
 * CLI: node src/factory/recipe-run.mjs <recipe-id> [--record] [--engine claude]
 *   --record: save src/factory/recipes/<id>.json; tests/factory-recipes.test.mjs requires a passing, current one per recipe.
 * Recipes are listed in src/factory/recipes.json. It costs tokens.
 * @governed-by PO_ARCHITECT
 */
import { readFileSync, writeFileSync, mkdtempSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { installSkill } from './install.mjs';
import { parseStream, behaviourHash, REPO_MARKERS } from './portable-check.mjs';

const HERE = fileURLToPath(import.meta.url);
const REPO_ROOT = resolve(dirname(HERE), '..', '..');

/** @param {string} [root] */
export function loadRecipes(root = REPO_ROOT) {
  const p = join(root, 'src', 'factory', 'recipes.json');
  if (!existsSync(p)) return [];
  const list = JSON.parse(readFileSync(p, 'utf8'));
  if (!Array.isArray(list)) throw new Error('recipes.json must be an array');
  for (const r of list) {
    if (!r || !/^[a-z0-9][a-z0-9-]*$/.test(r.id ?? '')) throw new Error(`recipe id ${r?.id} is not valid`);
    if (!Array.isArray(r.skills) || r.skills.length < 2) throw new Error(`recipe ${r.id} needs at least two skills`);
    if (typeof r.prompt !== 'string' || !r.prompt.trim()) throw new Error(`recipe ${r.id} needs a prompt`);
  }
  return list;
}

/**
 * The skills the agent used, in the order it first opened each one.
 * @param {{name:string,input:string}[]} tools @param {string[]} names
 */
export function skillsUsed(tools, names) {
  const order = [];
  for (const t of tools) {
    for (const n of names) {
      const hit = (t.name === 'Skill' && t.input.includes(`"${n}"`)) || t.input.includes(`.claude/skills/${n}/`);
      if (hit && !order.includes(n)) order.push(n);
    }
  }
  return order;
}

/** One hash for the recipe: its prompt and the behaviour of every skill in it. */
export function recipeHash(recipe, root = REPO_ROOT) {
  const h = createHash('sha256').update(recipe.prompt);
  for (const s of [...recipe.skills].sort()) h.update(s).update(behaviourHash(join(root, 'src', 'skills', s)));
  return h.digest('hex');
}

/**
 * Is there a passing recording that matches the recipe and its skills as they are now?
 * @returns {{ok:boolean, problems:string[], rec:object|null}}
 */
export function checkRecipe(recipe, root = REPO_ROOT) {
  const p = join(root, 'src', 'factory', 'recipes', `${recipe.id}.json`);
  if (!existsSync(p)) return { ok: false, problems: [`no recording (run: node src/factory/recipe-run.mjs ${recipe.id} --record)`], rec: null };
  const rec = JSON.parse(readFileSync(p, 'utf8'));
  const problems = [];
  const missing = recipe.skills.filter((s) => !(rec.used ?? []).includes(s));
  if (missing.length) problems.push(`the agent did not use: ${missing.join(', ')}`);
  if (rec.leakedRepoRules) problems.push("this repository's rules leaked into the answer");
  if ((rec.touchedRepo ?? []).length) problems.push('the agent touched this repository');
  if (rec.exit !== 0) problems.push(`the agent run exited with ${rec.exit}`);
  if (typeof rec.answer !== 'string' || !rec.answer.trim()) problems.push('no answer');
  if (rec.prompt !== recipe.prompt) problems.push('stale: the recipe prompt changed');
  else if (rec.hash !== recipeHash(recipe, root)) problems.push('stale: a skill in the recipe changed, record it again');
  return { ok: problems.length === 0, problems, rec };
}

/** Install every skill of the recipe into one empty project and have a real agent answer the request. */
export async function runRecipe(recipe, { engine = 'claude', timeoutMs = 900000 } = {}) {
  const dir = mkdtempSync(join(tmpdir(), `recipe-${recipe.id}-`));
  for (const s of recipe.skills) await installSkill(s, { projectRoot: dir, force: true });
  const r = spawnSync(engine, ['-p', '--output-format', 'stream-json', '--verbose', '--allowedTools', 'Read', 'Write', 'Edit', 'Glob', 'Grep', 'Skill', 'Bash(node:*)', 'Bash(ls:*)'],
    { cwd: dir, input: recipe.prompt, encoding: 'utf8', timeout: timeoutMs, maxBuffer: 1 << 28 });
  if (r.error) throw r.error;
  const s = parseStream(r.stdout, recipe.skills[0]);
  return { id: recipe.id, prompt: recipe.prompt, project: dir, exit: r.status, used: skillsUsed(s.tools, recipe.skills), leakedRepoRules: REPO_MARKERS.test(s.final), touchedRepo: s.touchedRepo, cost: s.cost, answer: s.final };
}

if (process.argv[1] && resolve(process.argv[1]) === HERE) {
  const a = process.argv.slice(2);
  const id = a.find((x) => !x.startsWith('--'));
  const i = a.indexOf('--engine');
  try {
    const recipe = loadRecipes().find((r) => r.id === id);
    if (!recipe) throw new Error(`usage: recipe-run.mjs <recipe-id> [--record]; ids: ${loadRecipes().map((r) => r.id).join(', ')}`);
    const r = await runRecipe(recipe, { engine: i >= 0 ? a[i + 1] : 'claude' });
    if (a.includes('--record')) {
      const rec = { id: r.id, title: recipe.title, prompt: r.prompt, recordedAt: new Date().toISOString().slice(0, 10), agent: `${i >= 0 ? a[i + 1] : 'claude'} -p in an empty project outside the repository, with ${recipe.skills.join(', ')} installed`, hash: recipeHash(recipe), exit: r.exit, used: r.used, leakedRepoRules: r.leakedRepoRules, touchedRepo: r.touchedRepo, cost: r.cost, answer: r.answer.slice(0, 12000) };
      writeFileSync(join(REPO_ROOT, 'src', 'factory', 'recipes', `${r.id}.json`), JSON.stringify(rec, null, 2) + '\n');
      console.log(`recorded src/factory/recipes/${r.id}.json`);
    }
    const { answer, ...rest } = r;
    console.log(JSON.stringify(rest, null, 2));
    console.log('\nANSWER:\n' + answer);
    process.exit(checkRecipe(recipe).ok || !a.includes('--record') ? 0 : 1);
  } catch (e) { console.error(e.message); process.exit(2); }
}
