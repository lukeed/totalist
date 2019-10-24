import test from 'tape';
import { join, normalize } from 'path';
import totalist from '../src/async';

const fixtures = join(__dirname, 'fixtures');

test('(async) exports', t => {
	t.is(typeof totalist, 'function');
	t.end();
});


test('(async) usage :: relative', async t => {
	t.plan(21);

	let count = 0;
	let styles = [];
	let scripts = [];

	// +3 x 6
	await totalist('test/fixtures', (name, abs, stats) => {
		count++;
		t.false(stats.isDirectory(), 'file is not a directory');
		t.true(abs.startsWith(fixtures), '~> `abs` is absolute');
		t.false(name.startsWith(fixtures), '~> `name` is NOT absolute');
		(/\.js$/.test(name) ? scripts : styles).push(name);
	});

	t.is(count, 6, 'saw 6 files total');

	t.same(scripts.sort(), ['aaa/index.js', 'bbb/ccc/index.js', 'bbb/index.js'].map(normalize).sort(), 'script `name` values are expected');
	t.same(styles.sort(), ['aaa/index.css', 'bbb/ccc/index.css', 'bbb/index.css'].map(normalize).sort(), 'style `name` values are expected');
});


test('(async) usage :: absolute', async t => {
	t.plan(21);

	let count = 0;
	let styles = [];
	let scripts = [];

	// +3 x 6
	await totalist(fixtures, (name, abs, stats) => {
		count++;
		t.false(stats.isDirectory(), 'file is not a directory');
		t.true(abs.startsWith(fixtures), '~> `abs` is absolute');
		t.false(name.startsWith(fixtures), '~> `name` is NOT absolute');
		(/\.js$/.test(name) ? scripts : styles).push(name);
	});

	t.is(count, 6, 'saw 6 files total');

	t.same(scripts.sort(), ['aaa/index.js', 'bbb/ccc/index.js', 'bbb/index.js'].map(normalize).sort(), 'script `name` values are expected');
	t.same(styles.sort(), ['aaa/index.css', 'bbb/ccc/index.css', 'bbb/index.css'].map(normalize).sort(), 'style `name` values are expected');
});
