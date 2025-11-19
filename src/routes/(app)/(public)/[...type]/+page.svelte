<script lang="ts">
	import ContentCard from '$lib/ui/ContentCard.svelte'
	import Filters from './Filters.svelte'
	import Schema from '$lib/ui/Schema.svelte'
	import { getData } from './data.remote'
	import { page } from '$app/state'
	import Pagination from '$lib/ui/Pagination.svelte'

	const categories = [
		{
			label: 'All',
			value: ''
		},
		{
			label: 'Recipe',
			value: 'recipe'
		},
		{
			label: 'Video',
			value: 'video'
		},
		{
			label: 'Library',
			value: 'library'
		},
		{
			label: 'Announcement',
			value: 'announcement'
		},
		{
			label: 'Collection',
			value: 'collection'
		}
	]

	const sort = [
		{
			label: 'Newest',
			value: 'published_at'
		},
		{
			label: 'Most Likes',
			value: 'likes'
		},
		{
			label: 'Most Saved',
			value: 'saves'
		},
		{
			label: 'Most GitHub Stars',
			value: 'stars'
		}
	]

	let { content, count, tags, meta, schemas } = $derived(
		await getData({ url: page.url, type: page.params.type })
	)
</script>

{#if schemas}
	<Schema schema={schemas} />
{/if}

<Filters {categories} {tags} {sort} />

<div data-testid="content-list" class="grid gap-6">
	{#if count > 0}
		{#each content as content, index (content.id)}
			<div>
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
