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