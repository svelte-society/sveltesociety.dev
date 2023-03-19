import { error } from '@sveltejs/kit';
import type { RepoData } from '../../data/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const templatesData = import.meta.glob('../../data/templates/*.json');
	const templatesPromises = Object.values(templatesData).map((importModule) => importModule());
	const templates = (await Promise.all(templatesPromises)) as RepoData[];

	if (templates) {
		return {
			templates
		};
	}

	throw error(500);
};
