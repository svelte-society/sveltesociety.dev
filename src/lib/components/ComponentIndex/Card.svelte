<script lang="ts">
	import Tag from '../Tag.svelte';
	import { copyToClipboard } from '$lib/utils/clipboard';
	import { packageManager as manager } from '$stores/packageManager';
	import { relativeDate } from '$utils/relativeDate';

	export let title: string;
	export let description: string;
	export let stars: string;
	export let npm: string | undefined = undefined;
	export let gem: string | undefined = undefined;
	export let repository: string | undefined = undefined;
	export let date = undefined;
	export let version = undefined;

	let clipboardCopy = false;

	const copy = () => {
		copyToClipboard(packageManagerAction($manager, npm, gem)).then(() => (clipboardCopy = false));
		clipboardCopy = true;
	};

	const packageManagerAction = ($manager: Array<string>, npm?: string, gem?: string): string => {
		if (npm) {
			return `${packageManagers[$manager.find((m) => ['npm', 'pnpm', 'yarn'].includes(m)) ?? 'npm']} ${npm}`;
		}
		if (gem) {
			return `${packageManagers[$manager.find((m) => ['gem', 'bundler'].includes(m)) ?? 'gem']} ${gem}`;
		}
		return '';
	};

	const packageManagers = {
		npm: 'npm install',
		pnpm: 'pnpm add',
		yarn: 'yarn add',
		gem: 'gem install',
		bundler: 'bundle add'
	};
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

	{#if npm || gem}
		<Tag
			click={() => copy()}
			variant="copy"
			title={clipboardCopy ? 'copied!' : packageManagerAction($manager, npm, gem)}
		/>
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
