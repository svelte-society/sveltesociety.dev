<script>
  import CategoryTree from "$lib/components/recipes/CategoryTree.svelte";
  import { categories } from '$lib/stores/recipes';
  import { page } from '$app/stores';

  const childrenNodes = $categories.find(c => c.path === $page.path);

  export let title,
    description = "";
</script>

<main>
  <div class="TOC">
    <h1>Table of Contents</h1>
    {#each $categories as node}
      <div class="TOCLink" class:active={$page.path.includes(node.path)}>
        <img src={node.meta.icon} alt="" />
        <a href={node.path}>{node.meta.title}</a>
      </div>
      {#if $page.path.includes(node.path)}
        <CategoryTree nodes={node.children} />
      {/if}
    {/each}
  </div>
  <article>
    <h1>{title}</h1>
    <slot />

    <ul>
      {#each childrenNodes as node}
        <li>
          <a href={node.path}>{node.meta.title}</a>
        </li>
      {/each}
    </ul>
  </article>
</main>

<style>
  .TOCLink {
    align-items: baseline;
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 10px;
    padding: 1rem 0;
    border-bottom: 1px solid #d0deec;
    font-size: 1.1em;
  }
  .TOCLink.active a {
    font-weight: bold;
  }
  .TOCLink img {
    height: 1em;
  }
  @media (min-width: 1024px) {
    main {
      display: flex;
    }
  }
  main {
    margin: 0 auto;
    max-width: var(--width-content);
    padding: 2rem 1rem;
  }
  .TOC {
    margin-right: 2rem;
    flex: 1;
    font-family: Overpass;
    line-height: 150%;
  }
  .TOC :global(a) {
    color: #2e2e35;
    font-weight: normal;
  }
  article {
    flex: 3;
    overflow-x: hidden;
  }
  @media (min-width: 1024px) {
    article {
      margin-left: 2rem;
    }
  }
</style>
