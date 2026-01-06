import { form, getRequestEvent, query } from '$app/server'
import { error, redirect } from '@sveltejs/kit'
import { z } from 'zod/v4'
import { checkAdminAuth } from '../../authorization.remote'

export const getCampaign = query(z.string(), (id) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()
	const campaign = locals.newsletterService.getCampaignById(id)
	if (!campaign) error(404, 'Campaign not found')
	return campaign
})

export const getCampaignItems = query(z.string(), (campaignId) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()
	return locals.newsletterService.getCampaignItems(campaignId)
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

	let campaign
	try {
		campaign = locals.newsletterService.updateCampaign(data.id, {
			title: data.title,
			subject: data.subject,
			intro_text: data.intro_text
		})
	} catch (err) {
		console.error('Error updating campaign:', err)
		return {
			success: false,
			text: 'An unexpected error occurred. Please try again.'
		}
	}

	if (!campaign) {
		return {
			success: false,
			text: 'Failed to update campaign. Please try again.'
		}
	}

	redirect(303, '/admin/newsletter')
})

const addContentSchema = z.object({
	campaign_id: z.string().min(1, 'Campaign ID is required'),
	content_id: z.string().min(1, 'Content ID is required')
})

export const addContent = form(addContentSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	try {
		const item = locals.newsletterService.addContentToCampaign(data.campaign_id, data.content_id)
		if (!item) {
			return {
				success: false,
				text: 'Failed to add content.'
			}
		}
		return {
			success: true,
			text: 'Content added!'
		}
	} catch (error) {
		console.error('Error adding content:', error)
		return {
			success: false,
			text: 'An error occurred while adding content.'
		}
	}
})

const updateItemSchema = z.object({
	item_id: z.string().min(1, 'Item ID is required'),
	custom_description: z.string().optional()
})

export const updateItem = form(updateItemSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	try {
		const item = locals.newsletterService.updateCampaignItem(data.item_id, {
			custom_description: data.custom_description
		})
		if (!item) {
			return {
				success: false,
				text: 'Failed to update item.'
			}
		}
		return {
			success: true,
			text: 'Item updated!'
		}
	} catch (error) {
		console.error('Error updating item:', error)
		return {
			success: false,
			text: 'An error occurred while updating the item.'
		}
	}
})

const removeContentSchema = z.object({
	item_id: z.string().min(1, 'Item ID is required')
})

export const removeContent = form(removeContentSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	try {
		const success = locals.newsletterService.removeContentFromCampaign(data.item_id)
		if (!success) {
			return {
				success: false,
				text: 'Failed to remove content.'
			}
		}
		return {
			success: true,
			text: 'Content removed!'
		}
	} catch (error) {
		console.error('Error removing content:', error)
		return {
			success: false,
			text: 'An error occurred while removing content.'
		}
	}
})
