/**
 * Svead SeoConfig Type
 *
 * Type definition matching Svead's Head component API.
 * Based on: https://github.com/spences10/svead
 */
export interface SeoMetaTagConfig {
	/** Page title (required) */
	title: string

	/** Page description (required, recommended 150-160 chars) */
	description: string

	/** Canonical URL for this page (required) */
	url: string

	/** Site domain/URL (optional) */
	website?: string

	/** Language code (defaults to 'en') */
	language?: string

	/** Open Graph image URL (recommended 1200x630px) */
	open_graph_image?: string

	/** Content author name */
	author_name?: string

	/** Site name for og:site_name */
	site_name?: string

	/** Twitter handle of the content creator or site (e.g., @sveltesociety) */
	twitter_handle?: string

	/** Twitter card type (defaults to 'summary_large_image') */
	twitter_card_type?: 'summary' | 'summary_large_image' | 'player'

	/** Web Monetization payment pointer (optional) */
	payment_pointer?: string
}

/**
 * Helper type for page server load functions
 * Use this in +page.server.ts files
 */
export interface PageMetaReturn {
	meta: SeoMetaTagConfig
}
