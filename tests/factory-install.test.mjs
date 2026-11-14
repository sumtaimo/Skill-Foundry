/**
 * Tests for src/factory/install.mjs.
 * @governed-by PO_ARCHITECT
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { installSkill } from '../src/factory/install.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SMITH = path.join(ROOT, 'src', 'skills', 'skill-smith');

test('installSkill copies, rejects unknown and existing, honours force', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'install-'));
  try {
    const skillsRoot = path.join(root, 'skills');
    const projectRoot = path.join(root, 'project');
    await fs.cp(SMITH, path.join(skillsRoot, 'skill-smith'), { recursive: true });
    await fs.mkdir(projectRoot);
    const registryPath = path.join(root, 'registry.json');
    await fs.writeFile(registryPath, JSON.stringify([
      { name: 'skill-smith', version: '1.0.0', purpose: 'test', status: 'ready' },
    ]));
    const opts = { projectRoot, skillsRoot, registryPath };

    const copied = await installSkill('skill-smith', opts);
    assert.ok(Array.isArray(copied) && copied.length > 0);
    assert.ok(copied.some((p) => p.replace(/\\/g, '/').endsWith('SKILL.md')));
    await fs.access(path.join(projectRoot, '.claude', 'skills', 'skill-smith', 'SKILL.md'));

    await assert.rejects(installSkill('nope-skill', opts), /not in registry/);
    await assert.rejects(installSkill('skill-smith', opts), /already exists/);
    const again = await installSkill('skill-smith', { ...opts, force: true });
    assert.ok(again.length > 0);
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});
