<script lang="ts">
	import Header from '../../_components/Header.svelte'
	import { getUser, getHeaderAnnouncement } from '../../data.remote'

	let { children } = $props()
</script>

<svelte:head>
	<script
		defer
		src="https://umami.sveltesociety.dev/script.js"
		data-website-id="d91db9d2-f32f-4781-a861-efba1953edea"
	></script>
</svelte:head>

<div class="flex min-h-screen flex-col">
	<Header user={await getUser()} announcement={await getHeaderAnnouncement()} />

	<main class="mx-auto w-full max-w-[1440px] flex-1 px-4 py-8">
		{@render children()}
	</main>
</div>
