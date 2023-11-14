export async function getPages(
	metaGlob: Record<
		string,
		() => Promise<{ metadata: { title: string; layout: string; date: string } }>
	>
) {
	const pages = await Promise.all(
		Object.entries(metaGlob).map(async ([fullPath, page]) => {
			const { metadata } = await page();
			const path = fullPath.replace('/+page.svx', '');
			const filename = path.split('/').pop();
			return { ...metadata, filename, path };
		})
	);
	return pages;
}
