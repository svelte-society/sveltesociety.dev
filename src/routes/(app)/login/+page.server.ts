import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
	// Hard-coded OAuth providers
	const authProviders = [{ name: 'GitHub', icon: 'github', color: 'bg-slate-900 text-white' }]

	return {
		authProviders,
		meta: {
			title: 'Login - Svelte Society',
			description: 'Log in to your Svelte Society account',
			url: url.toString()
		}
	}
}
