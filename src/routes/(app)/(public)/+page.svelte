<script lang="ts">
	import ContentCard from '$lib/ui/ContentCard.svelte'
	import FeaturedCard from '$lib/ui/FeaturedCard.svelte'
	import PromotionalCard from '$lib/ui/PromotionalCard.svelte'
	import SponsorCard from '$lib/ui/SponsorCard.svelte'
	import Schema from '$lib/ui/Schema.svelte'
	import { getHomeData } from './data.remote'
	import { page } from '$app/state'
	import Pagination from '$lib/ui/Pagination.svelte'
	import Filters from './Filters.svelte'

	const sort = [
		{ label: 'Newest', value: 'published_at' },
		{ label: 'Most Likes', value: 'likes' },
		{ label: 'Most Saved', value: 'saves' },
		{ label: 'Most GitHub Stars', value: 'stars' }
	]

	let { feed, count, meta, schemas } = $derived(await getHomeData({ url: page.url }))
</script>

{#if schemas}
	<Schema schema={schemas} />
{/if}

<div class="grid gap-4">
	<Filters {sort} />

	<div data-testid="content-list" class="grid gap-6">
		{#if count > 0}
			{#each feed as item, index (index)}
				{#if item.type === 'content'}
					<div class="min-w-0">
						<ContentCard
							layout="horizontal"
							{...item.props}
							priority={index < 2 ? 'high' : 'auto'}
						/>
					</div>
				{:else if item.type === 'featured'}
					<div class="min-w-0">
						<FeaturedCard layout="horizontal" {...item.props} priority="high" />
					</div>
				{:else if item.type === 'cta' || item.type === 'ad'}
					<PromotionalCard {...item.props} variant={item.type} />
				{:else if item.type === 'sponsor'}
					<SponsorCard {...item.props} />
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
</div>
