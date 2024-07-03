<script lang="ts">
	import ContentCard from '$lib/ui/ContentCard.svelte';
	import Package from 'sveltesociety.dev-service/src/components/package.svelte';
	import Recipe from 'sveltesociety.dev-service/src/components/recipe.svelte';
	import Video from 'sveltesociety.dev-service/src/components/video.svelte';
	import Guild from 'sveltesociety.dev-service/src/components/guild.svelte';

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
		<Package {...item} tags={item.keywords} />
	{:else if item.type === 'video'}
		<Video {...item} tags={item.keywords} />
	{:else if item.type === 'recipe'}
		<Recipe {...item} tags={item.keywords} />
	{:else if item.type === 'guild'}
		<Guild {...item} />
	{/if}
{/each}
