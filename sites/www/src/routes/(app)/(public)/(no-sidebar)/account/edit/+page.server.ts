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

	const form = await superValidate(locals.user, zod(schema))
	return { form }
}

export const actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod(schema))
		if (!form.valid) {
			return fail(400, { form })
		}
		try {
			await create_or_update_user({ id: locals.user.id, login: form.data.username, ...form.data })
			return message(form, 'Profile updated successfully.')
		} catch (error) {
			return message(form, 'Failed to update profile.', { status: 500 })
		}
	}
}
