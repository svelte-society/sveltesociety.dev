import type { Database } from 'better-sqlite3'
import type { EmailService } from './email'
import type {
	CampaignType,
	CampaignStatus,
	NewsletterCampaignRaw,
	NewsletterCampaign,
	CampaignWithItems,
	CreateCampaignData,
	UpdateCampaignData,
	ListCampaignsFilters,
	CampaignItemData,
	CampaignItemWithContent,
	JobItemWithContent,
	ContentHighlightsTypeData,
	AnnouncementTypeData,
	JobsRoundupTypeData,
	PendingSubscription,
	ContentHighlightsCampaign,
	ContentHighlightsCampaignWithItems,
	AnnouncementCampaign,
	JobsRoundupCampaign,
	JobsRoundupCampaignWithItems
} from './newsletter-types'

// Re-export types for consumers
export type {
	CampaignType,
	CampaignStatus,
	NewsletterCampaign,
	CampaignWithItems,
	CreateCampaignData,
	UpdateCampaignData,
	ListCampaignsFilters,
	CampaignItemData,
	CampaignItemWithContent,
	JobItemWithContent,
	ContentHighlightsTypeData,
	AnnouncementTypeData,
	JobsRoundupTypeData,
	PendingSubscription,
	ContentHighlightsCampaign,
	ContentHighlightsCampaignWithItems,
	AnnouncementCampaign,
	JobsRoundupCampaign,
	JobsRoundupCampaignWithItems
}

export { CAMPAIGN_TYPE_CONFIG } from './newsletter-types'

export class NewsletterService {
	private db: Database

	private createCampaignStatement: ReturnType<Database['prepare']>
	private getCampaignByIdStatement: ReturnType<Database['prepare']>
	private updateCampaignStatement: ReturnType<Database['prepare']>
	private deleteCampaignStatement: ReturnType<Database['prepare']>
	private listCampaignsStatement: ReturnType<Database['prepare']>
	private countCampaignsStatement: ReturnType<Database['prepare']>

	// Pending subscription statements (for double opt-in)
	private createPendingStatement: ReturnType<Database['prepare']>
	private getPendingByTokenStatement: ReturnType<Database['prepare']>
	private getPendingByEmailStatement: ReturnType<Database['prepare']>
	private deletePendingStatement: ReturnType<Database['prepare']>
	private deleteExpiredPendingStatement: ReturnType<Database['prepare']>

	constructor(db: Database) {
		this.db = db

		this.createCampaignStatement = this.db.prepare(`
			INSERT INTO newsletter_campaigns (title, subject, campaign_type, type_data, created_by)
			VALUES ($title, $subject, $campaign_type, $type_data, $created_by)
			RETURNING *
		`)

		this.getCampaignByIdStatement = this.db.prepare(`
			SELECT * FROM newsletter_campaigns WHERE id = $id
		`)

		this.updateCampaignStatement = this.db.prepare(`
			UPDATE newsletter_campaigns
			SET title = $title,
				subject = $subject,
				type_data = $type_data,
				status = $status,
				plunk_campaign_id = $plunk_campaign_id,
				scheduled_at = $scheduled_at,
				sent_at = $sent_at
			WHERE id = $id
			RETURNING *
		`)

		this.deleteCampaignStatement = this.db.prepare(`
			DELETE FROM newsletter_campaigns WHERE id = $id
		`)

		this.listCampaignsStatement = this.db.prepare(`
			SELECT * FROM newsletter_campaigns
			ORDER BY created_at DESC
			LIMIT $limit OFFSET $offset
		`)

		this.countCampaignsStatement = this.db.prepare(`
			SELECT COUNT(*) as count FROM newsletter_campaigns
		`)

		// Pending subscription statements (for double opt-in)
		this.createPendingStatement = this.db.prepare(`
			INSERT INTO newsletter_pending_subscriptions (email, token, expires_at, user_id)
			VALUES ($email, $token, $expires_at, $user_id)
			ON CONFLICT(email) DO UPDATE SET
				token = excluded.token,
				expires_at = excluded.expires_at,
				user_id = excluded.user_id,
				created_at = CURRENT_TIMESTAMP
			RETURNING *
		`)

		this.getPendingByTokenStatement = this.db.prepare(`
			SELECT * FROM newsletter_pending_subscriptions
			WHERE token = $token AND expires_at > datetime('now')
		`)

		this.getPendingByEmailStatement = this.db.prepare(`
			SELECT * FROM newsletter_pending_subscriptions
			WHERE email = $email AND expires_at > datetime('now')
		`)

		this.deletePendingStatement = this.db.prepare(`
			DELETE FROM newsletter_pending_subscriptions
			WHERE email = $email
			RETURNING *
		`)

		this.deleteExpiredPendingStatement = this.db.prepare(`
			DELETE FROM newsletter_pending_subscriptions
			WHERE expires_at <= datetime('now')
		`)
	}

	// ==========================================
	// Type Data Parsing
	// ==========================================

	/**
	 * Parse type_data JSON from database
	 */
	private parseTypeData(
		campaignType: CampaignType,
		typeDataJson: string | null
	): ContentHighlightsTypeData | AnnouncementTypeData | JobsRoundupTypeData {
		const defaultData = this.getDefaultTypeData(campaignType)
		if (!typeDataJson) return defaultData

		try {
			return { ...defaultData, ...JSON.parse(typeDataJson) }
		} catch {
			return defaultData
		}
	}

	/**
	 * Get default type_data for a campaign type
	 */
	private getDefaultTypeData(
		campaignType: CampaignType
	): ContentHighlightsTypeData | AnnouncementTypeData | JobsRoundupTypeData {
		switch (campaignType) {
			case 'content_highlights':
				return { items: [], intro_text: null }
			case 'announcement':
				return { body_html: '', cta_text: null, cta_url: null }
			case 'jobs_roundup':
				return { job_ids: [], intro_text: null }
		}
	}

	/**
	 * Parse raw DB row into typed campaign
	 */
	private parseRawCampaign(row: NewsletterCampaignRaw | null): NewsletterCampaign | null {
		if (!row) return null

		const typeData = this.parseTypeData(row.campaign_type, row.type_data)

		return {
			id: row.id,
			title: row.title,
			subject: row.subject,
			campaign_type: row.campaign_type,
			type_data: typeData,
			status: row.status,
			plunk_campaign_id: row.plunk_campaign_id,
			scheduled_at: row.scheduled_at,
			sent_at: row.sent_at,
			created_by: row.created_by,
			created_at: row.created_at,
			updated_at: row.updated_at
		} as NewsletterCampaign
	}

	// ==========================================
	// Campaign CRUD Methods
	// ==========================================

	/**
	 * Create a new campaign draft
	 */
	createCampaignDraft(data: CreateCampaignData): NewsletterCampaign | null {
		try {
			const defaultTypeData = this.getDefaultTypeData(data.campaign_type)
			const typeData = { ...defaultTypeData, ...data.type_data }

			const result = this.createCampaignStatement.get({
				title: data.title,
				subject: data.subject,
				campaign_type: data.campaign_type,
				type_data: JSON.stringify(typeData),
				created_by: data.created_by
			}) as NewsletterCampaignRaw | undefined

			return result ? this.parseRawCampaign(result) : null
		} catch (error) {
			console.error('Error creating newsletter campaign:', error)
			return null
		}
	}

	/**
	 * Get a campaign by ID
	 */
	getCampaignById(id: string): NewsletterCampaign | null {
		try {
			const result = this.getCampaignByIdStatement.get({ id }) as NewsletterCampaignRaw | undefined
			return result ? this.parseRawCampaign(result) : null
		} catch (error) {
			console.error('Error getting newsletter campaign by id:', error)
			return null
		}
	}

	/**
	 * Update a campaign
	 */
	updateCampaign(id: string, data: UpdateCampaignData): NewsletterCampaign | null {
		try {
			const existing = this.getCampaignById(id)
			if (!existing) return null

			// Merge type_data if provided
			const newTypeData = data.type_data
				? { ...existing.type_data, ...data.type_data }
				: existing.type_data

			const result = this.updateCampaignStatement.get({
				id,
				title: data.title ?? existing.title,
				subject: data.subject ?? existing.subject,
				type_data: JSON.stringify(newTypeData),
				status: data.status ?? existing.status,
				plunk_campaign_id:
					data.plunk_campaign_id !== undefined
						? data.plunk_campaign_id
						: existing.plunk_campaign_id,
				scheduled_at: data.scheduled_at !== undefined ? data.scheduled_at : existing.scheduled_at,
				sent_at: data.sent_at !== undefined ? data.sent_at : existing.sent_at
			}) as NewsletterCampaignRaw | undefined

			return result ? this.parseRawCampaign(result) : null
		} catch (error) {
			console.error('Error updating newsletter campaign:', error)
			return null
		}
	}

	/**
	 * Delete a campaign
	 */
	deleteCampaign(id: string): boolean {
		try {
			const result = this.deleteCampaignStatement.run({ id })
			return result.changes > 0
		} catch (error) {
			console.error('Error deleting newsletter campaign:', error)
			return false
		}
	}

	/**
	 * List campaigns with optional filters
	 */
	listCampaigns(filters: ListCampaignsFilters = {}): {
		campaigns: NewsletterCampaign[]
		total: number
	} {
		try {
			const limit = filters.limit ?? 50
			const offset = filters.offset ?? 0

			// Build dynamic query based on filters
			const conditions: string[] = []
			const params: Record<string, unknown> = { limit, offset }

			if (filters.status && filters.status !== 'all') {
				conditions.push('status = $status')
				params.status = filters.status
			}

			if (filters.campaign_type && filters.campaign_type !== 'all') {
				conditions.push('campaign_type = $campaign_type')
				params.campaign_type = filters.campaign_type
			}

			const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

			const listStatement = this.db.prepare(`
				SELECT * FROM newsletter_campaigns
				${whereClause}
				ORDER BY created_at DESC
				LIMIT $limit OFFSET $offset
			`)

			const countStatement = this.db.prepare(`
				SELECT COUNT(*) as count FROM newsletter_campaigns
				${whereClause}
			`)

			const rows = listStatement.all(params) as NewsletterCampaignRaw[]
			const countResult = countStatement.get(params) as { count: number }

			const campaigns = rows
				.map((row) => this.parseRawCampaign(row))
				.filter((c): c is NewsletterCampaign => c !== null)

			return { campaigns, total: countResult.count }
		} catch (error) {
			console.error('Error listing newsletter campaigns:', error)
			return { campaigns: [], total: 0 }
		}
	}

	// ==========================================
	// Campaign Item Methods
	// ==========================================

	/**
	 * Extract image URL from content metadata based on content type
	 */
	private extractImageFromMetadata(type: string, metadataJson: string | null): string | null {
		if (!metadataJson) return null
		try {
			const metadata = JSON.parse(metadataJson)
			switch (type) {
				case 'video':
					// Video: use thumbnail or YouTube thumbnails
					return metadata.thumbnail || metadata.thumbnails?.high?.url || null
				case 'library':
					return metadata.thumbnail || null
				case 'resource':
					return metadata.image || null
				case 'job':
					return metadata.company_logo || null
				default:
					return metadata.thumbnail || metadata.image || null
			}
		} catch {
			return null
		}
	}

	/**
	 * Enrich campaign items with full content details
	 */
	private enrichItems(items: CampaignItemData[]): CampaignItemWithContent[] {
		if (items.length === 0) return []

		try {
			const contentIds = items.map((item) => item.id)
			const placeholders = contentIds.map(() => '?').join(',')

			const contentStatement = this.db.prepare(`
				SELECT id, title, type, slug, description, metadata
				FROM content
				WHERE id IN (${placeholders})
			`)

			const contentRows = contentStatement.all(...contentIds) as Array<{
				id: string
				title: string
				type: string
				slug: string
				description: string | null
				metadata: string | null
			}>

			const contentMap = new Map(contentRows.map((c) => [c.id, c]))

			return items
				.map((item) => {
					const content = contentMap.get(item.id)
					if (!content) return null
					return {
						id: item.id,
						custom_description: item.custom_description || null,
						title: content.title,
						type: content.type,
						slug: content.slug,
						description: content.description,
						image: this.extractImageFromMetadata(content.type, content.metadata)
					}
				})
				.filter((item): item is CampaignItemWithContent => item !== null)
		} catch (error) {
			console.error('Error enriching campaign items:', error)
			return []
		}
	}

	/**
	 * Get job items with full metadata
	 */
	private enrichJobItems(jobIds: string[]): JobItemWithContent[] {
		if (jobIds.length === 0) return []

		try {
			const placeholders = jobIds.map(() => '?').join(',')

			const jobStatement = this.db.prepare(`
				SELECT id, title, type, slug, description, metadata
				FROM content
				WHERE id IN (${placeholders}) AND type = 'job'
			`)

			const jobRows = jobStatement.all(...jobIds) as Array<{
				id: string
				title: string
				type: string
				slug: string
				description: string | null
				metadata: string | null
			}>

			const jobMap = new Map(jobRows.map((j) => [j.id, j]))

			return jobIds
				.map((jobId) => {
					const job = jobMap.get(jobId)
					if (!job) return null

					let metadata = {}
					if (job.metadata) {
						try {
							const parsed = JSON.parse(job.metadata)
							metadata = {
								company_name: parsed.company_name,
								company_logo: parsed.company_logo,
								location: parsed.location,
								remote_status: parsed.remote_status,
								position_type: parsed.position_type,
								salary_min: parsed.salary_min,
								salary_max: parsed.salary_max,
								salary_currency: parsed.salary_currency
							}
						} catch {
							// ignore
						}
					}

					return {
						id: job.id,
						custom_description: null,
						title: job.title,
						type: job.type,
						slug: job.slug,
						description: job.description,
						image: this.extractImageFromMetadata('job', job.metadata),
						metadata
					}
				})
				.filter((item): item is JobItemWithContent => item !== null)
		} catch (error) {
			console.error('Error enriching job items:', error)
			return []
		}
	}

	/**
	 * Get a campaign by ID with enriched items
	 */
	getCampaignWithItems(id: string): CampaignWithItems | null {
		const campaign = this.getCampaignById(id)
		if (!campaign) return null

		switch (campaign.campaign_type) {
			case 'content_highlights': {
				const typeData = campaign.type_data as ContentHighlightsTypeData
				const enrichedItems = this.enrichItems(typeData.items || [])
				return {
					...campaign,
					type_data: {
						...typeData,
						items: enrichedItems
					}
				}
			}
			case 'jobs_roundup': {
				const typeData = campaign.type_data as JobsRoundupTypeData
				const enrichedJobs = this.enrichJobItems(typeData.job_ids || [])
				return {
					...campaign,
					type_data: {
						intro_text: typeData.intro_text,
						jobs: enrichedJobs
					}
				}
			}
			case 'announcement':
				// Announcement doesn't have items to enrich
				return campaign
		}
	}

	/**
	 * Get active job listings for jobs roundup selection
	 */
	getActiveJobs(): JobItemWithContent[] {
		try {
			const jobStatement = this.db.prepare(`
				SELECT id, title, type, slug, description, metadata
				FROM content
				WHERE type = 'job'
				AND status = 'published'
				ORDER BY published_at DESC
			`)

			const jobRows = jobStatement.all() as Array<{
				id: string
				title: string
				type: string
				slug: string
				description: string | null
				metadata: string | null
			}>

			return jobRows.map((job) => {
				let metadata = {}
				if (job.metadata) {
					try {
						const parsed = JSON.parse(job.metadata)
						metadata = {
							company_name: parsed.company_name,
							company_logo: parsed.company_logo,
							location: parsed.location,
							remote_status: parsed.remote_status,
							position_type: parsed.position_type,
							salary_min: parsed.salary_min,
							salary_max: parsed.salary_max,
							salary_currency: parsed.salary_currency
						}
					} catch {
						// ignore
					}
				}

				return {
					id: job.id,
					custom_description: null,
					title: job.title,
					type: job.type,
					slug: job.slug,
					description: job.description,
					image: this.extractImageFromMetadata('job', job.metadata),
					metadata
				}
			})
		} catch (error) {
			console.error('Error getting active jobs:', error)
			return []
		}
	}

	// ==========================================
	// Send Campaign Methods
	// ==========================================

	/**
	 * Send a campaign via Plunk
	 */
	async sendCampaign(
		campaignId: string,
		emailService: EmailService,
		renderHtml: (campaign: CampaignWithItems) => Promise<string>
	): Promise<{ success: boolean; error?: string }> {
		try {
			const campaign = this.getCampaignWithItems(campaignId)
			if (!campaign) {
				return { success: false, error: 'Campaign not found' }
			}

			if (campaign.status !== 'draft') {
				return { success: false, error: 'Campaign has already been sent' }
			}

			const html = await renderHtml(campaign)

			const subscriberCount = await emailService.getContactCount()
			if (subscriberCount === 0) {
				return { success: false, error: 'No subscribers to send to' }
			}

			const createResult = await emailService.createPlunkCampaign({
				name: campaign.title,
				subject: campaign.subject,
				body: html,
				audienceType: 'ALL'
			})

			if (!createResult.success || !createResult.id) {
				return { success: false, error: 'Failed to create campaign in Plunk' }
			}

			const sendSuccess = await emailService.sendPlunkCampaign(createResult.id)

			if (!sendSuccess) {
				return { success: false, error: 'Failed to send campaign via Plunk' }
			}

			this.updateCampaign(campaignId, {
				status: 'sent',
				plunk_campaign_id: createResult.id,
				sent_at: new Date().toISOString()
			})

			return { success: true }
		} catch (error) {
			console.error('Error sending campaign:', error)
			return { success: false, error: 'An unexpected error occurred' }
		}
	}

	// ==========================================
	// Pending Subscription Methods (Double Opt-In)
	// ==========================================

	private static readonly TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000

	private formatDateForSQLite(date: Date): string {
		return date.toISOString().replace('T', ' ').replace('Z', '')
	}

	createPendingSubscription(
		email: string,
		userId?: string | null
	): { token: string; expiresAt: Date } {
		const token = crypto.randomUUID()
		const expiresAt = new Date(Date.now() + NewsletterService.TWENTY_FOUR_HOURS_MS)

		this.createPendingStatement.run({
			email: email.toLowerCase().trim(),
			token,
			expires_at: this.formatDateForSQLite(expiresAt),
			user_id: userId ?? null
		})

		return { token, expiresAt }
	}

	getPendingByToken(token: string): PendingSubscription | null {
		try {
			const result = this.getPendingByTokenStatement.get({ token })
			return result ? (result as PendingSubscription) : null
		} catch (error) {
			console.error('Error getting pending subscription by token:', error)
			return null
		}
	}

	getPendingByEmail(email: string): PendingSubscription | null {
		try {
			const result = this.getPendingByEmailStatement.get({
				email: email.toLowerCase().trim()
			})
			return result ? (result as PendingSubscription) : null
		} catch (error) {
			console.error('Error getting pending subscription by email:', error)
			return null
		}
	}

	deletePending(email: string): boolean {
		try {
			const result = this.deletePendingStatement.get({
				email: email.toLowerCase().trim()
			})
			return result !== null
		} catch (error) {
			console.error('Error deleting pending subscription:', error)
			return false
		}
	}

	cleanupExpired(): number {
		try {
			const result = this.deleteExpiredPendingStatement.run()
			return result.changes
		} catch (error) {
			console.error('Error cleaning up expired pending subscriptions:', error)
			return 0
		}
	}
}
