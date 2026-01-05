import { PLUNK_API_SECRET_KEY, PLUNK_API_URL, PLUNK_FROM_EMAIL } from '$env/static/private'
import {
	jobApplicationTemplate,
	formatApplicationMessage,
	jobPostingReceivedTemplate,
	paymentConfirmationTemplate,
	formatReceiptLink
} from './templates'

export interface SendEmailParams {
	to: string
	subject: string
	body: string
}

export interface JobApplicationEmailParams {
	employerEmail: string
	employerName?: string
	jobTitle: string
	applicantName: string
	applicantEmail: string
	applicantProfileUrl: string
	applicationMessage?: string
}

export interface JobPostingConfirmationParams {
	employerEmail: string
	jobTitle: string
	tierName: string
	expiresAt: string
	jobUrl: string
	editUrl: string
}

export interface PaymentConfirmationParams {
	employerEmail: string
	jobTitle: string
	tierName: string
	amountPaid: string
	receiptUrl?: string
}

export class PlunkService {
	private apiKey: string
	private apiUrl: string
	private fromEmail: string

	constructor(
		apiKey: string = PLUNK_API_SECRET_KEY,
		apiUrl: string = PLUNK_API_URL,
		fromEmail: string = PLUNK_FROM_EMAIL
	) {
		this.apiKey = apiKey
		this.apiUrl = apiUrl.replace(/\/$/, '') // Remove trailing slash
		this.fromEmail = fromEmail
	}

	/**
	 * Send a transactional email via Plunk
	 */
	async sendEmail(params: SendEmailParams): Promise<boolean> {
		const { to, subject, body } = params

		try {
			const response = await fetch(`${this.apiUrl}/v1/send`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${this.apiKey}`
				},
				body: JSON.stringify({
					to,
					from: this.fromEmail,
					subject,
					body
				})
			})

			if (!response.ok) {
				const error = await response.text()
				console.error('Plunk email failed:', error)
				return false
			}

			return true
		} catch (error) {
			console.error('Plunk email error:', error)
			return false
		}
	}

	/**
	 * Send a job application notification to the employer
	 */
	async sendJobApplicationNotification(params: JobApplicationEmailParams): Promise<boolean> {
		const {
			employerEmail,
			employerName,
			jobTitle,
			applicantName,
			applicantEmail,
			applicantProfileUrl,
			applicationMessage
		} = params

		const greeting = employerName ? `Hi ${employerName}` : 'Hello'
		const messageSection = formatApplicationMessage(applicationMessage)

		const body = jobApplicationTemplate({
			greeting,
			jobTitle,
			applicantName,
			applicantEmail,
			applicantProfileUrl,
			messageSection
		})

		return this.sendEmail({
			to: employerEmail,
			subject: `New application for ${jobTitle} - ${applicantName}`,
			body
		})
	}

	/**
	 * Send a job posting confirmation email to the employer
	 */
	async sendJobPostingConfirmation(params: JobPostingConfirmationParams): Promise<boolean> {
		const { employerEmail, jobTitle, tierName, expiresAt } = params

		const body = jobPostingReceivedTemplate({
			jobTitle,
			tierName,
			expiresAt
		})

		return this.sendEmail({
			to: employerEmail,
			subject: `Job posting received: ${jobTitle}`,
			body
		})
	}

	/**
	 * Send a payment confirmation email
	 */
	async sendPaymentConfirmation(params: PaymentConfirmationParams): Promise<boolean> {
		const { employerEmail, jobTitle, tierName, amountPaid, receiptUrl } = params

		const receiptSection = formatReceiptLink(receiptUrl)

		const body = paymentConfirmationTemplate({
			jobTitle,
			tierName,
			amountPaid,
			receiptSection
		})

		return this.sendEmail({
			to: employerEmail,
			subject: `Payment confirmed for ${jobTitle}`,
			body
		})
	}
}
