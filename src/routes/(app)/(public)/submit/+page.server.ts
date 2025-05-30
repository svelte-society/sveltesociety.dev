import { superValidate, message } from 'sveltekit-superforms/server'
import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { zod } from 'sveltekit-superforms/adapters'
import { schema } from './schema'

export const load = (async ({ locals, url }) => {
	// Require authentication to access submit page
	if (!locals.user) {
		throw redirect(302, '/login?redirectTo=' + encodeURIComponent(url.pathname))
	}

	// Get all available tags for the form
	const tags = locals.tagService.getTags({ limit: 50 })

	// Create the form using Superforms with the zod adapter and default to recipe type
	const form = await superValidate({ type: 'recipe' }, zod(schema))

	return {
		form,
		tags,
		meta: {
			title: 'Submit Content - Svelte Society',
			description: 'Submit your Svelte content to the Svelte Society community',
			url: url.toString()
		}
	}
}) satisfies PageServerLoad

export const actions = {
	submit: async ({ request, locals }) => {
		// Require authentication for form submission
		if (!locals.user) {
			return fail(401, {
				error: 'Authentication required',
				message: 'You must be logged in to submit content.'
			})
		}

		const form = await superValidate(request, zod(schema))

		// Validate the form data
		if (!form.valid) {
			return fail(400, { form })
		}

		try {
			// Prepare submission data with authenticated user
			const submissionData = {
				type: 'content',
				title: form.data.title,
				data: JSON.stringify(form.data),
				submitted_by: locals.user.id
			}

			// Add to moderation queue
			const submissionId = locals.moderationService.addToModerationQueue(submissionData)

			// Return success message
			return {
				form,
				success: true,
				message: 'Your submission has been received and is pending moderation.'
			}
		} catch (error) {
			console.error('Error adding content to moderation queue:', error)
			return message(form, {
				type: 'error',
				text: 'There was an error processing your submission. Please try again.'
			})
		}
	}
} satisfies Actions
