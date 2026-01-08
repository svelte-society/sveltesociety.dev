import { form, getRequestEvent, query } from '$app/server'
import { error, redirect } from '@sveltejs/kit'
import { z } from 'zod/v4'
import { checkAdminAuth } from '../../authorization.remote'

export const getCampaign = query(z.string(), (id) => {
  checkAdminAuth()
  const { locals } = getRequestEvent()
  const campaign = locals.newsletterService.getCampaignById(id)
  if (!campaign) error(404, 'Campaign not found')
  // Get items with full content details for display
  const items = locals.newsletterService.getCampaignItems(id)
  return { ...campaign, items }
})

const itemSchema = z.object({
  id: z.string(),
  custom_description: z.string().optional()
})

const updateCampaignSchema = z.object({
  id: z.string().min(1, 'Campaign ID is required'),
  title: z.string().min(1, 'Title is required'),
  subject: z.string().min(1, 'Subject is required'),
  intro_text: z.string().optional(),
  items: z.array(z.object({
    id: z.string(),
    custom_description: z.string().optional()
  })).optional()
})

export const updateCampaign = form(updateCampaignSchema, async (data) => {
  checkAdminAuth()
  const { locals } = getRequestEvent()

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

const sendCampaignSchema = z.object({
  id: z.string().min(1, 'Campaign ID is required')
})

export const sendCampaign = form(sendCampaignSchema, async (data) => {
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
