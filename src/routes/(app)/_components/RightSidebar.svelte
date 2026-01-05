<script lang="ts">
	import Button from '$lib/ui/Button.svelte'
	import Plus from 'phosphor-svelte/lib/Plus'
	import UpcomingEvents from './UpcomingEvents.svelte'
	import SidebarJobs from './SidebarJobs.svelte'
	import { type UpcomingEvent, type SidebarJob } from './types'

	let {
		upcomingEvents = [],
		jobs = []
	}: { upcomingEvents?: UpcomingEvent[]; jobs?: SidebarJob[] } = $props()
</script>

<aside
	class="@container mr-4 hidden space-y-4 py-8 sm:block [@media(min-height:1000px)]:sticky [@media(min-height:1000px)]:top-(--header-height) [@media(min-height:1000px)]:max-h-[calc(100vh-var(--header-height))] [@media(min-height:1000px)]:overflow-y-auto"
>
	<div class="grid grid-cols-1 items-start gap-1 @xs:grid-cols-[1fr_auto]">
		<div>
			<h3 class="text-lg font-semibold">Interested in contributing?</h3>
			<p class="text-sm">Share with the biggest community of Svelte enthusiasts in the world</p>
		</div>
		<Button href="/submit" size="sm"><Plus />Submit Post</Button>
	</div>

	<div class="grid gap-2 rounded border border-slate-200 bg-gray-50 px-4 py-2 text-sm">
		<h3 class="text-md font-bold">Become a sponsor</h3>
		<p class="text-xs text-gray-600">
			Support Svelte Society and get your company featured here.
			<a
				href="mailto:sponsor@sveltesociety.dev"
				class="text-orange-600 underline hover:text-orange-700"
			>
				Contact us
			</a>
		</p>
	</div>

	<SidebarJobs {jobs} />

	<UpcomingEvents events={upcomingEvents} />
</aside>
