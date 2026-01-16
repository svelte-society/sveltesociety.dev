import { form, getRequestEvent, query } from '$app/server'
import { error, redirect } from '@sveltejs/kit'
import { z } from 'zod/v4'
import { checkAdminAuth } from '../../authorization.remote'
import { getCampaigns } from '../data.remote'
import type {
	CampaignWithItems,
	CampaignType,
	ContentHighlightsCampaignWithItems,
	JobsRoundupCampaignWithItems,
	AnnouncementCampaign
} from '$lib/server/services/newsletter'
import type { EmailService } from '$lib/server/services/email'

export const getCampaign = query(z.string(), (id) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()
	const campaign = locals.newsletterService.getCampaignWithItems(id)
	if (!campaign) error(404, 'Campaign not found')
	return campaign
})

export const getAvailableJobs = query(() => {
	checkAdminAuth()
	const { locals } = getRequestEvent()
	return locals.newsletterService.getActiveJobs()
})

// Schema for content_highlights items
const itemSchema = z.object({
	id: z.string(),
	custom_description: z.string().optional()
})

// Base campaign fields
const baseCampaignSchema = z.object({
	id: z.string().optional(),
	title: z.string().min(1, 'Title is required'),
	subject: z.string().min(1, 'Subject is required'),
	campaign_type: z.enum(['content_highlights', 'announcement', 'jobs_roundup'])
})

// Type-specific fields
const contentHighlightsFields = z.object({
	intro_text: z.string().optional(),
	items: z.array(itemSchema).optional()
})

const announcementFields = z.object({
	body_html: z.string().min(1, 'Announcement content is required'),
	cta_text: z.string().optional(),
	cta_url: z.string().optional()
})

const jobsRoundupFields = z.object({
	jobs_intro_text: z.string().optional(),
	job_ids: z.array(z.string()).optional()
})

// Combined schema - all fields optional for flexibility
const campaignSchema = baseCampaignSchema
	.merge(contentHighlightsFields.partial())
	.merge(announcementFields.partial())
	.merge(jobsRoundupFields.partial())

/**
 * Render campaign HTML based on campaign type
 */
async function renderCampaignHtml(
	campaign: CampaignWithItems,
	emailService: EmailService
): Promise<string> {
	switch (campaign.campaign_type) {
		case 'content_highlights': {
			const c = campaign as ContentHighlightsCampaignWithItems
			return emailService.renderNewsletterEmail({
				subject: c.subject,
				introText: c.type_data.intro_text || undefined,
				items: c.type_data.items.map((item) => ({
					title: item.title,
					description: item.custom_description || item.description || '',
					type: item.type,
					slug: item.slug,
					image: item.image
				}))
			})
		}
		case 'announcement': {
			const c = campaign as AnnouncementCampaign
			return emailService.renderAnnouncementEmail({
				subject: c.subject,
				bodyHtml: c.type_data.body_html,
				ctaText: c.type_data.cta_text || undefined,
				ctaUrl: c.type_data.cta_url || undefined
			})
		}
		case 'jobs_roundup': {
			const c = campaign as JobsRoundupCampaignWithItems
			return emailService.renderJobsRoundupEmail({
				subject: c.subject,
				introText: c.type_data.intro_text || undefined,
				jobs: c.type_data.jobs.map((job) => ({
					id: job.id,
					title: job.title,
					description: job.description,
					slug: job.slug,
					metadata: job.metadata
				}))
			})
		}
	}
}

/**
 * Get Plunk campaign params from a campaign
 */
function getPlunkCampaignParams(campaign: CampaignWithItems, html: string) {
	return {
		name: campaign.title,
		subject: campaign.subject,
		body: html,
		audienceType: 'ALL' as const
	}
}

/**
 * Build CreateCampaignData from form data based on campaign type
 */
function buildCreateCampaignData(
	data: z.infer<typeof campaignSchema>,
	userId: string
): import('$lib/server/services/newsletter').CreateCampaignData {
	const campaignType = data.campaign_type as CampaignType

	switch (campaignType) {
		case 'content_highlights':
			return {
				campaign_type: 'content_highlights',
				title: data.title,
				subject: data.subject,
				created_by: userId,
				type_data: {
					items: data.items || [],
					intro_text: data.intro_text || null
				}
			}
		case 'announcement':
			return {
				campaign_type: 'announcement',
				title: data.title,
				subject: data.subject,
				created_by: userId,
				type_data: {
					body_html: data.body_html || '',
					cta_text: data.cta_text || null,
					cta_url: data.cta_url || null
				}
			}
		case 'jobs_roundup':
			return {
				campaign_type: 'jobs_roundup',
				title: data.title,
				subject: data.subject,
				created_by: userId,
				type_data: {
					job_ids: data.job_ids || [],
					intro_text: data.jobs_intro_text || null
				}
			}
	}
}

export const createCampaign = form(campaignSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	const userId = locals.user?.id
	if (!userId) {
		return { success: false, text: 'You must be logged in to create a campaign.' }
	}

	let campaign
	try {
		campaign = locals.newsletterService.createCampaignDraft(buildCreateCampaignData(data, userId))
	} catch (err) {
		console.error('Error creating campaign:', err)
		return { success: false, text: 'An unexpected error occurred. Please try again.' }
	}

	if (!campaign) {
		return { success: false, text: 'Failed to create campaign. Please try again.' }
	}

	// Get campaign with enriched items for Plunk
	const campaignWithItems = locals.newsletterService.getCampaignWithItems(campaign.id)
	if (campaignWithItems) {
		// Sync to Plunk
		const html = await renderCampaignHtml(campaignWithItems, locals.emailService)
		const plunkResult = await locals.emailService.createPlunkCampaign(
			getPlunkCampaignParams(campaignWithItems, html)
		)

		if (plunkResult.success && plunkResult.id) {
			locals.newsletterService.updateCampaign(campaign.id, {
				plunk_campaign_id: plunkResult.id
			})
		} else {
			console.error('Failed to sync campaign to Plunk')
		}
	}

	redirect(303, `/admin/newsletter`)
})

/**
 * Build type_data for update from form data based on campaign type
 */
function buildUpdateTypeData(data: z.infer<typeof campaignSchema>, campaignType: CampaignType) {
	switch (campaignType) {
		case 'content_highlights':
			return {
				items: data.items || [],
				intro_text: data.intro_text || null
			}
		case 'announcement':
			return {
				body_html: data.body_html || '',
				cta_text: data.cta_text || null,
				cta_url: data.cta_url || null
			}
		case 'jobs_roundup':
			return {
				job_ids: data.job_ids || [],
				intro_text: data.jobs_intro_text || null
			}
	}
}

export const updateCampaign = form(campaignSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	if (!data.id) {
		return { success: false, text: 'Campaign ID is required.' }
	}

	const existingCampaign = locals.newsletterService.getCampaignById(data.id)
	if (!existingCampaign) {
		return { success: false, text: 'Campaign not found.' }
	}

	// Don't allow updates to sent campaigns
	if (existingCampaign.status === 'sent') {
		return { success: false, text: 'Cannot update a sent campaign.' }
	}

	const campaignType = existingCampaign.campaign_type
	const typeData = buildUpdateTypeData(data, campaignType)

	let campaign
	try {
		campaign = locals.newsletterService.updateCampaign(data.id, {
			title: data.title,
			subject: data.subject,
			type_data: typeData
		})
	} catch (err) {
		console.error('Error updating campaign:', err)
		return { success: false, text: 'An unexpected error occurred. Please try again.' }
	}

	if (!campaign) {
		return { success: false, text: 'Failed to update campaign. Please try again.' }
	}

	// Get campaign with enriched items for Plunk
	const campaignWithItems = locals.newsletterService.getCampaignWithItems(campaign.id)
	if (campaignWithItems) {
		const html = await renderCampaignHtml(campaignWithItems, locals.emailService)
		const plunkParams = getPlunkCampaignParams(campaignWithItems, html)

		if (existingCampaign.plunk_campaign_id) {
			// Update existing Plunk campaign
			const updateResult = await locals.emailService.updatePlunkCampaign(
				existingCampaign.plunk_campaign_id,
				plunkParams
			)
			if (!updateResult.success) {
				console.error('Failed to update campaign in Plunk')
			}
		} else {
			// Create new Plunk campaign
			const createResult = await locals.emailService.createPlunkCampaign(plunkParams)
			if (createResult.success && createResult.id) {
				locals.newsletterService.updateCampaign(campaign.id, {
					plunk_campaign_id: createResult.id
				})
			} else {
				console.error('Failed to create campaign in Plunk')
			}
		}
	}

	return { success: true }
})

const sendCampaignSchema = z.object({
	id: z.string().min(1, 'Campaign ID is required')
})

export const sendCampaign = form(sendCampaignSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	try {
		// Get the campaign
		const campaign = locals.newsletterService.getCampaignById(data.id)
		if (!campaign) {
			return { success: false, text: 'Campaign not found.' }
		}

		// Check if already sent
		if (campaign.status === 'sent') {
			return { success: false, text: 'Campaign has already been sent.' }
		}

		// Check if synced to Plunk
		if (!campaign.plunk_campaign_id) {
			return {
				success: false,
				text: 'Campaign is not synced to Plunk. Please save the campaign first.'
			}
		}

		// Check subscriber count
		const subscriberCount = await locals.emailService.getContactCount()
		if (subscriberCount === 0) {
			return { success: false, text: 'No subscribers to send to.' }
		}

		// Send the campaign via Plunk
		const sendSuccess = await locals.emailService.sendPlunkCampaign(campaign.plunk_campaign_id)
		if (!sendSuccess) {
			return { success: false, text: 'Failed to send campaign via Plunk.' }
		}

		// Update local campaign status
		locals.newsletterService.updateCampaign(data.id, {
			status: 'sent',
			sent_at: new Date().toISOString()
		})

		await getCampaign(data.id).refresh()
		await getCampaigns().refresh()
		return { success: true, text: 'Campaign sent successfully!' }
	} catch (err) {
		console.error('Error sending campaign:', err)
		return { success: false, text: 'An error occurred while sending the campaign.' }
	}
})

const copyCampaignSchema = z.object({
	id: z.string().min(1, 'Campaign ID is required')
})

export const copyCampaign = form(copyCampaignSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	const userId = locals.user?.id
	if (!userId) {
		return { success: false, text: 'You must be logged in to copy a campaign.' }
	}

	try {
		// Get the source campaign
		const sourceCampaign = locals.newsletterService.getCampaignWithItems(data.id)
		if (!sourceCampaign) {
			return { success: false, text: 'Campaign not found.' }
		}

		// Build create data based on campaign type
		let createData: import('$lib/server/services/newsletter').CreateCampaignData
		switch (sourceCampaign.campaign_type) {
			case 'content_highlights': {
				const c = sourceCampaign as ContentHighlightsCampaignWithItems
				createData = {
					campaign_type: 'content_highlights',
					title: `Copy of ${sourceCampaign.title}`,
					subject: sourceCampaign.subject,
					created_by: userId,
					type_data: {
						items: c.type_data.items.map((item) => ({
							id: item.id,
							custom_description: item.custom_description
						})),
						intro_text: c.type_data.intro_text
					}
				}
				break
			}
			case 'announcement': {
				const c = sourceCampaign as AnnouncementCampaign
				createData = {
					campaign_type: 'announcement',
					title: `Copy of ${sourceCampaign.title}`,
					subject: sourceCampaign.subject,
					created_by: userId,
					type_data: {
						body_html: c.type_data.body_html,
						cta_text: c.type_data.cta_text,
						cta_url: c.type_data.cta_url
					}
				}
				break
			}
			case 'jobs_roundup': {
				const c = sourceCampaign as JobsRoundupCampaignWithItems
				createData = {
					campaign_type: 'jobs_roundup',
					title: `Copy of ${sourceCampaign.title}`,
					subject: sourceCampaign.subject,
					created_by: userId,
					type_data: {
						job_ids: c.type_data.jobs.map((job) => job.id),
						intro_text: c.type_data.intro_text
					}
				}
				break
			}
		}

		// Create a copy
		const newCampaign = locals.newsletterService.createCampaignDraft(createData)

		if (!newCampaign) {
			return { success: false, text: 'Failed to copy campaign.' }
		}

		// Sync the new campaign to Plunk
		const campaignWithItems = locals.newsletterService.getCampaignWithItems(newCampaign.id)
		if (campaignWithItems) {
			const html = await renderCampaignHtml(campaignWithItems, locals.emailService)
			const plunkResult = await locals.emailService.createPlunkCampaign(
				getPlunkCampaignParams(campaignWithItems, html)
			)

			if (plunkResult.success && plunkResult.id) {
				locals.newsletterService.updateCampaign(newCampaign.id, {
					plunk_campaign_id: plunkResult.id
				})
			}
		}

		await getCampaigns().refresh()
		redirect(303, `/admin/newsletter/${newCampaign.id}`)
	} catch (err) {
		// Redirect throws, so this is expected
		throw err
	}
})
