import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
	try {
		// Fetch upcoming and past events from the API
		const [upcomingEventsApi, pastEventsApi] = await Promise.all([
			locals.eventsService.fetchUpcomingEventsFromAPI(),
			locals.eventsService.fetchPastEventsFromAPI()
		])
		
		// Also get events stored in the database
		const localUpcomingEvents = locals.eventsService.getUpcomingEvents()
		const localPastEvents = locals.eventsService.getPastEvents(null, 365) // Past year
		
		// Ensure we have arrays
		const apiUpcomingEvents = Array.isArray(upcomingEventsApi) ? upcomingEventsApi : []
		const apiPastEvents = Array.isArray(pastEventsApi) ? pastEventsApi : []
		const dbUpcomingEvents = Array.isArray(localUpcomingEvents) ? localUpcomingEvents : []
		const dbPastEvents = Array.isArray(localPastEvents) ? localPastEvents : []

		// Helper function to process events
		const processEvents = (dbEvents: any[], apiEvents: any[]) => {
			const eventMap = new Map()
			
			// Add local events first
			for (const event of dbEvents) {
				const metadata = typeof event.metadata === 'string' 
					? JSON.parse(event.metadata) 
					: event.metadata || {}
					
				eventMap.set(event.slug, {
					id: event.id,
					slug: event.slug,
					title: event.title,
					description: event.description,
					startTime: metadata.startTime,
					endTime: metadata.endTime,
					location: metadata.location,
					url: metadata.url,
					source: 'local',
					owner: event.author || 'Svelte Society'
				})
			}
			
			// Add API events (will override local if same slug)
			for (const event of apiEvents) {
				// Extract location from venue coordinates
				let location = undefined
				if (event.venue?.address?.location?.geojson?.coordinates) {
					// You could reverse geocode this, but for now just indicate it has a venue
					location = 'See event details'
				}
				
				eventMap.set(event.slug, {
					id: event.id,
					slug: event.slug,
					title: event.name,
					description: event.description,
					startTime: event.startAt,
					endTime: event.endAt,
					location: location,
					url: event.fullUrl || event.shortUrl,
					source: 'api',
					owner: event.owner?.name || 'Svelte Society'
				})
			}
			
			return Array.from(eventMap.values())
		}
		
		// Process upcoming and past events separately
		const upcomingEvents = processEvents(dbUpcomingEvents, apiUpcomingEvents)
			.sort((a, b) => {
				const aTime = new Date(a.startTime || 0).getTime()
				const bTime = new Date(b.startTime || 0).getTime()
				return aTime - bTime // Ascending for upcoming events
			})
		
		const pastEvents = processEvents(dbPastEvents, apiPastEvents)
			.filter(event => {
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
			meta: {
				title: 'Events - Svelte Society',
				description: 'Join us at upcoming Svelte Society events, meetups, and workshops',
				url: '/events'
			}
		}
	} catch (error) {
		console.error('Error loading events:', error)
		return {
			upcomingEvents: [],
			pastEvents: [],
			meta: {
				title: 'Events - Svelte Society',
				description: 'Join us at upcoming Svelte Society events, meetups, and workshops',
				url: '/events'
			}
		}
	}
}