import { error } from '@sveltejs/kit';
import '$styles/highlight.css';
import { getPages } from '$lib/pageList';

export const load = async () => {
	const pages = (await getPages(import.meta.glob('./**/*.svx'))).map((element) => ({
		...element,
		path: '/recipes' + element.path.substring(1)
	}));
	const categories = pages.filter((page) => page.layout === 'recipeCategory');

	const categoriesWithChildren = categories.map((category) => {
		const children = [];
		pages.forEach((p) => {
			if (category !== p && p.path.startsWith(category.path)) {
				children.push(p);
			}
		});
		return { ...category, children };
	});

	if (categoriesWithChildren) {
		return {
			categories: categoriesWithChildren
		};
	}
	throw error(500);
};
