<script lang="ts">
	import { page } from '$app/state'
	import Button from '$lib/ui/Button.svelte'
	import Input from '$lib/ui/Input.svelte'
	import TextArea from '$lib/ui/TextArea.svelte'
	import DynamicSelector from '$lib/ui/DynamicSelector.svelte'
	import { debounce } from '$lib/utils/debounce'
	import { submitVideo, getTags } from '../submit.remote'

	const { description, type, tags, url, notes } = submitVideo.fields

	let videoPreview = $state<any>(null)
	let previousVideoUrl = $state<string>('')
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

	$effect(() => {
		if (url.value()) {
			const currentUrl = url.value() || ''
			if (currentUrl !== previousVideoUrl) {
				previousVideoUrl = currentUrl
				fetchYouTubePreview(currentUrl)
			}
		}
	})
</script>

<form {...submitVideo} class="flex flex-col gap-4">
	<input {...type.as('hidden', page.params.type!)} />

	<TextArea
		{...description.as('text')}
		placeholder="A brief description of this video..."
		label="Description"
		description="Enter a short description"
		issues={description.issues()}
		data-testid="video-description-input"
	/>

	<Input
		{...url.as('url')}
		placeholder="https://youtube.com/watch?v=..."
		label="Video URL"
		description="Enter the YouTube URL for the video"
		issues={url.issues()}
		data-testid="video-url-input"
	/>

	{#if previewLoading}
		<div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
			<p class="text-sm text-gray-600">Loading preview...</p>
		</div>
	{:else if previewError}
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
		data-testid="video-notes-input"
	/>

	<Button data-testid="submit-button">Submit Video</Button>
</form>
