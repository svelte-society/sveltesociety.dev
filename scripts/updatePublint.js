// @ts-check
// Source: https://github.com/bluwy/publint/blob/master/site/src/utils/worker.js

import { writeFileSync } from 'node:fs';
import { inflate } from 'pako';
import getNpmTarballUrl from 'get-npm-tarball-url';
import { componentsSchema } from '../src/lib/schemas.js';
import components from '../src/routes/components/components.json' assert { type: 'json' };
import npm from '../src/lib/npm.json' assert { type: 'json' };
import { publint } from 'publint';
import { untar } from './untar.js';
import { createTarballVfs } from './tarball.js';

const dataWithoutVersions = componentsSchema.parse(components);

/** @param input {import('zod').infer<typeof componentsSchema>} */
const injectVersions = (input) => {
	const output = [];
	for (const item of input) {
		/** @type {string} */
		const version = npm[item.npm].version;
		if (version) {
			output.push({ ...item, version });
		}
	}
	return output;
};

const dataWithVersions = injectVersions(dataWithoutVersions);

const output = await Promise.all(
	dataWithVersions.map(async (pkg) => {
		try {
			return await processPackage(pkg);
		} catch (error) {
			console.log(error.message);
		}
	})
).then((values) => {
	let versions = {};
	for (const value of values) {
		if (value) {
			versions[value.name] = value.valid;
		}
	}
	return versions;
});

writeFileSync('src/lib/data/publint.json', JSON.stringify(output));

/** @param pkg {ReturnType<typeof injectVersions>[0]} */
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
	return { name: pkg.npm, valid: messages.length === 0 };
}
