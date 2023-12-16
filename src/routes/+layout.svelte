<script lang="ts">
	import '$styles/reset.css';
	import '$styles/root.css';
	import '$styles/globals.css';
	import Header from '$layout/Header.svelte';
	import Footer from '$layout/Footer.svelte';
	import GlobalSearch from '$components/GlobalSearch.svelte';
	import { assets } from '$app/paths';

	let globalSearch;
</script>

<GlobalSearch bind:this={globalSearch} />

<Header />
<main class="container">
	<slot />
</main>
<Footer />

<button on:click|preventDefault={globalSearch.open} aria-label="Open global search"
	><img src="{assets}/images/search-icon.svg" alt="Search" /></button
>

<style>
	main {
		padding: var(--s-10) var(--s-5) var(--s-20);
	}

	button {
		position: fixed;
		bottom: var(--s-2);
		right: var(--s-2);
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		border: none;
		box-shadow: var(--shadow-short);
		background: var(--primary);
	}
	button:active {
		filter: brightness(0.75);
	}
	button img {
		filter: grayscale(1) brightness(0) invert(1);
	}

	@media (min-width: 1280px) {
		main {
			padding: var(--s-20) var(--s-5);
		}
	}
</style>
