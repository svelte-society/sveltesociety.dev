// @ts-check

import { writeFileSync } from 'node:fs';
import { promisify } from 'node:util';
import { exec } from 'node:child_process';
import { componentsSchema } from '../src/lib/schemas.js';
import components from '../src/routes/components/components.json' assert { type: 'json' };

const execAsync = promisify(exec);

const data = componentsSchema.parse(components);

const { versions, dates, support } = await Promise.all(
	data.map(async (pkg) => {
		try {
			return await processPackage(pkg);
		} catch (error) {
			console.log(error.message);
		}
	})
).then((values) => {
	let versions = {};
	let dates = {};
	let support = {};
	for (const value of values) {
		if (value) {
			versions[value.name] = value.version;
			dates[value.name] = value.date;
			support[value.name] = value.support;
		}
	}
	return { versions, dates, support };
});

writeFileSync('src/lib/versions.json', JSON.stringify(versions));
writeFileSync('src/lib/dates.json', JSON.stringify(dates));
writeFileSync('src/lib/support.json', JSON.stringify(support));

/** @param pkg {ReturnType<typeof data>[0]} */
async function processPackage(pkg) {
	const { stdout } = await execAsync(`npm view ${pkg.npm} --json`);
	const data = JSON.parse(stdout.toString());
	const version = data.version;
	const date = data.time[version];
	const support = data.peerDependencies?.svelte ? data.peerDependencies.svelte : 'Unknown';
	return { name: pkg.npm, version: version, date: date, support: support };
}
