import { describe, expect, it, mock, beforeEach } from 'bun:test'
import { Database } from 'bun:sqlite'
import { MetadataService } from './metadata'

describe('MetadataService', () => {
	let db: Database
	let service: MetadataService

	beforeEach(() => {
		db = new Database(':memory:')
		db.exec(`
      CREATE TABLE content (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        metadata TEXT
      )
    `)
		service = new MetadataService(db)
	})

	describe('fetchNpmMetadata', () => {
		it('should fetch metadata for an npm package', async () => {
			const result = await service.fetchNpmMetadata('svelte')
			expect(result).toBeDefined()
			expect(result.name).toBe('svelte')
		})
	})

	describe('fetchGithubMetadata', () => {
		it('should fetch metadata for a GitHub repository', async () => {
			const result = await service.fetchGithubMetadata('sveltejs/svelte')
			expect(result).toBeDefined()
		})
	})

	describe('fetchLibraryMetadata', () => {
		it('should fetch metadata from both npm and github', async () => {
			const result = await service.fetchLibraryMetadata('svelte', 'sveltejs/svelte')
			expect(result).toBeDefined()
			expect(result.npm).toBeDefined()
			expect(result.github).toBeDefined()
			expect(result.type).toBe('library')
		})

		it('should handle npm metadata only', async () => {
			const result = await service.fetchLibraryMetadata('svelte')
			expect(result).toBeDefined()
			expect(result.npm).toBeDefined()
			expect(result.github).toBeUndefined()
		})

		it('should handle github metadata only', async () => {
			const result = await service.fetchLibraryMetadata(undefined, 'sveltejs/svelte')
			expect(result).toBeDefined()
			expect(result.npm).toBeUndefined()
			expect(result.github).toBeDefined()
		})
	})

	describe('fetchYoutubeMetadata', () => {
		it('should fetch metadata for a YouTube video', async () => {
			const result = await service.fetchYoutubeMetadata('abcdef12345')
			expect(result).toBeDefined()
		})
	})

	describe('updateContentMetadata', () => {
		it('should update library content with npm and github metadata', async () => {
			// Insert test content
			const stmt = db.prepare(`
        INSERT INTO content (id, type, metadata) VALUES (?, ?, ?)
      `)
			stmt.run('test-id', 'library', JSON.stringify({ npm: 'svelte', github: 'sveltejs/svelte' }))

			// Mock the methods with appropriate return types
			const originalMethod = service.updateContentWithLibraryMetadata
			service.updateContentWithLibraryMetadata = mock(() => {
				return Promise.resolve({
					type: 'library',
					npm: {
						name: 'svelte',
						version: '1.0.0',
						description: 'Test description',
						downloads: 0,
						stars: 0,
						lastUpdated: ''
					},
					github: {
						owner: 'sveltejs',
						repo: 'svelte',
						stars: 0,
						forks: 0,
						issues: 0,
						lastUpdated: ''
					}
				})
			})

			const result = await service.updateContentMetadata('test-id')
			expect(result.success).toBe(true)

			// Restore original method
			service.updateContentWithLibraryMetadata = originalMethod
		})

		it('should update video content with youtube metadata', async () => {
			// Insert test content
			const stmt = db.prepare(`
        INSERT INTO content (id, type, metadata) VALUES (?, ?, ?)
      `)
			stmt.run('test-id', 'video', JSON.stringify({ videoId: 'abcdef12345' }))

			// Mock the methods with appropriate return types
			const originalMethod = service.updateContentWithYoutubeMetadata
			service.updateContentWithYoutubeMetadata = mock(() => {
				return Promise.resolve({
					title: 'Test video',
					description: 'Test description',
					channelName: 'Test channel',
					publishedAt: '',
					views: 0,
					likes: 0
				})
			})

			const result = await service.updateContentMetadata('test-id')
			expect(result.success).toBe(true)

			// Restore original method
			service.updateContentWithYoutubeMetadata = originalMethod
		})
	})
})
