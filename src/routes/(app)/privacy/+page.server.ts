import type { PageServerLoad } from './$types'
import { buildStaticPageMeta } from '$lib/seo'

export const load: PageServerLoad = async ({ url }) => {
	return {
		meta: buildStaticPageMeta(
			'Privacy Policy',
			'Privacy Policy for the Svelte Society website and community resources',
			url.toString()
		)
	}
}
