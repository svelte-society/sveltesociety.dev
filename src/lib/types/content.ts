// Type definitions for content data
import type { TagType } from '$lib/ui/Tags.svelte'
import { z } from 'zod'
import { TagSchema } from './tags'


const TypeSchema = z.enum(['recipe', 'video', 'library', 'announcement', 'showcase', 'collection'])

export type Type = z.infer<typeof TypeSchema>

const ContentSchema = z.object({
	id: z.string(),
	title: z.string(),
	slug: z.string(),
	description: z.string(),
	type: TypeSchema,
	status: z.string(),
	content: z.string(),
	body: z.string(),
	rendered_body: z.string(),
	author: z.string(),
	tags: z.array(TagSchema),
	created_at: z.string(),
	updated_at: z.string(),
	published_at: z.string().nullable(),
	likes: z.number(),
	saves: z.number(),
	liked: z.boolean(),
	saved: z.boolean(),
	children: z.array(z.string()),
	views: z.number()
})

export type Content = z.infer<typeof ContentSchema>

const CollectionSchema = ContentSchema.extend({
	type: z.literal('collection'),
	children: z.array(ContentSchema)
})

export type Collection = z.infer<typeof CollectionSchema>

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
