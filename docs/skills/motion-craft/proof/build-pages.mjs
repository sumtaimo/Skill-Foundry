// Give only the recorded prompt to a fresh agent in an empty folder. Starts exactly one child per case named on the command line.
import { spawn } from 'node:child_process';
import { mkdirSync, rmSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { tmpdir } from 'node:os';
const SP = join(tmpdir(), 'motion-craft-proof'); // outside the repository on purpose: agents started inside it read its rules
mkdirSync(SP, { recursive: true });
const ids = process.argv.slice(2).filter((id) => /^(khmer|no-assets|rooms|editorial)$/.test(id)).slice(0, 4);
const settings = join(SP, 'no-hooks.json');
writeFileSync(settings, '{ "disableAllHooks": true }');

await Promise.all(ids.map((id) => new Promise((done) => {
  const prompt = /```text\r?\n([\s\S]*?)```/.exec(JSON.parse(readFileSync(join(SP, 'recorded', `${id}.json`), 'utf8')).output)[1];
  const cwd = join(SP, 'built', id);
  rmSync(cwd, { recursive: true, force: true });
  mkdirSync(cwd, { recursive: true });
  const child = spawn(`claude -p --settings "${settings}" --tools Read,Write,Edit --allowedTools Read Write Edit`, { cwd, shell: true, timeout: 570000 });
  let out = '';
  child.stdout.on('data', (d) => { out += d; });
  child.stderr.on('data', (d) => { out += d; });
  child.on('close', (code) => {
    console.log(`######## ${id} exit ${code}\nfiles: ${readdirSync(cwd).join(', ')}\n${out}`);
    done();
  });
  child.stdin.end(prompt);
})));
