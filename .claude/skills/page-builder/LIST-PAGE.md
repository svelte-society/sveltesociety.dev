# List Page Pattern

List pages display collections with filtering, search, and pagination.

## Structure

```svelte
<script lang="ts">
  import { page } from '$app/state'
  import Pagination from '$lib/ui/Pagination.svelte'
  import Input from '$lib/ui/Input.svelte'
  import Select from '$lib/ui/Select.svelte'
  import { getItems } from './data.remote'

  // Fetch data using URL search params
  const { items, count } = $derived(await getItems({ url: page.url }))

  // Form reference for auto-submit
  let form: HTMLFormElement
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  function submitForm() {
    form.requestSubmit()
  }

  function debouncedSubmit() {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(submitForm, 300)
  }
</script>

<!-- Filter Form -->
<form bind:this={form} class="mb-4 grid gap-3 sm:grid-cols-[1fr_auto]">
  <Input
    name="search"
    type="text"
    value={page.url.searchParams.get('search') || ''}
    oninput={debouncedSubmit}
    placeholder="Search..."
  />

  <Select
    name="status"
    options={statusOptions}
    value={page.url.searchParams.get('status') || ''}
    onchange={submitForm}
  />
</form>

<!-- Items -->
<div class="grid gap-4">
  {#each items as item, index (index)}
    <ItemCard {item} />
  {/each}
</div>

<!-- Pagination -->
<Pagination {count} perPage={20} />
```

## Filter Form Patterns

### Text Input (Debounced)

```svelte
<Input
  name="search"
  value={page.url.searchParams.get('search') || ''}
  oninput={debouncedSubmit}
  placeholder="Search..."
/>
```

Use 300ms debounce to avoid excessive requests while typing.

### Select (Immediate)

```svelte
<Select
  name="status"
  options={[
    { value: '', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'archived', label: 'Archived' }
  ]}
  value={page.url.searchParams.get('status') || ''}
  onchange={submitForm}
/>
```

### Clear Filters

```svelte
{#if page.url.search}
  <a href={page.url.pathname} class="text-sm text-gray-500">
    Clear filters
  </a>
{/if}
```

## Remote Function

```typescript
// data.remote.ts
import { z } from 'zod/v4'
import { parseSearchParams } from 'zod-search-params/v4'
import { query, getRequestEvent } from '$app/server'

const inputSchema = z.object({
	url: z.instanceof(URL)
})

const filtersSchema = z.object({
	search: z.string().catch(''),
	status: z.string().catch(''),
	page: z.number().catch(1)
})

export const getItems = query(inputSchema, async ({ url }) => {
	const { locals } = getRequestEvent()
	const perPage = 20

	const filters = parseSearchParams(filtersSchema, url.searchParams)
	const offset = (filters.page - 1) * perPage

	const result = locals.service.search({
		query: filters.search || undefined,
		status: filters.status || undefined,
		limit: perPage,
		offset
	})

	return {
		items: result.hits,
		count: result.total
	}
})
```

## Empty State

```svelte
{#if items.length === 0}
  <div class="py-10 text-center">
    <p class="text-gray-500">No items found.</p>
  </div>
{/if}
```

## Component Mapping for Mixed Types

When items have different types, use a component map:

```svelte
<script>
  const components = new Map([
    ['article', ArticleCard],
    ['video', VideoCard],
    ['job', JobCard]
  ])
</script>

{#each items as item, index (index)}
  {@const Component = components.get(item.type)}
  <Component {...item.props} />
{/each}
```
