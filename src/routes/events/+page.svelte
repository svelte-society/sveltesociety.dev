<script lang="ts">
	import Societies from '$lib/components/Societies/index.svelte';
	import EventListElement from '$lib/components/EventListElement/index.svelte';
	import Seo from '$lib/components/Seo.svelte';
	export let data;
</script>

<Seo title="Events" />

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
