<script>
	import { page } from '$app/stores';
	import metatags from '$lib/stores/metatags';
</script>

<svelte:head>
	<title>{metatags.title}</title>

	<!-- Meta Tags -->
	<meta name="description" content={metatags.desc} />
	<!-- Open Graph Info -->
	<meta property="og:title" content={metatags.title} />
	<meta property="og:description" content={metatags.desc} />
	{#if url || canonical}
		<meta property="og:url" content={url || canonical} />
	{/if}
	<meta property="og:image" content={pageImage} />
	<meta property="og:image:alt" content={pageImageAlt} />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={metatags.title} />
	<meta name="twitter:description" content={metatags.desc} />
	<meta name="twitter:image" content={pageImage} />
	<meta name="twitter:image:alt" content={pageImageAlt} />
</svelte:head>
