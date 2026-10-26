const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
function setup() {
  assert.ok(fs.existsSync('assets/pnle-session.js'), 'PNLE needs a validated session snapshot helper');
  const ctx = { window: {} }; vm.createContext(ctx);
  vm.runInContext(fs.readFileSync('assets/pnle-session.js', 'utf8'), ctx);
  const bank = [{ id: 'a', stem: 'First', choices: ['One', 'Two'], correctIndex: 0, format: 'single' }, { id: 'b', stem: 'Second', choices: ['One', 'Two'], correctIndices: [0, 1], format: 'sata' }];
  const context = { owner: 'test@example.invalid', bankSignature: ctx.window.NursePathPnleSession.signature(bank), now: 1000000000 };
  const session = { queue: bank, topicId: 'all', level: 'normal', kind: 'daily', index: 0, answered: 1, locked: true, picked: [1], phase: 'question' };
  return { api: ctx.window.NursePathPnleSession, bank, context, session };
}
test('Single and SATA snapshots preserve queue, position and selected/locked state', () => {
  const { api, bank, context, session } = setup();
  const saved = api.encode(session, context);
  assert.deepEqual(JSON.parse(JSON.stringify(api.decode(saved, bank, context))), session);
  session.index = 1; session.locked = false; session.picked = [1];
  const restored = api.decode(api.encode(session, context), bank, context);
  assert.deepEqual(Array.from(restored.picked), [1]);
  assert.equal(restored.queue[1], bank[1]);
});
test('Snapshots reject other users, changed bank content, expired and malformed states', () => {
  const { api, bank, context, session } = setup();
  const saved = api.encode(session, context);
  for (const override of [{ owner: 'other@example.invalid' }, { bankSignature: 'changed' }, { now: context.now + 8 * 86400000 }]) assert.equal(api.decode(saved, bank, { ...context, ...override }), null);
  for (const bad of [null, {}, { ...saved, index: 999 }, { ...saved, picked: [4] }, { ...saved, answered: 0 }, { ...saved, ids: ['missing'] }, { ...saved, locked: 'true' }, { ...saved, level: 'unsupported' }]) assert.equal(api.decode(bad, bank, context), null);
  assert.notEqual(api.signature(bank), api.signature([{ ...bank[0], choices: ['Changed', 'Two'] }, bank[1]]));
  assert.equal(api.encode({ ...session, index: 2 }, context), null, 'completed sessions should not be resumed');
});
