// A copy of the working tree outside the repository, with motion-craft set to `ready` there only.
// Needed because routing and portable-check see only ready skills. Starts only `git ls-files`.
import { execFileSync } from 'node:child_process';
import { cpSync, rmSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = fileURLToPath(new URL('../../../../', import.meta.url)); // the repository this file is in
const to = join(tmpdir(), 'motion-craft-proof', 'shadow');
rmSync(to, { recursive: true, force: true });
const files = execFileSync('git', ['ls-files', '-co', '--exclude-standard', '-z'], { cwd: REPO, encoding: 'utf8', maxBuffer: 1 << 26 }).split('\0').filter(Boolean);
for (const f of new Set(files)) if (existsSync(join(REPO, f))) cpSync(join(REPO, f), join(to, f), { recursive: true });
const path = join(to, 'src/factory/registry.json');
const registry = JSON.parse(readFileSync(path, 'utf8'));
registry.find((s) => s.name === 'motion-craft').status = 'ready';
writeFileSync(path, `${JSON.stringify(registry, null, 2)}\n`);
console.log(to);
