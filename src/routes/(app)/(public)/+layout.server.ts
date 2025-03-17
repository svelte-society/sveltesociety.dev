import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals }) => {
	const tags = locals.tagService.getTags({ limit: 100 }) // Get up to 100 tags for the sidebar
	
	return {
		tags
	}
}
