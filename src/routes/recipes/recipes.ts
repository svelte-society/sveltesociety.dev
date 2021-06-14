/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get() {
	const categories = await Promise.all(
		Object.entries(import.meta.glob('./**/*.svx'))
		.filter(([path, page]) => path.includes('index'))
		.map(async ([path, page]) => {
			const { metadata } = await page();
			const filename = path.split('/').pop();
			path = 'recipes' + path.substring(1, path.length - 'index.svx'.length);
			// TODO: populate children
			return { meta: metadata, filename, path, children: [] };
		})
	);

	if (categories) {
		return {
			body: categories
		};
	}
	return {
		error: new Error(),
		body: undefined
	};
}
