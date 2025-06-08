<script lang="ts">
	import { enhance } from '$app/forms'
	import Badge from '$lib/ui/admin/Badge.svelte'
	import Button from '$lib/ui/Button.svelte'
	import TypeIcon from '$lib/ui/TypeIcon.svelte'
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

	const submissionData = JSON.parse(data.item.data)
	let showRawJSON = $state(false)

	// Extract video ID for YouTube embeds
	const videoId =
		submissionData.type === 'video' && submissionData.url
			? submissionData.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1]
			: null
</script>

<div class="container mx-auto px-2 py-4">
	<div class="mb-6 flex items-start justify-between">
		<div class="flex items-center space-x-3">
			<TypeIcon type={data.item.type} size={32} />
			<div>
				<h1 class="text-2xl font-bold text-gray-900">
					{submissionData.title || 'Untitled Submission'}
				</h1>
				<p class="text-sm text-gray-500">ID: {data.item.id}</p>
			</div>
		</div>
		<div class="flex items-center space-x-3">
			{#if data.item.status === 'pending'}
				<form method="POST" action="?/reject" use:enhance class="inline">
					<Button type="submit" small error icon_left="x-circle">Reject</Button>
				</form>
				<form method="POST" action="?/approve" use:enhance class="inline">
					<Button type="submit" small success icon_left="check-circle">Approve</Button>
				</form>
			{/if}
			<Button small secondary href="/admin/moderation" icon_left="arrow-left">Back to Queue</Button>
		</div>
	</div>
	<!-- Status and submission info -->
	<div class="mb-6 grid gap-4 md:grid-cols-3">
		<div class="rounded-lg bg-white p-4 shadow-sm">
			<div class="flex items-center justify-between">
				<span class="text-sm font-medium text-gray-500">Status</span>
				<Badge color={colorMap.get(data.item.status)} text={data.item.status} />
			</div>
		</div>
		<div class="rounded-lg bg-white p-4 shadow-sm">
			<div class="flex items-center justify-between">
				<span class="text-sm font-medium text-gray-500">Type</span>
				<span class="text-sm font-semibold text-gray-900 capitalize">{data.item.type}</span>
			</div>
		</div>
		<div class="rounded-lg bg-white p-4 shadow-sm">
			<div class="flex items-center justify-between">
				<span class="text-sm font-medium text-gray-500">Submitted</span>
				<span class="text-sm text-gray-900">{formatRelativeDate(data.item.submitted_at)}</span>
			</div>
		</div>
	</div>

	<div class="mb-6 grid gap-6 lg:grid-cols-2">
		<!-- Main content -->
		<div class="space-y-6">
			<!-- Basic Information -->
			<div class="rounded-lg bg-white p-6 shadow-sm">
				<h2 class="mb-4 text-lg font-semibold text-gray-900">Content Details</h2>
				<div class="space-y-4">
					{#if submissionData.description}
						<div>
							<h3 class="text-sm font-medium text-gray-700">Description</h3>
							<p class="mt-1 text-sm text-gray-900">{submissionData.description}</p>
						</div>
					{/if}

					{#if submissionData.tags && submissionData.tags.length > 0}
						<div>
							<h3 class="text-sm font-medium text-gray-700">Tags</h3>
							<div class="mt-2 flex flex-wrap gap-2">
								{#each submissionData.tags as tag}
									<span
										class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
									>
										{tag}
									</span>
								{/each}
							</div>
						</div>
					{/if}

					{#if submissionData.notes}
						<div>
							<h3 class="text-sm font-medium text-gray-700">Notes</h3>
							<p class="mt-1 text-sm text-gray-600">{submissionData.notes}</p>
						</div>
					{/if}
				</div>
			</div>

			<!-- Type-specific content -->
			<div class="rounded-lg bg-white p-6 shadow-sm">
				<h2 class="mb-4 text-lg font-semibold text-gray-900">
					{#if data.item.type === 'video'}
						Video Details
					{:else if data.item.type === 'library'}
						Library Details
					{:else if data.item.type === 'recipe'}
						Recipe Content
					{:else if data.item.type === 'link'}
						Link Details
					{:else}
						Content Details
					{/if}
				</h2>

				{#if data.item.type === 'video' && submissionData.url}
					<div class="space-y-3">
						<div>
							<h3 class="text-sm font-medium text-gray-700">YouTube URL</h3>
							<a
								href={submissionData.url}
								target="_blank"
								rel="noopener noreferrer"
								class="mt-1 block text-sm text-blue-600 hover:text-blue-800 hover:underline"
							>
								{submissionData.url}
							</a>
						</div>
						<!-- YouTube embed preview -->
						{#if videoId}
							<div>
								<h3 class="text-sm font-medium text-gray-700">Preview</h3>
								<div class="mt-2 aspect-video max-w-md overflow-hidden rounded-lg">
									<iframe
										src="https://www.youtube.com/embed/{videoId}"
										title="YouTube video player"
										class="h-full w-full"
										allowfullscreen
									></iframe>
								</div>
							</div>
						{/if}
					</div>
				{:else if data.item.type === 'library' && submissionData.github_repo}
					<div class="space-y-3">
						<div>
							<h3 class="text-sm font-medium text-gray-700">GitHub Repository</h3>
							<p class="mt-1 font-mono text-sm text-gray-900">{submissionData.github_repo}</p>
						</div>
						<div>
							<a
								href="https://github.com/{submissionData.github_repo}"
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
							>
								<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
										clip-rule="evenodd"
									/>
								</svg>
								<span>View on GitHub</span>
							</a>
						</div>
					</div>
				{:else if data.item.type === 'recipe' && submissionData.body}
					<div>
						<h3 class="text-sm font-medium text-gray-700">Recipe Content</h3>
						<div class="mt-2 max-h-96 overflow-y-auto rounded-lg bg-gray-50 p-4">
							<pre class="text-sm whitespace-pre-wrap text-gray-900">{submissionData.body}</pre>
						</div>
					</div>
				{:else if data.item.type === 'link' && submissionData.url}
					<div>
						<h3 class="text-sm font-medium text-gray-700">Link URL</h3>
						<a
							href={submissionData.url}
							target="_blank"
							rel="noopener noreferrer"
							class="mt-1 block text-sm text-blue-600 hover:text-blue-800 hover:underline"
						>
							{submissionData.url}
						</a>
					</div>
				{:else}
					<p class="text-sm text-gray-500">No type-specific content available.</p>
				{/if}
			</div>
		</div>
		<!-- Submitter Information -->
		<div class="space-y-6">
			<div class="rounded-lg bg-white p-6 shadow-sm">
				<h2 class="mb-4 text-lg font-semibold text-gray-900">Submitter</h2>
				<div class="flex items-start space-x-4">
					{#if data.submitter.avatar_url}
						<img
							src={data.submitter.avatar_url}
							alt={data.submitter.name}
							class="h-12 w-12 rounded-full"
						/>
					{:else}
						<div
							class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 text-gray-600"
						>
							<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
					{/if}
					<div class="flex-1 space-y-2">
						<div>
							<h3 class="font-medium text-gray-900">{data.submitter.name}</h3>
							<p class="text-sm text-gray-500">{data.submitter.email}</p>
						</div>
						<div class="flex items-center space-x-4">
							<Badge
								color={roleColorMap.get(data.submitter.role || 'user')}
								text={data.submitter.role || 'user'}
							/>
						</div>
						{#if data.submitter.username}
							<div class="flex items-center space-x-3 text-sm">
								<a
									href="https://github.com/{data.submitter.username}"
									target="_blank"
									rel="noopener noreferrer"
									class="flex items-center text-gray-600 hover:text-gray-800"
								>
									<svg class="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
											clip-rule="evenodd"
										/>
									</svg>
									@{data.submitter.username}
								</a>
								{#if data.submitter.twitter}
									<a
										href="https://twitter.com/{data.submitter.twitter}"
										target="_blank"
										rel="noopener noreferrer"
										class="flex items-center text-gray-600 hover:text-gray-800"
									>
										<svg class="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
											<path
												d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
											/>
										</svg>
										@{data.submitter.twitter}
									</a>
								{/if}
							</div>
						{/if}
					</div>
				</div>
			</div>

			<!-- Debug Information -->
			<div class="rounded-lg bg-white p-6 shadow-sm">
				<div class="flex items-center justify-between">
					<h2 class="text-lg font-semibold text-gray-900">Raw Data</h2>
					<Button small secondary onclick={() => (showRawJSON = !showRawJSON)}>
						{showRawJSON ? 'Hide' : 'Show'} JSON
					</Button>
				</div>
				{#if showRawJSON}
					<pre
						class="mt-4 max-h-64 overflow-auto rounded-lg bg-gray-50 p-4 text-xs text-gray-800">{formatJSON(
							submissionData
						)}</pre>
				{/if}
			</div>
		</div>
	</div>
	{#if data.item.status !== 'pending'}
		<div class="rounded-lg bg-gray-50 p-4 text-center">
			<p class="text-sm text-gray-600">
				This submission has already been <span class="font-medium capitalize"
					>{data.item.status}</span
				>.
			</p>
		</div>
	{/if}
</div>
