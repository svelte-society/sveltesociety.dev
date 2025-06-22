<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client'
	import { zod4 } from 'sveltekit-superforms/adapters'
	import { z } from 'zod/v4'
	import Form from '$lib/ui/form/Form.svelte'
	import Input from '$lib/ui/form/Input.svelte'
	import Button from '$lib/ui/Button.svelte'
	import { formatRelativeDate } from '$lib/utils/date'
	import { enhance } from '$app/forms'

	let { data, form: actionForm } = $props()

	let deletingId = $state('')

	// Unified schema for importing content
	const importSchema = z.object({
		url: z
			.string()
			.min(1, 'URL is required')
			.refine((val) => {
				// Check if it's a YouTube URL
				const youtubePattern =
					/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
				// Check if it's a GitHub URL
				const githubPattern = /^https?:\/\/github\.com\/([a-zA-Z0-9-_.]+)\/([a-zA-Z0-9-_.]+)/
				// Check if it's a YouTube video ID
				const videoIdPattern = /^[a-zA-Z0-9_-]{11}$/
				// Check if it's a GitHub owner/repo format
				const repoPattern = /^[a-zA-Z0-9-_.]+\/[a-zA-Z0-9-_.]+$/

				return (
					youtubePattern.test(val) ||
					githubPattern.test(val) ||
					videoIdPattern.test(val) ||
					repoPattern.test(val)
				)
			}, 'Must be a YouTube URL, GitHub URL, YouTube video ID, or GitHub owner/repo format')
	})

	// Initialize unified import form
	const importFormInstance = superForm(data.importForm || { url: '' }, {
		validators: zod4(importSchema),
		resetForm: true
	})

	const { form: importForm, submitting } = importFormInstance

	// Helper to detect content type from URL
	function detectContentType(url: string): 'youtube' | 'github' | null {
		const youtubePattern =
			/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
		const videoIdPattern = /^[a-zA-Z0-9_-]{11}$/
		const githubPattern = /^https?:\/\/github\.com\/([a-zA-Z0-9-_.]+)\/([a-zA-Z0-9-_.]+)/
		const repoPattern = /^[a-zA-Z0-9-_.]+\/[a-zA-Z0-9-_.]+$/

		if (youtubePattern.test(url) || videoIdPattern.test(url)) {
			return 'youtube'
		}
		if (githubPattern.test(url) || repoPattern.test(url)) {
			return 'github'
		}
		return null
	}

	// Dynamic placeholder based on input
	const placeholder = $derived(() => {
		const type = detectContentType($importForm.url)
		if (type === 'youtube') {
			return 'Detected: YouTube video'
		} else if (type === 'github') {
			return 'Detected: GitHub repository'
		}
		return ''
	})
</script>

<div class="space-y-8">
	<div>
		<h1 class="text-2xl font-bold">External Content Management</h1>
		<p class="mt-2 text-gray-600">
			Import and manage content from external sources like YouTube videos and GitHub repositories.
		</p>
	</div>

	{#if actionForm?.error}
		<div class="rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
			{actionForm.error}
		</div>
	{/if}

	{#if actionForm?.success}
		<div class="rounded border border-green-200 bg-green-50 px-4 py-3 text-green-700">
			<p class="font-semibold">Import completed successfully!</p>
			{#if actionForm.stats}
				<p class="mt-1 text-sm">
					Created: {actionForm.stats.created} | Updated: {actionForm.stats.updated} | Deleted: {actionForm
						.stats.deleted}
				</p>
			{/if}
		</div>
	{/if}

	<!-- External Sources -->
	<section>
		<h2 class="mb-4 text-xl font-semibold">External Sources</h2>
		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each data.sources as source}
				<div class="rounded-lg border border-gray-200 bg-white p-6">
					<h3 class="text-lg font-semibold">{source.name}</h3>
					<p class="mt-1 text-sm text-gray-600">{source.count} items</p>
					{#if source.lastSync}
						<p class="mt-2 text-xs text-gray-500">
							Last sync: {formatRelativeDate(source.lastSync)}
						</p>
					{/if}
				</div>
			{/each}
		</div>
	</section>

	<!-- Import Form -->
	<section>
		<h2 class="mb-4 text-xl font-semibold">Import Content</h2>
		<div class="max-w-2xl">
			<div class="rounded-lg border border-gray-200 bg-white p-6">
				<h3 class="mb-4 text-lg font-semibold">Import from External Source</h3>
				<Form form={importFormInstance} action="?/import">
					<div class="space-y-4">
						<Input
							name="url"
							label="Content URL"
							placeholder="https://youtube.com/watch?v=... or https://github.com/owner/repo"
							description={placeholder() || 'Paste a YouTube video URL or GitHub repository URL'}
						/>

						{#if detectContentType($importForm.url)}
							<div class="rounded-lg bg-gray-50 p-3">
								<p class="text-sm font-medium text-gray-700">
									{#if detectContentType($importForm.url) === 'youtube'}
										<span class="flex items-center gap-2">
											<svg class="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
												<path
													d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
												/>
											</svg>
											YouTube Video Detected
										</span>
									{:else if detectContentType($importForm.url) === 'github'}
										<span class="flex items-center gap-2">
											<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
												<path
													d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
												/>
											</svg>
											GitHub Repository Detected
										</span>
									{/if}
								</p>
							</div>
						{/if}

						<Button
							type="submit"
							primary
							disabled={$submitting || !detectContentType($importForm.url)}
						>
							{$submitting ? 'Importing...' : 'Import Content'}
						</Button>
					</div>
				</Form>

				<div class="mt-6 space-y-3">
					<div class="rounded-lg bg-yellow-50 p-3">
						<p class="text-xs text-yellow-800">
							<strong>YouTube:</strong> Requires
							<code class="rounded bg-yellow-100 px-1 py-0.5">YOUTUBE_API_KEY</code> environment variable
						</p>
					</div>
					<div class="rounded-lg bg-blue-50 p-3">
						<p class="text-xs text-blue-800">
							<strong>GitHub:</strong> Set
							<code class="rounded bg-blue-100 px-1 py-0.5">GITHUB_TOKEN</code> for better rate limits
						</p>
					</div>
					<div class="rounded-lg bg-gray-50 p-3">
						<p class="text-xs text-gray-700">
							<strong>Supported formats:</strong>
							<br />• YouTube: Full URLs, short URLs (youtu.be), or video IDs
							<br />• GitHub: Full URLs or owner/repo format
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Recent Imports -->
	{#if data.recentImports.length > 0}
		<section>
			<h2 class="mb-4 text-xl font-semibold">Recent Imports</h2>
			<div class="overflow-hidden rounded-lg bg-white shadow-sm">
				<table class="w-full text-left text-sm">
					<thead class="bg-gray-50 text-xs text-gray-700 uppercase">
						<tr>
							<th scope="col" class="px-4 py-3">Title</th>
							<th scope="col" class="px-4 py-3">Type</th>
							<th scope="col" class="px-4 py-3">Source</th>
							<th scope="col" class="px-4 py-3">Imported</th>
							<th scope="col" class="px-4 py-3">Actions</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200">
						{#each data.recentImports as item}
							<tr class="hover:bg-gray-50">
								<td class="px-4 py-3 font-medium">{item.title}</td>
								<td class="px-4 py-3">{item.type}</td>
								<td class="px-4 py-3">{item.metadata?.externalSource?.source || 'Unknown'}</td>
								<td class="px-4 py-3">{formatRelativeDate(item.created_at)}</td>
								<td class="px-4 py-3">
									<div class="flex items-center gap-3">
										<a href="/admin/content/{item.id}" class="text-svelte-500 hover:underline">
											Edit
										</a>
										<form
											method="POST"
											action="?/deleteContent"
											use:enhance={() => {
												if (!confirm(`Are you sure you want to delete "${item.title}"?`)) {
													return ({ cancel }) => cancel()
												}
												deletingId = item.id
												return async ({ update }) => {
													await update()
													deletingId = ''
												}
											}}
										>
											<input type="hidden" name="contentId" value={item.id} />
											<button
												type="submit"
												class="text-sm text-red-600 hover:underline"
												disabled={deletingId === item.id}
											>
												{deletingId === item.id ? 'Deleting...' : 'Delete'}
											</button>
										</form>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</section>
	{/if}
</div>

<style>
	code {
		font-family: 'Courier New', monospace;
	}
</style>
