import { Database } from 'bun:sqlite'

export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded'

export interface Payment {
	id: string
	user_id: string | null
	employer_email: string
	content_id: string | null
	stripe_payment_intent_id: string | null
	stripe_checkout_session_id: string | null
	amount_cents: number
	currency: string
	status: PaymentStatus
	tier_id: string
	metadata: Record<string, unknown> | null
	created_at: string
	completed_at: string | null
}

// Raw database row before parsing
interface PaymentRow {
	id: string
	user_id: string | null
	employer_email: string
	content_id: string | null
	stripe_payment_intent_id: string | null
	stripe_checkout_session_id: string | null
	amount_cents: number
	currency: string
	status: PaymentStatus
	tier_id: string
	metadata: string | null // JSON string in database
	created_at: string
	completed_at: string | null
}

export interface CreatePaymentData {
	user_id?: string
	employer_email: string
	stripe_checkout_session_id?: string
	amount_cents: number
	tier_id: string
	currency?: string
	metadata?: Record<string, unknown>
}

/**
 * Job data stored in payment metadata before job creation
 */
export interface StoredJobData {
	company_name: string
	company_logo: string | null
	company_website: string | null
	employer_email: string
	title: string
	description: string
	body: string
	position_type: 'full-time' | 'part-time' | 'contract' | 'internship'
	seniority_level: 'entry' | 'junior' | 'mid' | 'senior' | 'principal'
	remote_status: 'on-site' | 'hybrid' | 'remote'
	remote_restrictions: string | null
	location: string | null
	salary_min: number | null
	salary_max: number | null
	salary_currency: string
}

export class PaymentService {
	constructor(private db: Database) {}

	/**
	 * Parse a raw database row into a Payment object
	 */
	private parseRow(row: PaymentRow): Payment {
		return {
			...row,
			metadata: row.metadata ? JSON.parse(row.metadata) : null
		}
	}

	/**
	 * Create a new payment record
	 * @returns The ID of the created payment
	 */
	createPayment(data: CreatePaymentData): string {
		const stmt = this.db.prepare(`
			INSERT INTO payments (
				user_id,
				employer_email,
				stripe_checkout_session_id,
				amount_cents,
				tier_id,
				currency,
				metadata,
				status
			) VALUES (
				$user_id,
				$employer_email,
				$stripe_checkout_session_id,
				$amount_cents,
				$tier_id,
				$currency,
				$metadata,
				'pending'
			)
			RETURNING id
		`)

		const result = stmt.get({
			user_id: data.user_id || null,
			employer_email: data.employer_email,
			stripe_checkout_session_id: data.stripe_checkout_session_id || null,
			amount_cents: data.amount_cents,
			tier_id: data.tier_id,
			currency: data.currency || 'usd',
			metadata: data.metadata ? JSON.stringify(data.metadata) : null
		}) as { id: string }

		return result.id
	}

	/**
	 * Get a payment by its ID
	 */
	getPaymentById(id: string): Payment | null {
		const stmt = this.db.prepare('SELECT * FROM payments WHERE id = $id')
		const row = stmt.get({ id }) as PaymentRow | undefined
		return row ? this.parseRow(row) : null
	}

	/**
	 * Get a payment by Stripe checkout session ID
	 */
	getPaymentBySessionId(sessionId: string): Payment | null {
		const stmt = this.db.prepare('SELECT * FROM payments WHERE stripe_checkout_session_id = $session_id')
		const row = stmt.get({ session_id: sessionId }) as PaymentRow | undefined
		return row ? this.parseRow(row) : null
	}

	/**
	 * Update the status of a payment
	 * Sets completed_at timestamp when status is 'succeeded'
	 */
	updatePaymentStatus(paymentId: string, status: PaymentStatus): void {
		const stmt = this.db.prepare(`
			UPDATE payments
			SET
				status = $status,
				completed_at = CASE WHEN $status = 'succeeded' THEN CURRENT_TIMESTAMP ELSE completed_at END
			WHERE id = $id
		`)
		stmt.run({ id: paymentId, status })
	}

	/**
	 * Link a payment to a content (job) ID
	 * Called after the job is created from a successful payment
	 */
	linkPaymentToContent(paymentId: string, contentId: string): void {
		const stmt = this.db.prepare(`
			UPDATE payments
			SET content_id = $content_id
			WHERE id = $id
		`)
		stmt.run({ id: paymentId, content_id: contentId })
	}

	/**
	 * Update the Stripe payment intent ID
	 * Called when we receive the payment intent from Stripe webhook
	 */
	updatePaymentIntentId(paymentId: string, paymentIntentId: string): void {
		const stmt = this.db.prepare(`
			UPDATE payments
			SET stripe_payment_intent_id = $payment_intent_id
			WHERE id = $id
		`)
		stmt.run({ id: paymentId, payment_intent_id: paymentIntentId })
	}

	/**
	 * Get all payments for a specific employer email
	 * Ordered by created_at descending (most recent first)
	 */
	getPaymentsByEmail(email: string): Payment[] {
		const stmt = this.db.prepare(`
			SELECT * FROM payments
			WHERE employer_email = $email
			ORDER BY created_at DESC, rowid DESC
		`)
		const rows = stmt.all({ email }) as PaymentRow[]
		return rows.map((row) => this.parseRow(row))
	}

	/**
	 * Get recent payments (for admin dashboard)
	 * @param limit Maximum number of payments to return
	 */
	getRecentPayments(limit: number = 20): Payment[] {
		const stmt = this.db.prepare(`
			SELECT * FROM payments
			ORDER BY created_at DESC, rowid DESC
			LIMIT $limit
		`)
		const rows = stmt.all({ limit }) as PaymentRow[]
		return rows.map((row) => this.parseRow(row))
	}
}
