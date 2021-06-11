<script>
  import Tag from "../Tag.svelte";
  export let active = false;
  export let title = "";
  export let description = "";
  export let image = "";
  export let tags = [];
  export let stars = 0;
  export let addedOn = new Date();
  export let url = "";
  export let npm = "";
  export let repo = "";

  const copyToClipboard = (text) => {
    navigator.permissions.query({name: "clipboard-write"}).then(result => {
      if (result.state == "granted" || result.state == "prompt") {
        navigator.clipboard.writeText(text)
      }
    });
  }
</script>

<style>
  .card {
    display: flex;
    flex-direction: column;
    max-width: var(--width-card);
    padding: 14px;
    background: #f3f6f9;
    border-radius: 5px;
  }
  .card h1 {
    word-break: break-word;
  }
  .active,
  .card:hover {
    background: #e8f3fe;
  }
  .card__tags {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }
  .card__bottom {
    display: flex;
    justify-content: space-between;
  }
  .card__bottom > * {
    white-space: nowrap;
  }

  .flex-grow {
    flex-grow: 1;
  }

  @media screen and (max-width: 400px) {
    .card {
      font-size: 0.9rem;
    }

    .card h1 {
      font-size: 24px;
    }
  }
</style>

<div class="card" class:active id="component-{escape(title)}">
  {#if image}
    <img src={image} alt={title} />
  {/if}
  <h1>
    <a href={url}>{title}</a> <a href="#component-{escape(title)}">#</a>
    {#if npm}<Tag click={() => copyToClipboard(`npm install ${npm}`)} variant="copy" title="npm install {npm}"/>{/if}
  </h1>
  <p class="flex-grow">{description}</p>
  <div class="card__tags">
    {#each tags as tag}
      <Tag title={tag} variant='blue' />
    {/each}
  </div>
  <div class="card__bottom">
    <div>
      {#if stars > 0}
        {#if (repo || url).includes('github')}
          <img src="/github_logo.svg" alt="github logo" />
        {:else if (repo || url).includes('gitlab')}
          <img src="/gitlab_logo.svg" alt="gitlab logo" />
        {:else}
          &#9733;
        {/if}
        {stars}
      {/if}
    </div>
    <div>{new Intl.DateTimeFormat('en-Us').format(Date.parse(addedOn))}</div>
  </div>
</div>
