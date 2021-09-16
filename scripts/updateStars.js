/**
 * Script for updating github stars of repositories
 * Usage: GH_TOKEN=secret node scripts/updateStars.js
 *
 * GH_TOKEN - personal access token with repo scope
 */

import fs from 'fs';
import { graphql } from '@octokit/graphql';
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

const getGithubRepo = ({ url }) => {
	const match = url.match(/github.com\/([^#/]+)\/([^#/]+)/);
	if (match) {
		const [, owner, name] = match;
		return `${owner}/${name}`;
	}
};

const repos = files.flatMap(
	(file) =>
		JSON.parse(fs.readFileSync(file))
			.map(getGithubRepo)
			.filter((x) => x) // filter undefined
);

const uniqueRepos = [...new Set(repos)].map((repo) => {
	const [owner, name] = repo.split('/');
	return { owner, name };
});

const repoQuery = (repo, id) => `
  r${id}: repository(owner: "${repo.owner}", name: "${repo.name}") {
    ...frag
  }
`;

const response = await graphql(
	/* GraphQL */ `
    {
      ${uniqueRepos.map(repoQuery).join('')}
    }
    fragment frag on Repository {
      owner {
        login
      }
      name
      stargazerCount
    }
  `,
	{
		headers: {
			authorization: `token ${process.env.GH_TOKEN}`
		}
	}
);

const repoData = Object.fromEntries(
	Object.values(response).map((repo) => [`${repo.owner.login}/${repo.name}`, repo])
);

for (const file of files) {
	const data = JSON.parse(fs.readFileSync(file));
	for (const item of data) {
		const repo = getGithubRepo(item);
		if (repo && repoData[repo]) {
			item.stars = repoData[repo].stargazerCount;
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
