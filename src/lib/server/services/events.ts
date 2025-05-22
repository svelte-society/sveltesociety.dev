import { Database } from 'bun:sqlite'
import type { Content } from '$lib/types/content'
import { ContentService } from './content'

interface GuildEvent {
	id: string
	slug: string
	title: string
	description: string
	startTime: string
	endTime?: string
	location?: string
	url?: string
	guildSlug?: string
}

interface EventsResponse {
	events: GuildEvent[]
	pageInfo?: {
		hasNextPage: boolean
		hasPreviousPage: boolean
		endCursor?: string
		startCursor?: string
	}
}

export class EventsService {
	private contentService: ContentService
	private apiBaseUrl = 'https://guild.host/api/next'
	private readonly GUILD_SLUG = 'svelte-society'

	constructor(private db: Database) {
		this.contentService = new ContentService(db)
	}

	// Get all events from the database (stored as content type 'event')
	getAllEvents(limit?: number, offset?: number): Content[] {
		return this.contentService.getFilteredContent({
			type: 'event',
			status: 'published',
			limit,
			offset,
			sort: 'latest'
		})
	}

	// Get upcoming events from the database
	getUpcomingEvents(limit?: number): Content[] {
		const now = new Date().toISOString()
		
		const query = this.db.prepare(`
			SELECT DISTINCT c.id
			FROM content c
			WHERE c.type = 'event' 
			AND c.status = 'published'
			AND json_extract(c.metadata, '$.startTime') > ?
			ORDER BY json_extract(c.metadata, '$.startTime') ASC
			${limit ? 'LIMIT ?' : ''}
		`)

		const params = limit ? [now, limit] : [now]
		const ids = query.all(...params) as { id: string }[]

		return ids
			.map(({ id }) => this.contentService.getContentById(id))
			.filter((content): content is Content => content !== null)
	}

	// Get past events from the database
	getPastEvents(limit?: number, withinDays?: number): Content[] {
		const now = new Date()
		const nowStr = now.toISOString()
		
		let query = `
			SELECT DISTINCT c.id
			FROM content c
			WHERE c.type = 'event' 
			AND c.status = 'published'
			AND json_extract(c.metadata, '$.startTime') <= ?
		`
		
		const params: any[] = [nowStr]
		
		// If withinDays is specified, only get events from within that time range
		if (withinDays) {
			const cutoffDate = new Date(now.getTime() - withinDays * 24 * 60 * 60 * 1000)
			query += ` AND json_extract(c.metadata, '$.startTime') >= ?`
			params.push(cutoffDate.toISOString())
		}
		
		query += ` ORDER BY json_extract(c.metadata, '$.startTime') DESC`
		
		if (limit) {
			query += ` LIMIT ?`
			params.push(limit)
		}
		
		const preparedQuery = this.db.prepare(query)
		const ids = preparedQuery.all(...params) as { id: string }[]

		return ids
			.map(({ id }) => this.contentService.getContentById(id))
			.filter((content): content is Content => content !== null)
	}

	// Get event by ID or slug
	getEvent(idOrSlug: string): Content | null {
		// First try to get by ID
		let event = this.contentService.getContentById(idOrSlug)
		
		// If not found, try by slug
		if (!event) {
			event = this.contentService.getContentBySlug(idOrSlug, 'event')
		}

		return event && event.type === 'event' ? event : null
	}

	// Create a new event
	createEvent(data: {
		title: string
		slug: string
		description: string
		body: string
		tags: string[]
		startTime: string
		endTime?: string
		location?: string
		url?: string
		status?: string
	}): string {
		const metadata = {
			startTime: data.startTime,
			endTime: data.endTime,
			location: data.location,
			url: data.url
		}

		return this.contentService.addContent({
			title: data.title,
			slug: data.slug,
			description: data.description,
			type: 'event',
			status: data.status || 'draft',
			body: data.body,
			tags: data.tags,
			metadata: metadata as any
		})
	}

	// Update an existing event
	updateEvent(
		id: string,
		data: {
			title: string
			slug: string
			description: string
			body: string
			tags: string[]
			startTime: string
			endTime?: string
			location?: string
			url?: string
			status?: string
		}
	): void {
		const metadata = {
			startTime: data.startTime,
			endTime: data.endTime,
			location: data.location,
			url: data.url
		}

		this.contentService.updateContent(id, {
			title: data.title,
			slug: data.slug,
			description: data.description,
			type: 'event',
			status: data.status || 'draft',
			body: data.body,
			tags: data.tags,
			metadata: metadata as any
		})
	}

	// Fetch upcoming events from the remote API
	async fetchUpcomingEventsFromAPI(guildSlug: string = this.GUILD_SLUG): Promise<GuildEvent[]> {
		try {
			const url = `${this.apiBaseUrl}/${guildSlug}/events/upcoming`

			const response = await fetch(url)
			
			if (!response.ok) {
				throw new Error(`Failed to fetch events: ${response.statusText}`)
			}

			const data: EventsResponse = await response.json()
			return data.events || []
		} catch (error) {
			console.error('Error fetching events from API:', error)
			return []
		}
	}

	// Fetch past events from the remote API
	async fetchPastEventsFromAPI(guildSlug: string = this.GUILD_SLUG): Promise<GuildEvent[]> {
		try {
			const url = `${this.apiBaseUrl}/${guildSlug}/events/past`

			const response = await fetch(url)
			
			if (!response.ok) {
				throw new Error(`Failed to fetch events: ${response.statusText}`)
			}

			const data: EventsResponse = await response.json()
			return data.events || []
		} catch (error) {
			console.error('Error fetching events from API:', error)
			return []
		}
	}

	// Fetch a specific event from the remote API
	async fetchEventFromAPI(eventSlug: string): Promise<GuildEvent | null> {
		try {
			const url = `${this.apiBaseUrl}/events/${eventSlug}`
			const response = await fetch(url)
			
			if (!response.ok) {
				if (response.status === 404) {
					return null
				}
				throw new Error(`Failed to fetch event: ${response.statusText}`)
			}

			const data = await response.json()
			return data
		} catch (error) {
			console.error('Error fetching event from API:', error)
			return null
		}
	}

	// Import events from the remote API into the database
	async importEventsFromAPI(guildSlug: string = this.GUILD_SLUG): Promise<number> {
		const events = await this.fetchUpcomingEventsFromAPI(guildSlug)
		let imported = 0

		for (const event of events) {
			try {
				// Check if event already exists
				const existing = this.contentService.getContentBySlug(event.slug, 'event')
				
				if (!existing) {
					this.createEvent({
						title: event.title,
						slug: event.slug,
						description: event.description,
						body: event.description, // Use description as body for now
						tags: [], // No tags from API
						startTime: event.startTime,
						endTime: event.endTime,
						location: event.location,
						url: event.url,
						status: 'published'
					})
					imported++
				}
			} catch (error) {
				console.error(`Error importing event ${event.slug}:`, error)
			}
		}

		return imported
	}
}