<script>
  export let title;
</script>

<style>
  h1 {
    font-family: Overpass;
    font-style: normal;
    font-weight: 600;
    font-size: 27px;
    line-height: 150%;
    margin-bottom: 1rem;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 25px;
  }
  .list {
    margin-bottom: 5rem;
  }

  @media screen and (max-width: 1024px) {
    .grid {
      max-width: calc(var(--width-card) * 2 + 25px);
      grid-template-columns: repeat(2, 1fr);
      margin: 0 auto;
    }
  }

  @media screen and (max-width: 700px) {
    .grid {
      max-width: var(--width-card);
      grid-template-columns: 1fr;
      margin: 0 auto;
    }
  }
</style>

<div class="list">
  <h1 id="category-{escape(title)}">{title} <a href="#{escape(title)}">#</a></h1>
  <div class="grid">
    <slot />
  </div>
</div>
