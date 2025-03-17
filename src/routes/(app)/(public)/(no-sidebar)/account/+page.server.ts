import type { PageServerLoad } from './$types'
import { redirect } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login')
	}
	
	// Get user likes and saves counts using the service from locals
	const interactions = locals.interactionsService.getUserLikesAndSavesCount(locals.user.id)
	
	return {
		user: locals.user,
		...interactions
	}
}
