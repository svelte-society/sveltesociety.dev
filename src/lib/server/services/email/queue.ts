import { open, type Database } from 'lmdb'
import { randomUUID } from 'crypto'

export interface QueuedEmail {
	id: string
	to: string[]
	subject: string
	html: string
	text: string
	from: string
	replyTo?: string
	status: 'pending' | 'processing' | 'failed'
	retryCount: number
	lastError?: string
	createdAt: number
	nextRetryAt?: number
}

export type NewEmail = Omit<QueuedEmail, 'id' | 'status' | 'retryCount' | 'createdAt'>

export class EmailQueue {
	private db: Database

	constructor(dbPath: string = '.data/email-queue') {
		this.db = open({ path: dbPath, compression: true })
	}

	/**
	 * Add an email to the queue
	 * Returns the generated queue ID
	 */
	add(email: NewEmail): string {
		const id = randomUUID()
		const queuedEmail: QueuedEmail = {
			...email,
			id,
			status: 'pending',
			retryCount: 0,
			createdAt: Date.now()
		}
		this.db.putSync(id, queuedEmail)
		return id
	}

	/**
	 * Get an email by ID
	 */
	get(id: string): QueuedEmail | undefined {
		return this.db.get(id) as QueuedEmail | undefined
	}

	/**
	 * Get all pending emails, ordered by createdAt (FIFO)
	 */
	getPending(limit?: number): QueuedEmail[] {
		const pending: QueuedEmail[] = []
		for (const { value } of this.db.getRange()) {
			const email = value as QueuedEmail
			if (email.status === 'pending') {
				pending.push(email)
			}
		}
		pending.sort((a, b) => a.createdAt - b.createdAt)
		return limit ? pending.slice(0, limit) : pending
	}

	/**
	 * Get all failed emails
	 */
	getFailed(): QueuedEmail[] {
		const failed: QueuedEmail[] = []
		for (const { value } of this.db.getRange()) {
			const email = value as QueuedEmail
			if (email.status === 'failed') {
				failed.push(email)
			}
		}
		return failed
	}

	/**
	 * Get failed emails that are ready for retry (past nextRetryAt)
	 */
	getRetryable(): QueuedEmail[] {
		const now = Date.now()
		const retryable: QueuedEmail[] = []
		for (const { value } of this.db.getRange()) {
			const email = value as QueuedEmail
			if (email.status === 'failed' && email.nextRetryAt && email.nextRetryAt <= now) {
				retryable.push(email)
			}
		}
		return retryable
	}

	/**
	 * Mark an email as being processed
	 */
	markProcessing(id: string): void {
		const email = this.get(id)
		if (email) {
			this.db.putSync(id, { ...email, status: 'processing' })
		}
	}

	/**
	 * Mark an email as complete and remove from queue
	 */
	markComplete(id: string): void {
		this.db.removeSync(id)
	}

	/**
	 * Mark an email as failed with error and exponential backoff
	 * nextRetryAt = now + (1000 * 2^retryCount) ms
	 */
	markFailed(id: string, error: string): void {
		const email = this.get(id)
		if (email) {
			const newRetryCount = email.retryCount + 1
			const backoffMs = 1000 * Math.pow(2, newRetryCount - 1)
			this.db.putSync(id, {
				...email,
				status: 'failed',
				retryCount: newRetryCount,
				lastError: error,
				nextRetryAt: Date.now() + backoffMs
			})
		}
	}

	/**
	 * Close the database connection
	 */
	close(): void {
		this.db.close()
	}
}
