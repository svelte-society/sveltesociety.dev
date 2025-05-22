import { describe, it, expect, beforeEach, vi } from 'vitest'
import Database from 'bun:sqlite'
import { EventsService } from './events'
import { readFileSync } from 'fs'
import { join } from 'path'

// Mock fetch for API tests
global.fetch = vi.fn()

describe('EventsService', () => {
	let db: Database
	let eventsService: EventsService

	beforeEach(() => {
		// Create a new in-memory database for each test
		db = new Database(':memory:', { strict: true })
		db.exec('PRAGMA journal_mode = WAL;')

		// Read and execute schema
		const schemaPath = join(process.cwd(), 'src/lib/server/db/schema/schema.sql')
		const schema = readFileSync(schemaPath, 'utf-8')
		db.exec(schema)

		// Insert test data
		db.prepare(
			`
			INSERT INTO tags (id, name, slug, color)
			VALUES
				('tag1', 'Svelte', 'svelte', '#FF3E00'),
				('tag2', 'Meetup', 'meetup', '#3178C6')
		`
		).run()

		const now = new Date()
		const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
		const pastDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) // 7 days ago

		db.prepare(
			`
			INSERT INTO content (id, title, type, status, body, rendered_body, slug, description, published_at, metadata)
			VALUES
				('event1', 'Upcoming Svelte Meetup', 'event', 'published', 'Join us for a Svelte meetup', '<p>Join us for a Svelte meetup</p>', 'upcoming-svelte-meetup', 'Learn about Svelte 5', '2025-01-01', ?),
				('event2', 'Past React Workshop', 'event', 'published', 'React workshop content', '<p>React workshop content</p>', 'past-react-workshop', 'React fundamentals', '2025-01-01', ?),
				('event3', 'Draft Event', 'event', 'draft', 'Draft event content', '<p>Draft event content</p>', 'draft-event', 'Draft description', null, ?),
				('event4', 'Non-event Content', 'recipe', 'published', 'Recipe content', '<p>Recipe content</p>', 'recipe-content', 'Recipe description', '2025-01-01', null)
		`
		).run(
			JSON.stringify({ startTime: futureDate.toISOString(), location: 'Online', url: 'https://example.com/meetup' }),
			JSON.stringify({ startTime: pastDate.toISOString(), endTime: pastDate.toISOString(), location: 'NYC' }),
			JSON.stringify({ startTime: futureDate.toISOString() })
		)

		db.prepare(
			`
			INSERT INTO content_to_tags (content_id, tag_id)
			VALUES
				('event1', 'tag1'),
				('event1', 'tag2')
		`
		).run()

		eventsService = new EventsService(db)
		vi.clearAllMocks()
	})

	describe('getAllEvents', () => {
		it('should return all published events', () => {
			const events = eventsService.getAllEvents()
			expect(events).toHaveLength(2)
			expect(events.every(e => e.type === 'event')).toBe(true)
			expect(events.every(e => e.status === 'published')).toBe(true)
		})

		it('should respect limit parameter', () => {
			const events = eventsService.getAllEvents(1)
			expect(events).toHaveLength(1)
		})

		it('should respect offset parameter', () => {
			const events = eventsService.getAllEvents(10, 1)
			expect(events).toHaveLength(1)
		})
	})

	describe('getUpcomingEvents', () => {
		it('should return only upcoming events', () => {
			const events = eventsService.getUpcomingEvents()
			expect(events).toHaveLength(1)
			expect(events[0].title).toBe('Upcoming Svelte Meetup')
		})

		it('should respect limit parameter', () => {
			const events = eventsService.getUpcomingEvents(0)
			expect(events).toHaveLength(0)
		})
	})

	describe('getPastEvents', () => {
		it('should return only past events', () => {
			const events = eventsService.getPastEvents()
			expect(events).toHaveLength(1)
			expect(events[0].title).toBe('Past React Workshop')
		})
	})

	describe('getEvent', () => {
		it('should return event by ID', () => {
			const event = eventsService.getEvent('event1')
			expect(event).toBeTruthy()
			expect(event?.title).toBe('Upcoming Svelte Meetup')
		})

		it('should return event by slug', () => {
			const event = eventsService.getEvent('upcoming-svelte-meetup')
			expect(event).toBeTruthy()
			expect(event?.title).toBe('Upcoming Svelte Meetup')
		})

		it('should return null for non-existent event', () => {
			const event = eventsService.getEvent('non-existent')
			expect(event).toBeNull()
		})

		it('should return null for non-event content', () => {
			const event = eventsService.getEvent('event4')
			expect(event).toBeNull()
		})
	})

	describe('createEvent', () => {
		it('should create a new event', () => {
			const eventId = eventsService.createEvent({
				title: 'New Event',
				slug: 'new-event',
				description: 'New event description',
				body: 'Event body content',
				tags: ['tag1'],
				startTime: new Date().toISOString(),
				location: 'Online',
				url: 'https://example.com'
			})

			expect(eventId).toBeTruthy()

			const event = eventsService.getEvent(eventId)
			expect(event).toBeTruthy()
			expect(event?.title).toBe('New Event')
			expect(event?.type).toBe('event')
		})
	})

	describe('updateEvent', () => {
		it('should update an existing event', () => {
			eventsService.updateEvent('event1', {
				title: 'Updated Svelte Meetup',
				slug: 'updated-svelte-meetup',
				description: 'Updated description',
				body: 'Updated body',
				tags: ['tag2'],
				startTime: new Date().toISOString(),
				status: 'published'
			})

			const event = eventsService.getEvent('event1')
			expect(event?.title).toBe('Updated Svelte Meetup')
			expect(event?.slug).toBe('updated-svelte-meetup')
		})
	})

	describe('API methods', () => {
		it('should fetch upcoming events from API', async () => {
			const mockEvents = {
				events: [
					{
						id: '1',
						slug: 'api-event-1',
						title: 'API Event 1',
						description: 'Description 1',
						startTime: new Date().toISOString()
					}
				]
			}

			;(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => mockEvents
			})

			const events = await eventsService.fetchUpcomingEventsFromAPI()
			expect(events).toHaveLength(1)
			expect(events[0].title).toBe('API Event 1')
		})

		it('should fetch upcoming events for specific guild', async () => {
			const mockEvents = { events: [] }

			;(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => mockEvents
			})

			await eventsService.fetchUpcomingEventsFromAPI('svelte-society')
			expect(global.fetch).toHaveBeenCalledWith('https://guild.host/api/next/svelte-society/events/upcoming')
		})

		it('should handle API errors gracefully', async () => {
			;(global.fetch as any).mockResolvedValueOnce({
				ok: false,
				statusText: 'Not Found'
			})

			const events = await eventsService.fetchUpcomingEventsFromAPI()
			expect(events).toEqual([])
		})

		it('should fetch a specific event from API', async () => {
			const mockEvent = {
				id: '1',
				slug: 'api-event',
				title: 'API Event',
				description: 'API Event Description',
				startTime: new Date().toISOString()
			}

			;(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => mockEvent
			})

			const event = await eventsService.fetchEventFromAPI('api-event')
			expect(event).toBeTruthy()
			expect(event?.title).toBe('API Event')
		})

		it('should return null for non-existent API event', async () => {
			;(global.fetch as any).mockResolvedValueOnce({
				ok: false,
				status: 404
			})

			const event = await eventsService.fetchEventFromAPI('non-existent')
			expect(event).toBeNull()
		})

		it('should import events from API', async () => {
			const mockEvents = {
				events: [
					{
						id: '1',
						slug: 'new-api-event',
						title: 'New API Event',
						description: 'New API Event Description',
						startTime: new Date().toISOString()
					}
				]
			}

			;(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => mockEvents
			})

			const imported = await eventsService.importEventsFromAPI()
			expect(imported).toBe(1)

			const event = eventsService.getEvent('new-api-event')
			expect(event).toBeTruthy()
			expect(event?.title).toBe('New API Event')
		})

		it('should not import duplicate events', async () => {
			const mockEvents = {
				events: [
					{
						id: '1',
						slug: 'upcoming-svelte-meetup',
						title: 'Duplicate Event',
						description: 'Should not be imported',
						startTime: new Date().toISOString()
					}
				]
			}

			;(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => mockEvents
			})

			const imported = await eventsService.importEventsFromAPI()
			expect(imported).toBe(0)
		})
	})
})