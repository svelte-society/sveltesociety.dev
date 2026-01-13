# Remote-First Architecture

**Principle: Put as little as possible in +page.svelte, as much as possible in data.remote.ts**

This pattern maximizes server-side logic and minimizes client-side complexity.

## Why Remote-First?

1. **Serializable Data**: Remote functions return JSON-serializable data, making SSR/hydration work seamlessly
2. **Type Safety**: TypeScript types flow from server to client automatically
3. **Simpler Pages**: Components become pure renderers, no business logic
4. **Testable**: Server-side logic is easier to unit test
5. **Smaller Bundles**: Less code shipped to the client

## Pattern: Pre-Built Data

Instead of returning raw data and building structures in the page, build the final structure in the remote function.

### Before (Logic in Page)

```svelte
<!-- +page.svelte -->
<script lang="ts">
  import { getItems, getFeaturedItems } from './data.remote'

  const items = await getItems()
  const featured = await getFeaturedItems()

  // Logic in the page - avoid this!
  const feed = buildFeed(items, featured)
  const sortedFeed = feed.sort((a, b) => b.priority - a.priority)
  const displayFeed = sortedFeed.map(item => ({
    ...item,
    label: item.type === 'featured' ? 'Featured' : 'Regular'
  }))
</script>

{#each displayFeed as item}
  <!-- render -->
{/each}
```

### After (Logic in Remote Function)

```ts
// data.remote.ts
export type FeedEntry =
	| { type: 'content'; id: string; content: ContentData }
	| { type: 'featured'; id: string; content: ContentData }
	| { type: 'cta'; id: string; cta: CTAProps }

export const getFeed = query(async () => {
	// All logic lives here
	const items = await getItems()
	const featured = await getFeaturedItems()
	const feed = buildFeed(items, featured)
	return feed.sort((a, b) => b.priority - a.priority)
})
```

```svelte
<!-- +page.svelte - Pure renderer -->
<script lang="ts">
  import { getFeed, type FeedEntry } from './data.remote'

  const feed = await getFeed()
</script>

{#each feed as item}
  {#if item.type === 'content'}
    <ContentCard content={item.content} />
  {:else if item.type === 'cta'}
    <CTA {...item.cta} />
  {/if}
{/each}
```

## Pattern: Component Mapping with `props`

Use a consistent `props` field and a component Map for clean rendering:

```ts
// data.remote.ts
export type CTAProps = { title: string; buttonText: string; buttonHref: string }
export type ContentProps = { content: ContentWithAuthor }

export type FeedEntry =
	| { type: 'content'; props: ContentProps }
	| { type: 'featured'; props: ContentProps }
	| { type: 'cta'; props: CTAProps }
	| { type: 'ad'; props: CTAProps }
```

```svelte
<!-- +page.svelte -->
<script lang="ts">
  import ContentCard from '$lib/ui/ContentCard.svelte'
  import FeaturedCard from '$lib/ui/FeaturedCard.svelte'
  import PromotionalCard from '$lib/ui/PromotionalCard.svelte'

  // Component map - easy to add new types
  const components = new Map([
    ['content', ContentCard],
    ['featured', FeaturedCard],
    ['cta', PromotionalCard],
    ['ad', PromotionalCard]
  ])

  // Promo types need variant prop
  const promoTypes = new Set(['cta', 'ad'])
</script>

{#each feed as item, index (index)}
  {@const Component = components.get(item.type)}
  {@const isPromo = promoTypes.has(item.type)}
  {#if isPromo}
    <Component {...item.props} variant={item.type} />
  {:else}
    <Component {...item.props} />
  {/if}
{/each}
```

## Key Rules

1. **Export types** from data.remote.ts so pages can use them for type safety
2. **No Component references** in remote data - components can't be serialized
3. **Build final structure** on the server - don't transform data in pages
4. **Use discriminated unions** for polymorphic data (type field determines shape)
5. **Use consistent `props` field** - enables `{...item.props}` spreading to components
6. **Use a component Map** - makes adding new types trivial
7. **Keep pages declarative** - pages just map data to components

## When to Apply

- Building feeds with mixed item types (content, ads, CTAs, featured)
- Complex list views with computed properties
- Any page where you're transforming query results before display
- Dashboard summaries with multiple data sources

## Real Example

See the homepage feed implementation:

- `src/routes/(app)/(public)/data.remote.ts` - Builds unified feed server-side
- `src/routes/(app)/(public)/+page.svelte` - Simple renderer with type-based component selection
