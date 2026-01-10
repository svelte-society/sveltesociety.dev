---
name: Admin CRUD Page
description: Create admin dashboard pages with tables, forms, and actions
---

# Admin CRUD Page Pattern

Use this skill when creating admin pages for managing entities.

## When to Use

- Adding a new admin section (e.g., /admin/[feature])
- Creating list pages with filtering, search, pagination
- Creating edit/create forms with validation
- Adding quick actions (edit, delete, custom actions)

## Route Structure

Admin routes live in `src/routes/(admin)/admin/`:

```
src/routes/(admin)/admin/
└── [feature]/
    ├── +page.svelte          # List page
    ├── data.remote.ts        # Remote functions (queries, forms, commands)
    ├── [id]/
    │   └── +page.svelte      # Edit page
    └── new/
        └── +page.svelte      # Create page (optional)
```

## Key Components

| Component | Purpose | Import |
|-----------|---------|--------|
| `PageHeader` | Page title with icon and actions | `$lib/ui/admin/PageHeader.svelte` |
| `Table` | Data table with snippets for header/row/actions | `$lib/ui/admin/Table.svelte` |
| `AdminList` | Simple wrapper with title and "New" button | `$lib/ui/admin/AdminList.svelte` |
| `StatusSelect` | Status filter dropdown | `$lib/ui/admin/StatusSelect.svelte` |
| `TypeSelect` | Content type filter | `$lib/ui/admin/TypeSelect.svelte` |
| `Badge` | Status/type badges | `$lib/ui/admin/Badge.svelte` |
| `Actions` | Row action buttons (edit, delete, custom) | `$lib/ui/admin/Actions` |
| `ContentPicker` | Select related content | `$lib/ui/admin/ContentPicker.svelte` |
| `QuickAction` | Dashboard quick action cards | `$lib/ui/admin/QuickAction.svelte` |
| `ConfirmWithDialog` | Confirmation dialog wrapper | `$lib/ui/admin/ConfirmWithDialog.svelte` |

## Quick Start

### List Page

```svelte
<script lang="ts">
  import PageHeader from '$lib/ui/admin/PageHeader.svelte'
  import Table from '$lib/ui/admin/Table.svelte'
  import { Actions, Action } from '$lib/ui/admin/Actions'
  import FileText from 'phosphor-svelte/lib/FileText'
  import { getItems, deleteItem } from './data.remote'

  const items = await getItems()
</script>

<div class="container mx-auto space-y-8 px-2 py-6">
  <PageHeader
    title="Items"
    description="Manage all items"
    icon={FileText}
  />

  <Table action={true} data={items}>
    {#snippet header(classes)}
      <th class={classes}>Name</th>
      <th class={classes}>Status</th>
    {/snippet}
    {#snippet row(item, classes)}
      <td class={classes}>{item.name}</td>
      <td class={classes}>{item.status}</td>
    {/snippet}
    {#snippet actionCell(item)}
      <Actions id={item.id}>
        <Action.Edit href={`/admin/items/${item.id}`} />
        <Action.Delete form={deleteItem} />
      </Actions>
    {/snippet}
  </Table>
</div>
```

### Edit Page

```svelte
<script lang="ts">
  import { page } from '$app/state'
  import PageHeader from '$lib/ui/admin/PageHeader.svelte'
  import { initForm } from '$lib/utils/form.svelte'
  import { updateItem, getItem } from '../data.remote'
  import FileText from 'phosphor-svelte/lib/FileText'

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
    description="Update item settings"
    icon={FileText}
  />

  <form {...updateItem} class="space-y-6">
    <input {...updateItem.fields.id.as('hidden', itemId)} />

    <label>
      Name
      <input {...updateItem.fields.name.as('text')} />
    </label>

    <button type="submit">Save</button>
  </form>
</div>
```

## Reference Files

- [LIST-PAGE.md](./LIST-PAGE.md) - Table, filters, pagination patterns
- [EDIT-PAGE.md](./EDIT-PAGE.md) - Forms, validation, save/delete
- [TEMPLATES.md](./TEMPLATES.md) - Copy-paste starter templates
