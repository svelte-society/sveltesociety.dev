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

<!-- BRUTALIST FULL SCREEN -->
<div class="fixed inset-0 bg-black flex flex-col font-mono">
	<!-- STARK TOP BAR -->
	<div class="shrink-0 border-b-4 border-white bg-black px-4 py-2">
		<div class="flex items-center justify-between text-white">
			<div class="flex items-center gap-6">
				<a href="/admin/moderation" class="border-2 border-white px-3 py-1 uppercase hover:bg-white hover:text-black transition-colors">
					← BACK
				</a>

				<div class="flex items-center gap-4 text-xs uppercase">
					<span class="border-2 border-white px-2 py-1 {data.item.status === 'approved' ? 'bg-green-500 text-black' : data.item.status === 'rejected' ? 'bg-red-500 text-white' : 'bg-yellow-300 text-black'}" data-testid="moderation-item-status">
						{data.item.status}
					</span>
					<span class="border-2 border-white px-2 py-1">{data.item.type}</span>
					<span class="opacity-50">{formatRelativeDate(data.item.submitted_at)}</span>
				</div>
			</div>

			{#if data.item.status === 'pending'}
				<div class="flex gap-3">
					<form method="POST" action="?/reject" use:enhance class="inline">
						<button type="submit" class="border-4 border-red-500 bg-red-500 px-6 py-2 text-sm font-bold uppercase text-white hover:bg-transparent transition-colors" data-testid="moderation-reject-button">
							✕ REJECT
						</button>
					</form>
					<form method="POST" action="?/approve" use:enhance class="inline">
						<button type="submit" class="border-4 border-green-500 bg-green-500 px-6 py-2 text-sm font-bold uppercase text-black hover:bg-transparent hover:text-green-500 transition-colors" data-testid="moderation-approve-button">
							✓ APPROVE
						</button>
					</form>
				</div>
			{:else}
				<div class="border-2 border-white px-4 py-2 text-sm uppercase">
					STATUS: {data.item.status}
				</div>
			{/if}
		</div>
	</div>

	<!-- SPLIT PANELS -->
	<div class="flex flex-1 overflow-hidden">
		<!-- LEFT: CONTENT (70%) -->
		<div class="flex w-[70%] flex-col border-r-4 border-white bg-white text-black">
			<!-- TITLE BLOCK -->
			<div class="shrink-0 border-b-4 border-black bg-white p-4">
				<h1 class="text-2xl font-bold uppercase mb-3">{submissionData.title}</h1>

				{#if submissionData.tagNames && submissionData.tagNames.length > 0}
					<div class="flex flex-wrap gap-2">
						{#each submissionData.tagNames as tagName}
							<span class="border-2 border-black bg-black px-2 py-1 text-xs font-bold uppercase text-white">
								#{tagName}
							</span>
						{/each}
					</div>
				{/if}
			</div>

			<!-- TABS -->
			<div class="shrink-0 border-b-4 border-black bg-white">
				<div class="flex">
					<button
						onclick={() => activeTab = 'preview'}
						class="border-r-2 border-black px-6 py-2 text-xs font-bold uppercase transition-colors {activeTab === 'preview' ? 'bg-black text-white' : 'hover:bg-gray-200'}"
					>
						[PREVIEW]
					</button>
					<button
						onclick={() => activeTab = 'details'}
						class="border-r-2 border-black px-6 py-2 text-xs font-bold uppercase transition-colors {activeTab === 'details' ? 'bg-black text-white' : 'hover:bg-gray-200'}"
					>
						[DETAILS]
					</button>
					<button
						onclick={() => activeTab = 'json'}
						class="px-6 py-2 text-xs font-bold uppercase transition-colors {activeTab === 'json' ? 'bg-black text-white' : 'hover:bg-gray-200'}"
					>
						[RAW_DATA]
					</button>
				</div>
			</div>

			<!-- CONTENT AREA -->
			<div class="flex-1 overflow-y-auto bg-white">
				{#if activeTab === 'preview'}
					{#if data.item.type === 'video' && videoId}
						<div class="border-b-4 border-black">
							<div class="aspect-video w-full bg-black border-4 border-black">
								<iframe
									src="https://www.youtube.com/embed/{videoId}"
									title="YouTube video player"
									class="h-full w-full"
									allowfullscreen
								></iframe>
							</div>
							{#if submissionData.url}
								<div class="bg-yellow-300 p-3 border-b-2 border-black">
									<p class="text-xs font-bold uppercase">VIDEO_SOURCE:</p>
									<a
										href={submissionData.url}
										target="_blank"
										rel="noopener noreferrer"
										class="text-sm font-mono underline decoration-2 hover:bg-black hover:text-yellow-300 transition-colors break-all"
									>
										{submissionData.url}
									</a>
								</div>
							{/if}
						</div>
					{:else if data.item.type === 'library' && submissionData.github_repo}
						<div class="flex items-center justify-center p-8">
							<div class="w-full max-w-2xl border-4 border-black bg-white p-8">
								<div class="border-b-4 border-black pb-4 mb-4">
									<h2 class="text-3xl font-bold uppercase">GITHUB_REPOSITORY</h2>
								</div>
								<p class="font-mono text-xl mb-6 bg-black text-green-400 p-3 break-all">{submissionData.github_repo}</p>
								<a
									href={getGitHubUrl(submissionData.github_repo)}
									target="_blank"
									rel="noopener noreferrer"
									class="block w-full border-4 border-black bg-black px-6 py-4 text-center text-sm font-bold uppercase text-white hover:bg-white hover:text-black transition-colors"
								>
									→ OPEN_REPOSITORY
								</a>
							</div>
						</div>
					{:else if data.item.type === 'recipe' && submissionData.body}
						<div class="p-4">
							<div class="border-4 border-black">
								<div class="border-b-4 border-black bg-black px-4 py-2">
									<h3 class="font-bold uppercase text-white text-sm">RECIPE_CONTENT:</h3>
								</div>
								<div class="bg-gray-100 p-6">
									<pre class="text-sm font-mono whitespace-pre-wrap">{submissionData.body}</pre>
								</div>
							</div>
						</div>
					{/if}

				{:else if activeTab === 'details'}
					<div class="p-4 space-y-4">
						{#if submissionData.description}
							<div class="border-4 border-black bg-white">
								<div class="border-b-4 border-black bg-black px-4 py-2">
									<h3 class="text-xs font-bold uppercase text-white">DESCRIPTION:</h3>
								</div>
								<div class="p-4">
									<p class="text-base leading-relaxed">{submissionData.description}</p>
								</div>
							</div>
						{/if}

						{#if submissionData.notes}
							<div class="border-4 border-black bg-white">
								<div class="border-b-4 border-black bg-yellow-300 px-4 py-2">
									<h3 class="text-xs font-bold uppercase">SUBMITTER_NOTES:</h3>
								</div>
								<div class="p-4 bg-yellow-50">
									<p class="text-base leading-relaxed">{submissionData.notes}</p>
								</div>
							</div>
						{/if}

						{#if !submissionData.description && !submissionData.notes}
							<div class="flex items-center justify-center py-20 border-4 border-dashed border-black">
								<p class="text-lg font-bold uppercase opacity-30">NO_DATA_AVAILABLE</p>
							</div>
						{/if}
					</div>

				{:else if activeTab === 'json'}
					<div class="h-full bg-black p-4">
						<pre class="text-xs text-green-400 font-mono">{formatJSON(submissionData)}</pre>
					</div>
				{/if}
			</div>
		</div>

		<!-- RIGHT: SUBMITTER (30%) -->
		<div class="flex w-[30%] flex-col bg-black text-white overflow-y-auto">
			<div class="p-4 space-y-4">
				<!-- SUBMITTER BLOCK -->
				<div class="border-4 border-white bg-black">
					<div class="border-b-4 border-white bg-white px-4 py-2">
						<h3 class="text-xs font-bold uppercase text-black">SUBMITTER_INFO:</h3>
					</div>

					<div class="p-4">
						<div class="mb-4 flex items-center gap-3">
							{#if data.submitter.avatar_url}
								<img
									src={data.submitter.avatar_url}
									alt={data.submitter.name}
									class="h-16 w-16 border-2 border-white"
								/>
							{:else}
								<div class="flex h-16 w-16 items-center justify-center border-2 border-white bg-white">
									<User class="h-8 w-8 text-black" weight="bold" />
								</div>
							{/if}
							<div class="flex-1">
								<h4 class="font-bold uppercase text-sm">{data.submitter.name}</h4>
								<p class="text-xs font-mono opacity-70">{data.submitter.email}</p>
							</div>
						</div>

						<div class="mb-4">
							<span class="border-2 border-white px-2 py-1 text-xs font-bold uppercase">
								ROLE: {data.submitter.role || 'user'}
							</span>
						</div>

						{#if data.submitter.username || data.submitter.twitter}
							<div class="space-y-2 border-t-2 border-white pt-4">
								{#if data.submitter.username}
									<a
										href="https://github.com/{data.submitter.username}"
										target="_blank"
										rel="noopener noreferrer"
										class="block border-2 border-white bg-white px-3 py-2 text-center text-xs font-bold uppercase text-black hover:bg-black hover:text-white transition-colors"
									>
										GITHUB: @{data.submitter.username}
									</a>
								{/if}
								{#if data.submitter.twitter}
									<a
										href="https://twitter.com/{data.submitter.twitter}"
										target="_blank"
										rel="noopener noreferrer"
										class="block border-2 border-white bg-white px-3 py-2 text-center text-xs font-bold uppercase text-black hover:bg-black hover:text-white transition-colors"
									>
										TWITTER: @{data.submitter.twitter}
									</a>
								{/if}
							</div>
						{/if}
					</div>
				</div>

				<!-- META DATA -->
				<div class="border-4 border-white bg-black p-4">
					<div class="space-y-3">
						<div class="border-b-2 border-white pb-2">
							<p class="text-xs font-bold uppercase opacity-50">TYPE:</p>
							<p class="text-lg font-bold uppercase">{data.item.type}</p>
						</div>
						<div>
							<p class="text-xs font-bold uppercase opacity-50">SUBMITTED:</p>
							<p class="text-sm font-mono">{formatRelativeDate(data.item.submitted_at)}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
