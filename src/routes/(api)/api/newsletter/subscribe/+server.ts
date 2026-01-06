import { error, json } from '@sveltejs/kit'
import { z } from 'zod'
import type { RequestHandler } from './$types'

const SubscribeSchema = z.object({
	email: z.string().email('Please enter a valid email address')
})

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const body = await request.json()
		const result = SubscribeSchema.safeParse(body)

		if (!result.success) {
			return json(
				{
					success: false,
					error: result.error.errors[0]?.message || 'Invalid email'
				},
				{ status: 400 }
			)
		}

		const { email } = result.data
		const response = await locals.emailService.subscribeContact(email)

		if (!response.success) {
			return json(
				{
					success: false,
					error: 'Failed to subscribe. Please try again later.'
				},
				{ status: 500 }
			)
		}

		return json({
			success: true,
			message: 'Successfully subscribed! Please check your email to confirm.'
		})
	} catch (err) {
		console.error('Error subscribing to newsletter:', err)
		throw error(500, 'Internal server error')
	}
}
