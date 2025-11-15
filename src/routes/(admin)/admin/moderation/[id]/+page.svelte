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
	let showDetails = $state(true)
	let showSubmitter = $state(true)

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

<div class="container mx-auto px-2 py-6">
	<!-- Back navigation -->
	<div class="mb-6">
		<Button size="sm" variant="secondary" href="/admin/moderation">
			<ArrowLeft class="h-4 w-4" weight="bold" />
			Back to Queue
		</Button>
	</div>

	<!-- Hero Card with Type-Specific Preview -->
	<div class="mb-8 overflow-hidden rounded-3xl border-2 border-svelte-200 bg-gradient-to-br from-svelte-50 via-white to-svelte-50/30 shadow-xl">
		<!-- Status Banner -->
		{#if data.item.status !== 'pending'}
			<div class="bg-gradient-to-r from-gray-100 to-gray-50 px-8 py-4 border-b-2 border-gray-200">
				<div class="flex items-center justify-center gap-3">
					<div class="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
						{#if data.item.status === 'approved'}
							<CheckCircle class="h-5 w-5 text-green-600" weight="bold" />
						{:else}
							<XCircle class="h-5 w-5 text-red-600" weight="bold" />
						{/if}
					</div>
					<p class="text-sm font-bold text-gray-700">
						This submission has been <span class="capitalize">{data.item.status}</span>
					</p>
				</div>
			</div>
		{/if}

		<!-- Title & Metadata Timeline -->
		<div class="px-8 py-6 border-b border-svelte-100">
			<div class="flex items-start justify-between gap-6">
				<div class="flex-1">
					<div class="flex items-center gap-3 mb-3">
						<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-svelte-500 to-svelte-300 shadow-lg">
							<ClipboardText class="h-6 w-6 text-white" weight="duotone" />
						</div>
						<div>
							<h1 class="text-2xl font-bold text-gray-900">{submissionData.title}</h1>
							<div class="mt-1 flex items-center gap-4">
								<Badge color={colorMap.get(data.item.status)} text={data.item.status} data-testid="moderation-item-status" />
								<span class="text-sm font-medium capitalize text-svelte-600">{data.item.type}</span>
							</div>
						</div>
					</div>

					<!-- Timeline Metadata -->
					<div class="ml-15 flex flex-wrap items-center gap-6">
						<div class="flex items-center gap-2">
							<Clock class="h-4 w-4 text-gray-400" weight="bold" />
							<span class="text-sm text-gray-600">{formatRelativeDate(data.item.submitted_at)}</span>
						</div>
						{#if submissionData.tagNames && submissionData.tagNames.length > 0}
							<div class="flex items-center gap-2">
								<Tag class="h-4 w-4 text-gray-400" weight="bold" />
								<div class="flex flex-wrap gap-1.5">
									{#each submissionData.tagNames as tagName}
										<span class="inline-flex items-center rounded-full bg-svelte-100 px-2.5 py-0.5 text-xs font-semibold text-svelte-700">
											{tagName}
										</span>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				</div>

				<!-- Decision Actions (Sticky on Desktop) -->
				{#if data.item.status === 'pending'}
					<div class="shrink-0 flex flex-col gap-2">
						<form method="POST" action="?/approve" use:enhance>
							<Button type="submit" variant="success" width="full" size="lg" data-testid="moderation-approve-button">
								<CheckCircle class="h-5 w-5" weight="bold" />
								Approve Submission
							</Button>
						</form>
						<form method="POST" action="?/reject" use:enhance>
							<Button type="submit" variant="error" width="full" size="lg" data-testid="moderation-reject-button">
								<XCircle class="h-5 w-5" weight="bold" />
								Reject Submission
							</Button>
						</form>
					</div>
				{/if}
			</div>
		</div>

		<!-- Visual Content Preview (Full Width Hero) -->
		<div class="bg-white">
			{#if data.item.type === 'video' && videoId}
				<!-- YouTube Video Preview -->
				<div class="relative bg-black">
					<div class="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-lg bg-black/60 px-3 py-2 backdrop-blur-sm">
						<YoutubeLogo class="h-5 w-5 text-red-500" weight="fill" />
						<span class="text-sm font-bold text-white">YouTube Video</span>
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
					<div class="border-t border-gray-100 bg-gray-50 px-6 py-4">
						<a
							href={submissionData.url}
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-2 text-sm font-medium text-svelte-600 hover:text-svelte-700 transition-colors"
						>
							<YoutubeLogo class="h-4 w-4" weight="bold" />
							{submissionData.url}
						</a>
					</div>
				{/if}
			{:else if data.item.type === 'library' && submissionData.github_repo}
				<!-- GitHub Repository Card -->
				<div class="p-8">
					<div class="rounded-2xl border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8 shadow-md">
						<div class="flex items-start gap-6">
							<div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 shadow-lg">
								<GithubLogo class="h-9 w-9 text-white" weight="fill" />
							</div>
							<div class="flex-1">
								<h3 class="text-xl font-bold text-gray-900 mb-2">GitHub Repository</h3>
								<p class="font-mono text-lg text-gray-700 mb-4">{submissionData.github_repo}</p>
								<a
									href={getGitHubUrl(submissionData.github_repo)}
									target="_blank"
									rel="noopener noreferrer"
									class="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-gray-800 hover:shadow-lg"
								>
									<GithubLogo class="h-4 w-4" weight="bold" />
									View on GitHub
								</a>
							</div>
						</div>
					</div>
				</div>
			{:else if data.item.type === 'recipe' && submissionData.body}
				<!-- Recipe Preview -->
				<div class="p-8">
					<div class="rounded-2xl border-2 border-svelte-200 bg-white shadow-md">
						<div class="border-b-2 border-svelte-100 bg-gradient-to-r from-svelte-50 to-white px-6 py-4">
							<div class="flex items-center gap-3">
								<FileText class="h-6 w-6 text-svelte-500" weight="duotone" />
								<h3 class="text-lg font-bold text-gray-900">Recipe Content</h3>
							</div>
						</div>
						<div class="max-h-96 overflow-y-auto p-6">
							<pre class="text-sm leading-relaxed whitespace-pre-wrap text-gray-900">{submissionData.body}</pre>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Expandable Details Sections -->
	<div class="space-y-4">
		<!-- Content Details Section -->
		<div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
			<button
				onclick={() => showDetails = !showDetails}
				class="w-full border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-4 text-left transition-colors hover:from-gray-100"
			>
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3">
						<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-svelte-500 to-svelte-300 shadow-md">
							<FileText class="h-5 w-5 text-white" weight="duotone" />
						</div>
						<h2 class="text-lg font-bold text-gray-900">Content Details</h2>
					</div>
					<div class="text-sm font-medium text-gray-500">
						{showDetails ? 'Hide' : 'Show'}
					</div>
				</div>
			</button>

			{#if showDetails}
				<div class="p-6">
					<div class="grid gap-6 md:grid-cols-2">
						{#if submissionData.description}
							<div class="md:col-span-2 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4">
								<h3 class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Description</h3>
								<p class="text-sm leading-relaxed text-gray-900">{submissionData.description}</p>
							</div>
						{/if}

						{#if submissionData.notes}
							<div class="md:col-span-2 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4">
								<h3 class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Submitter Notes</h3>
								<p class="text-sm leading-relaxed text-gray-600">{submissionData.notes}</p>
							</div>
						{/if}

						{#if !submissionData.description && !submissionData.notes}
							<div class="md:col-span-2 text-center py-8">
								<p class="text-sm text-gray-500">No additional details provided</p>
							</div>
						{/if}
					</div>
				</div>
			{/if}
		</div>

		<!-- Submitter Information Section -->
		<div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
			<button
				onclick={() => showSubmitter = !showSubmitter}
				class="w-full border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-4 text-left transition-colors hover:from-gray-100"
			>
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3">
						<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-svelte-500 to-svelte-300 shadow-md">
							<User class="h-5 w-5 text-white" weight="duotone" />
						</div>
						<h2 class="text-lg font-bold text-gray-900">Submitter Information</h2>
					</div>
					<div class="text-sm font-medium text-gray-500">
						{showSubmitter ? 'Hide' : 'Show'}
					</div>
				</div>
			</button>

			{#if showSubmitter}
				<div class="p-6">
					<div class="flex items-start gap-6">
						{#if data.submitter.avatar_url}
							<img
								src={data.submitter.avatar_url}
								alt={data.submitter.name}
								class="h-20 w-20 rounded-2xl shadow-lg ring-2 ring-svelte-100"
							/>
						{:else}
							<div class="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 shadow-lg">
								<User class="h-10 w-10 text-gray-600" weight="bold" />
							</div>
						{/if}

						<div class="flex-1 space-y-4">
							<div>
								<h3 class="text-xl font-bold text-gray-900">{data.submitter.name}</h3>
								<p class="text-sm text-gray-600">{data.submitter.email}</p>
							</div>

							<div class="flex items-center gap-2">
								<Badge
									color={roleColorMap.get(data.submitter.role || 'user')}
									text={data.submitter.role || 'user'}
								/>
							</div>

							{#if data.submitter.username || data.submitter.twitter}
								<div class="flex flex-wrap items-center gap-3">
									{#if data.submitter.username}
										<a
											href="https://github.com/{data.submitter.username}"
											target="_blank"
											rel="noopener noreferrer"
											class="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-gray-800 hover:shadow-md"
										>
											<GithubLogo class="h-4 w-4" weight="bold" />
											@{data.submitter.username}
										</a>
									{/if}
									{#if data.submitter.twitter}
										<a
											href="https://twitter.com/{data.submitter.twitter}"
											target="_blank"
											rel="noopener noreferrer"
											class="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-600 hover:shadow-md"
										>
											<TwitterLogo class="h-4 w-4" weight="bold" />
											@{data.submitter.twitter}
										</a>
									{/if}
								</div>
							{/if}
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- Raw JSON Data Section -->
		<div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
			<button
				onclick={() => showRawJSON = !showRawJSON}
				class="w-full border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-4 text-left transition-colors hover:from-gray-100"
			>
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3">
						<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 shadow-md">
							<Code class="h-5 w-5 text-white" weight="duotone" />
						</div>
						<h2 class="text-lg font-bold text-gray-900">Raw Submission Data</h2>
					</div>
					<div class="text-sm font-medium text-gray-500">
						{showRawJSON ? 'Hide' : 'Show'} JSON
					</div>
				</div>
			</button>

			{#if showRawJSON}
				<div class="p-6">
					<div class="max-h-96 overflow-auto rounded-xl border border-gray-200 bg-gray-900 p-4">
						<pre class="text-xs text-green-400 font-mono">{formatJSON(submissionData)}</pre>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
