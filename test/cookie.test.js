const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const test = require('node:test');

test('timezone offset cookie applies across the site', () => {
  const document = { cookie: '' };
  const context = vm.createContext({ document, Date });
  const script = fs.readFileSync('vendor/assets/javascripts/auto_timezone.js', 'utf8');
  vm.runInContext(script, context);
  assert.match(document.cookie, /^auto_timezone_offset=-?\d+; path=\/$/);
});
