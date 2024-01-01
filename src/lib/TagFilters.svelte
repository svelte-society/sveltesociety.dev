<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '$lib/components/Icon/index.svelte';

	export let tags: string[];
	export let selectedTags: string[];
</script>

<div class="flex flex-wrap items-center gap-2" data-sveltekit-noscroll>
	{#each selectedTags as tag}
		{@const newTags = selectedTags.filter((t) => t !== tag)}
		{@const title = tag.replaceAll('-', ' ')}
		{#if newTags.length === 0}
			<a class="tag active" href={$page.url.pathname}>{title}</a>
		{:else}
			<a
				class="tag active"
				href={`${$page.url.pathname}?${newTags.map((t) => `tag=${t}`).join('&')}`}
			>
				{title}
			</a>
		{/if}
	{/each}

	{#each tags as tag}
		{#if !selectedTags.includes(tag)}
			{@const newTags = [...selectedTags, tag]}
			{@const title = tag.replaceAll('-', ' ')}
			<a class="tag" href={`${$page.url.pathname}?${newTags.map((t) => `tag=${t}`).join('&')}`}>
				{title}
			</a>
		{/if}
	{/each}

	{#if selectedTags.length !== 0}
		<a href={$page.url.pathname}><Icon name="close" /></a>
	{/if}
</div>

<style>
	a {
		text-decoration: none;
	}

	.tag {
		padding: 4px 12px;
		border: 1px solid var(--link-color);
		border-radius: 9999px;
		font-family: Overpass;
		font-style: normal;
		font-weight: normal;
		font-size: 14px;
		line-height: 150%;
		text-align: center;
	}

	.active {
		color: #ff3e01;
		background: #ffdbcf;
	}
</style>
