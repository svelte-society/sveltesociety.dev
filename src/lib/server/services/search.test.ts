import { describe, test, expect, beforeAll, beforeEach } from 'bun:test'
import { Database } from 'bun:sqlite'
import { SearchService } from './search'
import fs from 'node:fs'

describe('SearchService', () => {
	let db: Database
	let searchService: SearchService

	beforeAll(() => {
		// Read and execute schema
		const schema = fs.readFileSync('src/lib/server/db/schema/schema.sql', 'utf-8')
		db = new Database(':memory:', { strict: true })
		db.exec(schema)

		// Read and execute triggers
		const triggers = fs.readFileSync('src/lib/server/db/triggers/search.sql', 'utf-8')
		db.exec(triggers)
	})

	beforeEach(() => {
		// Clear all tables
		db.prepare('DELETE FROM content').run()
		db.prepare('DELETE FROM content_fts').run()

		// Insert test data
		const testContent = [
			{
				id: 'test1',
				title: 'Getting Started with Svelte',
				slug: 'getting-started-with-svelte',
				body: 'Learn how to build web applications with Svelte',
				description: 'A comprehensive guide to Svelte development',
				type: 'blog',
				status: 'published',
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
				published_at: new Date().toISOString(),
				likes: 0,
				saves: 0
			},
			{
				id: 'test2',
				title: 'Advanced TypeScript Tips',
				slug: 'advanced-typescript-tips',
				body: 'Discover advanced TypeScript features and patterns',
				description: 'Deep dive into TypeScript development',
				type: 'library',
				status: 'published',
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
				published_at: new Date().toISOString(),
				likes: 0,
				saves: 0
			},
			{
				id: 'test3',
				title: 'Building a Blog with SvelteKit',
				slug: 'building-a-blog-with-sveltekit',
				body: 'Step by step guide to creating a blog with SvelteKit and TypeScript',
				description: 'Learn SvelteKit by building a real project',
				type: 'recipe',
				status: 'published',
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
				published_at: new Date().toISOString(),
				likes: 0,
				saves: 0
			}
		]

		const insertStmt = db.prepare(`
			INSERT INTO content (
				id, title, slug, body, description, type, status,
				created_at, updated_at, published_at, likes, saves
			) VALUES (
				?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
			)
		`)

		for (const content of testContent) {
			insertStmt.run(
				content.id,
				content.title,
				content.slug,
				content.body,
				content.description,
				content.type,
				content.status,
				content.created_at,
				content.updated_at,
				content.published_at,
				content.likes,
				content.saves
			)
		}

		searchService = new SearchService(db)
	})

	describe('search', () => {
		test('should find content by title', () => {
			const results = searchService.search({ query: 'svelte' })
			expect(results).toHaveLength(2)
			expect(results).toContain('test1')
			expect(results).toContain('test3')
		})

		test('should find content by body', () => {
			const results = searchService.search({ query: 'typescript' })
			expect(results).toHaveLength(2)
			expect(results).toContain('test2')
			expect(results).toContain('test3')
		})

		test('should find content by description', () => {
			const results = searchService.search({ query: 'development' })
			expect(results).toHaveLength(2)
			expect(results).toContain('test1')
			expect(results).toContain('test2')
		})

		test('should respect limit parameter', () => {
			const results = searchService.search({ query: 'svelte', limit: 1 })
			expect(results).toHaveLength(1)
		})

		test('should search only specified fields', () => {
			const results = searchService.search({
				query: 'typescript',
				searchFields: ['title']
			})
			expect(results).toHaveLength(1)
			expect(results).toContain('test2')
		})

		test('should handle partial word matches', () => {
			const results = searchService.search({ query: 'type' })
			expect(results).toHaveLength(2)
		})

		test('should return empty array for no matches', () => {
			const results = searchService.search({ query: 'nonexistent' })
			expect(results).toHaveLength(0)
		})

		test('should handle special characters safely', () => {
			const results = searchService.search({ query: 'svelte"kit' })
			expect(Array.isArray(results)).toBe(true)
		})
	})

	describe('count', () => {
		test('should return correct count for title matches', () => {
			const count = searchService.count({ query: 'svelte' })
			expect(count).toBe(2)
		})

		test('should return correct count for body matches', () => {
			const count = searchService.count({ query: 'typescript' })
			expect(count).toBe(2)
		})

		test('should return correct count for description matches', () => {
			const count = searchService.count({ query: 'development' })
			expect(count).toBe(2)
		})

		test('should count only specified fields', () => {
			const count = searchService.count({
				query: 'typescript',
				searchFields: ['title']
			})
			expect(count).toBe(1)
		})

		test('should return 0 for no matches', () => {
			const count = searchService.count({ query: 'nonexistent' })
			expect(count).toBe(0)
		})

		test('should handle special characters safely', () => {
			const count = searchService.count({ query: 'svelte"kit' })
			expect(typeof count).toBe('number')
		})
	})
})
