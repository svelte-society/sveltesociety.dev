import { Database } from 'bun:sqlite'

export interface MerchFulfillment {
	id: string
	stripe_checkout_session_id: string
	user_id: string
	styria_order_id: string | null
	fulfillment_status: string
	shipping_tracking_number: string | null
	metadata: Record<string, any> | null
	created_at: string
	updated_at: string
}

export class MerchFulfillmentService {
	constructor(private db: Database) {}

	createFulfillment(stripeSessionId: string, userId: string): MerchFulfillment {
		const row = this.db
			.prepare(
				`INSERT INTO merch_fulfillments (stripe_checkout_session_id, user_id)
				VALUES ($sessionId, $userId)
				RETURNING *`
			)
			.get({ sessionId: stripeSessionId, userId }) as any

		return this.parseFulfillment(row)
	}

	getByStripeSessionId(sessionId: string): MerchFulfillment | null {
		const row = this.db
			.prepare('SELECT * FROM merch_fulfillments WHERE stripe_checkout_session_id = $sessionId')
			.get({ sessionId }) as any
		return row ? this.parseFulfillment(row) : null
	}

	getByUserId(userId: string): MerchFulfillment[] {
		const rows = this.db
			.prepare('SELECT * FROM merch_fulfillments WHERE user_id = $userId ORDER BY created_at DESC')
			.all({ userId }) as any[]
		return rows.map((r) => this.parseFulfillment(r))
	}

	getById(id: string): MerchFulfillment | null {
		const row = this.db
			.prepare('SELECT * FROM merch_fulfillments WHERE id = $id')
			.get({ id }) as any
		return row ? this.parseFulfillment(row) : null
	}

	setStyriaOrderId(id: string, styriaOrderId: string): boolean {
		const result = this.db
			.prepare(
				'UPDATE merch_fulfillments SET styria_order_id = $styriaOrderId, updated_at = CURRENT_TIMESTAMP WHERE id = $id'
			)
			.run({ id, styriaOrderId })
		return result.changes > 0
	}

	updateStatus(id: string, status: string): boolean {
		const result = this.db
			.prepare(
				'UPDATE merch_fulfillments SET fulfillment_status = $status, updated_at = CURRENT_TIMESTAMP WHERE id = $id'
			)
			.run({ id, status })
		return result.changes > 0
	}

	setTrackingNumber(id: string, trackingNumber: string): boolean {
		const result = this.db
			.prepare(
				'UPDATE merch_fulfillments SET shipping_tracking_number = $trackingNumber, updated_at = CURRENT_TIMESTAMP WHERE id = $id'
			)
			.run({ id, trackingNumber })
		return result.changes > 0
	}

	getActiveFulfillments(): MerchFulfillment[] {
		const rows = this.db
			.prepare(
				`SELECT * FROM merch_fulfillments
				WHERE fulfillment_status NOT IN ('delivered', 'cancelled', 'refunded')
				ORDER BY created_at DESC`
			)
			.all() as any[]
		return rows.map((r) => this.parseFulfillment(r))
	}

	getAllFulfillments(filters?: { status?: string; limit?: number; offset?: number }): {
		fulfillments: MerchFulfillment[]
		count: number
	} {
		const { status, limit = 50, offset = 0 } = filters || {}

		let whereClause = ''
		const countParams: Record<string, any> = {}
		const params: Record<string, any> = { limit, offset }

		if (status && status !== 'all') {
			whereClause = 'WHERE fulfillment_status = $status'
			countParams.status = status
			params.status = status
		}

		const countResult = this.db
			.prepare(`SELECT COUNT(*) as count FROM merch_fulfillments ${whereClause}`)
			.get(countParams) as { count: number }

		const rows = this.db
			.prepare(
				`SELECT * FROM merch_fulfillments ${whereClause} ORDER BY created_at DESC LIMIT $limit OFFSET $offset`
			)
			.all(params) as any[]

		return {
			fulfillments: rows.map((r) => this.parseFulfillment(r)),
			count: countResult.count
		}
	}

	updateMetadata(id: string, metadata: Record<string, any>): boolean {
		const result = this.db
			.prepare(
				'UPDATE merch_fulfillments SET metadata = $metadata, updated_at = CURRENT_TIMESTAMP WHERE id = $id'
			)
			.run({ id, metadata: JSON.stringify(metadata) })
		return result.changes > 0
	}

	private parseFulfillment(row: any): MerchFulfillment {
		return {
			...row,
			metadata: row.metadata ? JSON.parse(row.metadata) : null
		}
	}
}
