# command() - Programmatic Mutations

Use `command` for mutations that aren't tied to form submissions.

> Prefer `form` where possible since it works without JavaScript.

## Basic Command

```ts
// data.remote.ts
import { z } from 'zod/v4';
import { query, command } from '$app/server';
import * as db from '$lib/server/database';

export const getLikes = query(z.string(), async (id) => {
  const [row] = await db.sql`
    SELECT likes FROM items WHERE id = ${id}
  `;
  return row.likes;
});

export const addLike = command(z.string(), async (id) => {
  await db.sql`
    UPDATE items SET likes = likes + 1 WHERE id = ${id}
  `;
});
```

```svelte
<!-- Component.svelte -->
<script>
  import { getLikes, addLike } from './data.remote';
  import { showToast } from '$lib/toast';

  let { itemId } = $props();
</script>

<button
  onclick={async () => {
    try {
      await addLike(itemId);
    } catch (error) {
      showToast('Something went wrong');
    }
  }}
>
  Like
</button>

<p>Likes: {await getLikes(itemId)}</p>
```

## Updating Queries After Command

### Server-Side Refresh

```ts
// data.remote.ts
export const addLike = command(z.string(), async (id) => {
  await db.sql`
    UPDATE items SET likes = likes + 1 WHERE id = ${id}
  `;

  // Refresh the query on the server
  await getLikes(id).refresh();
});
```

### Client-Side Refresh

```svelte
<button
  onclick={async () => {
    await addLike(itemId).updates(getLikes(itemId));
  }}
>
  Like
</button>
```

## Optimistic Updates

Show the updated value immediately, before the server responds:

```svelte
<button
  onclick={async () => {
    await addLike(itemId).updates(
      getLikes(itemId).withOverride((n) => n + 1)
    );
  }}
>
  Like
</button>
```

The override is applied immediately and released when the command completes (or fails).

## Command Without Arguments

```ts
export const refreshAll = command(async () => {
  await db.sql`UPDATE cache SET refreshed_at = NOW()`;
});
```

```svelte
<button onclick={() => refreshAll()}>
  Refresh All
</button>
```

## Error Handling

```svelte
<script>
  let isSubmitting = $state(false);
  let error = $state(null);

  async function handleClick() {
    isSubmitting = true;
    error = null;

    try {
      await addLike(itemId);
    } catch (e) {
      error = e.message;
    } finally {
      isSubmitting = false;
    }
  }
</script>

<button onclick={handleClick} disabled={isSubmitting}>
  {isSubmitting ? 'Liking...' : 'Like'}
</button>

{#if error}
  <p class="error">{error}</p>
{/if}
```

## Commands Cannot Redirect

Unlike `form`, `command` cannot use `redirect()`. If you need to redirect after a command, return a value and handle it on the client:

```ts
export const deleteItem = command(z.string(), async (id) => {
  await db.sql`DELETE FROM items WHERE id = ${id}`;
  return { redirect: '/items' };
});
```

```svelte
<script>
  import { goto } from '$app/navigation';

  async function handleDelete() {
    const result = await deleteItem(itemId);
    if (result.redirect) {
      goto(result.redirect);
    }
  }
</script>
```
