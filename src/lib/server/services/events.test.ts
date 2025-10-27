import { describe, test, expect, beforeEach, afterEach, mock } from 'bun:test'
import Database from 'bun:sqlite'
import { EventsService } from './events'
import { createTestDatabase } from '../db/test-helpers'
import { CacheService } from './cache'

describe('EventsService', () => {
	let db: Database
	let cacheService: CacheService
	let eventsService: EventsService

	beforeEach(() => {
		// Create in-memory database with all migrations applied
		db = createTestDatabase()
		cacheService = new CacheService(db)
		eventsService = new EventsService(db, cacheService)
	})

	afterEach(() => {
		db.close()
	})

	describe('fetchUpcomingEventsFromAPI', () => {
		test('should fetch upcoming events from Guild API', async () => {
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
											slug: 'test-event',
											title: 'Test Event',
											description: 'A test event',
											startTime: new Date(Date.now() + 86400000).toISOString(),
											location: 'Online',
											url: 'https://guild.host/events/test-event'
										}
									}
								]
							}
						})
				})
			)

			const events = await eventsService.fetchUpcomingEventsFromAPI()
			expect(events).toBeDefined()
			expect(Array.isArray(events)).toBe(true)
			if (events.length > 0) {
				expect(events[0].slug).toBe('test-event')
				expect(events[0].title).toBe('Test Event')
			}
		})

		test('should handle API errors gracefully', async () => {
			// Mock failed API response
			global.fetch = mock(() =>
				Promise.resolve({
					ok: false,
					statusText: 'Not Found'
				})
			)

			const events = await eventsService.fetchUpcomingEventsFromAPI()
			expect(events).toBeDefined()
			expect(Array.isArray(events)).toBe(true)
		})

		test('should handle network errors', async () => {
			// Mock network error
			global.fetch = mock(() => Promise.reject(new Error('Network error')))

			const events = await eventsService.fetchUpcomingEventsFromAPI()
			expect(events).toBeDefined()
			expect(Array.isArray(events)).toBe(true)
			expect(events.length).toBe(0)
		})

		test('should use cache when available', async () => {
			let fetchCount = 0
			global.fetch = mock(() => {
				fetchCount++
				return Promise.resolve({
					ok: true,
					json: () =>
						Promise.resolve({
							events: {
								edges: [
									{
										node: {
											slug: 'cached-event',
											title: 'Cached Event',
											startTime: new Date(Date.now() + 86400000).toISOString()
										}
									}
								]
							}
						})
				})
			})

			// First call should fetch
			const events1 = await eventsService.fetchUpcomingEventsFromAPI()
			expect(fetchCount).toBe(1)

			// Second call should use cache
			const events2 = await eventsService.fetchUpcomingEventsFromAPI()
			expect(fetchCount).toBe(1) // Should still be 1
			expect(events2.length).toBe(events1.length)
		})
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
		test('should work without cache service', async () => {
			const noCacheService = new EventsService(db)

			global.fetch = mock(() =>
				Promise.resolve({
					ok: true,
					json: () =>
						Promise.resolve({
							events: {
								edges: [
									{
										node: {
											slug: 'no-cache-event',
											title: 'No Cache Event',
											startTime: new Date(Date.now() + 86400000).toISOString()
										}
									}
								]
							}
						})
				})
			)

			const events = await noCacheService.fetchUpcomingEventsFromAPI()
			expect(events).toBeDefined()
			expect(Array.isArray(events)).toBe(true)
		})
	})
})
