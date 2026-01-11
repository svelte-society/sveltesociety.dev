# Feed Page Pattern

Feed pages display mixed-type items (content, CTAs, ads, featured items) using a component map.

## Core Principle

**Build the feed server-side, render with a component map client-side.**

The remote function returns a `FeedEntry[]` where each entry has:

- `type` - Used to look up the component
- `props` - Spread directly onto the component

## Page Structure

```svelte
<script lang="ts">
  import ContentCard from '$lib/ui/ContentCard.svelte'
  import FeaturedCard from '$lib/ui/FeaturedCard.svelte'
  import CTACard from '$lib/ui/CTACard.svelte'
  import AdCard from '$lib/ui/AdCard.svelte'
  import { getFeed } from './data.remote'
  import { page } from '$app/state'

  const { feed, count } = $derived(await getFeed({ url: page.url }))

  // Map types to components
  const components = new Map([
    ['content', ContentCard],
    ['featured', FeaturedCard],
    ['cta', CTACard],
    ['ad', AdCard]
  ])
</script>

<div class="grid gap-6">
  {#each feed as item, index (index)}
    {@const Component = components.get(item.type)}
    <Component {...item.props} />
  {/each}
</div>
```

## Feed Entry Type

Define a discriminated union for feed entries in `data.remote.ts`:

```typescript
// Props for each component type
export type CTAProps = {
	title: string
	description: string
	buttonText: string
	buttonHref: string
}

export type ContentProps = {
	content: ContentWithAuthor
}

// Discriminated union - all have `props` for spreading
export type FeedEntry =
	| { type: 'content'; props: ContentProps }
	| { type: 'cta'; props: CTAProps }
	| { type: 'ad'; props: CTAProps }
	| { type: 'featured'; props: ContentProps }
```

## Remote Function

Build the complete feed server-side:

```typescript
export const getFeed = query(inputSchema, async ({ url }) => {
  const { locals } = getRequestEvent()

  // Get main content
  const searchResults = locals.searchService.search({ ... })
  const content = searchResults.hits.map(h => locals.contentService.getById(h.id))

  // Get insertable items (CTAs, ads, featured)
  const feedItems = locals.feedItemService.getActiveFeedItems()

  // Build insertables with proper FeedEntry format
  const insertables = feedItems.map(item => {
    if (item.item_type === 'featured') {
      const fullContent = locals.contentService.getById(item.content_id)
      return {
        type: 'featured',
        positionType: item.position_type,
        positionFixed: item.position_fixed,
        entry: { type: 'featured', props: { content: fullContent } }
      }
    }

    return {
      type: item.item_type,
      positionType: item.position_type,
      positionFixed: item.position_fixed,
      entry: {
        type: item.item_type,
        props: {
          title: item.title,
          description: item.description,
          buttonText: item.button_text,
          buttonHref: item.button_href
        }
      }
    }
  })

  const feed = buildUnifiedFeed(content, insertables, pageNum)
  return { feed, count: searchResults.count }
})
```

## Building the Feed

Insert items at positions using a utility function:

```typescript
type InsertableItem = {
	type: string
	positionType: 'fixed' | 'random'
	positionFixed: number | null
	positionRangeMin: number
	positionRangeMax: number
	priority: number
	entry: FeedEntry
}

function buildUnifiedFeed(
	content: ContentWithAuthor[],
	insertables: InsertableItem[],
	seed: number
): FeedEntry[] {
	// Start with content items
	const feed: FeedEntry[] = content.map((c) => ({
		type: 'content',
		props: { content: c }
	}))

	// Seeded random for SSR-consistent positioning
	const random = seededRandom(seed)

	// Sort by priority, calculate positions
	const sortedInsertables = [...insertables].sort((a, b) => b.priority - a.priority)

	const insertions = sortedInsertables.map((item) => {
		let position: number
		if (item.positionType === 'fixed' && item.positionFixed !== null) {
			position = item.positionFixed
		} else {
			const min = item.positionRangeMin
			const max = item.positionRangeMax
			position = min + Math.floor(random() * (max - min + 1))
		}
		return { position: Math.max(0, Math.min(position, feed.length)), entry: item.entry }
	})

	// Insert from end to avoid index shifts
	insertions.sort((a, b) => b.position - a.position)
	for (const { position, entry } of insertions) {
		feed.splice(position, 0, entry)
	}

	return feed
}
```

## Seeded Random for SSR

Use seeded random to ensure consistent positions between server and client:

```typescript
function seededRandom(seed: number): () => number {
	let state = seed
	return () => {
		state = (state * 1103515245 + 12345) & 0x7fffffff
		return state / 0x7fffffff
	}
}
```

Use page number as seed for pagination consistency.

## Conditional Props by Type

Some components need extra props based on type:

```svelte
<script>
  // Types that need wrapper div and priority prop
  const cardTypes = new Set(['content', 'featured'])
</script>

{#each feed as item, index (index)}
  {@const Component = components.get(item.type)}
  {@const isCard = cardTypes.has(item.type)}
  {#if isCard}
    <div class="min-w-0">
      <Component
        {...item.props}
        priority={item.type === 'featured' || index < 2 ? 'high' : 'auto'}
      />
    </div>
  {:else}
    <Component {...item.props} />
  {/if}
{/each}
```

## Default Fallback

Provide a default item when no insertables exist:

```typescript
const DEFAULT_CTA: FeedEntry = {
	type: 'cta',
	props: {
		title: 'Hiring Developers?',
		description: 'Reach thousands of developers.',
		buttonText: 'Post a Job',
		buttonHref: '/jobs/submit'
	}
}

function buildUnifiedFeed(content, insertables, seed) {
	const feed = content.map((c) => ({ type: 'content', props: { content: c } }))

	if (insertables.length === 0 && feed.length >= 3) {
		const random = seededRandom(seed)
		const position = 3 + Math.floor(random() * 5)
		feed.splice(Math.min(position, feed.length), 0, DEFAULT_CTA)
		return feed
	}

	// ... rest of insertion logic
}
```

## Empty State

```svelte
{#if feed.length === 0}
  <div class="py-10 text-center">
    <h2 class="text-2xl font-bold">No content found</h2>
    <p class="text-gray-500">Try adjusting your filters.</p>
  </div>
{/if}
```

## Key Rules

1. **All logic in data.remote.ts** - Page is a pure renderer
2. **Consistent `props` field** - Every FeedEntry has props for component spreading
3. **Use index as key** - `{#each feed as item, index (index)}`
4. **Component Map** - Map types to components, no if/else chains
5. **Seeded random** - Ensures SSR/client consistency for random positions
