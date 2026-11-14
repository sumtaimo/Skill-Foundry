/**
 * What `npx github:sumtaimo/Skill-Foundry` downloads: only what users need, nothing that belongs to the lab.
 * @governed-by PO_ARCHITECT
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('the package ships every portable ready skill and nothing from the lab', () => {
  const out = execFileSync('npm', ['pack', '--dry-run', '--json'], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], shell: process.platform === 'win32' });
  const files = JSON.parse(out)[0].files.map((f) => f.path);
  for (const f of files) {
    assert.doesNotMatch(f, /^(runs|docs|tests|test|\.harness|\.claude|\.github|dist)\//, `${f} is lab-only`);
    assert.doesNotMatch(f, /\/evals\//, `${f} is a lab test (eval prompt or recording)`);
    assert.doesNotMatch(f, /^src\/skills\/(skill-smith|_template)\//, `${f} only works inside this repository`);
  }
  const reg = JSON.parse(readFileSync(join(ROOT, 'src', 'factory', 'registry.json'), 'utf8'));
  for (const r of reg.filter((x) => x.status === 'ready')) {
    const factory = /^scope:\s*factory/m.test(readFileSync(join(ROOT, 'src', 'skills', r.name, 'SKILL.md'), 'utf8'));
    assert.equal(files.includes(`src/skills/${r.name}/SKILL.md`), !factory, `${r.name}: shipped must equal "works outside the repo"`);
  }
  assert.ok(files.includes('src/factory/foundry.mjs') && files.includes('src/factory/registry.json'));
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
  assert.ok(readFileSync(join(ROOT, 'CHANGELOG.md'), 'utf8').includes(`## ${pkg.version} - `), 'the package version has a CHANGELOG entry');
});
