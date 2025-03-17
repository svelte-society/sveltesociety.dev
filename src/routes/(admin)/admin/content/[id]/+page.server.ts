import { superValidate, message } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import type { Content } from '$lib/server/db/content'
import { Status } from '$lib/server/db/common'

import { schema } from './schema'

export const load: PageServerLoad = async ({ params, locals }) => {
	const all_tags = locals.tagService.getTags()
	if (!all_tags) {
		fail(400, { message: 'Error getting tags' })
	}
	
	// Initialize with undefined for new content
	let formData = undefined;

	const contentId = params.id

	if (contentId !== 'new') {
		const res_content = locals.contentService.getContentById(contentId)
		
		// Get tags for content using a direct query for now
		const tagsStmt = locals.db.prepare(`
			SELECT t.id FROM tags t
			JOIN content_to_tags ctt ON t.id = ctt.tag_id
			WHERE ctt.content_id = ?
		`)
		const res_content_tags = tagsStmt.all(contentId) as {id: string}[]
		
		if (!res_content || !res_content_tags) {
			redirect(302, '/admin/content')
		}

		// Create a properly typed form data object
		formData = {
			title: res_content.title,
			type: res_content.type as "recipe" | "video" | "library" | "announcement" | "showcase",
			body: res_content.content, // Adjust field name if needed
			slug: res_content.slug,
			description: res_content.description,
			tags: res_content_tags.map((i) => i.id),
			status: res_content.status === Status.PUBLISHED ? 'published' as const : 'draft' as const,
			metadata: res_content.metadata || { videoId: '', npm: '' }
		};
	}

	const form = await superValidate(formData, zod(schema), {})
	return {
		form,
		tags: all_tags
	}
}

export const actions: Actions = {
	default: async ({ params, request, locals }) => {
		const form = await superValidate(request, zod(schema))
		if (!form.valid) {
			return fail(400, { form })
		}

		try {
			if (params.id === 'new') {
				// Create new content
				const insertStmt = locals.db.prepare(`
					INSERT INTO content (title, type, content, slug, description, status, metadata)
					VALUES (?, ?, ?, ?, ?, ?, ?)
					RETURNING id
				`)
				
				const result = insertStmt.get(
					form.data.title,
					form.data.type,
					form.data.body,
					form.data.slug,
					form.data.description,
					form.data.status,
					JSON.stringify(form.data.metadata)
				) as { id: string } | undefined
				
				if (result?.id) {
					// Add tags if present
					if (form.data.tags.length > 0) {
						const tagStmt = locals.db.prepare(`
							INSERT INTO content_to_tags (content_id, tag_id)
							VALUES (?, ?)
						`)
						
						for (const tagId of form.data.tags) {
							tagStmt.run(result.id, tagId)
						}
					}
				}
			} else {
				// Update existing content
				const updateStmt = locals.db.prepare(`
					UPDATE content
					SET title = ?, type = ?, content = ?, slug = ?, description = ?, status = ?, metadata = ?
					WHERE id = ?
				`)
				
				updateStmt.run(
					form.data.title,
					form.data.type,
					form.data.body,
					form.data.slug,
					form.data.description,
					form.data.status,
					JSON.stringify(form.data.metadata),
					params.id
				)
				
				// Update tags: first delete existing, then add new ones
				const deleteTagsStmt = locals.db.prepare(`
					DELETE FROM content_to_tags
					WHERE content_id = ?
				`)
				deleteTagsStmt.run(params.id)
				
				if (form.data.tags.length > 0) {
					const tagStmt = locals.db.prepare(`
						INSERT INTO content_to_tags (content_id, tag_id)
						VALUES (?, ?)
					`)
					
					for (const tagId of form.data.tags) {
						tagStmt.run(params.id, tagId)
					}
				}
			}
			
			redirect(302, '/admin/content')
		} catch (error) {
			return message(form, 'Failed to save content.')
		}
	}
}
