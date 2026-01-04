<script lang="ts">
	import ContentCard from '$lib/ui/ContentCard.svelte'
	import Schema from '$lib/ui/Schema.svelte'
	import { getHomeData } from './data.remote'
	import { page } from '$app/state'
	import Pagination from '$lib/ui/Pagination.svelte'
	import Filters from './Filters.svelte'
	import { ContentCTA } from '$lib/ui/cta'
	import { buildFeed, getFeedItemKey, type InterstitialConfig } from '$lib/utils/feed'

	const sort = [
		{ label: 'Newest', value: 'published_at' },
		{ label: 'Most Likes', value: 'likes' },
		{ label: 'Most Saved', value: 'saves' },
		{ label: 'Most GitHub Stars', value: 'stars' }
	]

	let { content, count, meta, schemas } = $derived(await getHomeData({ url: page.url }))

	// Page number for seeding random positions (SSR-consistent)
	const pageNum = Number(page.url.searchParams.get('page') || '1')

	// Interstitials configuration
	const interstitials: InterstitialConfig[] = [
		{
			id: 'jobs',
			type: 'cta',
			position: 'random',
			positionRange: [3, 8],
			component: ContentCTA,
			props: {
				title: 'Hiring Svelte Developers?',
				description: 'Reach thousands of Svelte developers looking for their next opportunity.',
				buttonText: 'Post a Job Starting at $199',
				buttonHref: '/jobs/submit'
			}
		}
	]

	// Build unified feed with content and interstitials
	const feed = $derived(buildFeed(content, interstitials, pageNum))
</script>

{#if schemas}
	<Schema schema={schemas} />
{/if}

<Filters {sort} />

<div data-testid="content-list" class="grid gap-6">
	{#if count > 0}
		{#each feed as item, index (getFeedItemKey(item))}
			{#if item.type === 'content'}
				<div class="min-w-0">
					<ContentCard content={item.data} priority={index < 2 ? 'high' : 'auto'} />
				</div>
			{:else if item.type === 'cta' || item.type === 'ad'}
				<svelte:component this={item.component} {...item.props} />
			{:else if item.type === 'featured'}
				<div class="min-w-0">
					<ContentCard content={item.data} priority="high" />
				</div>
			{/if}
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
