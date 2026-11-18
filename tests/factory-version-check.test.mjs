/**
 * Release version and changelog tracking checks against base branch.
 * @governed-by PO_ARCHITECT
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { checkVersionTracking } from '../src/factory/version-check.mjs';

function git(args, cwd) {
  return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

function setupRepo() {
  const dir = mkdtempSync(join(tmpdir(), 'sf-vercheck-'));
  git(['init', '-b', 'master'], dir);
  git(['config', 'user.email', 'test@example.com'], dir);
  git(['config', 'user.name', 'Test'], dir);
  mkdirSync(join(dir, 'src', 'factory'), { recursive: true });
  mkdirSync(join(dir, 'src', 'skills', 'demo'), { recursive: true });
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'skill-foundry', version: '1.0.0' }, null, 2));
  writeFileSync(join(dir, 'CHANGELOG.md'), '# Changelog\n\n## 1.0.0 - 2026-11-18\n\n- Initial\n');
  writeFileSync(join(dir, 'src', 'factory', 'registry.json'), JSON.stringify([{ name: 'demo', version: '1.0.0', status: 'ready', default: true }]));
  writeFileSync(join(dir, 'src', 'factory', 'foundry.mjs'), '// cli\n');
  writeFileSync(join(dir, 'src', 'skills', 'demo', 'SKILL.md'), '# demo\n');
  writeFileSync(join(dir, 'src', 'skills', 'demo', 'CHANGELOG.md'), '# Changelog\n\n## 1.0.0 - 2026-11-18\n\n- Initial\n');
  git(['add', '-A'], dir);
  git(['commit', '-m', 'init'], dir);
  git(['checkout', '-b', 'lab'], dir);
  return dir;
}

test('version-check passes when nothing shipped changed', () => {
  const dir = setupRepo();
  try {
    assert.deepEqual(checkVersionTracking({ root: dir }).problems, []);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('version-check fails when a skill is modified without its CHANGELOG.md or root CHANGELOG.md', () => {
  const dir = setupRepo();
  try {
    writeFileSync(join(dir, 'src', 'skills', 'demo', 'SKILL.md'), '# demo v2\n');
    const r = checkVersionTracking({ root: dir });
    assert.equal(r.ok, false);
    assert.ok(r.problems.some((p) => p.includes('src/skills/demo/CHANGELOG.md')));
    assert.ok(r.problems.some((p) => p.includes('root CHANGELOG.md')));

    writeFileSync(join(dir, 'src', 'skills', 'demo', 'CHANGELOG.md'), '# Changelog\n\n## 1.0.0 - 2026-11-18\n\n- Update copy\n');
    writeFileSync(join(dir, 'CHANGELOG.md'), '# Changelog\n\n## 1.0.0 - 2026-11-18\n\n- Initial\n- Update demo\n');
    assert.equal(checkVersionTracking({ root: dir }).ok, true);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('version-check requires package.json bump when adding a new ready or default skill', () => {
  const dir = setupRepo();
  try {
    writeFileSync(join(dir, 'src', 'factory', 'registry.json'), JSON.stringify([
      { name: 'demo', version: '1.0.0', status: 'ready', default: true },
      { name: 'extra', version: '1.0.0', status: 'ready', default: true },
    ]));
    writeFileSync(join(dir, 'CHANGELOG.md'), '# Changelog\n\n## 1.0.0 - 2026-11-18\n\n- Add extra\n');
    const r = checkVersionTracking({ root: dir });
    assert.equal(r.ok, false);
    assert.ok(r.problems.some((p) => p.includes('bump package.json version')));

    writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'skill-foundry', version: '1.1.0' }, null, 2));
    writeFileSync(join(dir, 'CHANGELOG.md'), '# Changelog\n\n## 1.1.0 - 2026-11-18\n\n- Add extra default skill\n');
    assert.equal(checkVersionTracking({ root: dir }).ok, true);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
