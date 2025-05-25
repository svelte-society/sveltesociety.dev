<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { z } from 'zod'
	import Form from '$lib/ui/form/Form.svelte'
	import Input from '$lib/ui/form/Input.svelte'
	import Button from '$lib/ui/Button.svelte'
	import { formatRelativeDate } from '$lib/utils/date'
	import { enhance } from '$app/forms'

	let { data, form: actionForm } = $props()

	let deletingId = $state('')

	// Schema for YouTube video import
	const youtubeSchema = z.object({
		videoId: z.string().min(1, 'Video ID or URL is required')
	})
	
	// Schema for GitHub repository import
	const githubSchema = z.object({
		repository: z.string().min(1, 'Repository is required').regex(/^[a-zA-Z0-9-_.]+\/[a-zA-Z0-9-_.]+$/, 'Must be in format: owner/repo')
	})

	// Initialize superForm for YouTube import
	const youtubeFormInstance = superForm(data.youtubeForm || { videoId: '' }, {
		validators: zodClient(youtubeSchema),
		resetForm: true
	})

	const { form: youtubeForm, submitting: submittingYouTube } = youtubeFormInstance
	
	// Initialize superForm for GitHub import
	const githubFormInstance = superForm(data.githubForm || { repository: '' }, {
		validators: zodClient(githubSchema),
		resetForm: true
	})
	
	const { form: githubForm, submitting: submittingGitHub } = githubFormInstance
</script>

<div class="space-y-8">
	<div>
		<h1 class="text-2xl font-bold">External Content Management</h1>
		<p class="mt-2 text-gray-600">
			Import and manage content from external sources like Guild events and YouTube videos.
		</p>
	</div>

	{#if actionForm?.error}
		<div class="rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
			{actionForm.error}
		</div>
	{/if}

	{#if actionForm?.success}
		<div class="rounded border border-green-200 bg-green-50 px-4 py-3 text-green-700">
			<p class="font-semibold">Sync completed successfully!</p>
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

	<!-- YouTube Import -->
	<section>
		<h2 class="mb-4 text-xl font-semibold">Import YouTube Video</h2>
		<div class="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
			<Form form={youtubeFormInstance} action="?/importYouTubeVideo">
				<Input
					name="videoId"
					label="Video ID or URL"
					placeholder="dQw4w9WgXcQ or https://youtube.com/watch?v=dQw4w9WgXcQ"
					description="The video ID from the YouTube URL (after v=)"
				/>
				<Button type="submit" primary small disabled={$submittingYouTube}>
					{$submittingYouTube ? 'Importing...' : 'Import Video'}
				</Button>
			</Form>
		</div>

		<div class="mt-4 rounded-lg bg-yellow-50 p-4">
			<p class="text-sm text-yellow-800">
				<strong>Note:</strong> YouTube imports require a valid API key to be set in the
				<code class="rounded bg-yellow-100 px-1 py-0.5">YOUTUBE_API_KEY</code> environment variable.
			</p>
		</div>
	</section>

	<!-- GitHub Import -->
	<section>
		<h2 class="mb-4 text-xl font-semibold">Import GitHub Repository</h2>
		<div class="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
			<Form form={githubFormInstance} action="?/importGitHubRepository">
				<Input
					name="repository"
					label="Repository"
					placeholder="sveltejs/svelte or username/repo-name"
					description="Enter the GitHub repository in format: owner/repo"
				/>
				<Button type="submit" primary small disabled={$submittingGitHub}>
					{$submittingGitHub ? 'Importing...' : 'Import Repository'}
				</Button>
			</Form>
		</div>

		<div class="mt-4 rounded-lg bg-blue-50 p-4">
			<p class="text-sm text-blue-800">
				<strong>Note:</strong> For better rate limits, set a GitHub token in the
				<code class="rounded bg-blue-100 px-1 py-0.5">GITHUB_TOKEN</code> environment variable.
				Public repositories can be imported without a token.
			</p>
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
												class="text-red-600 hover:underline text-sm"
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
