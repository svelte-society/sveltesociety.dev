import { error } from '@sveltejs/kit';
import '$styles/highlight.css';
import { getPages } from '$lib/pageList';

/** @type {import('./$types').LayoutLoad} */
export const load = async () => {
	const pages = (await getPages(import.meta.glob('./**/*.svx'))).map((element) => ({
		...element,
		path: '/recipes' + element.path.substring(1)
	}));
	const categories = pages.filter((page) => page.layout === 'recipeCategory');

	categories.forEach((category) => {
		// @ts-ignore
		category.children = [];
		pages.forEach((p) => {
			if (category !== p && p.path.startsWith(category.path)) {
				// @ts-ignore
				category.children.push(p);
			}
		});
	});

	if (categories) {
		return {
			categories
		};
	}
	throw error(500);
};
