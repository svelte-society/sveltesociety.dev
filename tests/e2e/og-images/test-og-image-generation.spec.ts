import { test, expect } from '@playwright/test'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'
import { existsSync, rmSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

test.describe('OG Image Generation', () => {
	test.beforeAll(() => {
		// Clear OG image cache once before all tests to ensure fresh generation
		const stateDir = process.env.STATE_DIRECTORY || '.state_directory'
		const ogCacheDir = join(stateDir, 'files', 'og')

		if (existsSync(ogCacheDir)) {
			try {
				rmSync(ogCacheDir, { recursive: true, force: true })
			} catch (err) {
				console.warn('Failed to clear OG cache:', err)
			}
		}

		// Recreate the directory for fresh cache writes
		mkdirSync(ogCacheDir, { recursive: true })
	})

	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

	test('generates OG image with correct dimensions and content type', async ({ request }) => {
		const response = await request.get('/og-image/test-slug')

		// Should return 200 OK
		expect(response.status()).toBe(200)

		// Should return PNG image
		expect(response.headers()['content-type']).toBe('image/png')

		// Should have immutable cache headers (7 days = 604800 seconds)
		expect(response.headers()['cache-control']).toContain('immutable')
		expect(response.headers()['cache-control']).toContain('max-age=604800')

		// Verify it's a valid PNG by checking magic bytes
		const buffer = await response.body()
		expect(buffer.length).toBeGreaterThan(1000) // Should be a substantial image
		expect(buffer[0]).toBe(0x89) // PNG magic bytes
		expect(buffer[1]).toBe(0x50) // P
		expect(buffer[2]).toBe(0x4e) // N
		expect(buffer[3]).toBe(0x47) // G
	})

	test('generates recipe OG image with description', async ({ request }) => {
		const response = await request.get('/og-image/test-recipe-counter-component-content_recipe_001')

		expect(response.status()).toBe(200)
		expect(response.headers()['content-type']).toBe('image/png')

		const buffer = await response.body()
		expect(buffer.length).toBeGreaterThan(1000)

		// Verify it's a valid PNG
		expect(buffer[0]).toBe(0x89) // PNG magic bytes
		expect(buffer[1]).toBe(0x50) // P
		expect(buffer[2]).toBe(0x4e) // N
		expect(buffer[3]).toBe(0x47) // G
	})

	test('generates video OG image with thumbnail', async ({ request }) => {
		const response = await request.get('/og-image/test-video-svelte-5-intro-content_video_001')

		expect(response.status()).toBe(200)
		expect(response.headers()['content-type']).toBe('image/png')

		const buffer = await response.body()
		expect(buffer.length).toBeGreaterThan(1000)

		// Verify it's a valid PNG
		expect(buffer[0]).toBe(0x89)
		expect(buffer[1]).toBe(0x50)
		expect(buffer[2]).toBe(0x4e)
		expect(buffer[3]).toBe(0x47)
	})

	test('generates library OG image with GitHub stats', async ({ request }) => {
		const response = await request.get('/og-image/test-library-testing-library-content_library_001')

		expect(response.status()).toBe(200)
		expect(response.headers()['content-type']).toBe('image/png')

		const buffer = await response.body()
		expect(buffer.length).toBeGreaterThan(1000)

		// Verify it's a valid PNG
		expect(buffer[0]).toBe(0x89)
		expect(buffer[1]).toBe(0x50)
		expect(buffer[2]).toBe(0x4e)
		expect(buffer[3]).toBe(0x47)
	})

	test('generates announcement OG image with description', async ({ request }) => {
		const response = await request.get(
			'/og-image/test-announcement-svelte-5-released-content_announcement_001'
		)

		expect(response.status()).toBe(200)
		expect(response.headers()['content-type']).toBe('image/png')

		const buffer = await response.body()
		expect(buffer.length).toBeGreaterThan(1000)

		// Verify it's a valid PNG
		expect(buffer[0]).toBe(0x89)
		expect(buffer[1]).toBe(0x50)
		expect(buffer[2]).toBe(0x4e)
		expect(buffer[3]).toBe(0x47)
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

	test('generates collection OG image with child item previews', async ({ request }) => {
		// Collection has children: content_library_001 and content_recipe_001
		const response = await request.get(
			'/og-image/test-collection-best-components-content_collection_001'
		)

		expect(response.status()).toBe(200)
		expect(response.headers()['content-type']).toBe('image/png')

		const buffer = await response.body()

		// Collection images should be larger than simple content types
		// because they include preview cards for child items
		expect(buffer.length).toBeGreaterThan(10000)

		// Verify it's a valid PNG
		expect(buffer[0]).toBe(0x89) // PNG magic bytes
		expect(buffer[1]).toBe(0x50) // P
		expect(buffer[2]).toBe(0x4e) // N
		expect(buffer[3]).toBe(0x47) // G
	})

	test('collection images differ from their child content images', async ({ request }) => {
		// Get collection image
		const collectionResponse = await request.get(
			'/og-image/test-collection-best-components-content_collection_001'
		)

		// Get one of its child content images
		const childLibraryResponse = await request.get(
			'/og-image/test-library-testing-library-content_library_001'
		)

		expect(collectionResponse.status()).toBe(200)
		expect(childLibraryResponse.status()).toBe(200)

		const collectionBuffer = await collectionResponse.body()
		const childBuffer = await childLibraryResponse.body()

		// Collection image should be different from its child's image
		expect(collectionBuffer.length).not.toBe(childBuffer.length)
		expect(collectionBuffer.equals(childBuffer)).toBe(false)
	})
})
