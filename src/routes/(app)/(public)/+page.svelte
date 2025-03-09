<script lang="ts">
import ContentCard from '$lib/ui/ContentCard.svelte'
import Pagination from '$lib/ui/Pagination.svelte'
import type { ContentItem } from '$lib/types/content';
import { isContentArray, convertTags } from '$lib/types/content';

let { data } = $props()

// Debug: Check the actual type of data.content
console.log('data.content type:', typeof data.content, Array.isArray(data.content));
if (data.content) {
	console.log('data.content sample:', data.content[0]);
}
</script>

<div class="grid gap-6">
	{#if isContentArray(data.content) && data.content.length > 0}
		{#each data.content as item}
			<ContentCard 
				id={item.id}
				title={item.title}
				description={item.description}
				type={item.type}
				author="John Doe"
				published_at={item.published_at || ''}
				views={11114}
				likes={item.likes || 0}
				liked={item.liked || false}
				saves={item.saves || 0}
				saved={item.saved || false}
				tags={convertTags(item.tags || [])}
				slug={item.slug}
				child_content={Array.isArray(item.children) ? item.children : []}
			/>
		{/each}
	{:else}
		<div class="text-center py-10">
			<h2 class="text-2xl font-bold">No content found</h2>
			<p class="text-gray-500">Try adjusting your filters or check back later.</p>
		</div>
	{/if}
</div>

{#if data.count > 0}
	<div class="mt-8">
		<Pagination totalPages={Math.ceil(data.count / 10)} />
	</div>
{/if}
