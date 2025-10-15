import { query, form } from '$app/server'
import { error, redirect } from '@sveltejs/kit'
import { getRequestEvent } from '$app/server'
import { z } from 'zod/v4'
import {
	createSocialTemplateSchema,
	updateSocialTemplateSchema,
	type ContentType,
	type Platform
} from '$lib/schema/social'

export const getTemplates = query(async () => {
	const { locals } = getRequestEvent()
	return locals.socialService.getTemplates()
})

export const getTemplate = query(z.string(), async (id) => {
	const { locals } = getRequestEvent()
	const template = locals.socialService.getTemplateById(id)

	if (!template) error(404, 'Template not found')

	return locals.socialService.getTemplateById(id)
})

export const createTemplate = form(createSocialTemplateSchema, async (data) => {
	const { locals } = getRequestEvent()
	const user = locals.user

	locals.socialService.createTemplate(
		data.content_type,
		data.platform,
		data.template,
		data.is_default,
		user?.id
	)

	redirect(303, '/admin/social/templates')
})

export const updateTemplate = form(updateSocialTemplateSchema, async (data) => {
	const { locals } = getRequestEvent()
	const { id, ...updateData } = data

	const result = locals.socialService.updateTemplate(id, updateData)

	if (!result) {
		throw new Error('Failed to update template')
	}

	redirect(303, '/admin/social/templates')
})

export const deleteTemplate = form(z.object({ id: z.string() }), async (data, invalid) => {
	const { locals } = getRequestEvent()
	const success = locals.socialService.deleteTemplate(data.id)

	if (!success) {
		invalid(invalid.id('Failed to delete template'))
	}

	// Refresh the templates list
	await getTemplates().refresh()
})
