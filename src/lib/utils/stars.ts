import stars from '$lib/stars.json';

type RepoInfo = {
	type: 'Github' | 'Gitlab';
	identifier: string;
};

const githubNameRegexp = new RegExp(
	'https://github.com/([a-zA-Z0-9][a-zA-Z0-9-]{0,38}/[a-zA-Z0-9._-]{1,100})'
);
const gitlabNameRegExp = new RegExp('https://gitlab.com/([\\w-]+/[\\w-]+)');

export function getStarsCount(repositoryUrl: string): number | undefined {
	let repoInfo = getType(repositoryUrl);
	if (repoInfo === null) {
		return undefined;
	}
	return stars[repoInfo.type === 'Gitlab' ? 'gitlab' : 'github'][repoInfo.identifier] ?? undefined;
}

function getType(repositoryUrl: string): RepoInfo | null {
	if (githubNameRegexp.test(repositoryUrl)) {
		let identifier = repositoryUrl.match(githubNameRegexp)[1].toLowerCase();
		return {
			type: 'Github',
			identifier
		};
	}
	if (gitlabNameRegExp.test(repositoryUrl)) {
		let identifier = repositoryUrl.match(gitlabNameRegExp)[1].toLowerCase();
		return {
			type: 'Gitlab',
			identifier
		};
	}
	return null;
}
