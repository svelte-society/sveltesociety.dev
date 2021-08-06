<script lang="ts" context="module">
	export async function load({ fetch }) {
		const res = await fetch('/events/events');
		if (res.ok) return { props: { events: await res.json() } };
		return {
			status: res.status,
			error: new Error()
		};
	}

</script>

<script lang="ts">
	import Societies from '$lib/components/Societies/index.svelte';
	import EventListElement from '$lib/components/EventListElement/index.svelte';
	export let events = {};

</script>

<svelte:head>
  <title>Events - Svelte Society</title>
</svelte:head>

<div class="wrapper">
	<section class="event-wrapper">
		{#each events.events as event}
			<EventListElement
				title={event.title}
				url={'/events/' + event.filename.replace('.svx', '')}
				date={event.date}
				isPast={event.isPast}
			/>
		{/each}
	</section>
	<Societies />
</div>

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
