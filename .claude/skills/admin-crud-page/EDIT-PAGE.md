# Admin Edit Page Pattern

Admin edit pages use PageHeader for consistent styling and ConfirmWithDialog for destructive actions.

For form components, validation, and initialization patterns, see [page-builder/DETAIL-PAGE.md](../page-builder/DETAIL-PAGE.md).

## Basic Structure

```svelte
<script lang="ts">
  import { page } from '$app/state'
  import PageHeader from '$lib/ui/admin/PageHeader.svelte'
  import { initForm } from '$lib/utils/form.svelte'
  import Input from '$lib/ui/Input.svelte'
  import Button from '$lib/ui/Button.svelte'
  import FileText from 'phosphor-svelte/lib/FileText'
  import { updateItem, getItem } from '../data.remote'

  const itemId = page.params.id!
  const item = await getItem({ id: itemId })

  initForm(updateItem, () => ({
    id: itemId,
    name: item?.name ?? '',
    status: item?.status ?? 'draft'
  }))
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
  <PageHeader
    title="Edit Item"
    description="Update item information and settings"
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
          {...updateItem.fields.name.as('text')}
          issues={updateItem.fields.name.issues()}
        />

        <div class="flex justify-between pt-4">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  </div>
</div>
```

## PageHeader in Edit Context

```svelte
<PageHeader
  title="Edit Item"
  description="Update item information and settings"
  icon={FileText}
/>
```

For edit pages, use descriptive title and helpful description. No actions snippet needed (save/delete are in the form).

## Card Wrapper Pattern

Admin edit forms use a card wrapper for visual consistency:

```svelte
<div class="rounded-2xl border border-gray-200 bg-white shadow-sm">
  <!-- Section header -->
  <div class="border-b border-gray-100 bg-linear-to-r from-gray-50 to-white px-8 py-6">
    <div class="flex items-center gap-3">
      <div class="h-1 w-12 rounded-full bg-linear-to-r from-svelte-500 to-svelte-300"></div>
      <p class="text-sm font-medium text-gray-600">Section Title</p>
    </div>
  </div>

  <!-- Form content -->
  <div class="p-8">
    <form class="space-y-6">
      <!-- Form fields -->
    </form>
  </div>
</div>
```

## Delete with Confirmation

For delete actions in list pages, use `Action.Delete` in the Actions component (see [LIST-PAGE.md](./LIST-PAGE.md)).

For standalone delete confirmation dialogs, this project currently uses `Action.Delete` in the list page rather than individual edit page delete buttons. The `Action.Delete` component automatically handles confirmation with remote functions.

**Example in list page:**
```svelte
{#snippet actionCell(item)}
  <Actions id={item.id}>
    <Action.Edit href={`/admin/items/${item.id}`} />
    <Action.Delete
      form={deleteItem}
      confirm="Are you sure you want to delete this item?"
    />
  </Actions>
{/snippet}
```

**Note:** The existing `ConfirmWithDialog` component uses form actions which don't align with our remote functions architecture. For delete functionality, prefer using `Action.Delete` in list pages.

## ContentPicker for Relations

```svelte
<script>
  import ContentPicker from '$lib/ui/admin/ContentPicker.svelte'

  let selectedChildren = $state(item?.children?.map(c => c.id) ?? [])
</script>

<ContentPicker
  label="Related Items"
  options={availableItems}
  bind:selected={selectedChildren}
/>

<input {...updateItem.fields.children.as('hidden', JSON.stringify(selectedChildren))} />
```

## Form Actions Layout

Standard layout with cancel/save buttons:

```svelte
<div class="flex justify-end gap-4 border-t border-gray-200 pt-6">
  <Button variant="secondary" href="/admin/items">Cancel</Button>
  <Button type="submit" disabled={!!updateItem.pending}>
    {updateItem.pending ? 'Saving...' : 'Save Changes'}
  </Button>
</div>
```

## Remote Function with Refresh

```typescript
import { z } from 'zod/v4'
import { query, form, getRequestEvent, redirect, error } from '$app/server'
import { checkAdminAuth } from '../authorization.remote'

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

export const updateItem = form(
  z.object({
    id: z.string(),
    name: z.string().min(1, 'Name is required'),
    status: z.enum(['draft', 'active', 'archived'])
  }),
  async (data) => {
    checkAdminAuth()
    const { locals } = getRequestEvent()

    await locals.itemService.update(data.id, {
      name: data.name,
      status: data.status
    })

    // Refresh the item query
    await getItem({ id: data.id }).refresh()

    return { success: true }
  }
)

export const deleteItem = form(
  z.object({ id: z.string() }),
  async ({ id }) => {
    checkAdminAuth()
    const { locals } = getRequestEvent()
    await locals.itemService.delete(id)

    // Redirect back to list page
    redirect(303, '/admin/items')
  }
)
```
