<script lang="ts">
	import Button from '$lib/ui/Button.svelte'
	import Plus from 'phosphor-svelte/lib/Plus'
	import Tags, { type TagType } from '$lib/ui/Tags.svelte'
	import UpcomingEvents from './UpcomingEvents.svelte'
	import { type UpcomingEvent } from './types'

	let { upcomingEvents = [], tags }: { upcomingEvents?: UpcomingEvent[]; tags?: TagType[] } =
		$props()
</script>

<div
	class="@container sticky top-[--header-height] mr-4 hidden max-h-[calc(100vh-var(--header-height))] space-y-4 overflow-y-auto py-8 sm:block"
>
	<div class="grid grid-cols-1 items-start gap-1 @xs:grid-cols-[1fr_auto]">
		<div>
			<h3 class="text-lg font-semibold">Interested in contributing?</h3>
			<p class="text-sm">Share with the biggest community of Svelte enthusiasts in the world</p>
		</div>
		<Button href="/submit" size="sm"><Plus />Submit Post</Button>
	</div>

	{#if tags}
		<Tags {tags} />
	{/if}

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

	<UpcomingEvents events={upcomingEvents} />
</div>
