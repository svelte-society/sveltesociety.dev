<script lang="ts">
	import ContentCard from '$lib/ui/ContentCard.svelte';

	let { data } = $props();
</script>

<div class="grid gap-6">
	{#if data.search_results}
		<h1>Searched for</h1>
		<ul>
			{#each data.search_results.content as row}
				<li>{row.title}</li>
			{/each}
		</ul>
	{:else}
		{#each data.content as item}
			<ContentCard {...item} author="John Doe" views="11114" likes="10">
				{item.description}</ContentCard
			>
		{/each}
	{/if}
</div>
