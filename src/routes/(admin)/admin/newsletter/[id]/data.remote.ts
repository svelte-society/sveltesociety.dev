import { form, getRequestEvent, query } from '$app/server'
import { error, redirect } from '@sveltejs/kit'
import { z } from 'zod/v4'
import { checkAdminAuth } from '../../authorization.remote'
import { getCampaigns } from '../data.remote'
import type { CampaignWithItems } from '$lib/server/services/newsletter'
import type { EmailService } from '$lib/server/services/email'

export const getCampaign = query(z.string(), (id) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()
	const campaign = locals.newsletterService.getCampaignWithItems(id)
	if (!campaign) error(404, 'Campaign not found')
	return campaign
})

const itemSchema = z.object({
	id: z.string(),
	custom_description: z.string().optional()
})

const campaignSchema = z.object({
	id: z.string().optional(),
	title: z.string().min(1, 'Title is required'),
	subject: z.string().min(1, 'Subject is required'),
	intro_text: z.string().optional(),
	items: z.array(itemSchema).optional()
})

/**
 * Render campaign HTML for Plunk
 */
async function renderCampaignHtml(
	campaign: CampaignWithItems,
	emailService: EmailService
): Promise<string> {
	return emailService.renderNewsletterEmail({
		subject: campaign.subject,
		introText: campaign.intro_text || undefined,
		items: campaign.items.map((item) => ({
			title: item.title,
			description: item.custom_description || item.description || '',
			type: item.type,
			slug: item.slug,
			image: item.image
		}))
	})
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

export const createCampaign = form(campaignSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	const userId = locals.user?.id
	if (!userId) {
		return { success: false, text: 'You must be logged in to create a campaign.' }
	}

	let campaign
	try {
		campaign = locals.newsletterService.createCampaignDraft({
			title: data.title,
			subject: data.subject,
			intro_text: data.intro_text,
			created_by: userId,
			items: data.items || []
		})
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

	let campaign
	try {
		campaign = locals.newsletterService.updateCampaign(data.id, {
			title: data.title,
			subject: data.subject,
			intro_text: data.intro_text,
			items: data.items
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

		// Create a copy
		const newCampaign = locals.newsletterService.createCampaignDraft({
			title: `Copy of ${sourceCampaign.title}`,
			subject: sourceCampaign.subject,
			intro_text: sourceCampaign.intro_text,
			created_by: userId,
			items: sourceCampaign.items.map((item) => ({
				id: item.id,
				custom_description: item.custom_description
			}))
		})

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
