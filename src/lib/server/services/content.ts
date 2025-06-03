import { Database } from 'bun:sqlite'
import { SearchService } from './search'
import type { Content, ContentFilters, ContentWithAuthor } from '$lib/types/content'
import type { Tag } from '$lib/types/tags'

export class ContentService {
	constructor(
		private db: Database,
		private searchService?: SearchService
	) {}

	getContentById(id: string): ContentWithAuthor | null {
		if (!id) {
			console.error('Invalid content ID:', id)
			return null
		}

		try {
			// Begin transaction
			this.db.exec('BEGIN TRANSACTION')

			// Get the main content with author info
			const contentQuery = this.db.prepare(`
				SELECT 
					c.*,
					u.id as author_id,
					u.username as author_username,
					u.name as author_name
				FROM content c
				LEFT JOIN content_to_users cu ON c.id = cu.content_id
				LEFT JOIN users u ON cu.user_id = u.id
				WHERE c.id = ?
			`)
			const content = contentQuery.get(id) as ContentWithAuthor | null

			if (!content) {
				this.db.exec('ROLLBACK')
				return null
			}

			// Parse metadata if it's a string
			if (typeof content.metadata === 'string') {
				try {
					content.metadata = JSON.parse(content.metadata)
				} catch (e) {
					console.error('Error parsing metadata:', e)
					content.metadata = {}
				}
			}

			// Get tags for the main content
			const tagsQuery = this.db.prepare(`
				SELECT t.id, t.name, t.slug, t.created_at, t.updated_at
				FROM tags t
				JOIN content_to_tags ctt ON t.id = ctt.tag_id
				WHERE ctt.content_id = ?
			`)
			const tags = tagsQuery.all(id) as Tag[]
			content.tags = tags || []

			// If it's a collection, ensure children is properly handled
			if (content.type === 'collection') {
				if (typeof content.children === 'string') {
					try {
						// Parse the JSON to get child IDs
						const childrenIds = JSON.parse(content.children)

						if (Array.isArray(childrenIds) && childrenIds.length > 0) {
							// Process each child individually instead of using IN clause
							const childrenContent: Content[] = []

							// Prepare statements for reuse
							const childContentQuery = this.db.prepare(`
							SELECT c.*
							FROM content c
							WHERE c.id = ?
						`)

							const childTagsQuery = this.db.prepare(`
							SELECT t.id, t.name, t.slug, t.created_at, t.updated_at
							FROM tags t
							JOIN content_to_tags ctt ON t.id = ctt.tag_id
							WHERE ctt.content_id = ?
						`)

							// Process each child ID individually
							for (const childId of childrenIds) {
								// Get the child content
								const childContent = childContentQuery.get(childId) as Content | null

								if (childContent) {
									// Parse metadata if it's a string
									if (typeof childContent.metadata === 'string') {
										try {
											childContent.metadata = JSON.parse(childContent.metadata)
										} catch (e) {
											console.error('Error parsing child metadata:', e)
											childContent.metadata = {}
										}
									}

									// Get tags for this child
									const childTags = childTagsQuery.all(childId) as Tag[]

									// Assign tags to each child content
									childContent.tags = childTags || []
									childContent.children = [] // Ensure all children have empty children arrays

									// Add to the children collection
									childrenContent.push(childContent)
								}
							}

							// Set the children on the parent content
							content.children = childrenContent
						} else {
							// Empty children array
							content.children = []
						}
					} catch (e) {
						console.error('Error processing collection children:', e)
						content.children = []
					}
				} else {
					// No children string, ensure empty array
					content.children = []
				}
			}

			// Commit transaction
			this.db.exec('COMMIT')
			return content
		} catch (e) {
			// Rollback transaction on error
			try {
				this.db.exec('ROLLBACK')
			} catch (rollbackError) {
				console.error('Error during transaction rollback:', rollbackError)
			}

			console.error(`Error fetching content with ID ${id}:`, e)
			return null
		}
	}

	getFilteredContent(filters: ContentFilters = {}): ContentWithAuthor[] {
		let contentIds: string[] = []

		if (filters.search?.trim()) {
			const searchQuery = filters.search.trim()
			const searchResults = this.searchService.search({ query: searchQuery })
			contentIds = searchResults.hits.map((hit) => hit.id)
		}

		let query = `
			SELECT DISTINCT c.id
			FROM content c
		`

		const params: any[] = []
		const whereConditions: string[] = []
		const havingConditions: string[] = []

		if (filters.search?.trim()) {
			if (contentIds.length === 0) {
				return []
			}
			whereConditions.push(`c.id IN (${contentIds.map(() => '?').join(',')})`)
			params.push(...contentIds)
		}

		if (filters.status !== 'all') {
			whereConditions.push(filters.status ? 'c.status = ?' : "c.status = 'published'")
			if (filters.status) params.push(filters.status)
		}

		if (filters.type) {
			whereConditions.push('c.type = ?')
			params.push(filters.type)
		}

		if (filters.tags) {
			const tags = Array.isArray(filters.tags) ? filters.tags : [filters.tags]
			if (tags.length > 0) {
				query += `
          JOIN content_to_tags ctt ON c.id = ctt.content_id
          JOIN tags t ON ctt.tag_id = t.id
        `
				whereConditions.push(`t.slug IN (${tags.map(() => '?').join(',')})`)
				params.push(...tags)

				if (tags.length > 1) {
					havingConditions.push('COUNT(DISTINCT t.slug) = ?')
					params.push(tags.length)
				}
			}
		}

		if (whereConditions.length > 0) {
			query += ' WHERE ' + whereConditions.join(' AND ')
		}

		if (filters.tags && Array.isArray(filters.tags) && filters.tags.length > 1) {
			query += ' GROUP BY c.id'
			if (havingConditions.length > 0) {
				query += ' HAVING ' + havingConditions.join(' AND ')
			}
		}

		query += ' ORDER BY '
		if (filters.sort === 'latest') {
			query += 'c.published_at DESC, c.created_at DESC'
		} else if (filters.sort === 'oldest') {
			query += 'c.published_at ASC, c.created_at ASC'
		} else if (filters.sort === 'popular') {
			query += 'c.likes DESC, c.saves DESC'
		} else {
			query += 'c.published_at DESC, c.created_at DESC'
		}

		if (filters.limit) {
			query += ' LIMIT ?'
			params.push(filters.limit)
			if (filters.offset) {
				query += ' OFFSET ?'
				params.push(filters.offset)
			}
		}

		const ids = this.db.prepare(query).all(...params) as { id: string }[]

		return ids
			.map(({ id }) => this.getContentById(id))
			.filter((content): content is ContentWithAuthor => content !== null)
	}

	getFilteredContentCount(filters: Omit<ContentFilters, 'limit' | 'offset' | 'sort'> = {}) {
		let contentIds: string[] = []

		if (filters.search?.trim()) {
			const searchQuery = filters.search.trim()
			const searchResults = this.searchService.search({ query: searchQuery })
			contentIds = searchResults.hits.map((hit) => hit.id)
			if (contentIds.length === 0) return 0
		}

		let query = 'SELECT COUNT(DISTINCT c.id) as total FROM content c'
		const params: any[] = []
		const whereConditions: string[] = []
		const havingConditions: string[] = []

		if (filters.search?.trim()) {
			whereConditions.push(`c.id IN (${contentIds.map(() => '?').join(',')})`)
			params.push(...contentIds)
		}

		if (filters.status === 'all') {
			// Don't add any status condition when requesting all content
		} else {
			whereConditions.push(filters.status ? 'c.status = ?' : "c.status = 'published'")
			if (filters.status) params.push(filters.status)
		}

		if (filters.type) {
			whereConditions.push('c.type = ?')
			params.push(filters.type)
		}

		if (filters.tags) {
			const tags = Array.isArray(filters.tags) ? filters.tags : [filters.tags]
			if (tags.length > 0) {
				query += `
          JOIN content_to_tags ctt ON c.id = ctt.content_id
          JOIN tags t ON ctt.tag_id = t.id
        `
				whereConditions.push(`t.slug IN (${tags.map(() => '?').join(',')})`)
				params.push(...tags)

				if (tags.length > 1) {
					havingConditions.push('COUNT(DISTINCT t.slug) = ?')
					params.push(tags.length)
				}
			}
		}

		if (whereConditions.length > 0) {
			query += ' WHERE ' + whereConditions.join(' AND ')
		}

		if (filters.tags && Array.isArray(filters.tags) && filters.tags.length > 1) {
			query += ' GROUP BY c.id'
			if (havingConditions.length > 0) {
				query += ' HAVING ' + havingConditions.join(' AND ')
			}

			query = `SELECT COUNT(*) as total FROM (${query})`
		}

		const result = this.db.prepare(query).get(...params) as { total: number }
		return result?.total || 0
	}

	addContent(data: {
		title: string
		slug: string
		description: string
		type: string
		status: string
		body: string
		tags: string[]
		metadata?: any
		created_at?: string
		updated_at?: string
		published_at?: string
		author_id?: string
	}) {
		const id = crypto.randomUUID()
		const now = new Date().toISOString()

		this.db
			.prepare(
				`
			INSERT INTO content (
				id, title, slug, description, type, status,
				body, metadata, created_at, updated_at, published_at,
				likes, saves
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0)
		`
			)
			.run(
				id,
				data.title,
				data.slug,
				data.description,
				data.type,
				data.status,
				data.body,
				data.metadata ? JSON.stringify(data.metadata) : null,
				data.created_at || now,
				data.updated_at || now,
				data.published_at || (data.status === 'published' ? now : null)
			)

		// Add author if present
		if (data.author_id) {
			this.db
				.prepare(`INSERT INTO content_to_users (content_id, user_id) VALUES (?, ?)`)
				.run(id, data.author_id)
		}

		// Add tags if present
		if (data.tags && data.tags.length > 0) {
			const insertTagStmt = this.db.prepare(
				`INSERT INTO content_to_tags (content_id, tag_id) VALUES (?, ?)`
			)

			for (const tag of data.tags) {
				insertTagStmt.run(id, tag)
			}
		}

		// Add to search index if published
		if (data.status === 'published') {
			// Get tag slugs for search index
			let tagSlugs: string[] = []
			if (data.tags && data.tags.length > 0) {
				const tagQuery = this.db.prepare(`
					SELECT slug FROM tags WHERE id = ?
				`)
				tagSlugs = data.tags
					.map((tagId) => {
						const tag = tagQuery.get(tagId) as { slug: string } | null
						return tag?.slug || ''
					})
					.filter(Boolean)
			}

			if (this.searchService) {
				this.searchService.add({
					id,
					title: data.title,
					description: data.description,
					tags: tagSlugs,
					type: data.type,
					created_at: data.created_at || now,
					likes: 0,
					saves: 0
				})
			}
		}

		return id
	}

	updateContent(
		id: string,
		data: {
			title: string
			slug: string
			description: string
			type: string
			status: string
			body: string
			tags: string[]
			metadata?: any
		}
	) {
		const now = new Date().toISOString()

		// Update the content record
		this.db
			.prepare(
				`
				UPDATE content
				SET title = ?,
					slug = ?,
					description = ?,
					type = ?,
					status = ?,
					body = ?,
					metadata = ?,
					updated_at = ?,
					published_at = CASE
						WHEN status != 'published' AND ? = 'published' THEN ?
						WHEN status = 'published' AND ? != 'published' THEN NULL
						ELSE published_at
					END
				WHERE id = ?
				`
			)
			.run(
				data.title,
				data.slug,
				data.description,
				data.type,
				data.status,
				data.body,
				data.metadata ? JSON.stringify(data.metadata) : null,
				now,
				data.status,
				now,
				data.status,
				id
			)

		// Delete existing tag associations
		this.db.prepare('DELETE FROM content_to_tags WHERE content_id = ?').run(id)

		// Add new tag associations if present
		if (data.tags && data.tags.length > 0) {
			const insertTagStmt = this.db.prepare(
				`INSERT INTO content_to_tags (content_id, tag_id) VALUES (?, ?)`
			)

			for (const tag of data.tags) {
				insertTagStmt.run(id, tag)
			}
		}
	}

	getContentBySlug(slug: string, type?: string): Content | null {
		if (!slug) {
			console.error('Invalid slug:', slug)
			return null
		}

		try {
			// Build the query based on whether type is provided
			let query = `
				SELECT * FROM content
				WHERE slug = ? AND status = 'published'
			`

			const params: any[] = [slug]

			if (type) {
				query = `
					SELECT * FROM content
					WHERE slug = ? AND type = ? AND status = 'published'
				`
				params.push(type)
			}

			// Get the basic content item
			const contentQuery = this.db.prepare(query)
			const content = contentQuery.get(...params) as Content | null

			if (!content) {
				return null
			}

			// Return the content with children populated
			return this.getContentById(content.id)
		} catch (e) {
			console.error(`Error fetching content with slug ${slug}:`, e)
			return null
		}
	}

	getSavedContent(userId: string, page: number = 1, limit: number = 20) {
		try {
			// Calculate offset
			const offset = (page - 1) * limit

			// Get total count of saved content
			const countQuery = this.db.prepare(`
				SELECT COUNT(1) as count
				FROM saves s
				JOIN content c ON s.target_id = c.id
				WHERE s.user_id = ? AND c.status = 'published'
			`)
			const { count } = countQuery.get(userId) as { count: number }

			// If no saved content, return early with empty array
			if (count === 0) {
				return { content: [], count: 0 }
			}

			// Get paginated saved content IDs
			const savedContentQuery = this.db.prepare(`
				SELECT s.target_id
				FROM saves s
				JOIN content c ON s.target_id = c.id
				WHERE s.user_id = ? AND c.status = 'published'
				ORDER BY s.created_at DESC
				LIMIT ? OFFSET ?
			`)
			const savedContentIds = savedContentQuery
				.all(userId, limit, offset)
				.map((row) => (row as { target_id: string }).target_id)

			// Get content details for the paginated IDs
			const content = savedContentIds
				.map((id) => this.getContentById(id))
				.filter(Boolean) as Content[]

			return { content, count }
		} catch (e) {
			console.error('Error fetching saved content:', e)
			return { content: [], count: 0 }
		}
	}

	deleteContent(id: string): boolean {
		try {
			// Begin transaction
			this.db.exec('BEGIN TRANSACTION')

			// Delete tag associations
			this.db.prepare('DELETE FROM content_to_tags WHERE content_id = ?').run(id)

			// Delete user associations
			this.db.prepare('DELETE FROM content_to_users WHERE content_id = ?').run(id)

			// Delete likes
			this.db.prepare('DELETE FROM likes WHERE target_id = ?').run(id)

			// Delete saves
			this.db.prepare('DELETE FROM saves WHERE target_id = ?').run(id)

			// Delete the content itself
			const result = this.db.prepare('DELETE FROM content WHERE id = ?').run(id)

			// If content was deleted, remove from search index
			if (result.changes > 0 && this.searchService) {
				this.searchService.remove(id)
			}

			// Commit transaction
			this.db.exec('COMMIT')

			return result.changes > 0
		} catch (e) {
			console.error('Error deleting content:', e)
			this.db.exec('ROLLBACK')
			return false
		}
	}
}
