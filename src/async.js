import { join, resolve } from 'path';
import { lstat, readdir, realpath } from 'fs';
import { promisify } from 'util';

const real = promisify(realpath);
const toStats = promisify(lstat);
const list = promisify(readdir);

export async function totalist(dir, callback, prefix, cache) {
	cache = cache || new Set;
	dir = await real(resolve('.', dir));
	if (cache.has(dir)) return;

	cache.add(dir);
	await list(dir).then(arr => {
		return Promise.all(
			arr.map(str => {
				let abs = join(dir, str);
				return toStats(abs).then(stats => {
					return stats.isDirectory()
						? totalist(abs, callback, join(prefix || '', str), cache)
						: callback(join(prefix || '', str), abs, stats)
				});
			})
		);
	});
}
