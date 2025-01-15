// @ts-check
// Source: https://github.com/bluwy/publint/blob/master/site/src/utils/worker.js

import { writeFileSync } from 'node:fs';
import getNpmTarballUrl from 'get-npm-tarball-url';
import { packagesSchema } from '../src/lib/schemas.js';
import packages from '../src/routes/packages/packages.json' assert { type: 'json' };
import npm from '../src/lib/data/npm.json' assert { type: 'json' };
import { publint } from 'publint';
import { chunk } from './chunk.js';

/** @param {import('zod').infer<typeof packagesSchema>} input */
const injectVersions = (input) => {
	const output = [];
	for (const item of input) {
		if (!('npm' in item)) {
			continue;
		}
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
	try {
		const result = await fetch(tarballUrl);
		const resultBuffer = await result.arrayBuffer();
		const { messages } = await publint({ pack: { tarball: resultBuffer }, level: 'warning' });
		return { [pkg.npm]: { valid: messages.length === 0 } };
	} catch (e) {
		postMessage({ type: 'error', data: 'Package not found' });
		console.error(e);
	}
}
