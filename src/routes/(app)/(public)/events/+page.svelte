<script lang="ts">
	import Calendar from 'phosphor-svelte/lib/Calendar'
	import ClockCounterClockwise from 'phosphor-svelte/lib/ClockCounterClockwise'
	import Event from './Event.svelte'
	import Schema from '$lib/ui/Schema.svelte'
	import { generateEventListSchema, type EventSchemaInput } from '$lib/seo'
	import { getEvents } from './events.remote'

	const events = await getEvents()

	// Generate event list schema for upcoming events (for rich snippets)
	const eventSchemaInputs: EventSchemaInput[] = $derived(
		events.upcomingEvents.map((event) => ({
			name: event.title,
			description: event.description,
			startDate: event.startTime,
			endDate: event.endTime,
			url: event.url,
			imageUrl: event.socialCardUrl,
			organizerName: event.owner,
			isOnline: true // Most Svelte Society events are online
		}))
	)

	const eventListSchema = $derived(
		eventSchemaInputs.length > 0
			? generateEventListSchema(eventSchemaInputs, 'Upcoming Svelte Society Events')
			: null
	)
</script>

{#if eventListSchema}
	<Schema schema={eventListSchema} />
{/if}

<div class="grid gap-8">
	<!-- Upcoming Events Section -->
	<section>
		<div class="mb-6">
			<h1 class="text-3xl font-bold">Upcoming Events</h1>
			<p class="mt-2 text-gray-600">
				Join the Svelte Society community at our upcoming events, workshops, and meetups.
			</p>
		</div>

		{#if events.upcomingEvents.length === 0}
			<div class="rounded-lg bg-zinc-50 p-8 text-center">
				<Calendar size={48} class="mx-auto mb-4 text-gray-400" />
				<p class="text-lg text-gray-600">No upcoming events at the moment.</p>
				<p class="mt-2 text-sm text-gray-500">Check back soon for new events!</p>
			</div>
		{:else}
			<div class="grid gap-3">
				{#each events.upcomingEvents as event (event.id)}
					<Event {event} />
				{/each}
			</div>
		{/if}
	</section>

	<!-- Past Events Section -->
	<section class="rounded-lg bg-gray-50 p-6">
		<div class="mb-6 flex items-center gap-2">
			<ClockCounterClockwise size={32} class="text-gray-600" />
			<div>
				<h2 class="text-2xl font-bold">Past Events</h2>
				<p class="text-gray-600">Events from the past year</p>
			</div>
		</div>

		{#if events.pastEvents.length === 0}
			<div class="rounded-lg bg-zinc-50 p-8 text-center">
				<ClockCounterClockwise size={48} class="mx-auto mb-4 text-gray-400" />
				<p class="text-lg text-gray-600">No past events to show.</p>
			</div>
		{:else}
			<div class="grid gap-3">
				{#each events.pastEvents as event (event.id)}
					<Event {event} />
				{/each}
			</div>
		{/if}
	</section>
</div>
