import { buildStaticPageMeta } from '$lib/seo'
import type { PageServerLoad } from './$types'

const SUBMIT_META = buildStaticPageMeta(
	'Post a Job',
	'Reach thousands of Svelte developers. Post your job listing and find the perfect candidate.',
	'https://sveltesociety.dev/jobs/submit'
)

export const load: PageServerLoad = async () => {
	return {
		meta: SUBMIT_META
	}
}
