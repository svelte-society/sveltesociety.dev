<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
</script>

<Seo title="CULT Markets" description="CULT Markets" />

<h1>CULT Markets</h1>
<main>
	to be done
	<!-- {#each cheatSheet as item}
		<CheatSheetCard {...item} />
	{/each} -->
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
