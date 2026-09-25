<script>
	import User from 'phosphor-svelte/lib/User'
	import Calendar from 'phosphor-svelte/lib/Calendar'
	import MapPin from 'phosphor-svelte/lib/MapPin'
	let { event } = $props()
</script>

<div class="flex gap-4 rounded-lg border border-gray-200 bg-white p-4">
	<div class="flex-shrink-0">
		{#if event.socialCardUrl}
			<img src={event.socialCardUrl} alt={event.title} class="h-24 w-24 rounded-lg object-cover" />
		{:else}
			<div class="flex h-24 w-24 items-center justify-center rounded-lg bg-gray-100">
				<Calendar size={40} class="text-gray-400" />
			</div>
		{/if}
	</div>

	<div class="min-w-0 flex-1">
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
			<div class="mt-0.5 text-sm text-gray-500">
				{event.owner}
			</div>
		{/if}

		<div class="mt-2 space-y-1">
			{#if event.startTime}
				<div class="flex items-center gap-2 text-sm text-gray-600">
					<Calendar size={16} />
					<span
						>{new Date(event.startTime).toLocaleDateString('en-US', {
							weekday: 'short',
							month: 'short',
							day: 'numeric',
							hour: '2-digit',
							minute: '2-digit'
						})}</span
					>
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
					<span
						>{event.presentations.length} presentation{event.presentations.length !== 1
							? 's'
							: ''}</span
					>
				</div>
			{/if}
		</div>

		{#if event.presentations && event.presentations.length > 0}
			<div class="mt-3 flex flex-wrap gap-2">
				{#each event.presentations.slice(0, 3) as presentation}
					<span class="rounded bg-gray-100 px-2 py-1 text-xs">
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
