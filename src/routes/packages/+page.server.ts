import { packagesSchema } from '$lib/schemas.js';
import { injectData } from '$utils/injectData';
import packages from './packages.json';

export const load = async ({ url }) => {
	const data = injectData(packagesSchema.parse(packages));

	const tags = url.searchParams.get('tags').split(',');
	console.log(tags);

	if (!tags) {
		return { packages: data };
	}

	const filteredData = data.filter((entry) => {
		return tags.every((val) => entry.tags.includes(val));
	});

	return { packages: filteredData };
};
