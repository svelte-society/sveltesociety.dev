import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { Database } from 'bun:sqlite'
import { ExternalContentService } from './external-content'
import { ContentService } from './content'
import { SearchService } from './search'

describe('ExternalContentService', () => {
	let db: Database
	let searchService: SearchService
	let contentService: ContentService
	let externalContentService: ExternalContentService

	beforeEach(() => {
		db = new Database(':memory:')

		// Create necessary tables
		db.exec(`
			CREATE TABLE IF NOT EXISTS content (
				id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
				title TEXT NOT NULL UNIQUE,
				type TEXT NOT NULL CHECK(type IN ('recipe', 'video', 'library', 'announcement', 'link', 'blog', 'collection', 'event')),
				status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published', 'archived', 'pending_review')),
				body TEXT,
				rendered_body TEXT,
				slug TEXT NOT NULL UNIQUE,
				description TEXT,
				metadata TEXT,
				children TEXT,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				published_at TIMESTAMP,
				likes INTEGER NOT NULL DEFAULT 0,
				saves INTEGER NOT NULL DEFAULT 0
			);
			
			CREATE TABLE IF NOT EXISTS tags (
				id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
				name TEXT NOT NULL,
				slug TEXT NOT NULL UNIQUE,
				color TEXT,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
			);
			
			CREATE TABLE IF NOT EXISTS content_to_tags (
				content_id TEXT NOT NULL,
				tag_id TEXT NOT NULL,
				PRIMARY KEY (content_id, tag_id),
				FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE,
				FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
			);
			
			CREATE TABLE IF NOT EXISTS users (
				id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
				email TEXT UNIQUE,
				username TEXT UNIQUE,
				name TEXT,
				avatar_url TEXT,
				bio TEXT,
				location TEXT,
				twitter TEXT,
				role INTEGER,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
			);
			
			CREATE TABLE IF NOT EXISTS content_to_users (
				content_id TEXT NOT NULL,
				user_id TEXT NOT NULL,
				PRIMARY KEY (content_id, user_id),
				FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE,
				FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
			);
			
			CREATE TABLE IF NOT EXISTS likes (
				id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
				user_id TEXT NOT NULL,
				target_id TEXT NOT NULL,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				UNIQUE(user_id, target_id),
				FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
				FOREIGN KEY (target_id) REFERENCES content(id) ON DELETE CASCADE
			);
			
			CREATE TABLE IF NOT EXISTS saves (
				id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
				user_id TEXT NOT NULL,
				target_id TEXT NOT NULL,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				UNIQUE(user_id, target_id),
				FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
				FOREIGN KEY (target_id) REFERENCES content(id) ON DELETE CASCADE
			);
		`)

		searchService = new SearchService(db)
		contentService = new ContentService(db, searchService)
		externalContentService = new ExternalContentService(db, contentService)
	})

	afterEach(() => {
		db.close()
	})

	describe('upsertExternalContent', () => {
		it('should create new external content', async () => {
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

		it('should update existing external content', async () => {
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

		it('should get all content from a specific source', () => {
			const youtubeContent = externalContentService.getContentBySource('youtube')
			expect(youtubeContent).toHaveLength(2)
			expect(youtubeContent.every((c) => c.metadata.externalSource.source === 'youtube')).toBe(true)
		})

		it('should filter by type if provided', () => {
			const videoContent = externalContentService.getContentBySource('youtube', 'video')
			expect(videoContent).toHaveLength(2)
		})
	})

	describe('getContentByExternalId', () => {
		it('should find content by external ID', async () => {
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

		it('should return null for non-existent external ID', () => {
			const content = externalContentService.getContentByExternalId('youtube', 'notfound')
			expect(content).toBeNull()
		})
	})

	describe('needsUpdate', () => {
		it('should return true if content has no lastFetched', () => {
			const content = {
				id: '1',
				title: 'Test',
				type: 'video' as const,
				slug: 'test',
				status: 'published' as const,
				metadata: { externalSource: {} }
			}

			expect(externalContentService.needsUpdate(content)).toBe(true)
		})

		it('should return true if lastModified is newer', () => {
			const content = {
				id: '1',
				title: 'Test',
				type: 'video' as const,
				slug: 'test',
				status: 'published' as const,
				metadata: {
					externalSource: {
						lastFetched: '2024-01-01T00:00:00Z',
						lastModified: '2024-01-01T00:00:00Z'
					}
				}
			}

			expect(externalContentService.needsUpdate(content, '2024-01-02T00:00:00Z')).toBe(true)
		})

		it('should return false if content is recent', () => {
			const content = {
				id: '1',
				title: 'Test',
				type: 'video' as const,
				slug: 'test',
				status: 'published' as const,
				metadata: {
					externalSource: {
						lastFetched: new Date().toISOString()
					}
				}
			}

			expect(externalContentService.needsUpdate(content)).toBe(false)
		})
	})

	describe('syncFromSource', () => {
		it('should sync content from external source', async () => {
			const mockFetch = vi.fn().mockResolvedValue([
				{
					title: 'New Video',
					type: 'video' as const,
					metadata: {},
					source: { type: 'video' as const, source: 'youtube', externalId: 'new1', url: 'url1' }
				},
				{
					title: 'Another Video',
					type: 'video' as const,
					metadata: {},
					source: { type: 'video' as const, source: 'youtube', externalId: 'new2', url: 'url2' }
				}
			])

			const stats = await externalContentService.syncFromSource('youtube', mockFetch)

			expect(stats.created).toBe(2)
			expect(stats.updated).toBe(0)
			expect(stats.deleted).toBe(0)
			expect(mockFetch).toHaveBeenCalledOnce()
		})

		it('should delete orphaned content when requested', async () => {
			// Add existing content
			await externalContentService.upsertExternalContent({
				title: 'Old Video',
				type: 'video',
				metadata: {},
				source: { type: 'video', source: 'youtube', externalId: 'old1', url: 'url' }
			})

			// Sync with new data that doesn't include the old video
			const mockFetch = vi.fn().mockResolvedValue([
				{
					title: 'New Video',
					type: 'video' as const,
					metadata: {},
					source: { type: 'video' as const, source: 'youtube', externalId: 'new1', url: 'url1' }
				}
			])

			const stats = await externalContentService.syncFromSource('youtube', mockFetch, {
				deleteOrphaned: true
			})

			expect(stats.created).toBe(1)
			expect(stats.deleted).toBe(1)

			// Verify old content is gone
			const oldContent = externalContentService.getContentByExternalId('youtube', 'old1')
			expect(oldContent).toBeNull()
		})
	})
})
