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

test('cookie uses standard time offset in both hemispheres', () => {
  const script = fs.readFileSync('vendor/assets/javascripts/auto_timezone.js', 'utf8');
  for (const [tz, offset] of [['America/New_York', -18000], ['Australia/Sydney', 36000], ['Asia/Kolkata', 19800]]) {
    const previous = process.env.TZ;
    try {
      process.env.TZ = tz;
      const document = { cookie: '' };
      vm.runInNewContext(script, { document, Date });
      assert.equal(document.cookie, 'auto_timezone_offset=' + offset + '; path=/', tz);
    } finally {
      if (previous === undefined) delete process.env.TZ;
      else process.env.TZ = previous;
    }
  }
});
