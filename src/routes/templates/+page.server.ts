import { templatesSchema } from '$lib/schemas.js';
import { getTags } from "$utils/getTags";
import { injectData } from '$utils/injectData';
import templates from './templates.json';

export const load = async ({ url }) => {
	const data = injectData(templatesSchema.parse(templates));

	const tagsParam = url.searchParams.get('tags');

	if (!tagsParam) {
		return { templates: data, tags: getTags(data), selectedTags: [] };
	}

    const selectedTags = tagsParam.split(',')

	const filteredData = data.filter((entry) => {
		return selectedTags.every((val) => entry.tags.includes(val));
	});

	return { templates: filteredData, tags: getTags(filteredData), selectedTags };
};
