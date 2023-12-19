// @ts-check

import { writeFileSync } from 'node:fs';
import { promisify } from 'node:util';
import { exec } from 'node:child_process';
import { packagesSchema } from '../src/lib/schemas.js';
import packages from '../src/routes/packages/packages.json' assert { type: 'json' };

const execAsync = promisify(exec);

const data = packagesSchema.parse(packages);

const npm = await Promise.all(
	data.map((pkg) => processPackage(pkg).catch((error) => console.log(error.message)))
).then((values) => {
	return values.reduce((result, value) => Object.assign(result, value), {});
});

writeFileSync('src/lib/data/npm.json', JSON.stringify(npm));

/** @param {ReturnType<typeof data>[0]} pkg */
async function processPackage(pkg) {
	if (!pkg.npm) {
		throw new Error(`npm field missing from ${pkg.title} (skipping)`);
	}
	const { stdout } = await execAsync(`npm view ${pkg.npm} --json`);
	const data = JSON.parse(stdout.toString());
	const version = data.version;
	const date = data.time[version];
	const support = data.peerDependencies?.svelte ? data.peerDependencies.svelte : 'Unknown';
	return { [pkg.npm]: { version: version, date: date, support: support } };
}
