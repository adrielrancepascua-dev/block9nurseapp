const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
test('Every existing clinical form label explicitly names its following field', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  const pairs = [...html.matchAll(/<label\b([^>]*)>(?:(?!<\/label>)[\s\S])*<\/label>\s*<(?:input|select|textarea)\b[^>]*\bid="([^"]+)"/g)];
  assert.ok(pairs.length >= 21);
  for (const [, attributes, id] of pairs) assert.match(attributes, new RegExp(`\\bfor="${id}"`), `${id} needs an explicit label`);
});
