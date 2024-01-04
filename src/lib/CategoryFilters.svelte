<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '$lib/components/Icon/index.svelte';

	export let categories: string[];
	export let selectedCategories: string[];
</script>

<div class="flex flex-wrap items-center gap-2" data-sveltekit-noscroll>
	{#each selectedCategories as category}
		{@const newCategories = selectedCategories.filter((c) => c !== category)}
		{@const title = category.replaceAll('-', ' ')}
		{#if newCategories.length === 0}
			<a class="category active" href={$page.url.pathname}>{title}</a>
		{:else}
			<a
				class="category active"
				href={`${$page.url.pathname}?${newCategories.map((t) => `category=${t}`).join('&')}`}
			>
				{title}
			</a>
		{/if}
	{/each}

	{#each categories as category}
		{#if !selectedCategories.includes(category)}
			{@const newCategories = [...selectedCategories, category]}
			{@const title = category.replaceAll('-', ' ')}
			<a
				class="category"
				href={`${$page.url.pathname}?${newCategories.map((t) => `category=${t}`).join('&')}`}
			>
				{title}
			</a>
		{/if}
	{/each}

	{#if selectedCategories.length !== 0}
		<a href={$page.url.pathname}><Icon name="close" /></a>
	{/if}
</div>

<style>
	a {
		text-decoration: none;
	}

	.category {
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
