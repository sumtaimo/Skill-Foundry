/**
 * Tests for src/factory/lint-skills.mjs.
 * @governed-by PO_ARCHITECT
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lintSkill } from '../src/factory/lint-skills.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TESTS = path.join(ROOT, 'tests');
const SMITH = path.join(ROOT, 'src', 'skills', 'skill-smith');

for (const name of ['_template', 'skill-smith', 'figure-craft']) {
  test(`lintSkill passes on ${name}`, async () => {
    const problems = await lintSkill(path.join(ROOT, 'src', 'skills', name), { testsDir: TESTS });
    assert.deepEqual(problems, []);
  });
}

async function copy(folderName = 'skill-smith') {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'lint-'));
  const dir = path.join(root, folderName);
  await fs.cp(SMITH, dir, { recursive: true });
  return { root, dir };
}
const edit = async (f, fn) => fs.writeFile(f, fn(await fs.readFile(f, 'utf8')));

const cases = [
  ['chk-required-files', async (d) => fs.rm(path.join(d, 'CHANGELOG.md'))],
  ['chk-frontmatter', async (d) => edit(path.join(d, 'SKILL.md'), (s) => s.replace(/^version:.*\r?\n/m, ''))],
  ['chk-name-match', null, 'other-name'],
  ['chk-size', async (d) => edit(path.join(d, 'SKILL.md'), (s) => s + '\nfiller\n'.repeat(160))],
  ['chk-rules-mapped', async (d) => edit(path.join(d, 'RULES.json'), (s) => {
    const r = JSON.parse(s); r.push({ id: 'R-skill-smith-999', text: 'no check' }); return JSON.stringify(r);
  })],
  ['chk-check-tested', 'emptyTests'],
  ['chk-links', async (d) => edit(path.join(d, 'SKILL.md'), (s) => s + '\nSee [missing](./references/does-not-exist.md)\n')],
  ['chk-preview-json', async (d) => edit(path.join(d, 'preview.json'), (s) => {
    const p = JSON.parse(s); p.tagline = 'x'.repeat(91); p.tags = ['a', 'b', 'c', 'd', 'e', 'f']; return JSON.stringify(p);
  })],
  ['chk-layers', async (d) => fs.rm(path.join(d, 'layers', '06-states.md'))],
  ['chk-layers', async (d) => fs.writeFile(path.join(d, 'layers', '04-flow.md'), '# Layer 04\n\nNo steps here.\n')],
  ['chk-layers', async (d) => edit(path.join(d, 'SKILL.md'), (s) => s.replace('(layers/09-handoff.md)', '(layers/10-evidence.md)'))],
  ['chk-portable', async (d) => edit(path.join(d, 'SKILL.md'), (s) => s.replace(/^scope: factory\r?\n/m, ''))],
  ['chk-cover-svg', async (d) => edit(path.join(d, 'preview', 'cover.svg'), (s) =>
    s.replace(/<\/svg>\s*$/, '<script>alert(1)</script><a href="https://evil.example"><rect fill="#ff0000"/></a></svg>'))],
];

for (const [code, mutate, folder] of cases) {
  test(`lintSkill reports ${code}`, async () => {
    const { root, dir } = await copy(folder);
    let testsDir = TESTS;
    try {
      if (mutate === 'emptyTests') {
        testsDir = path.join(root, 'empty-tests');
        await fs.mkdir(testsDir);
        await fs.writeFile(path.join(testsDir, 'x.test.mjs'), '// nothing\n');
      } else if (mutate) await mutate(dir);
      const problems = await lintSkill(dir, { testsDir });
      assert.ok(problems.some((p) => p.code === code), `expected ${code}, got ${JSON.stringify(problems)}`);
    } finally { await fs.rm(root, { recursive: true, force: true }); }
  });
}

test('chk-portable allows user-project docs/foundation/* and docs/ux/* paths while still rejecting Skill Foundry docs/factory/*', async () => {
  const { root, dir } = await copy('portable-doc-check');
  try {
    await edit(path.join(dir, 'SKILL.md'), (s) => s.replace(/^scope: factory\r?\n/m, '').replace(/docs\/factory\/\S+|src\/\S+|tests\/\S+/g, 'design/tokens.css') + '\nRead `docs/foundation/product.md` and write `docs/ux/flow.md`.\n');
    for (const f of await fs.readdir(path.join(dir, 'layers'))) {
      await edit(path.join(dir, 'layers', f), (s) => s.replace(/(?:src|docs|tests)\/[\w./-]+/g, 'docs/foundation/domain.md'));
    }
    for (const f of await fs.readdir(path.join(dir, 'references'))) {
      await edit(path.join(dir, 'references', f), (s) => s.replace(/(?:src|docs|tests)\/[\w./-]+/g, 'docs/ux/screen.md'));
    }
    const clean = await lintSkill(dir, { testsDir: TESTS });
    assert.deepEqual(clean.filter((p) => p.code === 'chk-portable'), []);
    await edit(path.join(dir, 'SKILL.md'), (s) => s + '\nSee `docs/factory/STANDARD.md`.\n');
    const bad = await lintSkill(dir, { testsDir: TESTS });
    assert.ok(bad.some((p) => p.code === 'chk-portable' && p.message.includes('docs/factory/STANDARD.md')));
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});
