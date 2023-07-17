export async function getPages(
	metaGlob: Array<string>
): Promise<Array<{ [key: string]: string; filename: string; path: string; title?: string }>> {
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
