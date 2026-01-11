/**
 * Schema.org Type Definitions
 * Based on https://schema.org specifications
 */

/**
 * Base Schema.org type with @context
 */
export interface SchemaBase {
	'@context': 'https://schema.org'
	'@type': string
}

/**
 * Organization Schema
 * https://schema.org/Organization
 */
export interface OrganizationSchema extends SchemaBase {
	'@type': 'Organization'
	name: string
	url: string
	logo: string
	description?: string
	sameAs?: string[]
}

/**
 * WebSite Schema with SearchAction
 * https://schema.org/WebSite
 */
export interface WebSiteSchema extends SchemaBase {
	'@type': 'WebSite'
	name: string
	url: string
	description?: string
	potentialAction?: {
		'@type': 'SearchAction'
		target: {
			'@type': 'EntryPoint'
			urlTemplate: string
		}
		'query-input': string
	}
}

/**
 * Person Schema
 * https://schema.org/Person
 */
export interface PersonSchema {
	'@type': 'Person'
	name: string
	url?: string
}

/**
 * VideoObject Schema
 * https://schema.org/VideoObject
 */
export interface VideoObjectSchema extends SchemaBase {
	'@type': 'VideoObject'
	name: string
	description: string
	thumbnailUrl: string
	uploadDate: string
	contentUrl?: string
	embedUrl?: string
	author?: PersonSchema
	dateModified?: string
}

/**
 * TechArticle Schema
 * https://schema.org/TechArticle
 */
export interface TechArticleSchema extends SchemaBase {
	'@type': 'TechArticle'
	headline: string
	description: string
	author?: PersonSchema
	datePublished: string
	dateModified: string
	image?: string
	url?: string
}

/**
 * SoftwareSourceCode Schema
 * https://schema.org/SoftwareSourceCode
 */
export interface SoftwareSourceCodeSchema extends SchemaBase {
	'@type': 'SoftwareSourceCode'
	name: string
	description: string
	codeRepository?: string
	programmingLanguage: string
	author?: PersonSchema
	datePublished?: string
	dateModified?: string
}

/**
 * BreadcrumbList Schema
 * https://schema.org/BreadcrumbList
 */
export interface BreadcrumbListSchema extends SchemaBase {
	'@type': 'BreadcrumbList'
	itemListElement: BreadcrumbItemSchema[]
}

/**
 * ListItem for BreadcrumbList
 * https://schema.org/ListItem
 */
export interface BreadcrumbItemSchema {
	'@type': 'ListItem'
	position: number
	name: string
	item: string
}

/**
 * Place Schema for event location
 * https://schema.org/Place
 */
export interface PlaceSchema {
	'@type': 'Place' | 'VirtualLocation'
	name?: string
	address?: string
	url?: string
}

/**
 * Event Schema
 * https://schema.org/Event
 */
export interface EventSchema extends SchemaBase {
	'@type': 'Event'
	name: string
	description?: string
	startDate: string // ISO 8601
	endDate?: string // ISO 8601
	location?: PlaceSchema
	url?: string
	image?: string
	organizer?: {
		'@type': 'Organization'
		name: string
		url?: string
	}
	eventStatus?:
		| 'https://schema.org/EventScheduled'
		| 'https://schema.org/EventCancelled'
		| 'https://schema.org/EventPostponed'
	eventAttendanceMode?:
		| 'https://schema.org/OnlineEventAttendanceMode'
		| 'https://schema.org/OfflineEventAttendanceMode'
		| 'https://schema.org/MixedEventAttendanceMode'
}

/**
 * ItemList Schema for event listings
 * https://schema.org/ItemList
 */
export interface ItemListSchema extends SchemaBase {
	'@type': 'ItemList'
	name?: string
	numberOfItems: number
	itemListElement: Array<{
		'@type': 'ListItem'
		position: number
		item: EventSchema
	}>
}

/**
 * Generic schema type that can be any of the above
 */
export type Schema =
	| OrganizationSchema
	| WebSiteSchema
	| VideoObjectSchema
	| TechArticleSchema
	| SoftwareSourceCodeSchema
	| BreadcrumbListSchema
	| EventSchema
	| ItemListSchema

/**
 * Helper type for multiple schemas
 */
export type SchemaArray = Schema[]
