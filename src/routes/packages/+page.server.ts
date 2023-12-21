import { packagesSchema } from '$lib/schemas.js';
import { getTags } from '$utils/getTags';
import { injectData } from '$utils/injectData';
import packages from './packages.json';

export const prerender = false;

export const load = async ({ url }) => {
	const data = injectData(packagesSchema.parse(packages));

	const tagsParam = url.searchParams.get('tags');

	if (!tagsParam) {
		return { packages: data, tags: getTags(data), selectedTags: [] };
	}

	const selectedTags = tagsParam.split(',');

	const filteredData = data.filter((entry) => {
		return selectedTags.every((val) => entry.tags.includes(val));
	});

	return { packages: filteredData, tags: getTags(filteredData), selectedTags };
};
