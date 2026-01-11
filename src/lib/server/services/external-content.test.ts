import { describe, expect, test, beforeEach, afterEach, mock } from 'bun:test'
import { Database } from 'bun:sqlite'
import { ExternalContentService } from './external-content'
import { ContentService } from './content'
import { SearchService } from './search'
import { createTestDatabase } from '../db/test-helpers'

describe('ExternalContentService', () => {
	let db: Database
	let searchService: SearchService
	let contentService: ContentService
	let externalContentService: ExternalContentService

	beforeEach(() => {
		// Create in-memory database with all migrations applied
		db = createTestDatabase()

		searchService = new SearchService(db)
		contentService = new ContentService(db, searchService)
		externalContentService = new ExternalContentService(db, contentService)
	})

	afterEach(() => {
		db.close()
	})

	describe('upsertExternalContent', () => {
		test('should create new external content', async () => {
			const data = {
				title: 'Test YouTube Video',
				description: 'A test video',
				type: 'video' as const,
				metadata: { duration: 300, views: 1000 },
				source: {
					type: 'video' as const,
					source: 'youtube',
					externalId: 'abc123',
					url: 'https://youtube.com/watch?v=abc123'
				}
			}

			const contentId = await externalContentService.upsertExternalContent(data)
			expect(contentId).toBeTruthy()

			const content = contentService.getContentById(contentId!)
			expect(content).toBeTruthy()
			expect(content?.title).toBe('Test YouTube Video')
			expect(content?.metadata.externalSource.source).toBe('youtube')
			expect(content?.metadata.externalSource.externalId).toBe('abc123')
		})

		test('should update existing external content', async () => {
			const data = {
				title: 'Original Title',
				type: 'video' as const,
				metadata: { views: 100 },
				source: {
					type: 'video' as const,
					source: 'youtube',
					externalId: 'xyz789',
					url: 'https://youtube.com/watch?v=xyz789'
				}
			}

			// Create initial content
			const contentId = await externalContentService.upsertExternalContent(data)

			// Update with new data
			const updatedData = {
				...data,
				title: 'Updated Title',
				metadata: { views: 200 }
			}

			const updatedId = await externalContentService.upsertExternalContent(updatedData)
			expect(updatedId).toBe(contentId)

			const content = contentService.getContentById(contentId!)
			expect(content).toBeTruthy()
			expect(content?.title).toBe('Updated Title')
			// For now, just verify the update worked
			expect(updatedId).toBe(contentId)
		})
	})

	describe('getContentBySource', () => {
		beforeEach(async () => {
			// Add some test content
			await externalContentService.upsertExternalContent({
				title: 'YouTube Video 1',
				type: 'video',
				metadata: {},
				source: { type: 'video', source: 'youtube', externalId: '1', url: 'url1' }
			})

			await externalContentService.upsertExternalContent({
				title: 'YouTube Video 2',
				type: 'video',
				metadata: {},
				source: { type: 'video', source: 'youtube', externalId: '2', url: 'url2' }
			})
		})

		test('should get all content from a specific source', () => {
			const youtubeContent = externalContentService.getContentBySource('youtube')
			expect(youtubeContent).toHaveLength(2)
			expect(youtubeContent.every((c) => c.metadata.externalSource.source === 'youtube')).toBe(true)
		})

		test('should filter by type if provided', () => {
			const videoContent = externalContentService.getContentBySource('youtube', 'video')
			expect(videoContent).toHaveLength(2)
		})
	})

	describe('getContentByExternalId', () => {
		test('should find content by external ID', async () => {
			await externalContentService.upsertExternalContent({
				title: 'Test Content',
				type: 'video',
				metadata: {},
				source: { type: 'video', source: 'youtube', externalId: 'unique123', url: 'url' }
			})

			const content = externalContentService.getContentByExternalId('youtube', 'unique123')
			expect(content).toBeTruthy()
			expect(content?.title).toBe('Test Content')
		})

		test('should return null for non-existent external ID', () => {
			const content = externalContentService.getContentByExternalId('youtube', 'notfound')
			expect(content).toBeNull()
		})
	})
})
