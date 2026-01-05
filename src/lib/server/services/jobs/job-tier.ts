import { Database } from 'bun:sqlite'

export interface JobTier {
	id: string
	name: string
	display_name: string
	price_cents: number
	duration_days: number
	features: string[]
	stripe_price_id: string | null
	sort_order: number
	active: boolean
	created_at: string
}

// Raw database row before parsing
interface JobTierRow {
	id: string
	name: string
	display_name: string
	price_cents: number
	duration_days: number
	features: string // JSON string in database
	stripe_price_id: string | null
	sort_order: number
	active: number // SQLite boolean
	created_at: string
}

export class JobTierService {
	constructor(private db: Database) {}

	/**
	 * Parse a raw database row into a JobTier object
	 */
	private parseRow(row: JobTierRow): JobTier {
		return {
			...row,
			features: JSON.parse(row.features),
			active: row.active === 1
		}
	}

	/**
	 * Get all active job tiers sorted by sort_order
	 */
	getActiveTiers(): JobTier[] {
		const stmt = this.db.prepare(`
			SELECT * FROM job_tiers
			WHERE active = 1
			ORDER BY sort_order ASC
		`)
		const rows = stmt.all() as JobTierRow[]
		return rows.map((row) => this.parseRow(row))
	}

	/**
	 * Get a job tier by its ID
	 */
	getTierById(id: string): JobTier | null {
		const stmt = this.db.prepare('SELECT * FROM job_tiers WHERE id = $id')
		const row = stmt.get({ id }) as JobTierRow | undefined
		return row ? this.parseRow(row) : null
	}

	/**
	 * Get a job tier by its name (e.g., 'basic', 'featured', 'premium')
	 */
	getTierByName(name: string): JobTier | null {
		const stmt = this.db.prepare('SELECT * FROM job_tiers WHERE name = $name')
		const row = stmt.get({ name }) as JobTierRow | undefined
		return row ? this.parseRow(row) : null
	}

	/**
	 * Update the Stripe Price ID for a tier
	 * This is used to link tiers to Stripe products
	 */
	updateStripePriceId(tierId: string, stripePriceId: string): void {
		const stmt = this.db.prepare(`
			UPDATE job_tiers
			SET stripe_price_id = $stripe_price_id
			WHERE id = $id
		`)
		stmt.run({ id: tierId, stripe_price_id: stripePriceId })
	}

	/**
	 * Calculate the expiration date for a job posting based on tier
	 * @param tierId The tier ID
	 * @param startDate The start date (defaults to now)
	 * @returns The expiration date
	 */
	calculateExpirationDate(tierId: string, startDate: Date = new Date()): Date {
		const tier = this.getTierById(tierId)
		if (!tier) {
			throw new Error('Tier not found')
		}

		const expirationDate = new Date(startDate)
		expirationDate.setDate(expirationDate.getDate() + tier.duration_days)
		return expirationDate
	}
}
