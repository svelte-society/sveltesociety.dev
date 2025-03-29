<script lang="ts">
	import ContentCard from '$lib/ui/ContentCard.svelte'
	import { convertTags } from '$lib/types/content'

	let { data } = $props()

	// Prepare content data with all required props
	const content = data?.content
		? {
				id: data.content.id,
				title: data.content.title,
				description: data.content.description,
				type: data.content.type,
				author: 'John Doe', // Default author
				published_at: data.content.published_at || '',
				views: 1125, // Default views
				likes: data.content.likes || 0,
				liked: data.content.liked || false,
				saves: data.content.saves || 0,
				saved: data.content.saved || false,
				tags: convertTags((data.content as any).tags || []),
				slug: data.content.slug,
				children:
					data.content.children && Array.isArray(data.content.children)
						? data.content.children
						: [],
				rendered_body: (data.content as any).rendered_body
			}
		: null
</script>

{#if content}
	<ContentCard {...content} />
{/if}

AuthorCard goes here
