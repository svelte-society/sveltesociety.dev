# Admin List Page Pattern

Admin list pages display data in tables with row actions.

For filter forms, search, and pagination patterns, see [page-builder/LIST-PAGE.md](../page-builder/LIST-PAGE.md).

## PageHeader Component

```svelte
<script>
  import PageHeader from '$lib/ui/admin/PageHeader.svelte'
  import Plus from 'phosphor-svelte/lib/Plus'
  import FileText from 'phosphor-svelte/lib/FileText'
</script>

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

## Table Component

```svelte
<script>
  import Table from '$lib/ui/admin/Table.svelte'
  import Badge from '$lib/ui/admin/Badge.svelte'
  import { Actions, Action } from '$lib/ui/admin/Actions'
  import { formatRelativeDate } from '$lib/utils/date'
</script>

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
<script>
  import { Actions, Action } from '$lib/ui/admin/Actions'
  import ArrowsClockwise from 'phosphor-svelte/lib/ArrowsClockwise'
</script>

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

**Action Types:**
- `Action.Edit` - Link to edit page
- `Action.Delete` - Delete with confirmation dialog
- `Action.Button` - Custom action with form

## Badge Component

```svelte
<Badge color="success" text="Published" />
<Badge color="warning" text="Draft" />
<Badge color="danger" text="Archived" />
<Badge color="default" text="Unknown" />
```

**Color mapping:**

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

## Empty State

```svelte
{#if items.length === 0}
  <div class="mt-8 text-center">
    <p class="text-gray-500">No items found.</p>
  </div>
{/if}
```

## Remote Functions

Admin remote functions must call `checkAdminAuth()`:

```typescript
import { z } from 'zod/v4'
import { parseSearchParams } from 'zod-search-params'
import { query, form, getRequestEvent, redirect } from '$app/server'
import { checkAdminAuth } from '../authorization.remote'

const filtersSchema = z.object({
  search: z.string().catch(''),
  status: z.string().catch(''),
  page: z.number().catch(1)
})

export const getItems = query("unchecked", async (searchParams: URLSearchParams) => {
  checkAdminAuth()  // Always first!
  const { locals } = getRequestEvent()
  const perPage = 20

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
- Always call `checkAdminAuth()` first
- Use `"unchecked"` schema for list queries with `URLSearchParams`
- Delete redirects server-side via `redirect()`
