<script>
	import CheatSheetCard from './_CheatSheetCard.svelte';
	import { cheatSheet } from './cheat-sheet';
</script>

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
</style>
