---
name: Page Builder
description: Patterns for building list and detail pages with forms, filters, and data fetching
---

# Page Builder Patterns

Universal patterns for building pages. These apply to both public-facing and admin pages.

## When to Use

- Building list pages with filtering, search, pagination
- Building detail/edit pages with forms
- Rendering mixed-type feeds or lists
- Any page that fetches and displays data

## Core Principle

**Remote-First: Put logic in data.remote.ts, keep pages as pure renderers.**

See [using-remote-functions/REMOTE-FIRST.md](../using-remote-functions/REMOTE-FIRST.md) for the full pattern.

## Page Types

| Type | Purpose | Reference |
|------|---------|-----------|
| List Page | Display items with filters/search | [LIST-PAGE.md](./LIST-PAGE.md) |
| Detail Page | View/edit single item with form | [DETAIL-PAGE.md](./DETAIL-PAGE.md) |
| Feed Page | Mixed-type items with components | [FEED-PAGE.md](./FEED-PAGE.md) |

## Route Structure

```
src/routes/
└── [section]/
    ├── +page.svelte          # List page
    ├── data.remote.ts        # Remote functions (queries, forms)
    └── [slug]/
        └── +page.svelte      # Detail page
```

## Key Patterns

### 1. Component Mapping

Map data types to components for clean rendering:

```svelte
<script>
  const components = new Map([
    ['article', ArticleCard],
    ['video', VideoCard],
    ['cta', CTABanner]
  ])
</script>

{#each items as item, index (index)}
  {@const Component = components.get(item.type)}
  <Component {...item.props} />
{/each}
```

### 2. Filter Forms (Auto-Submit)

Native forms that update URL params on input:

```svelte
<script>
  let form: HTMLFormElement
  function submitForm() { form.requestSubmit() }
  function debouncedSubmit() {
    clearTimeout(timer)
    timer = setTimeout(submitForm, 300)
  }
</script>

<form bind:this={form}>
  <input name="search" oninput={debouncedSubmit} />
  <select name="status" onchange={submitForm} />
</form>
```

### 3. Form Initialization

Populate forms with existing data:

```svelte
<script>
  import { initForm } from '$lib/utils/form.svelte'

  initForm(updateItem, () => ({
    id: item.id,
    name: item.name ?? '',
    status: item.status ?? 'draft'
  }))
</script>
```

### 4. Pagination

```svelte
<script>
  import Pagination from '$lib/ui/Pagination.svelte'
</script>

<Pagination count={totalItems} perPage={20} />
```

## Form Components

| Component | Purpose |
|-----------|---------|
| `Input` | Text, email, password inputs with validation |
| `Textarea` | Multi-line text with validation |
| `Select` | Dropdown with options |
| `Checkbox` | Boolean toggle |

All accept:
- `label` - Field label
- `description` - Helper text
- `issues` - Validation errors from `field.issues()`
- `...rest` - Spread from `field.as('type')`

## Remote Function Patterns

### Query with Filters

```typescript
const filtersSchema = z.object({
  search: z.string().catch(''),
  status: z.string().catch(''),
  page: z.number().catch(1)
})

export const getItems = query("unchecked", async (searchParams: URLSearchParams) => {
  const { locals } = getRequestEvent()
  const filters = parseSearchParams(filtersSchema, searchParams)
  return locals.service.getFiltered(filters)
})
```

### Form with Validation

```typescript
export const updateItem = form(
  z.object({
    id: z.string(),
    name: z.string().min(1, 'Required'),
    status: z.enum(['draft', 'published'])
  }),
  async (data) => {
    const { locals } = getRequestEvent()
    await locals.service.update(data.id, data)
    return { success: true }
  }
)
```

## Reference Files

- [LIST-PAGE.md](./LIST-PAGE.md) - Full list page patterns
- [DETAIL-PAGE.md](./DETAIL-PAGE.md) - Form and detail patterns
- [FEED-PAGE.md](./FEED-PAGE.md) - Mixed-type feed rendering
