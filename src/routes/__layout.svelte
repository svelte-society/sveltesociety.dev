<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async function () {
		return {
			stuff: {
				metatags: {
					title: 'Svelte Society',
					description:
						'We are a volunteer global network of Svelte fans that strive to promote Svelte and its ecosystem. As a service to the community, this site is a central index of events, a components directory, as well as recipes and other useful resources. Join us or help us out!',
					image:
						'https://raw.githubusercontent.com/svelte-society/sveltesociety.dev/main/src/routes/metatag.png',
					alt: 'SvelteSociety.dev',
					'twitter:card': 'summary_large_image',
					'og:type': 'website',
					'og:url': 'https://sveltesociety.dev/'
				}
			}
		};
	};
</script>

<script lang="ts">
	// import '../app.css';
	import '$styles/reset.css';
	import '$styles/root.css';
	import '$styles/globals.css';
	import Header from '$layout/Header.svelte';
	import Footer from '$layout/Footer.svelte';
	import metatags from '$lib/stores/metatags';
	import { page } from '$app/stores';

	const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);
	$: path =
		$page.url.pathname === '/'
			? 'Home'
			: capitalize($page.url.pathname.split('/').toString().replace(',', ''));
</script>

<svelte:head>
	<title>{path} - Svelte Society</title>
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

<Header />
<main class="container">
	<slot />
</main>
<Footer />

<style>
	main {
		padding: var(--s-10) var(--s-5) var(--s-20);
	}

	@media (min-width: 1280px) {
		main {
			padding: var(--s-20) var(--s-5);
		}
	}
</style>
