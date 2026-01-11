# Code Templates

Starter templates for Remote Functions. Copy and customize.

## data.remote.ts Template

```ts
// src/lib/components/[feature]/data.remote.ts
import { z } from 'zod/v4'
import { error, redirect } from '@sveltejs/kit'
import { query, form, command } from '$app/server'
import * as db from '$lib/server/database'

// ============================================
// QUERIES - Reading Data
// ============================================

/**
 * Get all items
 * TODO: Replace with your query
 */
export const getItems = query(async () => {
	const items = await db.sql`
    SELECT * FROM items
    ORDER BY created_at DESC
  `
	return items
})

/**
 * Get single item by ID
 * TODO: Replace with your query
 */
export const getItem = query(z.string(), async (id) => {
	const [item] = await db.sql`
    SELECT * FROM items WHERE id = ${id}
  `
	if (!item) error(404, 'Not found')
	return item
})

// ============================================
// FORMS - Form Submissions
// ============================================

/**
 * Create new item
 * TODO: Replace schema and handler
 */
export const createItem = form(
	z.object({
		name: z.string().min(1, 'Name is required'),
		description: z.string().optional()
	}),
	async ({ name, description }) => {
		await db.sql`
      INSERT INTO items (name, description)
      VALUES (${name}, ${description})
    `

		// Refresh the list after creating
		await getItems().refresh()

		redirect(303, '/items')
	}
)

/**
 * Update existing item
 * TODO: Replace schema and handler
 */
export const updateItem = form(
	z.object({
		id: z.string(),
		name: z.string().min(1, 'Name is required'),
		description: z.string().optional()
	}),
	async ({ id, name, description }) => {
		await db.sql`
      UPDATE items
      SET name = ${name}, description = ${description}
      WHERE id = ${id}
    `

		// Refresh the specific item
		await getItem(id).refresh()

		return { success: true }
	}
)

// ============================================
// COMMANDS - Programmatic Mutations
// ============================================

/**
 * Delete item
 * TODO: Replace with your command
 */
export const deleteItem = command(z.string(), async (id) => {
	await db.sql`DELETE FROM items WHERE id = ${id}`

	// Refresh the list after deleting
	await getItems().refresh()
})

/**
 * Toggle item status
 * TODO: Replace with your command
 */
export const toggleItem = command(z.string(), async (id) => {
	await db.sql`
    UPDATE items
    SET is_active = NOT is_active
    WHERE id = ${id}
  `

	await getItem(id).refresh()
})
```

## Component.svelte Template

```svelte
<!-- src/lib/components/[Feature]/Component.svelte -->
<script>
  import { getItems, getItem, createItem, updateItem, deleteItem } from './data.remote';

  // Props
  let { itemId = null } = $props();

  // Derived state for single item (if itemId provided)
  const item = $derived(itemId ? await getItem(itemId) : null);
</script>

<!-- LIST VIEW -->
<section>
  <h2>Items</h2>

  {#each await getItems() as item}
    <article>
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      <button onclick={() => deleteItem(item.id)}>Delete</button>
    </article>
  {/each}
</section>

<!-- CREATE FORM -->
<section>
  <h2>Create Item</h2>

  <form {...createItem}>
    <label>
      Name
      {#each createItem.fields.name.issues() as issue}
        <span class="error">{issue.message}</span>
      {/each}
      <input {...createItem.fields.name.as('text')} />
    </label>

    <label>
      Description
      <textarea {...createItem.fields.description.as('text')}></textarea>
    </label>

    <button type="submit">Create</button>
  </form>
</section>

<!-- UPDATE FORM (if item exists) -->
{#if item}
  <section>
    <h2>Edit Item</h2>

    <form {...updateItem}>
      <input {...updateItem.fields.id.as('hidden', item.id)} />

      <label>
        Name
        <input {...updateItem.fields.name.as('text')} value={item.name} />
      </label>

      <label>
        Description
        <textarea {...updateItem.fields.description.as('text')}>{item.description}</textarea>
      </label>

      <button type="submit">Save</button>
    </form>

    {#if updateItem.result?.success}
      <p class="success">Saved!</p>
    {/if}
  </section>
{/if}

<style>
  .error {
    color: red;
    font-size: 0.875rem;
  }

  .success {
    color: green;
  }
</style>
```

## Minimal Query Component

```svelte
<script>
  import { getItems } from './data.remote';
</script>

{#each await getItems() as item}
  <div>{item.name}</div>
{/each}
```

## Minimal Form Component

```svelte
<script>
  import { createItem } from './data.remote';
</script>

<form {...createItem}>
  <input {...createItem.fields.name.as('text')} placeholder="Name" />
  <button>Create</button>
</form>
```

## Minimal Command Component

```svelte
<script>
  import { deleteItem } from './data.remote';

  let { itemId } = $props();
</script>

<button onclick={() => deleteItem(itemId)}>
  Delete
</button>
```

---

## Multiple Forms with .for(id)

When rendering forms in a list, use `.for(id)` to isolate each form instance:

### data.remote.ts

```ts
export const updateItem = form(
	z.object({
		name: z.string().min(1),
		description: z.string().optional()
	}),
	async ({ name, description }, issue) => {
		// The id comes from .for(id), not from form fields
		const { params } = getRequestEvent()
		// Or pass id through a hidden field if needed

		await db.sql`
      UPDATE items SET name = ${name}, description = ${description}
      WHERE id = ${params.id}
    `

		return { success: true }
	}
)
```

### Component.svelte with Multiple Forms

```svelte
<script>
  import { getItems, updateItem } from './data.remote';
</script>

<h1>Edit Items</h1>

{#each await getItems() as item}
  {@const editForm = updateItem.for(item.id)}

  <article>
    <form {...editForm}>
      <input {...editForm.fields.name.as('text')} value={item.name} />
      <input {...editForm.fields.description.as('text')} value={item.description} />

      <button disabled={!!editForm.pending}>
        {editForm.pending ? 'Saving...' : 'Save'}
      </button>
    </form>

    {#if editForm.result?.success}
      <span class="saved">Saved!</span>
    {/if}
  </article>
{/each}
```

### Key Points for .for(id)

- Each form instance is isolated (validation, pending state, result)
- Use `editForm.pending` to show loading state per-form
- Use `editForm.result` to show success/error per-form
- The id is passed to `.for()`, not as a form field

---

## Composing Remote Functions (Auth, Shared Logic)

Remote functions can call other remote functions. This is useful for:

- Authorization checks
- Shared data fetching
- Reusable logic

### auth.remote.ts - Reusable Auth Checks

```ts
// src/lib/server/auth.remote.ts
import { getRequestEvent, query } from '$app/server'
import { redirect } from '@sveltejs/kit'

/**
 * Check if user is authenticated
 * Call from other remote functions
 */
export const checkAuth = query(() => {
	const { locals } = getRequestEvent()

	if (!locals.user) {
		redirect(303, '/login')
	}

	return locals.user
})

/**
 * Check if user is admin or moderator
 * Call from other remote functions
 */
export const checkAdminAuth = query(() => {
	const { locals } = getRequestEvent()

	if (!locals.user) {
		redirect(303, '/login')
	}

	const userRole = locals.roleService.getRoleById(locals.user.role)
	const isAuthorized =
		userRole && userRole.active && (userRole.value === 'admin' || userRole.value === 'moderator')

	if (!isAuthorized) {
		redirect(303, '/')
	}

	return locals.user
})

/**
 * Get current user (returns null if not logged in)
 * Safe to call - doesn't redirect
 */
export const getCurrentUser = query(() => {
	const { locals } = getRequestEvent()
	return locals.user ?? null
})
```

### Using Auth in Other Remote Functions

```ts
// src/lib/components/admin/data.remote.ts
import { z } from 'zod/v4'
import { query, form, command } from '$app/server'
import { checkAdminAuth } from '$lib/server/auth.remote'
import * as db from '$lib/server/database'

/**
 * Get all users - admin only
 */
export const getUsers = query(async () => {
	// This will redirect if not authorized
	await checkAdminAuth()

	return await db.sql`SELECT * FROM users`
})

/**
 * Delete user - admin only
 */
export const deleteUser = command(z.string(), async (userId) => {
	const admin = await checkAdminAuth()

	// Prevent self-deletion
	if (admin.id === userId) {
		throw new Error('Cannot delete yourself')
	}

	await db.sql`DELETE FROM users WHERE id = ${userId}`
	await getUsers().refresh()
})

/**
 * Create content - requires login
 */
export const createContent = form(
	z.object({ title: z.string(), body: z.string() }),
	async ({ title, body }) => {
		const user = await checkAuth()

		await db.sql`
      INSERT INTO content (title, body, author_id)
      VALUES (${title}, ${body}, ${user.id})
    `
	}
)
```

### Caching Composed Queries

Queries are cached per-request, so calling `checkAdminAuth()` multiple times in the same request only runs once:

```ts
export const getAdminDashboard = query(async () => {
	await checkAdminAuth() // Runs once

	const users = await getUsers() // checkAdminAuth cached
	const content = await getContent() // checkAdminAuth cached

	return { users, content }
})
```

### Component Using Protected Remote Functions

```svelte
<script>
  import { getUsers, deleteUser } from './data.remote';
</script>

<!-- If not authorized, user is redirected before render -->
<h1>Admin: Users</h1>

{#each await getUsers() as user}
  <div>
    <span>{user.name}</span>
    <button onclick={() => deleteUser(user.id)}>Delete</button>
  </div>
{/each}
```

---

## Using .enhance for Custom Form Handling

The `.enhance` method lets you customize form submission behavior, handle success/error states, and control query invalidation.

### Basic enhance Usage

```svelte
<script>
  import { createItem, getItems } from './data.remote';
  import { showToast } from '$lib/toast';
</script>

<form {...createItem.enhance(async ({ form, data, submit }) => {
  try {
    await submit();
    form.reset();  // Clear form on success
    showToast('Item created!');
  } catch (error) {
    showToast('Something went wrong');
  }
})}>
  <input {...createItem.fields.name.as('text')} />
  <button>Create</button>
</form>
```

**Key points:**

- `form` - The form element (use `form.reset()` to clear inputs)
- `data` - The form data being submitted
- `submit()` - Call this to perform the submission
- Form is NOT automatically reset with enhance - you must call `form.reset()`

### Accessing Form Results

If your form handler returns data, access it via `.result` after submission:

```ts
// data.remote.ts
export const createItem = form(z.object({ name: z.string().min(1) }), async ({ name }) => {
	const id = await db.insert({ name })
	return { success: true, message: `Item created with ID: ${id}!` }
})
```

```svelte
<script>
  import { createItem } from './data.remote';
  import { showToast } from '$lib/toast';
</script>

<form {...createItem.enhance(async ({ form, submit }) => {
  try {
    await submit();
    form.reset();

    // Access the returned result
    if (createItem.result?.success) {
      showToast(createItem.result.message);
    }
  } catch (error) {
    showToast('Something went wrong');
  }
})}>
  <input {...createItem.fields.name.as('text')} />
  <button>Create</button>
</form>
```

You can also use `.result` conditionally in the template:

```svelte
<form {...createItem}>
  <input {...createItem.fields.name.as('text')} />
  <button>Create</button>
</form>

{#if createItem.result?.success}
  <p class="success">{createItem.result.message}</p>
{/if}
```

**Note:** The `.result` value is ephemeral - it will be cleared on resubmission, navigation, or page reload.

### Client-Driven Single-Flight Mutations with .updates()

Instead of refreshing queries server-side, drive invalidation from the client:

```svelte
<script>
  import { createItem, getItems } from './data.remote';
</script>

<form {...createItem.enhance(async ({ form, submit }) => {
  try {
    // Submit and refresh getItems() in a single round-trip
    await submit().updates(getItems());
    form.reset();
  } catch (error) {
    console.error('Failed:', error);
  }
})}>
  <input {...createItem.fields.name.as('text')} />
  <button>Create</button>
</form>
```

### Optimistic Updates with .withOverride()

Show the expected result immediately while waiting for the server:

```svelte
<script>
  import { createItem, getItems } from './data.remote';

  let { newItem } = $state({ name: '' });
</script>

<form {...createItem.enhance(async ({ form, data, submit }) => {
  try {
    // Immediately show the new item while submitting
    await submit().updates(
      getItems().withOverride((items) => [
        { id: 'temp', name: data.name, description: '' },
        ...items
      ])
    );
    form.reset();
  } catch (error) {
    // Override is automatically released on error
    console.error('Failed:', error);
  }
})}>
  <input {...createItem.fields.name.as('text')} />
  <button>Create</button>
</form>
```

### Multiple Query Updates

Refresh multiple queries in one submission:

```svelte
<script>
  import { createItem, getItems, getItemCount, getRecentItems } from './data.remote';
</script>

<form {...createItem.enhance(async ({ form, submit }) => {
  await submit().updates(
    getItems(),
    getItemCount(),
    getRecentItems()
  );
  form.reset();
})}>
  <!-- form fields -->
</form>
```

### enhance with Loading State

Track submission state for better UX:

```svelte
<script>
  import { createItem } from './data.remote';

  let isSubmitting = $state(false);
</script>

<form {...createItem.enhance(async ({ form, submit }) => {
  isSubmitting = true;
  try {
    await submit();
    form.reset();
  } finally {
    isSubmitting = false;
  }
})}>
  <input {...createItem.fields.name.as('text')} disabled={isSubmitting} />
  <button disabled={isSubmitting}>
    {isSubmitting ? 'Creating...' : 'Create'}
  </button>
</form>
```

### buttonProps.enhance for Multiple Actions

When a form has multiple submit buttons with different actions:

```svelte
<script>
  import { login, register } from '$lib/auth.remote';
  import { goto } from '$app/navigation';
</script>

<form {...login}>
  <input {...login.fields.username.as('text')} />
  <input {...login.fields._password.as('password')} />

  <!-- Default login button -->
  <button>Login</button>

  <!-- Register button with custom enhance -->
  <button {...register.buttonProps.enhance(async ({ submit }) => {
    await submit();
    goto('/welcome');
  })}>
    Register Instead
  </button>
</form>
```

### Complete enhance Example

A full example combining multiple patterns:

```svelte
<script>
  import { getItems, createItem } from './data.remote';
  import { showToast } from '$lib/toast';

  let isSubmitting = $state(false);
</script>

<h1>Items</h1>

<!-- List with optimistic updates -->
{#each await getItems() as item}
  <div>{item.name}</div>
{/each}

<!-- Form with full enhance handling -->
<form {...createItem.enhance(async ({ form, data, submit }) => {
  isSubmitting = true;

  try {
    // Optimistic update
    await submit().updates(
      getItems().withOverride((items) => [
        { id: 'temp-' + Date.now(), name: data.name },
        ...items
      ])
    );

    form.reset();
    showToast('Created successfully!');
  } catch (error) {
    showToast('Failed to create item');
  } finally {
    isSubmitting = false;
  }
})}>
  <label>
    Name
    {#each createItem.fields.name.issues() as issue}
      <span class="error">{issue.message}</span>
    {/each}
    <input {...createItem.fields.name.as('text')} disabled={isSubmitting} />
  </label>

  <button disabled={isSubmitting}>
    {isSubmitting ? 'Creating...' : 'Create Item'}
  </button>
</form>
```
