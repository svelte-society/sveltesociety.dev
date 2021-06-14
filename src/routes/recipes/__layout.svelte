<svelte:head>
  <title>Svelte Recipes</title>
  <link rel="stylesheet" href="/prism.css" />
</svelte:head>

<div class="home-wrap">
  <slot />
</div>

<style>
  :global(article blockquote) {
    background: rgba(255, 62, 1, 0.2);
    border-radius: 5px 0px 0px 5px;
    color: black;
    border-left: 2px solid #ff3e01;
  }
</style>
