<script lang="ts">
	import ContentCard from '$lib/ui/ContentCard.svelte'

	let { data } = $props()
</script>

<div class="grid gap-6">
	{#if data.content.length > 0}
		{#each data.content as item}
			<ContentCard content={item} />
		{/each}
	{:else}
		<div class="py-10 text-center">
			<h2 class="text-2xl font-bold">No saved content</h2>
			<p class="text-gray-500">
				You haven't saved any content yet. Browse and save content to see it here.
			</p>
		</div>
	{/if}
</div>
