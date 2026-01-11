import { query } from '$app/server'
import { getRequestEvent } from '$app/server'

export const getTags = query(async () => {
	const { locals } = getRequestEvent()
	const tags = locals.tagService.getAllTags()
	return tags
})

export const getUpcomingEvents = query(async () => {
	const { locals } = getRequestEvent()
	// Get upcoming events for sidebar from API
	const upcomingEventsApi = await locals.eventsService.fetchUpcomingEventsFromAPI()

	// Process and limit to 5 events
	return upcomingEventsApi.slice(0, 5).map((event) => {
		// Extract presentations
		const presentations =
			event.presentations?.edges?.map((edge) => {
				let presenterName = 'Unknown'

				// Handle different presenter formats
				if (edge.node.presenter) {
					if (typeof edge.node.presenter === 'object' && edge.node.presenter.firstName) {
						presenterName =
							`${edge.node.presenter.firstName} ${edge.node.presenter.lastName || ''}`.trim()
					} else if (typeof edge.node.presenter === 'string') {
						presenterName = edge.node.presenter
					}
				} else if (edge.node.presenterFirstName || edge.node.presenterLastName) {
					presenterName =
						`${edge.node.presenterFirstName || ''} ${edge.node.presenterLastName || ''}`.trim()
				}

				return {
					title: edge.node.title,
					presenter: presenterName,
					description: edge.node.description,
					videoUrl: edge.node.videoSourceUrl
				}
			}) || []

		return {
			type: 'event',
			slug: event.slug,
			title: event.name,
			metadata: {
				startTime: event.startAt,
				endTime: event.endAt,
				location: undefined, // TODO: Could extract from venue
				url: event.fullUrl || event.shortUrl,
				presentations,
				socialCardUrl: event.uploadedSocialCard?.url
			}
		}
	})
})

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

	// Get published jobs
	const searchResults = locals.searchService.search({
		types: ['job'],
		status: 'published',
		limit: 20 // Get more to filter and sort
	})

	// Get full job data
	const now = new Date().toISOString()
	const jobs = searchResults.hits
		.map((hit) => locals.contentService.getContentById(hit.id))
		.filter((job): job is NonNullable<typeof job> => job !== null)
		// Filter out expired jobs
		.filter((job) => {
			const expiresAt = job.metadata?.expires_at
			return !expiresAt || expiresAt > now
		})
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
