<script lang="ts" context="module">
  import { categories } from '$lib/stores/recipes';

  export async function load({ fetch }) {
    const res = await fetch('/recipes/recipes');
    const recipeCategories = await res.json();

    if (!res.ok) {
      return {
        status: res.status,
        error: new Error()
      };
    }

    categories.set(recipeCategories);
    return { props: { categories: recipeCategories } };
  }
</script>

<svelte:head>
  <title>Svelte Recipes</title>
  <link rel="stylesheet" href="/prism.css" />
</svelte:head>

<div class="container">
  <slot />
</div>

<style>
  :global(article blockquote) {
    background: rgba(255, 62, 1, 0.2);
    border-radius: 5px 0px 0px 5px;
    color: black;
    border-left: 2px solid #ff3e01;
  }
  .container :global(h2), .container :global(h3) {
    margin-top: 2rem;
    margin-bottom: 1.25rem;
  }
  .container :global(p) {
    margin-bottom: 1.25rem;
  }
  .container :global(li) {
    margin-bottom: 1.1rem;
  }
</style>
