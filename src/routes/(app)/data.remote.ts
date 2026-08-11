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

export const getSidebarJobs = query(async () => {
	const { locals } = getRequestEvent()


	// Use SQLite for this high-traffic sidebar query. Repeated Orama searches caused
	// unbounded memory growth under production request volume.
	const jobs = locals.contentService
		.getFilteredContent({ type: 'job', status: 'published', limit: 20, sort: 'latest' })
		// Sort by tier (premium first, then featured, then basic) and then by created_at
		.sort((a, b) => {
			const tierOrder: Record<string, number> = { premium: 0, featured: 1, basic: 2 }
			const aTier = tierOrder[a.metadata?.tier_name || 'basic'] ?? 2
			const bTier = tierOrder[b.metadata?.tier_name || 'basic'] ?? 2
			if (aTier !== bTier) return aTier - bTier
			// Within same tier, sort by created_at (newest first)
			return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
		})
		// Limit to 5
		.slice(0, 5)
		// Transform to sidebar format
		.map((job) => ({
			id: job.id,
			slug: job.slug,
			title: job.title,
			company_name: job.metadata?.company_name || 'Unknown Company',
			company_logo: job.metadata?.company_logo || null,
			remote_status: job.metadata?.remote_status || 'remote',
			location: job.metadata?.location || null,
			tier_name: job.metadata?.tier_name,
			salary_min: job.metadata?.salary_min || null,
			salary_max: job.metadata?.salary_max || null,
			salary_currency: job.metadata?.salary_currency || null
		}))

	return jobs
})

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
