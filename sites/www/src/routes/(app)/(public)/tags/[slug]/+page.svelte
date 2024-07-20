<script lang="ts">
	import { page } from '$app/stores';
	import Tag from '$lib/ui/Tag.svelte';
	import ContentCard from '$lib/ui/ContentCard.svelte';

	let { data } = $props();
</script>

<!-- <Tag tag={data.tag.filter} /> -->
<div class="grid gap-6">
	{#each data.content as item}
		<ContentCard {...item} author="John Doe" views="11114">
			{item.description}</ContentCard
		>
	{/each}
</div>
