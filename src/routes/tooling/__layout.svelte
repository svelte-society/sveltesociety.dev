<svelte:head>
  <title>Svelte Society - Svelte Tooling</title>
</svelte:head>
<div class="wrapper">
  <slot />
</div>

<style>
  .wrapper {
    max-width: 65ch;
  }
  .wrapper :global(h2), .wrapper :global(h3) {
    margin-top: 2rem;
    margin-bottom: 1.25rem;
  }
  .wrapper :global(p) {
    margin-bottom: 1.25rem;
  }
  .wrapper :global(li) {
    margin-bottom: 1.1rem;
  }
</style>
