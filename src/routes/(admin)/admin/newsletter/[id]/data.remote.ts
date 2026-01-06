import { form, getRequestEvent, query } from '$app/server'
import { error, isRedirect, redirect } from '@sveltejs/kit'
import { z } from 'zod/v4'
import { checkAdminAuth } from '../../authorization.remote'

export const getCampaign = query(z.string(), (id) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()
	const campaign = locals.newsletterService.getCampaignById(id)
	if (!campaign) error(404, 'Campaign not found')
	return campaign
})

const updateCampaignSchema = z.object({
	id: z.string().min(1, 'Campaign ID is required'),
	title: z.string().min(1, 'Title is required'),
	subject: z.string().min(1, 'Subject is required'),
	intro_text: z.string().optional()
})

export const updateCampaign = form(updateCampaignSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	try {
		const campaign = locals.newsletterService.updateCampaign(data.id, {
			title: data.title,
			subject: data.subject,
			intro_text: data.intro_text
		})

		if (!campaign) {
			return {
				success: false,
				text: 'Failed to update campaign. Please try again.'
			}
		}

		redirect(303, '/admin/newsletter')
	} catch (error) {
		if (isRedirect(error)) throw error
		console.error('Error updating campaign:', error)
		return {
			success: false,
			text: 'An unexpected error occurred. Please try again.'
		}
	}
})
