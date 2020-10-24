import { join, resolve } from 'path';
import { lstatSync, readdirSync, realpathSync } from 'fs';

export function totalist(dir, callback, prefix, cache) {
	cache = cache || new Set;
	dir = realpathSync(resolve('.', dir));
	if (!cache.has(dir)) {
		cache.add(dir);
		let i=0, abs, stats;
		let arr = readdirSync(dir);
		for (; i < arr.length; i++) {
			stats = lstatSync(abs = join(dir, arr[i]));
			stats.isDirectory()
				? totalist(abs, callback, join(prefix || '', arr[i]), cache)
				: callback(join(prefix || '', arr[i]), abs, stats);
		}
	}
}
