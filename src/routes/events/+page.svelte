<script lang="ts">
	import Societies from '$lib/components/Societies/index.svelte';
	import EventListElement from '$lib/components/EventListElement/index.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<Seo title="Events" />

<p><br /></p>
<div class="text-center">
	<h1>CULT Events</h1>
	Everyone is invited to add CULT news via pull request.

	<p><br /></p>
	We'll promote events where guests get free entrance when proving they have CULT or RVLT in their wallet.
	<p><br /></p>
	We'll also promote CULT related Twitter Spaces and Youtube Live Streams.
	<p><br /></p>
	The following is just to get some design- / layout ideas
</div>
<article class="wrapper">
	<section class="event-wrapper">
		{#each data.events as event}
			<EventListElement
				title={event.title}
				url={'/events/' + event.filename.replace('.svx', '')}
				date={event.date}
			/>
		{/each}
	</section>
	<Societies />
</article>

<style>
	.wrapper {
		display: flex;
	}
	.event-wrapper {
		flex: 1 1 auto;
		margin: 1%;
	}
	/* mobile design */
	@media only screen and (max-width: 768px) {
		.wrapper {
			display: flex;
			flex-direction: column;
		}
	}
</style>
