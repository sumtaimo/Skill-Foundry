/**
 * Tests for src/factory/zip.mjs and src/factory/pack.mjs.
 * @governed-by PO_ARCHITECT
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { makeZip, readZip, crc32 } from '../src/factory/zip.mjs';
import { packSkill, packAll } from '../src/factory/pack.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SMITH = path.join(ROOT, 'src', 'skills', 'skill-smith');
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const entries = () => [
  { path: 'b/two.txt', data: Buffer.from('second file\n'.repeat(50)) },
  { path: 'a/one.txt', data: Buffer.from('first') },
];

test('crc32 known value', () => {
  assert.equal(crc32(Buffer.from('123456789')), 0xcbf43926);
});

test('makeZip/readZip round trip', () => {
  const out = readZip(makeZip(entries()));
  const sorted = entries().sort((x, y) => (x.path < y.path ? -1 : 1));
  assert.deepEqual(out.map((e) => e.path), sorted.map((e) => e.path));
  for (let i = 0; i < out.length; i++) assert.ok(Buffer.from(out[i].data).equals(sorted[i].data));
});

test('makeZip is deterministic', () => {
  const a = makeZip(entries());
  const b = makeZip(entries());
  assert.ok(a.equals(b));
  assert.equal(sha(a), sha(b));
});

test('readZip throws on corrupted CRC', () => {
  const buf = Buffer.from(makeZip([{ path: 'x.txt', data: Buffer.from('hello') }]));
  buf.writeUInt32LE((buf.readUInt32LE(14) ^ 0xffffffff) >>> 0, 14); // local header CRC
  const cd = buf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x01, 0x02]));
  if (cd >= 0) buf.writeUInt32LE((buf.readUInt32LE(cd + 16) ^ 0xffffffff) >>> 0, cd + 16);
  assert.throws(() => readZip(buf), /CRC mismatch/);
});

async function tempSkills() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'pack-'));
  const skills = path.join(root, 'skills');
  const dir = path.join(skills, 'skill-smith');
  await fs.cp(SMITH, dir, { recursive: true });
  await fs.writeFile(path.join(dir, '.DS_Store'), 'junk');
  await fs.mkdir(path.join(dir, 'node_modules', 'pkg'), { recursive: true });
  await fs.writeFile(path.join(dir, 'node_modules', 'pkg', 'index.js'), 'x');
  return { root, skills, dir };
}

test('packSkill excludes junk and adds INSTALL.txt', async () => {
  const { root, dir } = await tempSkills();
  try {
    const r = await packSkill(dir, path.join(root, 'dist'));
    const buf = await fs.readFile(r.file);
    assert.equal(r.sha256, sha(buf));
    assert.equal(r.bytes, buf.length);
    const zipped = readZip(buf);
    const paths = zipped.map((e) => e.path);
    assert.ok(paths.includes('skill-smith/INSTALL.txt'));
    assert.ok(paths.includes('skill-smith/SKILL.md'));
    assert.ok(paths.every((p) => p.startsWith('skill-smith/')));
    assert.ok(!paths.some((p) => p.includes('.DS_Store') || p.includes('node_modules')));
    const install = zipped.find((e) => e.path === 'skill-smith/INSTALL.txt').data.toString();
    assert.match(install, /\.claude\/skills\/skill-smith\//);
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});

test('packAll writes checksums.json matching files', async () => {
  const { root, skills } = await tempSkills();
  try {
    const out = path.join(root, 'dist');
    await packAll({ skillsRoot: skills, outDir: out });
    const sums = JSON.parse(await fs.readFile(path.join(out, 'checksums.json'), 'utf8'));
    const files = Object.keys(sums);
    assert.ok(files.includes('all-skills.zip'));
    assert.ok(files.some((f) => /^skill-smith-.+\.zip$/.test(f)));
    for (const f of files) {
      const buf = await fs.readFile(path.join(out, f));
      assert.equal(sums[f].sha256, sha(buf), f);
      assert.equal(sums[f].bytes, buf.length, f);
    }
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});
