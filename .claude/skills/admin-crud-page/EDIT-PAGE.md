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

Use `ConfirmWithDialog` for destructive actions:

```svelte
<script>
  import ConfirmWithDialog from '$lib/ui/admin/ConfirmWithDialog.svelte'
  import Button from '$lib/ui/Button.svelte'
  import { deleteItem } from '../data.remote'

  const itemId = 'some-id'
  // Create isolated form instance for this item
  const remove = deleteItem.for(itemId)
</script>

<ConfirmWithDialog
  title="Delete Item"
  message="Are you sure? This action cannot be undone."
>
  {#snippet trigger()}
    <Button type="button" variant="danger">Delete</Button>
  {/snippet}
  {#snippet confirm()}
    <form {...remove.enhance(async ({ submit }) => {
      await submit()
      // Redirect happens server-side via redirect()
    })}>
      <Button type="submit" variant="danger" disabled={!!remove.pending}>
        {remove.pending ? 'Deleting...' : 'Confirm Delete'}
      </Button>
    </form>
  {/snippet}
</ConfirmWithDialog>
```

**Key points:**
- Use `form.for(id)` to create isolated instance
- Use `.enhance()` for progressive enhancement
- Redirect happens in the remote function

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

Standard layout with delete on left, cancel/save on right:

```svelte
<div class="flex justify-between border-t border-gray-200 pt-6">
  <!-- Delete button -->
  <ConfirmWithDialog
    title="Delete Item"
    message="Are you sure?"
  >
    {#snippet trigger()}
      <Button type="button" variant="danger">Delete</Button>
    {/snippet}
    {#snippet confirm()}
      <!-- Delete form -->
    {/snippet}
  </ConfirmWithDialog>

  <!-- Cancel and Save -->
  <div class="flex gap-3">
    <Button variant="secondary" href="/admin/items">Cancel</Button>
    <Button type="submit" disabled={!!updateItem.pending}>
      {updateItem.pending ? 'Saving...' : 'Save Changes'}
    </Button>
  </div>
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
