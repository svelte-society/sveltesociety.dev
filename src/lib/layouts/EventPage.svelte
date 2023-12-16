<script>
	import Seo from '$lib/components/Seo.svelte';

	export let title = '';
</script>

<Seo {title} />

<div>
	<h1>{title}</h1>
	<main>
		<slot />
	</main>
</div>

<style>
	div {
		padding: 5vw;
	}

	main {
		text-align: start;
		display: block;
	}
</style>
