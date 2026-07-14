import type { Database } from 'better-sqlite3'
import type {
	SocialPost,
	SocialPostRaw,
	SocialPostPlatform,
	SocialPostPlatformRaw,
	SocialPostWithPlatforms,
	SocialPostWithContent,
	SocialPostStatus,
	SocialPostType,
	SocialPlatform,
	SocialPlatformStatus,
	CreateSocialPostData,
	UpdateSocialPostData,
	UpdateSocialPostPlatformData,
	ListSocialPostsFilters
} from '$lib/types/social'

// Re-export types for consumers
export type {
	SocialPost,
	SocialPostPlatform,
	SocialPostWithPlatforms,
	SocialPostWithContent,
	CreateSocialPostData,
	UpdateSocialPostData,
	ListSocialPostsFilters
}

export { POST_TYPE_CONFIG, POST_STATUS_CONFIG, PLATFORM_CONFIG } from '$lib/types/social'

export class SocialPostService {
	private db: Database

	// Post statements
	private createPostStatement: ReturnType<Database['prepare']>
	private getPostByIdStatement: ReturnType<Database['prepare']>
	private updatePostStatement: ReturnType<Database['prepare']>
	private deletePostStatement: ReturnType<Database['prepare']>

	// Platform statements
	private createPlatformStatement: ReturnType<Database['prepare']>
	private getPlatformsByPostIdStatement: ReturnType<Database['prepare']>
	private getPlatformByIdStatement: ReturnType<Database['prepare']>
	private updatePlatformStatement: ReturnType<Database['prepare']>
	private deletePlatformStatement: ReturnType<Database['prepare']>
	private deletePlatformsByPostIdStatement: ReturnType<Database['prepare']>

	// Schedule statements
	private schedulePostStatement: ReturnType<Database['prepare']>
	private publishPostStatement: ReturnType<Database['prepare']>
	private getDuePostsStatement: ReturnType<Database['prepare']>

	constructor(db: Database) {
		this.db = db

		// Post CRUD statements
		this.createPostStatement = this.db.prepare(`
			INSERT INTO social_posts (
				title, post_type, content_id, sponsor_id, job_id,
				link_url, utm_source, utm_medium, utm_campaign,
				media_urls, tags, created_by
			)
			VALUES (
				$title, $post_type, $content_id, $sponsor_id, $job_id,
				$link_url, $utm_source, $utm_medium, $utm_campaign,
				$media_urls, $tags, $created_by
			)
			RETURNING *
		`)

		this.getPostByIdStatement = this.db.prepare(`
			SELECT * FROM social_posts WHERE id = $id
		`)

		this.updatePostStatement = this.db.prepare(`
			UPDATE social_posts
			SET title = $title,
				link_url = $link_url,
				utm_source = $utm_source,
				utm_medium = $utm_medium,
				utm_campaign = $utm_campaign,
				media_urls = $media_urls,
				tags = $tags,
				status = $status,
				scheduled_at = $scheduled_at,
				published_at = $published_at
			WHERE id = $id
			RETURNING *
		`)

		this.deletePostStatement = this.db.prepare(`
			DELETE FROM social_posts WHERE id = $id
		`)

		// Platform CRUD statements
		this.createPlatformStatement = this.db.prepare(`
			INSERT INTO social_post_platforms (post_id, platform, text, media_urls)
			VALUES ($post_id, $platform, $text, $media_urls)
			RETURNING *
		`)

		this.getPlatformsByPostIdStatement = this.db.prepare(`
			SELECT * FROM social_post_platforms WHERE post_id = $post_id
		`)

		this.getPlatformByIdStatement = this.db.prepare(`
			SELECT * FROM social_post_platforms WHERE id = $id
		`)

		this.updatePlatformStatement = this.db.prepare(`
			UPDATE social_post_platforms
			SET text = $text,
				media_urls = $media_urls,
				status = $status,
				external_post_id = $external_post_id,
				error_message = $error_message,
				published_at = $published_at,
				retry_count = $retry_count,
				last_retry_at = $last_retry_at
			WHERE id = $id
			RETURNING *
		`)

		this.deletePlatformStatement = this.db.prepare(`
			DELETE FROM social_post_platforms WHERE id = $id
		`)

		this.deletePlatformsByPostIdStatement = this.db.prepare(`
			DELETE FROM social_post_platforms WHERE post_id = $post_id
		`)

		// Schedule statements
		this.schedulePostStatement = this.db.prepare(`
			UPDATE social_posts
			SET status = 'scheduled', scheduled_at = $scheduled_at
			WHERE id = $id AND status = 'draft'
			RETURNING *
		`)

		this.publishPostStatement = this.db.prepare(`
			UPDATE social_posts
			SET status = 'published', published_at = $published_at
			WHERE id = $id
			RETURNING *
		`)

		this.getDuePostsStatement = this.db.prepare(`
			SELECT * FROM social_posts
			WHERE status = 'scheduled'
			AND scheduled_at <= datetime('now')
		`)
	}

	// ==========================================
	// JSON Parsing Helpers
	// ==========================================

	private parseJsonArray(json: string | null): string[] {
		if (!json) return []
		try {
			const parsed = JSON.parse(json)
			return Array.isArray(parsed) ? parsed : []
		} catch {
			return []
		}
	}

	private parseRawPost(row: SocialPostRaw | null): SocialPost | null {
		if (!row) return null

		return {
			id: row.id,
			title: row.title,
			post_type: row.post_type,
			content_id: row.content_id,
			sponsor_id: row.sponsor_id,
			job_id: row.job_id,
			status: row.status,
			scheduled_at: row.scheduled_at,
			published_at: row.published_at,
			link_url: row.link_url,
			utm_source: row.utm_source,
			utm_medium: row.utm_medium,
			utm_campaign: row.utm_campaign,
			media_urls: this.parseJsonArray(row.media_urls),
			tags: this.parseJsonArray(row.tags),
			created_by: row.created_by,
			created_at: row.created_at,
			updated_at: row.updated_at
		}
	}

	private parseRawPlatform(row: SocialPostPlatformRaw | null): SocialPostPlatform | null {
		if (!row) return null

		return {
			id: row.id,
			post_id: row.post_id,
			platform: row.platform,
			text: row.text,
			media_urls: this.parseJsonArray(row.media_urls),
			status: row.status,
			external_post_id: row.external_post_id,
			error_message: row.error_message,
			published_at: row.published_at,
			retry_count: row.retry_count,
			last_retry_at: row.last_retry_at,
			created_at: row.created_at,
			updated_at: row.updated_at
		}
	}

	// ==========================================
	// Post CRUD Methods
	// ==========================================

	/**
	 * Create a new social post with platform-specific content
	 */
	createPost(data: CreateSocialPostData): SocialPostWithPlatforms | null {
		try {
			// Start transaction
			const transaction = this.db.transaction(() => {
				// Create the main post
				const postResult = this.createPostStatement.get({
					title: data.title,
					post_type: data.post_type,
					content_id: data.content_id ?? null,
					sponsor_id: data.sponsor_id ?? null,
					job_id: data.job_id ?? null,
					link_url: data.link_url ?? null,
					utm_source: data.utm_source ?? null,
					utm_medium: data.utm_medium ?? 'social',
					utm_campaign: data.utm_campaign ?? null,
					media_urls: data.media_urls ? JSON.stringify(data.media_urls) : null,
					tags: data.tags ? JSON.stringify(data.tags) : null,
					created_by: data.created_by
				}) as SocialPostRaw | undefined

				if (!postResult) {
					throw new Error('Failed to create post')
				}

				const post = this.parseRawPost(postResult)!

				// Create platform entries
				const platforms: SocialPostPlatform[] = []
				for (const platformData of data.platforms) {
					const platformResult = this.createPlatformStatement.get({
						post_id: post.id,
						platform: platformData.platform,
						text: platformData.text,
						media_urls: platformData.media_urls ? JSON.stringify(platformData.media_urls) : null
					}) as SocialPostPlatformRaw | undefined

					if (platformResult) {
						const platform = this.parseRawPlatform(platformResult)
						if (platform) platforms.push(platform)
					}
				}

				return { ...post, platforms }
			})

			return transaction()
		} catch (error) {
			console.error('Error creating social post:', error)
			return null
		}
	}

	/**
	 * Get a post by ID (without platforms)
	 */
	getPostById(id: string): SocialPost | null {
		try {
			const result = this.getPostByIdStatement.get({ id }) as SocialPostRaw | undefined
			return result ? this.parseRawPost(result) : null
		} catch (error) {
			console.error('Error getting social post by id:', error)
			return null
		}
	}

	/**
	 * Get a post by ID with all platform entries
	 */
	getPostWithPlatforms(id: string): SocialPostWithPlatforms | null {
		try {
			const post = this.getPostById(id)
			if (!post) return null

			const platformRows = this.getPlatformsByPostIdStatement.all({
				post_id: id
			}) as SocialPostPlatformRaw[]

			const platforms = platformRows
				.map((row) => this.parseRawPlatform(row))
				.filter((p): p is SocialPostPlatform => p !== null)

			return { ...post, platforms }
		} catch (error) {
			console.error('Error getting social post with platforms:', error)
			return null
		}
	}

	/**
	 * Get a post with full content details (for display)
	 */
	getPostWithContent(id: string): SocialPostWithContent | null {
		try {
			const postWithPlatforms = this.getPostWithPlatforms(id)
			if (!postWithPlatforms) return null

			// Build extended query to get related content
			const enrichedPost: SocialPostWithContent = { ...postWithPlatforms }

			// Get linked content details if applicable
			if (postWithPlatforms.content_id) {
				const contentStatement = this.db.prepare(`
					SELECT title, type, slug FROM content WHERE id = $id
				`)
				const content = contentStatement.get({ id: postWithPlatforms.content_id }) as
					| { title: string; type: string; slug: string }
					| undefined
				if (content) {
					enrichedPost.content_title = content.title
					enrichedPost.content_type = content.type
					enrichedPost.content_slug = content.slug
				}
			}

			// Get linked sponsor details if applicable
			if (postWithPlatforms.sponsor_id) {
				const sponsorStatement = this.db.prepare(`
					SELECT company_name, logo_url FROM sponsors WHERE id = $id
				`)
				const sponsor = sponsorStatement.get({ id: postWithPlatforms.sponsor_id }) as
					| { company_name: string; logo_url: string }
					| undefined
				if (sponsor) {
					enrichedPost.sponsor_name = sponsor.company_name
					enrichedPost.sponsor_logo = sponsor.logo_url
				}
			}

			// Get linked job details if applicable
			if (postWithPlatforms.job_id) {
				const jobStatement = this.db.prepare(`
					SELECT title, metadata FROM content WHERE id = $id AND type = 'job'
				`)
				const job = jobStatement.get({ id: postWithPlatforms.job_id }) as
					| { title: string; metadata: string | null }
					| undefined
				if (job) {
					enrichedPost.job_title = job.title
					if (job.metadata) {
						try {
							const meta = JSON.parse(job.metadata)
							enrichedPost.job_company = meta.company_name
						} catch {
							// ignore
						}
					}
				}
			}

			// Get creator name
			const userStatement = this.db.prepare(`
				SELECT name FROM users WHERE id = $id
			`)
			const user = userStatement.get({ id: postWithPlatforms.created_by }) as
				| { name: string }
				| undefined
			if (user) {
				enrichedPost.creator_name = user.name
			}

			return enrichedPost
		} catch (error) {
			console.error('Error getting social post with content:', error)
			return null
		}
	}

	/**
	 * Update a post
	 */
	updatePost(id: string, data: UpdateSocialPostData): SocialPost | null {
		try {
			const existing = this.getPostById(id)
			if (!existing) return null

			const result = this.updatePostStatement.get({
				id,
				title: data.title ?? existing.title,
				link_url: data.link_url !== undefined ? data.link_url : existing.link_url,
				utm_source: data.utm_source !== undefined ? data.utm_source : existing.utm_source,
				utm_medium: data.utm_medium !== undefined ? data.utm_medium : existing.utm_medium,
				utm_campaign: data.utm_campaign !== undefined ? data.utm_campaign : existing.utm_campaign,
				media_urls: data.media_urls
					? JSON.stringify(data.media_urls)
					: JSON.stringify(existing.media_urls),
				tags: data.tags ? JSON.stringify(data.tags) : JSON.stringify(existing.tags),
				status: data.status ?? existing.status,
				scheduled_at: data.scheduled_at !== undefined ? data.scheduled_at : existing.scheduled_at,
				published_at: existing.published_at
			}) as SocialPostRaw | undefined

			return result ? this.parseRawPost(result) : null
		} catch (error) {
			console.error('Error updating social post:', error)
			return null
		}
	}

	/**
	 * Delete a post (cascade deletes platforms)
	 */
	deletePost(id: string): boolean {
		try {
			const result = this.deletePostStatement.run({ id })
			return result.changes > 0
		} catch (error) {
			console.error('Error deleting social post:', error)
			return false
		}
	}

	// ==========================================
	// Platform Methods
	// ==========================================

	/**
	 * Get a platform entry by ID
	 */
	getPlatformById(id: string): SocialPostPlatform | null {
		try {
			const result = this.getPlatformByIdStatement.get({ id }) as SocialPostPlatformRaw | undefined
			return result ? this.parseRawPlatform(result) : null
		} catch (error) {
			console.error('Error getting platform by id:', error)
			return null
		}
	}

	/**
	 * Update a platform entry
	 */
	updatePlatform(id: string, data: UpdateSocialPostPlatformData): SocialPostPlatform | null {
		try {
			const existing = this.getPlatformById(id)
			if (!existing) return null

			const result = this.updatePlatformStatement.get({
				id,
				text: data.text ?? existing.text,
				media_urls: data.media_urls
					? JSON.stringify(data.media_urls)
					: JSON.stringify(existing.media_urls),
				status: data.status ?? existing.status,
				external_post_id: existing.external_post_id,
				error_message: existing.error_message,
				published_at: existing.published_at,
				retry_count: existing.retry_count,
				last_retry_at: existing.last_retry_at
			}) as SocialPostPlatformRaw | undefined

			return result ? this.parseRawPlatform(result) : null
		} catch (error) {
			console.error('Error updating platform:', error)
			return null
		}
	}

	/**
	 * Mark a platform as published
	 */
	markPlatformPublished(id: string, externalPostId: string): SocialPostPlatform | null {
		try {
			const existing = this.getPlatformById(id)
			if (!existing) return null

			const result = this.updatePlatformStatement.get({
				id,
				text: existing.text,
				media_urls: JSON.stringify(existing.media_urls),
				status: 'published' as SocialPlatformStatus,
				external_post_id: externalPostId,
				error_message: null,
				published_at: new Date().toISOString(),
				retry_count: existing.retry_count,
				last_retry_at: existing.last_retry_at
			}) as SocialPostPlatformRaw | undefined

			return result ? this.parseRawPlatform(result) : null
		} catch (error) {
			console.error('Error marking platform published:', error)
			return null
		}
	}

	/**
	 * Mark a platform as failed
	 */
	markPlatformFailed(id: string, errorMessage: string): SocialPostPlatform | null {
		try {
			const existing = this.getPlatformById(id)
			if (!existing) return null

			const result = this.updatePlatformStatement.get({
				id,
				text: existing.text,
				media_urls: JSON.stringify(existing.media_urls),
				status: 'failed' as SocialPlatformStatus,
				external_post_id: existing.external_post_id,
				error_message: errorMessage,
				published_at: existing.published_at,
				retry_count: existing.retry_count + 1,
				last_retry_at: new Date().toISOString()
			}) as SocialPostPlatformRaw | undefined

			return result ? this.parseRawPlatform(result) : null
		} catch (error) {
			console.error('Error marking platform failed:', error)
			return null
		}
	}

	/**
	 * Add a platform to an existing post
	 */
	addPlatform(
		postId: string,
		platform: SocialPlatform,
		text: string,
		mediaUrls?: string[]
	): SocialPostPlatform | null {
		try {
			const result = this.createPlatformStatement.get({
				post_id: postId,
				platform,
				text,
				media_urls: mediaUrls ? JSON.stringify(mediaUrls) : null
			}) as SocialPostPlatformRaw | undefined

			return result ? this.parseRawPlatform(result) : null
		} catch (error) {
			console.error('Error adding platform:', error)
			return null
		}
	}

	/**
	 * Remove a platform from a post
	 */
	removePlatform(id: string): boolean {
		try {
			const result = this.deletePlatformStatement.run({ id })
			return result.changes > 0
		} catch (error) {
			console.error('Error removing platform:', error)
			return false
		}
	}

	// ==========================================
	// Scheduling Methods
	// ==========================================

	/**
	 * Schedule a draft post
	 */
	schedulePost(id: string, scheduledAt: string): SocialPost | null {
		try {
			const result = this.schedulePostStatement.get({
				id,
				scheduled_at: scheduledAt
			}) as SocialPostRaw | undefined

			return result ? this.parseRawPost(result) : null
		} catch (error) {
			console.error('Error scheduling post:', error)
			return null
		}
	}

	/**
	 * Unschedule a post (back to draft)
	 */
	unschedulePost(id: string): SocialPost | null {
		try {
			const existing = this.getPostById(id)
			if (!existing || existing.status !== 'scheduled') return null

			return this.updatePost(id, {
				status: 'draft',
				scheduled_at: null
			})
		} catch (error) {
			console.error('Error unscheduling post:', error)
			return null
		}
	}

	/**
	 * Mark a post as published
	 */
	markPostPublished(id: string): SocialPost | null {
		try {
			const result = this.publishPostStatement.get({
				id,
				published_at: new Date().toISOString()
			}) as SocialPostRaw | undefined

			return result ? this.parseRawPost(result) : null
		} catch (error) {
			console.error('Error marking post published:', error)
			return null
		}
	}

	/**
	 * Mark a post as failed
	 */
	markPostFailed(id: string): SocialPost | null {
		try {
			return this.updatePost(id, { status: 'failed' })
		} catch (error) {
			console.error('Error marking post failed:', error)
			return null
		}
	}

	/**
	 * Get posts that are due for publishing
	 */
	getDuePosts(): SocialPostWithPlatforms[] {
		try {
			const rows = this.getDuePostsStatement.all() as SocialPostRaw[]
			return rows
				.map((row) => {
					const post = this.parseRawPost(row)
					if (!post) return null

					const platformRows = this.getPlatformsByPostIdStatement.all({
						post_id: post.id
					}) as SocialPostPlatformRaw[]

					const platforms = platformRows
						.map((p) => this.parseRawPlatform(p))
						.filter((p): p is SocialPostPlatform => p !== null)

					return { ...post, platforms }
				})
				.filter((p): p is SocialPostWithPlatforms => p !== null)
		} catch (error) {
			console.error('Error getting due posts:', error)
			return []
		}
	}

	// ==========================================
	// List Methods
	// ==========================================

	/**
	 * List posts with filters
	 */
	listPosts(filters: ListSocialPostsFilters = {}): {
		posts: SocialPostWithPlatforms[]
		total: number
	} {
		try {
			const limit = filters.limit ?? 50
			const offset = filters.offset ?? 0

			// Build dynamic query
			const conditions: string[] = []
			const params: Record<string, unknown> = { limit, offset }

			if (filters.status && filters.status !== 'all') {
				conditions.push('sp.status = $status')
				params.status = filters.status
			}

			if (filters.post_type && filters.post_type !== 'all') {
				conditions.push('sp.post_type = $post_type')
				params.post_type = filters.post_type
			}

			if (filters.search) {
				conditions.push('sp.title LIKE $search')
				params.search = `%${filters.search}%`
			}

			if (filters.from_date) {
				conditions.push('sp.scheduled_at >= $from_date')
				params.from_date = filters.from_date
			}

			if (filters.to_date) {
				conditions.push('sp.scheduled_at <= $to_date')
				params.to_date = filters.to_date
			}

			// Platform filter requires join
			let platformJoin = ''
			if (filters.platform && filters.platform !== 'all') {
				platformJoin = 'INNER JOIN social_post_platforms spp ON sp.id = spp.post_id'
				conditions.push('spp.platform = $platform')
				params.platform = filters.platform
			}

			const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

			const listStatement = this.db.prepare(`
				SELECT DISTINCT sp.* FROM social_posts sp
				${platformJoin}
				${whereClause}
				ORDER BY sp.created_at DESC
				LIMIT $limit OFFSET $offset
			`)

			const countStatement = this.db.prepare(`
				SELECT COUNT(DISTINCT sp.id) as count FROM social_posts sp
				${platformJoin}
				${whereClause}
			`)

			const rows = listStatement.all(params) as SocialPostRaw[]
			const countResult = countStatement.get(params) as { count: number }

			const posts = rows
				.map((row) => {
					const post = this.parseRawPost(row)
					if (!post) return null

					const platformRows = this.getPlatformsByPostIdStatement.all({
						post_id: post.id
					}) as SocialPostPlatformRaw[]

					const platforms = platformRows
						.map((p) => this.parseRawPlatform(p))
						.filter((p): p is SocialPostPlatform => p !== null)

					return { ...post, platforms }
				})
				.filter((p): p is SocialPostWithPlatforms => p !== null)

			return { posts, total: countResult.count }
		} catch (error) {
			console.error('Error listing social posts:', error)
			return { posts: [], total: 0 }
		}
	}

	/**
	 * Get posts for calendar view (date range)
	 */
	getPostsForCalendar(startDate: string, endDate: string): SocialPostWithPlatforms[] {
		try {
			const statement = this.db.prepare(`
				SELECT * FROM social_posts
				WHERE (scheduled_at BETWEEN $start AND $end)
				   OR (published_at BETWEEN $start AND $end)
				ORDER BY COALESCE(scheduled_at, published_at) ASC
			`)

			const rows = statement.all({
				start: startDate,
				end: endDate
			}) as SocialPostRaw[]

			return rows
				.map((row) => {
					const post = this.parseRawPost(row)
					if (!post) return null

					const platformRows = this.getPlatformsByPostIdStatement.all({
						post_id: post.id
					}) as SocialPostPlatformRaw[]

					const platforms = platformRows
						.map((p) => this.parseRawPlatform(p))
						.filter((p): p is SocialPostPlatform => p !== null)

					return { ...post, platforms }
				})
				.filter((p): p is SocialPostWithPlatforms => p !== null)
		} catch (error) {
			console.error('Error getting posts for calendar:', error)
			return []
		}
	}

	/**
	 * Get upcoming scheduled posts
	 */
	getUpcomingPosts(limit: number = 10): SocialPostWithPlatforms[] {
		try {
			const statement = this.db.prepare(`
				SELECT * FROM social_posts
				WHERE status = 'scheduled'
				AND scheduled_at > datetime('now')
				ORDER BY scheduled_at ASC
				LIMIT $limit
			`)

			const rows = statement.all({ limit }) as SocialPostRaw[]

			return rows
				.map((row) => {
					const post = this.parseRawPost(row)
					if (!post) return null

					const platformRows = this.getPlatformsByPostIdStatement.all({
						post_id: post.id
					}) as SocialPostPlatformRaw[]

					const platforms = platformRows
						.map((p) => this.parseRawPlatform(p))
						.filter((p): p is SocialPostPlatform => p !== null)

					return { ...post, platforms }
				})
				.filter((p): p is SocialPostWithPlatforms => p !== null)
		} catch (error) {
			console.error('Error getting upcoming posts:', error)
			return []
		}
	}

	/**
	 * Get recent posts
	 */
	getRecentPosts(limit: number = 10): SocialPostWithPlatforms[] {
		try {
			const statement = this.db.prepare(`
				SELECT * FROM social_posts
				ORDER BY created_at DESC
				LIMIT $limit
			`)

			const rows = statement.all({ limit }) as SocialPostRaw[]

			return rows
				.map((row) => {
					const post = this.parseRawPost(row)
					if (!post) return null

					const platformRows = this.getPlatformsByPostIdStatement.all({
						post_id: post.id
					}) as SocialPostPlatformRaw[]

					const platforms = platformRows
						.map((p) => this.parseRawPlatform(p))
						.filter((p): p is SocialPostPlatform => p !== null)

					return { ...post, platforms }
				})
				.filter((p): p is SocialPostWithPlatforms => p !== null)
		} catch (error) {
			console.error('Error getting recent posts:', error)
			return []
		}
	}
}
