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
import NewsletterCampaignEmail from '$lib/templates/email/newsletter/newsletter-campaign.svelte'
import NewsletterConfirmationEmail from '$lib/templates/email/newsletter/newsletter-confirmation.svelte'

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
  /** If false, prevents auto-subscribing the contact in Plunk (for double opt-in) */
  subscribed?: boolean
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

// Newsletter email parameter types
export interface NewsletterContentItem {
  title: string
  description: string
  type: string
  slug: string
  image?: string | null
}

export interface RenderNewsletterEmailParams {
  subject: string
  introText?: string
  items: NewsletterContentItem[]
  baseUrl?: string
}

export interface NewsletterConfirmationEmailParams {
  email: string
  baseUrl?: string
  token: string
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
   * @param params.subscribed - If false, prevents auto-subscribing the contact in Plunk (for double opt-in)
   */
  async sendEmail(params: SendEmailParams & { subscribed?: boolean }): Promise<boolean> {
    const { to, subject, body, subscribed } = params

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
          body,
          // Only include subscribed if explicitly set to false (for double opt-in flow)
          ...(subscribed === false && { subscribed: false })
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
    const { to, subject, template, props, subscribed } = params

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = (await renderer.render(template, { props })) as any
    const html: string = result.html ?? String(result)

    return this.sendEmail({
      to,
      subject,
      body: html,
      subscribed
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

  // ==========================================
  // Newsletter Email Methods
  // ==========================================

  /**
   * Render a newsletter campaign email to HTML
   * Returns the rendered HTML string for use with Plunk campaigns
   */
  async renderNewsletterEmail(props: RenderNewsletterEmailParams): Promise<string> {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = (await renderer.render(NewsletterCampaignEmail, {
      props
    })) as any

    return result.html ?? String(result)
  }

  /**
   * Send a newsletter confirmation email for double opt-in
   */
  async sendNewsletterConfirmationEmail(
    params: NewsletterConfirmationEmailParams
  ): Promise<boolean> {
    const { email, baseUrl, token } = params

    return this.sendTemplatedEmail({
      to: email,
      subject: 'Confirm your Svelte Society newsletter subscription',
      template: NewsletterConfirmationEmail,
      props: {
        token,
        baseUrl: baseUrl
      },
      // Explicitly prevent auto-subscribing - only subscribe after confirmation
      subscribed: false
    })
  }

  // ==========================================
  // Newsletter Contact Methods
  // ==========================================

  /**
   * Subscribe a contact to the newsletter via Plunk
   * Creates or updates a contact with subscribed: true
   */
  async subscribeContact(email: string): Promise<{ success: boolean; id?: string }> {
    try {
      // Use the create contact endpoint with subscribed: true
      // Note: Plunk contacts endpoint does NOT use /v1 prefix
      const response = await fetch(`${this.apiUrl}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          email,
          subscribed: true
        })
      })

      if (!response.ok) {
        const error = await response.text()
        console.error('Subscribe contact failed:', error)
        return { success: false }
      }

      const data = await response.json()
      return { success: true, id: data.id }
    } catch (error) {
      console.error('Subscribe contact error:', error)
      return { success: false }
    }
  }

  /**
   * Get a contact by email from Plunk
   */
  async getContact(email: string): Promise<PlunkContact | null> {
    try {
      // Note: Plunk contacts endpoint does NOT use /v1 prefix
      // Use 'search' parameter to find by email
      const response = await fetch(`${this.apiUrl}/contacts?search=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`
        }
      })

      if (!response.ok) {
        const error = await response.text()
        console.error('Get contact failed:', error)
        return null
      }

      const data = await response.json()
      // Response has { contacts: [...], cursor, hasMore, total }
      const contacts = data.contacts || []
      return contacts.length > 0 ? contacts[0] : null
    } catch (error) {
      console.error('Get contact error:', error)
      return null
    }
  }

  /**
   * Get the total count of contacts in Plunk
   * Uses GET /contacts which returns total count on first page
   */
  async getContactCount(): Promise<number> {
    try {
      // Note: Plunk contacts endpoint does NOT use /v1 prefix
      // The total count is returned as part of the list response (first page only)
      const response = await fetch(`${this.apiUrl}/contacts?limit=1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`
        }
      })

      if (!response.ok) {
        const error = await response.text()
        console.error('Get contact count failed:', error)
        return 0
      }

      const data = await response.json()
      return data.total ?? 0
    } catch (error) {
      console.error('Get contact count error:', error)
      return 0
    }
  }

  // ==========================================
  // Newsletter Campaign Methods
  // ==========================================

  /**
   * Get all contacts from Plunk (for campaign recipients)
   * Handles cursor-based pagination to fetch all contacts
   */
  async getAllContacts(): Promise<PlunkContact[]> {
    const allContacts: PlunkContact[] = []
    let cursor: string | null = null
    let hasMore = true

    try {
      // Note: Plunk contacts endpoint does NOT use /v1 prefix
      // Uses cursor-based pagination
      while (hasMore) {
        const url: string = cursor
          ? `${this.apiUrl}/contacts?limit=100&cursor=${cursor}`
          : `${this.apiUrl}/contacts?limit=100`

        const response: Response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`
          }
        })

        if (!response.ok) {
          const error = await response.text()
          console.error('Get all contacts failed:', error)
          return allContacts // Return what we have so far
        }

        const data: { contacts?: PlunkContact[]; hasMore?: boolean; cursor?: string } =
          await response.json()
        if (data.contacts && Array.isArray(data.contacts)) {
          allContacts.push(...data.contacts)
        }

        hasMore = data.hasMore ?? false
        cursor = data.cursor ?? null
      }

      return allContacts
    } catch (error) {
      console.error('Get all contacts error:', error)
      return allContacts
    }
  }

  /**
   * Create a campaign in Plunk (draft state)
   * Campaigns are sent to all subscribed contacts by default (audienceType: 'ALL')
   */
  async createPlunkCampaign(params: CreateCampaignParams): Promise<{ success: boolean; id?: string }> {
    const { name, subject, body, from, audienceType = 'ALL' } = params

    try {
      // Note: Plunk campaigns endpoint does NOT use /v1 prefix
      const response = await fetch(`${this.apiUrl}/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          name,
          subject,
          body,
          from: from || this.fromEmail,
          audienceType
        })
      })

      if (!response.ok) {
        const error = await response.text()
        console.error('Create campaign failed:', error)
        return { success: false }
      }

      const responseData = await response.json()
      // Plunk wraps the campaign in a data object: { success: true, data: { id: "...", ... } }
      const campaignId = responseData.data?.id
      return { success: true, id: campaignId }
    } catch (error) {
      console.error('Create campaign error:', error)
      return { success: false }
    }
  }

  /**
   * Update a campaign in Plunk
   */
  async updatePlunkCampaign(
    campaignId: string,
    params: CreateCampaignParams
  ): Promise<{ success: boolean }> {
    const { name, subject, body, from, audienceType = 'ALL' } = params

    try {
      // Note: Plunk campaigns endpoint does NOT use /v1 prefix
      const response = await fetch(`${this.apiUrl}/campaigns/${campaignId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          name,
          subject,
          body,
          from: from || this.fromEmail,
          audienceType
        })
      })

      if (!response.ok) {
        const error = await response.text()
        console.error('Update campaign failed:', error)
        return { success: false }
      }

      return { success: true }
    } catch (error) {
      console.error('Update campaign error:', error)
      return { success: false }
    }
  }

  /**
   * Send a campaign via Plunk
   */
  async sendPlunkCampaign(campaignId: string): Promise<boolean> {
    try {
      // Note: Plunk campaigns endpoint does NOT use /v1 prefix
      const response = await fetch(`${this.apiUrl}/campaigns/${campaignId}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`
        }
      })

      if (!response.ok) {
        const error = await response.text()
        console.error('Send campaign failed:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Send campaign error:', error)
      return false
    }
  }

  /**
   * Delete a campaign from Plunk
   */
  async deletePlunkCampaign(campaignId: string): Promise<boolean> {
    try {
      // Note: Plunk campaigns endpoint does NOT use /v1 prefix
      const response = await fetch(`${this.apiUrl}/campaigns/${campaignId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`
        }
      })

      if (!response.ok) {
        const error = await response.text()
        console.error('Delete campaign failed:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Delete campaign error:', error)
      return false
    }
  }
}

// Plunk contact type
export interface PlunkContact {
  id: string
  email: string
  subscribed: boolean
  createdAt: string
  updatedAt: string
}

// Plunk campaign params
export interface CreateCampaignParams {
  name: string // Required: Campaign name
  subject: string // Required: Email subject line
  body: string // Required: Email body (HTML)
  from?: string // Optional: From email (uses service default if not provided)
  audienceType?: 'ALL' | 'SEGMENT' | 'FILTERED' // Defaults to 'ALL' (all subscribed contacts)
}
