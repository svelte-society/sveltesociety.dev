<script lang="ts">
	import Button from '$lib/ui/Button.svelte'
	import NewsletterSubscribe from '$lib/ui/NewsletterSubscribe.svelte'
	import Plus from 'phosphor-svelte/lib/Plus'
	import UpcomingEvents from './UpcomingEvents.svelte'
	import SidebarJobs from './SidebarJobs.svelte'
	import SidebarSponsors from './SidebarSponsors.svelte'
	import { type UpcomingEvent, type SidebarJob, type SidebarSponsor } from './types'
	import type { User } from '$lib/server/services/user'

	let {
		upcomingEvents = [],
		jobs = [],
		sponsors = [],
		user = null
	}: {
		upcomingEvents?: UpcomingEvent[]
		jobs?: SidebarJob[]
		sponsors?: SidebarSponsor[]
		user?: User | null
	} = $props()
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

	<SidebarSponsors {sponsors} />

	{#if user?.newsletter_preference !== 'subscribed'}
		<NewsletterSubscribe />
	{/if}

	<SidebarJobs {jobs} />

	<UpcomingEvents events={upcomingEvents} />
</aside>
