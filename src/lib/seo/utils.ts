/**
 * SEO Utility Functions
 * Helper functions for SEO implementation
 */

import { SEO_CONFIG } from './config'
import type { SeoMetaTagConfig } from './types'

/**
 * Formats a meta description to ensure it meets best practices
 * @param text - Raw text to format
 * @param maxLength - Maximum length (default: 160 characters)
 * @returns Formatted description
 */
export function formatMetaDescription(text: string, maxLength = 160): string {
	if (!text) return SEO_CONFIG.defaultDescription

	// Remove extra whitespace and newlines
	const cleaned = text.replace(/\s+/g, ' ').trim()

	// Truncate if needed, but try to break at word boundary
	if (cleaned.length <= maxLength) return cleaned

	const truncated = cleaned.slice(0, maxLength)
	const lastSpace = truncated.lastIndexOf(' ')

	// If we can break at a word boundary within the last 10 chars, do so
	if (lastSpace > maxLength - 10) {
		return truncated.slice(0, lastSpace) + '...'
	}

	return truncated + '...'
}

/**
 * Sanitizes a title for meta tags
 * @param title - Raw title
 * @param maxLength - Maximum length (default: 60 characters)
 * @returns Sanitized title
 */
export function sanitizeTitle(title: string, maxLength = 60): string {
	if (!title) return SEO_CONFIG.defaultTitle

	// Remove extra whitespace
	const cleaned = title.replace(/\s+/g, ' ').trim()

	// Truncate if needed
	if (cleaned.length <= maxLength) return cleaned

	return cleaned.slice(0, maxLength - 3) + '...'
}

/**
 * Generates a full absolute URL
 * @param path - Relative path
 * @returns Absolute URL
 */
export function getAbsoluteUrl(path: string): string {
	// Remove leading slash if present
	const cleanPath = path.startsWith('/') ? path.slice(1) : path

	// Ensure no double slashes
	return `${SEO_CONFIG.siteUrl}/${cleanPath}`.replace(/([^:]\/)\/+/g, '$1')
}

/**
 * Generates OG image URL for content
 * @param slug - Content slug
 * @returns OG image URL
 */
export function getOgImageUrl(slug: string): string {
	return `/og-image/${slug}`
}

/**
 * Escapes text for safe use in JSON-LD
 * @param text - Text to escape
 * @returns Escaped text
 */
export function escapeJsonLd(text: string): string {
	if (!text) return ''

	return text
		.replace(/\\/g, '\\\\')
		.replace(/"/g, '\\"')
		.replace(/\n/g, '\\n')
		.replace(/\r/g, '\\r')
		.replace(/\t/g, '\\t')
}

/**
 * Converts a date to ISO 8601 format
 * @param date - Date string or Date object
 * @returns ISO 8601 formatted date string
 */
export function toIso8601(date: string | Date): string {
	if (!date) return new Date().toISOString()

	if (typeof date === 'string') {
		return new Date(date).toISOString()
	}

	return date.toISOString()
}

/**
 * Gets the appropriate OG type for content
 * @param contentType - Type of content
 * @returns OG type string
 */
export function getOgType(contentType: string): string {
	const typeMap: Record<string, string> = {
		video: 'video.other',
		recipe: 'article',
		library: 'article',
		collection: 'website',
		announcement: 'article'
	}

	return typeMap[contentType] || 'website'
}

/**
 * Gets the appropriate Schema.org type for content
 * @param contentType - Type of content
 * @returns Schema.org type string
 */
export function getSchemaType(contentType: string): string {
	const typeMap: Record<string, string> = {
		video: 'VideoObject',
		recipe: 'TechArticle',
		library: 'SoftwareSourceCode',
		collection: 'Article',
		announcement: 'Article'
	}

	return typeMap[contentType] || 'Article'
}

/**
 * Capitalizes content type for display
 * @param contentType - Type of content
 * @returns Capitalized type
 */
export function formatContentType(contentType: string): string {
	return contentType.charAt(0).toUpperCase() + contentType.slice(1)
}

/**
 * Builds a complete SEO meta configuration matching Svead's API
 * @param config - Basic meta config
 * @returns Complete SEO meta configuration for Svead
 */
export function buildSeoConfig(config: Partial<SeoMetaTagConfig>): SeoMetaTagConfig {
	const {
		title = SEO_CONFIG.defaultTitle,
		description = SEO_CONFIG.defaultDescription,
		url,
		open_graph_image,
		author_name,
		site_name = SEO_CONFIG.siteName,
		twitter_handle = SEO_CONFIG.twitterHandle,
		twitter_card_type = 'summary_large_image',
		website,
		language = 'en',
		payment_pointer,
		og_type,
		robots
	} = config

	// Build complete configuration matching Svead's expected format
	const seoConfig: SeoMetaTagConfig = {
		title,
		description: formatMetaDescription(description),
		url: url || SEO_CONFIG.siteUrl,
		site_name,
		twitter_handle,
		twitter_card_type,
		language,
		open_graph_image: open_graph_image || SEO_CONFIG.defaultOgImage
	}

	// Add optional fields
	if (author_name) seoConfig.author_name = author_name
	if (website) seoConfig.website = website
	if (payment_pointer) seoConfig.payment_pointer = payment_pointer
	if (og_type) seoConfig.og_type = og_type
	if (robots) seoConfig.robots = robots

	return seoConfig
}

/**
 * Builds meta configuration for homepage
 * @returns Homepage meta configuration
 */
export function buildHomepageMeta(): SeoMetaTagConfig {
	return buildSeoConfig({
		title: SEO_CONFIG.defaultTitle,
		description: SEO_CONFIG.defaultDescription,
		url: SEO_CONFIG.siteUrl
	})
}

/**
 * Builds meta configuration for content detail pages
 * @param content - Content object
 * @param url - Full URL
 * @returns Content meta configuration
 */
export function buildContentMeta(
	content: {
		title: string
		description?: string
		type: string
		slug: string
		published_at?: string | null
		updated_at?: string | null
		author?: string
	},
	url: string
): SeoMetaTagConfig {
	const description = content.description || `View ${content.title} on Svelte Society`

	const config: Partial<SeoMetaTagConfig> = {
		title: `${content.title} - Svelte Society`,
		description,
		url,
		open_graph_image: getAbsoluteUrl(getOgImageUrl(content.slug)),
		author_name: content.author,
		og_type: getOgType(content.type)
	}

	return buildSeoConfig(config)
}

/**
 * Pluralizes a content type for display
 * @param type - Content type (singular)
 * @returns Pluralized content type
 */
export function pluralizeContentType(type: string): string {
	const pluralMap: Record<string, string> = {
		library: 'Libraries',
		recipe: 'Recipes',
		video: 'Videos',
		collection: 'Collections',
		announcement: 'Announcements',
		resource: 'Resources'
	}
	return pluralMap[type.toLowerCase()] || formatContentType(type) + 's'
}

/**
 * Builds meta configuration for category pages
 * @param type - Content type
 * @param url - Full URL
 * @returns Category meta configuration
 */
export function buildCategoryMeta(type: string, url: string): SeoMetaTagConfig {
	const typeForTitle = formatContentType(type)
	const typeForDescription = pluralizeContentType(type).toLowerCase()

	return buildSeoConfig({
		title: `${typeForTitle} - Svelte Society`,
		description: `Browse ${typeForDescription} from the Svelte Society community`,
		url,
		og_type: 'website'
	})
}

/**
 * Builds meta configuration for static pages
 * @param title - Page title
 * @param description - Page description
 * @param url - Full URL
 * @returns Static page meta configuration
 */
export function buildStaticPageMeta(
	title: string,
	description: string,
	url: string
): SeoMetaTagConfig {
	return buildSeoConfig({
		title: `${title} - Svelte Society`,
		description,
		url
	})
}
