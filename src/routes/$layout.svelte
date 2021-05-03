<script>
	import Header from './_Header/Header.svelte';
	import Footer from './_Footer/Footer.svelte';
	import metatags from '$lib/stores/metatags';
	import '../app.postcss';
</script>

<svelte:head>
	{#each Object.entries($metatags) as [property, content]}
		{#if content}
			{#if ['title', 'description', 'image'].includes(property)}
				<meta name={property} {content} />
			{:else}
				<meta {property} {content} />
			{/if}
		{/if}
	{/each}
</svelte:head>

<div class="container">
	<Header />

	<slot />

	<Footer />
</div>

<style>
	div {
		min-height: calc(100vh - 6px);
		display: grid;
		grid-template-rows: 0fr 1fr 0fr;
	}
</style>
