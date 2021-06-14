<script>
  export let nodes;
  let page = 'TODO';
</script>

<style>
  ul {
    list-style: none;
    margin: 0 0 0 1rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
  li::before {
    content: "•";
    color: var(--svelte-grey-light);
    display: inline-block;
    width: 1em;
    margin-left: -1em;
  }
  li.active::before {
    color: var(--svelte-grey);
  }
  li.active a {
    font-weight: bold;
  }
  @media screen and (max-width: 1024px) {
    ul {
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    }
  }
  @media screen and (max-width: 600px) {
    ul {
      grid-template-columns: 1fr
    }
  }
</style>

<ul>
  {#each nodes.filter((r) => !r.path.includes('/index')) as node}
    <li class:active={page.path.includes(node.path)}>
      <a href={node.path}>{node.meta.frontmatter.title}</a>
    </li>
  {/each}
</ul>
