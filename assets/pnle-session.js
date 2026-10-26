/* Validated local practice snapshots. Answer scoring remains in pnle-study.js. */
(function (global) {
  'use strict';
  const WEEK = 7 * 86400000;
  function signature(bank) {
    const text = JSON.stringify(bank.map(item => [item.id, item.stem, item.choices, item.correctIndex, item.correctIndices, item.format, item.reasons]));
    let hash = 2166136261;
    for (let i = 0; i < text.length; i += 1) hash = Math.imul(hash ^ text.charCodeAt(i), 16777619);
    return (hash >>> 0).toString(16);
  }
  function encode(session, context) {
    if (!session || session.phase !== 'question' || session.index >= session.queue.length || !context.owner) return null;
    return { version: 1, owner: context.owner, bankSignature: context.bankSignature, savedAt: context.now,
      ids: session.queue.map(item => item.id), topicId: session.topicId, level: session.level, kind: session.kind || 'full',
      index: session.index, answered: session.answered, locked: session.locked, picked: (session.picked || []).slice() };
  }
  function decode(saved, bank, context) {
    if (!saved || saved.version !== 1 || !context.owner || saved.owner !== context.owner || saved.bankSignature !== context.bankSignature) return null;
    if (!Number.isFinite(saved.savedAt) || saved.savedAt > context.now || context.now - saved.savedAt > WEEK) return null;
    if (!Array.isArray(saved.ids) || !saved.ids.length || saved.ids.length > bank.length || new Set(saved.ids).size !== saved.ids.length) return null;
    if (!Number.isInteger(saved.index) || saved.index < 0 || saved.index >= saved.ids.length || typeof saved.locked !== 'boolean') return null;
    if (!Number.isInteger(saved.answered) || saved.answered !== saved.index + Number(saved.locked)) return null;
    if (!['normal', 'hard', 'mixed'].includes(saved.level) || !['daily', 'full', 'topic', 'mistakes'].includes(saved.kind) || typeof saved.topicId !== 'string') return null;
    const byId = new Map(bank.map(item => [item.id, item]));
    const queue = saved.ids.map(id => byId.get(id));
    if (queue.some(item => !item)) return null;
    const item = queue[saved.index];
    if (!Array.isArray(saved.picked) || new Set(saved.picked).size !== saved.picked.length || saved.picked.some(index => !Number.isInteger(index) || index < 0 || index >= item.choices.length)) return null;
    if ((saved.locked && !saved.picked.length) || (item.format !== 'sata' && saved.picked.length !== Number(saved.locked))) return null;
    return { queue, topicId: saved.topicId, level: saved.level, kind: saved.kind, index: saved.index, answered: saved.answered, locked: saved.locked, picked: saved.picked.slice(), phase: 'question' };
  }
  global.NursePathPnleSession = { signature, encode, decode };
})(window);
