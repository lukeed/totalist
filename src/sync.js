const { join } = require('path');
const { readdirSync, statSync } = require('fs');

export default function list(dir, callback, pre='') {
	let i=0, abs, stats;
	let arr = readdirSync(dir);
	for (; i < arr.length; i++) {
		abs = join(dir, arr[i]);
		stats = statSync(abs);
		stats.isDirectory()
			? list(abs, callback, join(pre, arr[i]))
			: callback(join(pre, arr[i]), abs, stats);
	}
}
