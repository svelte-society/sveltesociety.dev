import { PLUNK_API_SECRET_KEY, PLUNK_API_URL } from '$env/static/private'
import { Renderer } from 'better-svelte-email'
import appStyles from '../../../app.css?raw'
import type { Component } from 'svelte'

// Import job email templates
import JobApplicationEmail from '$lib/templates/email/jobs/job-application.svelte'
import JobPostingReceivedEmail from '$lib/templates/email/jobs/job-posting-received.svelte'
import JobPaymentConfirmationEmail from '$lib/templates/email/jobs/job-payment-confirmation.svelte'
import JobLiveEmail from '$lib/templates/email/jobs/job-live.svelte'
import JobExpiredEmail from '$lib/templates/email/jobs/job-expired.svelte'
import JobRejectedEmail from '$lib/templates/email/jobs/job-rejected.svelte'
import JobRenewalReminderEmail from '$lib/templates/email/jobs/job-renewal-reminder.svelte'

const renderer = new Renderer({ customCSS: appStyles })

// Default from email - should be configured via environment variable in production
const DEFAULT_FROM_EMAIL = 'noreply@sveltesociety.dev'

export interface SendEmailParams {
	to: string
	subject: string
	body: string
}

interface SendTemplatedEmailParams<T extends Record<string, unknown>> {
	to: string
	subject: string
	template: Component<T>
	props: T
}

// Job email parameter types
export interface JobApplicationEmailParams {
	employerEmail: string
	employerName?: string
	jobTitle: string
	applicantName: string
	applicantEmail: string
	applicantProfileUrl: string
	applicationMessage?: string
}

export interface JobPostingReceivedEmailParams {
	employerEmail: string
	jobTitle: string
	tierName: string
	expiresAt: string
}

export interface JobPaymentConfirmationEmailParams {
	employerEmail: string
	jobTitle: string
	tierName: string
	amountPaid: string
	receiptUrl?: string
}

export interface JobLiveEmailParams {
	employerEmail: string
	jobTitle: string
	companyName: string
	expiresAt: string
	jobUrl: string
}

export interface JobExpiredEmailParams {
	employerEmail: string
	jobTitle: string
	expiredAt: string
	renewUrl?: string
}

export interface JobRejectedEmailParams {
	employerEmail: string
	jobTitle: string
	rejectionReason: string
}

export interface JobRenewalReminderEmailParams {
	employerEmail: string
	jobTitle: string
	companyName: string
	expiresAt: string
	daysRemaining: number
	renewUrl?: string
}

export class EmailService {
	private apiKey: string
	private apiUrl: string
	private fromEmail: string

	constructor(
		apiKey: string = PLUNK_API_SECRET_KEY,
		apiUrl: string = PLUNK_API_URL,
		fromEmail: string = DEFAULT_FROM_EMAIL
	) {
		this.apiKey = apiKey
		this.apiUrl = apiUrl.replace(/\/$/, '') // Remove trailing slash
		this.fromEmail = fromEmail
	}

	/**
	 * Send a raw HTML email
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
				console.error('Email send failed:', error)
				return false
			}

			return true
		} catch (error) {
			console.error('Email send error:', error)
			return false
		}
	}

	/**
	 * Send an email using a Svelte template component
	 */
	private async sendTemplatedEmail<T extends Record<string, unknown>>(
		params: SendTemplatedEmailParams<T>
	): Promise<boolean> {
		const { to, subject, template, props } = params

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const result = (await renderer.render(template, props)) as any
		const html: string = result.html ?? String(result)

		return this.sendEmail({
			to,
			subject,
			body: html
		})
	}

	// ==========================================
	// Job Email Methods
	// ==========================================

	/**
	 * Send a job application notification to the employer
	 */
	async sendJobApplicationEmail(params: JobApplicationEmailParams): Promise<boolean> {
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

		return this.sendTemplatedEmail({
			to: employerEmail,
			subject: `New application for ${jobTitle} - ${applicantName}`,
			template: JobApplicationEmail,
			props: {
				greeting,
				jobTitle,
				applicantName,
				applicantEmail,
				applicantProfileUrl,
				message: applicationMessage
			}
		})
	}

	/**
	 * Send a job posting received confirmation email
	 */
	async sendJobPostingReceivedEmail(params: JobPostingReceivedEmailParams): Promise<boolean> {
		const { employerEmail, jobTitle, tierName, expiresAt } = params

		return this.sendTemplatedEmail({
			to: employerEmail,
			subject: `Job posting received: ${jobTitle}`,
			template: JobPostingReceivedEmail,
			props: {
				jobTitle,
				tierName,
				expiresAt
			}
		})
	}

	/**
	 * Send a payment confirmation email
	 */
	async sendJobPaymentConfirmationEmail(
		params: JobPaymentConfirmationEmailParams
	): Promise<boolean> {
		const { employerEmail, jobTitle, tierName, amountPaid, receiptUrl } = params

		return this.sendTemplatedEmail({
			to: employerEmail,
			subject: `Payment confirmed for ${jobTitle}`,
			template: JobPaymentConfirmationEmail,
			props: {
				jobTitle,
				tierName,
				amountPaid,
				receiptUrl
			}
		})
	}

	/**
	 * Send a notification that a job posting is now live
	 */
	async sendJobLiveEmail(params: JobLiveEmailParams): Promise<boolean> {
		const { employerEmail, jobTitle, companyName, expiresAt, jobUrl } = params

		return this.sendTemplatedEmail({
			to: employerEmail,
			subject: `Your job posting is now live: ${jobTitle}`,
			template: JobLiveEmail,
			props: {
				jobTitle,
				companyName,
				expiresAt,
				jobUrl
			}
		})
	}

	/**
	 * Send a notification that a job posting has expired
	 */
	async sendJobExpiredEmail(params: JobExpiredEmailParams): Promise<boolean> {
		const { employerEmail, jobTitle, expiredAt, renewUrl } = params

		return this.sendTemplatedEmail({
			to: employerEmail,
			subject: `Your job posting has expired: ${jobTitle}`,
			template: JobExpiredEmail,
			props: {
				jobTitle,
				expiredAt,
				renewUrl
			}
		})
	}

	/**
	 * Send a notification that a job posting was rejected
	 */
	async sendJobRejectedEmail(params: JobRejectedEmailParams): Promise<boolean> {
		const { employerEmail, jobTitle, rejectionReason } = params

		return this.sendTemplatedEmail({
			to: employerEmail,
			subject: `Update on your job posting: ${jobTitle}`,
			template: JobRejectedEmail,
			props: {
				jobTitle,
				rejectionReason
			}
		})
	}

	/**
	 * Send a reminder that a job posting will expire soon
	 */
	async sendJobRenewalReminderEmail(params: JobRenewalReminderEmailParams): Promise<boolean> {
		const { employerEmail, jobTitle, companyName, expiresAt, daysRemaining, renewUrl } = params

		return this.sendTemplatedEmail({
			to: employerEmail,
			subject: `Your job posting expires in ${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'}: ${jobTitle}`,
			template: JobRenewalReminderEmail,
			props: {
				jobTitle,
				companyName,
				expiresAt,
				daysRemaining,
				renewUrl
			}
		})
	}
}
