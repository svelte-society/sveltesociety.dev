import { error } from '@sveltejs/kit';
import type { RepoData } from '../../data/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const toolsData = import.meta.glob('../../data/tools/*.json');
	const toolsPromises = Object.values(toolsData).map((importModule) => importModule());
	const tools = (await Promise.all(toolsPromises)) as RepoData[];

	if (tools) {
		return {
			tools
		};
	}

	throw error(500);
};
