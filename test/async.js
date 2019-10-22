import test from 'tape';
import totalist from '../src/async';

test('(async) exports', t => {
	t.is(typeof totalist, 'function');
	t.end();
});
