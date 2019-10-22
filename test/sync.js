import test from 'tape';
import totalist from '../src/sync';

test('(sync) exports', t => {
	t.is(typeof totalist, 'function');
	t.end();
});
