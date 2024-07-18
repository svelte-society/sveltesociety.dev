<script lang="ts">
	import ContentCard from '$lib/ui/ContentCard.svelte';

	let { data } = $props();

	console.log(data.search_results);
</script>

<div class="grid gap-6">
	{#if data.search_results}
		<h1>Searched for: {data.search_results.query}</h1>
		{#if data.search_results.error}
			<p>{data.search_results.error}</p>
		{:else}
			{#each data.search_results.content as item}
				<ContentCard {...item} author="John Doe" views="11114">
					{item.description}</ContentCard
				>
			{/each}
		{/if}
	{:else}
		{#each data.content as item}
			<ContentCard {...item} author="John Doe" views="11114">
				{item.description}</ContentCard
			>
		{/each}
	{/if}
</div>
