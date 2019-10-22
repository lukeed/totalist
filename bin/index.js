const { join } = require('path');
const { promisify } = require('util');
const { execFile } = require('child_process');
const { readFile, writeFile } = require('fs');
const premove = require('premove');

const run = promisify(execFile);
const write = promisify(writeFile);
const read = promisify(readFile);

const bundt = require.resolve('bundt');

function capitalize(str) {
	return str[0].toUpperCase() + str.substring(1);
}

async function mode(name, toMove) {
	let { stdout } = await run(bundt, [`src/${name}.js`]);

	let diff = 8 - name.length;
	let spacer1 = ' '.repeat(diff < 0 ? 0 : diff);
	let spacer2 = ' '.repeat(diff < 0 ? diff * -1 : 0);

	process.stdout.write(
		stdout.replace('Filename' + spacer2, capitalize(name) + spacer1)
	);

	if (toMove) await run('mv', ['dist', name]);
}

(async function () {
	// Purge
	await premove('sync');
	await premove('dist');

	// Build modes (order matters)
	await mode('sync', true);
	await mode('async');

	// Copy types over for "sync" dir
	// type toAdd = (fn: Function) => void;
	await read('index.d.ts', 'utf8').then(str => {
		return write(
			join('sync', 'index.d.ts'),
			str.replace(
				`declare function totalist(dir: string, callback: Caller): Promise<void>;`,
				`declare function totalist(dir: string, callback: Caller): void;`,
			)
		);
	});
})().catch(err => {
	console.error('ERROR:', err);
	process.exit(1);
});
