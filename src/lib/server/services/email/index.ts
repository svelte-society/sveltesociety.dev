import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import { EmailQueue, type QueuedEmail } from './queue'

// Environment variables will be imported from $env/static/private in production
// For now, we use defaults for testing
const AWS_SES_REGION = process.env.AWS_SES_REGION || ''
const AWS_SES_ACCESS_KEY = process.env.AWS_SES_ACCESS_KEY || ''
const AWS_SES_SECRET_KEY = process.env.AWS_SES_SECRET_KEY || ''
const AWS_SES_FROM_EMAIL = process.env.AWS_SES_FROM_EMAIL || ''
const AWS_SES_RATE_LIMIT_MS = process.env.AWS_SES_RATE_LIMIT_MS || '100'
const AWS_SES_MAX_BATCH_SIZE = process.env.AWS_SES_MAX_BATCH_SIZE || '50'
const AWS_SES_MAX_RETRIES = process.env.AWS_SES_MAX_RETRIES || '3'

export interface EmailOptions {
	to: string | string[]
	subject: string
	html: string
	text: string
	from?: string
	replyTo?: string
}

export interface EmailResult {
	success: boolean
	messageId?: string
	error?: string
	queueId?: string
}

export interface QueueStats {
	pending: number
	failed: number
}

export interface ProcessResult {
	processed: number
	failed: number
}

export interface RetryResult {
	retried: number
	permanentlyFailed: number
}

export class EmailService {
	private client: SESClient | null = null
	private queue: EmailQueue
	private defaultFrom: string
	private rateLimitMs: number
	private maxBatchSize: number
	private maxRetries: number

	constructor(queue: EmailQueue, options?: { defaultFrom?: string }) {
		this.queue = queue
		this.defaultFrom = options?.defaultFrom || AWS_SES_FROM_EMAIL || ''
		this.rateLimitMs = parseInt(AWS_SES_RATE_LIMIT_MS || '100')
		this.maxBatchSize = parseInt(AWS_SES_MAX_BATCH_SIZE || '50')
		this.maxRetries = parseInt(AWS_SES_MAX_RETRIES || '3')

		if (AWS_SES_ACCESS_KEY && AWS_SES_SECRET_KEY && AWS_SES_REGION) {
			this.client = new SESClient({
				region: AWS_SES_REGION,
				credentials: {
					accessKeyId: AWS_SES_ACCESS_KEY,
					secretAccessKey: AWS_SES_SECRET_KEY
				}
			})
		}
	}

	/**
	 * Check if the email service is configured and ready to send
	 */
	isConfigured(): boolean {
		return this.client !== null && !!this.defaultFrom
	}

	/**
	 * Get the rate limit in milliseconds
	 */
	getRateLimitMs(): number {
		return this.rateLimitMs
	}

	/**
	 * Get the max batch size
	 */
	getMaxBatchSize(): number {
		return this.maxBatchSize
	}

	/**
	 * Get the max retries
	 */
	getMaxRetries(): number {
		return this.maxRetries
	}

	/**
	 * Queue an email and process immediately
	 */
	async send(options: EmailOptions): Promise<EmailResult> {
		const toAddresses = Array.isArray(options.to) ? options.to : [options.to]

		// Add to queue
		const queueId = this.queue.add({
			to: toAddresses,
			subject: options.subject,
			html: options.html,
			text: options.text,
			from: options.from || this.defaultFrom,
			replyTo: options.replyTo
		})

		// Process immediately
		if (!this.isConfigured()) {
			this.queue.markFailed(queueId, 'Email service not configured')
			return {
				success: false,
				error: 'Email service not configured',
				queueId
			}
		}

		const email = this.queue.get(queueId)
		if (!email) {
			return {
				success: false,
				error: 'Failed to retrieve queued email',
				queueId
			}
		}

		this.queue.markProcessing(queueId)
		const result = await this.sendViaSES(email)

		if (result.error) {
			this.queue.markFailed(queueId, result.error)
			return {
				success: false,
				error: result.error,
				queueId
			}
		}

		this.queue.markComplete(queueId)
		return {
			success: true,
			messageId: result.messageId,
			queueId
		}
	}

	/**
	 * Queue a batch of emails (respects maxBatchSize) and process immediately
	 */
	async sendBatch(recipients: string[], options: Omit<EmailOptions, 'to'>): Promise<EmailResult[]> {
		// Limit to maxBatchSize
		const limitedRecipients = recipients.slice(0, this.maxBatchSize)
		const results: EmailResult[] = []

		for (let i = 0; i < limitedRecipients.length; i++) {
			const recipient = limitedRecipients[i]

			// Rate limit between sends (except for the first one)
			if (i > 0) {
				await this.sleep(this.rateLimitMs)
			}

			const result = await this.send({
				...options,
				to: recipient
			})
			results.push(result)
		}

		return results
	}

	/**
	 * Process pending queue items with rate limiting
	 */
	async processQueue(): Promise<ProcessResult> {
		const pending = this.queue.getPending()
		let processed = 0
		let failed = 0

		for (let i = 0; i < pending.length; i++) {
			const email = pending[i]

			// Rate limit between sends (except for the first one)
			if (i > 0) {
				await this.sleep(this.rateLimitMs)
			}

			this.queue.markProcessing(email.id)

			if (!this.isConfigured()) {
				this.queue.markFailed(email.id, 'Email service not configured')
				failed++
				continue
			}

			const result = await this.sendViaSES(email)

			if (result.error) {
				this.queue.markFailed(email.id, result.error)
				failed++
			} else {
				this.queue.markComplete(email.id)
				processed++
			}
		}

		return { processed, failed }
	}

	/**
	 * Retry failed items that are past their nextRetryAt
	 */
	async retryFailed(): Promise<RetryResult> {
		const retryable = this.queue.getRetryable()
		let retried = 0
		let permanentlyFailed = 0

		for (let i = 0; i < retryable.length; i++) {
			const email = retryable[i]

			// Check if max retries exceeded
			if (email.retryCount >= this.maxRetries) {
				permanentlyFailed++
				continue
			}

			// Rate limit between sends (except for the first one)
			if (i > 0) {
				await this.sleep(this.rateLimitMs)
			}

			this.queue.markProcessing(email.id)

			if (!this.isConfigured()) {
				this.queue.markFailed(email.id, 'Email service not configured')
				continue
			}

			const result = await this.sendViaSES(email)

			if (result.error) {
				this.queue.markFailed(email.id, result.error)
			} else {
				this.queue.markComplete(email.id)
				retried++
			}
		}

		return { retried, permanentlyFailed }
	}

	/**
	 * Get queue statistics
	 */
	getQueueStats(): QueueStats {
		return {
			pending: this.queue.getPending().length,
			failed: this.queue.getFailed().length
		}
	}

	/**
	 * Internal: Send a single email via SES
	 */
	protected async sendViaSES(email: QueuedEmail): Promise<{ messageId?: string; error?: string }> {
		if (!this.client) {
			return { error: 'Email service not configured' }
		}

		try {
			const command = new SendEmailCommand({
				Source: email.from || this.defaultFrom,
				Destination: {
					ToAddresses: email.to
				},
				Message: {
					Subject: { Data: email.subject, Charset: 'UTF-8' },
					Body: {
						Html: { Data: email.html, Charset: 'UTF-8' },
						Text: { Data: email.text, Charset: 'UTF-8' }
					}
				},
				ReplyToAddresses: email.replyTo ? [email.replyTo] : undefined
			})

			const response = await this.client.send(command)
			return { messageId: response.MessageId }
		} catch (error) {
			console.error('[EmailService] Failed to send email:', error)
			return { error: error instanceof Error ? error.message : 'Unknown error' }
		}
	}

	/**
	 * Internal: Sleep for rate limiting
	 */
	protected sleep(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms))
	}
}

// Re-export queue types for convenience
export { EmailQueue, type QueuedEmail, type NewEmail } from './queue'
