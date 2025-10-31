import type { BreadcrumbListSchema, BreadcrumbItemSchema } from './types'

export interface BreadcrumbItem {
	name: string
	url: string
}

/**
 * Generate BreadcrumbList Schema for navigation
 *
 * @param items Array of breadcrumb items (from root to current page)
 * @returns BreadcrumbList schema
 *
 * @see https://schema.org/BreadcrumbList
 * @see https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
 *
 * @example
 * ```ts
 * generateBreadcrumbSchema([
 *   { name: 'Home', url: 'https://sveltesociety.dev' },
 *   { name: 'Recipes', url: 'https://sveltesociety.dev/recipe' },
 *   { name: 'Form Validation', url: 'https://sveltesociety.dev/recipe/form-validation' }
 * ])
 * ```
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]): BreadcrumbListSchema {
	const itemListElement: BreadcrumbItemSchema[] = items.map((item, index) => ({
		'@type': 'ListItem',
		position: index + 1,
		name: item.name,
		item: item.url
	}))

	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement
	}
}
