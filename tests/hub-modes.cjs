const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

test('hub modes update headings, descriptions, and accessible selection', () => {
  const source = fs.readFileSync('js/script-4.js', 'utf8');
  const elements = {};
  for (const id of ['tools-hub', 'hubDutyBtn', 'hubStudyBtn', 'toolsHubTitle', 'toolsHubBlurb']) {
    elements[id] = { classList: { toggle() {} }, setAttribute(k,v) { this[k] = v; } };
  }
  const description = { getAttribute: k => k === 'data-study-desc' ? 'Lesson description' : 'Duty description' };
  const context = { document: { getElementById: id => elements[id], querySelectorAll: () => [description] } };
  vm.createContext(context);
  vm.runInContext(source.slice(source.indexOf('        function applyHubMode('), source.indexOf('        function setHubMode(')), context);
  context.applyHubMode('study', { silent: true });
  assert.equal(elements.toolsHubTitle.textContent, 'Lessons');
  assert.equal(elements.toolsHubBlurb.textContent, 'Explore concepts, lessons, and practice questions.');
  assert.equal(elements.hubStudyBtn['aria-pressed'], 'true');
  assert.equal(description.textContent, 'Lesson description');
  context.applyHubMode('duty', { silent: true });
  assert.equal(elements.toolsHubTitle.textContent, 'Clinical Tools');
  assert.equal(elements.toolsHubBlurb.textContent, 'Quick-access tools for clinical practice.');
  assert.equal(elements.hubDutyBtn['aria-pressed'], 'true');
  assert.equal(description.textContent, 'Duty description');
});
