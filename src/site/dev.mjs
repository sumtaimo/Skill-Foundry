/**
 * Local dev server for the showcase site: builds dist/site, serves it on
 * http://127.0.0.1:4173 and rebuilds when anything under src/ changes.
 * Zero dependencies (node:http, node:fs). Not part of the published site.
 * CLI: node src/site/dev.mjs [--port 4173] [--out dist/site]
 * @governed-by PO_ARCHITECT
 */
import http from 'node:http';
import { createReadStream, existsSync, statSync, watch } from 'node:fs';
import { join, resolve, dirname, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSite } from './build.mjs';

const HERE = fileURLToPath(import.meta.url);
const REPO_ROOT = resolve(dirname(HERE), '..', '..');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.zip': 'application/zip',
};

/** @param {string[]} argv @param {string} name @param {string} fallback */
function arg(argv, name, fallback) {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
}

/**
 * Serve files from `root` on 127.0.0.1:`port`. Directory URLs serve index.html.
 * @param {string} root @param {number} port @returns {http.Server}
 */
export function serve(root, port) {
  if (typeof root !== 'string' || !root) throw new TypeError('serve: root must be a non-empty string');
  if (!Number.isInteger(port) || port <= 0 || port > 65535) throw new TypeError('serve: port must be 1-65535');
  const base = resolve(root);
  return http.createServer((req, res) => {
    let file;
    try {
      file = resolve(join(base, decodeURIComponent(new URL(req.url, 'http://local').pathname)));
    } catch {
      res.writeHead(400); res.end('bad request'); return;
    }
    if (file !== base && !file.startsWith(base + sep)) { res.writeHead(403); res.end('forbidden'); return; }
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
    if (!existsSync(file)) { res.writeHead(404); res.end('not found'); return; }
    res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
    const stream = createReadStream(file);
    stream.on('error', () => { if (!res.headersSent) res.writeHead(500); res.end(); });
    stream.pipe(res);
  }).listen(port, '127.0.0.1');
}

/** Build once, serve, and rebuild on changes under src/. */
export async function dev({ port = 4173, out = join(REPO_ROOT, 'dist', 'site') } = {}) {
  const t0 = Date.now();
  const first = await buildSite({ root: REPO_ROOT, out });
  console.log(`built ${first.pages.length} pages, ${first.skills} skills in ${Date.now() - t0} ms`);
  serve(out, port).on('error', (e) => {
    console.error(e.code === 'EADDRINUSE' ? `port ${port} is in use; try --port ${port + 1}` : e.message);
    process.exit(1);
  });
  console.log(`serving http://127.0.0.1:${port}/  (Ctrl+C to stop; edits under src/ rebuild, then reload the page)`);

  let timer = null; let building = false; let again = false;
  const rebuild = async () => {
    if (building) { again = true; return; }
    building = true;
    try {
      const t = Date.now();
      const r = await buildSite({ root: REPO_ROOT, out });
      console.log(`rebuilt ${r.pages.length} pages in ${Date.now() - t} ms`);
    } catch (e) {
      console.error(`build failed: ${e.message}`);
    } finally {
      building = false;
      if (again) { again = false; rebuild(); }
    }
  };
  for (const dir of [join(REPO_ROOT, 'src'), join(REPO_ROOT, 'runs')]) {
    if (!existsSync(dir)) continue;
    watch(dir, { recursive: true }, () => {
      clearTimeout(timer);
      timer = setTimeout(rebuild, 150);
    });
  }
}

if (process.argv[1] && resolve(process.argv[1]) === HERE) {
  const argv = process.argv.slice(2);
  const port = Number(arg(argv, '--port', '4173'));
  const out = resolve(arg(argv, '--out', join(REPO_ROOT, 'dist', 'site')));
  dev({ port, out }).catch((e) => { console.error(e.message); process.exit(1); });
}
