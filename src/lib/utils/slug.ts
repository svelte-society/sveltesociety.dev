/**
 * Generate a URL-safe slug from text
 * @param text - The text to slugify
 * @param maxLength - Maximum length of the slug (default: 50)
 */
export function generateSlug(text: string, maxLength = 50): string {
	return text
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '')
		.slice(0, maxLength)
}
