import * as fs from 'fs';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { join, normalize } from 'path';
import { totalist } from '../src/sync';

const fixtures = join(__dirname, 'fixtures');

test('exports', () => {
	assert.type(totalist, 'function');
});

test('usage :: relative', () => {
	let count = 0;
	let styles = [];
	let scripts = [];

	// +3 x 6
	totalist('test/fixtures', (name, abs, stats) => {
		count++;
		assert.not(stats.isDirectory(), 'file is not a directory');
		assert.ok(abs.startsWith(fixtures), '~> `abs` is absolute');
		assert.not(name.startsWith(fixtures), '~> `name` is NOT absolute');
		(/\.js$/.test(name) ? scripts : styles).push(name);
	});

	assert.is(count, 6, 'saw 6 files total');

	assert.equal(scripts, ['aaa/index.js', 'bbb/ccc/index.js', 'bbb/index.js'].map(normalize), 'script `name` values are expected');
	assert.equal(styles, ['aaa/index.css', 'bbb/ccc/index.css', 'bbb/index.css'].map(normalize), 'style `name` values are expected');
});


test('usage :: absolute', () => {
	let count = 0;
	let styles = [];
	let scripts = [];

	// +3 x 6
	totalist(fixtures, (name, abs, stats) => {
		count++;
		assert.not(stats.isDirectory(), 'file is not a directory');
		assert.ok(abs.startsWith(fixtures), '~> `abs` is absolute');
		assert.not(name.startsWith(fixtures), '~> `name` is NOT absolute');
		(/\.js$/.test(name) ? scripts : styles).push(name);
	});

	assert.is(count, 6, 'saw 6 files total');

	assert.equal(scripts, ['aaa/index.js', 'bbb/ccc/index.js', 'bbb/index.js'].map(normalize), 'script `name` values are expected');
	assert.equal(styles, ['aaa/index.css', 'bbb/ccc/index.css', 'bbb/index.css'].map(normalize), 'style `name` values are expected');
});


test('usage :: symbolic directory', () => {
	let symlink = join(fixtures, 'symlink');
	fs.symlinkSync(fixtures, symlink);

	try {
		let count = 0;
		let items = {};

		totalist(fixtures, (name, abs, stats) => {
			count++;
			assert.not(stats.isDirectory(), 'file is not a directory');
			assert.ok(abs.startsWith(fixtures), '~> `abs` is absolute');
			assert.not(name.startsWith(fixtures), '~> `name` is NOT absolute');
			assert.is(stats.isSymbolicLink(), abs === symlink);

			items[abs] = (items[abs] || 0) + 1;
		});

		const keys = Object.keys(items);
		assert.is(count, 7, 'saw 7 files total');
		assert.is(keys.length, 7, '~> unique file paths');
		assert.ok(keys.every(k => items[k] === 1), '~> saw each item once');
	} finally {
		fs.unlinkSync(symlink);
	}
});


test.run();
