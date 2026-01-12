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

		const getPresenterName = (node: any): string => {
			if (node.presenter) {
				if (typeof node.presenter === 'string') return node.presenter
				if (node.presenter.firstName) {
					return `${node.presenter.firstName} ${node.presenter.lastName || ''}`.trim()
				}
			}
			if (node.presenterFirstName || node.presenterLastName) {
				return `${node.presenterFirstName || ''} ${node.presenterLastName || ''}`.trim()
			}
			return 'Unknown'
		}

		const processApiEvents = (apiEvents: any[]) =>
			apiEvents.map((event) => ({
				id: event.id,
				slug: event.slug,
				title: event.name,
				description: event.description,
				startTime: event.startAt,
				endTime: event.endAt,
				url: event.fullUrl || event.shortUrl,
				source: 'api',
				owner: event.owner?.name || 'Svelte Society',
				socialCardUrl: event.uploadedSocialCard?.url,
				presentations:
					event.presentations?.edges?.map((edge: any) => ({
						title: edge.node.title,
						presenter: getPresenterName(edge.node),
						description: edge.node.description,
						videoUrl: edge.node.videoSourceUrl
					})) || []
			}))

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
