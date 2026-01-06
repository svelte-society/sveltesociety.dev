import type { Database } from 'better-sqlite3'

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
}

export interface CreateCampaignData {
	title: string
	subject: string
	intro_text?: string | null
	created_by: string
}

export interface UpdateCampaignData {
	title?: string
	subject?: string
	intro_text?: string | null
	status?: 'draft' | 'scheduled' | 'sent'
	plunk_campaign_id?: string | null
	scheduled_at?: string | null
	sent_at?: string | null
}

export interface ListCampaignsFilters {
	status?: 'draft' | 'scheduled' | 'sent' | 'all'
	limit?: number
	offset?: number
}

export interface CampaignItem {
	id: string
	campaign_id: string
	content_id: string
	custom_description: string | null
	display_order: number
	created_at: string
}

export interface CampaignItemWithContent extends CampaignItem {
	title: string
	type: string
	slug: string
	description: string | null
}

export class NewsletterService {
	private db: Database

	private createCampaignStatement: any
	private getCampaignByIdStatement: any
	private updateCampaignStatement: any
	private deleteCampaignStatement: any
	private listCampaignsStatement: any
	private countCampaignsStatement: any

	// Campaign item statements
	private getCampaignItemsStatement: any
	private addCampaignItemStatement: any
	private updateCampaignItemStatement: any
	private removeCampaignItemStatement: any
	private getMaxDisplayOrderStatement: any

	constructor(db: Database) {
		this.db = db

		this.createCampaignStatement = this.db.prepare(`
			INSERT INTO newsletter_campaigns (title, subject, intro_text, created_by)
			VALUES ($title, $subject, $intro_text, $created_by)
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

		// Campaign item statements
		this.getCampaignItemsStatement = this.db.prepare(`
			SELECT ci.*, c.title, c.type, c.slug, c.description
			FROM newsletter_campaign_items ci
			JOIN content c ON ci.content_id = c.id
			WHERE ci.campaign_id = $campaign_id
			ORDER BY ci.display_order ASC
		`)

		this.addCampaignItemStatement = this.db.prepare(`
			INSERT INTO newsletter_campaign_items (campaign_id, content_id, custom_description, display_order)
			VALUES ($campaign_id, $content_id, $custom_description, $display_order)
			RETURNING *
		`)

		this.updateCampaignItemStatement = this.db.prepare(`
			UPDATE newsletter_campaign_items
			SET custom_description = $custom_description
			WHERE id = $id
			RETURNING *
		`)

		this.removeCampaignItemStatement = this.db.prepare(`
			DELETE FROM newsletter_campaign_items WHERE id = $id
		`)

		this.getMaxDisplayOrderStatement = this.db.prepare(`
			SELECT COALESCE(MAX(display_order), -1) as max_order
			FROM newsletter_campaign_items
			WHERE campaign_id = $campaign_id
		`)
	}

	/**
	 * Create a new campaign draft
	 */
	createCampaignDraft(data: CreateCampaignData): NewsletterCampaign | null {
		try {
			const result = this.createCampaignStatement.get({
				title: data.title,
				subject: data.subject,
				intro_text: data.intro_text || null,
				created_by: data.created_by
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
				sent_at: data.sent_at !== undefined ? data.sent_at : existing.sent_at
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
	 * Get all items for a campaign with content details
	 */
	getCampaignItems(campaignId: string): CampaignItemWithContent[] {
		try {
			return this.getCampaignItemsStatement.all({
				campaign_id: campaignId
			}) as CampaignItemWithContent[]
		} catch (error) {
			console.error('Error getting campaign items:', error)
			return []
		}
	}

	/**
	 * Add content to a campaign
	 */
	addContentToCampaign(
		campaignId: string,
		contentId: string,
		customDescription?: string | null
	): CampaignItem | null {
		try {
			// Get the next display order
			const maxResult = this.getMaxDisplayOrderStatement.get({
				campaign_id: campaignId
			}) as { max_order: number }
			const nextOrder = maxResult.max_order + 1

			const result = this.addCampaignItemStatement.get({
				campaign_id: campaignId,
				content_id: contentId,
				custom_description: customDescription || null,
				display_order: nextOrder
			})
			return result as CampaignItem
		} catch (error) {
			console.error('Error adding content to campaign:', error)
			return null
		}
	}

	/**
	 * Update a campaign item's custom description
	 */
	updateCampaignItem(itemId: string, customDescription: string | null): CampaignItem | null {
		try {
			const result = this.updateCampaignItemStatement.get({
				id: itemId,
				custom_description: customDescription
			})
			return result as CampaignItem
		} catch (error) {
			console.error('Error updating campaign item:', error)
			return null
		}
	}

	/**
	 * Remove content from a campaign
	 */
	removeContentFromCampaign(itemId: string): boolean {
		try {
			const result = this.removeCampaignItemStatement.run({ id: itemId })
			return result.changes > 0
		} catch (error) {
			console.error('Error removing content from campaign:', error)
			return false
		}
	}

	/**
	 * Reorder campaign items
	 */
	reorderCampaignItems(campaignId: string, orderedItemIds: string[]): boolean {
		try {
			const updateOrderStatement = this.db.prepare(`
				UPDATE newsletter_campaign_items
				SET display_order = $display_order
				WHERE id = $id AND campaign_id = $campaign_id
			`)

			const transaction = this.db.transaction(() => {
				orderedItemIds.forEach((itemId, index) => {
					updateOrderStatement.run({
						id: itemId,
						campaign_id: campaignId,
						display_order: index
					})
				})
			})

			transaction()
			return true
		} catch (error) {
			console.error('Error reordering campaign items:', error)
			return false
		}
	}
}
