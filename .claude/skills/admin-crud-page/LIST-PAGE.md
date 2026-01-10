# List Page Pattern

Admin list pages display data in tables with filtering, search, and actions.

## Basic Structure

```svelte
<script lang="ts">
  import { page } from '$app/state'
  import PageHeader from '$lib/ui/admin/PageHeader.svelte'
  import Table from '$lib/ui/admin/Table.svelte'
  import { Actions, Action } from '$lib/ui/admin/Actions'
  import Badge from '$lib/ui/admin/Badge.svelte'
  import Pagination from '$lib/ui/Pagination.svelte'
  import Input from '$lib/ui/Input.svelte'
  import Select from '$lib/ui/Select.svelte'
  import FileText from 'phosphor-svelte/lib/FileText'
  import Plus from 'phosphor-svelte/lib/Plus'
  import { getItems, deleteItem } from './data.remote'

  // Fetch data using URL search params
  const { items, pagination } = $derived(await getItems(page.url.searchParams))

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

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ]
</script>
```

## PageHeader Component

```svelte
<PageHeader
  title="Items"
  description="Manage all items"
  icon={FileText}
>
  {#snippet actions()}
    <a
      href="/admin/items/new"
      class="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-svelte-500 shadow-lg"
    >
      <Plus class="h-4 w-4" weight="bold" />
      New Item
    </a>
  {/snippet}
</PageHeader>
```

**Props:**
- `title` - Page title
- `description` - Subtitle text
- `icon` - Phosphor icon component
- `actions` - Snippet for action buttons

## Filter Form (Auto-Submit)

Use a native `<form>` that auto-submits on input change. This adds search params to the URL, which triggers a re-fetch of data.

```svelte
<form bind:this={form} class="mb-4 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
  <Input
    name="search"
    type="text"
    value={page.url.searchParams.get('search') || ''}
    oninput={debouncedSubmit}
    placeholder="Search items..."
  />

  <Select
    name="status"
    options={statusOptions}
    value={page.url.searchParams.get('status') || ''}
    onchange={submitForm}
  />

  {#if page.url.search}
    <a href={page.url.pathname} class="self-center text-sm text-gray-500 hover:text-gray-700">
      Clear filters
    </a>
  {/if}
</form>
```

**Key points:**
- Text inputs use `debouncedSubmit` (300ms delay) to avoid excessive requests
- Select inputs use `submitForm` for immediate filtering
- "Clear filters" link navigates to base URL (removes all params)
- Values are read from `page.url.searchParams` to reflect current URL state

## Table Component

```svelte
<Table action={true} data={items} testId="items-table">
  {#snippet header(classes)}
    <th class={classes}>Name</th>
    <th class={[classes, 'text-center']}>Status</th>
    <th class={classes}>Created</th>
  {/snippet}

  {#snippet row(item, classes)}
    <td class="{classes} font-medium">
      <a href={`/admin/items/${item.id}`}>{item.name}</a>
    </td>
    <td class={classes}>
      <Badge color={item.active ? 'success' : 'warning'} text={item.status} />
    </td>
    <td class={classes}>
      {formatRelativeDate(item.created_at)}
    </td>
  {/snippet}

  {#snippet actionCell(item)}
    <Actions id={item.id}>
      <Action.Edit href={`/admin/items/${item.id}`} />
      <Action.Delete form={deleteItem} confirm={`Delete "${item.name}"?`} />
    </Actions>
  {/snippet}
</Table>
```

**Props:**
- `data` - Array of items to display
- `action` - Show action column (boolean)
- `testId` - Test ID for E2E tests
- `header` - Snippet for table headers
- `row` - Snippet for table rows
- `actionCell` - Snippet for action buttons

## Actions Component

```svelte
import { Actions, Action } from '$lib/ui/admin/Actions'

<Actions id={item.id}>
  <!-- Edit link -->
  <Action.Edit href={`/admin/items/${item.id}`} />

  <!-- Delete with confirmation -->
  <Action.Delete form={deleteItem} confirm={`Delete "${item.name}"?`} />

  <!-- Custom button action -->
  <Action.Button
    icon={ArrowsClockwise}
    form={refreshItem}
    variant="info"
    tooltip="Refresh"
    testId="refresh-button"
  />
</Actions>
```

## Badge Colors

```typescript
const colorMap = new Map([
  ['pending_review', 'warning'],
  ['draft', 'warning'],
  ['published', 'success'],
  ['archived', 'danger'],
  ['active', 'success'],
  ['inactive', 'default']
])

function getStatusColor(status: string): string {
  return colorMap.get(status) || 'default'
}
```

## Pagination

```svelte
{#if pagination}
  <Pagination count={pagination.count} perPage={pagination.perPage} />
{/if}
```

## Empty State

```svelte
{#if items.length === 0}
  <div class="mt-8 text-center">
    <p class="text-gray-500">No items found.</p>
  </div>
{/if}
```

## Remote Functions Pattern

```typescript
// data.remote.ts
import { z } from 'zod/v4'
import { parseSearchParams } from 'zod-search-params'
import { query, form, getRequestEvent, redirect } from '$app/server'
import { checkAdminAuth } from '../authorization.remote'

// ============================================
// QUERY: List with filters
// ============================================

// Define schema with .catch() for defaults - do NOT use coerce
const filtersSchema = z.object({
  search: z.string().catch(''),
  status: z.string().catch(''),
  page: z.number().catch(1)
})

export const getItems = query("unchecked", async (searchParams: URLSearchParams) => {
  checkAdminAuth()
  const { locals } = getRequestEvent()
  const perPage = 20

  // Parse with zod-search-params (auto-coerces types)
  const { search, status, page } = parseSearchParams(filtersSchema, searchParams)

  const result = await locals.itemService.getFiltered({
    search: search || undefined,
    status: status || undefined,
    page,
    perPage
  })

  return {
    items: result.items,
    pagination: { count: result.total, perPage }
  }
})

// ============================================
// FORM: Delete item
// ============================================

export const deleteItem = form(
  z.object({ id: z.string() }),
  async ({ id }) => {
    checkAdminAuth()
    const { locals } = getRequestEvent()
    await locals.itemService.delete(id)
    redirect(303, '/admin/items')
  }
)
```

**Key points:**
- Always call `checkAdminAuth()` first in every admin remote function
- Use `"unchecked"` schema for list queries that accept `URLSearchParams`
- Use `parseSearchParams(schema, searchParams)` from `zod-search-params` to parse URL params
- Define filter schema with `.catch()` for default values - do NOT use `coerce` (it's applied automatically)
- Delete redirects server-side via `redirect()`
