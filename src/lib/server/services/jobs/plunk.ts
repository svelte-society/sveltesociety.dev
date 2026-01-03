import { PLUNK_API_KEY, PLUNK_API_URL } from '$env/static/private'

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

	constructor(apiKey: string = PLUNK_API_KEY, apiUrl: string = PLUNK_API_URL) {
		this.apiKey = apiKey
		this.apiUrl = apiUrl.replace(/\/$/, '') // Remove trailing slash
	}

	/**
	 * Send a transactional email via Plunk
	 */
	async sendEmail(params: SendEmailParams): Promise<boolean> {
		const { to, subject, body } = params

		try {
			const response = await fetch(`${this.apiUrl}/api/v1/send`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${this.apiKey}`
				},
				body: JSON.stringify({
					to,
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
		const { employerEmail, employerName, jobTitle, applicantName, applicantEmail, applicantProfileUrl, applicationMessage } =
			params

		const greeting = employerName ? `Hi ${employerName}` : 'Hello'
		const messageSection = applicationMessage
			? `
<h3>Message from applicant:</h3>
<blockquote style="border-left: 3px solid #ff3e00; padding-left: 16px; margin: 16px 0; color: #555;">
${applicationMessage}
</blockquote>`
			: ''

		const body = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #ff3e00; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 24px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background: #ff3e00; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0; }
    .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 14px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">New Job Application</h1>
    </div>
    <div class="content">
      <p>${greeting},</p>
      <p>Great news! You have received a new application for your job posting:</p>
      <h2 style="color: #ff3e00;">${jobTitle}</h2>
      
      <h3>Applicant Details:</h3>
      <ul>
        <li><strong>Name:</strong> ${applicantName}</li>
        <li><strong>Email:</strong> <a href="mailto:${applicantEmail}">${applicantEmail}</a></li>
      </ul>
      ${messageSection}
      
      <a href="${applicantProfileUrl}" class="button">View Applicant Profile</a>
      
      <p>You can respond directly to the applicant by replying to their email address above.</p>
      
      <div class="footer">
        <p>This notification was sent via <a href="https://sveltesociety.dev">Svelte Society</a> Job Board.</p>
      </div>
    </div>
  </div>
</body>
</html>`

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
		const { employerEmail, jobTitle, tierName, expiresAt, jobUrl, editUrl } = params

		const body = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #ff3e00; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 24px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background: #ff3e00; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 8px 8px 8px 0; }
    .button-secondary { background: #666; }
    .info-box { background: white; padding: 16px; border-radius: 6px; margin: 16px 0; }
    .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 14px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">Your Job is Live!</h1>
    </div>
    <div class="content">
      <p>Congratulations! Your job posting is now live on Svelte Society.</p>
      
      <div class="info-box">
        <h2 style="margin-top: 0; color: #ff3e00;">${jobTitle}</h2>
        <p><strong>Plan:</strong> ${tierName}</p>
        <p><strong>Expires:</strong> ${expiresAt}</p>
      </div>
      
      <a href="${jobUrl}" class="button">View Your Listing</a>
      <a href="${editUrl}" class="button button-secondary">Edit Listing</a>
      
      <p>When candidates apply, you'll receive an email notification with their profile information.</p>
      
      <div class="footer">
        <p>Thank you for posting on <a href="https://sveltesociety.dev">Svelte Society</a>!</p>
        <p>Questions? Reply to this email or contact support.</p>
      </div>
    </div>
  </div>
</body>
</html>`

		return this.sendEmail({
			to: employerEmail,
			subject: `Your job posting is live: ${jobTitle}`,
			body
		})
	}

	/**
	 * Send a payment confirmation email
	 */
	async sendPaymentConfirmation(params: PaymentConfirmationParams): Promise<boolean> {
		const { employerEmail, jobTitle, tierName, amountPaid, receiptUrl } = params

		const receiptSection = receiptUrl
			? `<p><a href="${receiptUrl}">View your receipt →</a></p>`
			: ''

		const body = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #28a745; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 24px; border-radius: 0 0 8px 8px; }
    .info-box { background: white; padding: 16px; border-radius: 6px; margin: 16px 0; }
    .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 14px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">Payment Confirmed</h1>
    </div>
    <div class="content">
      <p>Thank you for your payment! Here are the details:</p>
      
      <div class="info-box">
        <p><strong>Job Posting:</strong> ${jobTitle}</p>
        <p><strong>Plan:</strong> ${tierName}</p>
        <p><strong>Amount Paid:</strong> ${amountPaid}</p>
      </div>
      
      ${receiptSection}
      
      <p>You'll receive another email once your job posting is live.</p>
      
      <div class="footer">
        <p>This is a receipt for your payment to <a href="https://sveltesociety.dev">Svelte Society</a>.</p>
      </div>
    </div>
  </div>
</body>
</html>`

		return this.sendEmail({
			to: employerEmail,
			subject: `Payment confirmed for ${jobTitle}`,
			body
		})
	}
}
