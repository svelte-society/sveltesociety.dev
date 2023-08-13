import core from '@actions/core';
import { readFileSync, writeFileSync } from 'node:fs';
import { fetch } from 'undici';

const ghGraphQlUrl = 'https://api.github.com/graphql';
const gitlabGraphQlUrl = 'https://gitlab.com/api/graphql';
const githubNameRegexp = new RegExp(
	'https://github.com/([a-zA-Z0-9][a-zA-Z0-9-]{0,38}/[a-zA-Z0-9._-]{1,100})'
);
const gitlabNameRegExp = new RegExp('https://gitlab.com/([\\w-]+/[\\w-]+)');

async function doGraphQlQuery(url, query, headers = {}) {
	try {
		let fetchResponse = await fetch(url, {
			body: JSON.stringify({ query }),
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				...headers
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
	let components = JSON.parse(readFileSync('src/routes/components/components.json'));
	let tools = JSON.parse(readFileSync('src/routes/tools/tools.json'));
	let templates = JSON.parse(readFileSync('src/routes/templates/templates.json'));

	return [
		...components.map((component) => component.url),
		...tools.map((tool) => tool.url),
		...templates.map((template) => template.url)
	];
}

// Github

/**
 * Get all GitHub repositories
 * @returns {Array<{owner: string, repo: string}>}
 */
function getAllGHRepos() {
	return gatherUrls()
		.filter((url) => url !== false && githubNameRegexp.test(url))
		.map((gitHubUrl) => gitHubUrl.match(githubNameRegexp)[1].toLowerCase())
		.map((validName) => ({ owner: validName.split('/')[0], repo: validName.split('/')[1] }));
}

function ghRepoGraphQl({ owner, repo }) {
	let identifier = owner + '_' + repo + '_' + Math.random() + '';
	identifier = identifier.replace(/[^a-zA-Z0-9_]/g, '_');
	identifier = identifier.replace(/^[0-9]/g, '_');
	return `${identifier}: repository(name: "${repo}", owner: "${owner}"){nameWithOwner stargazerCount}`;
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
 * @returns {Promise<Record<string, number>>}
 */
async function getGHStars() {
	const repoData = getAllGHRepos();
	core.info('Found ' + repoData.length + ' repositories');
	const pagedRepoData = chunk(repoData, 100);
	const pageCount = pagedRepoData.length;
	core.debug('Divide the repositories into ' + pageCount + ' pages (of 100 repositories)');
	let lines = [];
	for (let index = 0; index < pageCount; index++) {
		const page = pagedRepoData[index];
		core.debug('Running GraphQL for page ' + (index + 1) + '/' + pageCount);
		let body =
			'query{' + '\n' + page.map((repoInfo) => ghRepoGraphQl(repoInfo)).join('\n') + '\n' + '}';
		lines = [
			...lines,
			...(await doGraphQlQuery(ghGraphQlUrl, body, {
				authorization:
					'Bearer ' +
					core.getInput('token', {
						// required: true,
						trimWhitespace: true
					})
			}))
		];
	}
	return Object.fromEntries(
		lines
			.filter((line) => line?.nameWithOwner)
			.map((line) => [line.nameWithOwner.toLowerCase(), line.stargazerCount])
			.sort()
	);
}

// Gitlab

/**
 * Get all GitLab repositories path (relative to GitLab root)
 * @returns {Array<string>}
 */
function getAllGitlabRepos() {
	return gatherUrls()
		.filter((url) => url !== false && gitlabNameRegExp.test(url))
		.map((url) => url.match(gitlabNameRegExp)[1]);
}

function gitlabRepoGraphQl(name) {
	let identifier = name + '_' + Math.random() + '';
	identifier = identifier.replace(/[^a-zA-Z0-9_]+/g, '_');
	identifier = identifier.replace(/^[0-9]/g, '_');
	return `${identifier}: project(fullPath: "${name}"){starCount fullPath}`;
}

/**
 * Get the number of stars for all Gitlab repositories.
 * The result is a Map where the key the repo name and the value is the number of stars.
 * @returns {Promise<Record<string, number>>}
 */
async function getGitlabStars() {
	const repoData = getAllGitlabRepos();
	core.info('Found ' + repoData.length + ' repositories');
	const pagedRepoData = chunk(repoData, 100);
	const pageCount = pagedRepoData.length;
	core.debug('Divide the repositories into ' + pageCount + ' pages (of 100 repositories)');
	let lines = [];
	for (let index = 0; index < pageCount; index++) {
		const page = pagedRepoData[index];
		core.debug('Running GraphQL for page ' + (index + 1) + '/' + pageCount);
		let body =
			'query{' + '\n' + page.map((repoInfo) => gitlabRepoGraphQl(repoInfo)).join('\n') + '\n' + '}';
		lines = [...lines, ...(await doGraphQlQuery(gitlabGraphQlUrl, body))];
	}
	return Object.fromEntries(
		lines
			.filter((line) => line?.fullPath)
			.map((line) => [line.fullPath.toLowerCase(), line.starCount])
			.sort()
	);
}

async function main() {
	core.startGroup('GitHub');
	const github = await getGHStars();
	core.endGroup();

	core.startGroup('GitLab');
	const gitlab = await getGitlabStars();
	core.endGroup();

	core.info(
		`\tGithub: ${Object.keys(github).length} repositories (${Object.values(github).reduce(
			(count, item) => count + item,
			0
		)} stars)`
	);
	core.info(
		`\tGitlab: ${Object.keys(gitlab).length} repositories (${Object.values(gitlab).reduce(
			(count, item) => count + item,
			0
		)} stars)`
	);
	writeFileSync('src/lib/stars.json', JSON.stringify({ github, gitlab }));
}

try {
	core.info('Start');
	main().then(() => core.info('Done'));
} catch (error) {
	core.setFailed(error);
}
