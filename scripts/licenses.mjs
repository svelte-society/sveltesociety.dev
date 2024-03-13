import { join, dirname } from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';

const filePath = join(
	dirname(import.meta.url).replace(/file:\/\//, ''),
	'..',
	'src',
	'routes',
	'licenses',
	'licenses.json'
);

/**
 *
 * @return {Record<string, Array<{name: string, version: string, path: string, license: string, author?: string, homepage: string, description?: string}>>}
 */
function read() {
	return JSON.parse(readFileSync(filePath, { encoding: 'utf-8' }));
}

/**
 *
 * @param {Record<string, Array<{name: string, version: string, path: string, license: string, author?: string, homepage: string, description?: string}>>} licenses
 * @return {Record<string, Array<{name: string, version: string, author?: string, homepage: string, description?: string}>>}
 */
function clean(licenses) {
	return Object.fromEntries(
		Object.entries(licenses).map(([key, license]) => [key, cleanLicense(license)])
	);
}

/**
 *
 * @param {Array<{name: string, version: string, path: string, license: string, author?: string, homepage: string, description?: string}>} license
 * @return {Array<{name: string, version: string, author?: string, homepage: string, description?: string}>}
 */
function cleanLicense(license) {
	return license.map((item) => {
		delete item['path'];
		delete item['license'];
		return item;
	});
}

function write() {
	writeFileSync(filePath, JSON.stringify(clean(read())), { encoding: 'utf-8' });
}

write();
