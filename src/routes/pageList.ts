export type SvxMetadata<T extends object> = { metadata: T };

export async function getPages<T extends object>(
	metaGlob: Record<string, () => Promise<SvxMetadata<T>>> // Should be `ReturnType<vite.ImportGlobFunction>` but the ast function overload is pick, which is the wrong one
): Promise<Array<T & { filename: string; path: string }>> {
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
