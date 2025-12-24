/**
 * Schema.org Structured Data Generators
 *
 * This module provides functions to generate JSON-LD structured data
 * for various content types on Svelte Society.
 *
 * @see https://schema.org/
 * @see https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
 */

// Export all schema generators
export { generateOrganizationSchema } from './organization'
export { generateWebSiteSchema } from './website'
export { generateVideoSchema, type VideoSchemaInput } from './video'
export { generateArticleSchema, type ArticleSchemaInput } from './article'
export { generateSoftwareSchema, type SoftwareSchemaInput } from './software'
export { generateBreadcrumbSchema, type BreadcrumbItem } from './breadcrumb'
export { generateEventSchema, generateEventListSchema, type EventSchemaInput } from './event'

// Export all types
export type {
	SchemaBase,
	OrganizationSchema,
	WebSiteSchema,
	PersonSchema,
	VideoObjectSchema,
	TechArticleSchema,
	SoftwareSourceCodeSchema,
	BreadcrumbListSchema,
	BreadcrumbItemSchema,
	EventSchema,
	ItemListSchema,
	PlaceSchema,
	Schema,
	SchemaArray
} from './types'
