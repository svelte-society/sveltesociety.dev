import { form, getRequestEvent, query } from '$app/server'
import { error, redirect } from '@sveltejs/kit'
import { createTagSchema, updateTagSchema, deleteTagSchema } from '$lib/schema/tags'
import { checkAdminAuth } from '../authorization.remote'
import { z } from 'zod/v4'

export const getTags = query(() => {
	checkAdminAuth()
	const { locals } = getRequestEvent()
	return locals.tagService.getAllTags()
})

export const getTagById = query(z.string(), (id: string) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()
	const tag = locals.tagService.getTag(id)
	if (!tag) error(404, 'Tag not found')
	return tag
})

export const createTag = form(createTagSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()
	locals.tagService.createTag(data)
	redirect(303, '/admin/tags')
})

export const updateTag = form(updateTagSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()
	locals.tagService.updateTag(data)
	redirect(303, '/admin/tags')
})

export const deleteTag = form(deleteTagSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()
	locals.tagService.deleteTag(data.id)
	return { success: true, text: 'Tag deleted successfully!' }
})
