import { query } from '$app/server'
import { getRequestEvent } from '$app/server'

// Re-export shared getTags (returns raw tag objects)
export { getTagsRaw as getTags } from '$lib/remote/tags.remote'

export const getUpcomingEvents = query(() => [])

export const getHeaderAnnouncement = query(() => {
	const { locals } = getRequestEvent()
	const headerAnnouncements = locals.announcementService.getActivePlacementsByLocationKey('header')
	return headerAnnouncements.length > 0
		? {
				href: headerAnnouncements[0].slug
					? `/${headerAnnouncements[0].metadata?.type || 'announcement'}/${headerAnnouncements[0].slug}`
					: '#',
				text: headerAnnouncements[0].title
			}
		: null
})

export const getUser = query(() => {
	const { locals } = getRequestEvent()

	return locals.user
})

export const getSidebarShortcuts = query(() => {
	const { locals } = getRequestEvent()
	const shortcuts = locals.shortcutService.getActiveShortcuts()

	return shortcuts.map((shortcut) => ({
		name: shortcut.label || shortcut.title,
		href: `/${shortcut.type}/${shortcut.slug}`
	}))
})

export const getSidebarJobs = query(() => [])

export const getSidebarSponsors = query(async () => {
	const { locals } = getRequestEvent()

	// Get active sponsors with tier info
	const sponsors = locals.sponsorService.getActiveSponsorsWithTiers()

	// Filter for sidebar display and transform to sidebar format
	return sponsors
		.filter((sponsor) => sponsor.show_in_sidebar)
		.sort((a, b) => {
			// Premium (large logo) first, then by company name
			if (a.logo_size === 'large' && b.logo_size !== 'large') return -1
			if (a.logo_size !== 'large' && b.logo_size === 'large') return 1
			return a.company_name.localeCompare(b.company_name)
		})
		.slice(0, 5)
		.map((sponsor) => ({
			id: sponsor.id,
			company_name: sponsor.company_name,
			logo_url: sponsor.logo_url,
			tagline: sponsor.tagline,
			website_url: sponsor.website_url,
			discount_code: sponsor.discount_code,
			discount_description: sponsor.discount_description,
			tier_name: sponsor.tier_name,
			logo_size: sponsor.logo_size
		}))
})
