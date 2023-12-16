<script type="ts">
	import { page } from '$app/stores';

	const brand = 'Svelte Society';

	export let title = brand;
	export let description =
		'We are a volunteer global network of Svelte fans that strive to promote Svelte and its ecosystem. As a service to the community, this site is a central index of events, a components directory, as well as recipes and other useful resources. Join us or help us out!';
	export let image =
		'https://raw.githubusercontent.com/svelte-society/sveltesociety.dev/main/static/images/metatag.png';
	export let url = `https://${$page.url.host}${$page.url.pathname}`;
	export let twitterHandle = '@sveltesociety';
</script>

<svelte:head>
	<title>{title} - {brand}</title>
	<meta name="description" content={description} />

	<meta property="og:type" content="website" />
	<meta property="og:title" content={`${title} - ${brand}`} />
	<meta property="og:site_name" content={brand} />
	<meta property="og:description" content={description} />
	<meta property="og:image" name="og:image" content={image} />
	<meta name="og:url" content={url} />

	<meta name="twitter:site" content={twitterHandle} />
	<meta name="twitter:image" content={image} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={`${title} - ${brand}`} />
	<meta name="twitter:description" content={description} />
</svelte:head>
