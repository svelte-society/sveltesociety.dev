<script lang="ts">
	import Button from '$lib/ui/Button.svelte'
	import Calendar from 'phosphor-svelte/lib/Calendar'
	import MapPin from 'phosphor-svelte/lib/MapPin'
	import Link from 'phosphor-svelte/lib/Link'
	
	let { data } = $props()
	
	function formatDate(dateString: string) {
		const date = new Date(dateString)
		const options: Intl.DateTimeFormatOptions = {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}
		return date.toLocaleDateString('en-US', options)
	}
	
	function formatTime(startTime: string, endTime?: string) {
		const start = new Date(startTime)
		const timeOptions: Intl.DateTimeFormatOptions = {
			hour: '2-digit',
			minute: '2-digit'
		}
		
		let timeStr = start.toLocaleTimeString('en-US', timeOptions)
		
		if (endTime) {
			const end = new Date(endTime)
			timeStr += ' - ' + end.toLocaleTimeString('en-US', timeOptions)
		}
		
		return timeStr
	}
</script>

<div class="grid gap-6">
	<div>
		<h1 class="text-3xl font-bold">Upcoming Events</h1>
		<p class="mt-2 text-gray-600">
			Join the Svelte Society community at our upcoming events, workshops, and meetups.
		</p>
	</div>

	{#if data.events.length === 0}
		<div class="rounded-lg bg-zinc-50 p-8 text-center">
			<Calendar size={48} class="mx-auto mb-4 text-gray-400" />
			<p class="text-lg text-gray-600">No upcoming events at the moment.</p>
			<p class="mt-2 text-sm text-gray-500">Check back soon for new events!</p>
		</div>
	{:else}
		<div class="grid gap-4">
			{#each data.events as event}
				<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
					<div class="mb-4 flex items-start justify-between">
						<div>
							<h2 class="text-xl font-bold text-gray-900">{event.title}</h2>
							{#if event.source === 'api'}
								<span class="mt-1 inline-block rounded-full bg-svelte-500 px-2 py-1 text-xs text-white">
									From Guild.host
								</span>
							{/if}
						</div>
						<Calendar size={24} class="text-gray-400" />
					</div>
					
					<p class="mb-4 text-gray-700">{event.description}</p>
					
					<div class="space-y-2 text-sm">
						<div class="flex items-center gap-2 text-gray-600">
							<Calendar size={16} />
							<span>{formatDate(event.startTime)}</span>
						</div>
						
						{#if event.endTime}
							<div class="flex items-center gap-2 text-gray-600">
								<Calendar size={16} />
								<span>Ends: {formatTime(event.startTime, event.endTime)}</span>
							</div>
						{/if}
						
						{#if event.location}
							<div class="flex items-center gap-2 text-gray-600">
								<MapPin size={16} />
								<span>{event.location}</span>
							</div>
						{/if}
						
						{#if event.url}
							<div class="flex items-center gap-2">
								<Link size={16} class="text-gray-600" />
								<a 
									href={event.url} 
									target="_blank" 
									rel="noopener noreferrer"
									class="text-svelte-500 hover:underline"
								>
									Event Details
								</a>
							</div>
						{/if}
					</div>
					
					<div class="mt-6">
						{#if event.url}
							<a href={event.url} target="_blank" rel="noopener noreferrer">
								<Button primary small>Learn More</Button>
							</a>
						{:else if event.source === 'local'}
							<a href="/event/{event.slug}">
								<Button primary small>View Details</Button>
							</a>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
