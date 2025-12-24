import type { EventSchema, ItemListSchema, PlaceSchema } from './types'

export interface EventSchemaInput {
	name: string
	description?: string
	startDate: string // ISO 8601 format
	endDate?: string // ISO 8601 format
	location?: string
	url?: string
	imageUrl?: string
	organizerName?: string
	organizerUrl?: string
	isOnline?: boolean
}

/**
 * Generate Event Schema for event pages
 *
 * @see https://schema.org/Event
 * @see https://developers.google.com/search/docs/appearance/structured-data/event
 */
export function generateEventSchema(input: EventSchemaInput): EventSchema {
	const schema: EventSchema = {
		'@context': 'https://schema.org',
		'@type': 'Event',
		name: input.name,
		startDate: input.startDate,
		eventStatus: 'https://schema.org/EventScheduled'
	}

	// Add optional fields
	if (input.description) {
		schema.description = input.description
	}

	if (input.endDate) {
		schema.endDate = input.endDate
	}

	// Location - either virtual or physical
	if (input.isOnline || input.url) {
		const location: PlaceSchema = {
			'@type': 'VirtualLocation',
			url: input.url
		}
		schema.location = location
		schema.eventAttendanceMode = 'https://schema.org/OnlineEventAttendanceMode'
	} else if (input.location) {
		const location: PlaceSchema = {
			'@type': 'Place',
			name: input.location,
			address: input.location
		}
		schema.location = location
		schema.eventAttendanceMode = 'https://schema.org/OfflineEventAttendanceMode'
	}

	if (input.url) {
		schema.url = input.url
	}

	if (input.imageUrl) {
		schema.image = input.imageUrl
	}

	if (input.organizerName) {
		schema.organizer = {
			'@type': 'Organization',
			name: input.organizerName
		}

		if (input.organizerUrl) {
			schema.organizer.url = input.organizerUrl
		}
	}

	return schema
}

/**
 * Generate ItemList Schema for a list of events
 *
 * @see https://schema.org/ItemList
 */
export function generateEventListSchema(
	events: EventSchemaInput[],
	listName?: string
): ItemListSchema {
	return {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		name: listName,
		numberOfItems: events.length,
		itemListElement: events.map((event, index) => ({
			'@type': 'ListItem' as const,
			position: index + 1,
			item: generateEventSchema(event)
		}))
	}
}
