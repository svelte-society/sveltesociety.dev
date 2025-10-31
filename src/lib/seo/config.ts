/**
 * SEO Configuration
 * Centralized constants for SEO implementation
 */

export const SEO_CONFIG = {
	// Site Information
	siteName: 'Svelte Society',
	siteUrl: 'https://sveltesociety.dev',
	defaultTitle: 'Svelte Society - Community of Svelte Developers',
	defaultDescription:
		'Discover recipes, videos, libraries, and resources from the Svelte community. Join developers building amazing things with Svelte.',

	// Default Images
	defaultImage: '/og-default.png',
	logoUrl: '/favicon.png',

	// Social Media
	twitterHandle: '@sveltesociety',
	githubOrg: 'svelte-society',

	// Open Graph Settings
	locale: 'en_US',
	ogImageWidth: 1200,
	ogImageHeight: 630,

	// Twitter Card Settings
	twitterCardType: 'summary_large_image' as const,

	// Sitemap Priority Settings
	priority: {
		homepage: 1.0,
		collection: 0.9,
		announcement: 0.9,
		content: 0.8, // recipes, videos, libraries
		category: 0.7,
		static: 0.6
	},

	// Sitemap Change Frequency Settings
	changefreq: {
		homepage: 'daily' as const,
		content: 'weekly' as const,
		category: 'daily' as const,
		static: 'monthly' as const
	}
} as const

/**
 * Content type to OG type mapping
 */
export const OG_TYPE_MAP = {
	video: 'video.other',
	recipe: 'article',
	library: 'article',
	collection: 'website',
	announcement: 'article'
} as const

/**
 * Schema.org type mapping
 */
export const SCHEMA_TYPE_MAP = {
	video: 'VideoObject',
	recipe: 'TechArticle',
	library: 'SoftwareSourceCode',
	collection: 'Article',
	announcement: 'Article'
} as const
