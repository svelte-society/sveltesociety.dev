import { buildStaticPageMeta } from '$lib/seo'
import type { PageServerLoad } from './$types'

const SPONSORS_META = buildStaticPageMeta(
	'Become a Sponsor',
	'Support the Svelte community and reach thousands of developers. Sponsor Svelte Society with flexible plans.',
	'https://sveltesociety.dev/sponsors'
)

export const load: PageServerLoad = async () => {
	return {
		meta: SPONSORS_META
	}
}
