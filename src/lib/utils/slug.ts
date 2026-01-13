/**
 * Generate a URL-safe slug from a title.
 * Note: Database triggers may automatically append IDs to make slugs unique.
 */
export function generateSlug(title: string): string {
	return title
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '')
		.slice(0, 50)
}
