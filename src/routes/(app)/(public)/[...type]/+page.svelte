<script lang="ts">
	import ContentCard from '$lib/ui/ContentCard.svelte'
	import Pagination from '$lib/ui/Pagination.svelte'
	import { flip } from 'svelte/animate'
	import { cubicOut } from 'svelte/easing'
	import Filters from './Filters.svelte'
	import { fade } from 'svelte/transition'
	import { prefersReducedMotion } from 'svelte/motion'

	let { data } = $props()

	let contentList = $derived.by(() => {
		const content = $state(data.content)
		return content
	})
</script>

<div class="grid gap-6">
	<Filters categories={data.categories} tags={data.tags} sort={data.sort} />
	{#if data.count > 0}
		{#each contentList as content (content.id)}
			<div
				animate:flip={{ duration: prefersReducedMotion.current ? 0 : 250, easing: cubicOut }}
				transition:fade={{ duration: prefersReducedMotion.current ? 0 : 150 }}
			>
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
		<Pagination count={data.count} />
	{/if}
</div>
