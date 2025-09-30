import { writeFileSync } from 'node:fs';
import { packagesSchema, templatesSchema } from '../src/lib/schemas.js';
import packages from '../src/routes/packages/packages.json' with { type: 'json' };
import templates from '../src/routes/templates/templates.json' with { type: 'json' };
import { chunk } from './chunk.js';

const gitlabGraphQlUrl = 'https://gitlab.com/api/graphql';
const gitlabNameRegExp = new RegExp('https://gitlab.com/([\\w-]+/[\\w-]+)');

/**
 * @param {string} url
 * @param {string} query
 * @return {Promise<any[]>}
 */
async function doGraphQlQuery(url, query) {
	try {
		let fetchResponse = await fetch(url, {
			body: JSON.stringify({ query }),
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			}
		});
		let data = await fetchResponse.json();
		return Object.values(data.data || {});
	} catch (e) {
		console.error(e.message);
	}
	return [];
}

function getAllGitlabRepos() {
	const repos = [
		...packagesSchema.parse(packages).map((i) => i.repository),
		...templatesSchema.parse(templates).map((i) => i.repository)
	];
	return repos.filter((url) => url && gitlabNameRegExp.test(url));
}

/**
 * @param {string} url
 */
function gitlabRepoGraphQl(url) {
	const name = url.match(gitlabNameRegExp)[1];
	let identifier = name + '_' + Math.random() + '';
	identifier = identifier.replace(/[^a-zA-Z0-9_]+/g, '_');
	identifier = identifier.replace(/^[0-9]/g, '_');
	return `${identifier}: project(fullPath: "${name}"){starCount webUrl}`;
}

/**
 * Get the number of stars for all Gitlab repositories.
 * The result is a Map where the key the repo name and the value is the number of stars.
 * @returns {Promise<Record<string, {stars: number}>>}
 */
async function getGitlabStars() {
	const repoData = getAllGitlabRepos();
	console.log('Found ' + repoData.length + ' repositories');
	const pagedRepoData = chunk(repoData, 100);
	const pageCount = pagedRepoData.length;
	let lines = [];
	for (let index = 0; index < pageCount; index++) {
		const page = pagedRepoData[index];
		console.log('Running GraphQL for page ' + (index + 1) + '/' + pageCount);
		const body =
			'query{' + '\n' + page.map((repoInfo) => gitlabRepoGraphQl(repoInfo)).join('\n') + '\n' + '}';
		lines.push(...(await doGraphQlQuery(gitlabGraphQlUrl, body)));
	}

	return Object.fromEntries(
		lines
			.filter((line) => line?.webUrl)
			.map((line) => [line.webUrl.toLowerCase(), { stars: line.starCount }])
			.sort()
	);
}

const gitlab = await getGitlabStars();

console.log(
	`Gitlab: ${Object.keys(gitlab).length} repositories (${Object.values(gitlab).reduce(
		(count, item) => count + item.stars,
		0
	)} stars)`
);

writeFileSync('src/lib/data/gitlab.json', JSON.stringify(gitlab));
