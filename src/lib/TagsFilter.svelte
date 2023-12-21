<script lang="ts">
	import { page } from '$app/stores';

	export let tags;
	export let selectedTags;
</script>

{#each tags as tag}
	{#if selectedTags.includes(tag)}
		<a href={`${$page.url.pathname}?tags=${selectedTags.filter((t) => t !== tag).join(',')}`}
			>Remove {tag}</a
		>
	{/if}
{/each}

{#each tags as tag}
	{#if !selectedTags.includes(tag)}
		<a href={`${$page.url.pathname}?tags=${[...selectedTags, tag].join(',')}`}>Add {tag}</a>
	{/if}
{/each}
