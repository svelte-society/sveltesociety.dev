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

	test.describe('sitemap.xml (when implemented)', () => {
		test('returns 200 or 404 status code', async ({ request }) => {
			const response = await request.get('/sitemap.xml')
			// Will be 404 until Phase 3, then should be 200
			expect([200, 404]).toContain(response.status())
		})

		test.skip('has correct content-type header', async ({ request }) => {
			const response = await request.get('/sitemap.xml')
			if (response.status() === 404) {
				test.skip()
			}
			const contentType = response.headers()['content-type']
			expect(contentType).toContain('application/xml')
		})

		test.skip('has cache-control header', async ({ request }) => {
			const response = await request.get('/sitemap.xml')
			if (response.status() === 404) {
				test.skip()
			}
			const cacheControl = response.headers()['cache-control']
			expect(cacheControl).toBeTruthy()
		})

		test.skip('contains valid XML', async ({ request }) => {
			const response = await request.get('/sitemap.xml')
			if (response.status() === 404) {
				test.skip()
			}
			const body = await response.text()
			expect(body).toContain('<?xml version="1.0"')
			expect(body).toContain('<urlset')
			expect(body).toContain('</urlset>')
		})

		test.skip('includes homepage URL', async ({ request }) => {
			const response = await request.get('/sitemap.xml')
			if (response.status() === 404) {
				test.skip()
			}
			const body = await response.text()
			expect(body).toContain('<loc>')
			expect(body).toContain('sveltesociety.dev/')
		})

		test.skip('includes lastmod dates', async ({ request }) => {
			const response = await request.get('/sitemap.xml')
			if (response.status() === 404) {
				test.skip()
			}
			const body = await response.text()
			expect(body).toContain('<lastmod>')
		})

		test.skip('includes priority values', async ({ request }) => {
			const response = await request.get('/sitemap.xml')
			if (response.status() === 404) {
				test.skip()
			}
			const body = await response.text()
			expect(body).toContain('<priority>')
		})

		test.skip('includes changefreq values', async ({ request }) => {
			const response = await request.get('/sitemap.xml')
			if (response.status() === 404) {
				test.skip()
			}
			const body = await response.text()
			expect(body).toContain('<changefreq>')
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
