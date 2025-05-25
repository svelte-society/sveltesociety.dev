import { Database } from 'bun:sqlite'

interface Presenter {
	id: string
	firstName: string
	lastName: string
}

interface Presentation {
	id: string
	slug: string
	prettyUrl: string
	presenter?: Presenter | string | null
	presenterFirstName?: string | null
	presenterLastName?: string | null
	title: string
	description: string
	videoSourceUrl?: string
}

interface PresentationEdge {
	node: Presentation
	cursor: string
}

interface GuildEvent {
	id: string
	slug: string
	name: string
	description: string
	startAt: string
	endAt?: string
	venue?: {
		address?: {
			location?: {
				geojson?: {
					coordinates?: number[]
				}
			}
		}
	}
	fullUrl?: string
	shortUrl?: string
	prettyUrl?: string
	owner?: {
		name: string
		__typename?: string
	}
	presentations?: {
		edges: PresentationEdge[]
	}
	uploadedSocialCard?: {
		url: string
	}
}

interface EventEdge {
	node: GuildEvent
	cursor: string
}

interface EventsResponse {
	events?: {
		edges: EventEdge[]
		pageInfo?: {
			hasNextPage?: boolean
			hasPreviousPage?: boolean
			endCursor?: string
			startCursor?: string
		}
	}
}

export class EventsService {
	private apiBaseUrl = 'https://guild.host/api/next'
	private readonly GUILD_SLUG = 'svelte-society'

	constructor(private db: Database) {}

	// Fetch upcoming events from the remote API
	async fetchUpcomingEventsFromAPI(guildSlug: string = this.GUILD_SLUG): Promise<GuildEvent[]> {
		try {
			const url = `${this.apiBaseUrl}/${guildSlug}/events/upcoming`

			const response = await fetch(url)
			
			if (!response.ok) {
				throw new Error(`Failed to fetch events: ${response.statusText}`)
			}

			const data: EventsResponse = await response.json()
			return data.events?.edges?.map(edge => edge.node) || []
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
			return data.events?.edges?.map(edge => edge.node) || []
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
}