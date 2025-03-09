import { get_user_likes_and_saves_count } from '$lib/server/db/interactions'
import type { PageServerLoad } from './$types'
import { redirect } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login')
	}
	
	// Convert string ID to number
	const userId = parseInt(locals.user.id);
	return get_user_likes_and_saves_count(userId)
}
