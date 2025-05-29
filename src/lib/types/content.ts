import { typeSchema, contentSchema, updateContentSchema } from '$lib/schema/content'
import type { TagType } from '$lib/ui/Tags.svelte'
import { z } from 'zod'

export type Type = z.infer<typeof typeSchema>

export type Content = z.infer<typeof contentSchema>
export type UpdateContent = z.infer<typeof updateContentSchema>

// Extended content type with author information
export interface ContentWithAuthor extends Content {
	author_id?: string
	author_username?: string
	author_name?: string
}

// Content filtering options
export interface ContentFilters {
	type?: string
	tags?: string | string[]
	search?: string
	status?: string
	limit?: number
	offset?: number
	sort?: 'latest' | 'oldest' | 'popular'
}

// Helper function to convert tags to TagType
export function convertTags(tags: unknown[]): TagType[] {
	if (!Array.isArray(tags)) return []
	return tags.map((tag) => {
		const t = tag as { id?: unknown; name?: unknown; slug?: unknown }
		return {
			id: String(t.id ?? ''),
			name: String(t.name ?? ''),
			slug: String(t.slug ?? '')
		}
	})
}
