import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
	try {
		// Fetch upcoming events from the API
		const upcomingEvents = await locals.eventsService.fetchUpcomingEventsFromAPI()
		
		// Also get any events stored in the database
		const localEvents = locals.eventsService.getUpcomingEvents()
		
		// Ensure we have arrays
		const apiEvents = Array.isArray(upcomingEvents) ? upcomingEvents : []
		const dbEvents = Array.isArray(localEvents) ? localEvents : []
	
		// Combine and deduplicate events based on slug
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
				source: 'local'
			})
		}
		
		// Add API events (will override local if same slug)
		for (const event of apiEvents) {
			eventMap.set(event.slug, {
				...event,
				source: 'api'
			})
		}
		
		// Convert to array and sort by start time
		const events = Array.from(eventMap.values()).sort((a, b) => {
			const aTime = new Date(a.startTime || 0).getTime()
			const bTime = new Date(b.startTime || 0).getTime()
			return aTime - bTime
		})
		
		return {
			events,
			meta: {
				title: 'Upcoming Events - Svelte Society',
				description: 'Join us at upcoming Svelte Society events, meetups, and workshops',
				url: '/events'
			}
		}
	} catch (error) {
		console.error('Error loading events:', error)
		return {
			events: [],
			meta: {
				title: 'Upcoming Events - Svelte Society',
				description: 'Join us at upcoming Svelte Society events, meetups, and workshops',
				url: '/events'
			}
		}
	}
}