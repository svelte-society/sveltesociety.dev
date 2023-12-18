import { writeFileSync } from 'node:fs';
import { componentsSchema, templatesSchema, toolsSchema } from '../src/lib/schemas.js';
import components from '../src/routes/components/components.json' assert { type: 'json' };
import templates from '../src/routes/templates/templates.json' assert { type: 'json' };
import tools from '../src/routes/tools/tools.json' assert { type: 'json' };

const ghGraphQlUrl = 'https://api.github.com/graphql';
const githubNameRegexp = new RegExp(
	'https://github.com/([a-zA-Z0-9][a-zA-Z0-9-]{0,38}/[a-zA-Z0-9._-]{1,100})'
);

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
				'content-type': 'application/json',
				authorization: `Bearer ${process.env.GITHUB_TOKEN}`
			}
		});
		let data = await fetchResponse.json();
		return Object.values(data.data || {});
	} catch (e) {
		console.error(e.message);
	}
	return [];
}

function gatherUrls() {
	return [
		...componentsSchema.parse(components).map((component) => component.repository),
		...templatesSchema.parse(templates).map((template) => template.repository),
		...toolsSchema.parse(tools).map((tool) => tool.repository)
	];
}

/**
 * Get all GitHub repositories
 * @returns {Array<{owner: string, repo: string}>}
 */
function getAllGHRepos() {
	return gatherUrls()
		.filter((url) => url && githubNameRegexp.test(url))
		.map((gitHubUrl) => gitHubUrl.match(githubNameRegexp)[1].toLowerCase())
		.map((validName) => ({ owner: validName.split('/')[0], repo: validName.split('/')[1] }));
}

function ghRepoGraphQl({ owner, repo }) {
	let identifier = owner + '_' + repo + '_' + Math.random() + '';
	identifier = identifier.replace(/[^a-zA-Z0-9_]/g, '_');
	identifier = identifier.replace(/^[0-9]/g, '_');
	return `${identifier}: repository(name: "${repo}", owner: "${owner}"){url stargazerCount}`;
}

/**
 * Divide an array into multiple smaller array
 * @param {Array} input
 * @param {number} size
 * @return {Array<Array>}
 */
function chunk(input, size) {
	size = size < 1 ? 10 : size;
	const pages = Math.ceil(input.length / size);
	const final = [];
	for (let index = 0; index < pages; index++) {
		final.push(input.slice(index * size, (index + 1) * size));
	}
	return final;
}

/**
 * Get the number of stars for all GitHub repositories.
 * The result is a Map where the key the repo name and the value is the number of stars.
 * @returns {Promise<Record<string, {stars: number}>>}
 */
async function getGHStars() {
	const repoData = getAllGHRepos();
	console.log('Found ' + repoData.length + ' repositories');
	const pagedRepoData = chunk(repoData, 100);
	const pageCount = pagedRepoData.length;
	let lines = [];
	for (let index = 0; index < pageCount; index++) {
		const page = pagedRepoData[index];
		console.log('Running GraphQL for page ' + (index + 1) + '/' + pageCount);
		let body =
			'query{' + '\n' + page.map((repoInfo) => ghRepoGraphQl(repoInfo)).join('\n') + '\n' + '}';
		lines.push(...(await doGraphQlQuery(ghGraphQlUrl, body)));
	}
	return Object.fromEntries(
		lines
			.filter((line) => line?.url)
			.map((line) => [line.url.toLowerCase(), { stars: line.stargazerCount }])
			.sort()
	);
}

const github = await getGHStars();

console.log(
	`Github: ${Object.keys(github).length} repositories (${Object.values(github).reduce(
		(count, item) => count + item.stars,
		0
	)} stars)`
);

writeFileSync('src/lib/data/github.json', JSON.stringify(github));
