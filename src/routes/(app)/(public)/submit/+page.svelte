<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client'
	import Form from '$lib/ui/form/Form.svelte'
	import Input from '$lib/ui/form/Input.svelte'
	import MarkdownEditor from '$lib/ui/form/MarkdownEditor.svelte'
	import SuperDebug from 'sveltekit-superforms'
	import { options } from './schema'
	import Textarea from '$lib/ui/form/Textarea.svelte'
	import Button from '$lib/ui/Button.svelte'
	import DynamicSelector from '$lib/ui/form/DynamicSelector.svelte'
	import CategorySelector from '$lib/ui/form/CategorySelector.svelte'
	import { debounce } from '$lib/utils/debounce'

	let { data } = $props()

	const form = superForm(data.form, {
		delayMs: 500,
		timeoutMs: 8000,
		dataType: 'json'
	})

	const { form: formData, submitting } = form

	let videoPreview = $state<any>(null)
	let libraryPreview = $state<any>(null)
	let previewLoading = $state(false)
	let previewError = $state<string | null>(null)

	const fetchYouTubePreview = debounce(async (url: string) => {
		if (!url) {
			videoPreview = null
			return
		}

		previewLoading = true
		previewError = null

		try {
			const response = await fetch(`/api/preview/youtube?url=${encodeURIComponent(url)}`)
			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || 'Failed to fetch preview')
			}

			videoPreview = data
		} catch (error) {
			previewError = error instanceof Error ? error.message : 'Failed to fetch preview'
			videoPreview = null
		} finally {
			previewLoading = false
		}
	}, 1000)

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
		if ($formData.type === 'video' && 'url' in $formData) {
			fetchYouTubePreview($formData.url)
		}
	})

	$effect(() => {
		if ($formData.type === 'library' && 'github_repo' in $formData) {
			fetchGitHubPreview($formData.github_repo)
		}
	})
</script>

<div class="mx-auto grid max-w-3xl gap-6">
	<h1 class="mb-6 text-2xl font-bold">Submit a new resource</h1>
	<p class="text-sm">
		Before making a submission, please ensure that the resource you are submitting is not already
		listed on the site. Use the search bar to check if the resource is already listed.
	</p>
	<Form {form} action="?/submit">
		<CategorySelector
			name="type"
			label="Type"
			description="Select the type of content you are submitting"
			{options}
		/>

		{#if $formData.type === 'recipe'}
			<Input
				placeholder="This is a really cool recipe"
				name="title"
				label="Title"
				description="Enter the title of your recipe"
			/>
		{/if}

		<Textarea
			placeholder="Enter a description..."
			name="description"
			label="Description"
			description="Enter the description of your content submission. This should be a short and succinct version of the body that gives the reader an idea of what the content is about. Not more than a few sentences."
		/>

		{#if $formData.type === 'recipe'}
			<MarkdownEditor
				placeholder="Enter the recipe content, instructions, and code examples..."
				name="body"
				label="Recipe Content"
				description="Provide the full recipe content including instructions and code. Use markdown to format your content."
			/>
		{:else if $formData.type === 'video'}
			<Input
				placeholder="https://youtube.com/watch?v=..."
				name="url"
				label="Video URL"
				description="Enter the YouTube URL for the video"
			/>

			{#if previewLoading && $formData.type === 'video'}
				<div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
					<p class="text-sm text-gray-600">Loading preview...</p>
				</div>
			{:else if previewError && $formData.type === 'video'}
				<div class="rounded-lg border border-red-200 bg-red-50 p-4">
					<p class="text-sm text-red-600">{previewError}</p>
				</div>
			{:else if videoPreview?.exists}
				<div class="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
					<p class="text-sm font-medium text-yellow-800">This video has already been submitted</p>
					<p class="mt-1 text-sm text-yellow-700">
						{#if videoPreview.content.status === 'published'}
							View it here: <a href={videoPreview.content.url} class="underline"
								>{videoPreview.content.title}</a
							>
						{:else if videoPreview.content.status === 'draft' || videoPreview.content.status === 'pending_review'}
							"{videoPreview.content.title}" is currently awaiting review.
						{:else}
							"{videoPreview.content.title}" has been submitted.
						{/if}
					</p>
				</div>
			{:else if videoPreview?.preview}
				<div class="rounded-lg border border-gray-200 bg-white p-4">
					<h3 class="mb-2 text-sm font-medium text-gray-900">Preview</h3>
					<div class="flex gap-4">
						<img
							src={videoPreview.preview.thumbnail}
							alt={videoPreview.preview.title}
							class="h-20 w-32 rounded object-cover"
						/>
						<div class="flex-1">
							<p class="font-medium text-gray-900">{videoPreview.preview.title}</p>
							<p class="mt-1 text-sm text-gray-600">{videoPreview.preview.channelTitle}</p>
							<p class="mt-1 line-clamp-2 text-xs text-gray-500">
								{videoPreview.preview.description}
							</p>
						</div>
					</div>
				</div>
			{/if}
		{:else if $formData.type === 'library'}
			<Input
				placeholder="username/repository"
				name="github_repo"
				label="GitHub Repository"
				description="GitHub repository (required for libraries)"
			/>

			{#if previewLoading && $formData.type === 'library'}
				<div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
					<p class="text-sm text-gray-600">Loading preview...</p>
				</div>
			{:else if previewError && $formData.type === 'library'}
				<div class="rounded-lg border border-red-200 bg-red-50 p-4">
					<p class="text-sm text-red-600">{previewError}</p>
				</div>
			{:else if libraryPreview?.exists}
				<div class="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
					<p class="text-sm font-medium text-yellow-800">
						This repository has already been submitted
					</p>
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
		{/if}

		<DynamicSelector
			name="tags"
			label="Tags"
			description="Select relevant tags for your submission"
			options={data.tags.map((tag) => ({
				label: tag.name,
				value: tag.id
			}))}
		/>

		<Textarea
			placeholder="Any additional notes or context..."
			name="notes"
			label="Notes (optional)"
			description="Any additional information about your submission"
		/>

		<Button
			type="submit"
			primary
			disabled={$submitting || videoPreview?.exists || libraryPreview?.exists}
		>
			{$submitting ? 'Submitting...' : 'Submit'}
		</Button>

		{#if videoPreview?.exists || libraryPreview?.exists}
			<p class="text-center text-sm text-yellow-600">
				This content has already been submitted. Please check the existing content or submit
				something else.
			</p>
		{/if}
	</Form>
</div>

<SuperDebug data={$formData} />
