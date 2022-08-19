import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async function () {
	const pages = await Promise.all(
		Object.entries(import.meta.glob('./**/*.svx')).map(async ([path, page]) => {
			const { metadata } = await page();
			const filename = path.split('/').pop();
			path = '/recipes' + path.substring(1, path.length - '.svx'.length);
			if (path.endsWith('/index')) {
				path = path.substring(0, path.length - '/index'.length);
			}
			return { meta: metadata, filename, path };
		})
	);

	const categories = pages.filter((page) => page.meta.layout === 'recipeCategory');

	categories.forEach((category) => {
		category.children = [];
		pages.forEach((p) => {
			if (category !== p && p.path.startsWith(category.path)) {
				category.children.push(p);
			}
		});
	});

	if (categories) {
		return {
			body: categories
		};
	}
	return {
		error: new Error(),
		body: undefined
	};
};
