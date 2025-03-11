// sites/www/src/routes/(app)/(account)/account/edit/+page.server.ts
import { z } from 'zod'
import { superValidate, message } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { fail, redirect } from '@sveltejs/kit'
import { update_user } from '$lib/server/db/user'

const schema = z.object({
	name: z.string().optional(),
	username: z.string().min(3, 'Username must be at least 3 characters long'),
	bio: z.string().optional(),
	location: z.string().optional(),
	twitter: z.string().optional()
})

export const load = async ({ locals }) => {
	// Check if user is logged in
	if (!locals.user) {
		redirect(302, '/login')
	}

	// Convert null values to undefined to match schema expectations
	const userData = {
		...locals.user,
		name: locals.user.name || undefined,
		bio: locals.user.bio || undefined,
		location: locals.user.location || undefined,
		twitter: locals.user.twitter || undefined
	}

	const form = await superValidate(userData, zod(schema))
	return { form }
}

export const actions = {
	default: async ({ request, locals }) => {
		// Check if user is logged in
		if (!locals.user) {
			redirect(302, '/login')
		}

		const form = await superValidate(request, zod(schema))
		if (!form.valid) {
			return fail(400, { form })
		}

		try {
			// Use the update_user function to update the user's information
			const updatedUser = await update_user(locals.user.id, { 
				username: form.data.username,
				name: form.data.name || null,
				bio: form.data.bio || null,
				location: form.data.location || null,
				twitter: form.data.twitter || null
			})

			if (!updatedUser) {
				return message(form, 'Failed to update profile.', { status: 500 })
			}

			// Redirect to the accounts page after successful update
			redirect(303, '/account')
		} catch (error) {
			// Check if the error is a redirect (which we threw intentionally)
			if (error instanceof Response && error.status === 303) {
				throw error;
			}
			
			console.error('Error updating user profile:', error)
			return message(form, 'Failed to update profile.', { status: 500 })
		}
	}
}
