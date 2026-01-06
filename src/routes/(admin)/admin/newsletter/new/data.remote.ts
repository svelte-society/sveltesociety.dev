import { form, getRequestEvent } from '$app/server'
import { isRedirect, redirect } from '@sveltejs/kit'
import { z } from 'zod/v4'
import { checkAdminAuth } from '../../authorization.remote'

const createCampaignSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	subject: z.string().min(1, 'Subject is required'),
	intro_text: z.string().optional()
})

export const createCampaign = form(createCampaignSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	try {
		const userId = locals.user?.id
		if (!userId) {
			return {
				success: false,
				text: 'You must be logged in to create a campaign.'
			}
		}

		const campaign = locals.newsletterService.createCampaignDraft({
			title: data.title,
			subject: data.subject,
			intro_text: data.intro_text,
			created_by: userId
		})

		if (!campaign) {
			return {
				success: false,
				text: 'Failed to create campaign. Please try again.'
			}
		}

		redirect(303, `/admin/newsletter/${campaign.id}`)
	} catch (error) {
		if (isRedirect(error)) throw error
		console.error('Error creating campaign:', error)
		return {
			success: false,
			text: 'An unexpected error occurred. Please try again.'
		}
	}
})
