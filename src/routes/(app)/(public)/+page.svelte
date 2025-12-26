<script lang="ts">
	import ContentCard from '$lib/ui/ContentCard.svelte'
	import FilterDropdown from '$lib/ui/filter/FilterDropdown.svelte'
	import ActiveFilters from '$lib/ui/filter/ActiveFilters.svelte'
	import Schema from '$lib/ui/Schema.svelte'
	import { getHomeData, getTags } from './data.remote'
	import { page } from '$app/state'
	import Pagination from '$lib/ui/Pagination.svelte'
	import Filters from './Filters.svelte'

	const categories = [
		{ label: 'All', value: '' },
		{ label: 'Recipe', value: 'recipe' },
		{ label: 'Video', value: 'video' },
		{ label: 'Library', value: 'library' },
		{ label: 'Resource', value: 'resource' },
		{ label: 'Announcement', value: 'announcement' },
		{ label: 'Collection', value: 'collection' }
	]

	const sort = [
		{ label: 'Newest', value: 'published_at' },
		{ label: 'Most Likes', value: 'likes' },
		{ label: 'Most Saved', value: 'saves' },
		{ label: 'Most GitHub Stars', value: 'stars' }
	]

	let { content, count, meta, schemas } = $derived(await getHomeData({ url: page.url }))
</script>

{#if schemas}
	<Schema schema={schemas} />
{/if}

<Filters {categories} {sort} />

<div class="mb-4 flex flex-wrap items-center gap-4">
	<FilterDropdown />
	<ActiveFilters />
</div>

<div data-testid="content-list" class="grid gap-6">
	{#if count > 0}
		{#each content as content, index (content.id)}
			<div class="min-w-0">
				<ContentCard {content} priority={index < 2 ? 'high' : 'auto'} />
			</div>
		{/each}
	{:else}
		<div data-testid="no-content-message" class="py-10 text-center">
			<h2 class="text-2xl font-bold">No content found</h2>
			<p class="text-gray-500">Try adjusting your filters or check back later.</p>
		</div>
	{/if}
	{#if count > 0}
		<Pagination {count} perPage={30} />
	{/if}
</div>
