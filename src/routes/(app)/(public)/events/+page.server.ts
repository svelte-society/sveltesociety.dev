import { buildStaticPageMeta } from '$lib/seo'
import type { PageServerLoad } from './$types'

const EVENTS_META = buildStaticPageMeta(
	'Events',
	'Join us at upcoming Svelte Society events, meetups, and workshops',
	'https://sveltesociety.dev/events'
)

export const load: PageServerLoad = async () => {
	return { meta: EVENTS_META }
}
