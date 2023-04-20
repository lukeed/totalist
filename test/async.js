import * as fs from 'fs';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { join, normalize } from 'path';
import { totalist } from '../src/async';

const fixtures = join(__dirname, 'fixtures');

test('(async) exports', () => {
	assert.type(totalist, 'function');
});


test('(async) usage :: relative', async () => {
	let count = 0;
	let styles = [];
	let scripts = [];

	// +3 x 6
	await totalist('test/fixtures', (name, abs, stats) => {
		count++;
		assert.not(stats.isDirectory(), 'file is not a directory');
		assert.ok(abs.startsWith(fixtures), '~> `abs` is absolute');
		assert.not(name.startsWith(fixtures), '~> `name` is NOT absolute');
		(/\.js$/.test(name) ? scripts : styles).push(name);
	});

	assert.is(count, 6, 'saw 6 files total');

	assert.equal(scripts.sort(), ['aaa/index.js', 'bbb/ccc/index.js', 'bbb/index.js'].map(normalize).sort(), 'script `name` values are expected');
	assert.equal(styles.sort(), ['aaa/index.css', 'bbb/ccc/index.css', 'bbb/index.css'].map(normalize).sort(), 'style `name` values are expected');
});


test('(async) usage :: absolute', async () => {
	let count = 0;
	let styles = [];
	let scripts = [];

	// +3 x 6
	await totalist(fixtures, (name, abs, stats) => {
		count++;
		assert.not(stats.isDirectory(), 'file is not a directory');
		assert.ok(abs.startsWith(fixtures), '~> `abs` is absolute');
		assert.not(name.startsWith(fixtures), '~> `name` is NOT absolute');
		(/\.js$/.test(name) ? scripts : styles).push(name);
	});

	assert.is(count, 6, 'saw 6 files total');

	assert.equal(scripts.sort(), ['aaa/index.js', 'bbb/ccc/index.js', 'bbb/index.js'].map(normalize).sort(), 'script `name` values are expected');
	assert.equal(styles.sort(), ['aaa/index.css', 'bbb/ccc/index.css', 'bbb/index.css'].map(normalize).sort(), 'style `name` values are expected');
});


test('usage :: symbolic directory', async () => {
	let symlink = join(fixtures, 'symlink');
	fs.symlinkSync(fixtures, symlink);

	try {
		let count = 0;
		let items = {};

		await totalist(fixtures, (name, abs, stats) => {
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
