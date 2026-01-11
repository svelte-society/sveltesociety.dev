# Detail Page Pattern

Detail pages display and edit a single item using forms.

## Structure

```svelte
<script lang="ts">
  import { page } from '$app/state'
  import { initForm } from '$lib/utils/form.svelte'
  import Input from '$lib/ui/Input.svelte'
  import Textarea from '$lib/ui/Textarea.svelte'
  import Select from '$lib/ui/Select.svelte'
  import Button from '$lib/ui/Button.svelte'
  import { updateItem, getItem } from './data.remote'

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

<form {...updateItem} class="space-y-6">
  <input {...updateItem.fields.id.as('hidden', itemId)} />

  <Input
    label="Name"
    {...updateItem.fields.name.as('text')}
    issues={updateItem.fields.name.issues()}
  />

  <Textarea
    label="Description"
    rows={4}
    {...updateItem.fields.description.as('text')}
    issues={updateItem.fields.description.issues()}
  />

  <Select
    label="Status"
    options={statusOptions}
    {...updateItem.fields.status.as('select')}
    issues={updateItem.fields.status.issues()}
  />

  <Button type="submit" disabled={!!updateItem.pending}>
    {updateItem.pending ? 'Saving...' : 'Save Changes'}
  </Button>
</form>
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

// With arrays
initForm(updateItem, () => ({
	id: itemId,
	tags: item?.tags?.map((t) => t.id) ?? []
}))
```

## Form Components

| Component  | Purpose                           |
| ---------- | --------------------------------- |
| `Input`    | Text, email, password, url inputs |
| `Textarea` | Multi-line text                   |
| `Select`   | Dropdown with options             |
| `Checkbox` | Boolean toggle                    |

**Common Props:**

- `label` - Field label
- `description` - Helper text (hidden when errors present)
- `issues` - Validation errors from `.issues()`
- `...rest` - Spread from `field.as('type')`

### Input Component

```svelte
<Input
  label="Name"
  description="Enter the item name"
  {...updateItem.fields.name.as('text')}
  issues={updateItem.fields.name.issues()}
/>
```

### Textarea Component

```svelte
<Textarea
  label="Description"
  rows={4}
  {...updateItem.fields.description.as('text')}
  issues={updateItem.fields.description.issues()}
/>
```

### Select Component

```svelte
<script>
  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' }
  ]
</script>

<Select
  label="Status"
  options={statusOptions}
  {...updateItem.fields.status.as('select')}
  issues={updateItem.fields.status.issues()}
/>
```

### Hidden Fields

```svelte
<input {...updateItem.fields.id.as('hidden', itemId)} />
```

## Validation Display

Components handle validation display automatically when you pass `issues`:

```svelte
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

## Loading States

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

## Remote Function

```typescript
// data.remote.ts
import { z } from 'zod/v4'
import { query, form, getRequestEvent, error } from '$app/server'

export const getItem = query(z.object({ id: z.string() }), async ({ id }) => {
	const { locals } = getRequestEvent()
	const item = await locals.service.getById(id)
	if (!item) error(404, 'Item not found')
	return item
})

export const updateItem = form(
	z.object({
		id: z.string(),
		name: z.string().min(1, 'Name is required'),
		description: z.string().optional(),
		status: z.enum(['draft', 'published'])
	}),
	async (data) => {
		const { locals } = getRequestEvent()
		await locals.service.update(data.id, data)

		// Refresh the item query
		await getItem({ id: data.id }).refresh()

		return { success: true }
	}
)
```

## Form Sections

For complex forms, organize into sections:

```svelte
<form {...updateItem} class="space-y-8">
  <!-- Basic Info Section -->
  <section class="space-y-4">
    <h3 class="text-lg font-semibold">Basic Information</h3>
    <Input label="Name" {...updateItem.fields.name.as('text')} />
    <Textarea label="Description" {...updateItem.fields.description.as('text')} />
  </section>

  <!-- Settings Section -->
  <section class="space-y-4">
    <h3 class="text-lg font-semibold">Settings</h3>
    <Select label="Status" options={statusOptions} {...updateItem.fields.status.as('select')} />
  </section>

  <!-- Actions -->
  <div class="flex justify-end gap-3 border-t pt-6">
    <Button variant="secondary" href="/items">Cancel</Button>
    <Button type="submit">Save Changes</Button>
  </div>
</form>
```
