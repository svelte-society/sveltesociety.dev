<script lang="ts">
	import Button from '$lib/ui/Button.svelte'
	import Plus from 'phosphor-svelte/lib/Plus'
	import UpcomingEvents from './UpcomingEvents.svelte'

	interface UpcomingEvent {
		type: string
		slug: string
		title: string
		metadata: {
			startTime: string
			endTime?: string
			location?: string
			url?: string
			presentations: Array<{
				title: string
				presenter: string
				description: string
				videoUrl?: string
			}>
			socialCardUrl?: string
		}
	}

	let { upcomingEvents = [] }: { upcomingEvents?: UpcomingEvent[] } = $props()
</script>

<div class="@container mr-4 hidden space-y-4 overflow-y-auto py-8 sm:block">
	<div class="mb-4 grid grid-cols-1 items-start gap-1 @xs:grid-cols-[1fr_auto]">
		<h3 class="text-lg font-semibold">Interested in contributing?</h3>
		<Button href="/submit" size="sm"><Plus />Submit Post</Button>
	</div>
	<p class="mb-4 text-sm">Share with the biggest community of Svelte enthusiasts in the world</p>

	<div class="min-w-0 rounded bg-amber-100 p-3 text-xs">
		<p class="text-wrap">
			Welcome to Svelte Society, homepage for everything Svelte. Find what you're looking for in the
			left menu!
		</p>
	</div>

	<div class="grid gap-2 rounded border-1 border-slate-200 bg-gray-50 px-4 py-2 text-sm">
		<h3 class="text-md font-bold">Our sponsors:</h3>
		<ul class="flex flex-wrap gap-2">
			<li>ACME Inc.</li>
			<li>John Doe Inc.</li>
		</ul>
	</div>

	<UpcomingEvents events={upcomingEvents} />
</div>
