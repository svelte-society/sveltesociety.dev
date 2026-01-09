import type { Database } from 'better-sqlite3'
import type { EmailService } from './email'

// Item stored in JSON (minimal data)
export interface CampaignItemData {
	id: string
	custom_description?: string | null
}

// Item with full content details (for display)
export interface CampaignItemWithContent {
	id: string
	custom_description: string | null
	title: string
	type: string
	slug: string
	description: string | null
	image: string | null
}

export interface NewsletterCampaign {
	id: string
	title: string
	subject: string
	intro_text: string | null
	status: 'draft' | 'scheduled' | 'sent'
	plunk_campaign_id: string | null
	scheduled_at: string | null
	sent_at: string | null
	created_by: string
	created_at: string
	updated_at: string
	items: string // JSON string in DB
}

// Campaign with enriched items (for display/sending)
export interface CampaignWithItems extends Omit<NewsletterCampaign, 'items'> {
	items: CampaignItemWithContent[]
}

export interface CreateCampaignData {
	title: string
	subject: string
	intro_text?: string | null
	created_by: string
	items?: CampaignItemData[]
}

export interface UpdateCampaignData {
	title?: string
	subject?: string
	intro_text?: string | null
	status?: 'draft' | 'scheduled' | 'sent'
	plunk_campaign_id?: string | null
	scheduled_at?: string | null
	sent_at?: string | null
	items?: CampaignItemData[]
}

export interface ListCampaignsFilters {
	status?: 'draft' | 'scheduled' | 'sent' | 'all'
	limit?: number
	offset?: number
}

// Pending subscription for double opt-in
export interface PendingSubscription {
	id: string
	email: string
	token: string
	expires_at: string
	created_at: string
}

export class NewsletterService {
	private db: Database

	private createCampaignStatement: any
	private getCampaignByIdStatement: any
	private updateCampaignStatement: any
	private deleteCampaignStatement: any
	private listCampaignsStatement: any
	private countCampaignsStatement: any

	// Pending subscription statements (for double opt-in)
	private createPendingStatement: any
	private getPendingByTokenStatement: any
	private getPendingByEmailStatement: any
	private deletePendingStatement: any
	private deleteExpiredPendingStatement: any

	constructor(db: Database) {
		this.db = db

		this.createCampaignStatement = this.db.prepare(`
			INSERT INTO newsletter_campaigns (title, subject, intro_text, created_by, items)
			VALUES ($title, $subject, $intro_text, $created_by, $items)
			RETURNING *
		`)

		this.getCampaignByIdStatement = this.db.prepare(`
			SELECT * FROM newsletter_campaigns WHERE id = $id
		`)

		this.updateCampaignStatement = this.db.prepare(`
			UPDATE newsletter_campaigns
			SET title = $title,
				subject = $subject,
				intro_text = $intro_text,
				status = $status,
				plunk_campaign_id = $plunk_campaign_id,
				scheduled_at = $scheduled_at,
				sent_at = $sent_at,
				items = $items
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
			INSERT INTO newsletter_pending_subscriptions (email, token, expires_at)
			VALUES ($email, $token, $expires_at)
			ON CONFLICT(email) DO UPDATE SET
				token = excluded.token,
				expires_at = excluded.expires_at,
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

	/**
	 * Parse items JSON from database
	 */
	private parseItems(itemsJson: string | null): CampaignItemData[] {
		if (!itemsJson) return []
		try {
			return JSON.parse(itemsJson) as CampaignItemData[]
		} catch {
			return []
		}
	}

	/**
	 * Create a new campaign draft
	 */
	createCampaignDraft(data: CreateCampaignData): NewsletterCampaign | null {
		try {
			const items = data.items || []
			const result = this.createCampaignStatement.get({
				title: data.title,
				subject: data.subject,
				intro_text: data.intro_text || null,
				created_by: data.created_by,
				items: JSON.stringify(items)
			})
			return result as NewsletterCampaign
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
			return this.getCampaignByIdStatement.get({ id }) as NewsletterCampaign | null
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

			const existingItems = this.parseItems(existing.items)

			const result = this.updateCampaignStatement.get({
				id,
				title: data.title ?? existing.title,
				subject: data.subject ?? existing.subject,
				intro_text: data.intro_text !== undefined ? data.intro_text : existing.intro_text,
				status: data.status ?? existing.status,
				plunk_campaign_id:
					data.plunk_campaign_id !== undefined
						? data.plunk_campaign_id
						: existing.plunk_campaign_id,
				scheduled_at: data.scheduled_at !== undefined ? data.scheduled_at : existing.scheduled_at,
				sent_at: data.sent_at !== undefined ? data.sent_at : existing.sent_at,
				items: data.items !== undefined ? JSON.stringify(data.items) : JSON.stringify(existingItems)
			})
			return result as NewsletterCampaign
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

			let campaigns: NewsletterCampaign[]

			if (filters.status && filters.status !== 'all') {
				const filteredStatement = this.db.prepare(`
					SELECT * FROM newsletter_campaigns
					WHERE status = $status
					ORDER BY created_at DESC
					LIMIT $limit OFFSET $offset
				`)
				campaigns = filteredStatement.all({ status: filters.status, limit, offset }) as NewsletterCampaign[]

				const countFilteredStatement = this.db.prepare(`
					SELECT COUNT(*) as count FROM newsletter_campaigns WHERE status = $status
				`)
				const countResult = countFilteredStatement.get({ status: filters.status }) as { count: number }
				return { campaigns, total: countResult.count }
			} else {
				campaigns = this.listCampaignsStatement.all({ limit, offset }) as NewsletterCampaign[]
				const countResult = this.countCampaignsStatement.get() as { count: number }
				return { campaigns, total: countResult.count }
			}
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
	 * Private helper - takes parsed items and returns enriched items
	 */
	private enrichItems(items: CampaignItemData[]): CampaignItemWithContent[] {
		if (items.length === 0) return []

		try {
			// Get content details for each item
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

			// Create a map for quick lookup
			const contentMap = new Map(contentRows.map((c) => [c.id, c]))

			// Merge items with content, preserving order
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
	 * Get a campaign by ID with enriched items
	 * Returns the campaign with full content details for each item
	 */
	getCampaignWithItems(id: string): CampaignWithItems | null {
		const campaign = this.getCampaignById(id)
		if (!campaign) return null

		const rawItems = this.parseItems(campaign.items)
		const enrichedItems = this.enrichItems(rawItems)

		return {
			...campaign,
			items: enrichedItems
		}
	}

	/**
	 * Update campaign items (replaces all items)
	 */
	updateCampaignItems(campaignId: string, contentIds: string[]): boolean {
		try {
			const items: CampaignItemData[] = contentIds.map((contentId) => ({ id: contentId }))
			const result = this.updateCampaign(campaignId, { items })
			return result !== null
		} catch (error) {
			console.error('Error updating campaign items:', error)
			return false
		}
	}

	// ==========================================
	// Send Campaign Methods
	// ==========================================

	/**
	 * Send a campaign via Plunk
	 * This builds the HTML, creates the campaign in Plunk, and sends it
	 */
	async sendCampaign(
		campaignId: string,
		emailService: EmailService,
		renderHtml: (campaign: CampaignWithItems) => Promise<string>
	): Promise<{ success: boolean; error?: string }> {
		try {
			// Get the campaign with enriched items
			const campaign = this.getCampaignWithItems(campaignId)
			if (!campaign) {
				return { success: false, error: 'Campaign not found' }
			}

			if (campaign.status !== 'draft') {
				return { success: false, error: 'Campaign has already been sent' }
			}

			// Build the HTML using the provided render function
			const html = await renderHtml(campaign)

			// Check if there are any subscribers before sending
			// Plunk's audienceType: 'ALL' will send to all subscribed contacts
			const subscriberCount = await emailService.getContactCount()

			if (subscriberCount === 0) {
				return { success: false, error: 'No subscribers to send to' }
			}

			// Create campaign in Plunk
			// Using audienceType: 'ALL' sends to all subscribed contacts automatically
			const createResult = await emailService.createPlunkCampaign({
				name: campaign.title,
				subject: campaign.subject,
				body: html,
				audienceType: 'ALL'
			})

			if (!createResult.success || !createResult.id) {
				return { success: false, error: 'Failed to create campaign in Plunk' }
			}

			// Send the campaign
			const sendSuccess = await emailService.sendPlunkCampaign(createResult.id)

			if (!sendSuccess) {
				return { success: false, error: 'Failed to send campaign via Plunk' }
			}

			// Update local campaign status
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

	/**
	 * Format a Date as SQLite-compatible timestamp
	 */
	private formatDateForSQLite(date: Date): string {
		return date.toISOString().replace('T', ' ').replace('Z', '')
	}

	/**
	 * Create or update a pending subscription
	 * Uses upsert pattern - resubscribing refreshes the token
	 * Returns the token for building the confirmation URL
	 */
	createPendingSubscription(email: string): { token: string; expiresAt: Date } {
		const token = crypto.randomUUID()
		const expiresAt = new Date(Date.now() + NewsletterService.TWENTY_FOUR_HOURS_MS)

		this.createPendingStatement.run({
			email: email.toLowerCase().trim(),
			token,
			expires_at: this.formatDateForSQLite(expiresAt)
		})

		return { token, expiresAt }
	}

	/**
	 * Get a valid (non-expired) pending subscription by token
	 * Returns null if token is invalid or expired
	 */
	getPendingByToken(token: string): PendingSubscription | null {
		try {
			const result = this.getPendingByTokenStatement.get({ token })
			return result ? (result as PendingSubscription) : null
		} catch (error) {
			console.error('Error getting pending subscription by token:', error)
			return null
		}
	}

	/**
	 * Get a valid (non-expired) pending subscription by email
	 */
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

	/**
	 * Delete a pending subscription (after successful confirmation)
	 */
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

	/**
	 * Clean up expired pending subscriptions
	 * Can be called periodically or opportunistically
	 */
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
