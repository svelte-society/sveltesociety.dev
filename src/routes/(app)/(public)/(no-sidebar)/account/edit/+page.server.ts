// sites/www/src/routes/(app)/(account)/account/edit/+page.server.ts
import { z } from 'zod'
import { superValidate, message } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { fail, redirect } from '@sveltejs/kit'
import { create_or_update_user } from '$lib/server/db/user'

const schema = z.object({
	name: z.string().optional(),
	username: z.string().min(3, 'Username must be at least 3 characters long'),
	bio: z.string().optional(),
	location: z.string().optional(),
	twitter: z.string().optional()
})

export const load = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login')
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
		if (!locals.user) {
			throw redirect(302, '/login')
		}

		const form = await superValidate(request, zod(schema))
		if (!form.valid) {
			return fail(400, { form })
		}
		try {
			// Convert string ID to number for GitHub API
			const githubId = parseInt(locals.user.id);
			await create_or_update_user({ 
				id: githubId, 
				login: form.data.username, 
				...form.data 
			})
			return message(form, 'Profile updated successfully.')
		} catch (error) {
			return message(form, 'Failed to update profile.', { status: 500 })
		}
	}
}
