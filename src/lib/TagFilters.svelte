<script lang="ts">
	import { page } from '$app/stores';

	export let tags: string[];
	export let selectedTags: string[];
</script>

<div data-sveltekit-noscroll>
	{#each selectedTags as tag}
		{@const newTags = selectedTags.filter((t) => t !== tag)}
		{@const title = tag.replaceAll('-', ' ')}
		{#if newTags.length === 0}
			<a class="active" href={`${$page.url.pathname}`}>{title}</a>
		{:else}
			<a class="active" href={`${$page.url.pathname}?${newTags.map((t) => `tag=${t}`).join('&')}`}>
				{title}
			</a>
		{/if}
	{/each}

	{#each tags as tag}
		{#if !selectedTags.includes(tag)}
			{@const newTags = [...selectedTags, tag]}
			{@const title = tag.replaceAll('-', ' ')}
			<a href={`${$page.url.pathname}?${newTags.map((t) => `tag=${t}`).join('&')}`}>
				{title}
			</a>
		{/if}
	{/each}
</div>

<style>
	div {
		display: flex;
		flex-wrap: wrap;
	}

	a {
		padding: 4px 12px;
		border: 1px solid var(--link-color);
		border-radius: 9999px;
		font-family: Overpass;
		font-style: normal;
		font-weight: normal;
		font-size: 14px;
		line-height: 150%;
		text-align: center;
		margin-right: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.active {
		color: #ff3e01;
		background: #ffdbcf;
	}
</style>
