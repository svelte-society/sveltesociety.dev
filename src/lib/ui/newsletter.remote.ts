import { form, getRequestEvent } from '$app/server'
import { redirect } from '@sveltejs/kit'
import { dev } from '$app/environment'
import { z } from 'zod/v4'

const subscribeSchema = z.object({
	email: z.email('Please enter a valid email address')
})

const BASE_URL = dev ? 'http://localhost:5173' : 'https://sveltesociety.dev'

export const subscribeNewsletter = form(subscribeSchema, async (data) => {
	const { locals } = getRequestEvent()
	const email = data.email.toLowerCase().trim()

	// 1. Check if already subscribed in Plunk (silent success - don't reveal this)
	const existingContact = await locals.emailService.getContact(email)
	if (existingContact?.subscribed) {
		// Already subscribed - return success to prevent email enumeration
		return { success: true }
	}

	// 2. Create/update pending subscription with new token
	// Pass user ID if logged in, so we can update their plunk_contact_id after confirmation
	const { token } = locals.newsletterService.createPendingSubscription(email, locals.user?.id)

	// 3. Send confirmation email
	const emailSent = await locals.emailService.sendNewsletterConfirmationEmail({
		email,
		token,
		baseUrl: BASE_URL
	})

	if (!emailSent) {
		console.error('Failed to send confirmation email to:', email)
		return { success: false, text: 'Failed to send confirmation email. Please try again.' }
	}

	// 4. Opportunistically clean up expired tokens
	locals.newsletterService.cleanupExpired()

	// 5. If user is logged in, mark them as subscribed immediately
	// This prevents the modal from reappearing while they confirm their email
	if (locals.user) {
		locals.userService.updateNewsletterPreference(locals.user.id, 'subscribed')
	}

	return { success: true }
})

export const userDecline = form(z.object({}), async () => {
	const { locals } = getRequestEvent()

	if (!locals.user) {
		return { success: false, text: 'You must be logged in' }
	}

	const updated = locals.userService.updateNewsletterPreference(locals.user.id, 'declined')
	return {
		success: updated,
		text: updated ? 'Preference saved' : 'Failed to save preference'
	}
})
