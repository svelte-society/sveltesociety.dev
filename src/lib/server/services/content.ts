import { Database } from 'bun:sqlite'
import { SearchService } from './search'
import type { Content, CollectionContent, ContentFilters } from '$lib/types/content'

export class ContentService {
	private searchService: SearchService

	constructor(private db: Database) {
		this.searchService = new SearchService(db)
	}

	getContentById(id: string): Content | null {
		if (!id) {
			console.error('Invalid content ID:', id);
			return null;
		}

		try {
			// 1. First, get the basic content item
			const contentQuery = this.db.prepare(`
				SELECT * FROM content
				WHERE id = ?
			`);
			const content = contentQuery.get(id) as Content | null;

			if (!content) {
				return null;
			}

			// 2. Then, get the tags for this content
			const tagsQuery = this.db.prepare(`
				SELECT t.id, t.name, t.slug, t.color
				FROM tags t
				JOIN content_to_tags ctt ON t.id = ctt.tag_id
				WHERE ctt.content_id = ?
			`);
			const tags = tagsQuery.all(id) as Array<{ 
				id: string; 
				name: string; 
				slug: string; 
				color: string 
			}>;
			
			// Assign the tags to the content
			content.tags = tags || [];

			// 3. Handle collection children if needed
			if (content.type === 'collection') {
				return this.populateContentChildren(content);
			}

			// Ensure non-collection content types have an empty children array
			content.children = [];
			return content;
		} catch (e) {
			console.error(`Error fetching content with ID ${id}:`, e);
			return null;
		}
	}

	private populateContentChildren(collectionContent: Content): CollectionContent {
		if (collectionContent.type !== 'collection') {
			throw new Error('Cannot populate children for non-collection content')
		}

		try {
			// Extract child IDs from the collection
			let childrenIds: string[] = [];
            
			// Check if we have a 'children' field
			if (collectionContent.children) {
				// If children is already a string array, use it directly
				if (typeof collectionContent.children === 'string') {
					try {
						const parsed = JSON.parse(collectionContent.children);
						if (parsed) {
							console.log(parsed)
							childrenIds = parsed.map((id: any) => String(id));
						}
					} catch (e) {
						console.error('Failed to parse children JSON:', e);
					}
				}
			}

			const children = childrenIds.map(this.getContentById).filter((child): child is Content => child !== null)

			return {
				...collectionContent,
				type: 'collection' as const,
				children
			};
		} catch (e) {
			console.error('Error populating collection children:', e);
			return {
				...collectionContent,
				type: 'collection' as const,
				children: []
			};
		}
	}

	getFilteredContent(filters: ContentFilters = {}) {
		let contentIds: string[] = []

		if (filters.search?.trim()) {
			contentIds = this.searchService.search({ query: filters.search.trim() })
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


		const contents = ids
			.map(({ id }) => this.getContentById(id))
			.filter((content): content is Content => content !== null)

		return contents.map((content) => {
			if (content.type === 'collection') {
				return this.populateContentChildren(content)
			}
			// Ensure non-collection content types also have an empty children array
			content.children = content.children || [];
			return content
		})
	}

	getFilteredContentCount(filters: Omit<ContentFilters, 'limit' | 'offset' | 'sort'> = {}) {
		let contentIds: string[] = []


		if (filters.search?.trim()) {
			contentIds = this.searchService.search({ query: filters.search.trim() })
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

	searchBlogPosts(searchTerm: string, tags: string[] = []) {
		return this.getFilteredContent({
			type: 'blog',
			search: searchTerm,
			tags: tags.length > 0 ? tags : undefined,
			sort: 'latest'
		})
	}

	getContentByTag(tagSlug: string, limit = 10, offset = 0) {
		const results = this.getFilteredContent({
			tags: tagSlug,
			limit,
			offset
		});
		
		// Ensure every item has a children array
		return results.map(item => ({
			...item,
			children: item.children || []
		}));
	}

	getContentByType(type: string, limit = 10, offset = 0) {
		const results = this.getFilteredContent({
			type,
			limit,
			offset
		});
		
		// Ensure every item has a children array
		return results.map(item => ({
			...item,
			children: item.children || []
		}));
	}

	addContent(data: {
		title: string
		slug: string
		description: string
		type: string
		status: string
		body: string
		tags: string[]
		metadata?: {
			videoId?: string
			npm?: string
		}
	}) {
		const id = crypto.randomUUID()
		const now = new Date().toISOString()

		this.db
			.prepare(
				`
			INSERT INTO content (
				id, title, slug, description, type, status, 
				body, created_at, updated_at, published_at,
				likes, saves
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0)
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
				now,
				now,
				data.status === 'published' ? now : null
			)

		// Add tags if present
		if (data.tags && data.tags.length > 0) {
			const insertTagStmt = this.db.prepare(
				`INSERT INTO content_to_tags (content_id, tag_id) VALUES (?, ?)`
			)

			for (const tag of data.tags) {
				insertTagStmt.run(id, tag)
			}
		}

		return id
	}

	updateContent(id: string, data: {
		title: string
		slug: string
		description: string
		type: string
		status: string
		body: string
		tags: string[]
		metadata?: {
			videoId?: string
			npm?: string
		}
	}) {
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
}