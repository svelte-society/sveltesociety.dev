<script>
	import Seo from '$lib/components/Seo.svelte';
</script>

<Seo title="About" />

<main class="wrapper">
	<slot />
</main>

<style>
	.wrapper {
		max-width: 65ch;
		margin-inline: auto;
	}
	.wrapper :global(h2),
	.wrapper :global(h3) {
		margin-top: 2rem;
		margin-bottom: 1.25rem;
	}
	.wrapper :global(p) {
		margin-bottom: 1.25rem;
	}
	.wrapper :global(li) {
		margin-bottom: 1.1rem;
	}
</style>
