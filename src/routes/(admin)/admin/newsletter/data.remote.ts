import { form, getRequestEvent, query } from '$app/server'
import { z } from 'zod/v4'
import { checkAdminAuth } from '../authorization.remote'

const campaignIdSchema = z.object({
	id: z.string().min(1, 'Campaign ID is required')
})

const campaignFiltersSchema = z.object({
	status: z.enum(['draft', 'scheduled', 'sent', 'all']).default('all')
})

export const getCampaigns = query(campaignFiltersSchema.optional(), (filters) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()
	const status = filters?.status === 'all' ? undefined : filters?.status
	return locals.newsletterService.listCampaigns({ status })
})

export const deleteCampaign = form(campaignIdSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	try {
		const success = locals.newsletterService.deleteCampaign(data.id)
		if (!success) {
			return {
				success: false,
				text: 'Campaign not found or could not be deleted.'
			}
		}

		return {
			success: true,
			text: 'Campaign deleted successfully!'
		}
	} catch (error) {
		console.error('Error deleting campaign:', error)
		return {
			success: false,
			text: 'An error occurred while deleting the campaign.'
		}
	}
})

export const sendCampaign = form(campaignIdSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	try {
		const result = await locals.newsletterService.sendCampaign(
			data.id,
			locals.emailService,
			async (params) => locals.emailService.renderNewsletterEmail(params)
		)

		if (!result.success) {
			return {
				success: false,
				text: result.error || 'Failed to send campaign.'
			}
		}

		return {
			success: true,
			text: 'Campaign sent successfully!'
		}
	} catch (error) {
		console.error('Error sending campaign:', error)
		return {
			success: false,
			text: 'An error occurred while sending the campaign.'
		}
	}
})
