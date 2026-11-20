#!/usr/bin/env node
/**
 * Test setup, not part of the skill's work: copies the sample design folder (what design-system writes for a
 * small invoicing app) into ./design of the current project, so the skill can be tried without running design-system.
 *   node install-sample.mjs            copies BRIEF.md, tokens.css, STATUS.md and the two sample specs (button, card)
 *   node install-sample.mjs --no-specs copies only BRIEF.md, tokens.css and STATUS.md
 * Refuses when ./design already exists.
 */
import { cpSync, existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const from = join(dirname(fileURLToPath(import.meta.url)), 'sample-design');
const to = join(process.cwd(), 'design');
if (existsSync(to)) { console.log('design already exists: nothing copied'); process.exit(1); }
cpSync(from, to, { recursive: true });
if (process.argv.includes('--no-specs')) rmSync(join(to, 'components'), { recursive: true, force: true });
console.log(`sample design folder copied to ${to}${process.argv.includes('--no-specs') ? ' (no specs)' : ' (with the button and card specs)'}`);
