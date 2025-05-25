<script lang="ts">
	import Calendar from 'phosphor-svelte/lib/Calendar'
	import ClockCounterClockwise from 'phosphor-svelte/lib/ClockCounterClockwise'
	import MapPin from 'phosphor-svelte/lib/MapPin'
	import User from 'phosphor-svelte/lib/User'
	
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
					<div class="flex gap-4 rounded-lg border border-gray-200 bg-white p-4 hover:border-svelte-300 transition-colors">
						<div class="flex-shrink-0">
							{#if event.socialCardUrl}
								<img 
									src={event.socialCardUrl} 
									alt={event.title}
									class="h-24 w-24 rounded-lg object-cover"
								/>
							{:else}
								<div class="h-24 w-24 rounded-lg bg-gray-100 flex items-center justify-center">
									<Calendar size={40} class="text-gray-400" />
								</div>
							{/if}
						</div>
						
						<div class="flex-1 min-w-0">
							<h3 class="text-lg font-semibold">
								{#if event.url}
									<a href={event.url} target="_blank" rel="noopener noreferrer" class="hover:text-svelte-500">
										{event.title}
									</a>
								{:else}
									{event.title}
								{/if}
							</h3>
							
							{#if event.owner}
								<div class="text-sm text-gray-500 mt-0.5">
									{event.owner}
								</div>
							{/if}
							
							<div class="mt-2 space-y-1">
								{#if event.startTime}
									<div class="flex items-center gap-2 text-sm text-gray-600">
										<Calendar size={16} />
										<span>{new Date(event.startTime).toLocaleDateString('en-US', {
											weekday: 'short',
											month: 'short',
											day: 'numeric',
											hour: '2-digit',
											minute: '2-digit'
										})}</span>
									</div>
								{/if}
								
								{#if event.location}
									<div class="flex items-center gap-2 text-sm text-gray-600">
										<MapPin size={16} />
										<span>{event.location}</span>
									</div>
								{/if}
								
								{#if event.presentations && event.presentations.length > 0}
									<div class="flex items-center gap-2 text-sm text-gray-600">
										<User size={16} />
										<span>{event.presentations.length} presentation{event.presentations.length !== 1 ? 's' : ''}</span>
									</div>
								{/if}
							</div>
							
							{#if event.presentations && event.presentations.length > 0}
								<div class="mt-3 flex flex-wrap gap-2">
									{#each event.presentations.slice(0, 3) as presentation}
										<span class="text-xs bg-gray-100 px-2 py-1 rounded">
											{presentation.presenter}
										</span>
									{/each}
									{#if event.presentations.length > 3}
										<span class="text-xs text-gray-500">
											+{event.presentations.length - 3} more
										</span>
									{/if}
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>

	<!-- Past Events Section -->
	<section class="bg-gray-50 rounded-lg p-6">
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
					<div class="flex gap-4 rounded-lg border border-gray-200 bg-white p-4 hover:border-gray-300 transition-colors">
						<div class="flex-shrink-0">
							{#if event.socialCardUrl}
								<img 
									src={event.socialCardUrl} 
									alt={event.title}
									class="h-24 w-24 rounded-lg object-cover"
								/>
							{:else}
								<div class="h-24 w-24 rounded-lg bg-gray-200 flex items-center justify-center">
									<Calendar size={40} class="text-gray-500" />
								</div>
							{/if}
						</div>
						
						<div class="flex-1 min-w-0">
							<h3 class="text-lg font-semibold">
								{#if event.url}
									<a href={event.url} target="_blank" rel="noopener noreferrer" class="hover:text-svelte-500">
										{event.title}
									</a>
								{:else}
									{event.title}
								{/if}
							</h3>
							
							{#if event.owner}
								<div class="text-sm text-gray-500 mt-0.5">
									{event.owner}
								</div>
							{/if}
							
							<div class="mt-2 space-y-1">
								{#if event.startTime}
									<div class="flex items-center gap-2 text-sm text-gray-600">
										<Calendar size={16} />
										<span>{new Date(event.startTime).toLocaleDateString('en-US', {
											weekday: 'short',
											month: 'short',
											day: 'numeric',
											hour: '2-digit',
											minute: '2-digit'
										})}</span>
									</div>
								{/if}
								
								{#if event.location}
									<div class="flex items-center gap-2 text-sm text-gray-600">
										<MapPin size={16} />
										<span>{event.location}</span>
									</div>
								{/if}
								
								{#if event.presentations && event.presentations.length > 0}
									<div class="flex items-center gap-2 text-sm text-gray-600">
										<User size={16} />
										<span>{event.presentations.length} presentation{event.presentations.length !== 1 ? 's' : ''}</span>
									</div>
								{/if}
							</div>
							
							{#if event.presentations && event.presentations.length > 0}
								<div class="mt-3 flex flex-wrap gap-2">
									{#each event.presentations.slice(0, 3) as presentation}
										<span class="text-xs bg-gray-100 px-2 py-1 rounded">
											{presentation.presenter}
										</span>
									{/each}
									{#if event.presentations.length > 3}
										<span class="text-xs text-gray-500">
											+{event.presentations.length - 3} more
										</span>
									{/if}
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>
</div>