<script lang="ts">
	import ContentCard from '$lib/ui/ContentCard.svelte'
	import Calendar from 'phosphor-svelte/lib/Calendar'
	import ClockCounterClockwise from 'phosphor-svelte/lib/ClockCounterClockwise'
	import type { Content } from '$lib/types/content'
	
	let { data } = $props()
	
	// Convert event data to Content format for ContentCard
	function eventToContent(event: any): Content {
		const metadata = typeof event.metadata === 'string' 
			? JSON.parse(event.metadata) 
			: event.metadata || {}
			
		return {
			id: event.id,
			title: event.title,
			slug: event.slug,
			description: event.description,
			type: 'event',
			status: 'published',
			body: event.body || event.description,
			rendered_body: event.rendered_body || event.description,
			author: event.owner || event.author || 'Svelte Society',
			tags: event.tags || [],
			created_at: event.created_at || new Date().toISOString(),
			updated_at: event.updated_at || new Date().toISOString(),
			published_at: event.published_at || event.startTime,
			likes: event.likes || 0,
			saves: event.saves || 0,
			liked: false,
			saved: false,
			views: event.views || 0,
			metadata: {
				startTime: event.startTime || metadata.startTime,
				endTime: event.endTime || metadata.endTime,
				location: event.location || metadata.location,
				url: event.url || metadata.url
			},
			children: []
		}
	}
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
			<div class="grid gap-4">
				{#each data.upcomingEvents as event}
					<ContentCard content={eventToContent(event)} />
				{/each}
			</div>
		{/if}
	</section>

	<!-- Past Events Section -->
	<section>
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
			<div class="grid gap-4">
				{#each data.pastEvents as event}
					<div class="opacity-75">
						<ContentCard content={eventToContent(event)} />
					</div>
				{/each}
			</div>
		{/if}
	</section>
</div>