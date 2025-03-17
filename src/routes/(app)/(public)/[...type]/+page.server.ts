import { filter_content_schema } from '$lib/server/filter'
import { fail, error } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import type { PageServerLoad } from './$types'

const VALID_TYPES = ['recipe', 'video', 'library', 'announcement', 'showcase', 'link', 'blog', 'collection'] as const

export const load: PageServerLoad = async ({ url, locals, params }) => {
	const { type } = params
	
	// Allow empty type for showing all content, otherwise validate the type
	if (type && !VALID_TYPES.includes(type as any)) {
		throw error(404, {
			message: `Invalid content type "${type}". Valid types are: ${VALID_TYPES.join(', ')}`
		})
	}

	// Get tags from query params - support both ?tags=tag1,tag2 and ?tags=tag1&tags=tag2 formats
	const tagsParam = url.searchParams.getAll('tags')
	const tags = tagsParam.length > 0 
		? tagsParam.flatMap(t => t.split(',').map(tag => tag.trim())).filter(Boolean)
		: undefined

	const filters = await superValidate(url, zod(filter_content_schema))
	const start = performance.now()

	let content = []
	let count = 0

	if (filters.valid) {
		content = locals.contentService.getFilteredContent({
			...filters.data,
			...(type && { type }),
			...(tags && { tags }),
			limit: 50
		})
		count = locals.contentService.getFilteredContentCount({ 
			...filters.data, 
			...(type && { type }),
			...(tags && { tags })
		})
	} else {
		content = locals.contentService.getFilteredContent({ 
			...(type && { type }), 
			...(tags && { tags }),
			limit: 50 
		})
		count = locals.contentService.getFilteredContentCount({
			...(type && { type }),
			...(tags && { tags })
		})
	}

	const end = performance.now()
	console.log('Load function: ', end - start)

	return {
		content,
		count,
		type,
		tags
	}
}

export const actions = {
	interact: async ({ request, locals }) => {
		if (!locals.user) return
		const data = await request.formData()
		const type = data.get('type') as 'like' | 'save'
		const contentId = (data.get('id') as string) || null
		const action = data.get('action') as 'add' | 'remove'

		if (!['like', 'save'].includes(type) || !['add', 'remove'].includes(action) || !contentId) {
			return fail(400, { message: 'Invalid input' })
		}

		try {
			if (action === 'add') {
				locals.interactionsService.addInteraction(type, locals.user.id, contentId)
			} else {
				locals.interactionsService.removeInteraction(type, locals.user.id, contentId)
			}
			return { success: true }
		} catch (error) {
			return fail(500, { message: 'Server error' })
		}
	}
}
