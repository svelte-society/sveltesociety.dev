import { packagesSchema } from '$lib/schemas.js';
import { injectData } from '$utils/injectData';
import packages from './packages.json';

export const load = async ({ url }) => {
	const data = injectData(packagesSchema.parse(packages));

	const tagsParam = url.searchParams.get('tags');

	if (!tagsParam) {
		return { packages: data, tags: [] };
	}

    const tags = tagsParam.split(',')

	const filteredData = data.filter((entry) => {
		return tags.every((val) => entry.tags.includes(val));
	});

	return { packages: filteredData, tags };
};
