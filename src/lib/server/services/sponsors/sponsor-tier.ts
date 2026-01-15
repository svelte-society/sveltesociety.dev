import { Database } from 'bun:sqlite'
import type { PaymentTier } from '$lib/server/services/payments'

export type LogoSize = 'normal' | 'large'

export interface SponsorTier extends PaymentTier {
	yearly_price_cents: number
	one_time_price_cents: number
	features: string[]
	logo_size: LogoSize
	max_tagline_length: number
	show_in_feed: boolean
	show_in_sidebar: boolean
	include_social_promo: boolean
	stripe_monthly_price_id: string | null
	stripe_yearly_price_id: string | null
	stripe_onetime_price_id: string | null
	sort_order: number
	active: boolean
	created_at: string
}

// Raw database row before parsing
interface SponsorTierRow {
	id: string
	name: string
	display_name: string
	price_cents: number
	yearly_price_cents: number
	one_time_price_cents: number
	features: string // JSON string in database
	logo_size: LogoSize
	max_tagline_length: number
	show_in_feed: number // SQLite boolean
	show_in_sidebar: number // SQLite boolean
	include_social_promo: number // SQLite boolean
	stripe_monthly_price_id: string | null
	stripe_yearly_price_id: string | null
	stripe_onetime_price_id: string | null
	sort_order: number
	active: number // SQLite boolean
	created_at: string
}

export class SponsorTierService {
	constructor(private db: Database) {}

	/**
	 * Parse a raw database row into a SponsorTier object
	 */
	private parseRow(row: SponsorTierRow): SponsorTier {
		return {
			...row,
			features: JSON.parse(row.features),
			show_in_feed: row.show_in_feed === 1,
			show_in_sidebar: row.show_in_sidebar === 1,
			include_social_promo: row.include_social_promo === 1,
			active: row.active === 1
		}
	}

	/**
	 * Get all active sponsor tiers sorted by sort_order
	 */
	getActiveTiers(): SponsorTier[] {
		const stmt = this.db.prepare(`
			SELECT * FROM sponsor_tiers
			WHERE active = 1
			ORDER BY sort_order ASC
		`)
		const rows = stmt.all() as SponsorTierRow[]
		return rows.map((row) => this.parseRow(row))
	}

	/**
	 * Get a sponsor tier by its ID
	 */
	getTierById(id: string): SponsorTier | null {
		const stmt = this.db.prepare('SELECT * FROM sponsor_tiers WHERE id = $id')
		const row = stmt.get({ id }) as SponsorTierRow | undefined
		return row ? this.parseRow(row) : null
	}

	/**
	 * Get a sponsor tier by its name (e.g., 'basic', 'premium')
	 */
	getTierByName(name: string): SponsorTier | null {
		const stmt = this.db.prepare('SELECT * FROM sponsor_tiers WHERE name = $name')
		const row = stmt.get({ name }) as SponsorTierRow | undefined
		return row ? this.parseRow(row) : null
	}

	/**
	 * Update Stripe price IDs for a tier
	 */
	updateStripePriceIds(
		tierId: string,
		priceIds: {
			monthly?: string
			yearly?: string
			onetime?: string
		}
	): void {
		const updates: string[] = []
		const params: Record<string, string> = { id: tierId }

		if (priceIds.monthly !== undefined) {
			updates.push('stripe_monthly_price_id = $monthly')
			params.monthly = priceIds.monthly
		}
		if (priceIds.yearly !== undefined) {
			updates.push('stripe_yearly_price_id = $yearly')
			params.yearly = priceIds.yearly
		}
		if (priceIds.onetime !== undefined) {
			updates.push('stripe_onetime_price_id = $onetime')
			params.onetime = priceIds.onetime
		}

		if (updates.length === 0) return

		const stmt = this.db.prepare(`
			UPDATE sponsor_tiers
			SET ${updates.join(', ')}
			WHERE id = $id
		`)
		stmt.run(params)
	}

	/**
	 * Get the price for a specific billing type
	 */
	getPriceForBillingType(
		tier: SponsorTier,
		billingType: 'monthly' | 'yearly' | 'one_time'
	): number {
		switch (billingType) {
			case 'monthly':
				return tier.price_cents
			case 'yearly':
				return tier.yearly_price_cents
			case 'one_time':
				return tier.one_time_price_cents
		}
	}
}
