import type { PageServerLoad } from './$types'

export const load = (() => {
	return {
		meta: {
			title: 'Announcement Placements - Admin',
			description: 'Manage announcement placements'
		}
	}
}) satisfies PageServerLoad
