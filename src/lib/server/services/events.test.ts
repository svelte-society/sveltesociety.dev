import { describe, test, expect, beforeEach, afterEach, mock } from 'bun:test'
import Database from 'bun:sqlite'
import { EventsService } from './events'
import { createTestDatabase } from '../db/test-helpers'
import { CacheService } from './cache'

describe('EventsService', () => {
	let db: Database
	let cacheService: CacheService
	let eventsService: EventsService
	let originalFetch: typeof global.fetch

	beforeEach(() => {
		originalFetch = global.fetch
		// Create in-memory database with all migrations applied
		db = createTestDatabase()
		cacheService = new CacheService(db)
		eventsService = new EventsService(db, cacheService)
	})

	afterEach(() => {
		global.fetch = originalFetch
		db.close()
	})

	describe('fetchUpcomingEventsFromAPI', () => {
		test.each([
			['default guild', undefined],
			['custom guild', 'another-guild']
		])(
			'should return no upcoming events without fetching while refresh is disabled (%s)',
			async (_description, guildSlug) => {
				const fetchMock = mock(() => Promise.reject(new Error('Unexpected upstream request')))
				global.fetch = fetchMock

				expect(await eventsService.fetchUpcomingEventsFromAPI(guildSlug)).toEqual([])
				expect(await eventsService.fetchUpcomingEventsFromAPI(guildSlug)).toEqual([])
				expect(fetchMock).not.toHaveBeenCalled()
			}
		)
	})

	describe('fetchPastEventsFromAPI', () => {
		test('should fetch past events from Guild API', async () => {
			// Mock successful API response
			global.fetch = mock(() =>
				Promise.resolve({
					ok: true,
					json: () =>
						Promise.resolve({
							events: {
								edges: [
									{
										node: {
											slug: 'past-event',
											title: 'Past Event',
											description: 'A past event',
											startTime: new Date(Date.now() - 86400000).toISOString(),
											location: 'Online',
											url: 'https://guild.host/events/past-event'
										}
									}
								]
							}
						})
				})
			)

			const events = await eventsService.fetchPastEventsFromAPI()
			expect(events).toBeDefined()
			expect(Array.isArray(events)).toBe(true)
			if (events.length > 0) {
				expect(events[0].slug).toBe('past-event')
			}
		})

		test('should handle empty response', async () => {
			global.fetch = mock(() =>
				Promise.resolve({
					ok: true,
					json: () => Promise.resolve({ events: { edges: [] } })
				})
			)

			const events = await eventsService.fetchPastEventsFromAPI()
			expect(events).toBeDefined()
			expect(events.length).toBe(0)
		})
	})

	describe('fetchEventFromAPI', () => {
		test('should fetch single event by slug', async () => {
			global.fetch = mock(() =>
				Promise.resolve({
					ok: true,
					json: () =>
						Promise.resolve({
							slug: 'single-event',
							title: 'Single Event',
							description: 'A single event',
							startTime: new Date().toISOString(),
							location: 'Online',
							url: 'https://guild.host/events/single-event'
						})
				})
			)

			const event = await eventsService.fetchEventFromAPI('single-event')
			expect(event).toBeDefined()
			expect(event?.slug).toBe('single-event')
			expect(event?.title).toBe('Single Event')
		})

		test('should return null for 404 response', async () => {
			global.fetch = mock(() =>
				Promise.resolve({
					ok: false,
					status: 404,
					statusText: 'Not Found'
				})
			)

			const event = await eventsService.fetchEventFromAPI('non-existent')
			expect(event).toBeNull()
		})

		test('should return null for other errors', async () => {
			global.fetch = mock(() => Promise.reject(new Error('API error')))

			const event = await eventsService.fetchEventFromAPI('error-event')
			expect(event).toBeNull()
		})
	})

	describe('service without cache', () => {
		test('should keep upcoming event refresh disabled without cache service', async () => {
			const noCacheService = new EventsService(db)
			const fetchMock = mock(() => Promise.reject(new Error('Unexpected upstream request')))
			global.fetch = fetchMock

			expect(await noCacheService.fetchUpcomingEventsFromAPI()).toEqual([])
			expect(fetchMock).not.toHaveBeenCalled()
		})
	})
})
