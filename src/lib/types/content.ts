import { typeSchema, contentSchema, updateContentSchema } from '$lib/schema/content'
import type { TagType } from '$lib/ui/Tags.svelte'
import { z } from 'zod'

export type Type = z.infer<typeof typeSchema>

export type Content = z.infer<typeof contentSchema>
export type UpdateContent = z.infer<typeof updateContentSchema>

// Props for the ContentCard component
export interface ContentCardProps {
	id: string
	title: string
	description?: string
	rendered_body?: string
	type: string
	author: string
	published_at: string
	views: number
	likes: number
	liked: boolean
	saves: number
	saved: boolean
	tags: TagType[]
	slug: string
	children: Content[]
}

// Reduced version of Content for previews
export type PreviewContent = Omit<Content, 'content' | 'body'>;

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
