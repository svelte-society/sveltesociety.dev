import type { TechArticleSchema, PersonSchema } from './types'

export interface ArticleSchemaInput {
	headline: string
	description: string
	datePublished: string // ISO 8601 format
	dateModified: string // ISO 8601 format
	authorName?: string
	authorUrl?: string
	imageUrl?: string
	url?: string
}

/**
 * Generate TechArticle Schema for recipe/tutorial content
 *
 * @see https://schema.org/TechArticle
 * @see https://developers.google.com/search/docs/appearance/structured-data/article
 */
export function generateArticleSchema(input: ArticleSchemaInput): TechArticleSchema {
	const schema: TechArticleSchema = {
		'@context': 'https://schema.org',
		'@type': 'TechArticle',
		headline: input.headline,
		description: input.description,
		datePublished: input.datePublished,
		dateModified: input.dateModified
	}

	// Add optional fields
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

	if (input.imageUrl) {
		schema.image = input.imageUrl
	}

	if (input.url) {
		schema.url = input.url
	}

	return schema
}
