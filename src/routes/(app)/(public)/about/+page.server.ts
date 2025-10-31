import type { PageServerLoad } from './$types'
import { buildStaticPageMeta } from '$lib/seo'

export const load: PageServerLoad = async ({ url }) => {
	return {
		meta: buildStaticPageMeta(
			'About',
			'Learn about Svelte Society, a community-driven organization dedicated to promoting and supporting the Svelte framework',
			url.toString()
		)
	}
}
