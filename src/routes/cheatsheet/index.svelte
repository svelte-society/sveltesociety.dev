<script lang="ts">
	import CheatSheetCard from './_CheatSheetCard.svelte';
	import { cheatSheet } from './cheat-sheet';
	import Seo from '$lib/components/Seo.svelte';
</script>

<Seo title="Cheat Sheet" description="No time to read the docs? Just use the cheat sheet! :)" />

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
