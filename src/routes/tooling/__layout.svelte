<svelte:head>
  <title>Tooling - Svelte Society</title>
</svelte:head>
<div class="wrapper">
  <slot />
</div>

<style global>
  .wrapper {
    max-width: 65ch;
  }

  .wrapper p {
    margin-bottom: 1.25rem;
  }

  .wrapper ul {
    @apply list-disc;
    @apply list-inside;
  }
  .wrapper li {
    margin-bottom: 1.1rem;
  }
  .wrapper ul ul {
    @apply mt-4;
    @apply ml-4;
  }

  .wrapper h1 {
    font-weight: 700;
    @apply text-6xl;
    @apply mb-4;
  }

  .wrapper h2 {
    font-weight: 700;
    @apply text-4xl;
    @apply mt-6;
    @apply mb-4;
  }

  .wrapper h3 {
    font-weight: 600;
    @apply text-2xl;
    @apply mb-2;
  }
</style>
