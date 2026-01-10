# Single-Flight Mutations

Combine mutations with query updates in a single round-trip to the server.

## The Problem

By default, after a form submission, all queries on the page are refreshed. This is inefficient - many queries may be unchanged.

## Solution: Single-Flight Mutations

Specify which queries to refresh after a mutation, all in one server request.

## Server-Side Refresh

Refresh queries inside the form/command handler:

```ts
// data.remote.ts
import { query, form } from '$app/server';

export const getPosts = query(async () => { /* ... */ });

export const createPost = form(schema, async (data) => {
  // Insert the post...
  await db.sql`INSERT INTO posts ...`;

  // Refresh getPosts() on the server
  // Data is sent back with the form result
  await getPosts().refresh();

  redirect(303, '/posts');
});
```

You can also set the query value directly if you already have it:

```ts
export const updatePost = form(schema, async (data) => {
  const result = await externalApi.update(data);

  // Set the value directly instead of refreshing
  await getPost(data.id).set(result);
});
```

## Client-Side Refresh

Drive the refresh from the client using `submit().updates()`:

```svelte
<script>
  import { createPost, getPosts } from './data.remote';
</script>

<form {...createPost.enhance(async ({ submit }) => {
  await submit().updates(getPosts());
})}>
  <!-- fields -->
</form>
```

For commands:

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

Show updated data immediately, before the server responds:

```svelte
<button
  onclick={async () => {
    await addLike(itemId).updates(
      getLikes(itemId).withOverride((likes) => likes + 1)
    );
  }}
>
  Like
</button>
```

The override:
1. Is applied immediately when the button is clicked
2. Shows the optimistic value to the user
3. Is released when the command completes
4. Is reverted if the command fails

## Form with Optimistic Updates

```svelte
<form {...createPost.enhance(async ({ data, submit }) => {
  const optimisticPost = {
    id: crypto.randomUUID(),
    title: data.title,
    content: data.content,
    createdAt: new Date()
  };

  await submit().updates(
    getPosts().withOverride((posts) => [optimisticPost, ...posts])
  );
})}>
  <!-- fields -->
</form>
```

## Multiple Query Updates

Update multiple queries at once:

```svelte
<button
  onclick={async () => {
    await archivePost(postId).updates(
      getPosts(),           // Refresh the list
      getPost(postId),      // Refresh this specific post
      getArchiveCount()     // Refresh the archive count
    );
  }}
>
  Archive
</button>
```

## Comparison

| Approach | When to Use |
|----------|-------------|
| Default (refresh all) | Simple cases, prototyping |
| Server-side `.refresh()` | When you know which queries to update |
| Server-side `.set()` | When you already have the updated data |
| Client-side `.updates()` | When the client knows what needs updating |
| `.withOverride()` | When you want instant feedback |
