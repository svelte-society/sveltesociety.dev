<script>
  import Tag from "../Tag.svelte";
  export let active = false;
  export let title = "";
  export let description = "";
  export let tags = [];
  export let stars = 0;
  export let addedOn = new Date();
  export let url = "";
  export let npm = "";
  export let repo = "";
  export let manager = "npm"

  let clipboardCopy = false
	const copyToClipboard = (text) => {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				clipboardCopy = true;
				setTimeout(() => (clipboardCopy = false), 1000);
			})
			.catch(() => alert('Clipboard copy Permission denied'));
	};

  const packageManagers = {
    'npm':  "npm install",
    "pnpm":  "pnpm add",
    "yarn":  "yarn add"
  }

  const cleanupNpm = (npm) => {
    return npm.replace('https://www.npmjs.com/package/', '')
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
  .card h3 {
    word-break: break-word;
  }
  h3 a {
    text-decoration: none;
  }
  h3 a:hover {
    text-decoration: underline;
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

    .card h3 {
      font-size: 24px;
    }
  }
</style>

<div class="card" class:active id="component-{escape(title)}">
  <h3>
    <a href="#component-{escape(title)}">#</a> <a href={url}>{title}</a>
    {#if npm}<Tag click={() => copyToClipboard(`${packageManagers[manager]}l ${cleanupNpm(npm)}`)} variant="copy" title={clipboardCopy ? 'copied!' : `${packageManagers[manager]} ${cleanupNpm(npm)}`}/>{/if}
  </h3>
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
          <img style="display:inline" src="/images/github_logo.svg" alt="github logo" />
        {:else if (repo || url).includes('gitlab')}
          <img style="display:inline" src="/images/gitlab_logo.svg" alt="gitlab logo" />
        <!-- {:else} -->
        {/if}
      {/if}
    </div>
    <div>
      &#9733;
      <code>{stars}</code>
    </div>
    <!-- commenting out dates just cause it is not very updated yet - all the cards show same date. put back in when we have better scraping -->
    <!-- <datetime value={addedOn}>{new Intl.DateTimeFormat('en-Us').format(Date.parse(addedOn))}</datetime> -->
  </div>
</div>
