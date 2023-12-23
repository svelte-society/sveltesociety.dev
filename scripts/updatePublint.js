// @ts-check
// Source: https://github.com/bluwy/publint/blob/master/site/src/utils/worker.js

import { writeFileSync } from 'node:fs';
import { inflate } from 'pako';
import getNpmTarballUrl from 'get-npm-tarball-url';
import { packagesSchema } from '../src/lib/schemas.js';
import packages from '../src/routes/packages/packages.json' assert { type: 'json' };
import npm from '../src/lib/data/npm.json' assert { type: 'json' };
import { publint } from 'publint';
import { untar } from './untar.js';
import { createTarballVfs } from './tarball.js';
import { chunk } from './chunk.js';

/** @param {import('zod').infer<typeof packagesSchema>} input */
const injectVersions = (input) => {
	const output = [];
	for (const item of input) {
		/** @type {string} */
		const version = npm[item.npm]?.version;
		if (version) {
			output.push({ ...item, version });
		}
	}
	return output;
};

const data = injectVersions(packagesSchema.parse(packages));

console.log('Found ' + data.length + ' packages');

const pagedData = chunk(data, 100);
const lines = [];

for (let index = 0; index < pagedData.length; index++) {
	const page = pagedData[index];
	console.log('Running for page ' + (index + 1) + '/' + pagedData.length);
	await Promise.all(
		page.map((pkg) => processPackage(pkg).catch((error) => console.log(error.message)))
	).then((values) => {
		lines.push(...values);
	});
}

const output = lines.reduce(
	(result, value) => Object.assign(result, value),
	/** @type {Record<string, any>} */ ({})
);

writeFileSync('src/lib/data/publint.json', JSON.stringify(output));

/** @param {ReturnType<typeof injectVersions>[0]} pkg */
async function processPackage(pkg) {
	const tarballUrl = getNpmTarballUrl(pkg.npm, pkg.version);
	let resultBuffer;
	try {
		const result = await fetch(tarballUrl);
		resultBuffer = await result.arrayBuffer();
	} catch (e) {
		postMessage({ type: 'error', data: 'Package not found' });
		console.error(e);
	}
	let files;
	try {
		const tarBuffer = inflate(resultBuffer).buffer; // Handles gzip (gz)
		files = untar(tarBuffer); // Handles tar (t)
	} catch (e) {
		postMessage({ type: 'error', data: 'Failed to unpack package' });
		console.error(e);
		return;
	}
	const vfs = createTarballVfs(files);

	const pkgDir = files.length ? files[0].name.split('/')[0] : 'package';
	const { messages } = await publint({ pkgDir, vfs, level: 'warning' });
	return { [pkg.npm]: { valid: messages.length === 0 } };
}
