import { json, error } from '@sveltejs/kit'
import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import type { RequestHandler } from './$types'
import { ANTHROPIC_API_KEY } from '$env/static/private'

export const POST: RequestHandler = async ({ request, locals }) => {
	// Check if user is authenticated
	if (!locals.user) {
		throw error(401, 'Unauthorized')
	}

	// Get user's role
	const userRole = locals.roleService.getRoleById(locals.user.role)

	// Check if user has admin or moderator role
	const isAuthorized =
		userRole && userRole.active && (userRole.value === 'admin' || userRole.value === 'moderator')

	if (!isAuthorized) {
		throw error(403, 'Forbidden')
	}

	// Check if API key is configured
	const apiKey = ANTHROPIC_API_KEY
	if (!apiKey) {
		throw error(500, 'AI service not configured')
	}

	try {
		const { body, title, type } = await request.json()

		if (!body || body.trim() === '') {
			throw error(400, 'Body content is required')
		}

		// Create a prompt based on the content type
		const typeInstructions = {
			recipe: 'a recipe or code snippet',
			video: 'a video tutorial',
			library: 'a library or tool',
			announcement: 'an announcement',
			showcase: 'a project showcase',
			blog: 'a blog post',
			link: 'a resource link',
			event: 'an event',
			collection: 'a collection of resources'
		}

		const contentTypeDesc = typeInstructions[type as keyof typeof typeInstructions] || 'content'

		const prompt = `Generate a concise, engaging description (2-3 sentences max) for ${contentTypeDesc} about Svelte or web development.

Title: ${title || '(No title provided)'}

Content:
${body}

Instructions:
- Write in present tense
- Focus on what the content provides or teaches
- Be specific and informative
- Avoid marketing language
- Keep it under 160 characters if possible
- Do not include quotation marks

Description:`

		const { text } = await generateText({
			model: anthropic('claude-3-5-sonnet-latest'),
			prompt,
			temperature: 0.7,
			maxTokens: 100
		})

		// Clean up the response
		const description = text.trim().replace(/^["']|["']$/g, '')

		return json({ description })
	} catch (err) {
		console.error('Error generating description:', err)

		if (err instanceof Error && err.message.includes('API key')) {
			throw error(500, 'AI service authentication failed')
		}

		throw error(500, 'Failed to generate description')
	}
}
