import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params }) => {
	// Redirect /job/[slug] to /jobs/[slug] for consistency
	redirect(301, `/jobs/${params.slug}`)
}
