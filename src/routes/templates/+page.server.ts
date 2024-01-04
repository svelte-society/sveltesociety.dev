import { templatesSchema } from '$lib/schemas.js';
import { getCategories } from '$utils/getCategories';
import { injectData } from '$utils/injectData';
import templates from './templates.json';

export const prerender = false;

export const load = async ({ url }) => {
	const data = injectData(templatesSchema.parse(templates));

	const selectedCategories = url.searchParams.getAll('category');

	if (!selectedCategories) {
		return { templates: data, categories: getCategories(data), selectedCategories: [] };
	}

	const filteredData = data.filter((entry) => {
		return selectedCategories.every((val) => entry.categories.includes(val));
	});

	return { templates: filteredData, categories: getCategories(filteredData), selectedCategories };
};
