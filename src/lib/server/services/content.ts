import { Database } from 'bun:sqlite'
import { SearchService } from './search'

export interface Content {
	id: string
	title: string
	slug: string
	description: string
	type: string
	status: string
	content: string
	author?: string
	tags?: Array<{ id: string; name: string; slug: string; color: string }>
	created_at: string
	updated_at: string
	published_at: string | null
	likes: number
	saves: number
	liked?: boolean
	saved?: boolean
	children?: Content[]
}

export interface CollectionContent extends Content {
	type: 'collection'
	children: Content[]
}

export type PreviewContent = Omit<Content, 'content'>

interface ContentFilters {
	type?: string
	tags?: string | string[]
	search?: string
	status?: string
	limit?: number
	offset?: number
	sort?: 'latest' | 'oldest' | 'popular'
}

export class ContentService {
	private searchService: SearchService

	constructor(private db: Database) {
		this.searchService = new SearchService(db)
	}

	getContentById(id: string): Content | null {
		const content = this.db
			.prepare(
				`
      SELECT c.*, 
        COALESCE(
          json_group_array(
            CASE 
              WHEN t.id IS NULL THEN NULL 
              ELSE json_object(
                'id', t.id,
                'name', t.name,
                'slug', t.slug,
                'color', t.color
              )
            END
          ),
          '[]'
        ) as tags
      FROM content c
      LEFT JOIN content_to_tags ctt ON c.id = ctt.content_id
      LEFT JOIN tags t ON ctt.tag_id = t.id
      WHERE c.id = ?
      GROUP BY c.id
    `
			)
			.get(id) as Content | null

		if (!content) {
			return null
		}

		try {
			content.tags = JSON.parse(content.tags as unknown as string).filter(Boolean)
		} catch (e) {
			console.error('Error parsing tags:', e)
			content.tags = []
		}

		if (content.type === 'collection') {
			return this.populateContentChildren(content)
		}

		return content
	}

	private populateContentChildren(collectionContent: Content): CollectionContent {
		if (collectionContent.type !== 'collection') {
			throw new Error('Cannot populate children for non-collection content')
		}

		try {
			let childrenIds: string[] = []

			if (collectionContent.content) {
				try {
					const contentObj = typeof collectionContent.content === 'string'
						? JSON.parse(collectionContent.content)
						: collectionContent.content

					if (contentObj && Array.isArray(contentObj.children)) {
						childrenIds = contentObj.children
					}
				} catch (e) {
					console.error('Error parsing collection content:', e)
					childrenIds = []
				}
			}

			const children = childrenIds
				.map(id => {
					try {
						return this.getContentById(id)
					} catch (e) {
						console.error(`Error fetching child content ${id}:`, e)
						return null
					}
				})
				.filter((child): child is Content => child !== null)

			return {
				...collectionContent,
				type: 'collection' as const,
				children
			}
		} catch (e) {
			console.error('Error populating collection children:', e)
			return {
				...collectionContent,
				type: 'collection' as const,
				children: []
			}
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
		return this.getFilteredContent({
			tags: tagSlug,
			limit,
			offset
		})
	}

	getContentByType(type: string, limit = 10, offset = 0) {
		return this.getFilteredContent({
			type,
			limit,
			offset
		})
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