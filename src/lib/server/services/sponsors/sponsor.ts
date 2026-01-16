import { Database } from 'bun:sqlite'

export type SponsorStatus = 'pending' | 'active' | 'paused' | 'expired' | 'cancelled'

export interface Sponsor {
	id: string
	company_name: string
	logo_url: string
	tagline: string
	website_url: string
	contact_email: string | null
	discount_code: string | null
	discount_description: string | null
	status: SponsorStatus
	created_at: string
	updated_at: string
	activated_at: string | null
	expires_at: string | null
}

export interface CreateSponsorData {
	company_name: string
	logo_url: string
	tagline: string
	website_url: string
	contact_email?: string
	discount_code?: string
	discount_description?: string
}

export interface UpdateSponsorData {
	company_name?: string
	logo_url?: string
	tagline?: string
	website_url?: string
	contact_email?: string
	discount_code?: string | null
	discount_description?: string | null
	status?: SponsorStatus
	expires_at?: string | null
}

// Raw database row (same as interface for this table)
type SponsorRow = Sponsor

export class SponsorService {
	constructor(private db: Database) {}

	/**
	 * Create a new sponsor (starts in 'pending' status)
	 * @returns The ID of the created sponsor
	 */
	createSponsor(data: CreateSponsorData): string {
		const stmt = this.db.prepare(`
			INSERT INTO sponsors (
				company_name,
				logo_url,
				tagline,
				website_url,
				contact_email,
				discount_code,
				discount_description,
				status
			) VALUES (
				$company_name,
				$logo_url,
				$tagline,
				$website_url,
				$contact_email,
				$discount_code,
				$discount_description,
				'pending'
			)
			RETURNING id
		`)

		const result = stmt.get({
			company_name: data.company_name,
			logo_url: data.logo_url,
			tagline: data.tagline,
			website_url: data.website_url,
			contact_email: data.contact_email || null,
			discount_code: data.discount_code || null,
			discount_description: data.discount_description || null
		}) as { id: string }

		return result.id
	}

	/**
	 * Get a sponsor by its ID
	 */
	getSponsorById(id: string): Sponsor | null {
		const stmt = this.db.prepare('SELECT * FROM sponsors WHERE id = $id')
		const row = stmt.get({ id }) as SponsorRow | undefined
		return row || null
	}

	/**
	 * Get sponsors by status
	 */
	getSponsorsByStatus(status: SponsorStatus): Sponsor[] {
		const stmt = this.db.prepare(`
			SELECT * FROM sponsors
			WHERE status = $status
			ORDER BY created_at DESC
		`)
		return stmt.all({ status }) as Sponsor[]
	}

	/**
	 * Get all active sponsors (for display)
	 */
	getActiveSponsors(): Sponsor[] {
		return this.getSponsorsByStatus('active')
	}

	/**
	 * Get all pending sponsors (for admin approval)
	 */
	getPendingSponsors(): Sponsor[] {
		return this.getSponsorsByStatus('pending')
	}

	/**
	 * Update a sponsor's details
	 */
	updateSponsor(id: string, data: UpdateSponsorData): void {
		const updates: string[] = []
		const params: Record<string, unknown> = { id }

		if (data.company_name !== undefined) {
			updates.push('company_name = $company_name')
			params.company_name = data.company_name
		}
		if (data.logo_url !== undefined) {
			updates.push('logo_url = $logo_url')
			params.logo_url = data.logo_url
		}
		if (data.tagline !== undefined) {
			updates.push('tagline = $tagline')
			params.tagline = data.tagline
		}
		if (data.website_url !== undefined) {
			updates.push('website_url = $website_url')
			params.website_url = data.website_url
		}
		if (data.contact_email !== undefined) {
			updates.push('contact_email = $contact_email')
			params.contact_email = data.contact_email
		}
		if (data.discount_code !== undefined) {
			updates.push('discount_code = $discount_code')
			params.discount_code = data.discount_code
		}
		if (data.discount_description !== undefined) {
			updates.push('discount_description = $discount_description')
			params.discount_description = data.discount_description
		}
		if (data.status !== undefined) {
			updates.push('status = $status')
			params.status = data.status
		}
		if (data.expires_at !== undefined) {
			updates.push('expires_at = $expires_at')
			params.expires_at = data.expires_at
		}

		if (updates.length === 0) return

		const stmt = this.db.prepare(`
			UPDATE sponsors
			SET ${updates.join(', ')}
			WHERE id = $id
		`)
		stmt.run(params)
	}

	/**
	 * Activate a sponsor (set status to 'active' and record activated_at)
	 */
	activateSponsor(id: string): void {
		const stmt = this.db.prepare(`
			UPDATE sponsors
			SET status = 'active', activated_at = CURRENT_TIMESTAMP
			WHERE id = $id
		`)
		stmt.run({ id })
	}

	/**
	 * Pause a sponsor
	 */
	pauseSponsor(id: string): void {
		this.updateSponsor(id, { status: 'paused' })
	}

	/**
	 * Cancel a sponsor
	 */
	cancelSponsor(id: string): void {
		this.updateSponsor(id, { status: 'cancelled' })
	}

	/**
	 * Mark a sponsor as expired
	 */
	expireSponsor(id: string): void {
		this.updateSponsor(id, { status: 'expired' })
	}

	/**
	 * Set the contact email (typically from Stripe checkout)
	 */
	setContactEmail(id: string, email: string): void {
		const stmt = this.db.prepare(`
			UPDATE sponsors
			SET contact_email = $email
			WHERE id = $id
		`)
		stmt.run({ id, email })
	}

	/**
	 * Set the expiration date for one-time sponsorships
	 */
	setExpiresAt(id: string, expiresAt: Date): void {
		const stmt = this.db.prepare(`
			UPDATE sponsors
			SET expires_at = $expires_at
			WHERE id = $id
		`)
		stmt.run({ id, expires_at: expiresAt.toISOString() })
	}

	/**
	 * Get sponsors with their subscription and tier info (using the view)
	 * This is used for display in sidebar and feed
	 */
	getActiveSponsorsWithTiers(): Array<{
		id: string
		company_name: string
		logo_url: string
		tagline: string
		website_url: string
		discount_code: string | null
		discount_description: string | null
		tier_name: string
		tier_display_name: string
		logo_size: 'normal' | 'large'
		show_in_feed: boolean
		show_in_sidebar: boolean
		billing_type: string
		current_period_end: string | null
	}> {
		const stmt = this.db.prepare('SELECT * FROM active_sponsors')
		const rows = stmt.all() as Array<{
			id: string
			company_name: string
			logo_url: string
			tagline: string
			website_url: string
			discount_code: string | null
			discount_description: string | null
			status: string
			activated_at: string | null
			expires_at: string | null
			tier_name: string
			tier_display_name: string
			logo_size: 'normal' | 'large'
			show_in_feed: number
			show_in_sidebar: number
			billing_type: string
			current_period_end: string | null
		}>

		return rows.map((row) => ({
			...row,
			show_in_feed: row.show_in_feed === 1,
			show_in_sidebar: row.show_in_sidebar === 1
		}))
	}

	/**
	 * Get all sponsors for admin listing
	 */
	getAllSponsors(): Sponsor[] {
		const stmt = this.db.prepare(`
			SELECT * FROM sponsors
			ORDER BY created_at DESC
		`)
		return stmt.all() as Sponsor[]
	}

	/**
	 * Check and expire sponsors whose expires_at has passed
	 * @returns Number of sponsors expired
	 */
	expireOverdueSponsors(): number {
		const stmt = this.db.prepare(`
			UPDATE sponsors
			SET status = 'expired'
			WHERE status = 'active'
			AND expires_at IS NOT NULL
			AND expires_at < CURRENT_TIMESTAMP
		`)
		const result = stmt.run()
		return result.changes
	}
}
