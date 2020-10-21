import { join, resolve } from 'path';
import { lstatSync, readdirSync, realpathSync } from 'fs';

export function totalist(dir, callback, prefix, cache) {
	prefix = prefix || '';
	cache = cache || new Set;
	cache.add(dir = resolve('.', dir));

	let i=0, abs, stats;
	let arr = readdirSync(dir);
	for (; i < arr.length; i++) {
		stats = lstatSync(abs = join(dir, arr[i]));
		stats.isDirectory() && (!stats.isSymbolicLink() || !cache.has(realpathSync(abs)))
			? totalist(abs, callback, join(prefix, arr[i]), cache)
			: callback(join(prefix, arr[i]), abs, stats);
	}
}
