<script lang="ts">
	import ContentCard from '$lib/ui/ContentCard.svelte'
	import Pagination from '$lib/ui/Pagination.svelte'
	import Filters from './Filters.svelte'

	let { data } = $props()

	let contentList = $derived.by(() => {
		const content = $state(data.content)
		return content
	})
</script>

<Filters categories={data.categories} tags={data.tags} sort={data.sort} />

<div class="grid gap-6">
	{#if data.count > 0}
		{#each contentList as content (content.id)}
			<div>
				<ContentCard {content} />
			</div>
		{/each}
	{:else}
		<div class="py-10 text-center">
			<h2 class="text-2xl font-bold">No content found</h2>
			<p class="text-gray-500">Try adjusting your filters or check back later.</p>
		</div>
	{/if}
	{#if data.count > 0}
		<Pagination count={data.count} perPage={15} />
	{/if}
</div>
