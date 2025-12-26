<script lang="ts">
	import X from 'phosphor-svelte/lib/X'
	import { page } from '$app/state'
	import { buildToggleHref } from './url-helpers'
	import { getCategories, getTags, getAuthors } from './data.remote'

	type FilterItem = {
		type: 'Category' | 'Tag' | 'Author'
		paramName: string
		value: string
		label: string
	}

	// Build lookup maps for labels (await the RemoteQuery promises)
	let categoryMap = $derived.by(async () => {
		const categories = await getCategories()
		return new Map(categories.map((c) => [c.value, c.label]))
	})

	let tagMap = $derived.by(async () => {
		const tags = await getTags()
		return new Map(tags.map((t) => [t.value, t.label]))
	})

	let authorMap = $derived.by(async () => {
		const authors = await getAuthors()
		return new Map(authors.map((a) => [a.value, a.label]))
	})

	// Get active filters from URL (needs to await the maps)
	async function getActiveFilters(): Promise<FilterItem[]> {
		const filters: FilterItem[] = []
		const catMap = await categoryMap
		const tMap = await tagMap
		const authMap = await authorMap

		// Get active types
		const types = page.url.searchParams.getAll('type')
		for (const value of types) {
			filters.push({
				type: 'Category',
				paramName: 'type',
				value,
				label: catMap.get(value) || value
			})
		}

		// Get active tags
		const tags = page.url.searchParams.getAll('tags')
		for (const value of tags) {
			filters.push({
				type: 'Tag',
				paramName: 'tags',
				value,
				label: tMap.get(value) || value
			})
		}

		// Get active authors
		const authors = page.url.searchParams.getAll('authors')
		for (const value of authors) {
			filters.push({
				type: 'Author',
				paramName: 'authors',
				value,
				label: authMap.get(value) || value
			})
		}

		return filters
	}

	let activeFilters = $derived(getActiveFilters())
</script>

{#await activeFilters then filters}
	{#if filters.length > 0}
		<div class="flex flex-wrap gap-2">
			{#each filters as filter (filter.paramName + filter.value)}
				<span
					class="flex items-center gap-1.5 rounded border border-slate-200 bg-slate-100 py-1 pl-2 pr-1 text-xs text-zinc-800"
				>
					<span class="text-zinc-500">{filter.type}:</span>
					<span>{filter.label}</span>
					<a
						href={buildToggleHref(
							page.url,
							page.route.id,
							page.params,
							filter.paramName,
							filter.value
						)}
						data-sveltekit-keepfocus
						aria-label="Remove {filter.type.toLowerCase()} filter: {filter.label}"
						class="rounded p-0.5 text-zinc-400 hover:bg-slate-200 hover:text-zinc-600 focus:outline-2 focus:outline-offset-1 focus:outline-svelte-300"
					>
						<X class="size-3" weight="bold" />
					</a>
				</span>
			{/each}
		</div>
	{/if}
{/await}
