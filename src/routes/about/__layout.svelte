<script>
	import metatags from '$lib/stores/metatags';

	metatags.update({ title: 'About' });
</script>

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
