import { join, resolve } from 'path';
import { lstat, readdir, realpath } from 'fs';
import { promisify } from 'util';

const real = promisify(realpath);
const toStats = promisify(lstat);
const list = promisify(readdir);

export async function totalist(dir, callback, prefix, cache) {
	cache = cache || new Set;
	cache.add(dir = resolve('.', dir));

	await list(dir).then(arr => {
		return Promise.all(
			arr.map(str => {
				let abs = join(dir, str);
				return toStats(abs).then(async stats => {
					return stats.isDirectory() && (!stats.isSymbolicLink() || !cache.has(await real(abs)))
						? totalist(abs, callback, join(prefix || '', str))
						: callback(join(prefix || '', str), abs, stats)
				});
			})
		);
	});
}
