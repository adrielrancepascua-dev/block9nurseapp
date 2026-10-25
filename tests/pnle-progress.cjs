const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('js/pnle-study.js', 'utf8');
function render(total = 198) {
  const root = { innerHTML: '', querySelector: () => null };
  const context = { document: { getElementById: () => root }, getMasteredCount: () => 4,
    readMistakes: () => ({ a: {}, b: {} }), getDailyProgress: () => 12, getDailyGoal: () => 10,
    formatTodayFraction: () => '12 / 10', bankItems: Array(total),
    TOPIC_ROWS: [{ id: 'heart', label: 'Heart' }, { id: 'empty', label: 'Empty topic' }],
    getTopicTotal: id => id === 'heart' ? 38 : 0, getMasteredInTopic: id => id === 'heart' ? 4 : 0,
    escapeHtml: value => String(value), window: {} };
  vm.createContext(context);
  vm.runInContext(source.slice(source.indexOf('  function renderProgressHome()'), source.indexOf('  const ICON_CHECK')), context);
  context.renderProgressHome();
  return root.innerHTML;
}
test('Progress displays real summary counts and accessible topic progress without changing daily counts', () => {
  const html = render();
  assert.match(html, /pnle-progress-overview/);
  assert.match(html, /4 \/ 198/);
  assert.match(html, /12 \/ 10/);
  assert.match(html, /<progress[^>]+value="4"[^>]+max="38"/);
  assert.match(html, /<progress[^>]+value="0"[^>]+max="1"/);
  assert.match(html, /Mistakes waiting/);
});
test('An empty bank does not produce invalid progress percentages', () => {
  assert.doesNotMatch(render(0), /NaN|Infinity/);
});
