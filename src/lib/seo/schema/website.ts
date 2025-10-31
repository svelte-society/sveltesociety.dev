import { SEO_CONFIG } from '../config'
import type { WebSiteSchema } from './types'

/**
 * Generate WebSite Schema with SearchAction
 * Used on homepage to enable search box in Google results
 *
 * @see https://schema.org/WebSite
 * @see https://developers.google.com/search/docs/appearance/structured-data/sitelinks-searchbox
 */
export function generateWebSiteSchema(): WebSiteSchema {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: SEO_CONFIG.siteName,
		url: SEO_CONFIG.siteUrl,
		description: SEO_CONFIG.defaultDescription,
		potentialAction: {
			'@type': 'SearchAction',
			target: {
				'@type': 'EntryPoint',
				urlTemplate: `${SEO_CONFIG.siteUrl}/?q={search_term_string}`
			},
			'query-input': 'required name=search_term_string'
		}
	}
}
