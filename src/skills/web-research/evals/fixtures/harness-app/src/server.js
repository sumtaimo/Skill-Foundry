import http from 'node:http';

export function createServer() {
  return http.createServer((req, res) => {
    if (req.url === '/') { res.writeHead(200, { 'content-type': 'text/html' }); res.end('<h1>Notes</h1>'); return; }
    res.writeHead(404); res.end('not found');
  });
}
