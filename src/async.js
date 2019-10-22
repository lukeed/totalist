const { join } = require('path');
const { readdir, stat } = require('fs');
const { promisify } = require('util');

const toStats = promisify(stat);
const toRead = promisify(readdir);

export default async function list(dir, callback, pre='') {
	let abs, stats;
	let arr = await toRead(dir);
	for (let str of arr) {
		abs = join(dir, str);
		stats = await toStats(abs);
		await (
			stats.isDirectory()
			? list(abs, callback, join(pre, str))
			: callback(join(pre, str), abs, stats)
		);
	}
}
