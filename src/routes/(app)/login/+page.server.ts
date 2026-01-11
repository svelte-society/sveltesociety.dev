import type { PageServerLoad } from './$types'
import { dev } from '$app/environment'
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private'

export const load: PageServerLoad = async ({ url }) => {
	const oauthConfigured = Boolean(GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET)

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
