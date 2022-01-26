<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async function ({ stuff }) {
		stuff.metatags.title = 'Svelte Society - Cheat Sheet.';
		stuff.metatags.description = 'No time to read the docs? Just use the cheat sheet! :)';
		return { stuff };
	};
</script>

<script>
	import CheatSheetCard from './_CheatSheetCard.svelte';
	import { cheatSheet } from './cheat-sheet';
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
