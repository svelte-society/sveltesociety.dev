// Type definitions for content data
import type { TagType } from '$lib/ui/Tags.svelte'

export type Type = 'recipe' | 'video' | 'library' | 'announcement' | 'showcase' | 'collection'

// Base Content interface used throughout the application
export interface Content {
	id: string
	title: string
	slug: string
	description: string
	type: Type
	status: string
	content?: string
	body?: string
	rendered_body?: string
	author?: string
	tags?: Array<{ id: string; name: string; slug: string; color: string }> | TagType[]
	created_at?: string
	updated_at?: string
	published_at: string | null
	likes?: number
	saves?: number
	liked?: boolean
	saved?: boolean
	children?: Content[]
	views?: number
}

// Collection-specific content interface
export interface CollectionContent extends Content {
	type: 'collection'
	children: Content[]
}

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
