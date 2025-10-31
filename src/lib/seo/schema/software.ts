import type { SoftwareSourceCodeSchema, PersonSchema } from './types'

export interface SoftwareSchemaInput {
	name: string
	description: string
	codeRepository?: string // GitHub URL
	programmingLanguage?: string
	authorName?: string
	authorUrl?: string
	datePublished?: string // ISO 8601 format
	dateModified?: string // ISO 8601 format
}

/**
 * Generate SoftwareSourceCode Schema for library content
 *
 * @see https://schema.org/SoftwareSourceCode
 * @see https://developers.google.com/search/docs/appearance/structured-data/software-app
 */
export function generateSoftwareSchema(input: SoftwareSchemaInput): SoftwareSourceCodeSchema {
	const schema: SoftwareSourceCodeSchema = {
		'@context': 'https://schema.org',
		'@type': 'SoftwareSourceCode',
		name: input.name,
		description: input.description,
		programmingLanguage: input.programmingLanguage || 'JavaScript'
	}

	// Add optional fields
	if (input.codeRepository) {
		schema.codeRepository = input.codeRepository
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

	if (input.datePublished) {
		schema.datePublished = input.datePublished
	}

	if (input.dateModified) {
		schema.dateModified = input.dateModified
	}

	return schema
}
