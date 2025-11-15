<script lang="ts">
	import { enhance } from '$app/forms'
	import Badge from '$lib/ui/admin/Badge.svelte'
	import Button from '$lib/ui/Button.svelte'
	import ArrowLeft from 'phosphor-svelte/lib/ArrowLeft'
	import XCircle from 'phosphor-svelte/lib/XCircle'
	import CheckCircle from 'phosphor-svelte/lib/CheckCircle'
	import User from 'phosphor-svelte/lib/User'
	import Clock from 'phosphor-svelte/lib/Clock'
	import Tag from 'phosphor-svelte/lib/Tag'
	import GithubLogo from 'phosphor-svelte/lib/GithubLogo'
	import YoutubeLogo from 'phosphor-svelte/lib/YoutubeLogo'
	import FileText from 'phosphor-svelte/lib/FileText'
	import Code from 'phosphor-svelte/lib/Code'
	import TwitterLogo from 'phosphor-svelte/lib/TwitterLogo'
	import Info from 'phosphor-svelte/lib/Info'
	import { formatRelativeDate } from '$lib/utils/date'
	let { data } = $props()

	function formatJSON(obj: any): string {
		return JSON.stringify(obj, null, 2)
	}

	let colorMap = new Map([
		['pending', 'warning'],
		['approved', 'success'],
		['rejected', 'danger']
	])

	const roleColorMap = new Map([
		['admin', 'success'],
		['editor', 'warning'],
		['user', 'danger']
	])

	const submissionData = data.item.parsedData || JSON.parse(data.item.data)
	let showRawJSON = $state(false)
	let activeTab = $state<'preview' | 'details' | 'json'>('preview')

	// Extract video ID for YouTube embeds
	const videoId =
		submissionData.type === 'video' && submissionData.url
			? submissionData.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1]
			: null

	// Extract GitHub owner/repo from various formats
	function getGitHubUrl(githubRepo: string): string {
		// If it's already a full URL, return as-is
		if (githubRepo.startsWith('http://') || githubRepo.startsWith('https://')) {
			return githubRepo
		}
		// Otherwise, construct URL from owner/repo format
		return `https://github.com/${githubRepo}`
	}
</script>

<!-- Full Screen Split View -->
<div class="fixed inset-0 bg-gray-50 flex flex-col">
	<!-- Top Action Bar -->
	<div class="shrink-0 border-b border-gray-200 bg-white px-6 py-3 shadow-sm">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-4">
				<Button size="sm" variant="secondary" href="/admin/moderation">
					<ArrowLeft class="h-4 w-4" weight="bold" />
				</Button>

				<div class="flex items-center gap-3">
					<Badge color={colorMap.get(data.item.status)} text={data.item.status} data-testid="moderation-item-status" />
					<span class="text-sm text-gray-400">•</span>
					<span class="text-sm font-medium capitalize text-gray-700">{data.item.type}</span>
					<span class="text-sm text-gray-400">•</span>
					<div class="flex items-center gap-1.5">
						<Clock class="h-3.5 w-3.5 text-gray-400" weight="bold" />
						<span class="text-sm text-gray-600">{formatRelativeDate(data.item.submitted_at)}</span>
					</div>
				</div>
			</div>

			{#if data.item.status === 'pending'}
				<div class="flex gap-2">
					<form method="POST" action="?/reject" use:enhance class="inline">
						<Button type="submit" variant="error" data-testid="moderation-reject-button">
							<XCircle class="h-5 w-5" weight="bold" />
							Reject
						</Button>
					</form>
					<form method="POST" action="?/approve" use:enhance class="inline">
						<Button type="submit" variant="success" data-testid="moderation-approve-button">
							<CheckCircle class="h-5 w-5" weight="bold" />
							Approve
						</Button>
					</form>
				</div>
			{:else}
				<div class="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2">
					{#if data.item.status === 'approved'}
						<CheckCircle class="h-5 w-5 text-green-600" weight="bold" />
					{:else}
						<XCircle class="h-5 w-5 text-red-600" weight="bold" />
					{/if}
					<span class="font-semibold capitalize text-gray-700">{data.item.status}</span>
				</div>
			{/if}
		</div>
	</div>

	<!-- Split Screen Content -->
	<div class="flex flex-1 overflow-hidden">
		<!-- LEFT: Content Preview (60%) -->
		<div class="flex w-[60%] flex-col border-r border-gray-200 bg-white">
			<!-- Title Card -->
			<div class="shrink-0 border-b border-gray-100 bg-gradient-to-br from-svelte-50 to-white p-6">
				<h1 class="text-2xl font-bold text-gray-900 mb-3">{submissionData.title}</h1>

				{#if submissionData.tagNames && submissionData.tagNames.length > 0}
					<div class="flex flex-wrap gap-2">
						{#each submissionData.tagNames as tagName}
							<span class="inline-flex items-center gap-1.5 rounded-full bg-svelte-500 px-3 py-1 text-sm font-semibold text-white shadow-sm">
								<Tag class="h-3.5 w-3.5" weight="bold" />
								{tagName}
							</span>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Tabbed Content -->
			<div class="shrink-0 border-b border-gray-200 bg-white">
				<div class="flex gap-1 px-4 pt-2">
					<button
						onclick={() => activeTab = 'preview'}
						class="relative px-4 py-2 text-sm font-semibold transition-colors {activeTab === 'preview' ? 'text-svelte-600' : 'text-gray-500 hover:text-gray-700'}"
					>
						Preview
						{#if activeTab === 'preview'}
							<div class="absolute bottom-0 left-0 right-0 h-0.5 bg-svelte-500"></div>
						{/if}
					</button>
					<button
						onclick={() => activeTab = 'details'}
						class="relative px-4 py-2 text-sm font-semibold transition-colors {activeTab === 'details' ? 'text-svelte-600' : 'text-gray-500 hover:text-gray-700'}"
					>
						Details
						{#if activeTab === 'details'}
							<div class="absolute bottom-0 left-0 right-0 h-0.5 bg-svelte-500"></div>
						{/if}
					</button>
					<button
						onclick={() => activeTab = 'json'}
						class="relative px-4 py-2 text-sm font-semibold transition-colors {activeTab === 'json' ? 'text-svelte-600' : 'text-gray-500 hover:text-gray-700'}"
					>
						Raw Data
						{#if activeTab === 'json'}
							<div class="absolute bottom-0 left-0 right-0 h-0.5 bg-svelte-500"></div>
						{/if}
					</button>
				</div>
			</div>

			<!-- Tab Content -->
			<div class="flex-1 overflow-y-auto bg-gray-50">
				{#if activeTab === 'preview'}
					{#if data.item.type === 'video' && videoId}
						<div class="aspect-video w-full bg-black">
							<iframe
								src="https://www.youtube.com/embed/{videoId}"
								title="YouTube video player"
								class="h-full w-full"
								allowfullscreen
							></iframe>
						</div>
						{#if submissionData.url}
							<div class="border-b border-gray-200 bg-white p-4">
								<div class="flex items-center gap-2">
									<YoutubeLogo class="h-5 w-5 text-red-500" weight="fill" />
									<a
										href={submissionData.url}
										target="_blank"
										rel="noopener noreferrer"
										class="text-sm font-medium text-svelte-600 hover:text-svelte-700 underline decoration-2 underline-offset-2 truncate"
									>
										{submissionData.url}
									</a>
								</div>
							</div>
						{/if}
					{:else if data.item.type === 'library' && submissionData.github_repo}
						<div class="flex items-center justify-center p-12">
							<div class="max-w-lg w-full rounded-2xl border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8 shadow-lg text-center">
								<div class="flex justify-center mb-6">
									<div class="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 shadow-xl">
										<GithubLogo class="h-10 w-10 text-white" weight="fill" />
									</div>
								</div>
								<h2 class="text-2xl font-bold text-gray-900 mb-2">GitHub Repository</h2>
								<p class="font-mono text-lg text-gray-700 mb-6">{submissionData.github_repo}</p>
								<a
									href={getGitHubUrl(submissionData.github_repo)}
									target="_blank"
									rel="noopener noreferrer"
									class="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-gray-800 hover:shadow-xl hover:scale-105"
								>
									<GithubLogo class="h-5 w-5" weight="bold" />
									View on GitHub
								</a>
							</div>
						</div>
					{:else if data.item.type === 'recipe' && submissionData.body}
						<div class="p-6">
							<div class="rounded-xl bg-white border border-gray-200 shadow-sm">
								<div class="border-b border-gray-100 bg-gradient-to-r from-svelte-50 to-white px-4 py-3">
									<div class="flex items-center gap-2">
										<FileText class="h-5 w-5 text-svelte-500" weight="duotone" />
										<h3 class="font-bold text-gray-900">Recipe Content</h3>
									</div>
								</div>
								<div class="p-6">
									<pre class="text-sm leading-relaxed whitespace-pre-wrap text-gray-900">{submissionData.body}</pre>
								</div>
							</div>
						</div>
					{/if}

				{:else if activeTab === 'details'}
					<div class="p-6 space-y-4">
						{#if submissionData.description}
							<div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
								<h3 class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Description</h3>
								<p class="text-base leading-relaxed text-gray-900">{submissionData.description}</p>
							</div>
						{/if}

						{#if submissionData.notes}
							<div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
								<h3 class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Submitter Notes</h3>
								<p class="text-base leading-relaxed text-gray-700">{submissionData.notes}</p>
							</div>
						{/if}

						{#if !submissionData.description && !submissionData.notes}
							<div class="flex flex-col items-center justify-center py-20 text-center">
								<Info class="h-12 w-12 text-gray-300 mb-4" weight="duotone" />
								<p class="text-lg font-medium text-gray-500">No additional details provided</p>
							</div>
						{/if}
					</div>

				{:else if activeTab === 'json'}
					<div class="h-full bg-gray-900 p-6">
						<pre class="text-sm text-green-400 font-mono">{formatJSON(submissionData)}</pre>
					</div>
				{/if}
			</div>
		</div>

		<!-- RIGHT: Submitter Card (40%) -->
		<div class="flex w-[40%] flex-col bg-gradient-to-br from-gray-50 to-white overflow-y-auto">
			<div class="p-8 space-y-6">
				<!-- Submitter Profile Card -->
				<div class="rounded-2xl border-2 border-svelte-200 bg-white shadow-lg overflow-hidden">
					<div class="bg-gradient-to-r from-svelte-500 to-svelte-300 px-6 py-8 text-center">
						{#if data.submitter.avatar_url}
							<img
								src={data.submitter.avatar_url}
								alt={data.submitter.name}
								class="mx-auto h-24 w-24 rounded-full border-4 border-white shadow-xl ring-4 ring-svelte-100"
							/>
						{:else}
							<div class="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-white shadow-xl">
								<User class="h-12 w-12 text-gray-600" weight="bold" />
							</div>
						{/if}
					</div>

					<div class="p-6">
						<h3 class="text-2xl font-bold text-gray-900 text-center mb-2">{data.submitter.name}</h3>
						<p class="text-sm text-gray-600 text-center mb-4">{data.submitter.email}</p>

						<div class="flex justify-center mb-6">
							<Badge
								color={roleColorMap.get(data.submitter.role || 'user')}
								text={data.submitter.role || 'user'}
							/>
						</div>

						{#if data.submitter.username || data.submitter.twitter}
							<div class="flex flex-col gap-3 pt-6 border-t border-gray-100">
								{#if data.submitter.username}
									<a
										href="https://github.com/{data.submitter.username}"
										target="_blank"
										rel="noopener noreferrer"
										class="flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-3 font-semibold text-white shadow-md transition-all hover:bg-gray-800 hover:shadow-lg hover:scale-105"
									>
										<GithubLogo class="h-5 w-5" weight="bold" />
										@{data.submitter.username}
									</a>
								{/if}
								{#if data.submitter.twitter}
									<a
										href="https://twitter.com/{data.submitter.twitter}"
										target="_blank"
										rel="noopener noreferrer"
										class="flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-3 font-semibold text-white shadow-md transition-all hover:bg-blue-600 hover:shadow-lg hover:scale-105"
									>
										<TwitterLogo class="h-5 w-5" weight="bold" />
										@{data.submitter.twitter}
									</a>
								{/if}
							</div>
						{/if}
					</div>
				</div>

				<!-- Quick Info Cards -->
				<div class="grid grid-cols-2 gap-4">
					<div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm text-center">
						<div class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Type</div>
						<div class="text-lg font-bold capitalize text-svelte-600">{data.item.type}</div>
					</div>
					<div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm text-center">
						<div class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Submitted</div>
						<div class="text-sm font-semibold text-gray-900">{formatRelativeDate(data.item.submitted_at)}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
