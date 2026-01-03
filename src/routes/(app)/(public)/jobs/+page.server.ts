import { buildStaticPageMeta } from '$lib/seo'
import type { PageServerLoad } from './$types'

const JOBS_META = buildStaticPageMeta(
	'Svelte Jobs',
	'Find your next Svelte position. Browse full-time, part-time, contract, and remote job opportunities in the Svelte ecosystem.',
	'https://sveltesociety.dev/jobs'
)

export const load: PageServerLoad = async () => {
	return {
		meta: JOBS_META
	}
}
