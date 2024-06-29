<script lang="ts">
	import ContentCard from '$lib/ui/ContentCard.svelte';
	import Package from 'sveltesociety.dev-service/src/components/package.svelte';
	import Recipe from 'sveltesociety.dev-service/src/components/recipe.svelte';
	import Video from 'sveltesociety.dev-service/src/components/video.svelte';

	import type { PageData } from './$types';
	export let data: PageData;

	let tags = [
		{ id: 'svelte5', name: 'Svelte5' },
		{ id: 'runes', name: 'Runes' }
	];
</script>

<ContentCard
	title="Working with Actions in Svelte5"
	description="SvelteKit is a great tool for building modern web applications..."
	type="Recipe"
	author="John Doe"
	time="2 days ago"
	views="11114"
	likes="10"
	{tags}
	slug="working-with-actions-in-svelte5"
>
	Placeholder children content</ContentCard
>

{#each data.items as item}
	{#if item.type === 'package'}
		<Package
			type="Library"
			description={item.description}
			name={item.name}
			author={item.author}
			lastUpdate={item.lastUpdate}
			likes={item.likes}
			tags={item.keywords}
			cover={item.cover}
			connected={item.connected}
			views={item.views}
			liked={item.liked}
			saved={item.saved}
		/>
	{:else if item.type === 'video'}
		<Video
			description={item.description}
			name={item.name}
			author={item.author}
			lastUpdate={item.lastUpdate}
			likes={item.likes}
			tags={item.keywords}
			embed={item.embed}
			connected={item.connected}
			views={item.views}
			liked={item.liked}
			saved={item.saved}
		/>
	{:else if item.type === 'recipe'}
		<Recipe
			description={item.description}
			name={item.name}
			author={item.author}
			lastUpdate={item.lastUpdate}
			likes={item.likes}
			tags={item.keywords}
			preview={item.preview}
			connected={item.connected}
			views={item.views}
			liked={item.liked}
			saved={item.saved}
		/>
	{/if}
{/each}
