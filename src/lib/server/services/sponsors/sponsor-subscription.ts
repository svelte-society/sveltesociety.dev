import { Database } from 'bun:sqlite'

export type BillingType = 'monthly' | 'yearly' | 'one_time'

export type SubscriptionStatus =
	| 'incomplete'
	| 'incomplete_expired'
	| 'active'
	| 'past_due'
	| 'canceled'
	| 'unpaid'
	| 'trialing'
	| 'paused'

export interface SponsorSubscription {
	id: string
	sponsor_id: string
	tier_id: string
	billing_type: BillingType
	stripe_subscription_id: string | null
	stripe_customer_id: string | null
	stripe_checkout_session_id: string | null
	amount_cents: number
	currency: string
	status: SubscriptionStatus
	current_period_start: string | null
	current_period_end: string | null
	cancelled_at: string | null
	cancel_at_period_end: boolean
	metadata: Record<string, unknown> | null
	created_at: string
	updated_at: string
}

// Raw database row before parsing
interface SubscriptionRow {
	id: string
	sponsor_id: string
	tier_id: string
	billing_type: BillingType
	stripe_subscription_id: string | null
	stripe_customer_id: string | null
	stripe_checkout_session_id: string | null
	amount_cents: number
	currency: string
	status: SubscriptionStatus
	current_period_start: string | null
	current_period_end: string | null
	cancelled_at: string | null
	cancel_at_period_end: number // SQLite boolean
	metadata: string | null // JSON string
	created_at: string
	updated_at: string
}

export interface CreateSubscriptionData {
	sponsor_id: string
	tier_id: string
	billing_type: BillingType
	stripe_checkout_session_id?: string
	amount_cents: number
	currency?: string
	metadata?: Record<string, unknown>
}

export class SponsorSubscriptionService {
	constructor(private db: Database) {}

	/**
	 * Parse a raw database row into a SponsorSubscription object
	 */
	private parseRow(row: SubscriptionRow): SponsorSubscription {
		return {
			...row,
			cancel_at_period_end: row.cancel_at_period_end === 1,
			metadata: row.metadata ? JSON.parse(row.metadata) : null
		}
	}

	/**
	 * Create a new subscription record
	 * @returns The ID of the created subscription
	 */
	createSubscription(data: CreateSubscriptionData): string {
		const stmt = this.db.prepare(`
			INSERT INTO sponsor_subscriptions (
				sponsor_id,
				tier_id,
				billing_type,
				stripe_checkout_session_id,
				amount_cents,
				currency,
				metadata,
				status
			) VALUES (
				$sponsor_id,
				$tier_id,
				$billing_type,
				$stripe_checkout_session_id,
				$amount_cents,
				$currency,
				$metadata,
				'incomplete'
			)
			RETURNING id
		`)

		const result = stmt.get({
			sponsor_id: data.sponsor_id,
			tier_id: data.tier_id,
			billing_type: data.billing_type,
			stripe_checkout_session_id: data.stripe_checkout_session_id || null,
			amount_cents: data.amount_cents,
			currency: data.currency || 'usd',
			metadata: data.metadata ? JSON.stringify(data.metadata) : null
		}) as { id: string }

		return result.id
	}

	/**
	 * Get a subscription by its ID
	 */
	getSubscriptionById(id: string): SponsorSubscription | null {
		const stmt = this.db.prepare('SELECT * FROM sponsor_subscriptions WHERE id = $id')
		const row = stmt.get({ id }) as SubscriptionRow | undefined
		return row ? this.parseRow(row) : null
	}

	/**
	 * Get a subscription by Stripe subscription ID
	 */
	getByStripeSubscriptionId(stripeSubscriptionId: string): SponsorSubscription | null {
		const stmt = this.db.prepare(
			'SELECT * FROM sponsor_subscriptions WHERE stripe_subscription_id = $stripe_subscription_id'
		)
		const row = stmt.get({ stripe_subscription_id: stripeSubscriptionId }) as
			| SubscriptionRow
			| undefined
		return row ? this.parseRow(row) : null
	}

	/**
	 * Get a subscription by Stripe checkout session ID
	 */
	getByCheckoutSessionId(sessionId: string): SponsorSubscription | null {
		const stmt = this.db.prepare(
			'SELECT * FROM sponsor_subscriptions WHERE stripe_checkout_session_id = $session_id'
		)
		const row = stmt.get({ session_id: sessionId }) as SubscriptionRow | undefined
		return row ? this.parseRow(row) : null
	}

	/**
	 * Get all subscriptions for a sponsor
	 */
	getSubscriptionsBySponsor(sponsorId: string): SponsorSubscription[] {
		const stmt = this.db.prepare(`
			SELECT * FROM sponsor_subscriptions
			WHERE sponsor_id = $sponsor_id
			ORDER BY created_at DESC
		`)
		const rows = stmt.all({ sponsor_id: sponsorId }) as SubscriptionRow[]
		return rows.map((row) => this.parseRow(row))
	}

	/**
	 * Get active subscription for a sponsor (if any)
	 */
	getActiveSubscription(sponsorId: string): SponsorSubscription | null {
		const stmt = this.db.prepare(`
			SELECT * FROM sponsor_subscriptions
			WHERE sponsor_id = $sponsor_id AND status = 'active'
			ORDER BY created_at DESC
			LIMIT 1
		`)
		const row = stmt.get({ sponsor_id: sponsorId }) as SubscriptionRow | undefined
		return row ? this.parseRow(row) : null
	}

	/**
	 * Update subscription status
	 */
	updateStatus(id: string, status: SubscriptionStatus): void {
		const stmt = this.db.prepare(`
			UPDATE sponsor_subscriptions
			SET status = $status
			WHERE id = $id
		`)
		stmt.run({ id, status })
	}

	/**
	 * Set Stripe subscription ID (after checkout completes)
	 */
	setStripeSubscriptionId(id: string, stripeSubscriptionId: string): void {
		const stmt = this.db.prepare(`
			UPDATE sponsor_subscriptions
			SET stripe_subscription_id = $stripe_subscription_id
			WHERE id = $id
		`)
		stmt.run({ id, stripe_subscription_id: stripeSubscriptionId })
	}

	/**
	 * Set Stripe checkout session ID
	 */
	setStripeCheckoutSessionId(id: string, sessionId: string): void {
		const stmt = this.db.prepare(`
			UPDATE sponsor_subscriptions
			SET stripe_checkout_session_id = $session_id
			WHERE id = $id
		`)
		stmt.run({ id, session_id: sessionId })
	}

	/**
	 * Set Stripe customer ID
	 */
	setStripeCustomerId(id: string, stripeCustomerId: string): void {
		const stmt = this.db.prepare(`
			UPDATE sponsor_subscriptions
			SET stripe_customer_id = $stripe_customer_id
			WHERE id = $id
		`)
		stmt.run({ id, stripe_customer_id: stripeCustomerId })
	}

	/**
	 * Update subscription period (from Stripe webhook)
	 */
	updatePeriod(id: string, periodStart: Date, periodEnd: Date): void {
		const stmt = this.db.prepare(`
			UPDATE sponsor_subscriptions
			SET
				current_period_start = $period_start,
				current_period_end = $period_end
			WHERE id = $id
		`)
		stmt.run({
			id,
			period_start: periodStart.toISOString(),
			period_end: periodEnd.toISOString()
		})
	}

	/**
	 * Mark subscription as cancelled
	 */
	markCancelled(id: string, cancelAtPeriodEnd: boolean = false): void {
		const stmt = this.db.prepare(`
			UPDATE sponsor_subscriptions
			SET
				cancelled_at = CURRENT_TIMESTAMP,
				cancel_at_period_end = $cancel_at_period_end,
				status = CASE WHEN $cancel_at_period_end = 0 THEN 'canceled' ELSE status END
			WHERE id = $id
		`)
		stmt.run({ id, cancel_at_period_end: cancelAtPeriodEnd ? 1 : 0 })
	}

	/**
	 * Activate a subscription (mark as active and set period)
	 */
	activateSubscription(id: string, periodStart: Date, periodEnd: Date): void {
		const stmt = this.db.prepare(`
			UPDATE sponsor_subscriptions
			SET
				status = 'active',
				current_period_start = $period_start,
				current_period_end = $period_end
			WHERE id = $id
		`)
		stmt.run({
			id,
			period_start: periodStart.toISOString(),
			period_end: periodEnd.toISOString()
		})
	}

	/**
	 * Get subscriptions by status
	 */
	getSubscriptionsByStatus(status: SubscriptionStatus): SponsorSubscription[] {
		const stmt = this.db.prepare(`
			SELECT * FROM sponsor_subscriptions
			WHERE status = $status
			ORDER BY created_at DESC
		`)
		const rows = stmt.all({ status }) as SubscriptionRow[]
		return rows.map((row) => this.parseRow(row))
	}

	/**
	 * Get all active subscriptions
	 */
	getActiveSubscriptions(): SponsorSubscription[] {
		return this.getSubscriptionsByStatus('active')
	}

	/**
	 * Get subscriptions with past_due status (for admin attention)
	 */
	getPastDueSubscriptions(): SponsorSubscription[] {
		return this.getSubscriptionsByStatus('past_due')
	}
}
