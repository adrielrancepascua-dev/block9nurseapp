const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

test('Preview uses an isolated test identity and blocks backend connections', async () => {
  assert.ok(fs.existsSync(path.join(__dirname, '../tools/mobile-preview.cjs')), 'A separate local preview launcher is required');
  const { createPreviewServer } = require('../tools/mobile-preview.cjs');
  const server = createPreviewServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const response = await fetch(base);
    const html = await response.text();
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-security-policy'), /connect-src 'self'/);
    assert.match(response.headers.get('content-security-policy'), /worker-src 'none'/);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    const script = html.match(/<script id="nursepath-local-preview">([\s\S]*?)<\/script>/)[1];
    const store = new Map();
    const localStorage = { setItem: (key, value) => store.set(key, value) };
    vm.runInNewContext(script, { window: {}, localStorage, Date, JSON });
    assert.equal(JSON.parse(store.get('nursepath_user')).email, 'preview@example.invalid');
    assert.equal(store.get('nursepath_usage_consent_v1'), '0');
    assert.ok(html.indexOf('id="nursepath-local-preview"') < html.indexOf('src="/js/script-1.js"'));
    assert.equal((await fetch(`${base}/sw.js`)).status, 404);
    assert.equal((await fetch(`${base}/.git/config`)).status, 404);
    assert.equal((await fetch(`${base}/tools/mobile-preview.cjs`)).status, 404);
    assert.equal((await fetch(`${base}/js/script-3.js`)).status, 200);
    assert.match(await (await fetch(`${base}/frontend/index.html`)).text(), /id="nursepath-local-preview"/);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
