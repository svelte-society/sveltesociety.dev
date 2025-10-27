import { describe, test, expect, beforeAll, beforeEach } from 'bun:test'
import { Database } from 'bun:sqlite'
import { TagService } from './tags'
import { createTestDatabase } from '../db/test-helpers'

describe('TagService', () => {
	let db: Database
	let tagService: TagService

	beforeAll(() => {
		// Create in-memory database with all migrations applied
		db = createTestDatabase()
	})

	beforeEach(() => {
		// Clear tags table
		db.prepare('DELETE FROM tags').run()

		// Insert test data
		const testData = {
			tags: [
				{ id: 'tag1', name: 'SvelteKit', slug: 'sveltekit', color: '#ff3e00' },
				{ id: 'tag2', name: 'TypeScript', slug: 'typescript', color: '#3178c6' },
				{ id: 'tag3', name: 'JavaScript', slug: 'javascript', color: '#f7df1e' }
			]
		}

		// Insert tags
		const insertTag = db.prepare(`
      INSERT INTO tags (id, name, slug, color)
      VALUES ($id, $name, $slug, $color)
    `)

		for (const tag of testData.tags) {
			insertTag.run({
				id: tag.id,
				name: tag.name,
				slug: tag.slug,
				color: tag.color
			})
		}

		tagService = new TagService(db)
	})

	describe('getTags', () => {
		test('should return all tags with default pagination', () => {
			const tags = tagService.getTags()
			expect(tags.length).toBe(3)
			expect(tags[0].name).toBe('SvelteKit')
			expect(tags[1].name).toBe('TypeScript')
			expect(tags[2].name).toBe('JavaScript')
		})

		test('should respect limit parameter', () => {
			const tags = tagService.getTags({ limit: 2 })
			expect(tags.length).toBe(2)
		})

		test('should respect offset parameter', () => {
			const tags = tagService.getTags({ offset: 1 })
			expect(tags.length).toBe(2)
			expect(tags[0].name).toBe('TypeScript')
		})
	})

	describe('getAllTags', () => {
		test('should return all tags sorted by name', () => {
			const tags = tagService.getAllTags()
			expect(tags.length).toBe(3)
			// Should be sorted alphabetically by name
			expect(tags[0].name).toBe('JavaScript')
			expect(tags[1].name).toBe('SvelteKit')
			expect(tags[2].name).toBe('TypeScript')
		})

		test('should return empty array when table is empty', () => {
			db.prepare('DELETE FROM tags').run()
			const tags = tagService.getAllTags()
			expect(tags.length).toBe(0)
			expect(tags).toEqual([])
		})

		// Note: Error handling in getAllTags (lines 55-57) is defensive code
		// that's difficult to test without breaking the database connection.
		// In practice, SQLite errors would occur during prepare() in the constructor,
		// not during .all() execution. The try-catch remains as defensive programming.
	})

	describe('getTagsCount', () => {
		test('should return correct count of tags', () => {
			const count = tagService.getTagsCount()
			expect(count).toBe(3)
		})

		test('should return 0 for empty table', () => {
			db.prepare('DELETE FROM tags').run()
			const count = tagService.getTagsCount()
			expect(count).toBe(0)
		})
	})

	describe('getTag', () => {
		test('should return tag by id', () => {
			const tag = tagService.getTag('tag1')
			expect(tag).toBeDefined()
			expect(tag?.name).toBe('SvelteKit')
			expect(tag?.slug).toBe('sveltekit')
		})

		test('should return undefined for non-existent tag', () => {
			const tag = tagService.getTag('non-existent')
			expect(tag).toBeUndefined()
		})
	})

	describe('createTag', () => {
		test('should create a new tag', () => {
			const newTag = tagService.createTag({
				name: 'Bun',
				slug: 'bun'
			})
			expect(newTag).toBeDefined()
			expect(newTag.name).toBe('Bun')
			expect(newTag.slug).toBe('bun')
			expect(newTag.id).toBeDefined()
		})

		test('should throw error for duplicate slug', () => {
			expect(() => {
				tagService.createTag({
					name: 'Another SvelteKit',
					slug: 'sveltekit'
				})
			}).toThrow()
		})
	})

	describe('updateTag', () => {
		test('should update an existing tag', () => {
			const updatedTag = tagService.updateTag({
				id: 'tag1',
				name: 'SvelteKit Updated',
				slug: 'sveltekit-updated'
			})
			expect(updatedTag).toBeDefined()
			expect(updatedTag?.name).toBe('SvelteKit Updated')
			expect(updatedTag?.slug).toBe('sveltekit-updated')
		})

		test('should return undefined for non-existent tag', () => {
			const updatedTag = tagService.updateTag({
				id: 'non-existent',
				name: 'Test',
				slug: 'test'
			})
			expect(updatedTag).toBeUndefined()
		})

		test('should throw error for duplicate slug', () => {
			expect(() => {
				tagService.updateTag({
					id: 'tag1',
					name: 'SvelteKit',
					slug: 'typescript' // Already exists
				})
			}).toThrow()
		})
	})

	describe('deleteTag', () => {
		test('should delete an existing tag', () => {
			const result = tagService.deleteTag('tag1')
			expect(result).toBe(true)

			// Verify tag is deleted
			const tag = tagService.getTag('tag1')
			expect(tag).toBeUndefined()
		})

		test('should return false for non-existent tag', () => {
			const result = tagService.deleteTag('non-existent')
			expect(result).toBe(false)
		})
	})
})
