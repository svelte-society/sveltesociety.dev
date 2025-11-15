<script lang="ts">
	import { enhance } from '$app/forms'
	import Badge from '$lib/ui/admin/Badge.svelte'
	import Button from '$lib/ui/Button.svelte'
	import ArrowLeft from 'phosphor-svelte/lib/ArrowLeft'
	import XCircle from 'phosphor-svelte/lib/XCircle'
	import CheckCircle from 'phosphor-svelte/lib/CheckCircle'
	import ClipboardText from 'phosphor-svelte/lib/ClipboardText'
	import User from 'phosphor-svelte/lib/User'
	import Clock from 'phosphor-svelte/lib/Clock'
	import Tag from 'phosphor-svelte/lib/Tag'
	import GithubLogo from 'phosphor-svelte/lib/GithubLogo'
	import YoutubeLogo from 'phosphor-svelte/lib/YoutubeLogo'
	import FileText from 'phosphor-svelte/lib/FileText'
	import Code from 'phosphor-svelte/lib/Code'
	import TwitterLogo from 'phosphor-svelte/lib/TwitterLogo'
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

<div class="container mx-auto px-2 py-4">
	<!-- Compact Header with Back Button and Actions -->
	<div class="mb-4 flex items-center justify-between gap-4">
		<Button size="sm" variant="secondary" href="/admin/moderation">
			<ArrowLeft class="h-4 w-4" weight="bold" />
			Back
		</Button>

		{#if data.item.status === 'pending'}
			<div class="flex gap-2">
				<form method="POST" action="?/reject" use:enhance class="inline">
					<Button type="submit" variant="error" size="sm" data-testid="moderation-reject-button">
						<XCircle class="h-4 w-4" weight="bold" />
						Reject
					</Button>
				</form>
				<form method="POST" action="?/approve" use:enhance class="inline">
					<Button type="submit" variant="success" size="sm" data-testid="moderation-approve-button">
						<CheckCircle class="h-4 w-4" weight="bold" />
						Approve
					</Button>
				</form>
			</div>
		{:else}
			<div class="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5">
				{#if data.item.status === 'approved'}
					<CheckCircle class="h-4 w-4 text-green-600" weight="bold" />
				{:else}
					<XCircle class="h-4 w-4 text-red-600" weight="bold" />
				{/if}
				<span class="text-sm font-semibold capitalize text-gray-700">{data.item.status}</span>
			</div>
		{/if}
	</div>

	<!-- Compact Title Bar -->
	<div class="mb-4 rounded-xl border border-svelte-200 bg-gradient-to-r from-svelte-50 to-white p-4 shadow-sm">
		<div class="flex items-start justify-between gap-4">
			<div class="flex-1">
				<div class="flex items-center gap-3 mb-2">
					<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-svelte-500 to-svelte-300 shadow-md">
						<ClipboardText class="h-5 w-5 text-white" weight="duotone" />
					</div>
					<div class="flex-1">
						<h1 class="text-xl font-bold text-gray-900 leading-tight">{submissionData.title}</h1>
						<div class="mt-1 flex items-center gap-3 text-xs">
							<Badge color={colorMap.get(data.item.status)} text={data.item.status} data-testid="moderation-item-status" />
							<span class="font-semibold capitalize text-svelte-600">{data.item.type}</span>
							<span class="text-gray-500">•</span>
							<div class="flex items-center gap-1">
								<Clock class="h-3 w-3 text-gray-400" weight="bold" />
								<span class="text-gray-600">{formatRelativeDate(data.item.submitted_at)}</span>
							</div>
						</div>
					</div>
				</div>

				{#if submissionData.tagNames && submissionData.tagNames.length > 0}
					<div class="ml-13 flex flex-wrap gap-1">
						{#each submissionData.tagNames as tagName}
							<span class="inline-flex items-center rounded-full bg-svelte-100 px-2 py-0.5 text-xs font-semibold text-svelte-700">
								{tagName}
							</span>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Two Column Layout for Dense Information -->
	<div class="grid gap-4 lg:grid-cols-3">
		<!-- Left Column: Content Preview (2/3 width) -->
		<div class="lg:col-span-2 space-y-4">
			<!-- Visual Preview Card -->
			<div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

				{#if data.item.type === 'video' && videoId}
					<!-- YouTube Video Preview -->
					<div class="relative bg-black">
						<div class="absolute top-2 left-2 z-10 flex items-center gap-1.5 rounded-md bg-black/70 px-2 py-1 backdrop-blur-sm">
							<YoutubeLogo class="h-4 w-4 text-red-500" weight="fill" />
							<span class="text-xs font-bold text-white">YouTube</span>
						</div>
						<div class="aspect-video w-full">
							<iframe
								src="https://www.youtube.com/embed/{videoId}"
								title="YouTube video player"
								class="h-full w-full"
								allowfullscreen
							></iframe>
						</div>
					</div>
					{#if submissionData.url}
						<div class="border-t border-gray-100 bg-gray-50 px-3 py-2">
							<a
								href={submissionData.url}
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center gap-1.5 text-xs font-medium text-svelte-600 hover:text-svelte-700 transition-colors truncate"
							>
								<YoutubeLogo class="h-3.5 w-3.5 shrink-0" weight="bold" />
								<span class="truncate">{submissionData.url}</span>
							</a>
						</div>
					{/if}
				{:else if data.item.type === 'library' && submissionData.github_repo}
					<!-- GitHub Repository Card -->
					<div class="p-4">
						<div class="rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4">
							<div class="flex items-start gap-4">
								<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 shadow-md">
									<GithubLogo class="h-6 w-6 text-white" weight="fill" />
								</div>
								<div class="flex-1 min-w-0">
									<h3 class="text-sm font-bold text-gray-900 mb-1">GitHub Repository</h3>
									<p class="font-mono text-sm text-gray-700 mb-3 truncate">{submissionData.github_repo}</p>
									<a
										href={getGitHubUrl(submissionData.github_repo)}
										target="_blank"
										rel="noopener noreferrer"
										class="inline-flex items-center gap-1.5 rounded-md bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-gray-800"
									>
										<GithubLogo class="h-3.5 w-3.5" weight="bold" />
										View on GitHub
									</a>
								</div>
							</div>
						</div>
					</div>
				{:else if data.item.type === 'recipe' && submissionData.body}
					<!-- Recipe Preview -->
					<div class="border-b border-gray-100 bg-gradient-to-r from-svelte-50 to-white px-3 py-2">
						<div class="flex items-center gap-2">
							<FileText class="h-4 w-4 text-svelte-500" weight="duotone" />
							<h3 class="text-sm font-bold text-gray-900">Recipe Content</h3>
						</div>
					</div>
					<div class="max-h-80 overflow-y-auto p-4">
						<pre class="text-xs leading-relaxed whitespace-pre-wrap text-gray-900">{submissionData.body}</pre>
					</div>
				{/if}
			</div>

			<!-- Content Details -->
			{#if submissionData.description || submissionData.notes}
				<div class="rounded-xl border border-gray-200 bg-white shadow-sm">
					<div class="border-b border-gray-100 bg-gray-50 px-3 py-2">
						<div class="flex items-center gap-2">
							<FileText class="h-4 w-4 text-gray-600" weight="bold" />
							<h3 class="text-sm font-bold text-gray-900">Details</h3>
						</div>
					</div>
					<div class="p-4 space-y-3">
						{#if submissionData.description}
							<div>
								<h4 class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Description</h4>
								<p class="text-sm leading-relaxed text-gray-900">{submissionData.description}</p>
							</div>
						{/if}

						{#if submissionData.notes}
							<div>
								<h4 class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Notes</h4>
								<p class="text-sm leading-relaxed text-gray-600">{submissionData.notes}</p>
							</div>
						{/if}
					</div>
				</div>
			{/if}

			<!-- Raw JSON (Collapsed by default) -->
			<div class="rounded-xl border border-gray-200 bg-white shadow-sm">
				<button
					onclick={() => showRawJSON = !showRawJSON}
					class="w-full border-b border-gray-100 bg-gray-50 px-3 py-2 text-left transition-colors hover:bg-gray-100"
				>
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-2">
							<Code class="h-4 w-4 text-gray-600" weight="bold" />
							<h3 class="text-sm font-bold text-gray-900">Raw JSON</h3>
						</div>
						<span class="text-xs font-medium text-gray-500">
							{showRawJSON ? 'Hide' : 'Show'}
						</span>
					</div>
				</button>

				{#if showRawJSON}
					<div class="p-3">
						<div class="max-h-64 overflow-auto rounded-lg border border-gray-200 bg-gray-900 p-3">
							<pre class="text-xs text-green-400 font-mono">{formatJSON(submissionData)}</pre>
						</div>
					</div>
				{/if}
			</div>
		</div>

		<!-- Right Column: Submitter & Metadata (1/3 width) -->
		<div class="space-y-4">
			<!-- Submitter Card -->
			<div class="rounded-xl border border-gray-200 bg-white shadow-sm">
				<div class="border-b border-gray-100 bg-gray-50 px-3 py-2">
					<div class="flex items-center gap-2">
						<User class="h-4 w-4 text-gray-600" weight="bold" />
						<h3 class="text-sm font-bold text-gray-900">Submitter</h3>
					</div>
				</div>
				<div class="p-4">
					<div class="flex items-start gap-3 mb-3">
						{#if data.submitter.avatar_url}
							<img
								src={data.submitter.avatar_url}
								alt={data.submitter.name}
								class="h-12 w-12 rounded-lg shadow-md ring-2 ring-svelte-100"
							/>
						{:else}
							<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 shadow-md">
								<User class="h-6 w-6 text-gray-600" weight="bold" />
							</div>
						{/if}

						<div class="flex-1 min-w-0">
							<h4 class="text-sm font-bold text-gray-900 truncate">{data.submitter.name}</h4>
							<p class="text-xs text-gray-600 truncate">{data.submitter.email}</p>
							<div class="mt-1">
								<Badge
									color={roleColorMap.get(data.submitter.role || 'user')}
									text={data.submitter.role || 'user'}
								/>
							</div>
						</div>
					</div>

					{#if data.submitter.username || data.submitter.twitter}
						<div class="flex flex-col gap-2 pt-3 border-t border-gray-100">
							{#if data.submitter.username}
								<a
									href="https://github.com/{data.submitter.username}"
									target="_blank"
									rel="noopener noreferrer"
									class="inline-flex items-center gap-1.5 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm transition-all hover:bg-gray-800"
								>
									<GithubLogo class="h-3.5 w-3.5" weight="bold" />
									<span class="truncate">@{data.submitter.username}</span>
								</a>
							{/if}
							{#if data.submitter.twitter}
								<a
									href="https://twitter.com/{data.submitter.twitter}"
									target="_blank"
									rel="noopener noreferrer"
									class="inline-flex items-center gap-1.5 rounded-md bg-blue-500 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm transition-all hover:bg-blue-600"
								>
									<TwitterLogo class="h-3.5 w-3.5" weight="bold" />
									<span class="truncate">@{data.submitter.twitter}</span>
								</a>
							{/if}
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
