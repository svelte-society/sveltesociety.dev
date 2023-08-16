<script>
	import Tag from '../Tag.svelte';
	import { copyToClipboard } from '$lib/utils/clipboard';
	import { packageManager as manager } from '$stores/packageManager';

	export let active = false;
	export let title = '';
	export let description = '';
	export let tags = [];
	export let stars;
	export let url = '';
	export let npm = '';
	export let repository = undefined;

	let clipboardCopy = false;

	const copy = () => {
		copyToClipboard(`${packageManagers[$manager]} ${cleanupNpm(npm)}`).then(
			() => (clipboardCopy = false)
		);
		clipboardCopy = true;
	};

	const packageManagers = {
		npm: 'npm install',
		pnpm: 'pnpm add',
		yarn: 'yarn add'
	};

	const cleanupNpm = (npm) => {
		return npm.replace('https://www.npmjs.com/package/', '');
	};
</script>

<div class="card" class:active id="component-{title}">
	<h3>
		<a href="#component-{title}">#</a>
		{#if url || repository}<a href={url || repository}>{title}</a>{:else}<span>{title}</span>{/if}
		{#if npm}<Tag
				click={() => copy()}
				variant="copy"
				title={clipboardCopy ? 'copied!' : `${packageManagers[$manager]} ${cleanupNpm(npm)}`}
			/>{/if}
	</h3>
	<p class="flex-grow">{description}</p>
	{#if tags}
		<div class="card__tags">
			{#each tags as tag}
				<Tag title={tag} variant="blue" />
			{/each}
		</div>
	{/if}
	<div class="card__bottom">
		<div>
			{#if (repository || url || '').includes('github')}
				<a title="Go to the source code" href={repository || url}
					><img style="display:inline" src="/images/github_logo.svg" alt="github logo" /></a
				>
			{:else if (repository || url || '').includes('gitlab')}
				<a title="Go to the source code" href={repository || url}
					><img style="display:inline" src="/images/gitlab_logo.svg" alt="gitlab logo" /></a
				>
				<!-- {:else} -->
			{/if}
		</div>
		<div>
			{#if typeof stars !== 'undefined'}
				&#9733;
				<code>{stars}</code>
			{/if}
		</div>
		<!-- commenting out dates just cause it is not very updated yet - all the cards show same date. put back in when we have better scraping -->
		<!-- <datetime value={addedOn}>{new Intl.DateTimeFormat('en-Us').format(Date.parse(addedOn))}</datetime> -->
	</div>
</div>

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
		word-break: none;
		font-size: var(--font-300);
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
		align-items: end;
	}
	.card__bottom > * {
		white-space: nowrap;
	}
	.card__bottom a {
		border-bottom: none;
		aspect-ratio: 1/1;
		display: flex;
		min-height: 26px;
		padding: 4px;
		border-radius: 50%;
		margin: -4px;
		box-sizing: border-box;
		background-color: rgba(0, 0, 0, 0);
		transition: background-color 200ms ease-out;
	}
	.card__bottom a:hover {
		background-color: rgba(0, 0, 0, 0.25);
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
