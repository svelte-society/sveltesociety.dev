import { search_content } from '$lib/server/db/search'
import { get_content_by_ids, get_tags_for_content } from '$lib/server/db/content'
import { get_user_likes_and_saves } from '$lib/server/db/interactions'
import { json } from '@sveltejs/kit'

// Rate limit configuration
const RATE_LIMIT = 3 // Number of requests allowed
const TIME_WINDOW = 10 * 1000 // Time window in milliseconds (1 minute)

// In-memory store for rate limiting
const rateLimitStore = new Map<string, { count: number; timestamp: number }>()

export const GET = async ({ params, locals }) => {
	const hits = search_content(params.query)

	const content = get_content_by_ids(hits)

	const tags = get_tags_for_content(content.map((c) => c.id))

	let content_with_tags = content.map((c, i) => ({ ...c, tags: tags[i] || [] }))

	if (locals.user) {
		const { user_likes, user_saves } = get_user_likes_and_saves(
			locals.user.id,
			content.map((c) => c.id)
		)

		content_with_tags = content_with_tags.map((c, i) => ({
			...c,
			liked: user_likes.has(c.id),
			saved: user_saves.has(c.id)
		}))
	}

	return json(content_with_tags)
}

function rateLimit(ip: string): boolean {
	const now = Date.now()
	const userRateLimit = rateLimitStore.get(ip)

	if (!userRateLimit) {
		rateLimitStore.set(ip, { count: 1, timestamp: now })
		return true
	}

	if (now - userRateLimit.timestamp > TIME_WINDOW) {
		rateLimitStore.set(ip, { count: 1, timestamp: now })
		return true
	}

	if (userRateLimit.count < RATE_LIMIT) {
		rateLimitStore.set(ip, { count: userRateLimit.count + 1, timestamp: userRateLimit.timestamp })
		return true
	}

	return false
}
