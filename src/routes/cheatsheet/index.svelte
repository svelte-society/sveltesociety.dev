<script>
	import CheatSheetCard from './_CheatSheetCard.svelte';
	import { page } from '$app/stores';
	import { cheatSheet } from './cheat-sheet';
	import metatags from '$lib/stores/metatags';

	metatags.title('Cheat Sheet');
	metatags.desc('No time to read the docs? Just use the cheat sheet! :)');
	metatags.url($page.host + $page.path);
</script>

<h1>Cheat Sheet</h1>
<main>
	{#each cheatSheet as item}
		<CheatSheetCard {...item} />
	{/each}
</main>

<style>
	main {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		align-items: stretch;
		justify-items: stretch;
		gap: var(--s-10);
	}
	@media (min-width: 1280px) {
		main {
			display: flex;
			flex-wrap: wrap;
		}
	}
</style>
