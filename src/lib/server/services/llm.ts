import { anthropic } from '@ai-sdk/anthropic'
import { generateText } from 'ai'
import type { TagService } from './tags'

export class LLMService {
	private model = anthropic('claude-3-5-sonnet-latest')

	constructor(private tagsService?: TagService) {}

	/**
	 * Generate a description for content based on its body
	 */
	async generateDescription(content: {
		title: string
		body?: string
		type: string
	}): Promise<string> {
		const prompt = `Generate a concise, engaging description (50-80 words) for this ${content.type} content. Focus on what readers will learn or gain:

Title: ${content.title}
${content.body ? `Content: ${content.body.substring(0, 1000)}...` : ''}

Write only the description, no additional text.`

		const { text } = await generateText({
			model: this.model,
			prompt,
			temperature: 0.7
		})

		return text.trim()
	}

	/**
	 * Suggest relevant tags for content
	 */
	async suggestTags(content: {
		title: string
		body?: string
		description?: string
		type: string
		existingTags?: string[]
	}): Promise<string[]> {
		// Get all available tags from the database
		const availableTags = this.tagsService?.getAllTags() || []
		const tagNames = availableTags.map((tag: any) => tag.name)

		if (tagNames.length === 0) {
			return []
		}

		const prompt = `Analyze this ${content.type} content and suggest the most relevant tags from the available list.

Title: ${content.title}
${content.description ? `Description: ${content.description}` : ''}
${content.body ? `Content excerpt: ${content.body.substring(0, 1500)}...` : ''}
${content.existingTags?.length ? `Currently selected tags: ${content.existingTags.join(', ')}` : ''}

Available tags: ${tagNames.join(', ')}

Rules:
1. Only suggest tags from the available list above
2. Suggest 3-7 most relevant tags
3. Consider the content type (${content.type}) when selecting tags
4. Prioritize tags that accurately describe the main topics, technologies, or concepts
5. If the content mentions specific frameworks, tools, or technologies that match available tags, include them

Return only a comma-separated list of tag names, nothing else.`

		try {
			const { text } = await generateText({
				model: this.model,
				prompt,
				temperature: 0.3 // Lower temperature for more consistent tag selection
			})

			// Parse the response and validate against available tags
			const suggestedTags = text
				.split(',')
				.map((tag) => tag.trim())
				.filter((tag) => tag && tagNames.includes(tag))
				.filter((tag, index, self) => self.indexOf(tag) === index) // Remove duplicates

			// If we already have existing tags, filter them out from suggestions
			if (content.existingTags?.length) {
				return suggestedTags.filter((tag) => !content.existingTags!.includes(tag))
			}

			return suggestedTags
		} catch (error) {
			console.error('Error suggesting tags:', error)
			return []
		}
	}

	/**
	 * Generate a slug-friendly version of a title
	 */
	async generateSlug(title: string, existingSlugs: string[] = []): Promise<string> {
		const prompt = `Generate a URL-friendly slug for this title: "${title}"

Rules:
1. Use only lowercase letters, numbers, and hyphens
2. No spaces or special characters
3. Should be concise but descriptive
4. Maximum 60 characters
5. Must be unique - these slugs already exist: ${existingSlugs.join(', ')}

Return only the slug, nothing else.`

		const { text } = await generateText({
			model: this.model,
			prompt,
			temperature: 0.3
		})

		return text
			.trim()
			.toLowerCase()
			.replace(/[^a-z0-9-]/g, '')
	}

	/**
	 * Improve or rewrite content
	 */
	async improveContent(content: {
		body: string
		type: string
		tone?: 'professional' | 'casual' | 'technical' | 'beginner-friendly'
	}): Promise<string> {
		const toneDescriptions = {
			professional: 'professional and formal',
			casual: 'casual and conversational',
			technical: 'technical and detailed',
			'beginner-friendly': 'beginner-friendly and accessible'
		}

		const prompt = `Improve this ${content.type} content while maintaining its core message. Make it more ${toneDescriptions[content.tone || 'professional']}.

Original content:
${content.body}

Improve the content by:
1. Fixing any grammar or spelling errors
2. Improving clarity and flow
3. Enhancing the structure with proper headings if needed
4. Making it more engaging
5. Keeping the same general length

Return only the improved content in markdown format.`

		const { text } = await generateText({
			model: this.model,
			prompt,
			temperature: 0.6
		})

		return text.trim()
	}
}
