import {
	typeSchema,
	contentSchema,
	updateContentSchema,
	createContentSchema
} from '$lib/schema/content'
import type { TagType } from '$lib/ui/Tags.svelte'
import { z } from 'zod/v4'

export type Type = z.infer<typeof typeSchema>

export type Content = z.infer<typeof contentSchema>
export type UpdateContent = z.infer<typeof updateContentSchema>
export type CreateContent = z.infer<typeof createContentSchema>

// Content with author information
// Note: Schema has tags as string[] (tag IDs for forms),
// but runtime DB results have full Tag objects - type assertions used where needed
// The 'children' property is overridden from string[] to ContentWithAuthor[] for expanded collections
export type ContentWithAuthor = Omit<Content, 'children'> & {
	author_id?: string
	author_username?: string
	author_name?: string
	children?: string[] | ContentWithAuthor[] // Can be IDs or expanded objects
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
