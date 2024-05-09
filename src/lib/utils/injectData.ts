import github from '$lib/data/github.json';
import gitlab from '$lib/data/gitlab.json';
import npm from '$lib/data/npm.json';
import publint from '$lib/data/publint.json';
import type { z } from 'zod';
import type { packagesSchema, templatesSchema } from '$lib/schemas';

export const injectData = (input: z.infer<typeof packagesSchema | typeof templatesSchema>) => {
	const output: z.infer<typeof packagesSchema | typeof templatesSchema> = [];
	for (const item of input) {
		// Github
		const githubIndex = Object.keys(github).find((key) => normalize(item.repository) === key);
		const githubExtra = github[githubIndex] ?? {};

		// Gitlab
		const gitlabIndex = Object.keys(gitlab).find((key) => normalize(item.repository) === key);
		const gitlabExtra = gitlab[gitlabIndex] ?? {};

		// NPM
		const npmExtra = npm[item.npm] ?? {};

		// Publint
		const publintExtra = publint[item.npm] ?? {};

		output.push({ ...item, ...githubExtra, ...gitlabExtra, ...npmExtra, ...publintExtra });
	}
	return output;
};

function normalize(item: string) {
	// want to only keep repository portion and want to strip trailing slashes
	// e.g. https://github.com/microsoft/fast/tree/master/examples/svelte-starters/svelte-fast-starter
	return item.toLowerCase().split('/').slice(0, 5).join('/');
}
