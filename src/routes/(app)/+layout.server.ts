import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals }) => {
	// Get current user from locals if available
	const user = locals.user

	// Check if user is an admin (role === 1 based on schema.sql)
	const isAdmin = user?.role === 1

	// Get active header announcements
	const headerAnnouncements = locals.announcementService.getActivePlacementsByLocationKey('header')
	const activeHeaderAnnouncement =
		headerAnnouncements.length > 0
			? {
				href: headerAnnouncements[0].slug
					? `/${headerAnnouncements[0].metadata?.type || 'announcement'}/${headerAnnouncements[0].slug}`
					: '#',
				text: headerAnnouncements[0].title
			}
			: null

	return {
		user,
		isAdmin,
		announcement: activeHeaderAnnouncement
	}
}
