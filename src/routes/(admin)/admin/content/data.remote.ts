import { query, form } from '$app/server'
import { getRequestEvent } from '$app/server'
import { z } from 'zod/v4'
import { checkAdminAuth } from '../authorization.remote'

const contentFiltersSchema = z.object({
	type: z.enum(['video', 'library', 'announcement', 'collection', 'recipe', 'resource']).optional(),
	status: z.enum(['draft', 'pending_review', 'published', 'archived', 'all']).default('all'),
	search: z.string().optional(),
	page: z.number().int().positive().default(1),
	perPage: z.number().int().positive().default(50)
})

const contentIdSchema = z.object({
	id: z.string().min(1, 'Content ID is required')
})

export const getFilteredContent = query(contentFiltersSchema, async (filters) => {
	const { locals } = getRequestEvent()
	const { page, perPage, search, type, status } = filters

	const offset = (page - 1) * perPage

	// Use Orama search for admin content listing (pending_review first, then by created_at)
	const results = locals.searchService.searchAdmin({
		query: search,
		type,
		status,
		limit: perPage,
		offset
	})

	// Map Orama results to content format expected by the UI
	const content = results.hits.map((hit) => ({
		id: hit.document.id,
		title: hit.document.title,
		description: hit.document.description,
		type: hit.document.type,
		status: hit.document.status,
		created_at: hit.document.created_at,
		tags: hit.document.tags
	}))

	return {
		content,
		pagination: {
			count: results.count,
			perPage,
			currentPage: page
		}
	}
})

const REFRESHABLE_TYPES = ['video', 'library', 'resource'] as const

export const refreshMetadata = form(contentIdSchema, async (data) => {
	checkAdminAuth()
	const { locals, url } = getRequestEvent()

	try {
		const content = locals.contentService.getContentById(data.id)
		if (!content) {
			return {
				success: false,
				text: 'Content not found.'
			}
		}

		if (!REFRESHABLE_TYPES.includes(content.type as (typeof REFRESHABLE_TYPES)[number])) {
			return {
				success: false,
				text: `Content type "${content.type}" does not support metadata refresh.`
			}
		}

		await locals.metadataService.refreshMetadataForContent(content)

		return {
			success: true,
			text: 'Metadata and thumbnail refreshed successfully!'
		}
	} catch (error) {
		console.error('Error refreshing metadata:', error)
		return {
			success: false,
			text: 'An error occurred while refreshing metadata.'
		}
	}
})

export const deleteContent = form(contentIdSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	try {
		const success = locals.contentService.deleteContent(data.id)

		if (!success) {
			return {
				success: false,
				text: 'Content not found or could not be deleted.'
			}
		}

		return {
			success: true,
			text: 'Content deleted successfully!'
		}
	} catch (error) {
		console.error('Error deleting content:', error)
		return {
			success: false,
			text: 'An error occurred while deleting the content.'
		}
	}
})
