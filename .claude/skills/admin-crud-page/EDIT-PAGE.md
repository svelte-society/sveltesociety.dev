# Edit Page Pattern

Admin edit pages use forms with validation to update entities.

## Basic Structure

```svelte
<script lang="ts">
  import { page } from '$app/state'
  import PageHeader from '$lib/ui/admin/PageHeader.svelte'
  import { initForm } from '$lib/utils/form.svelte'
  import Input from '$lib/ui/Input.svelte'
  import Textarea from '$lib/ui/Textarea.svelte'
  import Select from '$lib/ui/Select.svelte'
  import Button from '$lib/ui/Button.svelte'
  import FileText from 'phosphor-svelte/lib/FileText'
  import { updateItem, getItem, deleteItem } from '../data.remote'

  const itemId = page.params.id!
  const item = await getItem({ id: itemId })

  // Initialize form with current values
  initForm(updateItem, () => ({
    id: itemId,
    name: item?.name ?? '',
    description: item?.description ?? '',
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

        <!-- Form fields here -->

        <div class="flex justify-between pt-4">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  </div>
</div>
```

## Form Initialization

Use `initForm` to populate form with existing data:

```typescript
import { initForm } from '$lib/utils/form.svelte'

// Simple initialization
initForm(updateItem, () => ({
  id: itemId,
  name: item?.name ?? '',
  status: item?.status ?? 'draft'
}))

// With nested data
initForm(updateItem, () => ({
  id: itemId,
  name: item?.name ?? '',
  tags: item?.tags?.map(t => t.id) ?? [],
  metadata: item?.metadata ?? {}
}))
```

## Form Components

The project uses custom form components that handle labels, descriptions, and validation errors automatically.

### Input Component

```svelte
<script>
  import Input from '$lib/ui/Input.svelte'
</script>

<Input
  label="Name"
  description="Enter the item name"
  {...updateItem.fields.name.as('text')}
  issues={updateItem.fields.name.issues()}
/>
```

**Props:**
- `label` - Field label text
- `description` - Helper text (hidden when errors present)
- `issues` - Array of validation issues from `.issues()`
- `type` - Input type (text, email, password, etc.)
- `...rest` - Spread form field attributes from `.as()`

### Textarea Component

```svelte
<script>
  import Textarea from '$lib/ui/Textarea.svelte'
</script>

<Textarea
  label="Description"
  description="Detailed description of the item"
  rows={4}
  {...updateItem.fields.description.as('text')}
  issues={updateItem.fields.description.issues()}
/>
```

**Props:**
- `label` - Field label text
- `description` - Helper text
- `rows` - Number of rows (default: 4)
- `issues` - Validation issues
- `...rest` - Spread form field attributes

### Select Component

```svelte
<script>
  import Select from '$lib/ui/Select.svelte'

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'archived', label: 'Archived' }
  ]
</script>

<Select
  label="Status"
  description="Current publication status"
  options={statusOptions}
  {...updateItem.fields.status.as('select')}
  issues={updateItem.fields.status.issues()}
/>
```

**Props:**
- `label` - Field label text
- `description` - Helper text
- `options` - Array of `{ value, label }` objects
- `issues` - Validation issues
- `onchange` - Optional change handler
- `...rest` - Spread form field attributes

### Hidden Fields

```svelte
<input {...updateItem.fields.id.as('hidden', itemId)} />
```

## Validation

Components handle validation display automatically when you pass `issues`:

```svelte
<!-- Issues are displayed automatically by the component -->
<Input
  label="Name"
  {...updateItem.fields.name.as('text')}
  issues={updateItem.fields.name.issues()}
/>
```

For all form errors:

```svelte
{#each updateItem.fields.allIssues() as issue}
  <p class="text-sm text-red-600">{issue.message}</p>
{/each}
```

## Submit Button with Loading State

```svelte
<Button type="submit" disabled={!!updateItem.pending}>
  {updateItem.pending ? 'Saving...' : 'Save Changes'}
</Button>
```

## Success Message

```svelte
{#if updateItem.result?.success}
  <div class="rounded-lg bg-green-50 p-4 text-green-800">
    Changes saved successfully!
  </div>
{/if}
```

## Delete Action

Delete uses a form with `.for(id)` and `.enhance()`. The redirect happens in the remote function.

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

**Remote function pattern:**

```typescript
// data.remote.ts
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

## Remote Functions Pattern

```typescript
// data.remote.ts
import { z } from 'zod/v4'
import { query, form, getRequestEvent, redirect } from '$app/server'
import { checkAdminAuth } from '../authorization.remote'

export const getItem = query(
  z.object({ id: z.string() }),
  async ({ id }) => {
    checkAdminAuth()
    const { locals } = getRequestEvent()
    return await locals.itemService.getById(id)
  }
)

export const updateItem = form(
  z.object({
    id: z.string(),
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    status: z.enum(['draft', 'published', 'archived'])
  }),
  async (data) => {
    checkAdminAuth()
    const { locals } = getRequestEvent()

    await locals.itemService.update(data.id, {
      name: data.name,
      description: data.description,
      status: data.status
    })

    // Refresh the item query
    await getItem({ id: data.id }).refresh()

    return { success: true }
  }
)
```

**Key points:**
- Always call `checkAdminAuth()` first in every admin remote function
- Use Zod for schema validation:
  - `z.string().min(1, 'message')` for required strings
  - `z.string().optional()` for optional strings
  - `z.enum(['a', 'b'])` for picklists

## ContentPicker for Relations

```svelte
<script>
  import ContentPicker from '$lib/ui/admin/ContentPicker.svelte'

  let selectedChildren = $state(item?.children?.map(c => c.id) ?? [])
</script>

<ContentPicker
  label="Child Items"
  options={availableChildren}
  bind:selected={selectedChildren}
/>

<input {...updateItem.fields.children.as('hidden', JSON.stringify(selectedChildren))} />
```

## Form with Multiple Sections

```svelte
<form {...updateItem} class="space-y-8">
  <!-- Basic Info Section -->
  <section class="space-y-4">
    <h3 class="text-lg font-semibold">Basic Information</h3>
    <Input label="Name" name="name" />
    <Textarea label="Description" name="description" />
  </section>

  <!-- Settings Section -->
  <section class="space-y-4">
    <h3 class="text-lg font-semibold">Settings</h3>
    <Select label="Status" name="status" options={statusOptions} />
  </section>

  <!-- Actions -->
  <div class="flex justify-between border-t pt-6">
    <Button variant="secondary" href="/admin/items">Cancel</Button>
    <Button type="submit">Save Changes</Button>
  </div>
</form>
```
