// @ts-check

import { writeFileSync } from 'node:fs';
import { promisify } from 'node:util';
import { exec } from 'node:child_process';
import { componentsSchema } from '../src/lib/schemas.js';
import components from '../src/routes/components/components.json' assert { type: 'json' };

const execAsync = promisify(exec);

const data = componentsSchema.parse(components);

const npm = await Promise.all(
	data.map((pkg) => processPackage(pkg).catch((error) => console.log(error.message)))
).then((values) => {
	return values.filter(Boolean).reduce(
		(result, value) => {
			result.versions[value.name] = value.version;
			result.dates[value.name] = value.date;
			result.support[value.name] = value.support;
			return result;
		},
		{ versions: {}, dates: {}, support: {} }
	);
});

writeFileSync('src/lib/npm.json', JSON.stringify(npm));

/** @param {ReturnType<typeof data>[0]} pkg */
async function processPackage(pkg) {
	const { stdout } = await execAsync(`npm view ${pkg.npm} --json`);
	const data = JSON.parse(stdout.toString());
	const version = data.version;
	const date = data.time[version];
	const support = data.peerDependencies?.svelte ? data.peerDependencies.svelte : 'Unknown';
	return { name: pkg.npm, version: version, date: date, support: support };
}
