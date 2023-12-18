import github from '$lib/data/github.json';
import gitlab from '$lib/data/gitlab.json';
import npm from '$lib/data/npm.json';
import publint from '$lib/data/publint.json';
import type { z } from 'zod';
import type { componentsSchema } from '$lib/schemas';

export const injectData = (input: z.infer<typeof componentsSchema>) => {
	const output = [];
	for (const item of input) {
		// Github
		const githubIndex = Object.keys(github).find((key) =>
			item.repository.toLowerCase().includes(key)
		);
		const githubExtra = github[githubIndex] ?? {};

		// Gitlab
		const gitlabIndex = Object.keys(gitlab).find((key) =>
			item.repository.toLowerCase().includes(key)
		);
		const gitlabExtra = gitlab[gitlabIndex] ?? {};

		// NPM
		const npmExtra = npm[item.npm] ?? {};

		// Publint
		const publintExtra = publint[item.npm] ?? {};

		output.push({ ...item, ...githubExtra, ...gitlabExtra, ...npmExtra, ...publintExtra });
	}
	return output;
};
