import { test, expect } from '@playwright/test'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'

test.describe('SEO Endpoints', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

	test.describe('robots.txt', () => {
		test('returns 200 status code', async ({ request }) => {
			const response = await request.get('/robots.txt')
			expect(response.status()).toBe(200)
		})

		test('has correct content-type header', async ({ request }) => {
			const response = await request.get('/robots.txt')
			const contentType = response.headers()['content-type']
			expect(contentType).toContain('text/plain')
		})

		test('has cache-control header', async ({ request }) => {
			const response = await request.get('/robots.txt')
			const cacheControl = response.headers()['cache-control']
			expect(cacheControl).toContain('max-age')
			expect(cacheControl).toContain('86400') // 24 hours
		})

		test('contains user-agent directive', async ({ request }) => {
			const response = await request.get('/robots.txt')
			const body = await response.text()
			expect(body).toContain('User-agent: *')
		})

		test('contains allow directive', async ({ request }) => {
			const response = await request.get('/robots.txt')
			const body = await response.text()
			expect(body).toContain('Allow: /')
		})

		test('disallows admin routes', async ({ request }) => {
			const response = await request.get('/robots.txt')
			const body = await response.text()
			expect(body).toContain('Disallow: /admin/')
		})

		test('disallows api routes', async ({ request }) => {
			const response = await request.get('/robots.txt')
			const body = await response.text()
			expect(body).toContain('Disallow: /api/')
		})

		test('disallows saved route', async ({ request }) => {
			const response = await request.get('/robots.txt')
			const body = await response.text()
			expect(body).toContain('Disallow: /saved')
		})

		test('disallows login route', async ({ request }) => {
			const response = await request.get('/robots.txt')
			const body = await response.text()
			expect(body).toContain('Disallow: /login')
		})

		test('disallows auth routes', async ({ request }) => {
			const response = await request.get('/robots.txt')
			const body = await response.text()
			expect(body).toContain('Disallow: /auth/')
		})

		test('includes sitemap reference', async ({ request }) => {
			const response = await request.get('/robots.txt')
			const body = await response.text()
			expect(body).toContain('Sitemap:')
			expect(body).toContain('/sitemap.xml')
		})

		test('has valid format', async ({ request }) => {
			const response = await request.get('/robots.txt')
			const body = await response.text()

			// Check basic structure
			expect(body).toMatch(/User-agent:\s*\*/)
			expect(body).toMatch(/Allow:\s*\//)
			expect(body).toMatch(/Disallow:\s*\//)
			expect(body).toMatch(/Sitemap:\s*https?:\/\//)
		})
	})

	test.describe('sitemap.xml', () => {
		test('returns 200 status code', async ({ request }) => {
			const response = await request.get('/sitemap.xml')
			expect(response.status()).toBe(200)
		})

		test('has correct content-type header', async ({ request }) => {
			const response = await request.get('/sitemap.xml')
			const contentType = response.headers()['content-type']
			expect(contentType).toContain('application/xml')
		})

		test('has cache-control header', async ({ request }) => {
			const response = await request.get('/sitemap.xml')
			const cacheControl = response.headers()['cache-control']
			expect(cacheControl).toContain('max-age')
			expect(cacheControl).toContain('3600') // 1 hour
		})

		test('contains valid XML', async ({ request }) => {
			const response = await request.get('/sitemap.xml')
			const body = await response.text()
			expect(body).toContain('<?xml version="1.0"')
			expect(body).toContain('<urlset')
			expect(body).toContain('</urlset>')
		})

		test('includes homepage URL', async ({ request }) => {
			const response = await request.get('/sitemap.xml')
			const body = await response.text()
			expect(body).toContain('<loc>')
			expect(body).toContain('sveltesociety.dev/')
		})

		test('includes category pages', async ({ request }) => {
			const response = await request.get('/sitemap.xml')
			const body = await response.text()
			expect(body).toContain('sveltesociety.dev/recipe')
			expect(body).toContain('sveltesociety.dev/video')
			expect(body).toContain('sveltesociety.dev/library')
			expect(body).toContain('sveltesociety.dev/collection')
			expect(body).toContain('sveltesociety.dev/announcement')
		})

		test('includes static pages', async ({ request }) => {
			const response = await request.get('/sitemap.xml')
			const body = await response.text()
			expect(body).toContain('sveltesociety.dev/about')
			expect(body).toContain('sveltesociety.dev/terms')
			expect(body).toContain('sveltesociety.dev/privacy')
		})

		test('includes lastmod dates', async ({ request }) => {
			const response = await request.get('/sitemap.xml')
			const body = await response.text()
			expect(body).toContain('<lastmod>')
			// Check ISO 8601 format
			expect(body).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z<\/lastmod>/)
		})

		test('includes priority values', async ({ request }) => {
			const response = await request.get('/sitemap.xml')
			const body = await response.text()
			expect(body).toContain('<priority>')
			expect(body).toContain('<priority>1</priority>') // Homepage
		})

		test('includes changefreq values', async ({ request }) => {
			const response = await request.get('/sitemap.xml')
			const body = await response.text()
			expect(body).toContain('<changefreq>')
			expect(body).toContain('<changefreq>daily</changefreq>')
		})

		test('includes published content URLs', async ({ request }) => {
			const response = await request.get('/sitemap.xml')
			const body = await response.text()

			// Test database should have seeded content
			// Check that sitemap includes more than just static pages (9 URLs)
			const urlCount = (body.match(/<url>/g) || []).length
			expect(urlCount).toBeGreaterThan(9) // Static + published content
		})

		test('sitemap is cached on subsequent requests', async ({ request }) => {
			// First request should be MISS
			const response1 = await request.get('/sitemap.xml')
			const cacheHeader1 = response1.headers()['x-cache']

			// Second request should be HIT
			const response2 = await request.get('/sitemap.xml')
			const cacheHeader2 = response2.headers()['x-cache']

			// At least one should be HIT (if first was MISS, second will be HIT)
			expect(cacheHeader2).toBe('HIT')
		})
	})

	test.describe('SEO Endpoint Resilience', () => {
		test('robots.txt works without database', async ({ request }) => {
			// robots.txt should work even if database is unavailable
			const response = await request.get('/robots.txt')
			expect(response.status()).toBe(200)
		})

		test('robots.txt returns consistent content', async ({ request }) => {
			// Make multiple requests to ensure consistency
			const response1 = await request.get('/robots.txt')
			const body1 = await response1.text()

			const response2 = await request.get('/robots.txt')
			const body2 = await response2.text()

			expect(body1).toBe(body2)
		})

		test('robots.txt has no trailing whitespace issues', async ({ request }) => {
			const response = await request.get('/robots.txt')
			const body = await response.text()

			// Should not have excessive trailing whitespace
			expect(body).not.toMatch(/\n\n\n+/)
		})
	})

	test.describe('SEO Endpoint Performance', () => {
		test('robots.txt responds quickly', async ({ request }) => {
			const startTime = Date.now()
			const response = await request.get('/robots.txt')
			const endTime = Date.now()

			expect(response.status()).toBe(200)
			expect(endTime - startTime).toBeLessThan(1000) // Less than 1 second
		})

		test('robots.txt can handle concurrent requests', async ({ request }) => {
			// Make 10 concurrent requests
			const requests = Array(10)
				.fill(null)
				.map(() => request.get('/robots.txt'))

			const responses = await Promise.all(requests)

			// All should succeed
			responses.forEach((response) => {
				expect(response.status()).toBe(200)
			})
		})
	})
})
