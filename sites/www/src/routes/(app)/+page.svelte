<script lang="ts">
	import ContentCard from '$lib/ui/ContentCard.svelte';

	let { data } = $props();

	console.log(data.content);
</script>

<div class="grid gap-6">
	{#each data.content as item}
		<ContentCard {...item} author="John Doe" views="11114" likes="10">
			Placeholder children content</ContentCard
		>
	{/each}
</div>
