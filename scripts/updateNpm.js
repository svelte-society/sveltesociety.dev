// @ts-check

import { writeFileSync } from 'node:fs';
import { promisify } from 'node:util';
import { exec } from 'node:child_process';
import { packagesSchema } from '../src/lib/schemas.js';
import packages from '../src/routes/packages/packages.json' assert { type: 'json' };
import { chunk } from './chunk.js';

const execAsync = promisify(exec);

const data = packagesSchema.parse(packages);

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

writeFileSync('src/lib/data/npm.json', JSON.stringify(output));

/** @param {import('zod').infer<typeof packagesSchema>[0]} pkg */
async function processPackage(pkg) {
	const { stdout } = await execAsync(`npm view ${pkg.npm} --json`);
	const data = JSON.parse(stdout.toString());
	const version = data.version;
	const date = data.time[version];
	const support = data.peerDependencies?.svelte ? data.peerDependencies.svelte : 'Unknown';
	const keywords = data.keywords;
	return { [pkg.npm]: { version, date, support, keywords } };
}
