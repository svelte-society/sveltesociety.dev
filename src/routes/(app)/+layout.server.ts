import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals }) => {
	// Get current user from locals if available
	const user = locals.user

	// Check if user is an admin (role === 1 based on schema.sql)
	const isAdmin = user?.role === 1

	// Get upcoming events for sidebar from API
	const upcomingEventsApi = await locals.eventsService.fetchUpcomingEventsFromAPI()

	// Process and limit to 5 events
	const upcomingEvents = upcomingEventsApi.slice(0, 5).map((event) => {
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

	return {
		user,
		isAdmin,
		upcomingEvents
	}
}
