/**
 * Loads ready skills from the factory registry and skill folders for the showcase site.
 * @governed-by PO_ARCHITECT
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { sanitizeSvg } from './svg.mjs';
import { scoreLive } from '../../factory/live-evals.mjs';
import { loadProof, docFigure, loadTokens } from './proof.mjs';
import { objectFigure, KINDS } from './objects.mjs';
import { loadRecipes, checkRecipe } from '../../factory/recipe-run.mjs';
import { DICTS } from './i18n.mjs';

/** Agent roles a skill may declare; the same eight the install CLI (src/factory/foundry.mjs) accepts. */
export const ROLES = ['PO_ARCHITECT', 'BA_ANALYST', 'DEV_ENGINEER', 'QA_AUDITOR', 'UX_DESIGNER', 'REVIEWER', 'SECURITY', 'COORDINATOR'];

/** Latest recordedAt date (YYYY-MM-DD) among the recordings in evals/live/, or an empty string. */
function liveUpdated(dir) {
  const live = join(dir, 'evals', 'live');
  let best = '';
  for (const f of readdirSync(live).filter((x) => x.endsWith('.json'))) {
    let rec;
    try { rec = JSON.parse(readFileSync(join(live, f), 'utf8')); } catch { continue; }
    const at = typeof rec?.recordedAt === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(rec.recordedAt) ? rec.recordedAt : '';
    if (at > best) best = at;
  }
  return best;
}

/** Real-agent eval result from evals/live/ recordings; null when the skill has none. */
function liveResult(dir) {
  if (!existsSync(join(dir, 'evals', 'live'))) return null;
  const s = scoreLive(dir);
  return { passed: s.passed, total: s.passed + s.failed, updated: liveUpdated(dir) };
}

const EXCLUDE = new Set(['.DS_Store', 'Thumbs.db', 'node_modules', '.git']);

function listFiles(dir, prefix = '') {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (EXCLUDE.has(e.name)) continue;
    const rel = prefix ? `${prefix}/${e.name}` : e.name;
    if (e.isDirectory()) out.push(...listFiles(join(dir, e.name), rel));
    else if (e.isFile()) out.push(rel);
  }
  return out;
}

/**
 * The newest recorded real run of a skill at this version that passed its checks, or null.
 * Runs are written by src/factory/run-skill.mjs. Only real, passing, current-version output is shown.
 * @param {string} runsRoot @param {string} name @param {string} version @param {string} [caseId] only runs of this eval case
 */
export function latestRun(runsRoot, name, version, caseId) {
  const dir = join(runsRoot, name);
  if (!existsSync(dir)) return null;
  const runs = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const mp = join(dir, e.name, 'manifest.json');
    if (!e.isDirectory() || !existsSync(mp)) continue;
    const m = JSON.parse(readFileSync(mp, 'utf8'));
    if (m.status !== 'pass' || String(m.version) !== String(version) || !Array.isArray(m.files)) continue;
    if (caseId && m.caseId !== caseId) continue; // the registry pins the one case this skill showcases
    runs.push({ m, runDir: join(dir, e.name) });
  }
  runs.sort((a, b) => (a.m.finishedAt < b.m.finishedAt ? 1 : a.m.finishedAt > b.m.finishedAt ? -1 : 0));
  for (const { m, runDir } of runs) {
    const html = m.files.map((f) => f.path).find((f) => f.endsWith('.html'));
    const svgFile = m.files.map((f) => f.path).find((f) => f.endsWith('.svg'));
    if (!html && !svgFile) continue;
    let svg = null;
    if (svgFile) { try { svg = sanitizeSvg(readFileSync(join(runDir, 'output', svgFile), 'utf8')); } catch { svg = null; } }
    const inputPath = join(runDir, 'input.md');
    return {
      key: String(m.key).slice(0, 8),
      input: existsSync(inputPath) ? readFileSync(inputPath, 'utf8').trim().replace(/\s+/g, ' ') : '',
      htmlPath: html ? join(runDir, 'output', html) : null,
      svg,
      files: m.files.map((f) => f.path).sort(),
    };
  }
  return null;
}

/** Curated real fresh-agent HTML playgrounds per visual/UI skill (ordered; primary demo first). */
const PLAYGROUND_SPECS = {
  'motion-craft': [
    { id: 'museum-3d-rooms', label: '3D Museum Walkthrough (Scroll)', rel: 'evals/live/files/museum-3d-rooms.html' },
    { id: 'khmer-coffee', label: 'ហាងកាហ្វេ ដើមត្នោត (Khmer Scroll)', rel: 'evals/live/files/khmer-coffee.html' },
  ],
  'svg-mechanism': [
    { id: 'webhook-pipeline', label: 'Webhook Delivery Pipeline', rel: 'evals/live/files/webhook-pipeline.html' },
    { id: 'khmer-payment-flow', label: 'លំហូរទូទាត់ QR (Khmer)', rel: 'evals/live/files/khmer-payment-flow.html' },
    { id: 'oauth-pkce-handshake', label: 'OAuth 2.0 PKCE Handshake', rel: 'evals/live/files/oauth-pkce-handshake.html' },
    { id: 'reads-design-foundation', label: 'Design Foundation Flow', rel: 'evals/live/files/reads-design-foundation.html' },
  ],
  'tiny-charts': [
    { id: 'checkout-statechart', label: 'Checkout Payment Statechart', rel: 'evals/live/files/checkout-statechart.html' },
    { id: 'actor-sequence', label: 'Login Sequence Exchange', rel: 'evals/live/files/actor-sequence.html' },
    { id: 'refund-flowchart', label: 'Refund Policy Flowchart', rel: 'evals/live/files/refund-flowchart.html' },
    { id: 'trial-timeline', label: '14-Day Onboarding Timeline', rel: 'evals/live/files/trial-timeline.html' },
    { id: 'funnel-sankey', label: 'Lead Funnel Sankey', rel: 'evals/live/files/funnel-sankey.html' },
  ],
  'ui-craft': [
    { id: 'bento-glass-landing', label: 'Bento Glass Landing', rel: 'evals/live/files/bento-glass-landing.html' },
    { id: 'command-palette-shell', label: 'Command Palette (Ctrl+K)', rel: 'evals/live/files/command-palette-shell.html' },
    { id: 'lifecycle-states-grid', label: 'Lifecycle States Grid', rel: 'evals/live/files/lifecycle-states-grid.html' },
    { id: 'khmer-line-height', label: 'Khmer Typography UI', rel: 'evals/live/files/khmer-line-height.html' },
  ],
  'component-kit': [
    { id: 'code-demo', label: 'Button & Card Component Kit', rel: 'evals/live/files/code-demo.html' },
  ],
  'ui-polish': [
    { id: 'settings-card', label: 'Polished Settings Card', rel: 'evals/live/files/settings-card.html' },
    { id: 'foundation-components', label: 'Foundation Components', rel: 'evals/live/files/foundation-components.html' },
    { id: 'khmer-tokens', label: 'Khmer Token Card', rel: 'evals/live/files/khmer-tokens.html' },
  ],
  'design-system': [
    { id: 'hex-invoicing-demo', label: 'Live Token Theme (Light / Dark)', rel: 'evals/live/files/hex-invoicing-demo.html' },
  ],
};

/** Visual/UI skills whose landing cards render a live visual thumbnail iframe of their primary HTML demo. */
const LIVE_COVER_SKILLS = new Set(['motion-craft', 'svg-mechanism', 'tiny-charts', 'ui-craft', 'component-kit', 'ui-polish']);

/** Find local relative CSS stylesheets linked by a standalone HTML demo so buildSite copies them alongside it. */
function linkedAssets(htmlPath) {
  const html = readFileSync(htmlPath, 'utf8');
  const baseDir = dirname(htmlPath);
  const assets = [];
  for (const m of html.matchAll(/<link\b[^>]*href="([^"]+)"[^>]*>/gi)) {
    const rel = m[1].split(/[?#]/)[0];
    if (!rel || /^(https?:|\/\/|data:|\/)/i.test(rel) || rel.includes('..')) continue;
    const from = resolve(baseDir, rel);
    if (existsSync(from)) assets.push({ rel, from });
  }
  return assets;
}

/** Real fresh-agent interactive HTML playgrounds available for a skill. */
function loadPlaygrounds(name, dir, run) {
  const out = [];
  const specs = PLAYGROUND_SPECS[name];
  if (specs) {
    for (const spec of specs) {
      const src = join(dir, spec.rel);
      if (!existsSync(src)) continue;
      const file = out.length === 0 ? 'example.html' : `demos/${spec.id}.html`;
      out.push({ id: spec.id, label: spec.label, file, src, assets: linkedAssets(src) });
    }
  } else if (run?.htmlPath && existsSync(run.htmlPath)) {
    out.push({ id: 'run', label: 'Interactive demo', file: 'example.html', src: run.htmlPath, assets: linkedAssets(run.htmlPath) });
  }
  return out;
}

/** The "Do not use for ..." sentence of a skill description (what the skill never does), or ''. */
export function notFor(description) {
  const m = /Do not use (?:it )?for\s+([^.]*)\./i.exec(description);
  return m ? `Do not use for ${m[1].trim()}.` : '';
}

/** @param {string} md */
export function parseProcedure(md) {
  const lines = md.replace(/\r\n?/g, '\n').split('\n');
  const start = lines.findIndex((l) => /^##\s+Procedure\s*$/.test(l));
  if (start < 0) return [];
  const steps = [];
  for (let i = start + 1; i < lines.length; i++) {
    const l = lines[i];
    if (/^#{1,2}\s/.test(l)) break;
    const m = /^\s*\d+\.\s+(.*)$/.exec(l);
    if (m) steps.push(m[1].replace(/\s*\[[^\]]*\]\([^)]*\)/g, '').trim()); // layer links are for agents, not the site
    else if (steps.length && /^\s{2,}\S/.test(l)) steps[steps.length - 1] += ' ' + l.trim();
  }
  return steps;
}

/**
 * @param {string} root repo root
 * @param {{registryPath?:string, skillsRoot?:string, runsRoot?:string}} [opts]
 */
export function loadSkills(root, opts = {}) {
  if (typeof root !== 'string' || !root) throw new TypeError('loadSkills: root must be a non-empty string');
  if (opts === null || typeof opts !== 'object') throw new TypeError('loadSkills: opts must be an object');
  const registryPath = resolve(opts.registryPath ?? join(root, 'src', 'factory', 'registry.json'));
  const skillsRoot = resolve(opts.skillsRoot ?? join(root, 'src', 'skills'));
  const runsRoot = resolve(opts.runsRoot ?? join(root, 'runs'));
  const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
  if (!Array.isArray(registry)) throw new Error('loadSkills: registry must be an array');
  return registry
    .filter((r) => r && r.status === 'ready')
    .map((r) => {
      if (typeof r.name !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(r.name)) throw new Error(`loadSkills: bad name ${r.name}`);
      const dir = join(skillsRoot, r.name);
      const read = (f) => readFileSync(join(dir, f), 'utf8');
      const preview = JSON.parse(read('preview.json'));
      const rules = JSON.parse(read('RULES.json'));
      if (!Array.isArray(rules)) throw new Error(`loadSkills: RULES.json of ${r.name} must be an array`);
      const machine = rules.filter((x) => x && x.check).length;
      const checklist = rules.filter((x) => x && x.checklist && !x.check).length;
      const run = latestRun(runsRoot, r.name, String(r.version), typeof r.showcase === 'string' ? r.showcase : undefined);
      const playgrounds = loadPlaygrounds(r.name, dir, run);
      const previewExample = join(dir, 'preview', 'example.html');
      const roles = Array.isArray(r.roles) ? r.roles.map(String) : [];
      for (const role of roles) if (!ROLES.includes(role)) throw new Error(`loadSkills: ${r.name} has unknown role ${role}`);
      const md = read('SKILL.md');
      // What the showcase shows, in order of strength: a recorded figure run, else the real answer of a fresh agent
      // drawn as the object it stands for (or a document), else the hand-drawn preview cover, which is then labelled as a concept.
      const proof = loadProof(dir, { showcase: typeof r.showcase === 'string' ? r.showcase : undefined });
      // design-system draws the colours of the tokens.css a fresh agent wrote in its pinned live case
      const tokens = proof && (KINDS[r.name] ?? []).includes('swatches') ? loadTokens(dir, typeof r.showcase === 'string' ? r.showcase : undefined, runsRoot) : null;
      if (tokens) proof.tokens = tokens;
      const coverKind = run?.svg ? 'run' : proof ? 'proof' : 'concept';
      const coverSvg = coverKind === 'run' ? run.svg
        : coverKind === 'proof' ? sanitizeSvg(objectFigure(KINDS[r.name] ?? [], proof) ?? docFigure(proof, { askLabel: DICTS.en['answer.asked'], moreLabel: DICTS.en['answer.more'] }))
        : sanitizeSvg(read('preview/cover.svg'));
      // The skill page shows the request once, beside the result, so its cover is the same figure without the request block.
      const coverSvgBare = coverKind === 'proof' && !objectFigure(KINDS[r.name] ?? [], proof)
        ? sanitizeSvg(docFigure(proof, { askLabel: DICTS.en['answer.asked'], moreLabel: DICTS.en['answer.more'], showAsk: false }))
        : coverSvg;
      return {
        name: r.name,
        roles,
        description: (/^description:\s*(.*)$/m.exec(md)?.[1] ?? '').trim(),
        notFor: notFor((/^description:\s*(.*)$/m.exec(md)?.[1] ?? '').trim()),
        ruleList: rules.filter((x) => x && typeof x.id === 'string' && typeof x.text === 'string').map((x) => ({ id: x.id, text: x.text, machine: !!x.check })),
        live: liveResult(dir),
        version: String(r.version),
        status: r.status,
        title: String(preview.title ?? r.name),
        tagline: String(preview.tagline ?? ''),
        prompt: (coverKind === 'run' ? run?.input : proof?.prompt) || run?.input || String(preview.prompt ?? ''),
        outputs: Array.isArray(preview.outputs) ? preview.outputs.map(String) : [],
        tags: Array.isArray(preview.tags) ? preview.tags.map(String) : [],
        coverSvg,
        coverSvgBare,
        coverKind,
        factoryOnly: /^scope:\s*factory/m.test(md),
        proof,
        tokens: tokens ? { prompt: tokens.prompt, run: tokens.run, caseId: tokens.caseId, sha256: tokens.sha256 } : null,
        procedure: parseProcedure(md),
        rules: { total: rules.length, machine, checklist },
        changelog: existsSync(join(dir, 'CHANGELOG.md')) ? read('CHANGELOG.md').replace(/\r\n?/g, '\n') : '',
        files: listFiles(dir).sort(),
        playgrounds,
        liveCover: LIVE_COVER_SKILLS.has(r.name) && playgrounds.length > 0,
        example: playgrounds.length > 0 || existsSync(previewExample),
        exampleSrc: playgrounds[0]?.src ?? (existsSync(previewExample) ? previewExample : null),
        // reference: the recorded output is byte for byte (ignoring CRLF checkout differences) the figure the skill ships as its example
        run: run ? { key: run.key, files: run.files, reference: !!run.htmlPath && existsSync(previewExample) && readFileSync(run.htmlPath, 'utf8').replace(/\r\n/g, '\n') === readFileSync(previewExample, 'utf8').replace(/\r\n/g, '\n') } : null, // a recorded real run; null means the cover and example are the skill's own demo
        zipBytes: 0, // size of the packed zip; buildSite fills it after packAll
      };
    })
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
}

/**
 * Recipes (several skills working together) that have a passing, current recording made by a real agent.
 * The answer is shown word for word; recipes without such a recording are not shown.
 * @param {string} root repo root
 */
export function loadRecipeProofs(root) {
  return loadRecipes(root).map((r) => {
    const c = checkRecipe(r, root);
    if (!c.ok) return null;
    return { id: r.id, title: String(r.title ?? r.id), prompt: c.rec.prompt, used: c.rec.used, answer: c.rec.answer, svg: sanitizeSvg(objectFigure((c.rec.used ?? []).flatMap((u) => KINDS[u] ?? []), { prompt: c.rec.prompt, answer: c.rec.answer }) ?? docFigure({ prompt: c.rec.prompt, answer: c.rec.answer }, { askLabel: DICTS.en['answer.asked'], moreLabel: DICTS.en['answer.more'] })) };
  }).filter(Boolean);
}
