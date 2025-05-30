import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ params, locals }) => {
	const { username } = params

	// Get user by username
	const user = locals.userService.getUserByUsername(username)

	if (!user) {
		throw error(404, 'User not found')
	}

	// Get role information
	const role = locals.roleService.getRoleById(user.role)

	// Get content posted by this user
	const userContent = locals.contentService
		.getFilteredContent({
			status: 'published',
			limit: 20,
			sort: 'latest'
		})
		.filter((content) => content.author_id === user.id)

	// Get stats using the interactions service
	const stats = locals.interactionsService.getUserContentStats(user.id)

	return {
		user: {
			...user,
			role: role?.name || 'member'
		},
		content: userContent,
		stats
	}
}
