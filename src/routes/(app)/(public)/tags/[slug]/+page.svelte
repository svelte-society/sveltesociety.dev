<script lang="ts">
	import ContentCard from '$lib/ui/ContentCard.svelte'
	import { convertTags } from '$lib/types/content'
	import Pagination from '$lib/ui/Pagination.svelte'

	let { data } = $props()
</script>

<div class="grid gap-6">
	{#if data.content.length > 0}
		{#each data.content as item}
			<ContentCard
				id={item.id}
				title={item.title}
				description={item.description}
				type={item.type}
				author="John Doe"
				published_at={item.published_at || ''}
				views={1125}
				likes={item.likes || 0}
				liked={item.liked || false}
				saves={item.saves || 0}
				saved={item.saved || false}
				tags={convertTags(item.tags)}
				slug={item.slug}
				child_content={item.children}
			/>
		{/each}

		<Pagination count={data.total} perPage={12} />
	{:else}
		<div class="py-10 text-center">
			<h2 class="text-2xl font-bold">No content found for this tag</h2>
			<p class="text-gray-500">Try browsing other tags or check back later.</p>
		</div>
	{/if}
</div>
