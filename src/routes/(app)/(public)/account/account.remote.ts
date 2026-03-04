import { z } from 'zod/v4'
import { redirect } from '@sveltejs/kit'
import { getRequestEvent, query, form } from '$app/server'

export const getAccountData = query(async () => {
	const { locals } = getRequestEvent()

	if (!locals.user) {
		redirect(303, '/login')
	}

	const user = locals.user

	return {
		id: user.id,
		username: user.username,
		email: user.email,
		name: user.name,
		avatar_url: user.avatar_url,
		bio: user.bio,
		location: user.location,
		twitter: user.twitter,
		newsletter_preference: user.newsletter_preference,
		plunk_contact_id: user.plunk_contact_id,
		created_at: user.created_at
	}
})

export const updateProfile = form(
	z.object({
		name: z.string().optional().default(''),
		bio: z.string().optional().default(''),
		location: z.string().optional().default(''),
		twitter: z.string().optional().default('')
	}),
	async ({ name, bio, location, twitter }) => {
		const { locals } = getRequestEvent()

		if (!locals.user) {
			redirect(303, '/login')
		}

		const updated = locals.userService.updateUser(locals.user.id, {
			name: name || null,
			bio: bio || null,
			location: location || null,
			twitter: twitter || null
		} as any)

		if (!updated) {
			return { success: false, message: 'Failed to update profile' }
		}

		await getAccountData().refresh()

		return { success: true, message: 'Profile updated' }
	}
)
