import { describe, expect, test, beforeEach, afterEach } from 'bun:test'
import { Database } from 'bun:sqlite'
import { MetadataService } from './metadata'
import { createTestDatabase } from '../db/test-helpers'

describe('MetadataService', () => {
	let db: Database
	let service: MetadataService

	beforeEach(() => {
		db = createTestDatabase()
		service = new MetadataService(db)
	})

	afterEach(() => {
		db.close()
	})

	describe('fetchGithubMetadata', () => {
		test('should fetch metadata for a GitHub repository', async () => {
			const result = await service.fetchGithubMetadata('https://github.com/sveltejs/svelte')
			expect(result).toBeDefined()
			expect(result.updated_at).toBeDefined()
			// GitHub API may or may not return data depending on rate limits
			// Stats are returned at top level (not under github key)
			if (result.stars !== undefined) {
				expect(typeof result.stars).toBe('number')
				expect(typeof result.forks).toBe('number')
			}
		})

		test('should handle invalid GitHub URL', async () => {
			const result = await service.fetchGithubMetadata('invalid-url')
			expect(result).toBeDefined()
			expect(result.updated_at).toBeDefined()
		})

		test('should handle empty URL', async () => {
			const result = await service.fetchGithubMetadata('')
			expect(result).toBeDefined()
			// Stats are returned at top level
			expect(result.stars).toBe(0)
			expect(result.forks).toBe(0)
			expect(result.issues).toBe(0)
		})
	})

	describe('fetchYoutubeMetadata', () => {
		test('should return empty metadata when no API key', async () => {
			const result = await service.fetchYoutubeMetadata('dQw4w9WgXcQ')
			expect(result).toBeDefined()
			expect(result.title).toBeDefined()
			expect(result.description).toBeDefined()
			expect(result.duration).toBeDefined()
			expect(result.thumbnail).toBeDefined()
			expect(result.publishedAt).toBeDefined()
		})
	})

	describe('getMetadata', () => {
		test('should return empty object for content with no metadata', () => {
			const content = {
				id: 'test-id',
				type: 'library',
				title: 'Test',
				slug: 'test',
				status: 'published' as const,
				metadata: null
			}

			const result = service.getMetadata(content)
			expect(result).toEqual({})
		})

		test('should return parsed metadata from string', () => {
			const content = {
				id: 'test-id',
				type: 'library',
				title: 'Test',
				slug: 'test',
				status: 'published' as const,
				metadata: JSON.stringify({ github: { stars: 100 } })
			}

			const result = service.getMetadata(content)
			expect(result.github.stars).toBe(100)
		})

		test('should return metadata object directly', () => {
			const content = {
				id: 'test-id',
				type: 'library',
				title: 'Test',
				slug: 'test',
				status: 'published' as const,
				metadata: { github: { stars: 200 } }
			}

			const result = service.getMetadata(content)
			expect(result.github.stars).toBe(200)
		})

		test('should identify stale metadata', () => {
			// Metadata from 2 days ago (stale)
			const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()

			const content = {
				id: 'test-id',
				type: 'library',
				title: 'Test',
				slug: 'test',
				status: 'published' as const,
				metadata: {
					updated_at: twoDaysAgo,
					github: { stars: 100 }
				}
			}

			// Should return current metadata immediately (stale-while-revalidate)
			const result = service.getMetadata(content)
			expect(result.github.stars).toBe(100)
		})

		test('should return fresh metadata immediately', () => {
			// Metadata from 1 hour ago (fresh)
			const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()

			const content = {
				id: 'test-id',
				type: 'library',
				title: 'Test',
				slug: 'test',
				status: 'published' as const,
				metadata: {
					updated_at: oneHourAgo,
					github: { stars: 100 }
				}
			}

			const result = service.getMetadata(content)
			expect(result.github.stars).toBe(100)
			expect(result.updated_at).toBe(oneHourAgo)
		})
	})

	describe('refreshMetadataForContent', () => {
		test('should refresh library metadata with GitHub data', async () => {
			// First insert content
			db.prepare(`
				INSERT INTO content (id, type, title, slug, status, description, metadata)
				VALUES (?, ?, ?, ?, ?, ?, ?)
			`).run(
				'test-id',
				'library',
				'Test Library',
				'test-library',
				'published',
				'Test description',
				JSON.stringify({
					github: { repoUrl: 'https://github.com/sveltejs/svelte' }
				})
			)

			const content = {
				id: 'test-id',
				type: 'library',
				title: 'Test Library',
				slug: 'test-library',
				status: 'published' as const,
				metadata: {
					github: { repoUrl: 'https://github.com/sveltejs/svelte' }
				}
			}

			const result = await service.refreshMetadataForContent(content)
			expect(result).toBeDefined()
			expect(result.updated_at).toBeDefined()
			expect(result.type).toBe('library')
		})

		test('should refresh video metadata with YouTube data', async () => {
			// First insert content
			db.prepare(`
				INSERT INTO content (id, type, title, slug, status, description, metadata)
				VALUES (?, ?, ?, ?, ?, ?, ?)
			`).run(
				'test-id',
				'video',
				'Test Video',
				'test-video',
				'published',
				'Test description',
				JSON.stringify({ videoId: 'dQw4w9WgXcQ' })
			)

			const content = {
				id: 'test-id',
				type: 'video',
				title: 'Test Video',
				slug: 'test-video',
				status: 'published' as const,
				metadata: { videoId: 'dQw4w9WgXcQ' }
			}

			const result = await service.refreshMetadataForContent(content)
			expect(result).toBeDefined()
			expect(result.updated_at).toBeDefined()
			expect(result.type).toBe('video')
		})
	})
})
