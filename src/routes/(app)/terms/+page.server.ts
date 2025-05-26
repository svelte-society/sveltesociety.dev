import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
	return {
		meta: {
			title: 'Terms of Service - Svelte Society',
			description: 'Terms of Service for the Svelte Society website and community resources',
			url: url.toString()
		}
	}
}
