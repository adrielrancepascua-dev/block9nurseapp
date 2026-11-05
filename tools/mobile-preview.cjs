// Local UI preview only. Nothing is written into the application or login files.
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '..');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json' };
const PREVIEW_SCRIPT = `<script id="nursepath-local-preview">
window.NURSEPATH_USAGE_INCLUDE_EMAIL = false;
localStorage.setItem('nursepath_user', JSON.stringify({email: 'preview@example.invalid', preview: true, sealedAt: new Date().toISOString()}));
localStorage.setItem('nursepath_usage_consent_v1', '0');
</script>`;

function createPreviewServer() {
  return http.createServer(async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    // Permit rendering CDN resources but prevent calls to production databases/auth.
    // Disable service workers so cached app files cannot hide local changes.
    res.setHeader('Content-Security-Policy', "connect-src 'self'; worker-src 'none'; form-action 'self'; object-src 'none'");
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405).end(); return; }
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      const relative = pathname.replace(/^\/+/, '') || 'index.html';
      const allowed = ['index.html', 'manifest.json', 'browserconfig.xml', 'image-512.png', 'frontend/index.html'].includes(relative) || /^(?:frontend\/)?(?:assets|css|js)\//.test(relative);
      const target = path.resolve(ROOT, relative);
      if (!allowed || !target.startsWith(ROOT + path.sep) || relative.split('/').some(part => part.startsWith('.') || part.includes('\\'))) {
        res.writeHead(404).end('Not found'); return;
      }
      let body = await fs.readFile(target);
      if (relative === 'index.html' || relative === 'frontend/index.html') {
        body = Buffer.from(body.toString('utf8').replace(/<head\b[^>]*>/i, match => match + PREVIEW_SCRIPT).replace(/<title>(.*?)<\/title>/i, '<title>[LOCAL PREVIEW] $1</title>'));
      }
      res.setHeader('Content-Type', (MIME[path.extname(target)] || 'application/octet-stream') + (['.html', '.css', '.js', '.json'].includes(path.extname(target)) ? '; charset=utf-8' : ''));
      res.writeHead(200).end(req.method === 'HEAD' ? undefined : body);
    } catch { res.writeHead(404).end('Not found'); }
  });
}

if (require.main === module) {
  const port = Number(process.argv[2] || 3001);
  if (!Number.isInteger(port) || port < 1 || port > 65535) { console.error('Use a port from 1 to 65535.'); process.exit(1); }
  const server = createPreviewServer();
  server.on('error', error => { console.error(error.message); process.exitCode = 1; });
  server.listen(port, '127.0.0.1', () => {
    console.log(`NursePath UI preview: http://localhost:${port}`);
    console.log(`Forward port ${port} through Dev Tunnels, then open its HTTPS URL on your phone.`);
    console.log('Test identity only; backend connections and service workers disabled. Ctrl+C to stop.');
  });
}
module.exports = { createPreviewServer };
