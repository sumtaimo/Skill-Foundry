import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';

const page = (name) => readFileSync(new URL(`./public/${name}`, import.meta.url));

export const server = createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') { res.writeHead(200, { 'content-type': 'text/html' }); res.end(page('index.html')); return; }
  if (req.url === '/notes') { res.writeHead(200, { 'content-type': 'application/json' }); res.end('[]'); return; }
  res.writeHead(404); res.end('Not found');
});

if (process.argv[1] && process.argv[1].endsWith('server.js')) server.listen(3000);
