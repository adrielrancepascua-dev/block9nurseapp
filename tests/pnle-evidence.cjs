const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const context = { window: {} }; vm.createContext(context);
vm.runInContext(fs.readFileSync('assets/pnle-concepts.js', 'utf8'), context);
const lessons = Object.values(context.window.NursePathPnleConcepts.lessons);
assert.ok(fs.existsSync('docs/review-concepts/2026-10-26-audit.json'), 'Every concept needs a traceable evidence audit');
const audit = JSON.parse(fs.readFileSync('docs/review-concepts/2026-10-26-audit.json', 'utf8'));
assert.equal(audit.lessons.length, lessons.length);
const rows = new Map(audit.lessons.map(row => [row.id, row]));
assert.equal(rows.size, lessons.length);
for (const lesson of lessons) {
  const row = rows.get(lesson.id);
  assert.ok(row, `Missing evidence audit for ${lesson.id}`);
  assert.ok(['supported', 'corrected', 'qualified'].includes(row.status));
  assert.ok(lesson.sources.length >= 2, `${lesson.id} needs multiple relevant references`);
  assert.equal(new Set(lesson.sources.map(source => source.url)).size, lesson.sources.length);
  for (const source of lesson.sources) {
    const evidence = row.evidence.find(item => item.url === source.url);
    assert.ok(evidence && evidence.title && evidence.access && evidence.supports, `Missing source provenance for ${lesson.id}: ${source.url}`);
  }
}
console.log(`Evidence provenance recorded for ${lessons.length} concepts. This test does not certify medical accuracy.`);
