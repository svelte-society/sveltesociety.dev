import { test, expect } from '@playwright/test'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'

test.describe('OG Image Generation', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

	test('generates OG image with correct dimensions and content type', async ({ request }) => {
		const response = await request.get('/og-image/test-slug')

		// Should return 200 OK
		expect(response.status()).toBe(200)

		// Should return PNG image
		expect(response.headers()['content-type']).toBe('image/png')

		// Should have immutable cache headers
		expect(response.headers()['cache-control']).toContain('immutable')
		expect(response.headers()['cache-control']).toContain('max-age=31536000')

		// Verify it's a valid PNG by checking magic bytes
		const buffer = await response.body()
		expect(buffer.length).toBeGreaterThan(1000) // Should be a substantial image
		expect(buffer[0]).toBe(0x89) // PNG magic bytes
		expect(buffer[1]).toBe(0x50) // P
		expect(buffer[2]).toBe(0x4e) // N
		expect(buffer[3]).toBe(0x47) // G
	})

	test('generates different images for different content types', async ({ request }) => {
		// Use pre-seeded test content from fixtures
		// These slugs correspond to TEST_CONTENT in tests/fixtures/test-data.ts
		const recipeResponse = await request.get('/og-image/test-recipe-counter-component')
		const videoResponse = await request.get('/og-image/test-video-svelte-5-intro')
		const libraryResponse = await request.get('/og-image/test-library-testing-library')

		expect(recipeResponse.status()).toBe(200)
		expect(videoResponse.status()).toBe(200)
		expect(libraryResponse.status()).toBe(200)

		// Get image buffers
		const recipeBuffer = await recipeResponse.body()
		const videoBuffer = await videoResponse.body()
		const libraryBuffer = await libraryResponse.body()

		// Images should have different sizes (different content = different file size)
		expect(recipeBuffer.length).not.toBe(videoBuffer.length)
		expect(videoBuffer.length).not.toBe(libraryBuffer.length)
	})

	test('caches generated images for faster subsequent requests', async ({ request }) => {
		const slug = 'cached-test-slug'

		// First request - generates image
		const firstResponse = await request.get(`/og-image/${slug}`)
		expect(firstResponse.status()).toBe(200)

		// Second request - should be served from cache (much faster)
		const startTime = Date.now()
		const secondResponse = await request.get(`/og-image/${slug}`)
		const duration = Date.now() - startTime

		expect(secondResponse.status()).toBe(200)
		expect(duration).toBeLessThan(100) // Cached response should be very fast

		// Both should return the same content
		const firstBuffer = await firstResponse.body()
		const secondBuffer = await secondResponse.body()
		expect(firstBuffer.equals(secondBuffer)).toBe(true)
	})

	test('handles non-existent content with fallback image', async ({ request }) => {
		const response = await request.get('/og-image/non-existent-slug-12345')

		// Should still return 200 with fallback image
		expect(response.status()).toBe(200)
		expect(response.headers()['content-type']).toBe('image/png')

		// Should still be a valid PNG
		const buffer = await response.body()
		expect(buffer.length).toBeGreaterThan(1000)
		expect(buffer[0]).toBe(0x89) // PNG magic bytes
	})
})
