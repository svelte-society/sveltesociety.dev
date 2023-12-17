// @ts-check

import { writeFileSync } from 'node:fs';
import { promisify } from 'node:util';
import { exec } from 'node:child_process';
import { componentsSchema, toolsSchema } from '../src/lib/schemas.js';
import components from '../src/routes/components/components.json' assert { type: 'json' };
import tools from '../src/routes/tools/tools.json' assert { type: 'json' };

const execAsync = promisify(exec);

const data = [...componentsSchema.parse(components), ...toolsSchema.parse(tools)];

const npm = await Promise.all(
	data.map((pkg) => processPackage(pkg).catch((error) => console.log(error.message)))
).then((values) => {
	return values.reduce((result, value) => Object.assign(result, value), {});
});

writeFileSync('src/lib/npm.json', JSON.stringify(npm));

/** @param {ReturnType<typeof data>[0]} pkg */
async function processPackage(pkg) {
	if (!pkg.npm) {
		throw new Error('npm field missing - skipping');
	}
	const { stdout } = await execAsync(`npm view ${pkg.npm} --json`);
	const data = JSON.parse(stdout.toString());
	const version = data.version;
	const date = data.time[version];
	const support = data.peerDependencies?.svelte ? data.peerDependencies.svelte : 'Unknown';
	return { [pkg.npm]: { version: version, date: date, support: support } };
}
