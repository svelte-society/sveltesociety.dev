<script lang="ts">
	import { page } from '$app/state'
	import Button from '$lib/ui/Button.svelte'
	import Input from '$lib/ui/Input.svelte'
	import TextArea from '$lib/ui/TextArea.svelte'
	import DynamicSelector from '$lib/ui/DynamicSelector.svelte'
	import { debounce } from '$lib/utils/debounce'
	import { submitLibrary, getTags } from '../submit.remote'

	const { description, type, tags, github_repo, notes } = submitLibrary.fields

	let libraryPreview = $state<any>(null)
	let previousGithubRepo = $state<string>('')
	let previewLoading = $state(false)
	let previewError = $state<string | null>(null)

	const fetchGitHubPreview = debounce(async (repo: string) => {
		if (!repo) {
			libraryPreview = null
			return
		}

		previewLoading = true
		previewError = null

		try {
			const response = await fetch(`/api/preview/github?repo=${encodeURIComponent(repo)}`)
			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || 'Failed to fetch preview')
			}

			libraryPreview = data
		} catch (error) {
			previewError = error instanceof Error ? error.message : 'Failed to fetch preview'
			libraryPreview = null
		} finally {
			previewLoading = false
		}
	}, 1000)

	$effect(() => {
		if (github_repo.value()) {
    		const currentRepo = github_repo.value()
    		if (currentRepo !== previousGithubRepo) {
        		previousGithubRepo = currentRepo
        		fetchGitHubPreview(currentRepo)
    		}
		}
	})
</script>

<form {...submitLibrary} class="flex flex-col gap-4">
	<input {...type.as('hidden', page.params.type!)} />

	<TextArea
		{...description.as('text')}
		placeholder="A UI library with clean minimalist components"
		label="Description"
		description="Enter a short description"
		issues={description.issues()}
		data-testid="description-textarea"
	/>

	<Input
		{...github_repo.as('text')}
		placeholder="username/repository or username/repository/packages/name"
		label="GitHub Repository"
		description="GitHub repository or monorepo package path (required for libraries)"
		issues={github_repo.issues()}
		data-testid="library-github-input"
	/>

	{#if previewLoading}
		<div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
			<p class="text-sm text-gray-600">Loading preview...</p>
		</div>
	{:else if previewError}
		<div class="rounded-lg border border-red-200 bg-red-50 p-4">
			<p class="text-sm text-red-600">{previewError}</p>
		</div>
	{:else if libraryPreview?.exists}
		<div class="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
			<p class="text-sm font-medium text-yellow-800">This repository has already been submitted</p>
			<p class="mt-1 text-sm text-yellow-700">
				{#if libraryPreview.content.status === 'published'}
					View it here: <a href={libraryPreview.content.url} class="underline"
						>{libraryPreview.content.title}</a
					>
				{:else if libraryPreview.content.status === 'draft' || libraryPreview.content.status === 'pending_review'}
					"{libraryPreview.content.title}" is currently awaiting review.
				{:else}
					"{libraryPreview.content.title}" has been submitted.
				{/if}
			</p>
		</div>
	{:else if libraryPreview?.preview}
		<div class="rounded-lg border border-gray-200 bg-white p-4">
			<h3 class="mb-2 text-sm font-medium text-gray-900">Preview</h3>
			<div class="flex gap-4">
				<img
					src={libraryPreview.preview.avatarUrl}
					alt={libraryPreview.preview.owner}
					class="h-16 w-16 rounded"
				/>
				<div class="flex-1">
					<p class="font-medium text-gray-900">{libraryPreview.preview.title}</p>
					<p class="mt-1 text-sm text-gray-600">by {libraryPreview.preview.owner}</p>
					<p class="mt-1 text-sm text-gray-500">{libraryPreview.preview.description}</p>
					<div class="mt-2 flex gap-4 text-xs text-gray-500">
						{#if libraryPreview.preview.language}
							<span>{libraryPreview.preview.language}</span>
						{/if}
						<span>⭐ {libraryPreview.preview.stars}</span>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<DynamicSelector
		name="Tags"
		label="Tags"
		description="Select relevant tags for your submission"
		field={tags}
		options={await getTags()}
		data-testid="tags-selector"
	/>

	<TextArea
		{...notes.as('text')}
		placeholder="Any additional notes or context..."
		label="Notes (optional)"
		description="Any additional information for the moderators about your submission"
		rows={3}
		data-testid="library-notes-input"
	/>

	<Button data-testid="submit-button">Submit Library</Button>
</form>
