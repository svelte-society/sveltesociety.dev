import { packagesSchema } from '$lib/schemas.js';
import { getCategories } from '$utils/getCategories';
import { injectData } from '$utils/injectData';
import packages from './packages.json';

export const prerender = false;

export const load = async ({ url }) => {
	const data = injectData(packagesSchema.parse(packages));

	const selectedCategories = url.searchParams.getAll('category');

	if (!selectedCategories) {
		return { packages: data, categories: getCategories(data), selectedCategories: [] };
	}

	const filteredData = data.filter((entry) => {
		return selectedCategories.every((val) => entry.categories.includes(val));
	});

	return { packages: filteredData, categories: getCategories(filteredData), selectedCategories };
};
