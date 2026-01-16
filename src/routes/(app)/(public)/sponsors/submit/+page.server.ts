import { buildStaticPageMeta } from '$lib/seo'
import type { PageServerLoad } from './$types'

const SUBMIT_META = buildStaticPageMeta(
	'Become a Sponsor',
	'Support the Svelte community and get your brand in front of thousands of developers.',
	'https://sveltesociety.dev/sponsors/submit'
)

export const load: PageServerLoad = async () => {
	return {
		meta: SUBMIT_META
	}
}
