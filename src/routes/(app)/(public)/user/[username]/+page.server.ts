import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import { buildSeoConfig } from '$lib/seo'

export const load: PageServerLoad = async ({ params, locals, url }) => {
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

	// Build SEO meta for user profile
	const meta = buildSeoConfig({
		title: `${user.full_name || username} (@${username}) - Svelte Society`,
		description: `View ${user.full_name || username}'s profile and contributions on Svelte Society`,
		url: url.toString(),
		type: 'profile',
		profile: {
			firstName: user.full_name?.split(' ')[0],
			lastName: user.full_name?.split(' ').slice(1).join(' '),
			username: username
		}
	})

	return {
		user: {
			...user,
			role: role?.name || 'member'
		},
		content: userContent,
		stats,
		meta
	}
}
