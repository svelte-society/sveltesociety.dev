import type { SocialTemplate } from '$lib/schema/social'

interface ContentData {
	title: string
	description?: string
	slug: string
	url?: string
	tags?: string[]
	author?: string
	type: string
}

/**
 * Generate post text from a template and content data
 */
export function generatePostText(template: SocialTemplate, content: ContentData): string {
	let postText = template.template

	// Build full URL if not provided
	const fullUrl =
		content.url || `https://sveltesociety.dev/${content.type}s/${content.slug}`

	// Format tags as comma-separated string or hashtags
	const tagsString = content.tags?.join(', ') || ''

	// Replace all template variables
	const replacements: Record<string, string> = {
		'{{title}}': content.title,
		'{{description}}': content.description || '',
		'{{slug}}': content.slug,
		'{{url}}': fullUrl,
		'{{tags}}': tagsString,
		'{{author}}': content.author || ''
	}

	// Perform replacements
	for (const [placeholder, value] of Object.entries(replacements)) {
		postText = postText.replace(new RegExp(placeholder, 'g'), value)
	}

	// Clean up any double line breaks or trailing spaces
	postText = postText
		.replace(/\n\n\n+/g, '\n\n') // Replace 3+ line breaks with 2
		.trim()

	return postText
}

/**
 * Generate posts for all active platforms using default templates
 */
export async function generatePostsForContent(
	contentId: string,
	contentType: string,
	socialService: any,
	contentService: any
): Promise<
	Array<{
		platform: string
		postText: string
		templateId: string
	}>
> {
	// Get content details
	const content = contentService.getContentById(contentId)
	if (!content) {
		throw new Error('Content not found')
	}

	// Get all templates for this content type
	const allTemplates = socialService.getTemplates()
	const defaultTemplates = allTemplates.filter(
		(t: SocialTemplate) => t.content_type === contentType && t.is_default
	)

	// Generate posts for each default template
	const generatedPosts = defaultTemplates.map((template: SocialTemplate) => {
		const postText = generatePostText(template, {
			title: content.title,
			description: content.description || '',
			slug: content.slug,
			tags: content.tags || [],
			author: content.author || content.created_by,
			type: contentType,
			url: content.url
		})

		return {
			platform: template.platform,
			postText,
			templateId: template.id
		}
	})

	return generatedPosts
}
