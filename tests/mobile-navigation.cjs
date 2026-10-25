const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

test('navigation levels preserve content and follow section changes', () => {
  const source = fs.readFileSync('js/script-4.js', 'utf8');
  const start = source.indexOf('        function setMobileNavLevel(');
  assert.ok(start >= 0, 'mobile navigation controller exists');
  const end = source.indexOf('        function switchMainTab(', start);
  const animations = [];
  const groups = ['main', 'references'].map(level => ({
    dataset: { navLevel: level }, hidden: level !== 'main',
    getAnimations: () => [],
    animate: (frames) => animations.push(frames),
    getAttribute() { return this.dataset.navLevel; }
  }));
  const bar = { dataset: {}, querySelectorAll: () => groups, getAnimations: () => [], animate: () => {} };
  const context = { document: { getElementById: () => bar }, window: { matchMedia: () => ({ matches: false }) } };
  vm.createContext(context);
  vm.runInContext(source.slice(start, end), context);
  context.setMobileNavLevel('references');
  assert.equal(groups[0].hidden, true);
  assert.equal(groups[1].hidden, false);
  assert.equal(animations.at(-1)[0].transform, 'translateX(100%)');
  context.setMobileNavLevel('main');
  assert.equal(groups[0].hidden, false);
  assert.equal(animations.at(-1)[0].transform, 'translateX(-100%)');
  context.syncMobileNavigation('sizes');
  assert.equal(groups[1].hidden, false);
  context.syncMobileNavigation('otc');
  assert.equal(groups[0].hidden, false);
});

test('mobile active pill moves between grid positions with reduced-motion support', () => {
  const css = fs.readFileSync('css/styles.css', 'utf8');
  assert.ok(css.includes('.np-tabbar-level::before'), 'one shared sliding indicator per level');
  assert.ok(css.includes('translateX(calc(var(--np-active-index'), 'indicator position follows active index');
  assert.ok(css.includes('.np-tabbar-level:has(> .is-active:nth-child(2))'), 'second tab moves indicator');
  assert.ok(css.includes('.np-tabbar-level::before { transition: none; }'), 'reduced motion disables sliding');
});
