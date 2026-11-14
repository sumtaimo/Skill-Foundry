/**
 * Recipes: skills working together. Every recipe in src/factory/recipes.json needs a passing, current recording made by
 * a real agent in an empty project (src/factory/recipe-run.mjs --record), and the site shows that answer word for word.
 * @governed-by PO_ARCHITECT
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadRecipes, checkRecipe, skillsUsed, recipeHash } from '../src/factory/recipe-run.mjs';
import { buildSite } from '../src/site/build.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const registry = JSON.parse(readFileSync(join(ROOT, 'src', 'factory', 'registry.json'), 'utf8'));
const ready = new Set(registry.filter((r) => r.status === 'ready').map((r) => r.name));

for (const r of loadRecipes(ROOT)) {
  test(`recipe ${r.id}: only ready skills, and a passing recording that matches the recipe and its skills`, () => {
    for (const s of r.skills) assert.ok(ready.has(s), `${s} is not a ready skill`);
    const c = checkRecipe(r, ROOT);
    assert.deepEqual(c.problems, [], `${r.id}: ${c.problems.join('; ')}`);
    assert.deepEqual([...c.rec.used].sort(), [...r.skills].sort(), 'the agent used every skill of the recipe');
  });
}

test('the collection page shows each recorded recipe with the real answer, word for word', async () => {
  const out = mkdtempSync(join(tmpdir(), 'sf-recipe-'));
  await buildSite({ root: ROOT, out });
  const html = readFileSync(join(out, 'index.html'), 'utf8');
  const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  for (const r of loadRecipes(ROOT)) {
    const rec = checkRecipe(r, ROOT).rec;
    const block = new RegExp(`<article class="recipe" data-recipe="${r.id}">[\\s\\S]*?</article>`).exec(html)?.[0] ?? '';
    assert.ok(block.includes(`<pre class="proof-answer" lang="en">${esc(rec.answer)}</pre>`), `${r.id}: answer not shown word for word`);
    for (const s of rec.used) assert.ok(block.includes(`href="skills/${s}/index.html"`), `${r.id}: ${s} not linked in the chain`);
    assert.match(block, /data-kind="proof"/);
  }
});

test('skillsUsed keeps the order in which the agent first opened each skill', () => {
  const tools = [
    { name: 'Read', input: '{"file_path":"/p/.claude/skills/copy-tight/SKILL.md"}' },
    { name: 'Skill', input: '{"skill":"test-planner"}' },
    { name: 'Read', input: '{"file_path":"/p/.claude/skills/copy-tight/layers/04-flow.md"}' },
  ];
  assert.deepEqual(skillsUsed(tools, ['test-planner', 'copy-tight', 'changelog-writer']), ['copy-tight', 'test-planner']);
});

test('a recording goes stale when the prompt or a skill in the recipe changes', () => {
  const [r] = loadRecipes(ROOT);
  const h = recipeHash(r, ROOT);
  assert.notEqual(recipeHash({ ...r, prompt: `${r.prompt} ` }, ROOT), h);
  assert.notEqual(recipeHash({ ...r, skills: r.skills.slice(0, 2) }, ROOT), h);
  assert.match(checkRecipe({ ...r, prompt: 'changed' }, ROOT).problems.join(), /stale/);
});
