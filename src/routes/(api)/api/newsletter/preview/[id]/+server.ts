import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ params, locals }) => {
	// Check if user is admin
	const userRole = locals.user ? locals.roleService.getRoleById(locals.user.role)?.value : null
	if (userRole !== 'admin') {
		throw error(403, 'Admin access required')
	}

	const campaignId = params.id
	if (!campaignId) {
		throw error(400, 'Campaign ID is required')
	}

	try {
		// Get campaign
		const campaign = locals.newsletterService.getCampaignById(campaignId)
		if (!campaign) {
			throw error(404, 'Campaign not found')
		}

		// Get campaign items with content details
		const items = locals.newsletterService.getCampaignItems(campaignId)

		// Map items to the format expected by the email template
		const contentItems = items.map((item: any) => ({
			title: item.content_title,
			description: item.custom_description || item.content_description || '',
			type: item.content_type,
			slug: item.content_slug
		}))

		// Render the email HTML
		const html = await locals.emailService.renderNewsletterEmail({
			subject: campaign.subject,
			introText: campaign.intro_text || undefined,
			items: contentItems
		})

		return new Response(html, {
			headers: {
				'Content-Type': 'text/html'
			}
		})
	} catch (err) {
		if (err instanceof Error && 'status' in err) {
			throw err
		}
		console.error('Error generating preview:', err)
		throw error(500, 'Failed to generate preview')
	}
}
