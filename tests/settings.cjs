const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

test('System theme follows the device without overwriting the saved preference', () => {
  const store = new Map([['nursepath_theme', 'system']]);
  const callbacks = {};
  const device = { matches: false, addEventListener: (_, fn) => { callbacks.device = fn; } };
  const attributes = {};
  const root = { setAttribute: (k,v) => attributes[k]=v, removeAttribute: k => delete attributes[k], getAttribute: k => attributes[k], classList: { toggle() {} } };
  const context = {
    localStorage: { getItem: k => store.get(k) ?? null, setItem: (k,v) => store.set(k,v) },
    document: { documentElement: root, body: { style: { setProperty() {} } }, getElementById: () => null, querySelectorAll: () => [], addEventListener() {} },
    navigator: {},
    window: { matchMedia: q => q.includes('prefers-color-scheme') ? device : { matches: false, addEventListener() {} }, addEventListener: (key,fn) => { callbacks[key] = fn; }, dispatchEvent() {} },
    CustomEvent: class {}
  };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync('js/script-2.js','utf8'),context);
  callbacks.DOMContentLoaded();
  assert.equal(attributes['data-theme'], 'light');
  assert.equal(store.get('nursepath_theme'), 'system');
  device.matches = true;
  callbacks.device();
  assert.notEqual(attributes['data-theme'], 'light');
  context.window.setNursePathTheme('light');
  assert.equal(store.get('nursepath_theme'), 'light');
  callbacks.device();
  assert.equal(attributes['data-theme'], 'light');
});

test('offline status only reports Ready when every required resource is cached', async () => {
  const listeners = {};
  let missing = false;
  const context = { URL, Response, self: { location: 'https://nursepath.test/sw.js', addEventListener: (k,v) => listeners[k] = v }, caches: {
    has: async () => true,
    open: async () => ({ match: async url => missing && url.endsWith('index.html') ? undefined : { ok: true } })
  } };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync('sw.js','utf8'),context);
  assert.equal(typeof listeners.message, 'function');
  async function query() {
    let status;
    let pending;
    listeners.message({ data: { type: 'NURSEPATH_PACK_STATUS' }, ports: [{ postMessage: value => { status = value; } }], waitUntil: promise => { pending = promise; } });
    await pending;
    return status;
  }
  const complete = await query();
  assert.equal(complete.ready, true);
  assert.ok(complete.version.startsWith('nursepath-v'));
  assert.ok(complete.required > 25);
  missing = true;
  assert.equal((await query()).ready, false);
});
