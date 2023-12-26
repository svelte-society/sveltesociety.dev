<script lang="ts">
	import Tag from '../Tag.svelte';
	import { copyToClipboard } from '$lib/utils/clipboard';
	import { packageManager as manager } from '$stores/packageManager';
	import { relativeDate } from '$utils/relativeDate';

	export let title: string;
	export let description: string;
	export let tags: string[];
	export let stars: string;
	export let npm = '';
	export let repository = undefined;
	export let date = undefined;
	export let version = undefined;

	let clipboardCopy = false;

	const copy = () => {
		copyToClipboard(`${packageManagers[$manager]} ${npm}`).then(() => (clipboardCopy = false));
		clipboardCopy = true;
	};

	const packageManagers = {
		npm: 'npm install',
		pnpm: 'pnpm add',
		yarn: 'yarn add'
	};
</script>

<div class="card" id="component-{title}">
	<div class="card__top">
		<div>
			<h3>
				<a href="#component-{title}">#</a>
				{#if repository}<a href={repository}>{title}</a>{:else}<span>{title}</span>{/if}
			</h3>
		</div>
		<div>
			{#if repository.includes('github')}
				<a class="repo" title="Go to the source code" target="_blank" href={repository}
					><img style="display:inline" src="/images/github_logo.svg" alt="github logo" /></a
				>
			{:else if repository.includes('gitlab')}
				<a class="repo" title="Go to the source code" target="_blank" href={repository}
					><img style="display:inline" src="/images/gitlab_logo.svg" alt="gitlab logo" /></a
				>
				<!-- {:else} -->
			{/if}
		</div>
	</div>

	{#if npm}
		<Tag
			click={() => copy()}
			variant="copy"
			title={clipboardCopy ? 'copied!' : `${packageManagers[$manager]} ${npm}`}
		/>
	{/if}
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
			{#if typeof stars !== 'undefined'}
				&#9733;
				<code>{stars}</code>
			{/if}
		</div>
		{#if date && version}<span class="date">Updated {relativeDate(date)} ({version})</span>{/if}
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
	.card:hover {
		background: #e8f3fe;
	}
	.card__tags {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		margin-bottom: 1rem;
	}
	.card__top {
		display: flex;
		justify-content: space-between;
		align-items: top;
	}
	.card__bottom {
		display: flex;
		justify-content: space-between;
		align-items: end;
	}
	.card__bottom > * {
		white-space: nowrap;
	}
	.repo {
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
	.repo:hover {
		background-color: rgba(0, 0, 0, 0.25);
	}
	.date {
		font-size: 14px;
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
