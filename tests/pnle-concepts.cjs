const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync('assets/pnle-medsurg.js', 'utf8'), context);
assert.ok(fs.existsSync('assets/pnle-concepts.js'), 'Review needs a separate concept lesson source');
vm.runInContext(fs.readFileSync('assets/pnle-concepts.js', 'utf8'), context);
const api = context.window.NursePathPnleConcepts;
const bank = context.window.NursePathPnleMedSurg.items;
for (const item of bank) assert.ok(api.getForItem(item), `Missing concept for ${item.id}`);
assert.equal(api.getForItem({ id: 'future-question', reasons: ['Do not expose this'] }), null);
for (const lesson of Object.values(api.lessons)) {
  assert.ok(lesson.title && lesson.summary && lesson.reflect);
  assert.ok(lesson.sections.length && lesson.sources.length);
  for (const source of lesson.sources) assert.ok(new URL(source.url).protocol === 'https:');
  const words = [lesson.summary, ...lesson.sections.map(section => section.body), lesson.reflect].join(' ').split(/\s+/);
  assert.ok(words.length <= 130, `${lesson.id} should be a short lesson`);
  assert.ok(!('correctIndex' in lesson) && !('choices' in lesson) && !('reasons' in lesson));
}
const first = api.getForItem(bank[0]);
assert.equal(api.getForItems([bank[0], bank[0]]).length, 1, 'Repeated concepts should appear once');
assert.equal(api.getForItems([bank[0]])[0].id, first.id);
assert.equal(api.getForItems([{ id: 'future-question' }])[0].id, 'unavailable');
assert.equal(api.getForItem({ id: 'exam-hard-031' }).id, 'reflux', 'Reflux questions need teaching about reflux');
assert.equal(api.getForItem({ id: 'exam-hard-043' }).id, 'platelets', 'Phlebotomy bleeding risk needs platelet teaching');
assert.equal(api.getForItem({ id: 'exam-hard-052' }).id, 'biopsy', 'Post-biopsy bleeding needs procedure aftercare teaching');
assert.equal(api.getForItem({ id: 'periop-023' }).id, 'potassium', 'IV potassium questions need electrolyte and replacement-safety teaching');
console.log(`Concept lessons cover ${bank.length} questions; deduplication and unavailable state pass.`);
