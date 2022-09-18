<script lang="ts">
	import Societies from '$lib/components/Societies/index.svelte';
	import EventListElement from '$lib/components/EventListElement/index.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<Seo title="Events" />

<p><br /></p>

<h1>CULT Events</h1>

<p><br /></p>

under construction - we'll promote events where guests get free entrance when proving they have cult
or rvlt in their wallet.
<p><br /></p>
The following is just to get some design- / layout ideas
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
