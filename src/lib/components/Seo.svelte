<script type="ts">
	import { page } from '$app/stores';

	const brand = 'CULT Magazine';

	export let title = brand;
	export let description = 'We are a network of cultdao.io fans promoting freedom, fairness, education and love." data-svelte="svelte-1h4pbpd"><meta property="og:type" content="website" data-svelte="svelte-1h4pbpd"><meta property="og:title" content="Home - CULT Magazine" data-svelte="svelte-1h4pbpd"><meta property="og:site_name" content="CULT Magazine" data-svelte="svelte-1h4pbpd"><meta property="og:description" content="We are a network of cultdao.io fans promoting freedom, fairness, education and love." data-svelte="svelte-1h4pbpd"><meta property="og:image" name="og:image" content="https://raw.githubusercontent.com/michael-spengler/fairness/main/diagrams-documents-images/cult-money-1500x500.jpeg" data-svelte="svelte-1h4pbpd"><meta name="og:url" content="https://undefined/" data-svelte="svelte-1h4pbpd"><meta name="twitter:site" content="@sveltesociety" data-svelte="svelte-1h4pbpd"><meta name="twitter:image" content="https://raw.githubusercontent.com/michael-spengler/fairness/main/diagrams-documents-images/cult-money-1500x500.jpeg" data-svelte="svelte-1h4pbpd"><meta name="twitter:card" content="summary_large_image" data-svelte="svelte-1h4pbpd"><meta name="twitter:title" content="Home - CULT Magazine" data-svelte="svelte-1h4pbpd"><meta name="twitter:description" content="We are a network of cultdao.io fans promoting freedom, fairness, education and love.';
	export let image =
		'https://raw.githubusercontent.com/michael-spengler/fairness/main/diagrams-documents-images/cult-money-1500x500.jpeg';
	export let url = `https://${$page.host}${$page.url.pathname}`;
	export let twitterHandle = '@Peer2PeerE';
</script>

<svelte:head>
	<title>{brand}</title>
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
