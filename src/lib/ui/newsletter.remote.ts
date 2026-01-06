import { form, getRequestEvent } from '$app/server'
import { dev } from '$app/environment'
import { z } from 'zod/v4'

const subscribeSchema = z.object({
  email: z.email('Please enter a valid email address')
})

const BASE_URL = dev ? 'http://localhost:5173' : 'https://sveltesociety.dev'

export const subscribeNewsletter = form(subscribeSchema, async (data) => {
  const { locals } = getRequestEvent()
  const email = data.email.toLowerCase().trim()

  // SECURITY: Always return the same success message to prevent email enumeration
  // This applies whether:
  // - Email is new (create pending, send confirmation)
  // - Email already pending (refresh token, resend confirmation)
  // - Email already confirmed in Plunk (do nothing)

  try {
    // 1. Check if already subscribed in Plunk (silent - don't reveal this)
    const existingContact = await locals.emailService.getContact(email)
    if (existingContact?.subscribed) {
      // Already subscribed - return success without doing anything
      // This prevents email enumeration
      return {
        success: true,
        text: 'Check your email to confirm your subscription!'
      }
    }

    // 2. Create/update pending subscription with new token
    const { token } = locals.newsletterService.createPendingSubscription(email)

    // 3. Build confirmation URL with token in path
    const confirmationUrl = `${BASE_URL}/newsletter/confirm/${token}`

    // 4. Send confirmation email
    const emailSent = await locals.emailService.sendNewsletterConfirmationEmail({
      email,
      token,
      baseUrl: BASE_URL
    })

    if (!emailSent) {
      console.error('Failed to send confirmation email to:', email)
      // Still return success to prevent email enumeration
      // But log for debugging
    }

    // 5. Opportunistically clean up expired tokens
    locals.newsletterService.cleanupExpired()

    return {
      success: true,
      text: 'Check your email to confirm your subscription!'
    }
  } catch (error) {
    console.error('Error in newsletter subscription:', error)
    // Return generic error - don't expose details
    return {
      success: false,
      text: 'Something went wrong. Please try again.'
    }
  }
})
