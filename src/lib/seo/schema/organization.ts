import { SEO_CONFIG } from '../config'
import type { OrganizationSchema } from './types'

/**
 * Generate Organization Schema for Svelte Society
 * Used on homepage to establish site identity
 *
 * @see https://schema.org/Organization
 * @see https://developers.google.com/search/docs/appearance/structured-data/logo
 */
export function generateOrganizationSchema(): OrganizationSchema {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: SEO_CONFIG.siteName,
		url: SEO_CONFIG.siteUrl,
		logo: `${SEO_CONFIG.siteUrl}${SEO_CONFIG.logoUrl}`,
		description: SEO_CONFIG.defaultDescription,
		sameAs: [
			`https://twitter.com/${SEO_CONFIG.twitterHandle}`,
			`https://github.com/${SEO_CONFIG.githubOrg}`
		]
	}
}
