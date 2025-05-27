import { json, error } from '@sveltejs/kit'
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
		const { title, body, description, type, existingTags } = await request.json()

		if (!title && !body && !description) {
			throw error(400, 'At least one of title, body, or description is required')
		}

		// Use the LLM service to suggest tags
		const suggestedTags = await locals.llmService.suggestTags({
			title: title || '',
			body: body || '',
			description: description || '',
			type: type || 'content',
			existingTags: existingTags || []
		})

		// Get full tag objects for the suggested tags
		const allTags = locals.tagService.getAllTags()
		const tagObjects = suggestedTags
			.map(tagName => allTags.find(tag => tag.name === tagName))
			.filter(Boolean)

		return json({ 
			tags: tagObjects,
			tagNames: suggestedTags 
		})
	} catch (err) {
		console.error('Error suggesting tags:', err)

		if (err instanceof Error && err.message.includes('API key')) {
			throw error(500, 'AI service authentication failed')
		}

		throw error(500, 'Failed to suggest tags')
	}
}