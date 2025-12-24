import { buildStaticPageMeta } from '$lib/seo'
import type { PageServerLoad } from './$types'

const EVENTS_META = buildStaticPageMeta(
	'Events',
	'Join us at upcoming Svelte Society events, meetups, and workshops',
	'https://sveltesociety.dev/events'
)

export const load: PageServerLoad = async ({ locals }) => {
	try {
		// Fetch upcoming and past events from the API
		const [upcomingEventsApi, pastEventsApi] = await Promise.all([
			locals.eventsService.fetchUpcomingEventsFromAPI(),
			locals.eventsService.fetchPastEventsFromAPI()
		])

		// Ensure we have arrays
		const apiUpcomingEvents = Array.isArray(upcomingEventsApi) ? upcomingEventsApi : []
		const apiPastEvents = Array.isArray(pastEventsApi) ? pastEventsApi : []

		// Helper function to process API events
		const processApiEvents = (apiEvents: any[]) => {
			return apiEvents.map((event) => {
				// Extract location from venue coordinates
				let location = undefined
				if (event.venue?.address?.location?.geojson?.coordinates) {
					// TODO: Could reverse geocode coordinates to get actual location
					location = undefined
				}

				// Extract presentations
				const presentations =
					event.presentations?.edges?.map((edge) => {
						let presenterName = 'Unknown'

						// Handle different presenter formats
						if (edge.node.presenter) {
							if (typeof edge.node.presenter === 'object' && edge.node.presenter.firstName) {
								// Presenter is an object with firstName/lastName
								presenterName =
									`${edge.node.presenter.firstName} ${edge.node.presenter.lastName || ''}`.trim()
							} else if (typeof edge.node.presenter === 'string') {
								// Presenter is a string
								presenterName = edge.node.presenter
							}
						} else if (edge.node.presenterFirstName || edge.node.presenterLastName) {
							// Fall back to separate first/last name fields
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
					id: event.id,
					slug: event.slug,
					title: event.name,
					description: event.description,
					startTime: event.startAt,
					endTime: event.endAt,
					location: location,
					url: event.fullUrl || event.shortUrl,
					source: 'api',
					owner: event.owner?.name || 'Svelte Society',
					presentations,
					socialCardUrl: event.uploadedSocialCard?.url
				}
			})
		}

		// Process upcoming and past events
		const upcomingEvents = processApiEvents(apiUpcomingEvents).sort((a, b) => {
			const aTime = new Date(a.startTime || 0).getTime()
			const bTime = new Date(b.startTime || 0).getTime()
			return aTime - bTime // Ascending for upcoming events
		})

		const pastEvents = processApiEvents(apiPastEvents)
			.filter((event) => {
				// Filter out events older than 1 year
				const eventDate = new Date(event.startTime)
				const oneYearAgo = new Date()
				oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
				return eventDate >= oneYearAgo
			})
			.sort((a, b) => {
				const aTime = new Date(a.startTime || 0).getTime()
				const bTime = new Date(b.startTime || 0).getTime()
				return bTime - aTime // Descending for past events (most recent first)
			})

		return {
			upcomingEvents,
			pastEvents,
			meta: EVENTS_META
		}
	} catch (error) {
		console.error('Error loading events:', error)
		return {
			upcomingEvents: [],
			pastEvents: [],
			meta: EVENTS_META
		}
	}
}
