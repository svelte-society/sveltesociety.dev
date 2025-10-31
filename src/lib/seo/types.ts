/**
 * Extended Meta Configuration for SEO
 *
 * Comprehensive type definition for all SEO-related metadata including
 * Open Graph, Twitter Cards, and article-specific fields.
 */

export interface SeoMetaTagConfig {
	/** Page title (required) */
	title: string

	/** Page description (required, recommended 150-160 chars) */
	description: string

	/** Canonical URL for this page (required) */
	url: string

	/** Open Graph image URL (recommended 1200x630px) */
	image?: string

	/** Alt text for the OG image */
	imageAlt?: string

	/** Image width in pixels (default: 1200) */
	imageWidth?: number

	/** Image height in pixels (default: 630) */
	imageHeight?: number

	/** OG type (website, article, video.other, etc.) */
	type?: 'website' | 'article' | 'video.other' | 'profile'

	/** Site name for Open Graph */
	siteName?: string

	/** Content locale (default: en_US) */
	locale?: string

	/** Keywords for the page (optional, comma-separated) */
	keywords?: string

	/** Author name */
	author?: string

	/** Twitter Card configuration */
	twitter?: {
		/** Card type (summary, summary_large_image, player) */
		card: 'summary' | 'summary_large_image' | 'player'

		/** Twitter handle for the site (@sveltesociety) */
		site?: string

		/** Twitter handle for the creator/author */
		creator?: string

		/** Twitter image (if different from OG image) */
		image?: string

		/** Twitter image alt text */
		imageAlt?: string
	}

	/** Article-specific metadata (for blog posts, recipes, etc.) */
	article?: {
		/** ISO 8601 publication date */
		publishedTime?: string

		/** ISO 8601 modified date */
		modifiedTime?: string

		/** Article author name */
		author?: string

		/** Article section/category */
		section?: string

		/** Article tags */
		tags?: string[]
	}

	/** Video-specific metadata */
	video?: {
		/** Video duration in seconds */
		duration?: number

		/** Video URL (YouTube, etc.) */
		url?: string

		/** Video width in pixels */
		width?: number

		/** Video height in pixels */
		height?: number

		/** Video release date */
		releaseDate?: string
	}

	/** Profile-specific metadata (for user pages) */
	profile?: {
		/** First name */
		firstName?: string

		/** Last name */
		lastName?: string

		/** Username */
		username?: string
	}
}

/**
 * Helper type for page server load functions
 * Use this in +page.server.ts files
 */
export interface PageMetaReturn {
	meta: SeoMetaTagConfig
}
