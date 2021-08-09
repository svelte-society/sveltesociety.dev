<script>
	import CheatSheetCard from './_CheatSheetCard.svelte';
	import { page } from '$app/stores';
	import { cheatSheet } from './cheat-sheet';
	import metatags from '$lib/stores/metatags';

	metatags.title('Svelte Society - Cheat Sheet.');
	metatags.desc('No time to read the docs? Just use the cheat sheet! :)');
	metatags.url($page.host + $page.path);
</script>

<svelte:head>
	<title>Cheatsheet - Svelte Society</title>
</svelte:head>
<h1 class="text-5xl mb-5">Cheat Sheet</h1>
<main class="flex flex-wrap items-stretch gap-x-5 gap-y-10">
	{#each cheatSheet as item}
		<CheatSheetCard {...item} />
	{/each}
</main>
