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
	<meta property="og:image" content={metatags.image} />
	<meta property="og:image:alt" content={metatags.alt} />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={metatags.title} />
	<meta name="twitter:description" content={metatags.desc} />
	<meta name="twitter:image" content={metatags.image} />
	<meta name="twitter:image:alt" content={metatags.alt} />
</svelte:head>
