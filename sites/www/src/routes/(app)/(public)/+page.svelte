<script lang="ts">
	import ContentCard from '$lib/ui/ContentCard.svelte';
	import Pagination from '$lib/ui/Pagination.svelte';

	let { data } = $props();
</script>

<div class="grid gap-6">
	{#if data.search_results}
		<h1>Searched for: {data.search_results.query}</h1>
		{#if data.search_results.error}
			<p>{data.search_results.error}</p>
		{:else}
			{#each data.search_results.content as item}
				<ContentCard {...item} body={null} author="John Doe" views="11114" />
			{/each}
		{/if}
	{:else}
		{#each data.content as item}
			<ContentCard {...item} body={null} author="John Doe" views="11114" />
		{/each}
	{/if}

	{#if data?.totalPages > 1}
		<Pagination totalPages={data.totalPages} />
	{/if}
</div>
