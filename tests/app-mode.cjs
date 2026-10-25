const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

test('both headers reflect the current mode while retaining existing internal mode keys', () => {
  const source = fs.readFileSync('js/pnle-study.js', 'utf8');
  const selectors = [0, 1].map(() => ({ dataset: { mode: 'duty' }, querySelector: () => ({ textContent: '' }), querySelectorAll: () => [] }));
  const classes = new Set();
  const context = { document: { querySelectorAll: () => selectors, body: { classList: {
    remove: (...names) => names.forEach(name => classes.delete(name)), add: name => classes.add(name)
  } } } };
  vm.createContext(context);
  const start = source.indexOf('  function applyBodyMode(');
  vm.runInContext(source.slice(start, source.indexOf('  function hideLaunchGate(', start)), context);
  context.applyBodyMode('study');
  assert.deepEqual(selectors.map(el => el.dataset.mode), ['study', 'study']);
  assert.ok(classes.has('pnle-mode-study'));
  context.applyBodyMode('duty');
  assert.deepEqual(selectors.map(el => el.dataset.mode), ['duty', 'duty']);
  assert.ok(classes.has('pnle-mode-duty'));
});
