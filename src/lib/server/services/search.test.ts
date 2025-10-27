import { describe, test, expect, beforeEach, afterEach } from 'bun:test'
import { Database } from 'bun:sqlite'
import { SearchService } from './search'
import { createTestDatabase } from '../db/test-helpers'

describe('SearchService', () => {
	let db: Database
	let searchService: SearchService

	beforeEach(() => {
		// Create in-memory database with all migrations applied
		db = createTestDatabase()

		// Insert test tags
		db.prepare(
			`
      INSERT INTO tags (id, name, slug, color)
      VALUES
        ('tag1', 'Svelte', 'svelte', '#FF3E00'),
        ('tag2', 'TypeScript', 'typescript', '#3178C6'),
        ('tag3', 'Tutorial', 'tutorial', '#61DAFB')
    `
		).run()

		// Insert test content
		const testContent = [
			{
				id: 'content1',
				title: 'Getting Started with Svelte',
				slug: 'getting-started-with-svelte',
				body: 'Learn how to build web applications with Svelte',
				rendered_body: '<p>Learn how to build web applications with Svelte</p>',
				description: 'A comprehensive guide to Svelte development',
				type: 'recipe',
				status: 'published',
				published_at: new Date().toISOString()
			},
			{
				id: 'content2',
				title: 'Advanced TypeScript Tips',
				slug: 'advanced-typescript-tips',
				body: 'Discover advanced TypeScript features and patterns',
				rendered_body: '<p>Discover advanced TypeScript features and patterns</p>',
				description: 'Deep dive into TypeScript development',
				type: 'library',
				status: 'published',
				published_at: new Date().toISOString()
			},
			{
				id: 'content3',
				title: 'Building a Blog with SvelteKit',
				slug: 'building-a-blog-with-sveltekit',
				body: 'Step by step guide to creating a blog with SvelteKit and TypeScript',
				rendered_body:
					'<p>Step by step guide to creating a blog with SvelteKit and TypeScript</p>',
				description: 'Learn SvelteKit by building a real project',
				type: 'recipe',
				status: 'published',
				published_at: new Date().toISOString()
			},
			{
				id: 'content4',
				title: 'Draft Post',
				slug: 'draft-post',
				body: 'This is a draft post',
				rendered_body: '<p>This is a draft post</p>',
				description: 'Draft content',
				type: 'recipe',
				status: 'draft',
				published_at: null
			}
		]

		const insertStmt = db.prepare(`
			INSERT INTO content (
				id, title, slug, body, rendered_body, description, type, status, published_at
			) VALUES (
				?, ?, ?, ?, ?, ?, ?, ?, ?
			)
		`)

		for (const content of testContent) {
			insertStmt.run(
				content.id,
				content.title,
				content.slug,
				content.body,
				content.rendered_body,
				content.description,
				content.type,
				content.status,
				content.published_at
			)
		}

		// Add tags to content
		db.prepare('INSERT INTO content_to_tags (content_id, tag_id) VALUES (?, ?)').run(
			'content1',
			'tag1'
		)
		db.prepare('INSERT INTO content_to_tags (content_id, tag_id) VALUES (?, ?)').run(
			'content1',
			'tag3'
		)
		db.prepare('INSERT INTO content_to_tags (content_id, tag_id) VALUES (?, ?)').run(
			'content2',
			'tag2'
		)
		db.prepare('INSERT INTO content_to_tags (content_id, tag_id) VALUES (?, ?)').run(
			'content3',
			'tag1'
		)
		db.prepare('INSERT INTO content_to_tags (content_id, tag_id) VALUES (?, ?)').run(
			'content3',
			'tag2'
		)

		// Initialize search service (this will index all content)
		searchService = new SearchService(db)
	})

	afterEach(() => {
		db.close()
	})

	describe('search', () => {
		test('should find content by title', () => {
			const results = searchService.search({ query: 'svelte' })
			expect(results.count).toBeGreaterThanOrEqual(2)
			expect(results.hits.some((hit) => hit.id === 'content1')).toBe(true)
			expect(results.hits.some((hit) => hit.id === 'content3')).toBe(true)
		})

		test('should find content by description', () => {
			const results = searchService.search({ query: 'development' })
			expect(results.count).toBeGreaterThanOrEqual(1)
			expect(results.hits.some((hit) => hit.id === 'content1' || hit.id === 'content2')).toBe(
				true
			)
		})

		test('should respect limit parameter', () => {
			const results = searchService.search({ query: 'svelte', limit: 1 })
			expect(results.hits.length).toBeLessThanOrEqual(1)
		})

		test('should filter by type', () => {
			const results = searchService.search({ type: 'library' })
			expect(results.hits.every((hit) => hit.document.type === 'library')).toBe(true)
		})

		test('should filter by status', () => {
			const results = searchService.search({ status: 'published' })
			expect(results.hits.every((hit) => hit.document.status === 'published')).toBe(true)
		})

		test('should filter by tags', () => {
			const results = searchService.search({ tags: ['svelte'] })
			expect(results.count).toBeGreaterThanOrEqual(1)
			expect(
				results.hits.every((hit) => {
					return hit.document.tags.includes('svelte')
				})
			).toBe(true)
		})

		test('should filter by multiple tags', () => {
			const results = searchService.search({ tags: ['svelte', 'typescript'] })
			expect(results.count).toBeGreaterThanOrEqual(1)
			// Should match content that has ANY of the tags
			expect(
				results.hits.every((hit) => {
					return hit.document.tags.includes('svelte') || hit.document.tags.includes('typescript')
				})
			).toBe(true)
		})

		test('should combine query and filters', () => {
			const results = searchService.search({ query: 'svelte', type: 'recipe' })
			expect(results.hits.every((hit) => hit.document.type === 'recipe')).toBe(true)
		})

		test('should handle offset for pagination', () => {
			const page1 = searchService.search({ limit: 2, offset: 0 })
			const page2 = searchService.search({ limit: 2, offset: 2 })

			// Results should be different (unless there are only 2 items total)
			if (page1.count > 2) {
				expect(page1.hits[0]?.id).not.toBe(page2.hits[0]?.id)
			}
		})

		test('should return empty results for no matches', () => {
			const results = searchService.search({ query: 'nonexistentxyz123' })
			expect(results.count).toBe(0)
			expect(results.hits.length).toBe(0)
		})

		test('should handle empty query', () => {
			const results = searchService.search({ query: '' })
			// Empty query should return all indexed content
			expect(results.count).toBeGreaterThanOrEqual(3)
		})

		test('should handle no filters', () => {
			const results = searchService.search()
			// No filters should return all indexed content
			expect(results.count).toBeGreaterThanOrEqual(3)
		})
	})

	describe('getContentById', () => {
		test('should retrieve content by id', () => {
			const content = searchService.getContentById('content1')
			expect(content).toBeDefined()
			expect(content?.id).toBe('content1')
		})

		test('should return undefined for non-existent id', () => {
			const content = searchService.getContentById('non-existent')
			expect(content).toBeUndefined()
		})
	})

	describe('add', () => {
		test('should add new content to index', () => {
			searchService.add({
				id: 'content5',
				title: 'New Content',
				description: 'New description',
				type: 'recipe',
				status: 'published',
				tags: ['svelte'],
				created_at: new Date().toISOString(),
				published_at: new Date().toISOString(),
				likes: 0,
				saves: 0,
				stars: 0
			})

			const content = searchService.getContentById('content5')
			expect(content).toBeDefined()
			expect(content?.id).toBe('content5')
		})
	})

	describe('update', () => {
		test('should update existing content in index', () => {
			// Get existing content first
			const existing = searchService.getContentById('content1')
			expect(existing).toBeDefined()

			// Update with full document
			searchService.update('content1', {
				...existing,
				title: 'Updated Title',
				description: 'Updated description'
			})

			const content = searchService.getContentById('content1')
			expect(content).toBeDefined()
			expect(content?.title).toBe('Updated Title')
		})
	})

	describe('remove', () => {
		test('should remove content from index', () => {
			searchService.remove('content1')

			const content = searchService.getContentById('content1')
			expect(content).toBeUndefined()
		})
	})

	describe('reindex', () => {
		test('should rebuild entire search index', () => {
			// Add a new content item to the database
			db.prepare(
				`
        INSERT INTO content (id, title, slug, body, rendered_body, description, type, status, published_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
			).run(
				'content5',
				'Reindex Test',
				'reindex-test',
				'Test content',
				'<p>Test content</p>',
				'Test description',
				'recipe',
				'published',
				new Date().toISOString()
			)

			// Before reindex, the new content shouldn't be in search
			let content = searchService.getContentById('content5')
			expect(content).toBeUndefined()

			// After reindex, it should be found
			searchService.reindex()
			content = searchService.getContentById('content5')
			expect(content).toBeDefined()
			expect(content?.id).toBe('content5')
		})
	})
})
