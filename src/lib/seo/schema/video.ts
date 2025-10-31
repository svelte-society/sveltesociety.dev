import type { VideoObjectSchema, PersonSchema } from './types'

export interface VideoSchemaInput {
	title: string
	description: string
	thumbnailUrl: string
	uploadDate: string // ISO 8601 format
	contentUrl?: string // YouTube URL
	embedUrl?: string // YouTube embed URL
	authorName?: string
	authorUrl?: string
	dateModified?: string // ISO 8601 format
}

/**
 * Generate VideoObject Schema for video content
 *
 * @see https://schema.org/VideoObject
 * @see https://developers.google.com/search/docs/appearance/structured-data/video
 */
export function generateVideoSchema(input: VideoSchemaInput): VideoObjectSchema {
	const schema: VideoObjectSchema = {
		'@context': 'https://schema.org',
		'@type': 'VideoObject',
		name: input.title,
		description: input.description,
		thumbnailUrl: input.thumbnailUrl,
		uploadDate: input.uploadDate
	}

	// Add optional fields
	if (input.contentUrl) {
		schema.contentUrl = input.contentUrl
	}

	if (input.embedUrl) {
		schema.embedUrl = input.embedUrl
	}

	if (input.authorName) {
		const author: PersonSchema = {
			'@type': 'Person',
			name: input.authorName
		}

		if (input.authorUrl) {
			author.url = input.authorUrl
		}

		schema.author = author
	}

	if (input.dateModified) {
		schema.dateModified = input.dateModified
	}

	return schema
}
