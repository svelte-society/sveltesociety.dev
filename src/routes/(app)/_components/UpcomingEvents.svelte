<script lang="ts">
	import Calendar from 'phosphor-svelte/lib/Calendar'
	import MapPin from 'phosphor-svelte/lib/MapPin'
	import User from 'phosphor-svelte/lib/User'
	import { type UpcomingEvent } from './types'

	let { events = [], onLinkClick }: { events?: UpcomingEvent[]; onLinkClick?: () => void } =
		$props()
</script>

{#if events && events.length > 0}
	<div class="grid gap-3 rounded border border-slate-200 bg-gray-50 p-4">
		<div class="flex items-center justify-between">
			<h3 class="text-md font-bold">Upcoming Events</h3>
			<a href="/events" class="text-svelte-500 text-xs hover:underline" onclick={onLinkClick}
				>View all</a
			>
		</div>
		<div class="space-y-3">
			{#each events as event}
				<div class="border-svelte-300 border-l-2 pl-3">
					<h4 class="text-sm font-semibold">
						{#if event.metadata?.url}
							<a
								href={event.metadata.url}
								target="_blank"
								rel="noopener noreferrer"
								class="hover:text-svelte-500"
								onclick={onLinkClick}
							>
								{event.title}
							</a>
						{:else}
							<a
								href="/{event.type}/{event.slug}"
								class="hover:text-svelte-500"
								onclick={onLinkClick}
							>
								{event.title}
							</a>
						{/if}
					</h4>
					{#if event.metadata?.startTime}
						<div class="mt-1 flex items-center gap-1 text-xs text-gray-600">
							<Calendar size={12} />
							<span
								>{new Date(event.metadata.startTime).toLocaleDateString('en-US', {
									month: 'short',
									day: 'numeric',
									hour: '2-digit',
									minute: '2-digit'
								})}</span
							>
						</div>
					{/if}
					{#if event.metadata?.location}
						<div class="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
							<MapPin size={10} />
							<span>{event.metadata.location}</span>
						</div>
					{/if}
					{#if event.metadata?.presentations && event.metadata.presentations.length > 0}
						<div class="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
							<User size={10} />
							<span
								>{event.metadata.presentations.length} presentation{event.metadata.presentations
									.length !== 1
									? 's'
									: ''}</span
							>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
{/if}
