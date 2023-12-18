import { writeFileSync } from 'node:fs';
import { componentsSchema, templatesSchema, toolsSchema } from '../src/lib/schemas.js';
import components from '../src/routes/components/components.json' assert { type: 'json' };
import templates from '../src/routes/templates/templates.json' assert { type: 'json' };
import tools from '../src/routes/tools/tools.json' assert { type: 'json' };

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

function gatherUrls() {
	return [
		...componentsSchema.parse(components).map((component) => component.repository),
		...templatesSchema.parse(templates).map((template) => template.repository),
		...toolsSchema.parse(tools).map((tool) => tool.repository)
	];
}

/**
 * Divide an array into multiple smaller array
 * @param {string[]} input
 * @param {number} size
 * @return {string[][]}
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
 * Get all GitLab repositories path (relative to GitLab root)
 * @returns {string[]}
 */
function getAllGitlabRepos() {
	return gatherUrls().filter((url) => url && gitlabNameRegExp.test(url));
}

/**
 * Get all GitLab repositories path (relative to GitLab root)
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
