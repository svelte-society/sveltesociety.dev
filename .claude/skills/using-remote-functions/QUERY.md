# query() - Reading Data

Use `query` to read dynamic data from the server.

## Basic Query

```ts
// data.remote.ts
import { query } from '$app/server';
import * as db from '$lib/server/database';

export const getItems = query(async () => {
  // TODO: Add your database query
  const items = await db.sql`SELECT * FROM items`;
  return items;
});
```

```svelte
<!-- Component.svelte -->
<script>
  import { getItems } from './data.remote';
</script>

{#each await getItems() as item}
  <div>{item.name}</div>
{/each}
```

## Query with Validation

Always validate arguments using Zod:

```ts
// data.remote.ts
import { z } from 'zod/v4';
import { error } from '@sveltejs/kit';
import { query } from '$app/server';
import * as db from '$lib/server/database';

export const getItem = query(z.string(), async (id) => {
  // TODO: Add your database query
  const [item] = await db.sql`
    SELECT * FROM items WHERE id = ${id}
  `;

  if (!item) error(404, 'Not found');
  return item;
});
```

```svelte
<!-- Component.svelte -->
<script>
  import { getItem } from './data.remote';

  let { itemId } = $props();
  const item = $derived(await getItem(itemId));
</script>

<h1>{item.name}</h1>
```

## Alternative: Without await

If not using async components:

```svelte
<script>
  import { getItems } from './data.remote';

  const query = getItems();
</script>

{#if query.error}
  <p>Error loading items</p>
{:else if query.loading}
  <p>Loading...</p>
{:else}
  {#each query.current as item}
    <div>{item.name}</div>
  {/each}
{/if}
```

## Refreshing Queries

```svelte
<button onclick={() => getItems().refresh()}>
  Refresh
</button>
```

## Batched Queries (N+1 Problem)

Use `query.batch` when rendering lists to avoid multiple database calls:

```ts
// data.remote.ts
export const getAuthor = query.batch(z.string(), async (authorIds) => {
  // Single query for all authors
  const authors = await db.sql`
    SELECT * FROM authors WHERE id = ANY(${authorIds})
  `;
  const lookup = new Map(authors.map(a => [a.id, a]));

  return (id) => lookup.get(id);
});
```

```svelte
{#each posts as post}
  <article>
    <h2>{post.title}</h2>
    <p>By: {(await getAuthor(post.authorId)).name}</p>
  </article>
{/each}
```
