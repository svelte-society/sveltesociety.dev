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

<div class="card flex flex-col p-3 rounded-md text-base lg:text-lg" id="component-{title}">
	<div class="flex justify-between align-top">
		<div>
			<h3 class="text-xl">
				<a href="#component-{title}"># {title}</a>
			</h3>
		</div>
		<div>
			{#if repository.includes('github')}
				<a
					class="repo border-none aspect-square flex box-border rounded-full"
					title="Go to the source code"
					target="_blank"
					href={repository}
				>
					<img style="display:inline" src="/images/github_logo.svg" alt="github logo" />
				</a>
			{:else if repository.includes('gitlab')}
				<a
					class="repo border-none aspect-square flex box-border rounded-full"
					title="Go to the source code"
					target="_blank"
					href={repository}
				>
					<img style="display:inline" src="/images/gitlab_logo.svg" alt="gitlab logo" />
				</a>
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
	<p class="flex-grow pb-6">{description}</p>
	<div class="flex justify-between items-end">
		<div>
			{#if typeof stars !== 'undefined'}
				&#9733;
				<code>{stars}</code>
			{/if}
		</div>
		{#if date && version}<span class="text-sm">Updated {relativeDate(date)} ({version})</span>{/if}
	</div>
</div>

<style>
	.card {
		background: #f3f6f9;
	}
	.card:hover {
		background: #e8f3fe;
	}
	.repo {
		min-height: 26px;
		padding: 4px;
		margin: -4px;
		background-color: rgba(0, 0, 0, 0);
		transition: background-color 200ms ease-out;
	}
	.repo:hover {
		background-color: rgba(0, 0, 0, 0.25);
	}
</style>
