import { form, getRequestEvent, query } from '$app/server'
import { z } from 'zod/v4'
import { checkAdminAuth } from '../authorization.remote'

const campaignIdSchema = z.object({
  id: z.string().min(1, 'Campaign ID is required')
})

export const getCampaigns = query('unchecked', () => {
  checkAdminAuth()
  const { locals } = getRequestEvent()
  return locals.newsletterService.listCampaigns({}).campaigns
})

export const deleteCampaign = form(campaignIdSchema, async (data) => {
  checkAdminAuth()
  const { locals } = getRequestEvent()

  try {
    // Check if campaign exists and is not sent
    const campaign = locals.newsletterService.getCampaignById(data.id)
    if (!campaign) {
      return {
        success: false,
        text: 'Campaign not found.'
      }
    }

    if (campaign.status === 'sent') {
      return {
        success: false,
        text: 'Cannot delete a sent campaign.'
      }
    }

    const success = locals.newsletterService.deleteCampaign(data.id)
    if (!success) {
      return {
        success: false,
        text: 'Could not delete campaign.'
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
