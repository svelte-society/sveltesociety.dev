import type { PageServerLoad } from './$types'
import { dev } from '$app/environment'
import { env } from '$env/dynamic/private'

export const load: PageServerLoad = async ({ url }) => {
	const oauthConfigured = Boolean(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET)

	const authProviders = oauthConfigured
		? [{ name: 'GitHub', icon: 'github', color: 'bg-slate-900 text-white' }]
		: []

	return {
		authProviders,
		showDevLogin: dev,
		oauthConfigured,
		meta: {
			title: 'Login - Svelte Society',
			description: 'Log in to your Svelte Society account',
			url: url.toString()
		}
	}
}
