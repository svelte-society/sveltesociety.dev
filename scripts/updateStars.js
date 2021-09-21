/**
 * Script for updating github stars of repositories
 * Usage: GH_TOKEN=secret node scripts/updateStars.js
 *
 * GH_TOKEN - personal access token with repo scope
 */

import fs from 'fs';
import { request, gql } from 'graphql-request';
import prettier from 'prettier';

const files = [
	'src/routes/components/components.json',
	'src/routes/templates/templates.json',
	'src/routes/tools/tools.json'
];

if (!process.env.GH_TOKEN) {
	console.error('Error: env variable GH_TOKEN not set');
	process.exit(1);
}

const getRepo = ({ url }) => {
	const match = url.match(/(github.com|gitlab.com)\/([^#/]+)\/([^#/]+)/);
	if (match) {
		const [, site, owner, name] = match;
		const id = `${site}/${owner}/${name}`;
		return { site, owner, name, id };
	}
};

const reposWithDuplicates = files.flatMap(
	(file) =>
		JSON.parse(fs.readFileSync(file))
			.map(getRepo)
			.filter((x) => x) // filter undefined
);
const repos = getUnique(reposWithDuplicates);

const githubRepos = repos.filter((repo) => repo.site === 'github.com');
const gitlabRepos = repos.filter((repo) => repo.site === 'gitlab.com');

const gitlabRepoQuery = (repo, idx) => `
	r${idx}: project(fullPath: "${repo.owner}/${repo.name}") {
    ...frag
  }
`;

const gitlabQuery = gql`
	{
		${gitlabRepos.map(gitlabRepoQuery).join('')}
	}
	fragment frag on Project {
		starCount
		fullPath
	}
`;

const gitlabResponse = await request('https://gitlab.com/api/graphql', gitlabQuery);

const ghRepoQuery = (repo, idx) => `
  r${idx}: repository(owner: "${repo.owner}", name: "${repo.name}") {
    ...frag
  }
`;

const ghQuery = gql`
	{
		${githubRepos.map(ghRepoQuery).join('')}
	}
	fragment frag on Repository {
		resourcePath
		stargazerCount
	}
`;

const ghResponse = await request(
	'https://api.github.com/graphql',
	ghQuery,
	{},
	{ authorization: `token ${process.env.GH_TOKEN}` }
);

const repoData = {};

for (const repo of Object.values(gitlabResponse)) {
	repoData[`gitlab.com/${repo.fullPath}`] = { stars: repo.starCount };
}

for (const repo of Object.values(ghResponse)) {
	repoData[`github.com${repo.resourcePath}`] = { stars: repo.stargazerCount };
}

for (const file of files) {
	const data = JSON.parse(fs.readFileSync(file));
	for (const item of data) {
		const repo = getRepo(item);
		if (repo && repoData[repo.id]) {
			item.stars = repoData[repo.id].stars;
		}
	}
	prettySave(file, JSON.stringify(data), 'json');
}

/**
 * Format with prettier and save
 */
function prettySave(filePath, text, parser = 'babel') {
	prettier.resolveConfig(filePath).then((options) => {
		const formatted = prettier.format(text, { ...options, parser });
		fs.writeFileSync(filePath, formatted);
	});
}

function getUnique(repos) {
	const urls = repos.map((repo) => `${repo.site}/${repo.owner}/${repo.name}`);
	return [...new Set(urls)].map((url) => {
		const [site, owner, name] = url.split('/');
		return { site, owner, name };
	});
}
