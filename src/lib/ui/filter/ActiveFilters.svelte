<script lang="ts">
	import X from 'phosphor-svelte/lib/X'
	import { page } from '$app/state'
	import { buildToggleHref } from './url-helpers'
	import { getActiveFilters } from './data.remote'
	import Tag from '$lib/ui/Tag.svelte'

	let filters = $derived(await getActiveFilters(page.url.searchParams))
</script>

<div class="flex flex-wrap gap-2">
	{#each filters as filter (filter.paramName + filter.value)}
		{#if filter.type === 'Tag'}
			<Tag tag={{ id: filter.value, name: filter.label, slug: filter.value }} removable />
		{:else}
			<span
				class="flex items-center gap-1.5 rounded border border-slate-200 bg-slate-100 py-1 pl-2 pr-1 text-xs text-zinc-800"
			>
				<span class="font-semibold text-zinc-500">{filter.type}:</span>
				<span>{filter.label}</span>
				<a
					href={buildToggleHref(page.url, page.route.id, page.params, filter.paramName, filter.value)}
					data-sveltekit-preload-data="off"
					data-sveltekit-keepfocus
					aria-label="Remove {filter.type.toLowerCase()} filter: {filter.label}"
					class="rounded p-0.5 text-zinc-400 hover:bg-svelte-50 hover:text-svelte-600 focus:outline-2 focus:outline-offset-1 focus:outline-svelte-300"
				>
					<X class="size-3" weight="bold" />
				</a>
			</span>
		{/if}
	{/each}
	{#if filters.length > 1}
		<a
			href="/"
			data-sveltekit-preload-data="off"
			data-sveltekit-keepfocus
			class="flex items-center gap-1 rounded border border-slate-300 bg-white py-1 px-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-800 focus:outline-2 focus:outline-offset-1 focus:outline-svelte-300"
		>
			<X class="size-3" weight="bold" />
			<span>Clear all</span>
		</a>
	{/if}
</div>
