<script>
	import CheatSheetCard from './_CheatSheetCard.svelte';
	import { page } from '$app/stores';
	import { cheatSheet } from './cheat-sheet';
	import metatags from '$lib/stores/metatags';

	metatags.title('Svelte Society - Cheat Sheet.');
	metatags.desc('No time to read the docs? Just use the cheat sheet! :)');
	metatags.url($page.host + $page.path);
</script>

<svelte:head>
  <title>Cheatsheet - Svelte Society</title>
</svelte:head>
<main>
	{#each cheatSheet as item}
		<CheatSheetCard {...item} />
	{/each}
</main>

<style>
	main {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		max-width: 100%;
	}
	@media (max-width: 960px) {
		main > :global(.card) {
			max-width: 95%;
		}
	}
	.intro {
		margin: 0 auto;
		margin-bottom: var(--space-600) 0;
	}
</style>
