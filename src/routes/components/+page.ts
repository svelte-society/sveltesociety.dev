import { error } from '@sveltejs/kit';
import type { RepoData } from '../../data/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const componentsData = import.meta.glob('../../data/components/*.json');
	const componentsPromises = Object.values(componentsData).map((importModule) => importModule());
	const components = (await Promise.all(componentsPromises)) as RepoData[];

	if (components) {
		return {
			components
		};
	}

	throw error(500);
};
