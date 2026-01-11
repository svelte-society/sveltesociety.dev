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
		const { body, title, type } = await request.json()

		if (!body || body.trim() === '') {
			throw error(400, 'Body content is required')
		}

		// Use the LLM service to generate description
		const description = await locals.llmService.generateDescription({
			title: title || '(No title provided)',
			body,
			type: type || 'content'
		})

		return json({ description })
	} catch (err) {
		console.error('Error generating description:', err)

		if (err instanceof Error && err.message.includes('API key')) {
			throw error(500, 'AI service authentication failed')
		}

		throw error(500, 'Failed to generate description')
	}
}
