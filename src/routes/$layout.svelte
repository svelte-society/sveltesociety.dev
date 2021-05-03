<script>
	import metatags from '$lib/stores/metatags';
	import '../app.postcss';
</script>

<svelte:head>
	{#each Object.entries($metatags) as [property, content]}
		{#if content}
			{#if property === 'title' || property === 'description'}
				<meta name={property} {content} />
			{:else}
				<meta {property} {content} />
			{/if}
		{/if}
	{/each}
</svelte:head>

<slot />
