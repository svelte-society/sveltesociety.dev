import { describe, test, expect, beforeEach, afterEach } from 'bun:test'
import Database from 'bun:sqlite'
import { ContentService } from './content'
import { SearchService } from './search'
import { createTestDatabase } from '../db/test-helpers'

describe('ContentService', () => {
	let db: Database
	let searchService: SearchService
	let contentService: ContentService

	beforeEach(() => {
		// Create in-memory database with all migrations applied
		db = createTestDatabase()
		searchService = new SearchService(db)
		contentService = new ContentService(db, searchService)

		// Insert test data
		db.prepare(
			`
      INSERT INTO tags (id, name, slug, color)
      VALUES
        ('tag1', 'Svelte', 'svelte', '#FF3E00'),
        ('tag2', 'TypeScript', 'typescript', '#3178C6'),
        ('tag3', 'Web Development', 'webdev', '#61DAFB')
    `
		).run()

		db.prepare(
			`
      INSERT INTO content (id, title, type, status, body, rendered_body, slug, description, published_at)
      VALUES
        ('content1', 'Svelte Tutorial', 'recipe', 'published', 'Svelte tutorial content', '<p>Svelte tutorial content</p>', 'svelte-tutorial', 'Learn Svelte', '2025-03-16 20:33:30'),
        ('content2', 'TypeScript Guide', 'library', 'published', 'TypeScript guide content', '<p>TypeScript guide content</p>', 'typescript-guide', 'Master TypeScript', '2025-03-16 20:33:29'),
        ('content3', 'Draft Post', 'recipe', 'draft', 'Draft content', '<p>Draft content</p>', 'draft-post', 'Draft description', '2025-03-16 20:33:28'),
        ('content4', 'Multi-tag Post', 'recipe', 'published', 'Content with multiple tags', '<p>Content with multiple tags</p>', 'multi-tag-post', 'Post with multiple tags', '2025-03-16 20:33:27')
    `
		).run()

		db.prepare(
			`
      INSERT INTO content_to_tags (content_id, tag_id)
      VALUES
        ('content1', 'tag1'),
        ('content1', 'tag2'),
        ('content2', 'tag2'),
        ('content4', 'tag1'),
        ('content4', 'tag2'),
        ('content4', 'tag3')
    `
		).run()

		// Initialize content service
		contentService = new ContentService(db, searchService)
	})

	afterEach(() => {
		db.close()
	})

	describe('getFilteredContent', () => {
		test('should return only published content by default', () => {
			const content = contentService.getFilteredContent()
			expect(content.length).toBe(3)
			expect(content.every((item) => item.status === 'published')).toBe(true)
		})

		test('should filter by type', () => {
			const content = contentService.getFilteredContent({ type: 'recipe' })
			expect(content.length).toBe(2)
			expect(content.every((item) => item.type === 'recipe')).toBe(true)
		})

		test('should filter by single tag', () => {
			const content = contentService.getFilteredContent({ tags: ['svelte'] })
			expect(content.length).toBe(2)
			expect(
				content.every((item) => {
					return item.tags.some((tag: any) => tag.slug === 'svelte')
				})
			).toBe(true)
		})

		test('should handle multiple tags', () => {
			const content = contentService.getFilteredContent({ tags: ['svelte', 'typescript'] })
			expect(content.length).toBe(2)
			expect(
				content.every((item) => {
					return item.tags.some((tag: any) => tag.slug === 'svelte' || tag.slug === 'typescript')
				})
			).toBe(true)
		})

		test('should handle limit in pagination', () => {
			const content = contentService.getFilteredContent({ limit: 2 })
			expect(content.length).toBe(2)
		})

		test('should handle offset in pagination', () => {
			const allContent = contentService.getFilteredContent()
			const offsetContent = contentService.getFilteredContent({ offset: 1, limit: 2 })
			expect(offsetContent.length).toBe(2)
			expect(offsetContent[0].id).toBe(allContent[1].id)
			expect(offsetContent[1].id).toBe(allContent[2].id)
		})

		test('should sort by latest by default', () => {
			const content = contentService.getFilteredContent()
			for (let i = 1; i < content.length; i++) {
				const currentDate = content[i].published_at ? new Date(content[i].published_at) : new Date(0)
				const previousDate = content[i - 1].published_at ? new Date(content[i - 1].published_at) : new Date(0)
				expect(currentDate <= previousDate).toBe(true)
			}
		})

		test('should sort by oldest when specified', () => {
			const content = contentService.getFilteredContent({ sort: 'oldest' })
			for (let i = 1; i < content.length; i++) {
				const currentDate = content[i].published_at ? new Date(content[i].published_at) : new Date(0)
				const previousDate = content[i - 1].published_at ? new Date(content[i - 1].published_at) : new Date(0)
				expect(currentDate >= previousDate).toBe(true)
			}
		})
	})

	describe('getFilteredContentCount', () => {
		test('should return correct total count', () => {
			const count = contentService.getFilteredContentCount()
			expect(count).toBe(3) // Only published content
		})

		test('should return correct count with tag filter', () => {
			const count = contentService.getFilteredContentCount({ tags: ['svelte'] })
			expect(count).toBe(2)
		})

		test('should return correct count with multiple tags', () => {
			const count = contentService.getFilteredContentCount({ tags: ['svelte', 'typescript'] })
			expect(count).toBe(2)
		})

		// Note: Search count test requires FTS index setup
	})

	describe('getContentById', () => {
		test('should return content by id with author', () => {
			const content = contentService.getContentById('content1')
			expect(content).toBeDefined()
			expect(content?.id).toBe('content1')
			expect(content?.title).toBe('Svelte Tutorial')
			expect(content?.type).toBe('recipe')
		})

		test('should return null for non-existent id', () => {
			const content = contentService.getContentById('non-existent')
			expect(content).toBeNull()
		})

		test('should return null for empty id', () => {
			const content = contentService.getContentById('')
			expect(content).toBeNull()
		})

		test('should include tags with content', () => {
			const content = contentService.getContentById('content1')
			expect(content?.tags).toBeDefined()
			expect(Array.isArray(content?.tags)).toBe(true)
			expect(content?.tags.length).toBeGreaterThan(0)
		})
	})

	describe('getContentBySlug', () => {
		test('should return published content by slug', () => {
			const content = contentService.getContentBySlug('svelte-tutorial')
			expect(content).toBeDefined()
			expect(content?.slug).toBe('svelte-tutorial')
			expect(content?.title).toBe('Svelte Tutorial')
		})

		test('should not return draft content by default', () => {
			const content = contentService.getContentBySlug('draft-post')
			expect(content).toBeNull()
		})

		test('should return draft content when any_status is true', () => {
			const content = contentService.getContentBySlug('draft-post', true)
			expect(content).toBeDefined()
			expect(content?.slug).toBe('draft-post')
			expect(content?.status).toBe('draft')
		})

		test('should return null for non-existent slug', () => {
			const content = contentService.getContentBySlug('non-existent-slug')
			expect(content).toBeNull()
		})
	})

	describe('addContent', () => {
		test('should create new content', () => {
			const newContent = {
				title: 'New Test Content',
				slug: 'new-test-content',
				type: 'recipe' as const,
				body: 'Test body',
				rendered_body: '<p>Test body</p>',
				description: 'Test description',
				status: 'draft' as const,
				published_at: null,
				tags: ['tag1']
			}

			const id = contentService.addContent(newContent)
			expect(id).toBeDefined()
			expect(typeof id).toBe('string')

			// Verify content was created
			const content = contentService.getContentById(id)
			expect(content?.title).toBe('New Test Content')
			expect(content?.slug).toBe('new-test-content')
			expect(content?.type).toBe('recipe')
			expect(content?.status).toBe('draft')
		})

		test('should create content with author', () => {
			// First create a user
			db.prepare('INSERT INTO users (id, username, email) VALUES (?, ?, ?)').run(
				'author1',
				'testauthor',
				'author@test.com'
			)

			const newContent = {
				title: 'Content With Author',
				slug: 'content-with-author',
				type: 'recipe' as const,
				body: 'Test body',
				rendered_body: '<p>Test body</p>',
				description: 'Test description',
				status: 'published' as const,
				published_at: new Date().toISOString(),
				tags: []
			}

			const id = contentService.addContent(newContent, 'author1')
			expect(id).toBeDefined()

			// Verify author association
			const authors = db
				.prepare('SELECT user_id FROM content_to_users WHERE content_id = ?')
				.all(id) as { user_id: string }[]
			expect(authors.length).toBe(1)
			expect(authors[0].user_id).toBe('author1')
		})

		test('should create content with multiple tags', () => {
			const newContent = {
				title: 'Multi-tag Content',
				slug: 'multi-tag-content',
				type: 'library' as const,
				description: 'Test description',
				status: 'published' as const,
				published_at: new Date().toISOString(),
				metadata: {},
				tags: ['tag1', 'tag2']
			}

			const id = contentService.addContent(newContent)
			expect(id).toBeDefined()

			// Verify tags
			const tags = db
				.prepare('SELECT tag_id FROM content_to_tags WHERE content_id = ?')
				.all(id) as { tag_id: string }[]
			expect(tags.length).toBe(2)
		})

		test('should add content to search index with tag slugs', () => {
			const newContent = {
				title: 'Searchable Content',
				slug: 'searchable-content',
				type: 'recipe' as const,
				body: 'Content with searchable tags',
				rendered_body: '<p>Content with searchable tags</p>',
				description: 'Description',
				status: 'published' as const,
				published_at: new Date().toISOString(),
				tags: ['tag1', 'tag2']
			}

			const id = contentService.addContent(newContent)

			// Verify content is in search index with correct tag slugs
			const indexed = searchService.getContentById(id)
			expect(indexed).toBeDefined()
			expect(indexed?.tags).toContain('svelte')
			expect(indexed?.tags).toContain('typescript')
		})
	})

	describe('updateContent', () => {
		test('should update content fields', () => {
			// Get existing content to provide all required fields
			const existing = db.prepare('SELECT * FROM content WHERE id = ?').get('content1') as any

			const updates = {
				id: 'content1',
				title: 'Updated Title',
				slug: existing.slug,
				type: existing.type,
				status: existing.status,
				body: existing.body,
				rendered_body: existing.rendered_body || '',
				published_at: existing.published_at,
				description: 'Updated description',
				tags: []
			}

			contentService.updateContent(updates)

			const content = contentService.getContentById('content1')
			expect(content?.title).toBe('Updated Title')
			expect(content?.description).toBe('Updated description')
		})

		test('should update content status', () => {
			// Get existing content to provide all required fields
			const existing = db.prepare('SELECT * FROM content WHERE id = ?').get('content3') as any

			const updates = {
				id: 'content3',
				title: existing.title,
				slug: existing.slug,
				type: existing.type,
				body: existing.body,
				rendered_body: existing.rendered_body || '',
				published_at: existing.published_at,
				description: existing.description,
				status: 'published' as const,
				tags: []
			}

			contentService.updateContent(updates)

			const content = contentService.getContentById('content3')
			expect(content?.status).toBe('published')
		})

		test('should update content tags', () => {
			// Get existing content to provide all required fields
			const existing = db.prepare('SELECT * FROM content WHERE id = ?').get('content1') as any

			const updates = {
				id: 'content1',
				title: existing.title,
				slug: existing.slug,
				type: existing.type,
				status: existing.status,
				body: existing.body,
				rendered_body: existing.rendered_body || '',
				published_at: existing.published_at,
				description: existing.description,
				tags: ['tag2', 'tag3']
			}

			contentService.updateContent(updates)

			const content = contentService.getContentById('content1')
			expect(content?.tags.length).toBe(2)
			expect(content?.tags.some((t: any) => t.id === 'tag2')).toBe(true)
			expect(content?.tags.some((t: any) => t.id === 'tag3')).toBe(true)
		})

		test('should set published_at when publishing', () => {
			// Get existing content to provide all required fields
			const existing = db.prepare('SELECT * FROM content WHERE id = ?').get('content3') as any

			const updates = {
				id: 'content3',
				title: existing.title,
				slug: existing.slug,
				type: existing.type,
				body: existing.body,
				rendered_body: existing.rendered_body || '',
				published_at: existing.published_at,
				description: existing.description,
				status: 'published' as const,
				tags: []
			}

			contentService.updateContent(updates)

			const content = db.prepare('SELECT published_at FROM content WHERE id = ?').get('content3') as {
				published_at: string
			}
			expect(content.published_at).toBeDefined()
			expect(content.published_at).not.toBeNull()
		})

		test('should update search index with tag slugs', () => {
			// Get existing content to provide all required fields
			const existing = db.prepare('SELECT * FROM content WHERE id = ?').get('content1') as any

			const updates = {
				id: 'content1',
				title: 'Updated Searchable Title',
				slug: existing.slug,
				type: existing.type,
				body: existing.body,
				description: existing.description,
				status: existing.status
			}

			contentService.updateContent(updates)

			// Verify search index was updated
			const indexed = searchService.getContentById('content1')
			expect(indexed).toBeDefined()
			expect(indexed?.title).toBe('Updated Searchable Title')
			// Should have tag slugs from the content's tags
			expect(Array.isArray(indexed?.tags)).toBe(true)
		})
	})

	describe('deleteContent', () => {
		test('should delete content successfully', () => {
			const result = contentService.deleteContent('content1')
			expect(result).toBe(true)

			const content = contentService.getContentById('content1')
			expect(content).toBeNull()
		})

		test('should return false for non-existent content', () => {
			const result = contentService.deleteContent('non-existent')
			expect(result).toBe(false)
		})

		test('should delete associated tags', () => {
			contentService.deleteContent('content1')

			const tags = db
				.prepare('SELECT * FROM content_to_tags WHERE content_id = ?')
				.all('content1')
			expect(tags.length).toBe(0)
		})
	})

	describe('getSavedContent', () => {
		test('should return empty array for user with no saves', () => {
			const saved = contentService.getSavedContent('user1')
			expect(saved).toBeDefined()
			expect(Array.isArray(saved.content)).toBe(true)
			expect(saved.content.length).toBe(0)
			expect(saved.count).toBe(0)
		})

		test('should return saved content for user', () => {
			// First create a user
			db.prepare('INSERT INTO users (id, username, email) VALUES (?, ?, ?)').run(
				'user1',
				'testuser',
				'user@test.com'
			)

			// Add a save using target_id (correct column name)
			db.prepare('INSERT INTO saves (user_id, target_id) VALUES (?, ?)').run('user1', 'content1')

			const saved = contentService.getSavedContent('user1')
			expect(saved.content.length).toBe(1)
			expect(saved.content[0].id).toBe('content1')
			expect(saved.count).toBe(1)
		})

		test('should paginate saved content', () => {
			// Create user
			db.prepare('INSERT INTO users (id, username, email) VALUES (?, ?, ?)').run(
				'user2',
				'testuser2',
				'user2@test.com'
			)

			// Add multiple saves using target_id (correct column name)
			db.prepare('INSERT INTO saves (user_id, target_id) VALUES (?, ?)').run('user2', 'content1')
			db.prepare('INSERT INTO saves (user_id, target_id) VALUES (?, ?)').run('user2', 'content2')

			const page1 = contentService.getSavedContent('user2', 1, 1)
			expect(page1.content.length).toBe(1)
			expect(page1.count).toBe(2)

			const page2 = contentService.getSavedContent('user2', 2, 1)
			expect(page2.content.length).toBe(1)
		})
	})

	describe('edge cases', () => {
		test('should handle content with null metadata', () => {
			db.prepare(
				'INSERT INTO content (id, title, type, status, body, rendered_body, slug, description, published_at, metadata) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
			).run(
				'content-null-meta',
				'Null Meta Content',
				'recipe',
				'published',
				'body',
				'<p>body</p>',
				'null-meta',
				'desc',
				'2025-03-16 20:33:30',
				null
			)

			const content = contentService.getContentById('content-null-meta')
			expect(content).toBeDefined()
			expect(content?.metadata).toBeNull()
		})

		test('should handle filtering with no results', () => {
			const content = contentService.getFilteredContent({ type: 'blog' })
			expect(content.length).toBe(0)
		})

		test('should handle filtering with invalid tag', () => {
			const content = contentService.getFilteredContent({ tags: ['non-existent-tag'] })
			expect(content.length).toBe(0)
		})

		test('should handle status filter', () => {
			const draftContent = contentService.getFilteredContent({ status: 'draft' })
			expect(draftContent.length).toBe(1)
			expect(draftContent[0].status).toBe('draft')
		})
	})
})
