/**
 * robots.txt endpoint
 * Provides crawling directives for search engines
 */

import { SEO_CONFIG } from '$lib/seo'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = () => {
	const robots = `
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /saved
Disallow: /login
Disallow: /auth/

Sitemap: ${SEO_CONFIG.siteUrl}/sitemap.xml
`.trim()

	return new Response(robots, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=86400' // 24 hours
		}
	})
}
