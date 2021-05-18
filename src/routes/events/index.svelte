<script lang="ts" context="module">
	export const prerender = true;
	export async function load({ session }) {
		const events = session.events;
		return { props: { events } };
	}

</script>

<script lang="ts">
	import Societies from '$lib/components/Societies/index.svelte';
	import EventListElement from '$lib/components/EventListElement/index.svelte';
	export let events = [];

</script>

<div class="wrapper">
	<section class="event-wrapper">
		{#each events as event}
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
		margin: 2vh 3vw;
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
