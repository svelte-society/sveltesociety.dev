<script lang="ts">
	import '$styles/app.css';
	import '$styles/root.css';
	import '$styles/globals.css';
	import Header from '$components/layout/Header.svelte';
	import Footer from '$components/layout/Footer.svelte';
	import GlobalSearch from '$components/GlobalSearch.svelte';
	import { assets } from '$app/paths';

	let globalSearch;
</script>

<GlobalSearch bind:this={globalSearch} />

<div class="flex flex-col h-screen justify-between">
	<Header />
	<main class="grid mx-auto w-full max-w-7xl mb-auto py-10 px-5 xl:py-20">
		<slot />
	</main>
	<Footer />
</div>

<button on:click|preventDefault={globalSearch.open} aria-label="Open global search"
	><img src="{assets}/images/search-icon.svg" alt="Search" /></button
>

<style>
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
</style>
