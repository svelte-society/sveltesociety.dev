/**
 * SEO Utility Functions
 * Helper functions for SEO implementation
 */

import { SEO_CONFIG } from './config'

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
