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

export class NewsletterService {
	private db: Database

	private createCampaignStatement: any
	private getCampaignByIdStatement: any
	private updateCampaignStatement: any
	private deleteCampaignStatement: any
	private listCampaignsStatement: any
	private countCampaignsStatement: any

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
}
