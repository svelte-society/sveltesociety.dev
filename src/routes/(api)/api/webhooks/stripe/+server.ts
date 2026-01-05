import { json, text } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request, locals }) => {
	const signature = request.headers.get('stripe-signature')

	if (!signature) {
		return json({ error: 'Missing stripe-signature header' }, { status: 400 })
	}

	const payload = await request.text()

	let event
	try {
		event = locals.stripeService.constructWebhookEvent(payload, signature)
	} catch (err) {
		console.error('Webhook signature verification failed:', err)
		return json({ error: 'Webhook signature verification failed' }, { status: 400 })
	}

	// Handle the event
	switch (event.type) {
		case 'checkout.session.completed': {
			const session = event.data.object
			const paymentId = session.metadata?.payment_id

			if (paymentId) {
				try {
					// Update payment status
					locals.paymentService.updatePaymentStatus(paymentId, 'succeeded')

					// Update payment intent ID
					const paymentIntentId =
						typeof session.payment_intent === 'string'
							? session.payment_intent
							: session.payment_intent?.id

					if (paymentIntentId) {
						locals.paymentService.updatePaymentIntentId(paymentId, paymentIntentId)
					}

					console.log(`Payment ${paymentId} completed via webhook`)
				} catch (error) {
					console.error('Error processing checkout.session.completed:', error)
				}
			}
			break
		}

		case 'payment_intent.succeeded': {
			const paymentIntent = event.data.object
			console.log(`Payment intent ${paymentIntent.id} succeeded`)
			// Additional processing if needed
			break
		}

		case 'payment_intent.payment_failed': {
			const paymentIntent = event.data.object
			const paymentId = paymentIntent.metadata?.payment_id

			if (paymentId) {
				try {
					locals.paymentService.updatePaymentStatus(paymentId, 'failed')
					console.log(`Payment ${paymentId} failed via webhook`)
				} catch (error) {
					console.error('Error processing payment_intent.payment_failed:', error)
				}
			}
			break
		}

		case 'charge.refunded': {
			const charge = event.data.object
			const paymentIntentId = charge.payment_intent

			if (typeof paymentIntentId === 'string') {
				// Find payment by payment intent ID and mark as refunded
				const payment = locals.paymentService.getPaymentByPaymentIntentId(paymentIntentId)

				if (payment) {
					locals.paymentService.updatePaymentStatus(payment.id, 'refunded')

					// Archive the job since payment was refunded
					if (payment.content_id) {
						locals.contentService.updateStatus(payment.content_id, 'archived')
					}

					console.log(`Payment ${payment.id} refunded via webhook`)
				}
			}
			break
		}

		default:
			// Unhandled event type
			console.log(`Unhandled event type: ${event.type}`)
	}

	return text('OK', { status: 200 })
}
