<script lang="ts">
	import ContentCard from '$lib/ui/ContentCard.svelte'
	import Pagination from '$lib/ui/Pagination.svelte'
	import Filters from './Filters.svelte'

	let { data } = $props()
</script>

<div class="grid gap-6">
	<Filters categories={data.categories} tags={data.tags} sort={data.sort} />
	{#if data.count > 0}
		{#each data.content as content}
			<ContentCard {content} />
		{/each}
	{:else}
		<div class="py-10 text-center">
			<h2 class="text-2xl font-bold">No content found</h2>
			<p class="text-gray-500">Try adjusting your filters or check back later.</p>
		</div>
	{/if}
	{#if data.count > 0}
		<Pagination count={data.count} />
	{/if}
</div>
