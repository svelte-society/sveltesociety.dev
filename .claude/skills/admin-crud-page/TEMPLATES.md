# Admin Page Templates

Copy and customize these templates.

---

## List Page Template

```svelte
<!-- src/routes/(admin)/admin/[feature]/+page.svelte -->
<script lang="ts">
  import { page } from '$app/state'
  import { formatRelativeDate } from '$lib/utils/date'
  import PageHeader from '$lib/ui/admin/PageHeader.svelte'
  import Table from '$lib/ui/admin/Table.svelte'
  import { Actions, Action } from '$lib/ui/admin/Actions'
  import Badge from '$lib/ui/admin/Badge.svelte'
  import Pagination from '$lib/ui/Pagination.svelte'
  import Input from '$lib/ui/Input.svelte'
  import Select from '$lib/ui/Select.svelte'
  import Plus from 'phosphor-svelte/lib/Plus'
  import FileText from 'phosphor-svelte/lib/FileText'
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
    { value: 'inactive', label: 'Inactive' },
    { value: 'archived', label: 'Archived' }
  ]

  const colorMap = new Map([
    ['active', 'success'],
    ['inactive', 'warning'],
    ['archived', 'danger']
  ])

  function getStatusColor(status: string): string {
    return colorMap.get(status) || 'default'
  }
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
  <PageHeader
    title="Items"
    description="Manage all items"
    icon={FileText}
  >
    {#snippet actions()}
      <a
        href="/admin/items/new"
        class="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-svelte-500 shadow-lg transition-all hover:bg-white/90"
      >
        <Plus class="h-4 w-4" weight="bold" />
        New Item
      </a>
    {/snippet}
  </PageHeader>

  <!-- Filter Form (auto-submits on change) -->
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

  <!-- Table -->
  {#if items}
    <Table action={true} data={items} testId="items-table">
      {#snippet header(classes)}
        <th class={classes}>Name</th>
        <th class={[classes, 'text-center']}>Status</th>
        <th class={classes}>Created</th>
      {/snippet}
      {#snippet row(item, classes)}
        <td class="{classes} font-medium">
          <a href={`/admin/items/${item.id}`} data-testid="item-edit-link">
            {item.name}
          </a>
        </td>
        <td class={classes}>
          <Badge color={getStatusColor(item.status)} text={item.status} />
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

    {#if items.length === 0}
      <div class="mt-8 text-center">
        <p class="text-gray-500">No items found.</p>
      </div>
    {/if}

    {#if pagination}
      <Pagination count={pagination.count} perPage={pagination.perPage} />
    {/if}
  {/if}
</div>
```

---

## Edit Page Template

```svelte
<!-- src/routes/(admin)/admin/[feature]/[id]/+page.svelte -->
<script lang="ts">
  import { page } from '$app/state'
  import PageHeader from '$lib/ui/admin/PageHeader.svelte'
  import { initForm } from '$lib/utils/form.svelte'
  import Input from '$lib/ui/Input.svelte'
  import Textarea from '$lib/ui/Textarea.svelte'
  import Select from '$lib/ui/Select.svelte'
  import Button from '$lib/ui/Button.svelte'
  import ConfirmWithDialog from '$lib/ui/admin/ConfirmWithDialog.svelte'
  import FileText from 'phosphor-svelte/lib/FileText'
  import { updateItem, getItem, deleteItem } from '../data.remote'

  const itemId = page.params.id!
  const item = await getItem({ id: itemId })

  initForm(updateItem, () => ({
    id: itemId,
    name: item?.name ?? '',
    description: item?.description ?? '',
    status: item?.status ?? 'draft'
  }))

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'active', label: 'Active' },
    { value: 'archived', label: 'Archived' }
  ]

  // Create isolated delete form instance for this item
  const remove = deleteItem.for(itemId)
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
  <PageHeader
    title="Edit Item"
    description="Update item information"
    icon={FileText}
  />

  <div class="rounded-2xl border border-gray-200 bg-white shadow-sm">
    <div class="border-b border-gray-100 bg-linear-to-r from-gray-50 to-white px-8 py-6">
      <div class="flex items-center gap-3">
        <div class="h-1 w-12 rounded-full bg-linear-to-r from-svelte-500 to-svelte-300"></div>
        <p class="text-sm font-medium text-gray-600">Item Details</p>
      </div>
    </div>

    <div class="p-8">
      <form {...updateItem} class="space-y-6">
        <input {...updateItem.fields.id.as('hidden', itemId)} />

        <Input
          label="Name"
          description="The display name for this item"
          {...updateItem.fields.name.as('text')}
          issues={updateItem.fields.name.issues()}
        />

        <Textarea
          label="Description"
          description="A detailed description of the item"
          rows={4}
          {...updateItem.fields.description.as('text')}
          issues={updateItem.fields.description.issues()}
        />

        <Select
          label="Status"
          description="Current publication status"
          options={statusOptions}
          {...updateItem.fields.status.as('select')}
          issues={updateItem.fields.status.issues()}
        />

        {#if updateItem.result?.success}
          <div class="rounded-lg bg-green-50 p-4 text-green-800">
            Changes saved successfully!
          </div>
        {/if}

        <div class="flex justify-between border-t border-gray-200 pt-6">
          <!-- Delete form with confirmation -->
          <ConfirmWithDialog
            title="Delete Item"
            message="Are you sure? This cannot be undone."
          >
            {#snippet trigger()}
              <Button type="button" variant="danger">Delete</Button>
            {/snippet}
            {#snippet confirm()}
              <form {...remove.enhance(async ({ submit }) => {
                await submit()
                // Redirect happens in the remote function
              })}>
                <Button type="submit" variant="danger" disabled={!!remove.pending}>
                  {remove.pending ? 'Deleting...' : 'Confirm Delete'}
                </Button>
              </form>
            {/snippet}
          </ConfirmWithDialog>

          <div class="flex gap-3">
            <Button variant="secondary" href="/admin/items">Cancel</Button>
            <Button type="submit" disabled={!!updateItem.pending}>
              {updateItem.pending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>
```

---

## data.remote.ts Template

```typescript
// src/routes/(admin)/admin/[feature]/data.remote.ts
import { z } from 'zod/v4'
import { parseSearchParams } from 'zod-search-params'
import { query, form, getRequestEvent, redirect, error } from '$app/server'
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
// QUERY: Get single item
// ============================================

export const getItem = query(
  z.object({ id: z.string() }),
  async ({ id }) => {
    checkAdminAuth()
    const { locals } = getRequestEvent()
    const item = await locals.itemService.getById(id)
    if (!item) error(404, 'Item not found')
    return item
  }
)

// ============================================
// FORM: Update item
// ============================================

export const updateItem = form(
  z.object({
    id: z.string(),
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    status: z.enum(['draft', 'active', 'archived'])
  }),
  async (data) => {
    checkAdminAuth()
    const { locals } = getRequestEvent()

    await locals.itemService.update(data.id, {
      name: data.name,
      description: data.description,
      status: data.status
    })

    await getItem({ id: data.id }).refresh()
    return { success: true }
  }
)

// ============================================
// FORM: Create item
// ============================================

export const createItem = form(
  z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional()
  }),
  async (data) => {
    checkAdminAuth()
    const { locals } = getRequestEvent()

    const id = await locals.itemService.create({
      name: data.name,
      description: data.description,
      status: 'draft'
    })

    redirect(303, `/admin/items/${id}`)
  }
)

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

---

## Create Page Template

```svelte
<!-- src/routes/(admin)/admin/[feature]/new/+page.svelte -->
<script lang="ts">
  import PageHeader from '$lib/ui/admin/PageHeader.svelte'
  import Input from '$lib/ui/Input.svelte'
  import Textarea from '$lib/ui/Textarea.svelte'
  import Button from '$lib/ui/Button.svelte'
  import Plus from 'phosphor-svelte/lib/Plus'
  import { createItem } from '../data.remote'
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
  <PageHeader
    title="New Item"
    description="Create a new item"
    icon={Plus}
  />

  <div class="rounded-2xl border border-gray-200 bg-white shadow-sm">
    <div class="p-8">
      <form {...createItem} class="space-y-6">
        <Input
          label="Name"
          description="The display name for this item"
          {...createItem.fields.name.as('text')}
          issues={createItem.fields.name.issues()}
        />

        <Textarea
          label="Description"
          description="A detailed description of the item"
          rows={4}
          {...createItem.fields.description.as('text')}
          issues={createItem.fields.description.issues()}
        />

        <div class="flex justify-end gap-3 border-t pt-6">
          <Button variant="secondary" href="/admin/items">Cancel</Button>
          <Button type="submit" disabled={!!createItem.pending}>
            {createItem.pending ? 'Creating...' : 'Create Item'}
          </Button>
        </div>
      </form>
    </div>
  </div>
</div>
```
