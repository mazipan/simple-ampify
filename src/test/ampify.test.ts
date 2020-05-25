import ampify from '../ampify';

const fs = require('fs');
const path = require('path');

let html1 = ''
beforeAll(() => {
	html1 = fs.readFileSync(path.resolve('./src/test/test1.html'), { encoding: 'utf-8'} )
})

test('Check html source', () => {
  expect(html1).not.toBeFalsy();
});

test('Check ampify result', () => {
  const result = ampify(html1);
	expect(result).toEqual(expect.stringContaining('<html ⚡'));
	expect(result).toEqual(expect.stringContaining('https://cdn.ampproject.org/v0.js'));
	expect(result).toEqual(expect.not.stringContaining('<style>'));
	fs.writeFileSync(path.resolve('./src/test/result1.html'), result, { encoding: 'utf-8'} )
});
