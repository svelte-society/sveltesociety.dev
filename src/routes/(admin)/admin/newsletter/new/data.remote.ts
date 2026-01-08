import { form, getRequestEvent } from '$app/server'
import { redirect } from '@sveltejs/kit'
import { z } from 'zod/v4'
import { checkAdminAuth } from '../../authorization.remote'

const itemSchema = z.object({
	id: z.string(),
	custom_description: z.string().optional()
})

const createCampaignSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	subject: z.string().min(1, 'Subject is required'),
	intro_text: z.string().optional(),
	items: z
		.string()
		.transform((val) => JSON.parse(val) as Array<{ id: string; custom_description?: string }>)
		.pipe(z.array(itemSchema))
		.optional()
})

export const createCampaign = form(createCampaignSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	const userId = locals.user?.id
	if (!userId) {
		return {
			success: false,
			text: 'You must be logged in to create a campaign.'
		}
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
	} catch (error) {
		console.error('Error creating campaign:', error)
		return {
			success: false,
			text: 'An unexpected error occurred. Please try again.'
		}
	}

	if (!campaign) {
		return {
			success: false,
			text: 'Failed to create campaign. Please try again.'
		}
	}

	redirect(303, `/admin/newsletter/${campaign.id}`)
})
