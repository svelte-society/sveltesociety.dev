<script lang="ts">
	import '$styles/reset.css';
	import '$styles/root.css';
	import '$styles/globals.css';
	import Header from '$layout/Header.svelte';
	import Footer from '$layout/Footer.svelte';
	import GlobalSearch from '$components/GlobalSearch.svelte';
</script>

<Header />
<main class="container">
	<GlobalSearch />
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
