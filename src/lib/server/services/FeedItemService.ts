import type { Database } from 'bun:sqlite'

export interface FeedItem {
	id: string
	content_id: string | null
	sponsor_id: string | null
	item_type: 'cta' | 'ad' | 'featured' | 'sponsor'
	title: string | null
	description: string | null
	button_text: string | null
	button_href: string | null
	position_type: 'fixed' | 'random'
	position_fixed: number | null
	position_range_min: number | null
	position_range_max: number | null
	start_date: string | null
	end_date: string | null
	is_active: number
	priority: number
	created_at: string
	updated_at: string
	created_by: string | null
}

/** Linked content metadata (populated when content_id is set) */
export interface FeedItemContent {
	title: string
	description: string | null
	type: string
	slug: string
}

/** Linked sponsor metadata (populated when sponsor_id is set) */
export interface FeedItemSponsor {
	company_name: string
	logo_url: string
	tagline: string
	website_url: string
	discount_code: string | null
	discount_description: string | null
	tier_name: string
	logo_size: 'normal' | 'large'
}

export interface FeedItemWithContent extends FeedItem {
	/** Linked content data (populated when content_id is set, i.e. for 'featured' items) */
	content: FeedItemContent | null
	/** Linked sponsor data (populated when sponsor_id is set, i.e. for 'sponsor' items) */
	sponsor: FeedItemSponsor | null
}

// Raw SQL row before transformation (flat fields from JOINs)
interface FeedItemRow extends FeedItem {
	content_title: string | null
	content_description: string | null
	content_type: string | null
	content_slug: string | null
	sponsor_company_name: string | null
	sponsor_logo_url: string | null
	sponsor_tagline: string | null
	sponsor_website_url: string | null
	sponsor_discount_code: string | null
	sponsor_discount_description: string | null
	sponsor_tier_name: string | null
	sponsor_logo_size: 'normal' | 'large' | null
}

export class FeedItemService {
	private db: Database

	private createStatement: any
	private updateStatement: any
	private deleteStatement: any
	private getByIdStatement: any
	private getAllStatement: any
	private getActiveStatement: any
	private toggleStatusStatement: any
	private getBySponsorIdStatement: any
	private updateEndDateBySponsorIdStatement: any
	private deactivateBySponsorIdStatement: any

	/**
	 * Transform a raw SQL row into FeedItemWithContent with nested content/sponsor objects
	 */
	private transformRow(row: FeedItemRow): FeedItemWithContent {
		const {
			content_title,
			content_description,
			content_type,
			content_slug,
			sponsor_company_name,
			sponsor_logo_url,
			sponsor_tagline,
			sponsor_website_url,
			sponsor_discount_code,
			sponsor_discount_description,
			sponsor_tier_name,
			sponsor_logo_size,
			...base
		} = row

		return {
			...base,
			content:
				row.content_id && content_title && content_type && content_slug
					? {
							title: content_title,
							description: content_description,
							type: content_type,
							slug: content_slug
						}
					: null,
			sponsor:
				row.sponsor_id && sponsor_company_name
					? {
							company_name: sponsor_company_name,
							logo_url: sponsor_logo_url || '',
							tagline: sponsor_tagline || '',
							website_url: sponsor_website_url || '',
							discount_code: sponsor_discount_code,
							discount_description: sponsor_discount_description,
							tier_name: sponsor_tier_name || 'basic',
							logo_size: sponsor_logo_size || 'normal'
						}
					: null
		}
	}

	constructor(db: Database) {
		this.db = db

		this.createStatement = this.db.prepare(`
			INSERT INTO feed_items (
				content_id, sponsor_id, item_type, title, description, button_text, button_href,
				position_type, position_fixed, position_range_min, position_range_max,
				start_date, end_date, is_active, priority, created_by
			)
			VALUES (
				$content_id, $sponsor_id, $item_type, $title, $description, $button_text, $button_href,
				$position_type, $position_fixed, $position_range_min, $position_range_max,
				$start_date, $end_date, $is_active, $priority, $created_by
			)
			RETURNING *
		`)

		this.updateStatement = this.db.prepare(`
			UPDATE feed_items
			SET content_id = $content_id,
				sponsor_id = $sponsor_id,
				item_type = $item_type,
				title = $title,
				description = $description,
				button_text = $button_text,
				button_href = $button_href,
				position_type = $position_type,
				position_fixed = $position_fixed,
				position_range_min = $position_range_min,
				position_range_max = $position_range_max,
				start_date = $start_date,
				end_date = $end_date,
				is_active = $is_active,
				priority = $priority
			WHERE id = $id
			RETURNING *
		`)

		this.deleteStatement = this.db.prepare(`
			DELETE FROM feed_items WHERE id = $id
		`)

		this.getByIdStatement = this.db.prepare(`
			SELECT fi.*,
				   c.title as content_title,
				   c.description as content_description,
				   c.type as content_type,
				   c.slug as content_slug,
				   s.company_name as sponsor_company_name,
				   s.logo_url as sponsor_logo_url,
				   s.tagline as sponsor_tagline,
				   s.website_url as sponsor_website_url,
				   s.discount_code as sponsor_discount_code,
				   s.discount_description as sponsor_discount_description,
				   t.name as sponsor_tier_name,
				   t.logo_size as sponsor_logo_size
			FROM feed_items fi
			LEFT JOIN content c ON fi.content_id = c.id
			LEFT JOIN sponsors s ON fi.sponsor_id = s.id
			LEFT JOIN sponsor_subscriptions sub ON s.id = sub.sponsor_id AND sub.status = 'active'
			LEFT JOIN sponsor_tiers t ON sub.tier_id = t.id
			WHERE fi.id = $id
		`)

		this.getAllStatement = this.db.prepare(`
			SELECT fi.*,
				   c.title as content_title,
				   c.description as content_description,
				   c.type as content_type,
				   c.slug as content_slug,
				   s.company_name as sponsor_company_name,
				   s.logo_url as sponsor_logo_url,
				   s.tagline as sponsor_tagline,
				   s.website_url as sponsor_website_url,
				   s.discount_code as sponsor_discount_code,
				   s.discount_description as sponsor_discount_description,
				   t.name as sponsor_tier_name,
				   t.logo_size as sponsor_logo_size
			FROM feed_items fi
			LEFT JOIN content c ON fi.content_id = c.id
			LEFT JOIN sponsors s ON fi.sponsor_id = s.id
			LEFT JOIN sponsor_subscriptions sub ON s.id = sub.sponsor_id AND sub.status = 'active'
			LEFT JOIN sponsor_tiers t ON sub.tier_id = t.id
			ORDER BY fi.priority DESC, fi.created_at DESC
		`)

		this.getActiveStatement = this.db.prepare(`
			SELECT fi.*,
				   c.title as content_title,
				   c.description as content_description,
				   c.type as content_type,
				   c.slug as content_slug,
				   s.company_name as sponsor_company_name,
				   s.logo_url as sponsor_logo_url,
				   s.tagline as sponsor_tagline,
				   s.website_url as sponsor_website_url,
				   s.discount_code as sponsor_discount_code,
				   s.discount_description as sponsor_discount_description,
				   t.name as sponsor_tier_name,
				   t.logo_size as sponsor_logo_size
			FROM feed_items fi
			LEFT JOIN content c ON fi.content_id = c.id
			LEFT JOIN sponsors s ON fi.sponsor_id = s.id
			LEFT JOIN sponsor_subscriptions sub ON s.id = sub.sponsor_id AND sub.status = 'active'
			LEFT JOIN sponsor_tiers t ON sub.tier_id = t.id
			WHERE fi.is_active = 1
				AND (fi.start_date IS NULL OR fi.start_date <= CURRENT_TIMESTAMP)
				AND (fi.end_date IS NULL OR fi.end_date > CURRENT_TIMESTAMP)
				AND (fi.content_id IS NULL OR c.status = 'published')
				AND (fi.sponsor_id IS NULL OR s.status = 'active')
			ORDER BY fi.priority DESC, fi.created_at DESC
		`)

		this.toggleStatusStatement = this.db.prepare(`
			UPDATE feed_items
			SET is_active = NOT is_active
			WHERE id = $id
			RETURNING *
		`)

		this.getBySponsorIdStatement = this.db.prepare(`
			SELECT * FROM feed_items WHERE sponsor_id = $sponsor_id
		`)

		this.updateEndDateBySponsorIdStatement = this.db.prepare(`
			UPDATE feed_items
			SET end_date = $end_date
			WHERE sponsor_id = $sponsor_id AND item_type = 'sponsor'
		`)

		this.deactivateBySponsorIdStatement = this.db.prepare(`
			UPDATE feed_items
			SET is_active = 0
			WHERE sponsor_id = $sponsor_id AND item_type = 'sponsor'
		`)
	}

	createFeedItem(data: {
		content_id?: string | null
		sponsor_id?: string | null
		item_type: 'cta' | 'ad' | 'featured' | 'sponsor'
		title?: string | null
		description?: string | null
		button_text?: string | null
		button_href?: string | null
		position_type?: 'fixed' | 'random'
		position_fixed?: number | null
		position_range_min?: number | null
		position_range_max?: number | null
		start_date?: string | null
		end_date?: string | null
		is_active?: boolean
		priority?: number
		created_by?: string | null
	}): FeedItem | null {
		try {
			const result = this.createStatement.get({
				content_id: data.content_id || null,
				sponsor_id: data.sponsor_id || null,
				item_type: data.item_type,
				title: data.title || null,
				description: data.description || null,
				button_text: data.button_text || null,
				button_href: data.button_href || null,
				position_type: data.position_type || 'random',
				position_fixed: data.position_fixed ?? null,
				position_range_min: data.position_range_min ?? 3,
				position_range_max: data.position_range_max ?? 7,
				start_date: data.start_date || null,
				end_date: data.end_date || null,
				is_active: data.is_active !== false ? 1 : 0,
				priority: data.priority || 0,
				created_by: data.created_by || null
			})
			return result as FeedItem
		} catch (error) {
			console.error('Error creating feed item:', error)
			return null
		}
	}

	updateFeedItem(
		id: string,
		data: {
			content_id?: string | null
			sponsor_id?: string | null
			item_type?: 'cta' | 'ad' | 'featured' | 'sponsor'
			title?: string | null
			description?: string | null
			button_text?: string | null
			button_href?: string | null
			position_type?: 'fixed' | 'random'
			position_fixed?: number | null
			position_range_min?: number | null
			position_range_max?: number | null
			start_date?: string | null
			end_date?: string | null
			is_active?: boolean
			priority?: number
		}
	): FeedItem | null {
		try {
			const existing = this.getFeedItemById(id)
			if (!existing) return null

			const result = this.updateStatement.get({
				id,
				content_id: data.content_id !== undefined ? data.content_id : existing.content_id,
				sponsor_id: data.sponsor_id !== undefined ? data.sponsor_id : existing.sponsor_id,
				item_type: data.item_type ?? existing.item_type,
				title: data.title !== undefined ? data.title : existing.title,
				description: data.description !== undefined ? data.description : existing.description,
				button_text: data.button_text !== undefined ? data.button_text : existing.button_text,
				button_href: data.button_href !== undefined ? data.button_href : existing.button_href,
				position_type: data.position_type ?? existing.position_type,
				position_fixed:
					data.position_fixed !== undefined ? data.position_fixed : existing.position_fixed,
				position_range_min:
					data.position_range_min !== undefined
						? data.position_range_min
						: existing.position_range_min,
				position_range_max:
					data.position_range_max !== undefined
						? data.position_range_max
						: existing.position_range_max,
				start_date: data.start_date !== undefined ? data.start_date : existing.start_date,
				end_date: data.end_date !== undefined ? data.end_date : existing.end_date,
				is_active: data.is_active !== undefined ? (data.is_active ? 1 : 0) : existing.is_active,
				priority: data.priority ?? existing.priority
			})
			return result as FeedItem
		} catch (error) {
			console.error('Error updating feed item:', error)
			return null
		}
	}

	deleteFeedItem(id: string): boolean {
		try {
			const result = this.deleteStatement.run({ id })
			return result.changes > 0
		} catch (error) {
			console.error('Error deleting feed item:', error)
			return false
		}
	}

	getFeedItemById(id: string): FeedItemWithContent | null {
		try {
			const row = this.getByIdStatement.get({ id }) as FeedItemRow | null
			return row ? this.transformRow(row) : null
		} catch (error) {
			console.error('Error getting feed item by id:', error)
			return null
		}
	}

	getAllFeedItems(): FeedItemWithContent[] {
		try {
			const rows = this.getAllStatement.all() as FeedItemRow[]
			return rows.map((row) => this.transformRow(row))
		} catch (error) {
			console.error('Error getting all feed items:', error)
			return []
		}
	}

	getActiveFeedItems(): FeedItemWithContent[] {
		try {
			const rows = this.getActiveStatement.all() as FeedItemRow[]
			return rows.map((row) => this.transformRow(row))
		} catch (error) {
			console.error('Error getting active feed items:', error)
			return []
		}
	}

	toggleFeedItemStatus(id: string): FeedItem | null {
		try {
			return this.toggleStatusStatement.get({ id }) as FeedItem | null
		} catch (error) {
			console.error('Error toggling feed item status:', error)
			return null
		}
	}

	/**
	 * Get the feed item for a sponsor (if one exists)
	 */
	getFeedItemBySponsorId(sponsorId: string): FeedItem | null {
		try {
			return this.getBySponsorIdStatement.get({ sponsor_id: sponsorId }) as FeedItem | null
		} catch (error) {
			console.error('Error getting feed item by sponsor id:', error)
			return null
		}
	}

	/**
	 * Create a feed item for an activated sponsor
	 * Uses tier-based positioning: Premium (2-5, priority 100), Basic (5-10, priority 50)
	 */
	createSponsorFeedItem(data: {
		sponsorId: string
		isPremium: boolean
		endDate: Date | null
	}): FeedItem | null {
		// Check if feed item already exists for this sponsor
		const existing = this.getFeedItemBySponsorId(data.sponsorId)
		if (existing) {
			// Reactivate if exists but inactive
			if (!existing.is_active) {
				return this.updateFeedItem(existing.id, {
					is_active: true,
					end_date: data.endDate?.toISOString() || null
				})
			}
			// Update end date if exists and active
			return this.updateFeedItem(existing.id, {
				end_date: data.endDate?.toISOString() || null
			})
		}

		// Create new feed item with tier-based positioning
		return this.createFeedItem({
			sponsor_id: data.sponsorId,
			item_type: 'sponsor',
			position_type: 'random',
			// Premium sponsors: positions 2-5, Basic: positions 5-10
			position_range_min: data.isPremium ? 2 : 5,
			position_range_max: data.isPremium ? 5 : 10,
			// Premium sponsors have higher priority
			priority: data.isPremium ? 100 : 50,
			is_active: true,
			start_date: new Date().toISOString(),
			end_date: data.endDate?.toISOString() || null
		})
	}

	/**
	 * Update the end date for a sponsor's feed item (on subscription renewal)
	 */
	updateSponsorFeedItemEndDate(sponsorId: string, newEndDate: Date): boolean {
		try {
			const result = this.updateEndDateBySponsorIdStatement.run({
				sponsor_id: sponsorId,
				end_date: newEndDate.toISOString()
			})
			return result.changes > 0
		} catch (error) {
			console.error('Error updating sponsor feed item end date:', error)
			return false
		}
	}

	/**
	 * Deactivate a sponsor's feed item (when sponsor is cancelled or expired)
	 */
	deactivateSponsorFeedItem(sponsorId: string): boolean {
		try {
			const result = this.deactivateBySponsorIdStatement.run({ sponsor_id: sponsorId })
			return result.changes > 0
		} catch (error) {
			console.error('Error deactivating sponsor feed item:', error)
			return false
		}
	}
}
