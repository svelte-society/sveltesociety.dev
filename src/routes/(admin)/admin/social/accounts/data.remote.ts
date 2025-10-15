import { query, form } from '$app/server'
import { redirect } from '@sveltejs/kit'
import { getRequestEvent } from '$app/server'
import { z } from 'zod/v4'
import { createSocialAccountSchema, platformSchema } from '$lib/schema/social'
import { AtpAgent } from '@atproto/api'

export const getAccounts = query(async () => {
	const { locals } = getRequestEvent()
	return locals.socialService.getAccounts()
})

export const addAccount = form(
	z.object({
		platform: platformSchema,
		account_name: z.string().min(1, 'Display name is required'),
		account_handle: z.string().min(1, 'Handle is required'),
		identifier: z.string().min(1, 'Identifier is required'),
		password: z.string().min(1, 'App password is required'),
		is_default: z.boolean().optional()
	}),
	async (data, invalid) => {
		const { locals } = getRequestEvent()
		const user = locals.user

		// Test connection first
		if (data.platform === 'bluesky') {
			try {
				const agent = new AtpAgent({ service: 'https://bsky.social' })
				await agent.login({
					identifier: data.identifier,
					password: data.password
				})
			} catch (error: any) {
				invalid(invalid.identifier('Failed to connect to BlueSky. Please check your credentials.'))
				return
			}
		}

		// Store credentials as JSON
		const credentials = JSON.stringify({
			identifier: data.identifier,
			password: data.password
		})

		try {
			locals.socialService.createAccount({
				platform: data.platform,
				account_name: data.account_name,
				account_handle: data.account_handle,
				credentials: credentials,
				is_active: true,
				is_default: data.is_default || false,
				created_by: user?.id
			})
		} catch (error: any) {
			invalid(invalid.platform('Failed to save account'))
			return
		}

		redirect(303, '/admin/social/accounts')
	}
)

export const deleteAccount = form(z.object({ id: z.string() }), async (data, invalid) => {
	const { locals } = getRequestEvent()
	const success = locals.socialService.deleteAccount(data.id)

	if (!success) {
		invalid(invalid.id('Failed to delete account'))
	}

	// Refresh accounts list
	await getAccounts().refresh()
})

export const toggleAccountActive = form(
	z.object({
		id: z.string(),
		is_active: z.boolean()
	}),
	async (data) => {
		const { locals } = getRequestEvent()

		// Update account (we'll need to add this method to the service)
		// For now, we'll just refresh
		// TODO: Add updateAccount method to SocialService

		await getAccounts().refresh()
	}
)
