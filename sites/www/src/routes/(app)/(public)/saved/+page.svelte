<script lang="ts">
import ContentCard from '$lib/ui/ContentCard.svelte'
import type { PageData } from './$types'

export let data: PageData
</script>

<div class="grid gap-6">
	{#each data.content as item}
		<ContentCard child_content={item.children} {...item} author="John Doe" views={11114}>
			{item.description}</ContentCard
		>
	{/each}
</div>
