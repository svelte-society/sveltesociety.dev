<script lang="ts">
import ContentCard from '$lib/ui/ContentCard.svelte'
import type { TagType } from '$lib/ui/Tags.svelte';

// Define a more specific content item type
interface ContentItem {
	id: string | number;
	title: string;
	description?: string;
	type: string;
	published_at?: string;
	likes?: number;
	liked?: boolean;
	saves?: number;
	saved?: boolean;
	tags?: any[];
	slug: string;
	children?: any[];
	rendered_body?: string;
}

let { data } = $props()

// Convert tags to the expected format
function convertTags(tags: any[]): TagType[] {
	if (!Array.isArray(tags)) return [];
	return tags.map(tag => ({
		id: String(tag.id),
		name: String(tag.name),
		slug: String(tag.slug)
	}));
}

// Prepare content data with all required props
const content = data?.content ? {
	id: data.content.id,
	title: data.content.title,
	description: data.content.description,
	type: data.content.type,
	author: "John Doe", // Default author
	published_at: data.content.published_at || "",
	views: 1125, // Default views
	likes: data.content.likes || 0,
	liked: data.content.liked || false,
	saves: data.content.saves || 0,
	saved: data.content.saved || false,
	tags: convertTags((data.content as any).tags || []),
	slug: data.content.slug,
	child_content: Array.isArray((data.content as any).children) ? (data.content as any).children : [],
	rendered_body: (data.content as any).rendered_body
} : null;
</script>

{#if content}
<ContentCard {...content} />
{/if}

AuthorCard goes here
