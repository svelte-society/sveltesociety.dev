import { Database } from 'bun:sqlite'
import { CacheService } from './cache'
import { Effect } from 'effect'
import { TaggedError } from 'effect/Data'

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

class CacheServiceNotFound extends TaggedError("CacheServiceNotFound") { }
class CachifiedError extends TaggedError("CachifiedError")<{
	slug: string,
	cause: unknown
}> { }
class FetchUpcomingEventsError extends TaggedError("FetchUpcomingEventsError")<{
	slug: string
	cause: unknown
}> { }

export class EventsService {
	private apiBaseUrl = 'https://guild.host/api/next'
	private readonly GUILD_SLUG = 'svelte-society'

	constructor(
		private db: Database,
		private cacheService?: CacheService
	) { }




	// Fetch upcoming events from the remote API
	async fetchUpcomingEventsFromAPI(guildSlug: string = this.GUILD_SLUG): Promise<GuildEvent[]> {
		if (!this.cacheService) {
			return this._fetchUpcomingEventsDirectly(guildSlug)
		}

		return this.cacheService.cachify({
			key: `events:upcoming:${guildSlug}`,
			getFreshValue: () => this._fetchUpcomingEventsDirectly(guildSlug),
			ttl: 5 * 60 * 1000, // 5 minutes
			swr: 60 * 60 * 1000 // 1 hour stale-while-revalidate
		})
	}
	async fetchUpcomingEventsFromAPI2(guildSlug: string = this.GUILD_SLUG) {
		return Effect.runPromiseExit(Effect.gen(this, function* () {
			if (!this.cacheService) {
				return yield* new CacheServiceNotFound()
			}

			const upcomingEvents = yield* this._fetchUpcomingEventsDirectly2(guildSlug)

			return Effect.tryPromise({
				try: () => {
					if (!this.cacheService) {
						throw new CacheServiceNotFound()
					}
					return this.cacheService.cachify({
						key: `events:upcoming:${guildSlug}`,
						getFreshValue: () => Effect.runPromise(this._fetchUpcomingEventsDirectly2(guildSlug)),
						ttl: 5 * 60 * 1000, // 5 minutes
						swr: 60 * 60 * 1000 // 1 hour stale-while-revalidate
					})
				},
				catch: (e) => {
					return new CachifiedError({
						slug: guildSlug,
						cause: e
					})
				}
			})

		}))
	}

	private async _fetchUpcomingEventsDirectly(guildSlug: string): Promise<GuildEvent[]> {
		try {
			const url = `${this.apiBaseUrl}/${guildSlug}/events/upcoming`

			const response = await fetch(url)

			if (!response.ok) {
				throw new Error(`Failed to fetch events: ${response.statusText}`)
			}

			const data: EventsResponse = await response.json()
			return data.events?.edges?.map((edge) => edge.node) || []
		} catch (error) {
			console.error('Error fetching events from API:', error)
			return []
		}
	}

	private _fetchUpcomingEventsDirectly2(guildSlug: string) {
		return Effect.gen(this, function* () {
			const url = `${this.apiBaseUrl}/${guildSlug}/events/upcoming`

			const response = yield* Effect.tryPromise({
				try: (abortSignal) => {
					return fetch(url, {
						signal: abortSignal
					})
				},
				catch: (e) => {
					return new FetchUpcomingEventsError({
						slug: guildSlug,
						cause: e
					})
				}
			})

			if (!response.ok) {
				return yield* new FetchUpcomingEventsError({
					slug: guildSlug,
					cause: response
				})
			}

			const json: EventsResponse = yield* Effect.tryPromise(() => response.json())

			return json.events?.edges?.map((edge) => edge.node) || []
		})
	}

	// Fetch past events from the remote API
	async fetchPastEventsFromAPI(guildSlug: string = this.GUILD_SLUG): Promise<GuildEvent[]> {
		if (!this.cacheService) {
			return this._fetchPastEventsDirectly(guildSlug)
		}

		return this.cacheService.cachify({
			key: `events:past:${guildSlug}`,
			getFreshValue: () => this._fetchPastEventsDirectly(guildSlug),
			ttl: 30 * 60 * 1000, // 30 minutes (past events change less frequently)
			swr: 4 * 60 * 60 * 1000 // 4 hours stale-while-revalidate
		})
	}

	private async _fetchPastEventsDirectly(guildSlug: string): Promise<GuildEvent[]> {
		try {
			const url = `${this.apiBaseUrl}/${guildSlug}/events/past`

			const response = await fetch(url)

			if (!response.ok) {
				throw new Error(`Failed to fetch events: ${response.statusText}`)
			}

			const data: EventsResponse = await response.json()
			return data.events?.edges?.map((edge) => edge.node) || []
		} catch (error) {
			console.error('Error fetching events from API:', error)
			return []
		}
	}

	// Fetch a specific event from the remote API
	async fetchEventFromAPI(eventSlug: string): Promise<GuildEvent | null> {
		if (!this.cacheService) {
			return this._fetchEventDirectly(eventSlug)
		}

		return this.cacheService.cachify({
			key: `events:single:${eventSlug}`,
			getFreshValue: () => this._fetchEventDirectly(eventSlug),
			ttl: 10 * 60 * 1000, // 10 minutes
			swr: 2 * 60 * 60 * 1000 // 2 hours stale-while-revalidate
		})
	}

	private async _fetchEventDirectly(eventSlug: string): Promise<GuildEvent | null> {
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
