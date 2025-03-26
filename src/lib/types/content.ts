// Type definitions for content data
import type { TagType } from '$lib/ui/Tags.svelte'

export interface ContentItem {
	id: string | number
	title: string
	description?: string
	type: string
	author?: string
	published_at?: string
	views?: number
	likes?: number
	liked?: boolean
	saves?: number
	saved?: boolean
	tags: TagType[]
	slug: string
	children: ContentItem[]
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
