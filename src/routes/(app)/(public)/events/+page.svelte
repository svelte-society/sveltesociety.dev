<script lang="ts">
	import Calendar from 'phosphor-svelte/lib/Calendar'
	import ClockCounterClockwise from 'phosphor-svelte/lib/ClockCounterClockwise'
	import MapPin from 'phosphor-svelte/lib/MapPin'
	import User from 'phosphor-svelte/lib/User'
	import Event from './Event.svelte'
	let { data } = $props()
</script>

<div class="grid gap-8">
	<!-- Upcoming Events Section -->
	<section>
		<div class="mb-6">
			<h1 class="text-3xl font-bold">Upcoming Events</h1>
			<p class="mt-2 text-gray-600">
				Join the Svelte Society community at our upcoming events, workshops, and meetups.
			</p>
		</div>

		{#if data.upcomingEvents.length === 0}
			<div class="rounded-lg bg-zinc-50 p-8 text-center">
				<Calendar size={48} class="mx-auto mb-4 text-gray-400" />
				<p class="text-lg text-gray-600">No upcoming events at the moment.</p>
				<p class="mt-2 text-sm text-gray-500">Check back soon for new events!</p>
			</div>
		{:else}
			<div class="grid gap-3">
				{#each data.upcomingEvents as event}
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

		{#if data.pastEvents.length === 0}
			<div class="rounded-lg bg-zinc-50 p-8 text-center">
				<ClockCounterClockwise size={48} class="mx-auto mb-4 text-gray-400" />
				<p class="text-lg text-gray-600">No past events to show.</p>
			</div>
		{:else}
			<div class="grid gap-3">
				{#each data.pastEvents as event}
					<Event {event} />
				{/each}
			</div>
		{/if}
	</section>
</div>
