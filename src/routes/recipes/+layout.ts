import { error } from '@sveltejs/kit';
import { getPages } from '$lib/pageList';
import type { SvxMetadata } from '$lib/pageList';
import type { RecipeMetadata } from '$lib/Mdsvx';

export async function load() {
	const pages = (
		await getPages<RecipeMetadata>(import.meta.glob<SvxMetadata<RecipeMetadata>>('./**/*.svx'))
	).map((element) => ({
		...element,
		path: '/recipes' + element.path.substring(1)
	}));
	const categories = pages.filter((page) => page.layout === 'recipeCategory');

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
			categories
		};
	}
	error(500);
}
