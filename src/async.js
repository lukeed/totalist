import { join, resolve } from 'path';
import { readdir, stat } from 'fs';
import { promisify } from 'util';

const toStats = promisify(stat);
const toRead = promisify(readdir);

export default async function list(dir, callback, pre='') {
	dir = resolve('.', dir);
	let arr = await toRead(dir);
	let str, abs, stats;
	for (str of arr) {
		abs = join(dir, str);
		stats = await toStats(abs);
		await (
			stats.isDirectory()
			? list(abs, callback, join(pre, str))
			: callback(join(pre, str), abs, stats)
		);
	}
}
