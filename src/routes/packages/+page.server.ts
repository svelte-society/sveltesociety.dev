import { packagesSchema } from '$lib/schemas.js';
import { injectData } from '$utils/injectData';
import packages from './packages.json';

export const load = async ({ url }) => {
	const data = injectData(packagesSchema.parse(packages));

	const tagsParam = url.searchParams.get('tags');

	if (!tagsParam) {
		return { packages: data, tags: getTags(data), selectedTags: [] };
	}

    const selectedTags = tagsParam.split(',')

	const filteredData = data.filter((entry) => {
		return selectedTags.every((val) => entry.tags.includes(val));
	});

	return { packages: filteredData, tags: getTags(filteredData), selectedTags };
};

const getTags = (input) => {
	const output = []
	input.forEach((item) => {
		item.tags.forEach((tag) => {
			if (!output.includes(tag)) {
				output.push(tag)
			}
		})
	})
	return output
}
