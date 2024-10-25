<script lang="ts">
	import Tag from '../Tag.svelte';
	import { copyToClipboard } from '$lib/utils/clipboard';
	import { packageManager as manager } from '$stores/packageManager';
	import { relativeDate } from '$utils/relativeDate';
	import { derived } from 'svelte/store';

	export let title: string;
	export let description: string;
	export let stars: string;
	export let npm: string | undefined = undefined;
	export let gem: string | undefined = undefined;
	export let jsr: string | undefined = undefined;
	export let repository: string | undefined = undefined;
	export let date = undefined;
	export let version = undefined;

	let clipboardCopy = false;

	const copy = () => {
		copyToClipboard($managerAction).then(() => (clipboardCopy = false));
		clipboardCopy = true;
	};

	const managerAction = derived(manager, ($manager) => {
		if (npm && $manager.includes('npm')) {
			return `npm install ${npm}`;
		}
		if (npm && $manager.includes('pnpm')) {
			return `pnpm add ${npm}`;
		}
		if (npm && $manager.includes('yarn')) {
			return `yarn add ${npm}`;
		}
		if (npm && $manager.includes('deno')) {
			return `deno install npm:${npm}`;
		}

		if (gem && $manager.includes('gem')) {
			return `gem install ${gem}`;
		}
		if (gem && $manager.includes('bundler')) {
			return `bundle add ${gem}`;
		}

		if (jsr && $manager.includes('npm')) {
			return `npx jsr add ${jsr}`;
		}
		if (jsr && $manager.includes('pnpm')) {
			return `pnpm dlx jsr add ${jsr}`;
		}
		if (jsr && $manager.includes('yarn')) {
			return `yarn dlx jsr add ${jsr}`;
		}
		if (jsr && $manager.includes('deno')) {
			return `deno install ${jsr}`;
		}

		return '';
	});
</script>

<div class="card flex flex-col rounded-md p-3 text-base lg:text-lg" id={title}>
	<div class="flex justify-between align-top">
		<div>
			<h3 class="text-xl">
				<a href="#{title}"># {title}</a>
			</h3>
		</div>
		<div>
			{#if repository?.includes('github')}
				<a
					class="repo box-border flex aspect-square rounded-full border-none"
					title="Go to the source code"
					target="_blank"
					href={repository}
				>
					<img style="display:inline" src="/images/github_logo.svg" alt="github logo" />
				</a>
			{:else if repository?.includes('gitlab')}
				<a
					class="repo box-border flex aspect-square rounded-full border-none"
					title="Go to the source code"
					target="_blank"
					href={repository}
				>
					<img style="display:inline" src="/images/gitlab_logo.svg" alt="gitlab logo" />
				</a>
			{:else if repository}
				<a
					class="repo box-border flex aspect-square rounded-full border-none"
					title="Go to the source code"
					target="_blank"
					href={repository}
				>
					🌐
				</a>
			{/if}
		</div>
	</div>

	{#if npm || gem || jsr}
		<Tag click={() => copy()} variant="copy" title={clipboardCopy ? 'copied!' : $managerAction} />
	{/if}
	<p class="flex-grow pb-6">{description}</p>
	<div class="flex items-end justify-between">
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
		text-decoration: none;
		font-size: 1rem;
		line-height: 18px;
	}
	.repo:hover {
		background-color: rgba(0, 0, 0, 0.25);
	}
</style>
