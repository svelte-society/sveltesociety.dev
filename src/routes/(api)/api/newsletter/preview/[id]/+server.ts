import { error } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import type {
	ContentHighlightsCampaignWithItems,
	AnnouncementCampaign,
	JobsRoundupCampaignWithItems
} from '$lib/server/services/newsletter-types'

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

		// Render the email HTML based on campaign type
		let html: string

		switch (campaign.campaign_type) {
			case 'content_highlights': {
				const c = campaign as ContentHighlightsCampaignWithItems
				html = await locals.emailService.renderNewsletterEmail({
					subject: c.subject,
					introText: c.type_data.intro_text || undefined,
					items: c.type_data.items.map((item) => ({
						title: item.title,
						description: item.custom_description || item.description || '',
						type: item.type,
						slug: item.slug,
						image: item.image
					}))
				})
				break
			}
			case 'announcement': {
				const c = campaign as AnnouncementCampaign
				html = await locals.emailService.renderAnnouncementEmail({
					subject: c.subject,
					bodyHtml: c.type_data.body_html,
					ctaText: c.type_data.cta_text || undefined,
					ctaUrl: c.type_data.cta_url || undefined
				})
				break
			}
			case 'jobs_roundup': {
				const c = campaign as JobsRoundupCampaignWithItems
				html = await locals.emailService.renderJobsRoundupEmail({
					subject: c.subject,
					introText: c.type_data.intro_text || undefined,
					jobs: c.type_data.jobs.map((job) => ({
						id: job.id,
						title: job.title,
						description: job.description,
						slug: job.slug,
						metadata: job.metadata
					}))
				})
				break
			}
		}

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
