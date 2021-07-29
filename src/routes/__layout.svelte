<script>
    import "../app.postcss";
    import Header from './_Header/Header.svelte';
    import Footer from './_Footer.svelte';
    import metatags from '$lib/stores/metatags';
</script>

<svelte:head>
	{#each Object.entries($metatags) as [property, content]}
		{#if content}
			{#if ['title', 'description', 'image'].includes(property)}
				<meta name="{property}" {content} />
			{:else}
				<meta {property} {content} />
			{/if}
		{/if}
	{/each}
</svelte:head>

<Header />
	<div class="container mx-auto">
		<main>
			<slot />
		</main>
	</div>
<Footer />

<style>
	.container main {
		padding-left: 1rem;
		padding-bottom: 1rem;
	}
</style>
