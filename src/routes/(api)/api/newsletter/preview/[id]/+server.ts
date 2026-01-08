import { error } from '@sveltejs/kit'
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
		// Get campaign with enriched items
		const campaign = locals.newsletterService.getCampaignWithItems(campaignId)
		if (!campaign) {
			throw error(404, 'Campaign not found')
		}

		// Render the email HTML
		const html = await locals.emailService.renderNewsletterEmail({
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
