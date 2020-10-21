import { join, resolve } from 'path';
import { readdirSync, statSync, realpathSync } from 'fs';

export function totalist(dir, callback, pre='', chain=[]) {
	dir = resolve('.', dir);
	let link = realpathSync.native(dir);
	if (chain.includes(link)) return;
	let arr = readdirSync(link);
	let i=0, abs, stats;
	for (; i < arr.length; i++) {
		abs = join(dir, arr[i]);
		stats = statSync(abs);
		stats.isDirectory()
			? totalist(abs, callback, join(pre, arr[i]), chain.concat(link))
			: callback(join(pre, arr[i]), abs, stats);
	}
}
